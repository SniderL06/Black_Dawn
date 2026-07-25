/* Interactive Website Script - FloraStudios */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Accessibility toggle
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !expanded);
      
      // Icon switch (hamburger to X)
      if (navLinks.classList.contains('active')) {
        menuToggle.innerHTML = '&times;'; // Unicode multiplication sign (X)
      } else {
        menuToggle.innerHTML = '&#9776;'; // Unicode hamburger menu symbol
      }
    });

    // Close menu when clicking any nav link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#9776;';
      });
    });
  }

  // 2. Sticky Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Next Event Countdown (Black Dawn 2)
  // Target date set to September 3, 2026, 18:00:00 (Local Time)
  const targetDate = new Date('September 3, 2026 18:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById('countdown-wrapper').innerHTML = 
        `<div class="countdown-card" style="flex: 1; border-color: var(--primary-color);">
          <div class="countdown-num" style="font-size: 1.5rem;">¡EL EVENTO HA COMENZADO!</div>
         </div>`;
      return;
    }

    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update HTML elements
    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  // Run countdown immediately and then update every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. Project Gallery Lightbox with Ken Burns Auto-Zoom
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxTag = document.getElementById('lightbox-tag');

  if (lightbox && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img');
        const title = item.querySelector('.gallery-title').innerText;
        const tag = item.querySelector('.gallery-tag').innerText;

        // Load image source and metadata
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.innerText = title;
        lightboxTag.innerText = tag;

        // Open lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scroll under lightbox

        // Start the automatic zoom/pan (Ken Burns) effect on the image
        setTimeout(() => {
          lightboxImg.classList.add('ken-burns');
        }, 100);
      });
    });

    // Close Lightbox Function
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Resume scroll
      
      // Stop Ken Burns animation to reset for next image
      lightboxImg.classList.remove('ken-burns');
      lightboxImg.src = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close when clicking background outside the image box
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 5. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 6. Creator Communication Form Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formStatusClose = document.getElementById('form-status-close');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Simple form field verification
      const nameVal = document.getElementById('form-name').value.trim();
      const emailVal = document.getElementById('form-email').value.trim();
      const messageVal = document.getElementById('form-message').value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        alert('Por favor, rellene todos los campos del formulario.');
        return;
      }

      // Disable button while sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        const response = await fetch('https://formspree.io/f/mwvjvkgl', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm)
        });

        if (response.ok) {
          // Show success overlay
          formStatus.classList.add('active');
          contactForm.reset();
        } else {
          alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
        }
      } catch (err) {
        alert('No se pudo enviar el mensaje. Verifica tu conexión a internet.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
      }
    });

    if (formStatusClose) {
      formStatusClose.addEventListener('click', () => {
        formStatus.classList.remove('active');
      });
    }
  }
});
