/**
 * D1 INTERIORS - INTERACTIVE LOGIC, SCROLL REVEALS & LIGHTBOX
 * Studio: Banjara Hills, Nandi Nagar, Hyderabad
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. VANILLA INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 2. STICKY HEADER SCROLL EFFECT & ACTIVE LINK HIGHLIGHT
  // --------------------------------------------------------------------------
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active Section Link Highlighting
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 3. ACCESSIBLE MOBILE NAVIGATION MENU
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined ? open : navMenu.classList.contains('active');
      const shouldOpen = !isExpanded;

      mobileToggle.classList.toggle('active', shouldOpen);
      navMenu.classList.toggle('active', shouldOpen);
      mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      document.body.style.overflow = shouldOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          toggleMenu(false);
        }
      });
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. PORTFOLIO CATEGORY FILTER TABS
  // --------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. ENHANCED PORTFOLIO LIGHTBOX MODAL WITH PREV / NEXT & KEYBOARD NAV
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activePortfolioIndex = 0;
  const portfolioList = Array.from(portfolioItems);

  function updateLightbox(index) {
    if (index < 0) index = portfolioList.length - 1;
    if (index >= portfolioList.length) index = 0;
    activePortfolioIndex = index;

    const currentItem = portfolioList[activePortfolioIndex];
    const img = currentItem.querySelector('img');
    const titleEl = currentItem.querySelector('.portfolio-title');
    const catEl = currentItem.querySelector('.portfolio-cat');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'D1 Interiors Showcase';
      if (lightboxTitle) lightboxTitle.textContent = titleEl ? titleEl.textContent : '';
      if (lightboxCat) lightboxCat.textContent = catEl ? catEl.textContent : '';
    }
  }

  function openLightbox(index) {
    updateLightbox(index);
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  portfolioList.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => updateLightbox(activePortfolioIndex - 1));
  lightboxNext?.addEventListener('click', () => updateLightbox(activePortfolioIndex + 1));

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation for Lightbox & Modals
  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateLightbox(activePortfolioIndex - 1);
      if (e.key === 'ArrowRight') updateLightbox(activePortfolioIndex + 1);
    }
  });

  // --------------------------------------------------------------------------
  // 6. CONSULTATION BOOKING MODAL
  // --------------------------------------------------------------------------
  const consultationModal = document.getElementById('consultation-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-trigger');
  const openModalBtns = document.querySelectorAll('.open-consultation-modal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (consultationModal) {
        consultationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (consultationModal) {
        consultationModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      if (e.target === consultationModal) {
        consultationModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && consultationModal && consultationModal.classList.contains('active')) {
      consultationModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // --------------------------------------------------------------------------
  // 7. FORM SUBMISSION HANDLERS WITH FEEDBACK
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const modalForm = document.getElementById('modal-form');

  const handleFormSubmit = (form, isModal = false) => {
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      const nameInput = form.querySelector('input[type="text"]')?.value || '';
      const phoneInput = form.querySelector('input[type="tel"]')?.value || '';
      const typeInput = form.querySelector('select')?.value || '';
      const messageInput = form.querySelector('textarea')?.value || '';

      const leadMessage = encodeURIComponent(
        `Hi D1 Interiors, I would like to book an interior design consultation.\n\nName: ${nameInput}\nPhone: ${phoneInput}\nProject Type: ${typeInput}` +
        (messageInput ? `\nDetails: ${messageInput}` : '')
      );

      setTimeout(() => {
        // Direct consultation lead to WhatsApp +91 86866 29661
        window.open(`https://wa.me/918686629661?text=${leadMessage}`, '_blank');

        alert('Thank you for reaching out to D1 Interiors! We have received your inquiry and our principal designer will contact you shortly.');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (isModal && consultationModal) {
          consultationModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 900);
    });
  };

  handleFormSubmit(contactForm, false);
  handleFormSubmit(modalForm, true);
});
