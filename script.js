const initApp = () => {
    try {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    } catch (err) {
        console.error('Lucide icon error:', err);
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Interactive Hero Glow
    const hero = document.getElementById('hero');
    const heroBg = document.querySelector('.hero-bg');
    if (hero && heroBg) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = hero.getBoundingClientRect();
            const x = ((clientX - left) / width) * 100;
            const y = ((clientY - top) / height) * 100;
            heroBg.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(37,99,235,0.12) 0%, transparent 50%),
                radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 80% 80%, rgba(37,99,235,0.04) 0%, transparent 50%)
            `;
        });
    }

    // Service Card Spotlight
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top } = card.getBoundingClientRect();
            const x = clientX - left;
            const y = clientY - top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Intersection Observer for reveals
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(r => revealObserver.observe(r));

    // Fallback: If elements are still invisible after 2 seconds (e.g., due to CDN/Vercel script loading issues), show them unconditionally
    setTimeout(() => {
        reveals.forEach(r => {
            if (!r.classList.contains('visible')) {
                r.style.transition = 'opacity 1s ease, transform 1s ease';
                r.classList.add('visible');
            }
        });
    }, 2000);

    // FAQ accordion
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const topValue = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: topValue, behavior: 'smooth' });
            }
        });
    });

    // Counter animation
    function animateCounter(el, target, suffix = '', duration = 1800) {
        const start = performance.now();
        const tick = (now) => {
            const elapsed = Math.min(now - start, duration);
            const progress = elapsed / duration;
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(eased * target);
            el.textContent = (target >= 0 && suffix === '%' ? '+' : '') + current + suffix;
            if (elapsed < duration) requestAnimationFrame(tick);
            else el.textContent = (target >= 0 && suffix === '%' ? '+' : '') + target + suffix;
        };
        requestAnimationFrame(tick);
    }

    // Trigger counters when ROI section in view
    const roiSection = document.getElementById('roi');
    let countersRun = false;
    const roiObserverOptions = { threshold: 0.25 };
    const roiObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !countersRun) {
                countersRun = true;
                const stats = [
                    { selector: '.roi-stat:nth-child(1) .roi-big', target: 30, suffix: '%' },
                    { selector: '.roi-stat:nth-child(2) .roi-big', target: 14, suffix: 'D' },
                    { selector: '.roi-stat:nth-child(3) .roi-big', target: 100, suffix: '%' },
                    { selector: '.roi-stat:nth-child(4) .roi-big', target: 0, suffix: 'H' }
                ];
                stats.forEach(s => {
                    const el = document.querySelector(s.selector);
                    if (el) animateCounter(el, s.target, s.suffix);
                });
            }
        });
    }, roiObserverOptions);

    if (roiSection) roiObserver.observe(roiSection);

    // Hamburger toggle (mobile)
    const ham = document.getElementById('ham');
    const navLinks = document.querySelector('.nav-links');
    if (ham && navLinks) {
        ham.addEventListener('click', () => {
            ham.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                ham.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!ham.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                ham.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Back to Top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already ready
    initApp();
}
