type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  turnstile?: { reset: (element?: HTMLElement) => void };
};

const analyticsWindow = window as DataLayerWindow;

function track(event: string, details: Record<string, unknown> = {}): void {
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.dataLayer.push({ event, page_path: window.location.pathname, ...details });
}

function readErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object')
    return 'We could not send the message. Please call instead.';
  const body = data as { error?: string; fields?: Record<string, string> };
  if (body.fields) {
    const first = Object.entries(body.fields)[0];
    if (first) return `Please review ${first[0]}: ${first[1]}`;
  }
  const messages: Record<string, string> = {
    rate_limited: 'Too many requests were sent. Wait a minute or call instead.',
    turnstile_failed: 'The security check expired. Please try it again.',
    validation_failed: 'Please review the required fields and try again.',
    send_failed: 'We could not deliver the message. Please call instead.',
  };
  return body.error
    ? (messages[body.error] ?? 'We could not send the message. Please call instead.')
    : 'We could not send the message. Please call instead.';
}

function enhanceForm(form: HTMLFormElement): void {
  if (form.dataset.enhanced === 'true') return;
  form.dataset.enhanced = 'true';
  const formType = form.dataset.leadForm ?? 'unknown';
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  let started = false;
  let idempotencyKey = crypto.randomUUID();
  let succeeded = false;

  form.addEventListener(
    'focusin',
    () => {
      if (started) return;
      started = true;
      track('lead_form_start', { form_type: formType });
    },
    { once: true },
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    form
      .querySelectorAll('[aria-invalid="true"]')
      .forEach((field) => field.removeAttribute('aria-invalid'));

    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.dataset.state = 'error';
        status.textContent = 'Please complete the required fields.';
      }
      track('lead_form_validation_error', { form_type: formType });
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.dataset.originalLabel = submit.textContent ?? '';
      submit.textContent = 'Sending…';
    }
    if (status) {
      status.dataset.state = '';
      status.textContent = 'Sending your message securely…';
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.contactConsent = formData.has('contactConsent') ? 'true' : 'false';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) throw { response, data };

      track('lead_form_success', { form_type: formType });
      succeeded = true;
      if (status) {
        status.dataset.state = 'success';
        status.textContent = 'Message sent. Redirecting…';
      }
      idempotencyKey = crypto.randomUUID();
      window.setTimeout(() => {
        window.location.assign(form.dataset.successUrl ?? '/thank-you');
      }, 250);
    } catch (error) {
      const data =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data: unknown }).data
          : null;
      if (status) {
        status.dataset.state = 'error';
        status.textContent = readErrorMessage(data);
        status.focus();
      }
      track('lead_form_error', { form_type: formType });
      const widget = form.querySelector<HTMLElement>('.cf-turnstile');
      if (widget) analyticsWindow.turnstile?.reset(widget);
    } finally {
      if (submit && !succeeded) {
        submit.disabled = false;
        submit.textContent = submit.dataset.originalLabel ?? 'Submit';
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach(enhanceForm);
