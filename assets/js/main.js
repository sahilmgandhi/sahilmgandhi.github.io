document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Theme Toggle
    // ==========================================================================
    const STORAGE_KEY = 'theme';
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme, persist = false) => {
        htmlEl.setAttribute('data-theme', theme);
        themeToggle.setAttribute('aria-checked', theme === 'dark');
        if (persist) {
            localStorage.setItem(STORAGE_KEY, theme);
        }
    };

    // Determine initial theme: localStorage > OS preference > dark
    const stored = localStorage.getItem(STORAGE_KEY);
    const initialTheme = stored || (prefersDark.matches ? 'dark' : 'light');
    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
    });

    // Follow OS changes only when no manual override exists
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Remove no-transition class after first paint
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            htmlEl.classList.remove('no-transition');
        });
    });
    // ==========================================================================
    // Dynamic Footer Year
    // ==========================================================================
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

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
    menuToggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggleBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMenu();
            menuToggleBtn.focus();
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
    // ==========================================================================
    // Project Detail Modals
    // ==========================================================================
    const PROJECT_DATA = [
        {
            title: 'Stock-Trader',
            description: 'An automated stock trading bot integrated with Alpaca API implementing custom quantitative trading strategies and backtesting pipelines.',
            tags: ['Python', 'Alpaca API', 'Quantitative', 'Backtesting', 'Algorithmic Trading'],
            links: [
                { label: 'GitHub', url: 'https://github.com/sahilmgandhi/Stock-Trader', icon: 'fa-brands fa-github' }
            ],
            architecture: 'Event-driven architecture using Python with Alpaca API for live/paper trading. Modular strategy pattern allows plugging in custom quantitative strategies. Includes a backtesting harness that replays historical market data against strategy logic to evaluate performance metrics like Sharpe ratio and max drawdown.'
        },
        {
            title: 'Prequel Error Codes',
            description: 'A Chrome extension that turns standard HTTP error codes from various sites into fun Star Wars prequel memes instead.',
            tags: ['Javascript', 'Chrome Extension', 'Star Wars Memes', 'Content Scripts'],
            links: [
                { label: 'GitHub', url: 'https://github.com/sahilmgandhi/prequel-error-codes', icon: 'fa-brands fa-github' },
                { label: 'Chrome Web Store', url: 'https://chrome.google.com/webstore/detail/prequelerrorcodes/cdjhhanfoilmkjidljiacahphcfgjbkc', icon: 'fa-solid fa-store' }
            ],
            architecture: 'Uses Chrome Extension content scripts to intercept HTTP error pages before they render. Maps standard error codes (404, 500, etc.) to a curated library of Star Wars prequel memes. Manifest V2 extension with background script for cross-origin interception.'
        },
        {
            title: 'Micromouse Robot',
            description: 'An autonomous maze-solving robot designed from scratch (custom PCB, components, soldering) and programmed in C/C++. Won 1st at CAMM & UCR Regionals.',
            tags: ['C/C++', 'Robotics', 'PCB Design', 'Maze Solving', 'Embedded Systems'],
            links: [
                { label: 'GitHub', url: 'https://github.com/etank7000/Micromouse', icon: 'fa-brands fa-github' }
            ],
            architecture: 'Custom-designed PCB with ARM microcontroller running real-time maze-solving algorithms. Uses IR sensors for wall detection and a flood-fill algorithm for path planning. Motor control via PWM with PID loop for precise movement. Hardware includes custom voltage regulation and sensor array PCB.'
        },
        {
            title: 'Trivia-Bot',
            description: 'An automated Python-based assistant designed to parse and suggest answers for live mobile trivia apps like HQ Trivia and Beat the Q in real time.',
            tags: ['Python', 'Web Scraping', 'NLP', 'Real-time', 'Automation'],
            links: [
                { label: 'Demo', url: 'https://jonathan.zaturensky.com/projects/', icon: 'fa-solid fa-arrow-up-right-from-square' }
            ],
            architecture: 'Real-time pipeline that captures live trivia questions via screen scraping, sends them to web search APIs, applies NLP-based answer extraction using keyword matching and sentiment analysis, then ranks candidate answers by confidence score. Built for low-latency response under strict time constraints.'
        },
        {
            title: 'Free Throw Classifier',
            description: 'A real-time classifier that grades basketball free throws using Hexiwear wearables mounted on a player\'s arm streaming data to a central Raspberry Pi server.',
            tags: ['IoT', 'Hexiwear', 'Raspberry Pi', 'Wearables', 'Machine Learning'],
            links: [
                { label: 'Presentation', url: 'https://docs.google.com/presentation/d/1qoTKB66uaKdh6aG1WqI_lz4zfSAvpxa71AFHYtjVaCk/edit?usp=sharing', icon: 'fa-solid fa-chalkboard-user' }
            ],
            architecture: 'Hexiwear wearable captures accelerometer and gyroscope data during free throw motion, streaming via Bluetooth LE to a central Raspberry Pi. Raspberry Pi runs a trained classifier model that grades the throw form in real time. Data pipeline includes sensor fusion, feature extraction, and classification stages.'
        },
        {
            title: 'Bruin Dining API',
            description: 'A backend API that scrapes UCLA dining hall data, allowing third-party developers to access nutritional info. Equipped with an interactive GUI.',
            tags: ['Python', 'Web Scraping', 'REST API', 'GUI', 'Data Pipeline'],
            links: [
                { label: 'GitHub', url: 'https://github.com/vanshg/BruinMenu-Backend', icon: 'fa-brands fa-github' },
                { label: 'Live Demo', url: 'http://bruindining.herokuapp.com/', icon: 'fa-solid fa-arrow-up-right-from-square' }
            ],
            architecture: 'Scheduled Python scraper pulls dining menu data from UCLA dining services, normalizes nutritional information, and exposes it via a RESTful API. Includes a web-based GUI for browsing menus by dining hall, meal period, and dietary restriction. Deployed on Heroku with automated daily refresh.'
        },
        {
            title: 'C.A.R.M. Chat',
            description: '"Communicating Across Random Masses"—a Chrome extension allowing users on any website to dynamically chat with each other anonymously and instantly.',
            tags: ['Javascript', 'WebSockets', 'Chrome Extension', 'Anonymous Chat', 'Real-time'],
            links: [
                { label: 'GitHub', url: 'https://github.com/getCarm/CARM', icon: 'fa-brands fa-github' },
                { label: 'Chrome Web Store', url: 'https://chrome.google.com/webstore/detail/carm/gnepbnmmbmkipbdbclbekhklbbijmimf', icon: 'fa-solid fa-store' }
            ],
            architecture: 'Chrome extension injects a chat overlay into any webpage. Uses WebSockets for real-time bidirectional messaging between anonymous users on the same domain. Backend WebSocket server handles room management keyed by domain, message relay, and connection lifecycle. No accounts or persistent storage required.'
        },
        {
            title: 'REM.my Alarm',
            description: 'A smart, minimalist Android alarm system that optimizes a user\'s sleep cycles and wake times around natural REM sleep phases.',
            tags: ['Java', 'Android SDK', 'UI Design', 'Sleep Cycles', 'Mobile'],
            links: [
                { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.sahilmgandhi.remmy', icon: 'fa-brands fa-google-play' }
            ],
            architecture: 'Native Android app using Java with Android SDK. Calculates optimal wake windows based on 90-minute sleep cycle durations. Uses AlarmManager for precise timing with a custom UI that visualizes sleep phases. Implements a doze-mode-aware alarm scheduling system for reliable wake-up delivery.'
        }
    ];

    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const projectCards = document.querySelectorAll('.project-card[data-project-index]');
    let previousFocusElement = null;

    function openModal(index) {
        const project = PROJECT_DATA[index];
        if (!project) return;

        previousFocusElement = document.activeElement;

        modalTitle.textContent = project.title;
        modal.querySelector('.modal-description').textContent = project.description;
        modal.querySelector('.modal-status').textContent = 'Completed';

        const tagsContainer = modal.querySelector('.modal-tags');
        tagsContainer.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');

        const linksContainer = modal.querySelector('.modal-links');
        linksContainer.innerHTML = project.links.map(link =>
            `<a href="${link.url}" target="_blank" class="modal-link" rel="noopener noreferrer"><i class="${link.icon}"></i> ${link.label}</a>`
        ).join('');

        modal.querySelector('.modal-architecture').innerHTML = `<p>${project.architecture}</p>`;

        modal.hidden = false;
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            modal.classList.add('is-open');
            modalCloseBtn.focus();
        });
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');

        modal.addEventListener('transitionend', function handler() {
            modal.hidden = true;
            modal.removeEventListener('transitionend', handler);
            if (previousFocusElement) {
                previousFocusElement.focus();
                previousFocusElement = null;
            }
        });
    }

    // Focus trap
    function trapFocus(e) {
        if (!modal.classList.contains('is-open')) return;
        if (e.key !== 'Tab') return;

        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    // Click handlers on project cards
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking an actual link inside the card
            if (e.target.closest('a.proj-link-icon')) return;
            const index = parseInt(card.dataset.projectIndex, 10);
            openModal(index);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const index = parseInt(card.dataset.projectIndex, 10);
                openModal(index);
            }
        });
    });

    // Close button
    modalCloseBtn.addEventListener('click', closeModal);

    // Click overlay to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
        trapFocus(e);
    });

    // Trigger scroll spy on load
    scrollActive();

    // ==========================================================================
    // Service Worker Registration
    // ==========================================================================
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});