        function toggleFloatingBtn() {
            const btn = document.getElementById('floatingConsultBtn');
            const featuresSection = document.getElementById('features');
            const useCasesSection = document.getElementById('use-cases');
            if (!btn || !featuresSection || !useCasesSection) return;
            
            const featuresRect = featuresSection.getBoundingClientRect();
            const useCasesRect = useCasesSection.getBoundingClientRect();

            const isInFeatures = featuresRect.top <= window.innerHeight && featuresRect.bottom >= 0;
            const isInUseCases = useCasesRect.top <= window.innerHeight && useCasesRect.bottom >= 0;
            
            if (isInFeatures || isInUseCases) {
                btn.classList.add('hidden');
            } else {
                btn.classList.remove('hidden');
            }
        }

        function toggleFaq(faqNumber) {
            const content = document.querySelector(`button[onclick="toggleFaq(${faqNumber})"]`).nextElementSibling;
            const icon = document.querySelector(`button[onclick="toggleFaq(${faqNumber})"] .faq-icon`);
            
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.textContent = '−';
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.classList.add('hidden');
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
            }
        }

        function loadYouTubeVideo(element, videoId) {
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
            iframe.setAttribute('title', 'YouTube video player');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('class', 'absolute inset-0 w-full h-full');
            element.innerHTML = '';
            element.appendChild(iframe);
        }

        document.addEventListener('DOMContentLoaded', () => {
            // --- Mobile Dropdown Menu ---
            const menuToggle = document.getElementById('menu-toggle');
            const dropdownMenu = document.getElementById('mobile-dropdown');
            const dropdownLinks = dropdownMenu.querySelectorAll('a');

            if (menuToggle && dropdownMenu) {
                menuToggle.addEventListener('click', () => {
                    menuToggle.classList.toggle('is-active');
                    dropdownMenu.classList.toggle('hidden');
                });

                dropdownLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        menuToggle.classList.remove('is-active');
                        dropdownMenu.classList.add('hidden');
                    });
                });
            }

            // --- Mobile Table Scroll ---
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                const wrapper = document.createElement('div');
                wrapper.className = 'overflow-x-auto';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            });

            // --- Floating Button Listeners ---
            window.addEventListener('scroll', toggleFloatingBtn);
            toggleFloatingBtn(); // Initial check

            // --- Google Form Submission ---
            const form = document.getElementById('customGoogleForm');
            const popup = document.getElementById('success-popup');

            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd_1ofOd4BDJW6Y4HrsyQyJbVeA0b7-8jDRtdwRyN-fQqfTww/formResponse';
                    const formData = new FormData(form);

                    fetch(googleFormUrl, {
                        method: 'POST',
                        body: formData,
                        mode: 'no-cors'
                    })
                    .then(() => {
                        if (popup) {
                            popup.classList.remove('opacity-0');
                            setTimeout(() => {
                                popup.classList.add('opacity-0');
                                form.reset();
                            }, 2000);
                        }
                    })
                    .catch(error => console.error('Error submitting to Google Form:', error));
                });
            }

            // --- Scrollspy for Floating Navigation ---
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('#page-nav .nav-link');

            if (navLinks.length > 0 && sections.length > 0) {
                const observerOptions = {
                    root: null,
                    rootMargin: '0px 0px -50% 0px',
                    threshold: 0
                };

                const observer = new IntersectionObserver((entries) => {
                    let activeSectionId = null;
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            activeSectionId = entry.target.getAttribute('id');
                        }
                    });

                    if (activeSectionId === null) {
                        let minDistance = Infinity;
                        sections.forEach(section => {
                            const rect = section.getBoundingClientRect();
                            const distance = Math.abs(rect.top - window.innerHeight / 2);
                            if (distance < minDistance) {
                                minDistance = distance;
                                activeSectionId = section.id;
                            }
                        });
                    }
                    
                    navLinks.forEach(link => {
                        const dot = link.querySelector('div');
                        const sectionId = link.dataset.section;

                        if (sectionId === activeSectionId) {
                            link.classList.add('text-primary', 'font-extrabold');
                            link.classList.remove('text-gray-500', 'font-semibold');
                            dot.classList.add('bg-primary', 'scale-150');
                            dot.classList.remove('bg-gray-400');
                        } else {
                            link.classList.remove('text-primary', 'font-extrabold');
                            link.classList.add('text-gray-500', 'font-semibold');
                            dot.classList.remove('bg-primary', 'scale-150');
                            dot.classList.add('bg-gray-400');
                        }
                    });
                }, observerOptions);

                sections.forEach(section => {
                    if (section.id) {
                        observer.observe(section);
                    }
                });
            }
        });