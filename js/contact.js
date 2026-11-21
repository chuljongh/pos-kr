(function () {
    'use strict';
    const MEASUREMENT_ID = 'G-J0YYEB5M7F';
    const STORAGE_KEY = 'poskr-contact-attribution-v1';
    let attribution = {};
    try { attribution = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') || {}; } catch (_) {}
    if (!attribution.landing_path) {
        attribution.landing_path = location.pathname;
        try { attribution.referrer_host = new URL(document.referrer).hostname; } catch (_) {}
        const query = new URLSearchParams(location.search);
        ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
            const value = query.get(key);
            if (value) attribution[key] = value.slice(0, 200);
        });
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution)); } catch (_) {}
    }
    // Reuse the Google tag already configured by GTM; no second config or page_view.
    function googleTag() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
    }
    function measure(name, parameters) {
        googleTag('event', name, Object.assign({ send_to: MEASUREMENT_ID, form_id: 'poskr-contact' }, parameters));
    }
    function analyticsIds() {
        return new Promise(resolve => {
            const ids = {};
            let count = 0;
            const done = () => { if (++count === 2) resolve(ids); };
            ['client_id', 'session_id'].forEach(key => {
                googleTag('get', MEASUREMENT_ID, key, value => {
                    if (value) ids[`ga_${key}`] = String(value).slice(0, 100);
                    done();
                });
            });
            setTimeout(() => resolve(ids), 800);
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('customGoogleForm');
        if (!form) return;
        const button = form.querySelector('[type=submit]');
        const originalLabel = button.textContent.trim();
        const status = document.createElement('p');
        status.id = 'contact-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.style.cssText = 'font-size:18px;line-height:1.65;color:#fff;overflow-wrap:anywhere';
        form.appendChild(status);
        form.setAttribute('aria-describedby', status.id);
        let locked = false;
        let invalidReported = false;
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                if (!entries.some(entry => entry.isIntersecting)) return;
                observer.disconnect();
                measure('contact_form_view');
            });
            observer.observe(form);
        }
        form.addEventListener('invalid', () => {
            if (invalidReported) return;
            invalidReported = true;
            measure('contact_validation_error', { error_type: 'browser_constraint' });
            setTimeout(() => { invalidReported = false; }, 0);
        }, true);
        form.addEventListener('input', () => measure('contact_form_start'), { once: true });
        form.addEventListener('submit', async event => {
            event.preventDefault();
            if (locked || !form.reportValidity()) return;
            const data = new FormData(form);
            const contact = String(data.get('entry.1181158497') || '').trim();
            const phoneDigits = contact.replace(/\D/g, '');
            const isPhone = /^\+?[\d\s()-]{8,25}$/.test(contact) && /^\d{8,15}$/.test(phoneDigits);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !isPhone) {
                measure('contact_validation_error', { error_type: 'contact_format' });
                status.textContent = '전화번호 또는 이메일을 정확히 입력해 주세요.';
                form.querySelector('#form-contact').focus();
                return;
            }
            locked = true;
            button.disabled = true;
            button.style.opacity = '0.7';
            button.textContent = '접수를 확인하고 있어요…';
            form.setAttribute('aria-busy', 'true');
            status.textContent = '';
            const leadId = crypto.randomUUID();
            measure('contact_submit_attempt');
            try {
                const ids = await analyticsIds();
                const response = await fetch('/api/contact', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lead_id: leadId,
                        name: data.get('entry.1950910160'), contact,
                        source: data.get('entry.1429359743') || '',
                        message: data.get('entry.1270692115') || '',
                        attribution: Object.assign({}, attribution, ids),
                    }),
                    signal: AbortSignal.timeout(20000),
                });
                const result = await response.json();
                if (response.ok && result.ok === true && result.lead_id === leadId) {
                    measure('generate_lead', { lead_id: leadId });
                    if (window.sendGaEvent) window.sendGaEvent('cta_click_contact_submit');
                    status.textContent = '신청이 접수되었습니다. 내용을 확인한 뒤 남겨주신 연락처로 안내드리겠습니다.';
                    button.textContent = '접수 완료';
                } else if (response.status === 400) {
                    measure('contact_validation_error', { error_type: 'server_input' });
                    status.textContent = '이름과 전화번호 또는 이메일을 확인한 뒤 다시 신청해 주세요.';
                    button.textContent = originalLabel;
                    button.disabled = false;
                    button.style.opacity = '';
                    locked = false;
                } else throw new Error('unconfirmed');
            } catch (_) {
                measure('contact_submit_unconfirmed', { lead_id: leadId });
                status.textContent = `접수 여부를 확인하지 못했습니다. 중복 접수를 막기 위해 다시 보내지 않습니다. 입력 내용은 남겨두었습니다. 010-5415-4415로 연락해 주세요. 확인 번호: ${leadId}`;
                button.textContent = '전화로 접수를 확인해 주세요';
            } finally { form.removeAttribute('aria-busy'); }
        });
    });
})();
