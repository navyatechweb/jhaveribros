/**
 * Jhaveri Bros. & Co. Pvt. Ltd. — Master Frontend Controller
 * Established 27 July 1914 | Metro House, Mumbai
 */

function init() {
  initNavigation();
  initOperatingHours();
  initLightbox();
  initEnquiryForms();
  initMontageViewer();
  initHeritageBgSlider();
  initShowroomSlider();
  initFloatingWhatsApp();
  initAIAssistant();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ==========================================================================
   1. NAVIGATION & DROPDOWN MANAGEMENT
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.mobile-drawer-close');
  const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

  // Sticky header transition on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Open/Close
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      mobileDrawer.querySelector('button, a')?.focus();
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
      mobileToggle.focus();
    };

    drawerClose?.addEventListener('click', closeDrawer);
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // Mobile Submenu accordions
  mobileSubmenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.closest('.mobile-nav-item');
      const submenu = parent?.querySelector('.mobile-submenu');
      if (submenu) {
        submenu.classList.toggle('open');
        const isExpanded = submenu.classList.contains('open');
        toggle.setAttribute('aria-expanded', isExpanded);
      }
    });
  });

  // Desktop Dropdown keyboard accessibility
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    const menu = item.querySelector('.dropdown-menu');

    trigger?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        menu?.querySelector('a')?.focus();
      }
    });

    menu?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        trigger?.focus();
      }
    });
  });
}

/* ==========================================================================
   2. LIVE OPERATING HOURS (INDIAN STANDARD TIME UTC+5:30)
   ========================================================================== */
function initOperatingHours() {
  const statusElement = document.getElementById('liveShowroomStatus');
  if (!statusElement) return;

  function updateStatus() {
    // Current time in IST (UTC+5:30)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));

    const day = istTime.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Showroom hours: Mon - Sat 10:30 AM to 7:30 PM (630 to 1170 minutes)
    const openMinutes = 10 * 60 + 30; // 10:30 AM
    const closeMinutes = 19 * 60 + 30; // 7:30 PM

    let isOpen = false;
    let message = "";

    if (day === 0) {
      isOpen = false;
      message = "Showroom Closed Today (Sunday) &bull; Reopens Monday 10:30 AM IST";
    } else {
      if (totalMinutes >= openMinutes && totalMinutes < closeMinutes) {
        isOpen = true;
        message = `Showroom Open Now &bull; Closes at 7:30 PM IST`;
      } else if (totalMinutes < openMinutes) {
        isOpen = false;
        message = `Showroom Opens Today at 10:30 AM IST`;
      } else {
        if (day === 6) {
          message = `Showroom Closed for the Evening &bull; Reopens Monday 10:30 AM IST`;
        } else {
          message = `Showroom Closed for the Evening &bull; Reopens Tomorrow 10:30 AM IST`;
        }
      }
    }

    statusElement.innerHTML = `
      <span class="status-indicator ${isOpen ? 'open' : 'closed'}"></span>
      <span>${message}</span>
    `;
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/* ==========================================================================
   3. UNIVERSAL LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image preview');
    modal.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close preview">&times;</button>
        <img src="" alt="" id="lightboxImg">
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const lightboxImg = modal.querySelector('#lightboxImg');
  const lightboxCaption = modal.querySelector('#lightboxCaption');
  const closeBtn = modal.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption || 'Jhaveri Bros gallery item';
    lightboxCaption.textContent = caption || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Attach to zoomable triggers
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-lightbox') || el.querySelector('img')?.src;
      const caption = el.getAttribute('data-caption') || el.querySelector('img')?.alt;
      if (src) openLightbox(src, caption);
    });
  });
}

/* ==========================================================================
   4. CLIENTELE MONTAGE VIEWER
   ========================================================================== */
function initMontageViewer() {
  const montageTrigger = document.getElementById('viewMontageBtn');
  if (montageTrigger) {
    montageTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.querySelector('.lightbox-modal');
      const lightboxImg = modal?.querySelector('#lightboxImg');
      const lightboxCaption = modal?.querySelector('#lightboxCaption');
      if (modal && lightboxImg) {
        lightboxImg.src = '/assets/img/clientele/customers.jpg';
        lightboxCaption.textContent = 'Archival Clientele Montage — Jhaveri Bros. & Co. Pvt. Ltd.';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

/* ==========================================================================
   5. ENQUIRY FORMS ENGINE & WHATSAPP DIRECT QUOTATION (+91 93554 12903)
   ========================================================================== */
function initEnquiryForms() {
  const enquiryForm = document.getElementById('enquiryForm') || document.getElementById('contactForm');
  if (!enquiryForm) return;

  // Pre-select category if URL contains query parameters (e.g. ?category=trophies or ?service=laser)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') || urlParams.get('type') || urlParams.get('service');
  const typeSelect = enquiryForm.querySelector('#enquiryType');
  if (categoryParam && typeSelect) {
    const paramLower = categoryParam.toLowerCase();
    Array.from(typeSelect.options).forEach(opt => {
      if (opt.value.toLowerCase().includes(paramLower) || paramLower.includes(opt.value.toLowerCase().slice(0, 5))) {
        opt.selected = true;
      }
    });
  }

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check honeypot
    const honeypot = enquiryForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('Bot submission blocked.');
      return;
    }

    let isValid = true;
    const requiredFields = enquiryForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      const errorMsg = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        if (errorMsg) errorMsg.classList.add('visible');
      } else {
        field.classList.remove('error');
        if (errorMsg) errorMsg.classList.remove('visible');
      }

      // Email validation
      if (field.type === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          isValid = false;
          field.classList.add('error');
          if (errorMsg) {
            errorMsg.textContent = 'Please enter a valid email address.';
            errorMsg.classList.add('visible');
          }
        }
      }
    });

    if (!isValid) {
      const firstError = enquiryForm.querySelector('.form-control.error');
      firstError?.focus();
      return;
    }

    const submitBtn = enquiryForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Formatting for WhatsApp...</span>`;

    // Extract all form values
    const formData = new FormData(enquiryForm);
    const fullName = (formData.get('fullName') || formData.get('name') || '').trim();
    const organization = (formData.get('organization') || '').trim();
    const email = (formData.get('email') || '').trim();
    const phone = (formData.get('phone') || '').trim();
    const enquiryType = (formData.get('enquiryType') || formData.get('category') || 'Custom Requirement').trim();
    const quantity = (formData.get('quantity') || '').trim();
    const requiredBy = (formData.get('requiredBy') || '').trim();
    const deliveryLocation = (formData.get('deliveryLocation') || '').trim();
    const requirements = (formData.get('requirements') || formData.get('message') || '').trim();

    // Target WhatsApp Number requested by user
    const waPhone = '919355412903';

    // Format all details cleanly according to form inputs
    const waLines = [
      '*JHAVERI BROS. & CO. PVT. LTD.*',
      '🏆 *DIRECT QUOTATION ENQUIRY (EST. 1914)*',
      '─────────────────────────',
      `👤 *Full Name:* ${fullName}`,
      `🏢 *Company / Institution:* ${organization || 'Individual / Private'}`,
      `📧 *Email Address:* ${email}`,
      `📞 *Phone / Mobile:* ${phone}`,
      `🏷️ *Enquiry Category:* ${enquiryType}`,
      `📦 *Approximate Quantity:* ${quantity || 'Not specified'}`,
      `📅 *Required By Date:* ${requiredBy || 'Flexible'}`,
      `📍 *Delivery Location:* ${deliveryLocation || 'Pan-India / Not specified'}`,
      '',
      '📝 *Specifications & Customization Details:*',
      requirements || 'No additional specifications provided.',
      '─────────────────────────',
      '_Submitted via Jhaveri Bros. Website Enquiry Portal_'
    ];

    const waText = waLines.join('\n');
    const waUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const statusBox = enquiryForm.querySelector('.form-status');
      if (statusBox) {
        statusBox.className = 'form-status success';
        statusBox.style.display = 'block';
        statusBox.innerHTML = `
          <strong>Enquiry Formatted for WhatsApp!</strong> Thank you, ${fullName}. Your details have been formatted and dispatched to Jhaveri Bros. WhatsApp Quotation Desk (<strong>+91 93554 12903</strong>).
          <div style="margin-top:0.85rem;">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-gold" style="display:inline-flex; align-items:center; gap:0.5rem; text-decoration:none;">
              <span>Continue to WhatsApp (+91 93554 12903)</span> &rarr;
            </a>
          </div>
        `;
      }

      // Open WhatsApp in a new tab/app; if blocked, fallback to window.location.href
      const win = window.open(waUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = waUrl;
      }
    }, 500);
  });
}

/* ==========================================================================
   6. HERITAGE SEAL BACKGROUND SLIDER (LEFT-TO-RIGHT CONTINUOUS LOOP)
   ========================================================================== */
function initHeritageBgSlider() {
  const container = document.getElementById('heritageSealSlider');
  if (!container) return;

  const CACHE_BUST = '?v=' + Date.now();
  const rawImages = [
    '/assets/img/heritage-slides/1.jpg',
    '/assets/img/heritage-slides/2.jpg',
    '/assets/img/heritage-slides/3.jpg',
    '/assets/img/heritage-slides/4.jpg',
    '/assets/img/heritage-slides/5.jpg',
    '/assets/img/heritage-slides/6.jpg',
    '/assets/img/heritage-slides/7.jpg',
    '/assets/img/heritage-slides/8.jpg',
    '/assets/img/heritage-slides/9.jpg',
    '/assets/img/heritage-slides/10.jpg',
    '/assets/img/heritage-slides/11.jpg',
    '/assets/img/heritage-slides/12.jpg',
    '/assets/img/heritage-slides/13.jpg',
    '/assets/img/heritage-slides/14.jpg',
    '/assets/img/heritage-slides/15.jpg',
    '/assets/img/heritage-slides/16.jpg',
    '/assets/img/heritage-slides/17.jpg',
    '/assets/img/heritage-slides/18.jpg',
    '/assets/img/heritage-slides/advertisement.jpg',
    '/assets/img/heritage-slides/advertisement2.jpg',
    '/assets/img/heritage-slides/EXIM-AWARDS.jpg',
    '/assets/img/heritage-slides/Exim-AWARDS1.jpg',
    '/assets/img/heritage-slides/GOVERNOR-OF-MAHARSHTRA-SHRI-K.SHANKARANARAYANAN.jpg',
    '/assets/img/heritage-slides/LIC-GOA-CLIA.jpg',
    '/assets/img/heritage-slides/shop.jpg',
    '/assets/img/heritage-slides/shop1.jpg',
    '/assets/img/heritage-slides/shop2.jpg',
    '/assets/img/heritage-slides/shop3.jpg',
    '/assets/img/heritage-slides/shop4.jpg',
    '/assets/img/heritage-slides/shop5.jpg'
  ];
  const images = rawImages.map(src => src + CACHE_BUST);

  let currentIndex = 0;
  let isTransitioning = false;

  const preloadImage = (src) => {
    const img = new Image();
    img.src = src;
  };
  // Preload first batch
  images.slice(0, 5).forEach(preloadImage);

  // Hero section ambient background slider elements
  const heroContainer = document.getElementById('heroBgSlider');
  let activeHeroSlide = heroContainer ? heroContainer.querySelector('.hero-slide') : null;

  function createHeroSlide(src) {
    const slide = document.createElement('div');
    slide.className = 'hero-slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.className = 'hero-slide-img';
    img.loading = 'eager';
    slide.appendChild(img);
    return slide;
  }

  function transferToHeroBackground(src) {
    if (!heroContainer) return;

    const incomingHeroSlide = createHeroSlide(src);
    incomingHeroSlide.classList.add('pos-right');
    heroContainer.appendChild(incomingHeroSlide);

    // Force reflow
    void incomingHeroSlide.getBoundingClientRect();

    requestAnimationFrame(() => {
      incomingHeroSlide.classList.remove('pos-right');
      incomingHeroSlide.classList.add('is-active');

      if (activeHeroSlide) {
        activeHeroSlide.classList.remove('is-active');
        activeHeroSlide.classList.add('pos-left');

        const oldHeroSlide = activeHeroSlide;
        setTimeout(() => {
          if (oldHeroSlide && oldHeroSlide.parentNode === heroContainer) {
            heroContainer.removeChild(oldHeroSlide);
          }
        }, 2000);
      }

      activeHeroSlide = incomingHeroSlide;
    });
  }

  function createSlide(src) {
    const slide = document.createElement('div');
    slide.className = 'heritage-slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Jhaveri Bros Historic Collection Archive';
    img.className = 'heritage-slide-img';
    img.loading = 'eager';
    slide.appendChild(img);
    return slide;
  }

  // Initial active slide (reuse pre-rendered slide if present)
  let activeSlide = container.querySelector('.heritage-slide');
  if (!activeSlide) {
    activeSlide = createSlide(images[0]);
    activeSlide.classList.add('is-active');
    container.appendChild(activeSlide);
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    // The image currently visible that is about to leave the card
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImgSrc = images[nextIndex];

    // Preload image after next
    preloadImage(images[(nextIndex + 1) % images.length]);

    const incomingSlide = createSlide(nextImgSrc);
    incomingSlide.classList.add('pos-right');
    container.appendChild(incomingSlide);

    // Force layout reflow
    void incomingSlide.getBoundingClientRect();

    requestAnimationFrame(() => {
      // 1. Incoming card slide glides in from right to center with smooth ease
      incomingSlide.classList.remove('pos-right');
      incomingSlide.classList.add('is-active');

      // 2. Active card slide glides out from center to left
      if (activeSlide) {
        activeSlide.classList.remove('is-active');
        activeSlide.classList.add('pos-left');

        const oldSlide = activeSlide;
        setTimeout(() => {
          if (oldSlide && oldSlide.parentNode === container) {
            container.removeChild(oldSlide);
          }
        }, 1800);
      }

      // 3. SYNCHRONIZE HERO BACKGROUND WITH CARD IMAGE (RIGHT-TO-LEFT SMOOTH MOTION)
      setTimeout(() => {
        transferToHeroBackground(nextImgSrc);
      }, 100);

      activeSlide = incomingSlide;
      currentIndex = nextIndex;

      setTimeout(() => {
        isTransitioning = false;
      }, 1700);
    });
  }

  // Right-to-left smooth animation loop with pan-to-zoom
  setInterval(nextSlide, 5500);
}

/* ==========================================================================
   7. SHOWROOM LANDMARK CARD SLIDER (SHOP 1-5 RIGHT-TO-LEFT INFINITE LOOP)
   ========================================================================== */
function initShowroomSlider() {
  const container = document.getElementById('showroomSlider');
  if (!container) return;

  const CACHE_BUST = '?v=' + Date.now();
  const rawImages = [
    '/assets/img/history/shop1.jpg',
    '/assets/img/history/shop2.jpg',
    '/assets/img/history/shop3.jpg',
    '/assets/img/history/shop4.jpg',
    '/assets/img/history/shop5.jpg'
  ];
  const images = rawImages.map(src => src + CACHE_BUST);

  let currentIndex = 0;
  let isTransitioning = false;

  const preloadImage = (src) => {
    const img = new Image();
    img.src = src;
  };
  images.forEach(preloadImage);

  function createSlide(src) {
    const slide = document.createElement('div');
    slide.className = 'showroom-slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Historic showroom of Jhaveri Bros at 5 Metro House Mumbai';
    img.className = 'showroom-slide-img';
    img.loading = 'eager';
    slide.appendChild(img);
    return slide;
  }

  let activeSlide = container.querySelector('.showroom-slide');
  if (!activeSlide) {
    activeSlide = createSlide(images[0]);
    activeSlide.classList.add('is-active');
    container.appendChild(activeSlide);
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    const nextIndex = (currentIndex + 1) % images.length;
    const nextImgSrc = images[nextIndex];

    // Preload next image in loop
    preloadImage(images[(nextIndex + 1) % images.length]);

    const incomingSlide = createSlide(nextImgSrc);
    incomingSlide.classList.add('pos-right');
    container.appendChild(incomingSlide);

    // Force layout reflow
    void incomingSlide.getBoundingClientRect();

    requestAnimationFrame(() => {
      // 1. Incoming slide glides into the card from right to center
      incomingSlide.classList.remove('pos-right');
      incomingSlide.classList.add('is-active');

      // 2. Active slide glides out from center to left
      if (activeSlide) {
        activeSlide.classList.remove('is-active');
        activeSlide.classList.add('pos-left');

        const oldSlide = activeSlide;
        setTimeout(() => {
          if (oldSlide && oldSlide.parentNode === container) {
            container.removeChild(oldSlide);
          }
        }, 1700);
      }

      activeSlide = incomingSlide;
      currentIndex = nextIndex;

      setTimeout(() => {
        isTransitioning = false;
      }, 1600);
    });
  }

  // Infinite loop - changes slide smoothly every 4.2 seconds
  setInterval(nextSlide, 4200);
}



/* ==========================================================================
   8. FLOATING WHATSAPP BUTTON (BOTTOM-LEFT)
   ========================================================================== */
function initFloatingWhatsApp() {
  if (document.querySelector('.jb-floating-whatsapp')) return;

  const phone = '919355412903';
  const prefill = encodeURIComponent('Hello Jhaveri Bros., I would like to enquire about your trophies, awards, or corporate gifts.');
  const waUrl = `https://wa.me/${phone}?text=${prefill}`;

  const btn = document.createElement('a');
  btn.className = 'jb-floating-whatsapp';
  btn.href = waUrl;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  btn.title = 'Chat on WhatsApp';
  btn.style.cssText = 'position:fixed;bottom:max(24px,env(safe-area-inset-bottom,24px));left:max(22px,env(safe-area-inset-left,22px));z-index:9990;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#25D366;color:#ffffff;box-shadow:0 4px 20px rgba(37,211,102,0.45);text-decoration:none;-webkit-tap-highlight-color:transparent;';
  btn.innerHTML = `
    <span class="jb-whatsapp-tooltip" aria-hidden="true">Chat on WhatsApp</span>
    <svg class="jb-whatsapp-icon" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.127-.518-1.745-.722-2.885-2.503-2.973-2.62-.088-.117-.714-.95-.714-1.808 0-.858.45-1.282.61-1.458.16-.176.352-.22.47-.22.12 0 .24.002.344.006.11.005.258-.042.404.308.15.36.513 1.25.558 1.342.045.093.076.202.015.322-.061.12-.092.196-.182.302-.091.107-.191.238-.273.32-.092.091-.188.19-.081.373.107.183.475.784 1.02 1.27.703.627 1.296.82 1.48.912.183.092.29.077.397-.046.108-.123.46-.536.584-.72.123-.183.247-.153.413-.092.167.061 1.057.498 1.238.589.182.091.303.137.348.214.045.077.045.447-.099.852zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.176L2 22l4.982-1.307A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.154c-1.637 0-3.151-.487-4.42-1.325l-.316-.208-2.955.775.789-2.88-.228-.363A8.118 8.118 0 013.846 12c0-4.496 3.658-8.154 8.154-8.154s8.154 3.658 8.154 8.154-3.658 8.154-8.154 8.154z"/>
    </svg>
  `;

  document.body.appendChild(btn);
}

/* ==========================================================================
   9. FLOATING AI WEBSITE ASSISTANT & CONCIERGE (BOTTOM-RIGHT)
   ========================================================================== */
function initAIAssistant() {
  if (document.getElementById('jbAssistantLauncher')) return;

  // 1. Structured Knowledge Base
  const JB_KB = {
    company: {
      name: 'Jhaveri Bros. & Co. Pvt. Ltd.',
      founded: '27 July 1914',
      founder: 'Late Shri Shyamdas Jhaveri',
      leaderHeritage: 'Late Shri Durlabh Jhaveri',
      director: 'Seyjhal D. Jhaveri',
      address: '5, Metro House, next to Metro Cinemas, Dhobi Talao, Mumbai – 400 020, Maharashtra, India',
      landmark: 'Next to Metro Cinemas, Dhobi Talao, Marine Lines / CST Area, South Mumbai',
      hours: 'Monday – Saturday: 10:30 AM – 7:30 PM IST (Sunday: Closed)',
      phones: ['+91 22 2207 1818', '+91 22 2201 4380', '+91 98336 35014', '+91 98331 31091'],
      email: 'info@jhaveribros.com',
      whatsapp: '+91 93554 12903',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Jhaveri+Bros+%26+Co+Pvt+Ltd+Metro+House+Dhobi+Talao+Mumbai',
      managedBy: 'Navya Tech Industry',
      managedByUrl: 'https://navyatech.co.in',
      heritageStory: 'Celebrating over 110 years (11 decades) of continuous craftsmanship and commercial integrity since 1914. Known for crafting awards for state governments, corporate galas, and prestigious sports federations.'
    },
    specialCards: {
      navigation: {
        title: 'Google Maps Navigation & Directions',
        desc: 'Get live GPS driving, transit, or walking directions directly to our Metro House showroom next to Metro Cinemas, Dhobi Talao, Mumbai.',
        route: 'https://www.google.com/maps/dir/?api=1&destination=Jhaveri+Bros+%26+Co+Pvt+Ltd+Metro+House+Dhobi+Talao+Mumbai',
        image: '/assets/img/history/shop1.jpg',
        actionLabel: 'Open Google Maps',
        secondaryRoute: 'tel:+912222071818',
        secondaryLabel: 'Call Showroom'
      },
      aboutUs: {
        title: '110+ Years Heritage & Legacy (Est. 1914)',
        desc: 'Founded 27 July 1914 by Late Shri Shyamdas Jhaveri. Discover 11 decades of continuous artisanal excellence in South Mumbai.',
        route: '/about-us',
        image: '/assets/img/history/shop.jpg',
        actionLabel: 'Read Our Story',
        secondaryRoute: '/clientele',
        secondaryLabel: 'View Clientele'
      },
      clientele: {
        title: 'Prestigious Commissions & Clientele',
        desc: 'Honored by Government of Maharashtra, CCI, Bombay Gymkhana, Tata, Reliance, and Bollywood & Olympic legends.',
        route: '/clientele',
        image: '/assets/img/notable/AMITABH-BACCHHAN-RECEIVING-JB-TROPHY.jpg',
        actionLabel: 'View Notable Clients',
        secondaryRoute: '/about-us',
        secondaryLabel: 'Our Heritage'
      },
      enquiry: {
        title: 'Direct Quotation & Custom Orders',
        desc: 'Submit your requirements, custom quantities, and personalization text directly to our team for an official itemized quotation.',
        route: '/enquiry',
        image: '/assets/img/products/trophies/trophies-featured.jpg',
        actionLabel: 'Request a Quote',
        secondaryRoute: 'https://wa.me/919355412903',
        secondaryLabel: 'Chat on WhatsApp'
      },
      navyaTech: {
        title: 'Managed by Navya Tech Industry',
        desc: 'Official website engineering, architecture, and digital experience management provided by Navya Tech Industry.',
        route: 'https://navyatech.co.in',
        image: '/assets/img/brand/new-header.png',
        actionLabel: 'Visit Navya Tech',
        secondaryRoute: '/contact',
        secondaryLabel: 'Contact Showroom'
      },
      allProducts: {
        title: 'Signature Collections (7,000+ Designs)',
        desc: 'Explore 6 product lines: Trophies, Corporate Gifts, Medals & Cups, Plaques, Salvers, and Pure Silver Keepsakes.',
        route: '/products',
        image: '/assets/img/products/trophies/trophies-featured.jpg',
        actionLabel: 'Explore All Products',
        secondaryRoute: '/enquiry',
        secondaryLabel: 'Enquire Online'
      },
      allServices: {
        title: '9 Master Craftsmanship Techniques',
        desc: 'Laser, Pantograph, Chemical Etching, Embossing, Screen Printing, Sand Blasting, 3D Sub-Surface Laser, Domed Decals, Foil.',
        route: '/services',
        image: '/assets/img/services/laser-engraving1.jpg',
        actionLabel: 'View All Services',
        secondaryRoute: '/enquiry',
        secondaryLabel: 'Request Quote'
      }
    },
    products: [
      {
        id: 'corporate-gifts',
        title: 'Corporate Gifts & Executive Mementoes',
        route: '/products/corporate-gifts',
        image: '/assets/img/products/corporate-gifts/MEMENTOES_3127.jpg',
        desc: 'Executive desk accessories, crystal paperweights, engraved timepieces, and customized corporate keepsakes for milestones and conferences.',
        actionLabel: 'View Corporate Gifts',
        keywords: ['corporate gift', 'corporate gifts', 'memento', 'mementoes', 'executive gift', 'desktop', 'paperweight', 'timepiece', 'clock', 'pen stand', 'keepsake', 'conference gift', 'annual day', 'employee recognition', 'business gift', 'corporate event', 'executive memento']
      },
      {
        id: 'trophies',
        title: 'Trophies & Recognition Awards',
        route: '/products/trophies',
        image: '/assets/img/products/trophies/trophies-featured.jpg',
        desc: 'Signature collection of over 7,000+ designs spanning optical crystal, hand-cast brass, contemporary acrylic, and marble-base trophies.',
        actionLabel: 'View Trophies',
        keywords: ['trophy', 'trophies', 'award', 'awards', 'crystal trophy', 'acrylic trophy', 'brass trophy', 'sports trophy', 'championship trophy', 'recognition award', 'crystal award', 'acrylic award', 'custom trophy', 'star trophy', 'glass award']
      },
      {
        id: 'cups-medals-shields',
        title: 'Cups, Medals & Shields',
        route: '/products/cups-medals-shields',
        image: '/assets/img/products/cups-medals-shields/CUPS_18.jpg',
        desc: 'Silver-plated championship cups, custom tournament medallions with ribbons, and hand-polished teak wood presentation shields.',
        actionLabel: 'View Cups & Medals',
        keywords: ['cup', 'cups', 'silver cup', 'medal', 'medals', 'medallion', 'ribbon', 'shield', 'shields', 'tournament', 'sports meet', 'athletics', 'championship cup', 'school sports', 'gold medal', 'silver medal', 'bronze medal', 'wooden shield']
      },
      {
        id: 'plaques',
        title: 'Commemorative Plaques & Citations',
        route: '/products/plaques',
        image: '/assets/img/products/plaques/Plaques_2119.jpg',
        desc: 'Hand-finished Burma teak wood plaques, etched brass appreciation plates, acrylic certificates, and formal retirement citations.',
        actionLabel: 'View Plaques',
        keywords: ['plaque', 'plaques', 'citation', 'citations', 'honor board', 'wooden plaque', 'teak', 'felicitation', 'appreciation', 'retirement plaque', 'certificate', 'retirement award', 'brass plaque', 'wall plaque']
      },
      {
        id: 'salvers',
        title: 'Presentation Salvers & Trays',
        route: '/products/salvers',
        image: '/assets/img/products/salvers/Salvers_728.jpg',
        desc: 'Chased silver-plated salvers, engraved ceremonial trays, and ornate presentation dishes for jubilees, state banquets, and milestone honors.',
        actionLabel: 'View Salvers',
        keywords: ['salver', 'salvers', 'tray', 'trays', 'plate', 'plates', 'thali', 'ceremonial tray', 'jubilee', 'filigree', 'presentation plate', 'silver plate', 'brass plate', 'engraved tray']
      },
      {
        id: 'silver',
        title: 'Silver Gifts & Keepsakes',
        route: '/products/silver',
        image: '/assets/img/products/silver/SILVER_53.jpg',
        desc: 'Hallmarked pure silver coins, minted medallions, silver presentation cups, traditional pooja articles, and luxury festive keepsakes.',
        actionLabel: 'View Silver Gifts',
        keywords: ['silver', 'silver gift', 'silver gifts', 'silver coin', 'pure silver', 'silver article', 'pooja', 'diwali', 'hallmarked', 'silver cup', 'silver bowl', 'coin', 'coins', 'wedding gift', 'silverware', 'silver coin 999', '999 silver']
      }
    ],
    services: [
      {
        id: 'laser-engraving',
        title: 'Laser Engraving',
        route: '/services',
        image: '/assets/img/services/laser-engraving1.jpg',
        desc: 'Computer-guided precision laser marking on metals, acrylic, crystal, and wood for crisp corporate logos and intricate citation texts.',
        actionLabel: 'Laser Engraving Details',
        keywords: ['laser', 'laser engraving', 'laser marking', 'laser etching', 'fiber laser', 'co2 laser']
      },
      {
        id: 'pantograph',
        title: 'Pantograph Engraving',
        route: '/services',
        image: '/assets/img/services/pantograph.jpg',
        desc: 'Traditional rotary diamond-drag pantograph engraving tailored for curved surfaces, trophy cups, salvers, and bowls with deep permanent relief.',
        actionLabel: 'Pantograph Details',
        keywords: ['pantograph', 'rotary engraving', 'diamond drag', 'curved engraving', 'rotary']
      },
      {
        id: 'etching',
        title: 'Chemical Etching',
        route: '/services',
        image: '/assets/img/services/etching1.jpg',
        desc: 'Acid-resistant stencil etching on brass, stainless steel, and bronze for multi-layer archival crests, certificates, and outdoor plaques.',
        actionLabel: 'Chemical Etching Details',
        keywords: ['etching', 'chemical etching', 'acid etching', 'metal etching', 'brass etching', 'acid resist']
      },
      {
        id: 'embossing',
        title: 'Embossing & Die-Stamping',
        route: '/services',
        image: '/assets/img/services/Embossing1.jpg',
        desc: 'Precision die-struck raised metalwork for three-dimensional commemorative medallions, foil seals, certificates, and case lids.',
        actionLabel: 'Embossing Details',
        keywords: ['emboss', 'embossing', 'die stamping', 'raised metal', 'relief stamping', 'die striking', 'die-stamped']
      },
      {
        id: 'screen-printing',
        title: 'Screen Printing',
        route: '/services',
        image: '/assets/img/services/screen-printing1.jpg',
        desc: 'High-opacity spot enamel and epoxy ink printing for vibrant multi-colored corporate logos and crests on plaques and awards.',
        actionLabel: 'Screen Printing Details',
        keywords: ['screen printing', 'silkscreen', 'color printing', 'enamel print', 'multi-color logo', 'pantone print']
      },
      {
        id: 'sand-blasting',
        title: 'Sand Blasting',
        route: '/services',
        image: '/assets/img/services/sand-blasting.jpg',
        desc: 'Micro-abrasive sandblasting on optical crystal and glass to produce a velvety, frosted contrast for logos and citations.',
        actionLabel: 'Sand Blasting Details',
        keywords: ['sand blasting', 'sandblast', 'frosted', 'crystal frost', 'frosted glass', 'frosted crystal']
      },
      {
        id: '3d-engraving',
        title: '3D Sub-Surface Laser Engraving',
        route: '/services',
        image: '/assets/img/services/3d-engraving.jpg',
        desc: 'Volumetric laser micro-fracture technology creating floating 3D architectural models, logos, and emblems suspended inside solid crystal.',
        actionLabel: '3D Crystal Details',
        keywords: ['3d', '3d engraving', 'sub surface', 'crystal block', 'inside crystal', '3d sub surface', '3d laser']
      },
      {
        id: 'sticker-dome',
        title: 'Polyurethane Domed Decals',
        route: '/services',
        image: '/assets/img/services/sticker-taj.jpg',
        desc: 'Crystal-clear UV-stable polyurethane resin lens domes applied over full-color emblems for a durable, high-gloss 3D finish.',
        actionLabel: 'Domed Decal Details',
        keywords: ['sticker', 'domed', 'polyurethane', 'dome decal', 'resin dome', '3d sticker']
      },
      {
        id: 'foil-engraving',
        title: 'Hot Foil Stamping',
        route: '/services',
        image: '/assets/img/services/foil-engraving1.jpg',
        desc: 'Metallic gold, silver, and bronze hot foil embossing on velvet presentation cases, citation mounts, and certificate folders.',
        actionLabel: 'Foil Stamping Details',
        keywords: ['foil', 'foil engraving', 'hot foil', 'gold foil', 'foil stamping', 'metallic foil']
      }
    ]
  };

  // 2. Build DOM Elements
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.id = 'jbAssistantLauncher';
  launcher.className = 'jb-floating-assistant-btn';
  launcher.setAttribute('aria-label', 'Open Jhaveri Bros. Assistant');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'jbAssistantPanel');
  launcher.title = 'Open Jhaveri Bros. Assistant';
  launcher.style.cssText = 'position:fixed;bottom:max(24px,env(safe-area-inset-bottom,24px));right:max(22px,env(safe-area-inset-right,22px));z-index:9990;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1C283F 0%,#0E1726 100%);border:2px solid #D8CEAF;color:#D8CEAF;box-shadow:0 6px 24px rgba(0,0,0,0.55),0 0 16px rgba(216,206,175,0.25);cursor:pointer;-webkit-tap-highlight-color:transparent;';
  launcher.innerHTML = `
    <span class="jb-assistant-tooltip" aria-hidden="true">Ask Jhaveri Bros. Assistant</span>
    <span class="jb-assistant-badge-pulse" aria-hidden="true"></span>
    <svg class="jb-assistant-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
      <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
      <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
    </svg>
  `;

  const panel = document.createElement('div');
  panel.id = 'jbAssistantPanel';
  panel.className = 'jb-assistant-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'jbAssistantHeaderTitle');
  panel.setAttribute('aria-hidden', 'true');
  panel.style.cssText = 'display:none;position:fixed;bottom:max(94px,calc(env(safe-area-inset-bottom,24px) + 74px));right:max(22px,env(safe-area-inset-right,22px));z-index:9995;';
  panel.innerHTML = `
    <div class="jb-assistant-header">
      <div class="jb-assistant-header-brand">
        <div class="jb-assistant-avatar" aria-hidden="true">
          <span>JB</span>
          <span class="jb-status-dot" title="Online Concierge"></span>
        </div>
        <div class="jb-assistant-header-text">
          <h3 id="jbAssistantHeaderTitle">Jhaveri Bros. Assistant</h3>
          <p>Your guide to our collections and services</p>
        </div>
      </div>
      <button type="button" class="jb-assistant-close-btn" id="jbAssistantClose" aria-label="Close assistant" title="Close assistant">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="jb-assistant-messages" id="jbAssistantMessages" role="log" aria-live="polite"></div>
    <form class="jb-assistant-composer" id="jbAssistantComposer" novalidate>
      <div class="jb-composer-wrapper">
        <textarea id="jbAssistantInput"
                  class="jb-assistant-input"
                  placeholder="Ask about trophies, gifts, engraving, showroom..."
                  rows="1"
                  aria-label="Ask Jhaveri Bros. assistant a question"
                  maxlength="500"></textarea>
        <button type="submit" class="jb-assistant-send-btn" id="jbAssistantSend" aria-label="Send message" title="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <div class="jb-composer-hint">Press Enter to send &bull; Est. 1914 Metro House, Mumbai</div>
    </form>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const messagesBox = panel.querySelector('#jbAssistantMessages');
  const composer = panel.querySelector('#jbAssistantComposer');
  const input = panel.querySelector('#jbAssistantInput');
  const sendBtn = panel.querySelector('#jbAssistantSend');
  const closeBtn = panel.querySelector('#jbAssistantClose');

  let isInitialized = false;

  // 3. UI Helpers
  const scrollToBottom = () => {
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const getTimeString = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const appendUserMessage = (text) => {
    const row = document.createElement('div');
    row.className = 'jb-msg-row jb-msg-user';
    row.innerHTML = `
      <div class="jb-msg-bubble">${escapeHtml(text)}</div>
      <span class="jb-msg-time">${getTimeString()}</span>
    `;
    messagesBox.appendChild(row);
    scrollToBottom();
  };

  const appendAssistantMessage = (htmlContent, cards = [], chips = []) => {
    const row = document.createElement('div');
    row.className = 'jb-msg-row jb-msg-assistant';

    let cardsHtml = '';
    if (cards && cards.length) {
      cardsHtml = `<div class="jb-card-grid">` + cards.map(c => {
        const isExternal = c.route && c.route.startsWith('http');
        const isSecExternal = c.secondaryRoute && (c.secondaryRoute.startsWith('http') || c.secondaryRoute.startsWith('tel:'));
        return `
        <div class="jb-card">
          <div class="jb-card-top">
            ${c.image ? `<img src="${c.image}" alt="${escapeHtml(c.title)}" class="jb-card-thumb" loading="lazy">` : ''}
            <div class="jb-card-meta">
              <h4 class="jb-card-title">${escapeHtml(c.title)}</h4>
              <p class="jb-card-desc">${escapeHtml(c.desc)}</p>
            </div>
          </div>
          <div class="jb-card-actions">
            <a href="${c.route}" class="jb-card-btn jb-card-btn-primary"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(c.actionLabel || 'View Collection')} &rarr;</a>
            <a href="${c.secondaryRoute || '/enquiry'}" class="jb-card-btn jb-card-btn-secondary"${isSecExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(c.secondaryLabel || 'Enquire Now')}</a>
          </div>
        </div>
      `;}).join('') + `</div>`;
    }

    let chipsHtml = '';
    if (chips && chips.length) {
      chipsHtml = `<div class="jb-chips-wrap">` + chips.map(chip => `
        <button type="button" class="jb-chip" data-chip="${escapeHtml(chip)}">${escapeHtml(chip)}</button>
      `).join('') + `</div>`;
    }

    row.innerHTML = `
      <div class="jb-msg-bubble">
        <div>${htmlContent}</div>
        ${cardsHtml}
        ${chipsHtml}
      </div>
      <span class="jb-msg-time">${getTimeString()}</span>
    `;
    messagesBox.appendChild(row);
    scrollToBottom();
  };

  const showTypingIndicator = () => {
    const typing = document.createElement('div');
    typing.id = 'jbTypingIndicator';
    typing.className = 'jb-msg-row jb-msg-assistant';
    typing.innerHTML = `
      <div class="jb-msg-bubble jb-msg-typing" aria-label="Assistant is preparing a response">
        <span class="jb-typing-dot"></span>
        <span class="jb-typing-dot"></span>
        <span class="jb-typing-dot"></span>
      </div>
    `;
    messagesBox.appendChild(typing);
    scrollToBottom();
  };

  const hideTypingIndicator = () => {
    const typing = document.getElementById('jbTypingIndicator');
    if (typing) typing.remove();
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  };

  // 4. Grounded Knowledge & Search Engine
  const evaluateQuery = (rawInput) => {
    const q = rawInput.toLowerCase().trim();

    // 1. Check Greetings
    if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|greetings|hola)\b/i.test(q)) {
      return {
        text: `Welcome to <strong>Jhaveri Bros. &amp; Co.</strong> (Established 1914). I am your heritage concierge.<br><br>I know every aspect of our website, collections, and bespoke services. How may I assist you with our trophies, corporate mementoes, presentation salvers, or engraving techniques today?`,
        cards: [
          JB_KB.products.find(p => p.id === 'trophies'),
          JB_KB.products.find(p => p.id === 'corporate-gifts'),
          JB_KB.specialCards.aboutUs
        ],
        chips: ['Explore our products', 'Find a trophy or award', 'Discover corporate gifts', 'Where are you located?', 'Learn about engraving']
      };
    }

    // 2. Check Thanks / Courtesy
    if (/\b(thank|thanks|thank you|dhanyawad|appreciate|wonderful|great|awesome|helpful)\b/i.test(q)) {
      return {
        text: `It is our distinct pleasure to serve you. Should you require bespoke artwork inspection, quantity quotations, or showroom consultations, our master artisans at Metro House, South Mumbai are always at your service.`,
        cards: [JB_KB.specialCards.enquiry],
        chips: ['Explore our products', 'Showroom contact details', 'Learn about engraving', 'Where are you located?']
      };
    }

    // 3. Location / Directions / Google Maps / Navigation / Metro Cinemas
    if (/\b(location|located|address|where|showroom|metro house|dhobi talao|direction|directions|map|maps|google map|google maps|navigate|navigation|reach|find you|marine lines|cst|churchgate)\b/i.test(q)) {
      return {
        text: `Our historic showroom is located in South Mumbai:<br><br>
        📍 <strong>5, Metro House, next to Metro Cinemas, Dhobi Talao, Mumbai – 400 020</strong><br>
        🏛️ <strong>Landmark:</strong> Next to Metro Cinemas (minutes from Marine Lines &amp; CST stations)<br>
        🕒 <strong>Showroom Hours:</strong> Mon – Sat: 10:30 AM – 7:30 PM IST (Sunday Closed)<br>
        📞 <strong>Tel:</strong> <a href="tel:+912222071818" style="color:var(--color-gold-light,#D8CEAF);">+91 22 2207 1818</a> / <a href="tel:+912222014380" style="color:var(--color-gold-light,#D8CEAF);">2201 4380</a><br>
        📱 <strong>WhatsApp:</strong> <a href="https://wa.me/919355412903" target="_blank" style="color:#25D366;">+91 93554 12903</a>`,
        cards: [
          JB_KB.specialCards.navigation,
          JB_KB.specialCards.enquiry
        ],
        chips: ['Showroom Timings & Hours', 'Explore our products', 'Chat on WhatsApp', 'Explore our history']
      };
    }

    // 4. Website Management / Navya Tech Industry
    if (/\b(navya|navya tech|managed by|who manages|who managed|manage this site|manages this website|developer|who built|who created|web design|website management|navyatech)\b/i.test(q)) {
      return {
        text: `This official website for <strong>Jhaveri Bros. &amp; Co. Pvt. Ltd.</strong> is proudly engineered and managed by <strong>Navya Tech Industry</strong> (<a href="https://navyatech.co.in" target="_blank" rel="noopener noreferrer" style="color:#D8CEAF;text-decoration:underline;">navyatech.co.in</a>).<br><br>Navya Tech oversees digital architecture, performance optimization, and digital concierge experience for Jhaveri Bros.`,
        cards: [
          JB_KB.specialCards.navyaTech,
          JB_KB.specialCards.aboutUs
        ],
        chips: ['Explore our products', 'Where are you located?', 'Contact our team']
      };
    }

    // 5. Clientele / Celebrities / Amitabh Bachchan / Dhanraj Pillai / Notable Commissions
    if (/\b(client|clients|clientele|celebrity|celebrities|famous|amitabh|bachchan|dhanraj|pillai|pillay|tata|reliance|bcci|cci|bombay gymkhana|governor|government|navy|army|exim|ficci)\b/i.test(q)) {
      return {
        text: `Over eleven decades, <strong>Jhaveri Bros.</strong> has been trusted by premier royal houses, state governments, sports federations, and Fortune 500 corporations:<br><br>
        &bull; <strong>Institutional Commissions:</strong> Government of Maharashtra, Cricket Club of India (CCI), Bombay Gymkhana, BCCI, Tata Group, Reliance Industries, Mahindra, State Bank of India, Indian Navy, Indian Army, and FICCI.<br>
        &bull; <strong>Celebrated Moments:</strong> Honoring Bollywood icon <strong>Amitabh Bachchan</strong> with our bespoke trophy and welcoming Olympic hockey legend <strong>Dhanraj Pillay</strong> at our Metro House showroom.`,
        cards: [
          JB_KB.specialCards.clientele,
          JB_KB.specialCards.aboutUs
        ],
        chips: ['Explore Trophies & Awards', 'Explore our history', 'Request a quotation']
      };
    }

    // 6. Check Specific Services (Engraving, Etching, 3D Crystal, etc.)
    const matchedServices = [];
    JB_KB.services.forEach(srv => {
      const isMatch = srv.keywords.some(kw => q.includes(kw));
      if (isMatch) matchedServices.push(srv);
    });

    if (matchedServices.length > 0) {
      return {
        text: `Here are our specialized craftsmanship and customization techniques matching your query:`,
        cards: matchedServices.slice(0, 3).map(s => ({
          title: s.title,
          desc: s.desc,
          route: s.route,
          image: s.image,
          actionLabel: s.actionLabel || 'View Service Details',
          secondaryRoute: '/enquiry',
          secondaryLabel: 'Request Quote'
        })),
        chips: ['Submit artwork for quote', 'Find a trophy or award', 'Contact our team']
      };
    }

    // 7. Check Specific Product Categories (Trophies, Silver Coins, Medals, etc.)
    const matchedProducts = [];
    JB_KB.products.forEach(prod => {
      const isMatch = prod.keywords.some(kw => q.includes(kw));
      if (isMatch) matchedProducts.push(prod);
    });

    if (matchedProducts.length > 0) {
      return {
        text: `Here are our curated signature collections matching your interest:`,
        cards: matchedProducts.slice(0, 3).map(p => ({
          title: p.title,
          desc: p.desc,
          route: p.route,
          image: p.image,
          actionLabel: p.actionLabel || 'View Collection',
          secondaryRoute: '/enquiry',
          secondaryLabel: 'Enquire Now'
        })),
        chips: ['Learn about engraving', 'Request a quote', 'Showroom contact details']
      };
    }

    // 6. Minimum Order Quantity (MOQ) / Single Piece vs Bulk Orders
    if (/\b(moq|minimum|minimum order|single|single trophy|single piece|one piece|1 piece|bulk|bulk order|quantity|quantities|how many|small order|large order)\b/i.test(q)) {
      return {
        text: `<strong>We accommodate both single bespoke commissions and large volume orders!</strong><br><br>
        &bull; <strong>Individual &amp; Prestige Orders:</strong> We frequently craft single, one-of-a-kind awards, retirement plaques, presentation salvers, or memorial trophies personalized for high honors.<br>
        &bull; <strong>Institutional Bulk Volumes:</strong> We manage bulk production runs of hundreds or thousands of corporate annual day mementoes, conference gifts, and tournament medals with tiered institutional pricing.<br>
        &bull; <strong>Samples:</strong> Physical prototypes and digital proofs are provided for corporate committees prior to full manufacturing.`,
        cards: [
          JB_KB.specialCards.enquiry,
          JB_KB.specialCards.allProducts
        ],
        chips: ['Request a quotation', 'Discover corporate gifts', 'Find a trophy or award']
      };
    }

    // 7. Lead Times / Turnaround / Urgent Orders / Delivery / Shipping
    if (/\b(lead time|turnaround|how long|time|delivery|shipping|ship|courier|urgent|fast|express|rush|deadline|packaging|box|pan india|mumbai delivery)\b/i.test(q)) {
      return {
        text: `&bull; <strong>Standard Lead Time:</strong> Typically <strong>3 to 7 business days</strong> depending on substrate and customization method.<br>
        &bull; <strong>Express Turnaround:</strong> Urgent deadlines for conferences and ceremonies can be accommodated upon request.<br>
        &bull; <strong>Packaging:</strong> Every prestige trophy, salver, and silver item is encased in custom satin/velvet presentation cases or padded wooden presentation boxes.<br>
        &bull; <strong>Delivery:</strong> Express direct delivery throughout Mumbai, and insured air-cargo or express courier shipping across India and abroad.`,
        cards: [
          JB_KB.specialCards.enquiry,
          JB_KB.specialCards.navigation
        ],
        chips: ['Submit an enquiry', 'Chat on WhatsApp', 'Showroom contact details']
      };
    }

    // 8. Materials & Substrates
    if (/\b(material|materials|substrate|crystal|glass|brass|wood|teak|acrylic|pure silver|marble|bronze|metal|velvet|gold plating|silver plating)\b/i.test(q)) {
      return {
        text: `Jhaveri Bros. works exclusively with master-grade materials:<br><br>
        &bull; <strong>Optical K9 Crystal &amp; Glass:</strong> Flawless refractive brilliance with diamond-beveled edges.<br>
        &bull; <strong>Heavy Cast Brass &amp; Bronze:</strong> Sculptural metalwork, mirror-polished or antiqued.<br>
        &bull; <strong>Burma Teak Wood:</strong> Seasoned natural hardwood for archival plaques and shields.<br>
        &bull; <strong>Cast Acrylic:</strong> Contemporary multi-layered shapes and vivid color contrasts.<br>
        &bull; <strong>Hallmarked 999 Pure Silver:</strong> Minted coins, medallions, and ceremonial pooja articles.<br>
        &bull; <strong>Italian Marble:</strong> High-density marble foundation plinths for trophies.`,
        cards: [
          JB_KB.products.find(p => p.id === 'trophies'),
          JB_KB.products.find(p => p.id === 'silver'),
          JB_KB.products.find(p => p.id === 'plaques')
        ],
        chips: ['Find a trophy or award', 'Learn about engraving', 'Request a quote']
      };
    }

    // 9. Custom Logos, Artwork, How to Order, Proofs
    if (/\b(logo|artwork|vector|format|proof|custom logo|design|custom design|how to order|order process|process|steps|engrave logo)\b/i.test(q)) {
      return {
        text: `<strong>Our Simple 4-Step Custom Ordering Process:</strong><br><br>
        1. <strong>Submit Your Details:</strong> Share your required design, text, and logos (vector AI, CDR, EPS, PDF, or high-res PNG) via our Enquiry form or WhatsApp.<br>
        2. <strong>Digital Proof:</strong> Our design studio creates a complimentary 2D or 3D digital artwork layout for your approval.<br>
        3. <strong>Master Crafting:</strong> Upon your sign-off, our craftsmen execute laser engraving, chemical etching, or casting in our workshops.<br>
        4. <strong>Inspection &amp; Presentation:</strong> Finished awards undergo quality inspection and are packaged in custom satin/velvet cases for delivery.`,
        cards: [
          JB_KB.specialCards.enquiry,
          JB_KB.specialCards.allServices
        ],
        chips: ['Submit artwork for quote', 'Chat on WhatsApp', 'Explore Trophies']
      };
    }

    // 10. History / Heritage / Founders (Shyamdas, Durlabh, Seyjhal, 1914)
    if (/\b(history|heritage|founder|shyamdas|durlabh|seyjhal|founded|story|1914|century|110|eleven decades|oldest|who started|who is director|about us|legacy)\b/i.test(q)) {
      return {
        text: `<strong>Jhaveri Bros. &amp; Co. Pvt. Ltd.</strong> was established on <strong>27 July 1914</strong> in South Mumbai by Late Shri Shyamdas Jhaveri, expanded under Late Shri Durlabh Jhaveri, and is proudly administered today by Director Seyjhal D. Jhaveri.<br><br>With over 110 years of unbroken craftsmanship at Metro House, Dhobi Talao, we remain India's premier heritage house for recognition awards, presentation salvers, and executive corporate gifts.`,
        cards: [
          JB_KB.specialCards.aboutUs,
          JB_KB.specialCards.clientele
        ],
        chips: ['Where are you located?', 'Signature Collections', 'Explore our products']
      };
    }

    // 11. Showroom Hours / Sunday / Timings
    if (/\b(hours|timing|timings|sunday|saturday|open|closed|when can i visit|working hours|time)\b/i.test(q)) {
      return {
        text: `<strong>Showroom Hours at Metro House, Mumbai:</strong><br><br>
        🕒 <strong>Monday – Saturday:</strong> 10:30 AM – 7:30 PM IST<br>
        🚫 <strong>Sunday:</strong> Closed<br><br>
        Visitors are welcome to inspect physical trophy specimens, silver coins, and wood finish samples during showroom hours.`,
        cards: [
          JB_KB.specialCards.navigation,
          JB_KB.specialCards.enquiry
        ],
        chips: ['Where are you located?', 'Explore our products', 'Contact our team']
      };
    }

    // 12. Contact Details / Phone / Email / Telephone / WhatsApp
    if (/\b(contact|phone|call|telephone|email|number|mobile|whatsapp|reach out|touch)\b/i.test(q)) {
      return {
        text: `You can connect directly with our South Mumbai specialists:<br><br>
        📞 <strong>Showroom Landline:</strong> <a href="tel:+912222071818" style="color:var(--color-gold-light,#D8CEAF);">+91 22 2207 1818</a> / <a href="tel:+912222014380" style="color:var(--color-gold-light,#D8CEAF);">2201 4380</a><br>
        📱 <strong>Mobile Direct:</strong> <a href="tel:+919833635014" style="color:var(--color-gold-light,#D8CEAF);">+91 98336 35014</a> / <a href="tel:+919833131091" style="color:var(--color-gold-light,#D8CEAF);">98331 31091</a><br>
        💬 <strong>WhatsApp:</strong> <a href="https://wa.me/919355412903" target="_blank" style="color:#25D366;font-weight:600;">+91 93554 12903</a><br>
        ✉️ <strong>Email:</strong> <a href="mailto:info@jhaveribros.com" style="color:var(--color-gold-light,#D8CEAF);">info@jhaveribros.com</a><br>
        📍 <strong>Address:</strong> 5, Metro House, next to Metro Cinemas, Dhobi Talao, Mumbai – 400 020`,
        cards: [
          JB_KB.specialCards.enquiry,
          JB_KB.specialCards.navigation
        ],
        chips: ['Explore our products', 'Showroom Timings & Hours', 'Request a quote']
      };
    }

    // 13. Quotation / Pricing / Cost / Estimates
    if (/\b(quote|quotation|price|pricing|cost|rate|rates|how much|estimate|budget|expensive|cheap|charge)\b/i.test(q)) {
      return {
        text: `Because every Jhaveri Bros. commission is tailored to your chosen substrate, dimensions, customization technique, and order volume, pricing is provided via official, itemized quotations.<br><br>We cater to all tiers—from accessible student sports medallions and acrylic awards to luxury 999 pure silver coins and hand-cast brass heirloom trophies.`,
        cards: [
          JB_KB.specialCards.enquiry,
          JB_KB.specialCards.allProducts
        ],
        chips: ['Request a quote', 'Find a trophy or award', 'Discover corporate gifts']
      };
    }

    // 14. Corporate Events / Conferences / Annual Days / Galas
    if (/\b(corporate event|conference|annual day|board meeting|corporate awards|corporate recognition|employee award|years of service|sales award)\b/i.test(q)) {
      return {
        text: `For corporate milestones and annual recognition galas, we recommend choosing between <strong>Executive Desk Mementoes</strong>, <strong>Signature Optical Crystal Trophies</strong>, or <strong>Teakwood Wall Plaques</strong>.<br><br>Here are our most selected corporate collections:`,
        cards: [
          JB_KB.products.find(p => p.id === 'corporate-gifts'),
          JB_KB.products.find(p => p.id === 'trophies'),
          JB_KB.products.find(p => p.id === 'plaques')
        ],
        chips: ['Discover corporate gifts', 'Find a trophy or award', 'Learn about engraving', 'Request a quote']
      };
    }


    // 17. General "Services" or "Engraving" query
    if (/\b(service|services|engrave|engraving|etch|etching|print|printing|stamp|stamping|sandblast|techniques|finishing)\b/i.test(q)) {
      return {
        text: `We offer <strong>nine specialized customization techniques</strong> executed by master craftsmen:<br><br>
        &bull; <strong>Laser &amp; Pantograph Engraving:</strong> Micro-precision on flat and curved trophy surfaces.<br>
        &bull; <strong>Chemical Etching:</strong> Acid-resist metalwork on brass and bronze.<br>
        &bull; <strong>3D Sub-Surface Laser:</strong> Suspended floating volumetric models inside crystal.<br>
        &bull; <strong>Sand Blasting &amp; Screen Printing:</strong> Frosted textures and multi-color logo reproduction.<br>
        &bull; <strong>Embossing &amp; Hot Foil Stamping:</strong> Tactile 3D seals on certificates and presentation cases.`,
        cards: [
          JB_KB.services[0],
          JB_KB.services[2],
          JB_KB.services[6]
        ].map(s => ({
          title: s.title,
          desc: s.desc,
          route: s.route,
          image: s.image,
          actionLabel: 'View Service Details',
          secondaryRoute: '/enquiry',
          secondaryLabel: 'Request Quote'
        })),
        chips: ['Submit artwork for quote', 'Find a trophy or award', 'Contact our team']
      };
    }

    // 18. General "Products" or "Catalog" query
    if (/\b(product|products|collection|collections|catalogue|catalog|designs|items|what do you sell|what do you make)\b/i.test(q)) {
      return {
        text: `Jhaveri Bros. features <strong>six signature product collections</strong> with over 7,000+ catalogued designs:<br><br>
        1. <strong>Trophies &amp; Awards:</strong> Crystal, cast brass, acrylic &amp; marble bases.<br>
        2. <strong>Corporate Gifts:</strong> Executive desk mementoes &amp; timepieces.<br>
        3. <strong>Cups, Medals &amp; Shields:</strong> Silver-plated cups &amp; tournament medallions.<br>
        4. <strong>Commemorative Plaques:</strong> Burma teak &amp; etched brass citations.<br>
        5. <strong>Presentation Salvers:</strong> Chased silver-plated trays &amp; dishes.<br>
        6. <strong>Silver Gifts:</strong> Hallmarked 999 pure silver coins &amp; articles.`,
        cards: [
          JB_KB.products.find(p => p.id === 'trophies'),
          JB_KB.products.find(p => p.id === 'corporate-gifts'),
          JB_KB.products.find(p => p.id === 'cups-medals-shields')
        ],
        chips: ['Find a trophy or award', 'Discover corporate gifts', 'Learn about engraving']
      };
    }

    // 19. Legal Policies (Privacy, Terms, Disclaimer)
    if (/\b(privacy|policy|terms|condition|conditions|disclaimer|copyright|legal)\b/i.test(q)) {
      return {
        text: `Jhaveri Bros. &amp; Co. Pvt. Ltd. upholds strict client confidentiality, corporate logo integrity, and transparent business standards:<br><br>
        &bull; <strong>Privacy Policy:</strong> Client logos, crests, and personal enquiry details are kept confidential.<br>
        &bull; <strong>Terms of Service:</strong> Bespoke manufacturing terms, digital proof sign-offs, and delivery conditions.<br>
        &bull; <strong>Disclaimer:</strong> Heritage trademark representations and authentic craftsmanship guarantees.`,
        cards: [
          {
            title: 'Privacy Policy & Data Security',
            desc: 'Review our standards on client confidentiality and discrete corporate service.',
            route: '/privacy-policy',
            image: '/assets/img/brand/new-header.png',
            actionLabel: 'View Privacy Policy',
            secondaryRoute: '/terms-and-conditions',
            secondaryLabel: 'Terms of Service'
          }
        ],
        chips: ['Explore our products', 'Showroom contact details', 'Submit an enquiry']
      };
    }

    // 20. Intelligent Semantic Scorer & Curated Fallback
    const tokens = q.split(/[^a-z0-9]+/).filter(t => t.length > 2);
    const scoredCandidates = [];

    // Score Products
    JB_KB.products.forEach(p => {
      let score = 0;
      tokens.forEach(t => {
        if (p.title.toLowerCase().includes(t)) score += 3;
        if (p.desc.toLowerCase().includes(t)) score += 2;
        p.keywords.forEach(kw => {
          if (kw.includes(t)) score += 3;
        });
      });
      if (score > 0) scoredCandidates.push({ item: p, score });
    });

    // Score Services
    JB_KB.services.forEach(s => {
      let score = 0;
      tokens.forEach(t => {
        if (s.title.toLowerCase().includes(t)) score += 3;
        if (s.desc.toLowerCase().includes(t)) score += 2;
        s.keywords.forEach(kw => {
          if (kw.includes(t)) score += 3;
        });
      });
      if (score > 0) scoredCandidates.push({ item: s, score });
    });

    if (scoredCandidates.length > 0) {
      scoredCandidates.sort((a, b) => b.score - a.score);
      const topCurated = scoredCandidates.slice(0, 3).map(c => c.item);
      return {
        text: `Here are the preferred results from our collections and craftsmanship services matching your request:`,
        cards: topCurated.map(item => ({
          title: item.title,
          desc: item.desc,
          route: item.route,
          image: item.image,
          actionLabel: item.actionLabel || 'View Details',
          secondaryRoute: '/enquiry',
          secondaryLabel: 'Enquire Online'
        })),
        chips: ['Explore our products', 'Learn about engraving', 'Where are you located?', 'Request a quote']
      };
    }

    // Default Friendly Concierge Fallback
    return {
      text: `I am your heritage concierge for <strong>Jhaveri Bros. &amp; Co.</strong> (Established 1914).<br><br>I can guide you through our <strong>7,000+ trophies &amp; awards</strong>, <strong>executive corporate gifts</strong>, <strong>presentation salvers</strong>, <strong>999 pure silver coins</strong>, and <strong>9 personalization techniques</strong>.<br><br>You can also ask about our showroom location at Metro House, driving directions, order turnaround times, or request an official quote.`,
      cards: [
        JB_KB.specialCards.allProducts,
        JB_KB.specialCards.allServices,
        JB_KB.specialCards.navigation
      ],
      chips: ['Explore our products', 'Find a trophy or award', 'Discover corporate gifts', 'Where are you located?', 'Explore our history', 'Contact our team']
    };
  };

  // 5. Query Handling
  const handleUserQuery = (userQuery) => {
    if (!userQuery || !userQuery.trim()) return;
    const cleanText = userQuery.trim();

    appendUserMessage(cleanText);

    // Disable composer during processing
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    showTypingIndicator();

    // Natural brief thinking delay for realistic responsiveness
    setTimeout(() => {
      hideTypingIndicator();
      const response = evaluateQuery(cleanText);
      appendAssistantMessage(response.text, response.cards, response.chips);

      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }, 450);
  };

  // 6. Welcome State Initialization
  const openPanel = () => {
    panel.style.display = 'flex';
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
    });
    panel.setAttribute('aria-hidden', 'false');
    launcher.classList.add('is-hidden');
    launcher.setAttribute('aria-expanded', 'true');

    if (window.innerWidth <= 640) {
      document.body.style.overflow = 'hidden';
    }

    if (!isInitialized) {
      isInitialized = true;
      appendAssistantMessage(
        `Welcome to <strong>Jhaveri Bros. &amp; Co.</strong> (Established 1914).<br><br>How can I help you find the right trophy, award, memento, or corporate gift today?`,
        [],
        [
          'Explore our products',
          'Find a trophy or award',
          'Discover corporate gifts',
          'Learn about engraving',
          'Explore our history',
          'Contact our team'
        ]
      );
    }

    setTimeout(() => {
      input.focus();
    }, 300);
  };

  const closePanel = () => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.classList.remove('is-hidden');
    launcher.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!panel.classList.contains('is-open')) {
        panel.style.display = 'none';
      }
    }, 280);
    launcher.focus();
  };

  // 7. Event Listeners
  launcher.addEventListener('click', (e) => {
    e.preventDefault();
    openPanel();
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closePanel();
  });

  // Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
    }
  });

  // Handle Suggested Question Chips click
  messagesBox.addEventListener('click', (e) => {
    const chip = e.target.closest('.jb-chip');
    if (chip) {
      const query = chip.getAttribute('data-chip');
      if (query) {
        handleUserQuery(query);
      }
    }
  });

  // Composer Form Submit
  composer.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserQuery(input.value);
  });

  // Multiline Enter Key Handling (Enter sends, Shift+Enter new line)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      composer.dispatchEvent(new Event('submit'));
    }
  });
}

/* Force-bust browser cache for all page images */
function refreshAllImages() {
  const v = '?v=' + Date.now();
  document.querySelectorAll('img').forEach(img => {
    if (!img.src || img.src.startsWith('data:') || img.src.includes('?v=')) return;
    img.src = img.src + v;
  });
}
window.refreshAllImages = refreshAllImages;
refreshAllImages();

