(() => {
  'use strict';

  // 1. Dynamic copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Highlight target service card when clicking a service link in the red hero strip
  const heroServiceLinks = document.querySelectorAll('.hero__services-inline a[href^="#service-"]');
  let highlightTimer = null;

  heroServiceLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href');
      if (!targetId) return;
      const targetCard = document.querySelector(targetId);
      if (!targetCard) return;

      document.querySelectorAll('.service-card.is-highlighted').forEach((card) => {
        card.classList.remove('is-highlighted');
      });

      targetCard.classList.add('is-highlighted');
      window.clearTimeout(highlightTimer);
      highlightTimer = window.setTimeout(() => {
        targetCard.classList.remove('is-highlighted');
      }, 2400);
    });
  });

  // 3. Scroll reveal for service cards
  const revealTargets = document.querySelectorAll('.service-card, .notify__inner');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((el, index) => {
      el.classList.add('reveal');
      if (el.classList.contains('service-card')) {
        el.style.transitionDelay = `${(index % 3) * 80}ms`;
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  // 4. Launch Notification Form
  const form = document.getElementById('notifyForm');
  const emailInput = document.getElementById('notifyEmail');
  const feedbackEl = document.getElementById('notifyFeedback');
  const STORAGE_KEY = 'friends_intl_notify_email';

  const setFeedback = (message, state) => {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('is-success', 'is-error');
    if (state) {
      feedbackEl.classList.add(state);
    }
  };

  // Restore saved confirmation if returning visitor already signed up
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setFeedback(`You are on the launch list (${saved}). We will notify you once we go live.`, 'is-success');
    }
  } catch {
    // Ignore storage access errors in restricted modes
  }

  if (form && emailInput) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

      if (!email || !validEmail) {
        setFeedback('Please enter a valid email address so we can reach you at launch.', 'is-error');
        emailInput.focus();
        return;
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, email);
      } catch {
        // Ignore storage errors
      }

      emailInput.value = '';
      setFeedback(`Thank you! We will notify ${email} as soon as our new website launches.`, 'is-success');
    });
  }
})();
