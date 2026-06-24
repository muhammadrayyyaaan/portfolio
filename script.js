/* Portfolio — Mohamed Rayyan */

document.addEventListener('DOMContentLoaded', () => {

  // ── Theme toggle ─────────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function applyTheme(theme, animate) {
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animate && !noMotion) {
      html.classList.add('theme-transitioning');
      setTimeout(() => html.classList.remove('theme-transitioning'), 300);
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next, true);
    });
  }

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

});
