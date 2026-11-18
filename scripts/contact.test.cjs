const { test } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/contact');
const originalFetch = global.fetch;
const valid = {
    lead_id: '32f4aeb7-27b7-4b7b-84b4-a160ff4d0db9', name: 'QA 식당', contact: 'qa@example.com',
    message: '희망 시연', source: '구글 검색',
    attribution: { landing_path: '/guide/qr-scanner-setup', utm_source: 'google', ga_client_id: '123.456' },
};
async function invoke(body, fetcher, overrides = {}) {
    const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; },
        status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
    global.fetch = fetcher || (() => { throw new Error('Unexpected upstream call'); });
    try { await handler({ method: 'POST', headers: { host: 'pos.kr', origin: 'https://pos.kr' }, body, ...overrides }, res); }
    finally { global.fetch = originalFetch; }
    return res;
}
test('Reject invalid contacts and cross-origin requests before any write', async () => {
    assert.equal((await invoke({ ...valid, contact: 'broken' })).statusCode, 400);
    assert.equal((await invoke({ ...valid, lead_id: '' })).statusCode, 400);
    assert.equal((await invoke('{')).statusCode, 400);
    assert.equal((await invoke(valid, null, { headers: { host: 'pos.kr', origin: 'https://other.example' } })).statusCode, 403);
    assert.equal((await invoke(valid, null, { method: 'GET' })).statusCode, 405);
});
test('Only confirmed acceptance returns success and stores the receipt with attribution', async () => {
    let calls = 0;
    const res = await invoke(valid, async (url, options) => {
        calls++;
        assert.equal(new URL(url).hostname, 'docs.google.com');
        assert.equal(options.body.get('entry.1181158497'), valid.contact);
        const notes = options.body.get('entry.1270692115');
        for (const value of [valid.message, valid.lead_id, '/guide/qr-scanner-setup', 'google', '123.456']) assert.ok(notes.includes(value));
        return { ok: true, text: async () => '<div class="vHW8K">Your response has been recorded.</div>' };
    });
    assert.equal(calls, 1);
    assert.deepEqual(res.body, { ok: true, lead_id: valid.lead_id });
    assert.ok(!JSON.stringify(res.body).includes(valid.contact));
    assert.equal(res.headers['Cache-Control'], 'no-store');
});
test('HTTP 200 validation/login pages and upstream failures never count as a lead', async () => {
    for (const html of ['<input name="entry.1181158497">Required question', 'Sign in', '']) {
        const res = await invoke(valid, async () => ({ ok: true, text: async () => html }));
        assert.equal(res.statusCode, 502);
        assert.equal(res.body.ok, false);
    }
    let calls = 0;
    const res = await invoke(valid, async () => { calls++; throw new Error('timeout'); });
    assert.equal(res.statusCode, 502);
    assert.equal(calls, 1, 'Uncertain writes must not retry');
});
