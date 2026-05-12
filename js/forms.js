/*
 * Native fetch form handler for Merritt's Auto Recycling.
 *
 * Wires up every form whose `action` starts with "/api/":
 *   - HTML5 + custom client-side validation (returns inline field errors)
 *   - Honeypot trap (silent server-side bot drop)
 *   - Cloudflare Turnstile token resolution
 *   - JSON request to the Vercel function, JSON response handling
 *   - Success / error UI swapping (`#success` / `#error` siblings)
 *
 * Works without jQuery. Defers nothing — the script tag itself is loaded with `defer`.
 *
 * Idempotent: re-runs are no-ops thanks to a per-form `dataset.formBound` guard.
 */
(function () {
  'use strict';

  var TURNSTILE_TIMEOUT_MS = 15000;
  var REQUEST_TIMEOUT_MS = 20000;

  /**
   * Inline field-level error message. Inserted/updated as a sibling of the offending input.
   */
  function setFieldError(input, message) {
    var wrapper = input.closest('.input-wrapper') || input.parentElement;
    if (!wrapper) return;
    var existing = wrapper.querySelector('.form-field-error');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (existing) {
        existing.textContent = message;
      } else {
        var node = document.createElement('span');
        node.className = 'form-field-error';
        node.setAttribute('role', 'alert');
        node.textContent = message;
        wrapper.appendChild(node);
      }
    } else {
      input.removeAttribute('aria-invalid');
      if (existing) existing.remove();
    }
  }

  function clearAllFieldErrors(form) {
    form.querySelectorAll('.form-field-error').forEach(function (node) {
      node.remove();
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (node) {
      node.removeAttribute('aria-invalid');
    });
  }

  function showOutcome(form, kind) {
    var success = form.querySelector('.successform');
    var error = form.querySelector('.errorform');
    if (success) success.classList.toggle('is-visible', kind === 'success');
    if (error) error.classList.toggle('is-visible', kind === 'error');
  }

  /**
   * Client-side validation mirrors the server Zod schemas closely enough to catch typos before a
   * round-trip. The server is authoritative.
   */
  function validate(form) {
    var ok = true;
    clearAllFieldErrors(form);

    var inputs = form.querySelectorAll('input[name], textarea[name]');
    inputs.forEach(function (el) {
      var name = el.getAttribute('name');
      if (name === 'honeypot' || name === 'cf-turnstile-response') return;

      var value = (el.value || '').trim();
      var required = el.hasAttribute('required');
      var minLen = parseInt(el.getAttribute('minlength') || '0', 10);
      var maxLen = parseInt(el.getAttribute('maxlength') || '0', 10);
      var type = (el.getAttribute('type') || 'text').toLowerCase();

      if (!value) {
        if (required) {
          setFieldError(el, 'Please fill in this field.');
          ok = false;
        }
        return;
      }
      if (minLen && value.length < minLen) {
        setFieldError(el, 'Please enter at least ' + minLen + ' characters.');
        ok = false;
        return;
      }
      if (maxLen && value.length > maxLen) {
        setFieldError(el, 'Please keep this under ' + maxLen + ' characters.');
        ok = false;
        return;
      }
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFieldError(el, 'Please enter a valid email address.');
        ok = false;
        return;
      }
      if (type === 'tel' && !/^[0-9+\-\s().,extEXT]+$/.test(value)) {
        setFieldError(el, 'Please enter a valid phone number.');
        ok = false;
        return;
      }
    });

    return ok;
  }

  /**
   * Wait for Turnstile to deliver a token. Cloudflare auto-renders `.cf-turnstile` divs and
   * injects a hidden `<input name="cf-turnstile-response">` once the challenge completes. We
   * poll briefly because the script is `async defer` and may not be ready at form-mount time.
   */
  function awaitTurnstileToken(form) {
    return new Promise(function (resolve, reject) {
      var deadline = Date.now() + TURNSTILE_TIMEOUT_MS;
      var widget = form.querySelector('.cf-turnstile');
      if (!widget) {
        resolve(null); // no Turnstile widget — server may still 403; allow caller to decide
        return;
      }
      function tick() {
        var input = form.querySelector('input[name="cf-turnstile-response"]');
        var token = input ? input.value : '';
        if (token) {
          resolve(token);
          return;
        }
        if (Date.now() > deadline) {
          reject(new Error('turnstile_timeout'));
          return;
        }
        setTimeout(tick, 250);
      }
      tick();
    });
  }

  function resetTurnstile(form) {
    var widget = form.querySelector('.cf-turnstile');
    if (!widget) return;
    if (window.turnstile && typeof window.turnstile.reset === 'function') {
      try {
        window.turnstile.reset(widget);
      } catch (_) {
        /* widget not yet rendered */
      }
    }
  }

  function setSubmitting(form, isSubmitting) {
    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = isSubmitting;
    btn.classList.toggle('is-submitting', isSubmitting);
    if (isSubmitting) {
      btn.setAttribute('aria-busy', 'true');
      if (!btn.dataset.originalLabel) {
        btn.dataset.originalLabel = btn.textContent || '';
      }
    } else {
      btn.removeAttribute('aria-busy');
    }
  }

  function fetchWithTimeout(url, init, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var controller = 'AbortController' in window ? new AbortController() : null;
      if (controller) init.signal = controller.signal;
      var timer = setTimeout(function () {
        if (controller) controller.abort();
        reject(new Error('request_timeout'));
      }, timeoutMs);
      fetch(url, init)
        .then(function (r) {
          clearTimeout(timer);
          resolve(r);
        })
        .catch(function (e) {
          clearTimeout(timer);
          reject(e);
        });
    });
  }

  function applyServerFieldErrors(form, fields) {
    Object.keys(fields).forEach(function (key) {
      var input = form.querySelector('[name="' + key + '"]');
      if (input) setFieldError(input, fields[key]);
    });
  }

  function bind(form) {
    if (form.dataset.formBound === '1') return;
    form.dataset.formBound = '1';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showOutcome(form, null);
      if (!validate(form)) return;

      setSubmitting(form, true);
      awaitTurnstileToken(form)
        .then(function () {
          var formData = new FormData(form);
          var payload = {};
          formData.forEach(function (value, key) {
            payload[key] = value;
          });

          return fetchWithTimeout(
            form.action,
            {
              method: 'POST',
              headers: { 'content-type': 'application/json', accept: 'application/json' },
              credentials: 'same-origin',
              body: JSON.stringify(payload),
            },
            REQUEST_TIMEOUT_MS,
          ).then(function (res) {
            return res.json().then(function (body) {
              return { res: res, body: body };
            });
          });
        })
        .then(function (result) {
          var res = result.res;
          var body = result.body;
          if (res.ok && body && body.ok) {
            showOutcome(form, 'success');
            form.reset();
            clearAllFieldErrors(form);
            resetTurnstile(form);
            return;
          }
          if (body && body.error === 'validation_failed' && body.fields) {
            applyServerFieldErrors(form, body.fields);
            showOutcome(form, 'error');
          } else {
            showOutcome(form, 'error');
          }
          resetTurnstile(form);
        })
        .catch(function (err) {
          showOutcome(form, 'error');
          resetTurnstile(form);
          if (window.console && console.warn) {
            console.warn('form.submit.failed', err && err.message);
          }
        })
        .then(function () {
          setSubmitting(form, false);
        });
    });
  }

  function init() {
    var forms = document.querySelectorAll('form[action^="/api/"]');
    forms.forEach(bind);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
