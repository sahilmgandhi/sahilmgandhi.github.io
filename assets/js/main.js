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

    // ==========================================================================
    // Reveal Animation: IntersectionObserver for .reveal elements
    // ==========================================================================
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything immediately
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    }
});