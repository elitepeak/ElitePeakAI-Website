const initApp = () => {
    // 1. Lucide Icons (Fallback)
    if (window.lucide) {
        try {
            window.lucide.createIcons();
        } catch (e) {
            console.error('Lucide error:', e);
        }
    }

    // 2. Navigation Logic
    const navbar = document.getElementById('navbar');
    const stickyCta = document.getElementById('sticky-cta');
    const hero = document.getElementById('hero');

    const handleScroll = () => {
        const scrolled = window.scrollY;
        
        // Sticky Navbar Tweak
        if (navbar) {
            if (scrolled > 48) navbar.style.boxShadow = '0 1px 1px rgba(0,0,0,0.05)';
            else navbar.style.boxShadow = 'none';
        }

        // Sticky CTA Visibility
        if (hero && stickyCta) {
            const heroBottom = hero.getBoundingClientRect().bottom;
            if (heroBottom < 0) stickyCta.classList.add('visible');
            else stickyCta.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 3. Reveal System (The Apple Fade-Up)
    if (window.IntersectionObserver) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    revealObserver.unobserve(e.target); // Standard efficiency
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' 
        });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for extremely old browsers
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Robust Initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
