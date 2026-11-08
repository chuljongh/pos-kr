"""Check public-page SEO invariants with Python's standard library.

Run from any directory:
  python scripts/check-seo.py
  python scripts/check-seo.py --check-images  # optional Pillow EXIF/size verification
No network, credentials or site mutations are required.
"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import struct
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://pos.kr/'

CASE_FORBIDDEN_TERMS = (
    '한전청운제',
    '청운제',
    '총재',
    '2026-09-31',
    '09/30',
    '오픈일',
    '확인 대기',
    '사용자 제공',
    'TODO',
    '100% 보장',
    '1일 청구',
    '즉시 청구',
)

PHONE_RE = re.compile(r'01[016789]-?\d{3,4}-?\d{4}')
OFFICIAL_PHONE = '010-5415-4415'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.text = []
        self.schemas = []
        self.script = None
        self.skip = 0
        self.guide_list_ul_depth = 0
        self.guide_list_hrefs = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if self.guide_list_ul_depth > 0:
            if tag == 'ul':
                self.guide_list_ul_depth += 1
            elif tag == 'a' and attrs.get('href'):
                self.guide_list_hrefs.append(attrs['href'])
        elif tag == 'ul' and 'guide-list' in attrs.get('class', '').split():
            self.guide_list_ul_depth = 1
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.script = []

    def handle_endtag(self, tag):
        if tag == 'ul' and self.guide_list_ul_depth > 0:
            self.guide_list_ul_depth -= 1
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


def verify_clean_image(path: Path, expected_size=None, image_cls=None):
    check(path.is_file(), f'Missing image file: {path.relative_to(ROOT).as_posix()}')
    raw_bytes = path.read_bytes()
    check(b'Exif\x00\x00' not in raw_bytes, f'{path.name}: unexpected EXIF header bytes')
    if image_cls is not None:
        with image_cls.open(path) as img:
            exif = img.getexif()
            check(len(exif) == 0, f'{path.name}: unexpected EXIF tags {list(exif.keys())}')
            if expected_size is not None:
                check(img.size == expected_size, f'{path.name}: size {img.size} != expected {expected_size}')


def collect_meaningful_case_text(page: Page) -> str:
    parts = [''.join(page.text)]
    for tag, attrs in page.tags:
        if tag == 'meta' and (
            attrs.get('name') in ('description', 'keywords')
            or attrs.get('property') in ('og:title', 'og:description')
        ):
            parts.append(attrs.get('content', ''))
        elif tag == 'img' and attrs.get('alt'):
            parts.append(attrs['alt'])
    for schema in page.schemas:
        for node in schema.get('@graph', [schema]):
            for key in ('headline', 'description', 'name'):
                if isinstance(node.get(key), str):
                    parts.append(node[key])
    return '\n'.join(parts)


def main():
    args = sys.argv[1:]
    unknown_args = [a for a in args if a != '--check-images']
    check(not unknown_args, f'Unknown arguments: {unknown_args}')
    check_images = '--check-images' in args
    image_cls = None
    if check_images:
        try:
            from PIL import Image as pil_image
        except ImportError as exc:
            raise RuntimeError('--check-images requires Pillow (PIL) to be installed') from exc
        image_cls = pil_image

    files = (
        [ROOT / name for name in (
            'index.html', 'hamba-pos.html', 'price.html', 'proposal.html',
            'guide.html', 'cases.html', 'terms.html', 'privacy.html',
        )]
        + sorted((ROOT / 'guide').glob('*.html'))
        + sorted((ROOT / 'cases').glob('*.html'))
    )
    pages = {}
    raw_texts = {}
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    dates = {entry.find('s:loc', ns).text: entry.find('s:lastmod', ns).text
             for entry in sitemap.getroot()}

    for file in files:
        rel = file.relative_to(ROOT).as_posix()
        url = BASE + ('' if rel == 'index.html' else rel.removesuffix('.html'))
        raw_text = file.read_text(encoding='utf-8')
        raw_texts[rel] = raw_text
        page = Page(raw_text)
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
            if tag == 'a':
                href = attrs.get('href', '')
                if href.startswith('#') and href != '#':
                    check(href[1:] in ids, f'{rel}: broken anchor {href}')
                if href.startswith('/') and not href.startswith('//'):
                    path_part = href.split('#')[0].split('?')[0]
                    check(not path_part.endswith('.html'), f'{rel}: internal link uses .html ({href})')
                if href.startswith('/guide'):
                    dest = ROOT / (href.split('#')[0].lstrip('/') + '.html')
                    check(dest.is_file(), f'{rel}: broken guide link {href}')
                if href.startswith('/cases'):
                    dest = ROOT / (href.split('#')[0].lstrip('/') + '.html')
                    check(dest.is_file(), f'{rel}: broken cases link {href}')
            if tag == 'img':
                check('alt' in attrs, f'{rel}: missing image alternative text')
                check(attrs.get('width') and attrs.get('height'), f'{rel}: missing image dimensions')
                src = attrs.get('src', '')
                if src.startswith('/images/cases/'):
                    img_path = ROOT / src.lstrip('/')
                    verify_clean_image(img_path, (int(attrs['width']), int(attrs['height'])), image_cls=image_cls)

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

    # Verify case pages specific SEO, schema, video, privacy and content guardrails
    index_videos = {
        n['@id']: n
        for n in pages['index.html'].schemas[0]['@graph']
        if n.get('@type') == 'VideoObject'
    }
    case_rels = ['cases.html', 'cases/cheongunjae.html', 'cases/kcci-gwangju.html', 'cases/durimiga.html']
    for rel in case_rels:
        page = pages[rel]
        raw_text = raw_texts[rel]
        meaningful_text = collect_meaningful_case_text(page)
        for term in CASE_FORBIDDEN_TERMS:
            check(term not in meaningful_text, f'{rel}: forbidden term "{term}" found')
        phones = set(PHONE_RE.findall(raw_text))
        check(phones <= {OFFICIAL_PHONE}, f'{rel}: unexpected phone number(s) {phones - {OFFICIAL_PHONE}}')
        check(
            any(t == 'meta' and a.get('property') == 'og:site_name' and a.get('content') == '식수장부' for t, a in page.tags),
            f'{rel}: missing og:site_name=식수장부',
        )
        og_imgs = [a.get('content') for t, a in page.tags if t == 'meta' and a.get('property') == 'og:image']
        check(len(og_imgs) == 1 and og_imgs[0].startswith(BASE + 'images/cases/og-'), f'{rel}: invalid og:image')
        og_path = ROOT / og_imgs[0].removeprefix(BASE)
        verify_clean_image(og_path, (1200, 630), image_cls=image_cls)

        # Visible HTML FAQ check (<details><summary>)
        summaries = [t for t, _ in page.tags if t == 'summary']
        check(len(summaries) >= 3, f'{rel}: expected at least 3 HTML FAQ items')

        graph = page.schemas[0]['@graph']
        types = {n.get('@type') for n in graph}
        forbidden_types = {'FAQPage', 'LocalBusiness', 'Restaurant', 'EducationalOrganization', 'Review', 'AggregateRating'}
        check(not (types & forbidden_types), f'{rel}: unexpected schema types {types & forbidden_types}')

        if rel == 'cases.html':
            check({'CollectionPage', 'ItemList', 'BreadcrumbList'} <= types, f'{rel}: missing collection schemas')
            item_list = next(n for n in graph if n.get('@type') == 'ItemList')
            item_urls = [item['url'] for item in item_list['itemListElement']]
            expected_urls = [
                'https://pos.kr/cases/cheongunjae',
                'https://pos.kr/cases/kcci-gwangju',
                'https://pos.kr/cases/durimiga',
            ]
            check(item_urls == expected_urls, f'{rel}: ItemList URLs mismatch')
            hrefs = {a.get('href') for t, a in page.tags if t == 'a'}
            for expected_path in ('/cases/cheongunjae', '/cases/kcci-gwangju', '/cases/durimiga'):
                check(expected_path in hrefs, f'{rel}: missing link to {expected_path}')
        else:
            check({'Article', 'BreadcrumbList', 'VideoObject'} <= types, f'{rel}: missing article/video schemas')
            video = next(n for n in graph if n.get('@type') == 'VideoObject')
            check(video['@id'] in index_videos, f'{rel}: unknown VideoObject @id {video["@id"]}')
            idx_video = index_videos[video['@id']]
            for key in ('name', 'description', 'thumbnailUrl', 'uploadDate', 'embedUrl'):
                check(video[key] == idx_video[key], f'{rel}: VideoObject {key} differs from index.html')
            check('isPartOf' not in video, f'{rel}: VideoObject should not redeclare isPartOf')
            vid_id = video['embedUrl'].rsplit('/', 1)[-1]
            triggers = [a.get('data-youtube-id') for _, a in page.tags if 'data-youtube-id' in a]
            check(triggers == [vid_id], f'{rel}: click-to-load video ID mismatch ({triggers} != [{vid_id}])')
            watch_url = f'https://www.youtube.com/watch?v={vid_id}'
            direct_links = [
                a for t, a in page.tags
                if t == 'a' and a.get('href') == watch_url and 'noopener' in a.get('rel', '')
            ]
            check(len(direct_links) >= 1, f'{rel}: missing direct YouTube watch link with rel=noopener')

    # Verify llms.txt includes all 4 case URLs and guide collection integrity
    llms_text = (ROOT / 'llms.txt').read_text(encoding='utf-8')
    for required_url in (
        'https://pos.kr/cases',
        'https://pos.kr/cases/cheongunjae',
        'https://pos.kr/cases/kcci-gwangju',
        'https://pos.kr/cases/durimiga',
        'https://pos.kr/guide/meal-preorder',
    ):
        check(required_url in llms_text, f'llms.txt: missing {required_url}')

    guide_hub = pages['guide.html']
    guide_graph = guide_hub.schemas[0]['@graph']
    guide_types = {n.get('@type') for n in guide_graph}
    check({'CollectionPage', 'ItemList', 'BreadcrumbList'} <= guide_types, 'guide.html: missing collection schemas')
    guide_item_list = next(n for n in guide_graph if n.get('@type') == 'ItemList')
    guide_files = sorted((ROOT / 'guide').glob('*.html'))
    expected_guide_paths = ['/' + f.relative_to(ROOT).as_posix().removesuffix('.html') for f in guide_files]
    expected_guide_urls = {BASE.rstrip('/') + p for p in expected_guide_paths}
    actual_guide_urls = [item['url'] for item in guide_item_list['itemListElement']]
    check(guide_item_list.get('numberOfItems') == len(guide_files), 'guide.html: numberOfItems mismatch')
    check(len(actual_guide_urls) == len(guide_files) and set(actual_guide_urls) == expected_guide_urls, 'guide.html: ItemList URLs mismatch')
    check(
        len(guide_hub.guide_list_hrefs) == len(expected_guide_paths)
        and set(guide_hub.guide_list_hrefs) == set(expected_guide_paths),
        'guide.html: ul.guide-list card links mismatch',
    )

    price = next(n for n in pages['price.html'].schemas[0]['@graph'] if n['@type'] == 'SoftwareApplication')
    # The owner confirmed that every program, including Plus, is free through
    # 50 registered users without a time limit; keep all published copies aligned.
    for rel in ['index.html', 'price.html', 'proposal.html', 'llms.txt',
                'guide/compare-systems.html', 'guide/hamba-meal-count.html',
                'guide/individual-distribution.html', 'guide/vs-meal-voucher-apps.html']:
        free_text = (ROOT / rel).read_text(encoding='utf-8')
        check(all(t in free_text for t in ['모든 프로그램', '50명', 'Plus', '기간 제한']),
              f'{rel}: missing current all-program free-through-50 policy')
        check('무료 혜택은 Super·Pro' not in free_text and '매장은 Super·Pro의 초기 가입비와 월 구독료가 무료' not in free_text,
              f'{rel}: obsolete Super/Pro-only free policy')
    free_row = re.search(r'<tr class="free50">(.*?)</tr>', (ROOT / 'price.html').read_text(encoding='utf-8'), re.S)
    check(free_row and 'colspan="4"' in free_row.group(1), 'price.html: free row must cover every paid program, including Plus')
    for offer in price['offers']:
        if offer['name'] in {'Super', 'Pro', 'Plus', 'Enterprise'}:
            check(all(t in offer['description'] for t in ['50명 이하', '전부 무료', '기간 제한', '문자 QR 발송비', '50명 초과']),
                  f'price.html: {offer["name"]} structured offer omits free-through-50 terms')
    super_price = int(next(o['price'] for o in price['offers'] if o['name'] == 'Super'))
    display_price = f'{super_price / 10000:g}만원'
    for file in ['index.html', 'hamba-pos.html', 'price.html', 'guide/compare-systems.html', 'docs/og-price-source.html']:
        text = (ROOT / file).read_text(encoding='utf-8')
        check(display_price in text, f'{file}: Super price mismatch')
    check(f'| Super | {super_price:,}원 |' in llms_text, 'llms.txt: price mismatch')
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
    mode_note = ' (with Pillow image checks)' if check_images else ' (stdlib mode)'
    print(f'PASS price consistency, FAQ text, form labels, case guardrails and favicon{mode_note}')


if __name__ == '__main__':
    main()
