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

// ── Reel Carousel ─────────────────────────────────────────
(function initReelCarousel() {
    const carousel = document.querySelector('.reel-carousel');
    if (!carousel) return;

    const stage = carousel.querySelector('.reel-stage');
    const slides = Array.from(stage.querySelectorAll('.reel-slide'));
    const prevBtn = stage.querySelector('.reel-arrow--prev');
    const nextBtn = stage.querySelector('.reel-arrow--next');
    const dots = document.querySelectorAll('.reel-dot');
    const infoPanel = carousel.querySelector('.reel-info-panel');
    const totalSlides = slides.length;
    let currentIndex = 0;

    // Position class map: relative offset → CSS class
    const positionClasses = ['prev', 'active', 'next', 'hidden'];

    function pauseAllVideos() {
        slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video && !video.paused) {
                video.pause();
                const wrap = video.closest('.video-wrap');
                if (wrap) wrap.classList.remove('playing');
                const playBtn = slide.querySelector('.video-play-btn');
                if (playBtn) {
                    const iconPlay = playBtn.querySelector('.icon-play');
                    const iconPause = playBtn.querySelector('.icon-pause');
                    if (iconPlay) iconPlay.style.display = 'block';
                    if (iconPause) iconPause.style.display = 'none';
                }
            }
        });
    }

    function autoPlayCurrent() {
        const currentSlide = slides[currentIndex];
        const video = currentSlide.querySelector('video');
        if (video) {
            video.play().catch(() => { });
            const wrap = video.closest('.video-wrap');
            if (wrap) wrap.classList.add('playing');
            const playBtn = currentSlide.querySelector('.video-play-btn');
            if (playBtn) {
                const iconPlay = playBtn.querySelector('.icon-play');
                const iconPause = playBtn.querySelector('.icon-pause');
                if (iconPlay) iconPlay.style.display = 'none';
                if (iconPause) iconPause.style.display = 'block';
            }
        }
    }

    function updateInfoPanel() {
        if (!infoPanel) return;
        const slide = slides[currentIndex];
        const tag = infoPanel.querySelector('.video-tag');
        const h3 = infoPanel.querySelector('h3');
        const p = infoPanel.querySelector('p');
        const counter = infoPanel.querySelector('.reel-counter-current');

        if (tag) tag.textContent = slide.dataset.tag || '';
        if (h3) h3.textContent = slide.dataset.title || '';
        if (p) p.textContent = slide.dataset.desc || '';
        if (counter) counter.textContent = currentIndex + 1;

        // Re-trigger fade animation
        infoPanel.style.animation = 'none';
        infoPanel.offsetHeight; // force reflow
        infoPanel.style.animation = '';
    }

    function goToSlide(index) {
        pauseAllVideos();
        // Infinite loop
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;

        // Assign position classes based on relative distance
        slides.forEach((slide, i) => {
            // Remove all position classes
            slide.classList.remove('prev', 'active', 'next', 'hidden');

            // Calculate relative position (circular)
            let offset = (i - currentIndex + totalSlides) % totalSlides;
            // offset: 0=active, 1=next, totalSlides-1=prev, rest=hidden
            if (offset === 0) slide.classList.add('active');
            else if (offset === 1) slide.classList.add('next');
            else if (offset === totalSlides - 1) slide.classList.add('prev');
            else slide.classList.add('hidden');
        });

        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');

        // Update info panel
        updateInfoPanel();

        // Auto-play current video after transition
        setTimeout(autoPlayCurrent, 300);
    }

    // Arrow events
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Dot events
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide, 10));
        });
    });

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });

    // Touch/swipe support
    let touchStartX = 0;
    stage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    stage.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
        }
    });

    // Initialize — set classes without animation
    slides.forEach(s => s.style.transition = 'none');
    goToSlide(0);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            slides.forEach(s => s.style.transition = '');
        });
    });
})();

// ── Video Player Controls (Play/Pause) ─────────────────
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

// ── Video Mute Controls ─────────────────────────────────
document.querySelectorAll('.video-mute-btn').forEach(btn => {
    const videoEl = document.getElementById(btn.dataset.video);
    const iconMuted = btn.querySelector('.icon-muted');
    const iconUnmuted = btn.querySelector('.icon-unmuted');
    if (!videoEl) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoEl.muted = !videoEl.muted;
        if (videoEl.muted) {
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
