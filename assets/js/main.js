document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Mobile Navigation Menu Toggle
    // ==========================================================================
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navMenu.classList.toggle('open');
        menuToggleBtn.classList.toggle('active');
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        menuToggleBtn.classList.remove('active');
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
                tooltip.textContent = 'Copied!';
                
                // Clear any existing timeout
                if (copyTimeout) clearTimeout(copyTimeout);
                
                // Reset tooltip after 2 seconds
                copyTimeout = setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    tooltip.textContent = 'Copy Email';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy email: ', err);
                tooltip.textContent = 'Failed to copy';
            });
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
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);
    // Trigger scroll spy on load
    scrollActive();
});