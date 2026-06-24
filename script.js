/* Portfolio — Mohamed Rayyan */

document.addEventListener('DOMContentLoaded', () => {

  // ── Footer year ──────────────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navigation: glass on scroll + active section highlight ───
  const nav      = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 24);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile nav toggle ─────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  function setMenuOpen(open) {
    navMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  navToggle.addEventListener('click', () => {
    setMenuOpen(!navMenu.classList.contains('open'));
  });

  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  // ── Typewriter effect ─────────────────────────────────────────
  const typedEl  = document.getElementById('heroTyped');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = 'Full-Stack Developer';
    } else {
      const words = [
        'Full-Stack Developer',
        'Frontend Engineer',
        'Node.js Developer',
        'Problem Solver',
        'Web Developer',
      ];
      let wordIdx = 0, charIdx = 0, deleting = false;
      const SPEED_TYPE   = 85;
      const SPEED_DELETE = 45;
      const PAUSE_AFTER  = 1800;
      const PAUSE_BEFORE = 350;

      function type() {
        const word = words[wordIdx];
        typedEl.textContent = deleting ? word.slice(0, charIdx--) : word.slice(0, charIdx++);

        let delay = deleting ? SPEED_DELETE : SPEED_TYPE;

        if (!deleting && charIdx > word.length) {
          delay    = PAUSE_AFTER;
          deleting = true;
        } else if (deleting && charIdx < 0) {
          deleting = false;
          charIdx  = 0;
          wordIdx  = (wordIdx + 1) % words.length;
          delay    = PAUSE_BEFORE;
        }
        setTimeout(type, delay);
      }
      type();
    }
  }

  // ── Scroll reveal (Intersection Observer) ────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx      = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  // ── Back to top ───────────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  });

  // ── Contact form ──────────────────────────────────────────────
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const submitText  = document.getElementById('submitText');
  const submitIcon  = document.getElementById('submitIcon');
  const formSuccess = document.getElementById('formSuccess');

  if (!form) return;

  // Check if a real Formspree ID has been plugged in
  const formspreeConfigured = !form.getAttribute('action').includes('YOUR_FORM_ID');

  const fields = [
    { inputId: 'contactName',    errorId: 'nameError'    },
    { inputId: 'contactEmail',   errorId: 'emailError'   },
    { inputId: 'contactSubject', errorId: 'subjectError' },
    { inputId: 'contactMessage', errorId: 'messageError' },
  ];
  const fieldIds = fields.map(f => f.inputId);

  function showError(inputId, msg) {
    const f = fields.find(f => f.inputId === inputId);
    document.getElementById(inputId)?.classList.add('error');
    const err = document.getElementById(f?.errorId);
    if (err) err.textContent = msg;
  }

  function clearError(inputId) {
    const f = fields.find(f => f.inputId === inputId);
    document.getElementById(inputId)?.classList.remove('error');
    const err = document.getElementById(f?.errorId);
    if (err) err.textContent = '';
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate() {
    fieldIds.forEach(clearError);
    let ok = true;

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name)                { showError('contactName',    'Please enter your name.');                    ok = false; }
    if (!email)               { showError('contactEmail',   'Please enter your email address.');           ok = false; }
    else if (!isValidEmail(email)) { showError('contactEmail', 'Please enter a valid email address.');     ok = false; }
    if (!subject)             { showError('contactSubject', 'Please enter a subject.');                    ok = false; }
    if (message.length < 10)  { showError('contactMessage', 'Message must be at least 10 characters.');   ok = false; }

    return ok;
  }

  fieldIds.forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => clearError(id));
  });

  function setLoading(loading) {
    submitBtn.disabled  = loading;
    submitText.textContent = loading ? 'Sending…' : 'Send Message';
    if (submitIcon) submitIcon.style.opacity = loading ? '0' : '1';
  }

  function showSuccess() {
    formSuccess.hidden = false;
    setTimeout(() => { formSuccess.hidden = true; }, 6000);
  }

  // Fallback: open the user's email client with fields pre-filled.
  // Works with zero setup — the sender clicks Send in their own email app.
  function openMailtoFallback() {
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    const body   = `From: ${name} <${email}>\n\n${message}`;
    const mailto = `mailto:muhammadrayyyaaan@gmail.com`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    if (formspreeConfigured) {
      // Submit to Formspree via fetch (no page reload, shows inline success)
      try {
        const res = await fetch(form.getAttribute('action'), {
          method:  'POST',
          body:    new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.reset();
          showSuccess();
        } else {
          // Formspree returned an error — fall through to mailto
          openMailtoFallback();
        }
      } catch {
        // Network error — fall through to mailto
        openMailtoFallback();
      }
    } else {
      // Formspree not configured: open email client directly.
      // No fake success message — the email client opening IS the feedback.
      openMailtoFallback();
    }

    setLoading(false);
  });

});
