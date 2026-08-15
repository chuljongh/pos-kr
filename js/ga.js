/*
 * GA4 전환 이벤트 전송 — GTM 컨테이너(GTM-WV2DSD9V) 규약에 맞춘 얇은 어댑터.
 *
 * 컨테이너의 GA4 이벤트 태그는 아래 조건에서만 발동한다.
 *   · 클릭 이벤트이고
 *   · "클릭된 요소 자체"가 [data-ga-event^='cta_click'] 에 매칭될 때
 * 조상 요소는 보지 않는다. 그래서 <a> 안의 <span>·<svg> 를 누르면 놓친다.
 * GA4 이벤트 이름 = 그 요소의 data-ga-event 값이므로 접두사 cta_click 이 필수다.
 *
 * window.gtag 는 정의되어 있지 않고, 커스텀 dataLayer.push 를 받는 태그도 없다.
 * 따라서 코드에서 이벤트를 보내려면 속성을 단 요소를 만들어 클릭시키는 수밖에 없다.
 */
(function () {
    'use strict';

    var SEL = '[data-ga-event^="cta_click"]';

    function sendGaEvent(name) {
        if (!name || !document.body) return;
        var el = document.createElement('span');
        el.setAttribute('data-ga-event', name);
        el.style.display = 'none';
        document.body.appendChild(el);
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        setTimeout(function () { el.remove(); }, 1000);
    }

    window.sendGaEvent = sendGaEvent;

    // 자식 요소가 클릭된 경우를 대신 보낸다.
    // 클릭된 요소 자체가 매칭되면 GTM 이 이미 잡으므로 건너뛴다(중복 전송 방지).
    document.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || typeof t.closest !== 'function') return;
        if (typeof t.matches === 'function' && t.matches(SEL)) return;
        var host = t.closest(SEL);
        if (host) sendGaEvent(host.getAttribute('data-ga-event'));
    });
})();
