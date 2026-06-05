document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. GLOBAL LIGHT / DARK THEME TOGGLE (with localStorage persistence)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const body = document.body;

  // Read saved theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeIcons(true);
  } else {
    body.classList.remove('dark-mode');
    updateThemeIcons(false);
  }

  // Enable transitions after initial theme setup
  setTimeout(() => {
    body.classList.add('theme-transition');
  }, 100);

  // Desktop Toggle Click
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Mobile Toggle Click
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    const desktopIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const mobileIcon = mobileThemeToggle ? mobileThemeToggle.querySelector('i') : null;

    if (isDark) {
      if (desktopIcon) desktopIcon.className = 'fa-solid fa-sun';
      if (mobileIcon) mobileIcon.className = 'fa-solid fa-sun';
    } else {
      if (desktopIcon) desktopIcon.className = 'fa-solid fa-moon';
      if (mobileIcon) mobileIcon.className = 'fa-solid fa-moon';
    }
  }

  /* ==========================================================================
     2. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ==========================================================================
     3. STICKY NAVBAR & ACTIVE LINK HIGHLIGHTER (Scroll Spy)
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.menu a, .mobile-menu a');
  const sections = document.querySelectorAll('section, footer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  });

  function highlightNavOnScroll() {
    // If scrolled to the bottom of the page, automatically highlight Kontak
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#kontak') {
          link.classList.add('active');
        }
      });
      return;
    }

    let scrollPos = window.scrollY + 110;
    
    sections.forEach(section => {
      const sectionId = section.getAttribute('id');
      if (!sectionId) return;

      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ==========================================================================
     4. MOBILE MENU HAMBURGER CONTROLLER
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (e.target.closest('.mobile-theme-wrapper')) return;

        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     5. HERO MOUSE PARALLAX & 3D TILT EFFECT ON LAPTOP MOCKUP
     ========================================================================== */
  const heroVisual = document.getElementById('heroVisual');
  const parallaxItems = document.querySelectorAll('.parallax-item');

  if (heroVisual && window.innerWidth > 960) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);

      parallaxItems.forEach(item => {
        const speed = parseFloat(item.getAttribute('data-speed')) || 0.5;
        const xOffset = x * speed * 0.05;
        const yOffset = y * speed * 0.05;
        
        if (item.id === 'heroLaptop') {
          const rotateY = x * 0.025; // slightly lower rotation limit for large image
          const rotateX = -y * 0.025;
          item.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate3d(${xOffset}px, ${yOffset}px, 0)`;
        } else {
          item.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        }
      });
    });

    heroVisual.addEventListener('mouseleave', () => {
      parallaxItems.forEach(item => {
        item.style.transition = 'transform 0.5s ease-out';
        if (item.id === 'heroLaptop') {
          item.style.transform = 'perspective(1200px) rotateY(-1deg) rotateX(0deg) translate3d(0, 0, 0)';
        } else {
          item.style.transform = 'translate3d(0, 0, 0)';
        }
        
        setTimeout(() => {
          item.style.transition = 'none';
        }, 500);
      });
    });
  }

  /* ==========================================================================
     7. PORTFOLIO FILTER SYSTEM (PAGINATION REMOVED)
     ========================================================================== */
  const filterButtons = document.querySelectorAll('#portfolioFilters .filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (portfolioCards.length > 0) {
    let activeFilter = 'all';

    function renderPortfolio() {
      portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (activeFilter === 'all' || cardCategory === activeFilter) {
          card.style.display = 'block';
          
          // Subtle fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeFilter = btn.getAttribute('data-filter');
        renderPortfolio();
      });
    });

    renderPortfolio();
  }

  /* ==========================================================================
     8. TESTIMONIAL CAROUSEL SLIDER (AUTO-ROTATING)
     ========================================================================== */
  const slides = document.querySelectorAll('#testimonialsSlider .testimonial-card');
  const dots = document.querySelectorAll('#carouselDots .c-dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let currentSlide = 0;
  let carouselTimer = null;

  if (slides.length > 0) {
    function showSlide(index) {
      if (index >= slides.length) currentSlide = 0;
      else if (index < 0) currentSlide = slides.length - 1;
      else currentSlide = index;

      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showSlide(index);
        resetTimer();
      });
    });

    function startTimer() {
      carouselTimer = setInterval(nextSlide, 8000);
    }

    function resetTimer() {
      clearInterval(carouselTimer);
      startTimer();
    }

    startTimer();
  }

  /* ==========================================================================
     9. FAQ ACCORDION CONTROLLER (REFINED)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq-open');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('faq-open');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
          }
        });
        
        // Toggle current item
        if (!isOpen) {
          item.classList.add('faq-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ==========================================================================
     9B. SERVICE DETAIL MODAL CONTROLLER
     ========================================================================== */
  const servicesData = {
    webmobile: {
      title: "Web & Mobile Development",
      icon: "fa-solid fa-code",
      desc: "Kami mengerjakan tugas kuliah, skripsi, maupun project pemrograman website dan aplikasi mobile Android/iOS secara custom. Layanan ini mencakup pengerjaan backend, frontend, hingga database yang dibutuhkan.",
      features: [
        "Joki Coding Tugas Web (HTML, CSS, JS, PHP, React, Next.js)",
        "Joki Coding Aplikasi Mobile (Android Native Studio, Flutter)",
        "Source code bersih (Clean Code), rapi, dan mudah dipahami",
        "Responsive design (tampilan rapi di HP, tablet, & desktop)",
        "Bebas konsultasi & penjelasan alur program"
      ],
      whatsappText: "Halo Ellayaa, saya tertarik dengan layanan Web & Mobile Development. Bisa bantu jelaskan prosedurnya?"
    },
    systemdesign: {
      title: "UI/UX & Desain Sistem",
      icon: "fa-solid fa-compass-drafting",
      desc: "Layanan ini dikhususkan bagi Anda yang membutuhkan perancangan antarmuka visual (Figma Mockup) serta diagram-diagram analisis dokumentasi sistem. Sangat cocok untuk melengkapi tugas pemrograman, proposal, laporan magang, maupun skripsi.",
      features: [
        "Desain UI/UX Mockup di Figma (Modern & Interaktif)",
        "Figma Prototype (bisa diklik & disimulasikan)",
        "Diagram Alir Sistem / Flowchart lengkap",
        "Diagram UML (Use Case, Activity, Class Diagram)",
        "Diagram Basis Data & Aliran Data (ERD & DFD)"
      ],
      whatsappText: "Halo Ellayaa, saya tertarik dengan layanan UI/UX & Desain Sistem (Figma/UML). Bisa bantu jelaskan prosedurnya?"
    },
    customdb: {
      title: "Custom & Database",
      icon: "fa-solid fa-database",
      desc: "Butuh pengerjaan database SQL/NoSQL saja? Atau butuh scripting automasi dan project pemrograman lainnya yang tidak masuk kategori web/mobile? Kami siap membantu perancangan database, optimasi query, hingga automasi script.",
      features: [
        "Perancangan & normalisasi database (MySQL, PostgreSQL)",
        "Integrasi cloud database seperti Firebase atau MongoDB",
        "Script Automation & Scraping Data sederhana (Python)",
        "Tugas Algoritma Dasar (Java, C, C++, Python)",
        "Optimasi query SQL kompleks & pengolahan data"
      ],
      whatsappText: "Halo Ellayaa, saya tertarik dengan layanan Custom & Database. Bisa bantu jelaskan prosedurnya?"
    }
  };

  const serviceModal = document.getElementById('serviceModal');
  const serviceModalOverlay = document.getElementById('serviceModalOverlay');
  const closeServiceModal = document.getElementById('closeServiceModal');
  
  const modalServiceIcon = document.getElementById('modalServiceIcon');
  const modalServiceTitle = document.getElementById('modalServiceTitle');
  const modalServiceDesc = document.getElementById('modalServiceDesc');
  const modalServiceFeatures = document.getElementById('modalServiceFeatures');
  const modalServiceCTA = document.getElementById('modalServiceCTA');

  function openModal(serviceKey) {
    const data = servicesData[serviceKey];
    if (!data || !serviceModal) return;

    // Populate contents
    if (modalServiceIcon) modalServiceIcon.innerHTML = `<i class="${data.icon}"></i>`;
    if (modalServiceTitle) modalServiceTitle.textContent = data.title;
    if (modalServiceDesc) modalServiceDesc.textContent = data.desc;
    
    if (modalServiceFeatures) {
      modalServiceFeatures.innerHTML = '';
      data.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        modalServiceFeatures.appendChild(li);
      });
    }

    if (modalServiceCTA) {
      const waPhone = '6282114631317';
      modalServiceCTA.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(data.whatsappText)}`;
    }

    // Show modal
    serviceModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind service links
  const serviceLinks = document.querySelectorAll('.service-link, .footer-service-link');
  serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const serviceKey = link.getAttribute('data-service');
      if (serviceKey && servicesData[serviceKey]) {
        e.preventDefault();
        openModal(serviceKey);
      }
    });
  });

  // Bind close events
  if (closeServiceModal) closeServiceModal.addEventListener('click', closeModal);
  if (serviceModalOverlay) serviceModalOverlay.addEventListener('click', closeModal);
  
  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================================================
     10. INTERACTIVE WHATSAPP FORM (BOTTOM CTA)
     ========================================================================== */
  const waForm = document.getElementById('waForm');
  
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('waName').value.trim();
      const service = document.getElementById('waService').value;
      const msg = document.getElementById('waMsg').value.trim();
      const phone = '6282114631317';

      if (!name || !service || !msg) return;

      const chatText = `Halo Ellayaa Jasa Joki Digital,\n\nSaya ingin berkonsultasi mengenai pemesanan:\n\n` +
                       `* Nama: ${name}\n` +
                       `* Layanan: ${service}\n` +
                       `* Rincian / Konsep:\n"${msg}"\n\n` +
                       `Mohon hubungi saya kembali untuk diskusi detailnya. Terima kasih!`;
      
      const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(chatText)}`;
      
      window.open(waUrl, '_blank');
      waForm.reset();
    });
  }
});
