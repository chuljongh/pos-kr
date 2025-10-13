        document.addEventListener('DOMContentLoaded', () => {
            const doors = document.querySelectorAll('.door');
            const body = document.body;

                        doors.forEach(door => {

                            // --- Click Event for Animation ---

                            door.addEventListener('click', function(e) {

                                e.preventDefault();

                                

                                if (body.classList.contains('opening-left') || body.classList.contains('opening-right')) return;

            
                                door.addEventListener('animationend', () => {
                                    window.location.href = door.href;
                                }, { once: true });

                                                                        if (this.classList.contains('left-door')) {

            

                                                                            body.classList.add('opening-left');

            

                                                                            this.style.animation = 'openLeft var(--animation-duration) ease-in forwards';

            

                                                                        } else {

            

                                                                            body.classList.add('opening-right');

            

                                                                            this.style.animation = 'openRight var(--animation-duration) ease-in forwards';

            

                                                                        }

                            });

            

                            // --- Touch Events for Mobile Hover Simulation ---
                door.addEventListener('touchstart', function(e) {
                    doors.forEach(d => d.classList.remove('hover'));
                    this.classList.add('hover');
                }, { passive: true });
            });
            
            document.addEventListener('touchend', function(e) {
                 doors.forEach(d => d.classList.remove('hover'));
            });

            // --- Floating Contact Form Logic ---
            const contactFab = document.getElementById('contact-fab');
            const quickForm = document.getElementById('quickContactFloating');
            const successMessage = document.getElementById('quickSuccessMessageFloating');
            const phoneInput = document.getElementById('phoneFloating');

            contactFab.addEventListener('click', () => {
                quickForm.classList.toggle('is-visible');
            });

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
                successMessage.classList.add('is-visible');

                setTimeout(() => {
                    successMessage.classList.remove('is-visible');
                    phoneInput.value = '';
                }, 4000);
            });

            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/-/g, ''); // Remove all hyphens to recalculate
                let formattedValue = '';

                if (value.length > 4) {
                    formattedValue = value.substring(0, 4) + '-' + value.substring(4, 8);
                } else {
                    formattedValue = value;
                }
                
                e.target.value = formattedValue;
            });

            // --- Mobile Title Text Change ---
            const hambaTitle = document.getElementById('hamba-title');
            function adjustHambaTitle() {
                if (window.innerWidth <= 768) {
                    hambaTitle.innerHTML = '구내·함바집';
                } else {
                    hambaTitle.innerHTML = '구내식당·함바';
                }
            }
            // Initial check on load
            adjustHambaTitle();
            // Add listener for window resize
            window.addEventListener('resize', adjustHambaTitle);

            // --- CSS Pulse Animation in use ---

                    window.addEventListener('pageshow', function(event) {
                        if (event.persisted) {
                            body.classList.remove('opening-left', 'opening-right');
                            doors.forEach(door => {
                                door.removeAttribute('style');
                                // Force animation restart on bfcache restore
                                door.style.animationName = 'none';
                                void door.offsetWidth; // Trigger reflow
                                door.style.animationName = '';
                            });
                        }
                    });        });