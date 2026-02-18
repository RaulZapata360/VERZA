/* ============================================================
   VERZA DESIGN — Main JavaScript
   Navigation | Before/After Slider | Portfolio Filter | Smooth Scroll
   ============================================================ */

'use strict';

// ── Mobile Menu ──────────────────────────────────────────────
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ── Smooth Scroll for Anchor Links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const headerH = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Before/After Slider ──────────────────────────────────────
(function initBeforeAfter() {
    const slider = document.querySelector('.before-after-wrap');
    if (!slider) return;

    const before = slider.querySelector('.ba-before');
    const beforeImg = slider.querySelector('.ba-before-img');
    const handle = slider.querySelector('.ba-handle');

    let isDragging = false;
    let currentPct = 50;

    function setPosition(pct) {
        pct = Math.max(5, Math.min(95, pct));
        currentPct = pct;
        before.style.width = pct + '%';
        handle.style.left = pct + '%';
        // Compensate inner image so it doesn't stretch
        if (beforeImg) {
            beforeImg.style.width = (100 / (pct / 100)) + '%';
        }
    }

    function getPercent(e) {
        const rect = slider.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        return ((clientX - rect.left) / rect.width) * 100;
    }

    slider.addEventListener('mousedown', (e) => { isDragging = true; setPosition(getPercent(e)); });
    slider.addEventListener('touchstart', (e) => { isDragging = true; setPosition(getPercent(e)); }, { passive: true });

    window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(getPercent(e)); });
    window.addEventListener('touchmove', (e) => { if (isDragging) setPosition(getPercent(e)); }, { passive: true });

    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });

    // Initialize
    setPosition(50);
})();

// ── Portfolio Filter ─────────────────────────────────────────
(function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');

    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            items.forEach((item, i) => {
                const cat = item.dataset.category;
                const show = filter === 'todos' || cat === filter;

                if (show) {
                    item.classList.remove('hidden');
                    // Stagger reveal
                    item.style.transitionDelay = (i * 0.05) + 's';
                } else {
                    item.classList.add('hidden');
                    item.style.transitionDelay = '0s';
                }
            });
        });
    });
})();

// ── Contact Form ─────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('[type="submit"]');
        const original = btn.textContent;
        btn.textContent = '✓ Mensaje enviado';
        btn.disabled = true;
        btn.style.background = '#22c55e';
        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// ── Active Nav Link on Scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    },
    { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ── Video Player Controls ─────────────────────────────
document.querySelectorAll('.video-play-btn').forEach(btn => {
    const videoId = btn.dataset.video;
    const video = document.getElementById(videoId);
    const wrap = btn.closest('.video-wrap');
    if (!video) return;

    const iconPlay = btn.querySelector('.icon-play');
    const iconPause = btn.querySelector('.icon-pause');

    btn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            wrap.classList.add('playing');
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            video.pause();
            wrap.classList.remove('playing');
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    });
});

document.querySelectorAll('.video-mute-btn').forEach(btn => {
    const videoId = document.getElementById(btn.dataset.video);
    const iconMuted = btn.querySelector('.icon-muted');
    const iconUnmuted = btn.querySelector('.icon-unmuted');
    if (!videoId) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // don't trigger play/pause
        videoId.muted = !videoId.muted;
        if (videoId.muted) {
            iconMuted.style.display = 'block';
            iconUnmuted.style.display = 'none';
            btn.setAttribute('aria-label', 'Activar audio');
        } else {
            iconMuted.style.display = 'none';
            iconUnmuted.style.display = 'block';
            btn.setAttribute('aria-label', 'Silenciar');
        }
    });
});

