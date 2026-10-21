/* =====================================================
   Nia's Purpose Venue — interactions
   ===================================================== */
(function () {
  'use strict';

  var ENDPOINT = 'https://vision.leadrai.com/api/forms/bc6b767d75ca412e5f221640932d4869';

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeNav();
      closeLightbox();
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImage = document.getElementById('lbImage');
  var lbClose = document.getElementById('lbClose');
  var lastTrigger = null;

  function openLightbox(src, alt, trigger) {
    if (!lightbox || !lbImage) return;
    lastTrigger = trigger || null;
    lbImage.src = src;
    lbImage.alt = alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    if (lbImage) lbImage.src = '';
    document.body.style.overflow = '';
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  var grid = document.getElementById('galleryGrid');
  if (grid) {
    grid.addEventListener('click', function (e) {
      var shot = e.target.closest('.shot');
      if (!shot) return;
      var img = shot.querySelector('img');
      openLightbox(shot.getAttribute('data-full'), img ? img.alt : '', shot);
    });
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---------- Forms ---------- */
  var pageUrl = window.location.href;

  // Stamp the current page URL into every _page field on load.
  Array.prototype.forEach.call(document.querySelectorAll('[data-page]'), function (input) {
    input.value = pageUrl;
  });

  function showSuccess(container) {
    var success = container.querySelector('[data-success]');
    var form = container.querySelector('form[data-leadr]');
    if (success) {
      success.hidden = false;
      success.setAttribute('tabindex', '-1');
    }
    if (form) form.reset();
    if (success && typeof success.scrollIntoView === 'function') {
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // If a plain (no-JS) submission bounced back with ?submitted=1, confirm it.
  if (/[?&]submitted=1(&|$)/.test(window.location.search)) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-success]'), function (el) {
      el.hidden = false;
    });
  }

  function setError(form, message) {
    var box = form.querySelector('[data-error]');
    if (!box) return;
    if (message) {
      box.textContent = message;
      box.hidden = false;
    } else {
      box.textContent = '';
      box.hidden = true;
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('form[data-leadr]'), function (form) {
    form.addEventListener('submit', function (e) {
      // Let the browser surface its own validation UI first.
      if (!form.checkValidity()) {
        form.reportValidity();
        e.preventDefault();
        return;
      }

      e.preventDefault();
      setError(form, '');

      var button = form.querySelector('button[type="submit"]');
      var originalLabel = button ? button.textContent : '';
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }

      // Build a JSON payload mirroring the plain-form field names.
      var payload = {};
      new FormData(form).forEach(function (value, key) {
        payload[key] = typeof value === 'string' ? value : String(value);
      });
      payload._page = pageUrl;

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed with status ' + res.status);
          return res.json().catch(function () { return { ok: true }; });
        })
        .then(function (data) {
          if (data && data.ok === false) throw new Error('Submission rejected');
          var container = form.parentNode;
          showSuccess(container);
          form.hidden = true;
        })
        .catch(function () {
          setError(form, 'Sorry — something went wrong sending your inquiry. Please call us at (218) 210-5410 or email twalker@niaspurposellc.com.');
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = originalLabel;
          }
        });
    });
  });
})();
