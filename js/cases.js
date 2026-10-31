/*
 * 도입 사례 페이지 YouTube click-to-load 스크립트
 * - 초기 로딩 시 외부 iframe을 불러오지 않고 포스터만 표시합니다.
 * - 일반 좌클릭 시에만 youtube-nocookie.com 임베드로 전환하며,
 *   Ctrl/Meta/Shift/Alt/휠 클릭 및 JS 미동작 환경에서는 기본 YouTube 링크로 이동합니다.
 */
(function () {
    'use strict';

    document.addEventListener('click', function (e) {
        if (e.defaultPrevented) return;
        if (typeof e.button === 'number' && e.button !== 0) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

        var trigger = e.target && typeof e.target.closest === 'function'
            ? e.target.closest('[data-youtube-id]')
            : null;
        if (!trigger) return;

        var videoId = trigger.getAttribute('data-youtube-id');
        if (!videoId) return;

        e.preventDefault();

        var container = trigger.closest('.video-frame') || trigger.parentNode;
        if (!container) return;

        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0');
        iframe.setAttribute('title', trigger.getAttribute('aria-label') || '식수장부 현장 도입 사례 영상');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');

        container.replaceChildren(iframe);
        iframe.focus();
    });
})();
