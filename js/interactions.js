/* ============================================================
   VERZA DESIGN — Interactions & Premium Effects
   Magnetic Cursor | Scroll Reveal | Parallax | SVG Underline
   ============================================================ */

'use strict';

// ── Magnetic Cursor ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

if (cursor && cursorFollow) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Lerp follower for smooth lag effect
  function animateCursor() {
    followX += (mouseX - followX) * 0.12;
    followY += (mouseY - followY) * 0.12;
    cursorFollow.style.left = followX + 'px';
    cursorFollow.style.top = followY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Magnetic hover effect on interactive elements
  const magneticEls = document.querySelectorAll(
    'a, button, .proj-slide, .service-card, .filter-btn, .social-link, #whatsapp-fab'
  );

  magneticEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

// ── Scroll Reveal (Intersection Observer) ───────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── Parallax Effect ──────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');

function handleParallax() {
  const scrollY = window.scrollY;

  // Hero background parallax
  if (heroBg) {
    heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.35}px)`;
  }
}

window.addEventListener('scroll', handleParallax, { passive: true });

// ── Header Scroll State ──────────────────────────────────────
const header = document.getElementById('header');

function updateHeader() {
  if (!header) return;
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
    header.classList.remove('hero-mode');
  } else {
    header.classList.remove('scrolled');
    header.classList.add('hero-mode');
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader(); // run on load

// ── Stat Counter Animation ───────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const suffix = el.dataset.suffix || '';

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-number');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = 'true';
          const target = parseInt(numEl.dataset.target, 10);
          animateCounter(numEl, target);
        }
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));
