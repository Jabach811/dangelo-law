document.documentElement.classList.add('js');

window.DangeloSite = {
  initMenu() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-primary-nav]');
    if (!toggle || !nav) return;

    const closeMenu = ({ returnFocus = false } = {}) => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.hidden = true;
      document.body.classList.remove('nav-open');
      if (returnFocus) toggle.focus();
    };

    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
      nav.hidden = false;
      document.body.classList.add('nav-open');
      nav.querySelector('a')?.focus();
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu({ returnFocus: true });
      }
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a') && window.matchMedia('(max-width: 60rem)').matches) {
        closeMenu();
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 60.001rem)');
    const syncMenu = (event) => {
      if (event.matches) {
        nav.hidden = false;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        document.body.classList.remove('nav-open');
      } else {
        nav.hidden = toggle.getAttribute('aria-expanded') !== 'true';
      }
    };

    desktopQuery.addEventListener('change', syncMenu);
    syncMenu(desktopQuery);
  },

  initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const status = form.querySelector('[data-form-status]');
    const fields = [...form.querySelectorAll('[data-validate]')];

    const messages = {
      first_name: 'Enter your first name.',
      last_name: 'Enter your last name.',
      email: 'Enter a valid email address.',
      phone: 'Enter a phone number with at least 10 digits.',
      matter: 'Choose the type of help you need.',
      details: 'Share a short description of what you need help with.',
    };

    const isValid = (field) => {
      const value = field.value.trim();
      if (!value) return false;
      if (field.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (field.name === 'phone') return value.replace(/\D/g, '').length >= 10;
      return true;
    };

    const setFieldState = (field, valid) => {
      const error = form.querySelector(`#${field.id}-error`);
      field.setAttribute('aria-invalid', String(!valid));
      if (error) error.textContent = valid ? '' : messages[field.name];
      return valid;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => setFieldState(field, isValid(field)));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') {
          setFieldState(field, isValid(field));
        }
      });
    });

    const submitButton = form.querySelector('button[type="submit"]');
    const callLink = '<a href="tel:+12098342222">(209) 834-2222</a>';
    submitButton.disabled = false;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const results = fields.map((field) => setFieldState(field, isValid(field)));
      const firstInvalid = fields[results.indexOf(false)];

      if (firstInvalid) {
        status.dataset.state = 'error';
        status.textContent = 'Check the highlighted fields and try again.';
        firstInvalid.focus();
        return;
      }

      status.dataset.state = 'notice';
      status.innerHTML = `This is a design preview, so your inquiry was not sent or saved. To reach the office, call ${callLink}.`;
    });
  },

  initCurrentYear() {
    document.querySelectorAll('[data-current-year]').forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  },

  init() {
    this.initMenu();
    this.initContactForm();
    this.initCurrentYear();
  },
};

document.addEventListener('DOMContentLoaded', () => window.DangeloSite.init());
