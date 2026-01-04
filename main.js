document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Language Handling ---
    const langSelector = document.getElementById('lang-selector');
    const defaultLang = 'mr';
    let currentLang = localStorage.getItem('preferredLang') || defaultLang;

    // Initialize Language
    if (langSelector) {
        langSelector.value = currentLang;
        langSelector.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('preferredLang', currentLang);
            loadLanguage(currentLang);
        });
    }
    loadLanguage(currentLang);

    async function loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load ${lang}.json`);
            const translations = await response.json();
            applyTranslations(translations);
            document.documentElement.lang = lang;
            document.documentElement.dir = ['ur', 'ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
        } catch (error) {
            console.error('Error loading language:', error);
            if (window.location.protocol === 'file:') {
                alert('Language loading failed because you are opening the file directly.\n\nBrowsers block loading JSON files from the disk for security.\n\nPlease run the included "server.py" script or use a local server.');
            }
        }
    }

    function applyTranslations(translations) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }


    // --- 2. UI & Animations ---

    // Loader
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }

    // Vanta.js DOTS Background - Gold & Silver Jewelry Theme
    const vantaBg = document.getElementById('vanta-bg');
    if (vantaBg && typeof VANTA !== 'undefined') {
        VANTA.DOTS({
            el: vantaBg,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xd4af37,          // Gold color
            color2: 0xc0c0c0,         // Silver color
            backgroundColor: 0x0a0a0a, // Dark background
            size: 5.70,               // Dot size
            spacing: 56.00,           // Spacing between dots
            showLines: true           // Show connecting lines
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking a link (optional for multi-page, but good for UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
            });
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .step-card, .info-item, .gallery-item, .hero-content, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --- 3. Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox) {
        // Open Lightbox
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                // Try to get caption from sibling or alt text
                const caption = img.nextElementSibling ? img.nextElementSibling.textContent : img.alt;
                lightboxCaption.textContent = caption;
            });
        });

        // Close Lightbox
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        // Close on outside click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // --- 4. Business Card Flip (Mobile/Touch Support) ---
    const card3d = document.querySelector('.card-3d');
    if (card3d) {
        card3d.addEventListener('click', function () {
            this.classList.toggle('flipped');
        });
    }

    // --- 5. Active Link Highlighting (Simple URL Check) ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

});
