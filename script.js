/* ========================================================
   Rohit Jain — Portfolio Website
   JavaScript: Navigation, Animations, Form
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM Elements =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  // ===== Navbar Scroll Effect =====
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ===== Mobile Menu Toggle =====
  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // ===== Scroll Reveal Animation (Intersection Observer) =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ===== Back to Top =====
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ===== Contact Form Submission =====
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formAction = contactForm.getAttribute('action');

      // Check if Formspree is configured
      if (formAction.includes('YOUR_FORM_ID')) {
        formStatus.textContent = '⚠️ Contact form endpoint not configured. Please set up Formspree.';
        formStatus.className = 'form-status error';
        return;
      }

      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Sending...
      `;

      try {
        const formData = new FormData(contactForm);

        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        formStatus.textContent = '❌ Something went wrong. Please try emailing me directly.';
        formStatus.className = 'form-status error';
      }

      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Send Message
      `;

      // Clear status after 5 seconds
      setTimeout(() => {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }, 5000);
    });
  }

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== Skill pill hover tooltip effect =====
  const skillPills = document.querySelectorAll('.skill-pill');
  skillPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      pill.style.transform = 'translateY(-3px) scale(1.05)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.transform = '';
    });
  });

  // ===== Add CSS animation for spinner =====
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // ===== Parallax effect on hero blobs =====
  const heroBlobs = document.querySelectorAll('.hero-blob');

  function parallaxBlobs() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBlobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.15;
        blob.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }

  window.addEventListener('scroll', parallaxBlobs, { passive: true });

  // ===== Typing effect for hero tagline =====
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const originalText = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    
    let charIndex = 0;
    
    // Wait for hero animation to finish, then type
    setTimeout(() => {
      function typeChar() {
        if (charIndex < originalText.length) {
          tagline.textContent += originalText[charIndex];
          charIndex++;
          setTimeout(typeChar, 30);
        }
      }
      typeChar();
    }, 800);
  }

  // Run initial checks
  handleNavScroll();
  highlightActiveNav();
});
