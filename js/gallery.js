/* ============================================================
   VERZA DESIGN — Gallery Page JavaScript
   Filters | Lightbox | Cascade Click-to-Project
   ============================================================ */

'use strict';

(function initGallery() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxLoader = document.getElementById('lightbox-loader');
    const lightboxProject = document.getElementById('lightbox-project');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIdx = 0;
    let currentProjectName = '';

    // ── Gallery Filters ──
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const categories = document.querySelectorAll('.cascade-category');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            categories.forEach(cat => {
                if (filter === 'todos' || cat.dataset.category === filter) {
                    cat.classList.remove('hidden');
                } else {
                    cat.classList.add('hidden');
                }
            });
        });
    });

    // ── Cascade Item Click → Lightbox ──
    document.querySelectorAll('.cascada-item').forEach(item => {
        item.addEventListener('click', () => {
            const images = (item.dataset.images || '').split('|').filter(Boolean);
            if (!images.length) return;

            currentImages = images;
            currentIdx = 0;
            currentProjectName = item.dataset.name || '';
            openLightbox();
        });
    });

    function openLightbox() {
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('lightbox-open');
    }

    function updateLightbox() {
        if (!currentImages.length) return;
        
        // Show loader, hide image until loaded
        lightboxLoader?.classList.add('active');
        lightboxImg.style.opacity = '0.5';
        
        lightboxImg.src = currentImages[currentIdx];
        lightboxProject.textContent = currentProjectName;
        lightboxCounter.textContent = `${currentIdx + 1} / ${currentImages.length}`;
        
        // Hide loader when image loads
        lightboxImg.onload = function() {
            lightboxLoader?.classList.remove('active');
            lightboxImg.style.opacity = '1';
        };
        
        lightboxImg.onerror = function() {
            lightboxLoader?.classList.remove('active');
            lightboxImg.style.opacity = '1';
        };
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('lightbox-open');
    }

    lightboxClose?.addEventListener('click', closeLightbox);

    lightboxPrev?.addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
    });

    lightboxNext?.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % currentImages.length;
        updateLightbox();
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') lightboxNext.click();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'Escape') closeLightbox();
    });

})();
