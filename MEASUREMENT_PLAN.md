# Conversion and measurement plan

## Goal hierarchy

Primary business outcomes:

1. qualified phone calls about an unwanted vehicle
2. qualified text-message starts
3. successfully delivered general inquiries

Secondary outcomes:

- general contact submissions
- service-area and guide engagement that precedes a primary action

Do not optimize to page views, form starts, or button clicks without confirming lead quality.

## Activation gate

The site runs without an analytics vendor by default. Browser events are pushed to `window.dataLayer`, but no data leaves the browser unless an owner-approved `PUBLIC_GTM_ID` is present at build time and the container is configured.

Before enabling Google Tag Manager:

- approve the container owner and publish workflow
- decide whether consent management is required for the chosen tags
- prevent URL query strings and form values from entering analytics
- test in Vercel Preview
- document Google Analytics and advertising account access

## Implemented data-layer events

| Event                        | Trigger                               | Parameters               | Conversion role              |
| ---------------------------- | ------------------------------------- | ------------------------ | ---------------------------- |
| `site_page_view`             | Every rendered page                   | `page_path`              | Context only                 |
| `call_click`                 | Any tracked `tel:` action             | `link_url`, `page_path`  | Primary click proxy          |
| `text_click`                 | Any tracked `sms:` action             | `link_url`, `page_path`  | Secondary click proxy        |
| `lead_form_start`            | First focus inside the contact form   | `form_type`, `page_path` | Funnel diagnostic            |
| `lead_form_validation_error` | Browser validation blocks submission  | `form_type`, `page_path` | UX diagnostic                |
| `lead_form_success`          | API confirms internal delivery        | `form_type`, `page_path` | Secondary contact conversion |
| `lead_form_error`            | Submission fails after client attempt | `form_type`, `page_path` | Reliability alert/diagnostic |

No customer name, email, phone, VIN, city, vehicle make/model, message, title status, or Turnstile token is placed in the data layer.

## Recommended GTM mapping

| Data-layer event                          | GA4 event                                     | Google Ads use                           |
| ----------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| `call_click`                              | `generate_lead` with `lead_type=phone_click`  | Secondary until call quality is verified |
| `text_click`                              | `generate_lead` with `lead_type=text_click`   | Secondary                                |
| `lead_form_success` + `form_type=contact` | `generate_lead` with `lead_type=contact_form` | Secondary                                |
| validation/error events                   | custom diagnostic events                      | Never a conversion                       |

Avoid sending `link_url` to third parties if the analytics policy treats a business phone URI as unnecessary. `page_path` should remain path-only.

## Phone measurement

A `tel:` click is not proof of a connected or qualified call. Preferred progression:

1. launch with `call_click` as a directional metric
2. compare click volume to call logs manually
3. if call tracking is approved, use a provider that supports dynamic number insertion without replacing the canonical NAP in HTML, schema, GBP, or citations
4. define a qualified-call duration only after reviewing real calls

## Lead quality feedback

Track outside analytics, in a privacy-appropriate lead log or CRM:

- source/medium/campaign when legitimately available
- phone, text, or contact form
- serviceable location: yes/no
- vehicle accepted for review: yes/no
- reached owner: yes/no
- transaction completed: yes/no
- duplicate/spam: yes/no

Never expose these fields publicly or use customer details in a data-layer event.

## Campaign conventions

Use lowercase UTM values and a controlled naming sheet:

- `utm_source`: platform, e.g. `google`, `facebook`
- `utm_medium`: channel, e.g. `cpc`, `organic_social`
- `utm_campaign`: stable initiative name
- `utm_content`: ad/creative differentiator only when needed

Do not put customer, vehicle, location-address, or phone data in campaign parameters.

## Validation

Before launch:

- verify the site has no network request to GTM when `PUBLIC_GTM_ID` is absent
- verify the approved container loads only on intended environments
- use GTM Preview and GA4 DebugView to confirm every event once
- submit the contact form and confirm only successful internal delivery fires `lead_form_success`
- verify form errors never fire a conversion
- check mobile call and text actions
- confirm no PII appears in dataLayer, network payloads, page URL, or analytics reports

Review conversion quality after two and four weeks. Do not declare success based on traffic growth alone.
