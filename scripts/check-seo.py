"""Check public-page SEO invariants with Python's standard library.

Run from any directory: python scripts/check-seo.py
No network, credentials or site mutations are required.
"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import struct
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://pos.kr/'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.text = []
        self.schemas = []
        self.script = None
        self.skip = 0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.script = []

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.schemas.append(json.loads(''.join(self.script)))
            self.script = None
        if tag in ('script', 'style'):
            self.skip -= 1

    def handle_data(self, data):
        if self.script is not None:
            self.script.append(data)
        if not self.skip:
            self.text.append(data)


def compact(text):
    return re.sub(r'\s+', '', text)


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    files = [ROOT / name for name in (
        'index.html', 'hamba-pos.html', 'price.html', 'proposal.html',
        'guide.html', 'terms.html', 'privacy.html',
    )] + sorted((ROOT / 'guide').glob('*.html'))
    pages = {}
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    dates = {entry.find('s:loc', ns).text: entry.find('s:lastmod', ns).text
             for entry in sitemap.getroot()}
    for file in files:
        rel = file.relative_to(ROOT).as_posix()
        url = BASE + ('' if rel == 'index.html' else rel.removesuffix('.html'))
        page = Page(file.read_text(encoding='utf-8'))
        pages[rel] = page
        tags = page.tags
        ids = [a['id'] for _, a in tags if 'id' in a]
        check(not [i for i, n in Counter(ids).items() if n > 1], f'{rel}: duplicate IDs')
        check(sum(t == 'h1' for t, _ in tags) == 1, f'{rel}: expected one H1')
        canonicals = [a.get('href') for t, a in tags if t == 'link' and a.get('rel') == 'canonical']
        check(canonicals == [url], f'{rel}: canonical mismatch')
        check(url in dates, f'{rel}: missing from sitemap')
        check(any(t == 'meta' and a.get('name') == 'description' and a.get('content') for t, a in tags), f'{rel}: missing description')
        check(any(t == 'link' and a.get('rel') == 'icon' and a.get('href') == '/favicon.png' for t, a in tags), f'{rel}: incorrect icon')
        check(not any(t == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for t, a in tags), f'{rel}: unexpected noindex')
        for tag, attrs in tags:
            if tag == 'a' and attrs.get('href', '').startswith('#') and attrs['href'] != '#':
                check(attrs['href'][1:] in ids, f'{rel}: broken anchor {attrs["href"]}')
            if tag == 'a' and attrs.get('href', '').startswith('/guide'):
                dest = ROOT / (attrs['href'].split('#')[0].lstrip('/') + '.html')
                check(dest.is_file(), f'{rel}: broken guide link')
            if tag == 'img':
                check('alt' in attrs, f'{rel}: missing image alternative text')
                check(attrs.get('width') and attrs.get('height'), f'{rel}: missing image dimensions')
        visible = compact(''.join(page.text))
        for schema in page.schemas:
            graph = schema.get('@graph', [schema])
            for node in graph:
                if node.get('@type') == 'FAQPage':
                    for question in node['mainEntity']:
                        check(compact(question['acceptedAnswer']['text']) in visible, f'{rel}: FAQ schema differs from HTML')
                if node.get('@type') in ('Article', 'WebPage', 'CollectionPage') and 'dateModified' in node:
                    check(node['dateModified'] == dates[url], f'{rel}: sitemap date differs from schema')
                if node.get('@type') == 'Organization' and 'brand' in node:
                    check(any(n.get('@id') == node['brand']['@id'] and n.get('@type') == 'Brand' for n in graph), f'{rel}: invalid brand relation')
        print(f'PASS {rel}')

    price = next(n for n in pages['price.html'].schemas[0]['@graph'] if n['@type'] == 'SoftwareApplication')
    super_price = int(next(o['price'] for o in price['offers'] if o['name'] == 'Super'))
    display_price = f'{super_price / 10000:g}만원'
    for file in ['index.html', 'hamba-pos.html', 'price.html', 'guide/compare-systems.html', 'docs/og-price-source.html']:
        text = (ROOT / file).read_text(encoding='utf-8')
        check(display_price in text, f'{file}: Super price mismatch')
        check('2.9만원' not in text, f'{file}: outdated Super price')
    check(f'| Super | {super_price:,}원 |' in (ROOT / 'llms.txt').read_text(encoding='utf-8'), 'llms.txt: price mismatch')
    index = pages['index.html']
    labels = {a['for'] for t, a in index.tags if t == 'label' and 'for' in a}
    for tag, attrs in index.tags:
        if tag in ('input', 'select', 'textarea') and attrs.get('type') != 'hidden':
            check(attrs.get('id') in labels or attrs.get('aria-label'), 'Unlabeled form control')
        if 'faq-content' in attrs.get('class', '').split():
            check('hidden' not in attrs.get('class', '').split(), 'FAQ unavailable without JavaScript')
    png = (ROOT / 'favicon.png').read_bytes()
    check(png[:8] == b'\x89PNG\r\n\x1a\n', 'Favicon is not PNG')
    width, height = struct.unpack('>II', png[16:24])
    check(width == height and width >= 48, 'Favicon must be square and at least 48px')
    print('PASS price consistency, FAQ text, form labels and favicon')


if __name__ == '__main__':
    main()
