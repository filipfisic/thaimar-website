// Main JavaScript for Thai Mar Website
document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const header = document.getElementById('header');
    if (mobileMenuToggle && header) {
      mobileMenuToggle.addEventListener('click', () => {
        header.classList.toggle('mobile-menu-active');
      });
    }
  
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => header?.classList.remove('mobile-menu-active'));
    });
  
    // Sticky Header + Back to top visibility
    window.addEventListener('scroll', () => {
      if (header) {
        if (window.scrollY > 100) header.classList.add('sticky');
        else header.classList.remove('sticky');
      }
      const backToTopButton = document.getElementById('back-to-top');
      if (backToTopButton) {
        if (window.scrollY > 300) backToTopButton.classList.add('visible');
        else backToTopButton.classList.remove('visible');
      }
    });
  
    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    backToTopButton?.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          if (targetElement && header) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        }
      });
    });
  
    // Reveal-on-scroll animations
    const animateElements = document.querySelectorAll('.benefit-item, .service-card, .about-image');
    function checkIfInView() {
      const windowHeight = window.innerHeight;
      const windowTop = window.scrollY;
      const windowBottom = windowTop + windowHeight;
      animateElements.forEach(el => {
        const rectTop = el.getBoundingClientRect().top + windowTop;
        const rectBottom = rectTop + el.offsetHeight;
        if (rectBottom >= windowTop && rectTop <= windowBottom) el.classList.add('animate');
      });
    }
    const style = document.createElement('style');
    style.textContent = `
      .benefit-item, .service-card, .about-image { opacity: 0; transform: translateY(30px); transition: opacity .6s ease, transform .6s ease; }
      .benefit-item.animate, .service-card.animate, .about-image.animate { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);
    window.addEventListener('load', checkIfInView);
    window.addEventListener('scroll', checkIfInView);
  
    // Init videos + media gallery
    initVideoCards();
    initMediaGallery();
  
    // --- Testimonials (dinamičke točkice) ---
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
  
    if (testimonialItems.length && dotsContainer && prevBtn && nextBtn) {
      let currentSlide = 0;
  
      // Kreiraj točkice
      dotsContainer.innerHTML = '';
      testimonialItems.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
        dot.addEventListener('click', () => { currentSlide = i; showSlide(currentSlide); resetAutoplay(); });
      });
      const dots = dotsContainer.querySelectorAll('.dot');
  
      function showSlide(index) {
        testimonialItems.forEach((item, i) => {
          item.style.display = i === index ? 'block' : 'none';
          dots[i].classList.toggle('active', i === index);
        });
      }
      showSlide(currentSlide);
  
      // Kontrole
      prevBtn.addEventListener('click', () => { currentSlide = (currentSlide - 1 + testimonialItems.length) % testimonialItems.length; showSlide(currentSlide); resetAutoplay(); });
      nextBtn.addEventListener('click', () => { currentSlide = (currentSlide + 1) % testimonialItems.length; showSlide(currentSlide); resetAutoplay(); });
  
      // (Opcionalno) Autoplay – uključi po želji
      let autoplay = setInterval(() => { currentSlide = (currentSlide + 1) % testimonialItems.length; showSlide(currentSlide); }, 5000);
      function resetAutoplay() { clearInterval(autoplay); autoplay = setInterval(() => { currentSlide = (currentSlide + 1) % testimonialItems.length; showSlide(currentSlide); }, 5000); }
    }
  });
  
  // --- YouTube grid (na klik učitava iframe) ---
  function initVideoCards() {
    const cards = document.querySelectorAll('.video-card');
    if (!cards.length) return;
    cards.forEach(card => {
      const id = card.getAttribute('data-yt');
      const thumb = card.querySelector('.video-thumb');
      thumb.style.backgroundImage = `url('https://i.ytimg.com/vi/${id}/hqdefault.jpg')`;
      const startPlayer = () => {
        const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = 'YouTube video player';
        iframe.loading = 'lazy';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        card.replaceChildren(iframe);
      };
      card.addEventListener('click', startPlayer);
      const btn = card.querySelector('.video-play');
      if (btn) btn.addEventListener('click', e => { e.stopPropagation(); startPlayer(); });
    });
  }
  
  // --- Mješovita galerija (slike + YT), horizontalni scroll + strelice ---
  function initMediaGallery() {
    const carousel = document.querySelector('.media-carousel');
    const strip = document.querySelector('.media-strip');
    if (!carousel || !strip) return;
  
    // Thumbnails
    strip.querySelectorAll('.media-card').forEach(card => {
      const type = card.getAttribute('data-type');
      const thumb = card.querySelector('.media-thumb');
      if (type === 'video') {
        const id = card.getAttribute('data-yt');
        thumb.style.backgroundImage = `url('https://i.ytimg.com/vi/${id}/hqdefault.jpg')`;
        const startPlayer = () => {
          const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.title = 'YouTube video player';
          iframe.loading = 'lazy';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
          iframe.allowFullscreen = true;
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = '0';
          card.innerHTML = '';
          card.appendChild(iframe);
        };
        card.addEventListener('click', startPlayer);
        const btn = card.querySelector('.media-play');
        if (btn) btn.addEventListener('click', e => { e.stopPropagation(); startPlayer(); });
      } else if (type === 'image') {
        const src = card.getAttribute('data-src');
        thumb.style.backgroundImage = `url('${src}')`;
      }
    });
  
    // Strelice
    const leftBtn = carousel.querySelector('.media-btn.left');
    const rightBtn = carousel.querySelector('.media-btn.right');
    const scrollAmount = () => {
      const card = strip.querySelector('.media-card');
      return card ? card.getBoundingClientRect().width * 1.1 : 320;
    };
    leftBtn?.addEventListener('click', () => strip.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    rightBtn?.addEventListener('click', () => strip.scrollBy({ left:  scrollAmount(), behavior: 'smooth' }));
  
    // Sakrij strelice kad sve stane
    const toggleArrows = () => {
      const fits = strip.scrollWidth <= strip.clientWidth + 1;
      carousel.classList.toggle('no-arrows', fits);
    };
    const ro = new ResizeObserver(toggleArrows);
    ro.observe(strip);
    toggleArrows();
  
    // UX: wheel horizontal + drag to scroll
    strip.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      strip.scrollLeft += e.deltaX;
    }, { passive: false });
  
    let isDown = false, startX = 0, startLeft = 0;
    strip.addEventListener('pointerdown', (e) => {
      isDown = true; startX = e.clientX; startLeft = strip.scrollLeft;
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener('pointermove', (e) => { if (isDown) strip.scrollLeft = startLeft - (e.clientX - startX); });
    strip.addEventListener('pointerup',   () => { isDown = false; });
    strip.addEventListener('pointercancel', () => { isDown = false; });
  }
