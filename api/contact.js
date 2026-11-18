const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd_1ofOd4BDJW6Y4HrsyQyJbVeA0b7-8jDRtdwRyN-fQqfTww/formResponse?hl=en';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SOURCES = new Set(['', '네이버 검색', '구글 검색', '유튜브 영상', '인스타그램', '카페 홍보 포스터', '손님 혹은 지인 추천', '기타']);
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

module.exports = async function contact(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'method' });
    }
    if (req.headers.origin && req.headers.origin !== `https://${req.headers.host}`) {
        return res.status(403).json({ ok: false, error: 'origin' });
    }
    let body = req.body;
    try { if (typeof body === 'string') body = JSON.parse(body); }
    catch { return res.status(400).json({ ok: false, error: 'input' }); }
    if (!body || typeof body !== 'object' || JSON.stringify(body).length > 12000) {
        return res.status(400).json({ ok: false, error: 'input' });
    }
    const name = clean(body.name, 150);
    const details = clean(body.message, 3000);
    const contact = clean(body.contact, 200);
    const source = clean(body.source, 100);
    if (!name || !contact || !SOURCES.has(source) || !UUID.test(body.lead_id || '')) {
        return res.status(400).json({ ok: false, error: 'input' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?[\d\s()-]{8,25}$/.test(contact)) {
        return res.status(400).json({ ok: false, error: 'contact' });
    }
    // Only allow a fixed attribution schema; never echo contact details in the response or GA4.
    const attribution = body.attribution || {};
    const metadata = [`접수 ID: ${body.lead_id}`, `접수 시각: ${new Date().toISOString()}`];
    for (const key of ['landing_path', 'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign', 'ga_client_id', 'ga_session_id']) {
        const value = clean(attribution[key], 200).replace(/[\r\n]/g, ' ');
        if (value) metadata.push(`${key}: ${value}`);
    }
    const form = new URLSearchParams({
        'entry.1950910160': name,
        'entry.1181158497': contact,
        'entry.1429359743': source,
        'entry.1270692115': `${details}\n\n[접수 기록]\n${metadata.join('\n')}`.trim(),
    });
    try {
        const upstream = await fetch(FORM_URL, {
            method: 'POST', body: form, signal: AbortSignal.timeout(12000),
        });
        const html = await upstream.text();
        // A resolved fetch / HTTP 200 alone can also be a validation or login page.
        const confirmed = upstream.ok && /Your response has been recorded\.|응답이 기록되었습니다\./.test(html)
            && !/name="entry\.\d+"/.test(html);
        if (!confirmed) return res.status(502).json({ ok: false, error: 'unconfirmed', lead_id: body.lead_id });
        return res.status(200).json({ ok: true, lead_id: body.lead_id });
    } catch {
        // Do not retry an uncertain write: Google may have saved it before the connection failed.
        return res.status(502).json({ ok: false, error: 'unconfirmed', lead_id: body.lead_id });
    }
};
