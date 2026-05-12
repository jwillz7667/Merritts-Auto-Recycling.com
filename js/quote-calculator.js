/*
 * Quote calculator — Merritt's Auto Recycling.
 *
 * Reads `/data/scrap-pricing.json` (same file the server reads at build time) and computes a
 * preliminary cash range from vehicle inputs. The math here MUST stay aligned with
 * `api/_lib/calculator.ts` — when the user requests a callback we POST the inputs (not the
 * computed range), and the server recomputes authoritatively. Any drift here only changes what
 * the user previews, never what Brad receives.
 *
 * Pure vanilla JS (ES5). No jQuery, no build step — runs as a `defer`-loaded script.
 *
 * The page is progressive: form is fully usable without the result panel having appeared yet,
 * the result panel updates live as inputs change, and the callback form is the same DOM each
 * time (the script just toggles its `hidden` attribute and mirrors current vehicle inputs into
 * its hidden fields so the existing forms.js handler at /api/callback gets the right payload).
 */
(function () {
  'use strict';

  var PRICING_URL = '/data/scrap-pricing.json';

  /** @type {Object|null} */
  var pricing = null;

  /** Default year — 12 years old. Matches the median vehicle age of junk cars in MN. */
  var DEFAULT_YEAR = new Date().getFullYear() - 12;

  // --------------------------------------------------------------------------
  // Calculator core — mirror of api/_lib/calculator.ts. Kept terse intentionally.
  // --------------------------------------------------------------------------
  function pickYearBucket(year, config) {
    var buckets = config.yearBuckets;
    for (var i = 0; i < buckets.length; i++) {
      if (year <= buckets[i].maxYear) return buckets[i];
    }
    return buckets[buckets.length - 1];
  }

  function roundToNearest(n, step) {
    return Math.round(n / step) * step;
  }

  function formatCurrency(n) {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(n);
    } catch (_) {
      return '$' + Math.round(n).toLocaleString('en-US');
    }
  }

  function formatRange(low, high) {
    return formatCurrency(low) + ' – ' + formatCurrency(high);
  }

  function calculate(input, config) {
    var cls = config.vehicleClasses[input.vehicleClass];
    if (!cls) return null;

    var rate = config.rates.scrapRatePerLb;
    var scrapWeightValue = Math.round(cls.weightLbs * rate);
    var yearBucket = pickYearBucket(input.year, config);

    var applied = [];
    var m = config.modifiers;
    if (input.running)
      applied.push({ key: 'running', label: m.running.label, bonus: m.running.bonus });
    if (input.catalyticConverter)
      applied.push({
        key: 'catalyticConverter',
        label: m.catalyticConverter.label,
        bonus: m.catalyticConverter.bonus,
      });
    if (input.completeDrivetrain)
      applied.push({
        key: 'completeDrivetrain',
        label: m.completeDrivetrain.label,
        bonus: m.completeDrivetrain.bonus,
      });
    if (input.wheelsAndTires)
      applied.push({
        key: 'wheelsAndTires',
        label: m.wheelsAndTires.label,
        bonus: m.wheelsAndTires.bonus,
      });

    var bonusesTotal = 0;
    for (var b = 0; b < applied.length; b++) bonusesTotal += applied[b].bonus;
    var rawTotal = scrapWeightValue + yearBucket.modifier + bonusesTotal;

    var rates = config.rates;
    var low = Math.max(
      rates.minQuote,
      Math.min(rates.maxQuote, roundToNearest(rawTotal * rates.spreadLow, rates.roundToNearest)),
    );
    var high = Math.max(
      rates.minQuote,
      Math.min(rates.maxQuote, roundToNearest(rawTotal * rates.spreadHigh, rates.roundToNearest)),
    );

    return {
      low: low,
      high: high,
      point: Math.round((low + high) / 2),
      display: formatRange(low, high),
      vehicleClass: { key: input.vehicleClass, label: cls.label, weightLbs: cls.weightLbs },
      yearBucket: { label: yearBucket.label, modifier: yearBucket.modifier },
      modifiersApplied: applied,
      basis: {
        scrapWeightValue: scrapWeightValue,
        yearModifier: yearBucket.modifier,
        bonusesTotal: bonusesTotal,
        rawTotal: rawTotal,
      },
    };
  }

  // --------------------------------------------------------------------------
  // DOM helpers
  // --------------------------------------------------------------------------
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }
  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function setHidden(el, hidden) {
    if (!el) return;
    if (hidden) el.setAttribute('hidden', 'hidden');
    else el.removeAttribute('hidden');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --------------------------------------------------------------------------
  // Rendering
  // --------------------------------------------------------------------------
  function buildVehicleClassOptions(select, config) {
    var keys = Object.keys(config.vehicleClasses);
    keys.sort(function (a, b) {
      return (config.vehicleClasses[a].order || 0) - (config.vehicleClasses[b].order || 0);
    });
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select vehicle type…';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = config.vehicleClasses[k];
      var opt = document.createElement('option');
      opt.value = k;
      opt.textContent = v.label + (v.examples ? ' (e.g. ' + v.examples + ')' : '');
      select.appendChild(opt);
    }
  }

  function configureYearInput(input) {
    var max = new Date().getFullYear() + 1;
    input.min = '1950';
    input.max = String(max);
    if (!input.value) input.value = String(DEFAULT_YEAR);
  }

  function gatherInputs(form) {
    var fd = new FormData(form);
    var year = parseInt(String(fd.get('year') || ''), 10);
    if (!year || year < 1950) year = DEFAULT_YEAR;
    return {
      vehicleClass: String(fd.get('vehicleClass') || ''),
      year: year,
      running: !!fd.get('running'),
      catalyticConverter: !!fd.get('catalyticConverter'),
      completeDrivetrain: !!fd.get('completeDrivetrain'),
      wheelsAndTires: !!fd.get('wheelsAndTires'),
    };
  }

  function renderBreakdown(listEl, quote, weightLbs, ratePerLb) {
    if (!listEl) return;
    var items = [];
    items.push({
      label:
        'Scrap weight value (' +
        weightLbs.toLocaleString('en-US') +
        ' lbs × $' +
        ratePerLb.toFixed(3) +
        '/lb)',
      value: '+' + formatCurrency(quote.basis.scrapWeightValue),
    });
    items.push({
      label: 'Year adjustment (' + quote.yearBucket.label + ')',
      value:
        (quote.basis.yearModifier >= 0 ? '+' : '−') +
        formatCurrency(Math.abs(quote.basis.yearModifier)),
    });
    for (var i = 0; i < quote.modifiersApplied.length; i++) {
      var m = quote.modifiersApplied[i];
      items.push({ label: m.label, value: '+' + formatCurrency(m.bonus) });
    }
    items.push({
      label: 'Conservative spread to range',
      value: 'rounded to nearest $25',
    });

    listEl.innerHTML = '';
    for (var j = 0; j < items.length; j++) {
      var li = document.createElement('li');
      li.className = 'quote-calculator__breakdown-row';
      li.innerHTML =
        '<span class="quote-calculator__breakdown-label">' +
        escapeHtml(items[j].label) +
        '</span>' +
        '<span class="quote-calculator__breakdown-value">' +
        escapeHtml(items[j].value) +
        '</span>';
      listEl.appendChild(li);
    }
  }

  function mirrorToCallbackForm(callbackForm, inputs) {
    if (!callbackForm) return;
    var fields = {
      vehicleClass: inputs.vehicleClass,
      year: String(inputs.year),
      running: inputs.running ? 'true' : 'false',
      catalyticConverter: inputs.catalyticConverter ? 'true' : 'false',
      completeDrivetrain: inputs.completeDrivetrain ? 'true' : 'false',
      wheelsAndTires: inputs.wheelsAndTires ? 'true' : 'false',
    };
    var keys = Object.keys(fields);
    for (var i = 0; i < keys.length; i++) {
      var input = callbackForm.querySelector('input[name="' + keys[i] + '"]');
      if (input) input.value = fields[keys[i]];
    }
  }

  // --------------------------------------------------------------------------
  // Main wiring
  // --------------------------------------------------------------------------
  function init() {
    var calcForm = $('[data-calc-form]');
    if (!calcForm) return;

    var resultEl = $('[data-calc-result]');
    var emptyStateEl = $('[data-calc-empty]');
    var rangeEl = $('[data-calc-range]');
    var summaryEl = $('[data-calc-summary]');
    var breakdownEl = $('[data-calc-breakdown]');
    var calloutEl = $('[data-calc-callout]');
    var revealBtn = $('[data-calc-callback-trigger]');
    var callbackSection = $('[data-calc-callback-section]');
    var callbackForm = $('[data-calc-callback]');
    var pricingNote = $('[data-calc-pricing-note]');

    var vehicleClassSelect = calcForm.querySelector('select[name="vehicleClass"]');
    var yearInput = calcForm.querySelector('input[name="year"]');

    function recompute() {
      if (!pricing) return;
      var inputs = gatherInputs(calcForm);
      if (!inputs.vehicleClass) {
        setHidden(resultEl, true);
        setHidden(emptyStateEl, false);
        setHidden(callbackSection, true);
        return;
      }
      var quote = calculate(inputs, pricing);
      if (!quote) {
        setHidden(resultEl, true);
        setHidden(emptyStateEl, false);
        return;
      }
      setHidden(emptyStateEl, true);
      setHidden(resultEl, false);
      setText(rangeEl, quote.display);
      setText(
        summaryEl,
        'Estimate for a ' +
          inputs.year +
          ' ' +
          quote.vehicleClass.label.toLowerCase() +
          ' (~' +
          quote.vehicleClass.weightLbs.toLocaleString('en-US') +
          ' lbs typical).',
      );
      renderBreakdown(
        breakdownEl,
        quote,
        quote.vehicleClass.weightLbs,
        pricing.rates.scrapRatePerLb,
      );
      mirrorToCallbackForm(callbackForm, inputs);

      if (calloutEl) {
        var midpoint = quote.point;
        if (midpoint >= 1500) {
          calloutEl.textContent =
            'High-value vehicle — call us directly and we may go above this range.';
        } else if (midpoint >= 600) {
          calloutEl.textContent =
            'Solid scrap value. Lock in your final number with a free callback.';
        } else {
          calloutEl.textContent =
            'Bottom-tier scrap. Free towing still included — we make money on volume.';
        }
      }
    }

    function showCallback() {
      setHidden(callbackSection, false);
      // Smooth scroll only when supported; reduces motion-sickness on iOS Safari < 14.
      try {
        callbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (_) {
        callbackSection.scrollIntoView();
      }
      var firstField = callbackForm.querySelector('input[name="name"]');
      if (firstField) {
        setTimeout(function () {
          try {
            firstField.focus({ preventScroll: true });
          } catch (_) {
            firstField.focus();
          }
        }, 350);
      }
    }

    // Form inputs trigger recompute on every change.
    calcForm.addEventListener('input', recompute);
    calcForm.addEventListener('change', recompute);
    calcForm.addEventListener('submit', function (e) {
      // The calculator form itself never POSTs — its only job is to drive the live preview.
      e.preventDefault();
      recompute();
      if (revealBtn) revealBtn.focus();
    });

    if (revealBtn) {
      revealBtn.addEventListener('click', function () {
        // If the user hasn't picked a class yet, nudge them back up rather than revealing.
        if (!vehicleClassSelect.value) {
          vehicleClassSelect.focus();
          return;
        }
        showCallback();
      });
    }

    // Fetch pricing config + populate vehicle dropdown.
    fetch(PRICING_URL, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('pricing_fetch_' + res.status);
        return res.json();
      })
      .then(function (config) {
        pricing = config;
        buildVehicleClassOptions(vehicleClassSelect, config);
        configureYearInput(yearInput);
        if (pricingNote && config._meta && config._meta.lastUpdated) {
          pricingNote.textContent =
            'Pricing table last updated ' +
            config._meta.lastUpdated +
            '. Real yard offers may exceed this range.';
        }
        recompute();
      })
      .catch(function (err) {
        if (window.console && console.warn)
          console.warn('quote-calculator.pricing_load_failed', err && err.message);
        // Hide the result panel; show a graceful inline error so the page still has a CTA.
        setHidden(resultEl, true);
        setHidden(emptyStateEl, false);
        if (emptyStateEl) {
          emptyStateEl.innerHTML =
            '<strong>Calculator unavailable right now.</strong> ' +
            'Call <a href="tel:+17635332775">763-533-2775</a> for an instant quote over the phone.';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
