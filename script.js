const initApp = () => {
    // 1. Lucide Icons (Fallback)
    if (window.lucide) window.lucide.createIcons();

    // 2. Navigation Logic
    const navbar = document.getElementById('navbar');
    const stickyCta = document.getElementById('sticky-cta');
    const hero = document.getElementById('hero');

    const handleScroll = () => {
        const scrolled = window.scrollY;
        
        // Sticky Navbar Color (Not needed if constant height, adding subtle shadow/blur tweak)
        if (scrolled > 48) navbar.style.boxShadow = '0 1px 1px rgba(0,0,0,0.05)';
        else navbar.style.boxShadow = 'none';

        // Sticky CTA Visibility
        if (hero) {
            const heroBottom = hero.getBoundingClientRect().bottom;
            if (heroBottom < 0) stickyCta.classList.add('visible');
            else stickyCta.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 3. Reveal System (The Apple Fade-Up)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Apple-like delay
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60, // Navbar height offset
                    behavior: 'smooth'
                });
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', initApp);
// Ensure it runs even if DOMContentLoaded is missed
if (document.readyState === 'complete' || document.readyState === 'interactive') initApp();
