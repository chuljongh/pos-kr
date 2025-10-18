        document.addEventListener('DOMContentLoaded', () => {
            // --- Hero Slideshow ---
            const slides = document.querySelectorAll('.hero-slides .slide');
            let currentSlide = 0;
            const isMobile = window.matchMedia('(max-width: 768px)').matches;

            function applySlideBgIfNeeded(el) {
                const dataBg = el && el.getAttribute('data-bg');
                if (dataBg && !el.style.backgroundImage) {
                    el.style.backgroundImage = `url('${dataBg}')`;
                }
            }

            // On mobile, do nothing. Only the first static slide will be shown.
            // On desktop, run the slideshow.
            if (!isMobile && slides.length > 0) {
                // Preload the second slide image immediately for a smoother first transition
                if (slides.length > 1) {
                    applySlideBgIfNeeded(slides[1]);
                }

                setInterval(() => {
                    // Preload next slide bg just-in-time
                    const nextIndex = (currentSlide + 1) % slides.length;
                    applySlideBgIfNeeded(slides[nextIndex]);

                    slides[currentSlide].classList.remove('active');
                    currentSlide = nextIndex;
                    slides[currentSlide].classList.add('active');
                }, 2000);
            }

            // --- Scrollspy for GNB ---
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('#page-nav .nav-link');
            if (navLinks.length > 0 && sections.length > 0) {
                const observer = new IntersectionObserver((entries) => {
                    let currentSectionId = '';
                    entries.forEach(entry => { if (entry.isIntersecting) { currentSectionId = entry.target.getAttribute('id'); }});
                    
                    // Find the first visible section from the top
                    const firstVisible = entries.find(e => e.isIntersecting);
                    if (firstVisible) {
                        currentSectionId = firstVisible.target.getAttribute('id');
                    } else {
                        // If nothing is intersecting in the configured view, find the closest one above
                        const belowTheFold = entries.filter(e => e.boundingClientRect.top > 0);
                        if (belowTheFold.length > 0) {
                            const closest = belowTheFold.reduce((prev, curr) => {
                                return (curr.boundingClientRect.top < prev.boundingClientRect.top) ? curr : prev;
                            });
                            const prevElement = closest.target.previousElementSibling;
                            if(prevElement) currentSectionId = prevElement.getAttribute('id');
                        }
                    }

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.dataset.section === currentSectionId) { 
                            link.classList.add('active'); 
                        }
                    });
                }, { rootMargin: '-40% 0px -60% 0px', threshold: 0 });
                sections.forEach(section => observer.observe(section));
            }

            // --- Quick Contact Form Submission ---
            const form = document.getElementById('customGoogleForm');
            const popup = document.getElementById('success-popup');
            if(form && popup) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdqmH1RDQI52jLq3UM0QWJB6h0uYYyxXPVBJpCIg3OO7ERmuA/formResponse';
                    const formData = new FormData(form);
                    fetch(googleFormUrl, { method: 'POST', body: formData, mode: 'no-cors' })
                    .then(() => {
                        popup.classList.remove('opacity-0');
                        setTimeout(() => { popup.classList.add('opacity-0'); form.reset(); }, 2500);
                    })
                    .catch(error => console.error('Error:', error));
                });
            }

            // --- Chart Rendering (deferred load) ---
            // Chart.js is loaded via <script defer>. Initialize directly below.

            const centerTextPlugin = {
                id: 'centerText',
                afterDraw: (chart) => {
                    if (chart.config.type !== 'doughnut' || !chart.options.plugins.centerText) return;
                    const meta = chart.getDatasetMeta(0);
                    const arc = meta && meta.data && meta.data[0];
                    if (!arc) return;
                    const { ctx } = chart;
                    const { text, color } = chart.options.plugins.centerText;
                    const centerX = arc.x;
                    const centerY = arc.y;
                    const innerR = arc.innerRadius || 0;

                    const lines = String(text).split('\n');
                    // Compute max font size that fits inside inner radius for the longest line
                    const padding = Math.max(6, innerR * 0.12);
                    const maxWidth = Math.max(0, innerR * 2 - padding * 2);
                    let fontSize = Math.floor(innerR * 0.42);
                    fontSize = Math.max(10, Math.min(fontSize, 28));

                    ctx.save();
                    ctx.fillStyle = color || '#111827';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const fits = (size) => {
                        ctx.font = `bold ${size}px Pretendard, system-ui, -apple-system, Segoe UI, Roboto`;
                        return lines.every(line => ctx.measureText(line).width <= maxWidth);
                    };

                    while (fontSize > 10 && !fits(fontSize)) {
                        fontSize -= 1;
                    }
                    ctx.font = `bold ${fontSize}px Pretendard, system-ui, -apple-system, Segoe UI, Roboto`;

                    const lineHeight = Math.round(fontSize * 1.2);
                    let startY = centerY - ((lines.length - 1) * lineHeight) / 2;
                    lines.forEach(line => {
                        ctx.fillText(line, centerX, startY);
                        startY += lineHeight;
                    });
                    ctx.restore();
                }
            };

            const chartInitFns = {
                trendChart: () => new Chart(document.getElementById('trendChart'), {
                    type: 'doughnut',
                    data: { 
                        labels: ['장부 관리', 'POS 활용', '기타 자동화', '미시행'], 
                        datasets: [{
                            data: [38.68, 25.00, 17.45, 18.87], 
                            backgroundColor: ['#3b82f6', '#60a5fa', '#93c5fd', '#e5e7eb'],
                            cutout: '60%'
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: true, 
                        plugins: { 
                            legend: { position: 'bottom' }, 
                            title: { display: true, text: '선결제 관리 방식 현황 (212개 매장 조사)' },
                            centerText: { text: '시행 중\n81%', color: '#1e3a8a' }
                        }
                    },
                    plugins: [centerTextPlugin]
                }),
                anxietyChart: () => new Chart(document.getElementById('anxietyChart'), {
                    type: 'bar',
                    data: { labels: ['수기 불신', '타인 도용 우려', '공유/선물 기능 부재', '분실 우려', '혜택 부족'], datasets: [{ data: [69, 68, 62, 59, 55], backgroundColor: '#f97316' }] },
                    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: '고객들이 수기 선결제를 불안해하는 이유 (%)' } }, scales: { x: { beginAtZero: true, max: 100 } } }
                }),
                preferenceChart: () => new Chart(document.getElementById('preferenceChart'), {
                    type: 'doughnut',
                    data: {
                        labels: ['키오스크 선호', '직원 선호', '무관심'],
                        datasets: [{
                            data: [60, 16.5, 23.5],
                            backgroundColor: ['#16a34a', '#ef4444', '#cbd5e1'],
                            hoverBackgroundColor: ['#15803d', '#dc2626', '#94a3b8'],
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' }, title: { display: true, text: '고객 주문 방식 선호도' } } }
                }),
                revenueChart: () => new Chart(document.getElementById('revenueChart'), {
                    type: 'line',
                    data: { labels: ['도입 전', '1개월 후', '2개월 후', '3개월 후'], datasets: [{ label: '매출', data: [100, 105, 110, 115], borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: true, tension: 0.1 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: '선불충전 키오스크 도입 후 매출 변화 (%)' } }, scales: { y: { beginAtZero: false, min: 95 } } }
                }),
                roiChart: () => new Chart(document.getElementById('roiChart'), {
                    type: 'bar',
                    data: {
                        labels: ['10%', '15%', '20%', '25%', '30%'],
                        datasets: [{ label: '투자 회수기간 (개월)', data: [4.4, 2.94, 2.2, 1.76, 1.47], backgroundColor: '#2563eb' }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false }, title: { display: true, text: '주문·결제 자동화 비중에 따른 투자 회수 기간' } },
                        scales: { y: { beginAtZero: true }, x: { } }
                    }
                }),
                starbucksChart: () => new Chart(document.getElementById('starbucksChart'), {
                    type: 'bar',
                    data: { labels: ['2020년', '2021년', '2022년'], datasets: [{ label: '선수금 비중 (%)', data: [73, 79, 82], backgroundColor: '#00704A' }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: '스타벅스 연도별 선수금 발생 비중 (매출 대비)' } }, scales: { y: { beginAtZero: false, min: 70, title: { display: true, text: '비중 (%)' } } } }
                })
            };

            const chartCanvases = ['trendChart','anxietyChart','preferenceChart','revenueChart','roiChart','starbucksChart']
                .map(id => document.getElementById(id))
                .filter(Boolean);

            if (chartCanvases.length > 0) {
                const initOne = (canvas) => {
                    const id = canvas.id;
                    if (chartInitFns[id]) chartInitFns[id]();
                };

                const setupLazyInit = () => {
                    const obs = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                initOne(entry.target);
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { rootMargin: '0px 0px -20% 0px', threshold: 0 });
                    chartCanvases.forEach(c => obs.observe(c));
                };

                if (window.Chart) {
                    setupLazyInit();
                } else {
                    let attempts = 0;
                    const iv = setInterval(() => {
                        attempts++;
                        if (window.Chart) { clearInterval(iv); setupLazyInit(); }
                        if (attempts > 40) { clearInterval(iv); renderFallbackCharts(); }
                    }, 100);
                }
            }

            function renderFallbackCharts() {
                const renderBar = (canvas, values, labels, color) => {
                    const width = canvas.clientWidth || 320;
                    const height = canvas.clientHeight || 220;
                    const max = Math.max(...values) || 1;
                    const barH = Math.max(14, Math.floor((height - 40) / values.length) - 6);
                    const gap = 8;
                    let y = 30;
                    const svgBars = values.map((v, i) => {
                        const w = Math.max(1, Math.floor((width - 120) * (v / max)));
                        const ly = y + barH - 2;
                        const label = labels[i] || '';
                        const rect = `<rect x="100" y="${y}" width="${w}" height="${barH}" fill="${color}" rx="3" />`;
                        const text = `<text x="96" y="${ly}" font-size="12" text-anchor="end" fill="#374151">${label}</text>`;
                        y += barH + gap;
                        return text + rect;
                    }).join('');
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><text x="16" y="20" font-size="14" font-weight="700" fill="#111827">데이터 요약</text>${svgBars}</svg>`;
                    canvas.replaceWith(htmlToElement(svg));
                };
                const renderDonut = (canvas, values, colors, title) => {
                    const size = Math.min(canvas.clientWidth || 260, canvas.clientHeight || 220);
                    const cx = Math.floor(size / 2);
                    const cy = Math.floor(size / 2) + 8;
                    const r = Math.floor(size * 0.32);
                    const total = values.reduce((a,b)=>a+b,0) || 1;
                    let angle = -Math.PI / 2;
                    const arcs = values.map((v, i) => {
                        const a2 = angle + (v/total) * Math.PI * 2;
                        const x1 = cx + r * Math.cos(angle);
                        const y1 = cy + r * Math.sin(angle);
                        const x2 = cx + r * Math.cos(a2);
                        const y2 = cy + r * Math.sin(a2);
                        const large = (a2 - angle) > Math.PI ? 1 : 0;
                        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
                        angle = a2;
                        return `<path d="${d}" fill="${colors[i % colors.length]}"/>`;
                    }).join('');
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><g>${arcs}</g><text x="${cx}" y="${cy}" text-anchor="middle" font-size="12" fill="#1e3a8a">${title||''}</text></svg>`;
                    canvas.replaceWith(htmlToElement(svg));
                };
                const htmlToElement = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };

                const t = document.getElementById('trendChart');
                if (t) renderDonut(t, [38.68,25.00,17.45,18.87], ['#3b82f6','#60a5fa','#93c5fd','#e5e7eb'], '요약');
                const a = document.getElementById('anxietyChart');
                if (a) renderBar(a, [69,68,62,59,55], ['수기 불신','타인 도용','공유/선물','분실','혜택'], '#f97316');
                const p = document.getElementById('preferenceChart');
                if (p) renderDonut(p, [60,16.5,23.5], ['#10b981','#fca5a5','#e5e7eb'], '선호도');
                const r = document.getElementById('revenueChart');
                if (r) renderBar(r, [100,105,110,115], ['도입 전','1개월','2개월','3개월'], '#8b5cf6');
                const roi = document.getElementById('roiChart');
                if (roi) renderBar(roi, [4.40,2.94,2.20,1.76,1.47], ['10%','15%','20%','25%','30%'], '#2563eb');
                const s = document.getElementById('starbucksChart');
                if (s) renderBar(s, [73,79,82], ['2020','2021','2022'], '#00704A');
            }

            // --- Spec Modal Logic ---
            const specLinks = document.querySelectorAll('.spec-link');
            const modals = document.querySelectorAll('.spec-modal');

            specLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const modalId = this.getAttribute('data-modal-target');
                    document.getElementById(modalId).classList.add('active');
                });
            });

            modals.forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this || e.target.classList.contains('close-button')) {
                        this.classList.remove('active');
                    }
                });
            });

            // --- FAQ Accordion Logic ---
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    const answer = item.querySelector('.faq-answer');
                    const isActive = item.classList.toggle('active');
                    
                    if (isActive) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = 0;
                    }
                });
            });
            
            // --- Floating Contact Form Logic (Merged) ---
            const contactFab = document.getElementById('contact-fab');
            const fabContainer = contactFab ? contactFab.closest('.fab-container') : null;
            const quickForm = document.getElementById('quickContactFloating');
            const successMessage = document.getElementById('quickSuccessMessageFloating');
            const phoneInput = document.getElementById('phoneFloating');

            if (fabContainer && quickForm) {
                let fabClicked = false;

                window.addEventListener('scroll', () => {
                    if (window.scrollY > 150) {
                        fabContainer.classList.add('is-visible');
                        if (!fabClicked) {
                            quickForm.classList.add('is-hidden');
                        }
                    } else {
                        fabContainer.classList.remove('is-visible');
                        quickForm.classList.remove('is-hidden');
                        quickForm.classList.remove('is-visible');
                        fabClicked = false;
                    }
                });

                contactFab.addEventListener('click', () => {
                    fabClicked = true;
                    quickForm.classList.remove('is-hidden');
                    quickForm.classList.add('is-visible');
                });
            }

            if(quickForm) {
                quickForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdGJxpukW1B3Z92n2UuTMmn8fur9rvG80AVOKBdNh_6dM468w/formResponse';
                    const formData = new FormData(quickForm);
                    fetch(googleFormUrl, {
                        method: 'POST',
                        body: formData,
                        mode: 'no-cors'
                    }).catch(error => console.error('Error submitting to Google Form:', error));
                    quickForm.classList.remove('is-visible');
                    quickForm.classList.add('is-hidden');
                    successMessage.classList.add('is-visible');
                    setTimeout(() => {
                        successMessage.classList.remove('is-visible');
                        if(phoneInput) phoneInput.value = '';
                    }, 4000);
                });
            }

            if(phoneInput) {
                phoneInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/-/g, '');
                    let formattedValue = '';
                    if (value.length > 4) {
                        formattedValue = value.substring(0, 4) + '-' + value.substring(4, 8);
                    } else {
                        formattedValue = value;
                    }
                    e.target.value = formattedValue;
                });
            }
        });