/**
 * Dynamically loads the YouTube IFrame when the facade is clicked.
 */
function loadYoutubeVideo() {
    const facade = document.getElementById('youtube-facade');
    if (facade) {
        const iframe = document.createElement('iframe');
        iframe.src = "https://www.youtube.com/embed/0WOdIhcEgjY?autoplay=1";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.title = "YouTube video player";
        facade.innerHTML = '';
        facade.appendChild(iframe);
    }
}

/**
 * Main execution block after the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Utility to lazily initialize features when they become visible.
     * @param {string} targetSelector - The CSS selector for the element to observe.
     * @param {function} initCallback - The function to call when the element is visible.
     */
    const lazyInit = (targetSelector, initCallback) => {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        const observer = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                initCallback();
                obs.unobserve(target);
            }
        }, { rootMargin: '200px' });
        observer.observe(target);
    };

    // --- Eager Initializations (Above-the-fold content) ---
    initHeroSlideshow();
    initContactForms();

    // --- Lazy Initializations (Below-the-fold content) ---
    lazyInit('#page-nav', initScrollspy);
    lazyInit('#faq', initFaqAccordion);
    lazyInit('#kiosk-types', initSpecModals);
    lazyInit('#why-adopt', initCharts); // Kicks off the chart loading process

});

// --- Feature Initialization Functions ---

function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slides .slide');
    if (window.matchMedia('(min-width: 769px)').matches && slides.length > 1) {
        let currentSlide = 0;
        const applyBg = (el) => {
            const bg = el.dataset.bg;
            if (bg && !el.style.backgroundImage) el.style.backgroundImage = `url('${bg}')`;
        };
        applyBg(slides[1]); // Preload second slide
        setInterval(() => {
            applyBg(slides[(currentSlide + 1) % slides.length]);
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 2000);
    }
}

function initContactForms() {
    const mainForm = document.getElementById('customGoogleForm');
    if (mainForm) {
        mainForm.addEventListener('submit', e => {
            e.preventDefault();
            const popup = document.getElementById('success-popup');
            const url = 'https://docs.google.com/forms/d/e/1FAIpQLSdqmH1RDQI52jLq3UM0QWJB6h0uYYyxXPVBJpCIg3OO7ERmuA/formResponse';
            fetch(url, { method: 'POST', body: new FormData(mainForm), mode: 'no-cors' });
            if(popup) popup.classList.remove('opacity-0');
            setTimeout(() => { 
                if(popup) popup.classList.add('opacity-0'); 
                mainForm.reset(); 
            }, 2500);
        });
    }

    const fab = document.getElementById('contact-fab');
    const fabContainer = fab ? fab.closest('.fab-container') : null;
    const quickForm = document.getElementById('quickContactFloating');
    const successMsg = document.getElementById('quickSuccessMessageFloating');
    const phoneInput = document.getElementById('phoneFloating');

    if (fabContainer && quickForm) {
        let fabClicked = false;
        window.addEventListener('scroll', () => {
            const isVisible = window.scrollY > 150;
            fabContainer.classList.toggle('is-visible', isVisible);
            if (isVisible && !fabClicked) quickForm.classList.add('is-hidden');
            if (!isVisible) {
                quickForm.classList.remove('is-hidden', 'is-visible');
                fabClicked = false;
            }
        });
        fab.addEventListener('click', () => {
            fabClicked = true;
            quickForm.classList.remove('is-hidden');
            quickForm.classList.add('is-visible');
        });
    }

    if (quickForm) {
        quickForm.addEventListener('submit', e => {
            e.preventDefault();
            const url = 'https://docs.google.com/forms/d/e/1FAIpQLSdGJxpukW1B3Z92n2UuTMmn8fur9rvG80AVOKBdNh_6dM468w/formResponse';
            fetch(url, { method: 'POST', body: new FormData(quickForm), mode: 'no-cors' });
            quickForm.classList.remove('is-visible');
            quickForm.classList.add('is-hidden');
            if(successMsg) successMsg.classList.add('is-visible');
            setTimeout(() => {
                if(successMsg) successMsg.classList.remove('is-visible');
                if(phoneInput) phoneInput.value = '';
            }, 4000);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', e => {
            const val = e.target.value.replace(/-/g, '');
            e.target.value = val.length > 4 ? `${val.substring(0, 4)}-${val.substring(4, 8)}` : val;
        });
    }
}

function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#page-nav .nav-link');
    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver(entries => {
        let currentSectionId = '';
        const firstVisible = entries.find(e => e.isIntersecting);
        if (firstVisible) {
            currentSectionId = firstVisible.target.id;
        }
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === currentSectionId);
        });
    }, { rootMargin: '-40% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
}

function initFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const answer = item.querySelector('.faq-answer');
                item.classList.toggle('active');
                if (answer) answer.style.maxHeight = item.classList.contains('active') ? answer.scrollHeight + 'px' : '0';
            });
        }
    });
}

function initSpecModals() {
    const modals = new Map();
    document.querySelectorAll('.spec-modal').forEach(m => modals.set(m.id, m));

    document.querySelectorAll('.spec-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const modal = modals.get(link.dataset.modalTarget);
            if (modal) modal.classList.add('active');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal || e.target.classList.contains('close-button')) {
                modal.classList.remove('active');
            }
        });
    });
}

function initCharts() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js';
    script.onerror = () => console.error('Chart.js failed to load.');
    script.onload = () => {
        const centerTextPlugin = { /* ... as before ... */ };
        const chartConfigs = { /* ... as before ... */ };

        const chartCanvases = document.querySelectorAll('.chart-container canvas');
        if (!chartCanvases.length) return;

        const chartObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const canvas = entry.target;
                    const config = chartConfigs[canvas.id];
                    if (config) new Chart(canvas, config);
                    observer.unobserve(canvas);
                }
            });
        }, { rootMargin: '0px 0px -50px 0px' });

        chartCanvases.forEach(canvas => chartObserver.observe(canvas));
    };
    document.head.appendChild(script);
}