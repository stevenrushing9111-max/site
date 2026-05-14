/* ==========================================================================
   forBET Media — Site Script
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Overlay Menu
     -------------------------------------------------------------------------- */
  const menuButton = document.querySelector('[data-menu-open]');
  const menuClose  = document.querySelector('[data-menu-close]');
  const menuPanel  = document.querySelector('[data-menu-panel]');
  const menuOverlay = document.querySelector('[data-menu-overlay]');
  const body = document.body;

  function openMenu() {
    if (!menuPanel || !menuOverlay) return;
    menuPanel.classList.add('is-open');
    menuOverlay.classList.add('is-open');
    body.classList.add('no-scroll');
    menuPanel.setAttribute('aria-hidden', 'false');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'true');
    // Move focus to close button for accessibility
    if (menuClose) setTimeout(() => menuClose.focus(), 100);
  }

  function closeMenu() {
    if (!menuPanel || !menuOverlay) return;
    menuPanel.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    body.classList.remove('no-scroll');
    menuPanel.setAttribute('aria-hidden', 'true');
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  }

  if (menuButton) menuButton.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuPanel && menuPanel.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* --------------------------------------------------------------------------
     Sticky header shadow on scroll
     -------------------------------------------------------------------------- */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const updateHeader = () => {
      if (window.scrollY > 8) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* --------------------------------------------------------------------------
     Smooth scroll for in-page anchors
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     Active link highlighting (menu)
     -------------------------------------------------------------------------- */
  function normalizePath(path) {
    if (!path) return '/';
    // Strip trailing index.html
    path = path.replace(/index\.html$/, '');
    // Ensure trailing slash for non-root paths
    if (path !== '/' && !path.endsWith('/')) path += '/';
    return path;
  }

  const currentPath = normalizePath(window.location.pathname);

  document.querySelectorAll('[data-menu-panel] a[href]').forEach(function (link) {
    try {
      const url = new URL(link.href, window.location.origin);
      const linkPath = normalizePath(url.pathname);
      // For GitHub Pages project sites, the path may include /repo-name/
      // Match by suffix to handle both root-domain and subpath deployments.
      if (linkPath === currentPath ||
          currentPath.endsWith(linkPath) ||
          (linkPath !== '/' && currentPath.includes(linkPath))) {
        link.classList.add('active');
      }
    } catch (err) { /* noop */ }
  });

  /* --------------------------------------------------------------------------
     FAQ Accordion
     -------------------------------------------------------------------------- */
  document.querySelectorAll('[data-faq-item]').forEach(function (item) {
    const trigger = item.querySelector('[data-faq-trigger]');
    const answer = item.querySelector('[data-faq-answer]');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all others (single-open behavior)
      document.querySelectorAll('[data-faq-item].open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const a = other.querySelector('[data-faq-answer]');
          if (a) a.style.maxHeight = null;
          const t = other.querySelector('[data-faq-trigger]');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------------------------------------------------------------
     Contact form — static notice (no backend)
     -------------------------------------------------------------------------- */
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const notice = contactForm.querySelector('[data-form-notice]');
      if (notice) {
        notice.textContent = 'This form is for inquiry preview only. Please email us directly at contact@forbetmedia.com — we will get back to you within two business days.';
        notice.style.color = 'var(--color-navy)';
      }
    });
  }

  /* --------------------------------------------------------------------------
     Footer year (auto-current if needed)
     -------------------------------------------------------------------------- */
  // Intentionally fixed to 2026 per brand spec.
})();
