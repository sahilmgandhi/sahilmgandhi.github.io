document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Mobile Navigation Menu Toggle
    // ==========================================================================
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('open');
        menuToggleBtn.classList.toggle('active');
        menuToggleBtn.setAttribute('aria-expanded', isOpen);
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        menuToggleBtn.classList.remove('active');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
    };

    menuToggleBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggleBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // ==========================================================================
    // Copy-to-Clipboard Deobfuscated Email Action
    // ==========================================================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const tooltip = document.getElementById('copy-tooltip');
    let copyTimeout;

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            // Reconstruct email dynamically to prevent bot scraping from HTML source
            const localPart = 'sahilmgandhi';
            const domainPart = 'gmail.com';
            const email = `${localPart}@${domainPart}`;
            
            navigator.clipboard.writeText(email).then(() => {
                // Visual feedback
                copyEmailBtn.classList.add('copied');
                copyEmailBtn.setAttribute('aria-expanded', 'true');
                tooltip.textContent = 'Copied!';
                
                // Clear any existing timeout
                if (copyTimeout) clearTimeout(copyTimeout);
                
                // Reset tooltip after 2 seconds
                copyTimeout = setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    copyEmailBtn.setAttribute('aria-expanded', 'false');
                    tooltip.textContent = 'Copy Email';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy email: ', err);
                tooltip.textContent = 'Failed to copy';
            });
        });
    }

    // ==========================================================================
    // Lazy Loading IntersectionObserver Fallback (for browsers that don't
    // support native loading="lazy")
    // ==========================================================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if (lazyImages.length > 0) {
            const imgObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // If using data-src pattern in future, load it here
                        imgObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '200px' });
            lazyImages.forEach(img => imgObserver.observe(img));
        }
    }

    // ==========================================================================
    // Contact Form
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const contactSubmit = document.getElementById('contact-submit');

    if (contactForm) {
        const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const fields = {
            name: {
                el: document.getElementById('contact-name'),
                error: document.getElementById('contact-name-error'),
                validate: (v) => v.trim() ? '' : 'Please enter your name.'
            },
            email: {
                el: document.getElementById('contact-email'),
                error: document.getElementById('contact-email-error'),
                validate: (v) => {
                    if (!v.trim()) return 'Please enter your email.';
                    if (!EMAIL_RE.test(v.trim())) return 'Please enter a valid email address.';
                    return '';
                }
            },
            subject: {
                el: document.getElementById('contact-subject'),
                error: document.getElementById('contact-subject-error'),
                validate: (v) => v.trim() ? '' : 'Please enter a subject.'
            },
            message: {
                el: document.getElementById('contact-message'),
                error: document.getElementById('contact-message-error'),
                validate: (v) => v.trim() ? '' : 'Please enter a message.'
            }
        };

        const showError = (field, msg) => {
            field.error.textContent = msg;
            field.el.classList.add('error');
        };

        const clearError = (field) => {
            field.error.textContent = '';
            field.el.classList.remove('error');
        };

        const validateAll = () => {
            let valid = true;
            for (const key in fields) {
                const err = fields[key].validate(fields[key].el.value);
                if (err) {
                    showError(fields[key], err);
                    valid = false;
                } else {
                    clearError(fields[key]);
                }
            }
            return valid;
        };

        // Live validation on blur
        for (const key in fields) {
            fields[key].el.addEventListener('blur', () => {
                const err = fields[key].validate(fields[key].el.value);
                if (err) showError(fields[key], err);
                else clearError(fields[key]);
            });
            fields[key].el.addEventListener('input', () => {
                if (fields[key].el.classList.contains('error')) {
                    const err = fields[key].validate(fields[key].el.value);
                    if (!err) clearError(fields[key]);
                }
            });
        }

        // Toast notifications
        const showToast = (type, message) => {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
            toast.innerHTML = `
                <i class="fa-solid ${icon} toast-icon"></i>
                <span class="toast-message">${message}</span>
            `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('toast-out');
                toast.addEventListener('animationend', () => toast.remove());
            }, 4000);
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check
            const honeypot = contactForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) return;

            if (!validateAll()) return;

            contactSubmit.classList.add('loading');
            contactSubmit.disabled = true;

            const formData = new FormData(contactForm);
            // Remove honeypot from submission
            formData.delete('website');

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast('success', 'Message sent successfully! I\'ll get back to you soon.');
                    contactForm.reset();
                    for (const key in fields) clearError(fields[key]);
                } else {
                    const data = await response.json().catch(() => null);
                    const msg = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
                    showToast('error', msg);
                }
            } catch {
                showToast('error', 'Network error. Please check your connection and try again.');
            } finally {
                contactSubmit.classList.remove('loading');
                contactSubmit.disabled = false;
            }
        });
    }

    // ==========================================================================
    // ScrollSpy: Active Section Navigation Highlighting
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const header = document.getElementById('header');
    
    const scrollActive = () => {
        const scrollY = window.pageYOffset;
        const headerHeight = header ? header.offsetHeight : 64;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerHeight - 20; // Cushioned offset
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                    navLink.setAttribute('aria-current', 'page');
                } else {
                    navLink.classList.remove('active');
                    navLink.removeAttribute('aria-current');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);
    // Trigger scroll spy on load
    scrollActive();
});