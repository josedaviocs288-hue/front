/**
 * Recicle – main.js
 * Handles: mobile menu, collection-point search, contact form validation.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* ------------------------------------------------------------------
     Year in footer
  ------------------------------------------------------------------ */
  var yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     Mobile navigation toggle
  ------------------------------------------------------------------ */
  var menuToggle = $('#menuToggle');
  var mobileMenu = $('#mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when a link is clicked
    $$('a', mobileMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------
     Collection-point search
  ------------------------------------------------------------------ */
  var searchForm = $('#searchForm');
  var searchInput = $('#searchInput');
  var searchFeedback = $('#searchFeedback');
  var pointCards = $$('.point-card');

  /**
   * Normalizes a string for comparison: lowercase, no diacritics.
   * @param {string} str
   * @returns {string}
   */
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var query = normalize(searchInput.value.trim());

      if (!query) {
        // Show all cards if query is empty
        pointCards.forEach(function (card) {
          card.style.display = '';
        });
        if (searchFeedback) searchFeedback.textContent = '';
        return;
      }

      var found = 0;
      pointCards.forEach(function (card) {
        var text = normalize(card.textContent);
        if (text.includes(query)) {
          card.style.display = '';
          found++;
        } else {
          card.style.display = 'none';
        }
      });

      if (searchFeedback) {
        searchFeedback.textContent =
          found > 0
            ? found + ' ponto(s) encontrado(s) para "' + searchInput.value.trim() + '".'
            : 'Nenhum ponto encontrado para "' + searchInput.value.trim() + '". Tente outro termo.';
      }
    });
  }

  /* ------------------------------------------------------------------
     Contact form validation
  ------------------------------------------------------------------ */
  var contactForm = $('#contactForm');

  if (contactForm) {
    var nameInput    = $('#contactName');
    var emailInput   = $('#contactEmail');
    var messageInput = $('#contactMessage');
    var nameError    = $('#nameError');
    var emailError   = $('#emailError');
    var messageError = $('#messageError');
    var successMsg   = $('#contactSuccess');

    /**
     * Validates an email address format.
     * @param {string} email
     * @returns {boolean}
     */
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Shows an error on a field.
     * @param {HTMLElement} field
     * @param {HTMLElement} errorEl
     * @param {string} message
     */
    function showError(field, errorEl, message) {
      field.classList.add('is-error');
      if (errorEl) errorEl.textContent = message;
    }

    /**
     * Clears the error state on a field.
     * @param {HTMLElement} field
     * @param {HTMLElement} errorEl
     */
    function clearError(field, errorEl) {
      field.classList.remove('is-error');
      if (errorEl) errorEl.textContent = '';
    }

    // Map each input to its corresponding error element
    var inputErrorMap = [
      { input: nameInput,    error: nameError },
      { input: emailInput,   error: emailError },
      { input: messageInput, error: messageError },
    ];

    // Clear errors on user input
    inputErrorMap.forEach(function (pair) {
      if (!pair.input) return;
      pair.input.addEventListener('input', function () {
        clearError(pair.input, pair.error);
        if (successMsg) successMsg.textContent = '';
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      // Validate name
      if (!nameInput || !nameInput.value.trim()) {
        showError(nameInput, nameError, 'Por favor, informe seu nome.');
        valid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate email
      if (!emailInput || !emailInput.value.trim()) {
        showError(emailInput, emailError, 'Por favor, informe seu e-mail.');
        valid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Informe um e-mail válido.');
        valid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate message
      if (!messageInput || !messageInput.value.trim()) {
        showError(messageInput, messageError, 'Por favor, escreva sua mensagem.');
        valid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (valid) {
        // In a real application, the form data would be submitted to an API here.
        contactForm.reset();
        if (successMsg) {
          successMsg.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
        }
      }
    });
  }

  /* ------------------------------------------------------------------
     Smooth active-link highlight on scroll
  ------------------------------------------------------------------ */
  var sections = $$('section[id]');
  var navLinks = $$('.navbar__links a[href^="#"]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              if (link.getAttribute('href') === '#' + id) {
                link.style.color = 'var(--color-primary)';
              } else {
                link.style.color = '';
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
