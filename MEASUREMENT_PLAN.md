# Measurement setup and verification

Updated October 16, 2026.

## Separate three different facts

1. Source emits a privacy-limited event.
2. An approved measurement tag loads and receives it.
3. The correct Analytics account reports it and associates it with a real business outcome.

Only the first is established by repository code. Browser mocks verify behavior without transmitting real events. Never call an empty Tag Manager container active Analytics.

The former public container GTM-WDZ8L9TN was found with an empty published tags array during recovery. The current integration does not silently load it. Explicit legacy mode remains available for a verified later configuration; merely selecting that mode does not add any account-side tags.

## Configuration

The default `PUBLIC_ANALYTICS_MODE=auto` chooses a valid `PUBLIC_GA4_ID` when supplied; otherwise a valid `PUBLIC_GTM_ID`. With neither, no optional tag or consent popup loads. Explicit `ga4` and `gtm` modes require their respective ID. `off` disables optional analytics. Never invent a measurement ID or copy another property's ID.

For direct GA4, publish to the confirmed owner-controlled web stream, disable unwanted enhanced-measurement events and review data settings. The code sends one manual page_view, suppresses the configuration page view, disables advertising signals, strips query strings from page locations and reduces referrers to their origin.

For GTM, inspect the container and publish a reviewed Google Analytics tag and fixed event triggers. Review automatic page variables separately because GTM tags can collect fields beyond the website's event helper. Keep advertising consent denied and honor consent in every third-party tag. Do not load direct GA4 and an equivalent GTM Analytics tag simultaneously.

## Consent and event contract

No optional script is fetched before consent. The local consent choice is separate from contact-form permission. Global Privacy Control and Do Not Track prevent loading. Rejecting optional analytics does not disable the form, phone or SMS actions. Withdrawing consent reloads the page without optional scripts; it does not erase data already held by providers.

The helper permits fixed events: site_page_view, call_click, text_click, review_profile_click, lead_form_start, lead_form_validation_error, lead_form_success, lead_form_error. Permitted context is path-only page_path, a fixed page_group, contact form_type, a fixed cta_location and approved business phone links. No form values, customer addresses, document details, full VINs or URL query strings are copied into these events. Events queued before opting in are not replayed to a newly loaded tag.

A lead_form_success requires both successful HTTP status and an explicit ok:true response from the existing delivery API. It indicates the API's acceptance after provider submission, not that a mailbox recipient read the message. A tel or sms click does not establish an answered conversation or completed vehicle purchase.

## Required live verification

- Confirm the Vercel project scope and approved public measurement ID.
- Review the destination's actual published tags/settings.
- Test consent rejection and acceptance in a real browser without an ad blocker.
- Check GA4 DebugView/Realtime or GTM Preview for one event per action in the correct account.
- Verify that query strings and inquiry values are absent from reporting payloads.
- Test actual contact delivery only with authorization, an unmistakable test message and mailbox/provider confirmation.
- Keep source/medium, city, qualified inquiry and completed purchase in an appropriate private lead log rather than sending customer details into analytics.

The available account connection did not authorize the Vercel project during recovery. No live GA4 account or published measurement ID was available. Account-side publication and collection verification remain an explicit activation requirement; source-code tests must not be substituted for them.
