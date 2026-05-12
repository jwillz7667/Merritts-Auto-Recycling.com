/**
 * Junk-car cash quote calculator. Pure functions, no I/O — safe to import in both the Vercel
 * serverless handler (authoritative quote for the lead email) and a future Node CLI.
 *
 * The browser ships an aligned reimplementation at `/js/quote-calculator.js` that reads the
 * same `data/scrap-pricing.json` over fetch — keeping the math consistent on both sides.
 *
 * Quotes are deliberately conservative: the formula floors scrap-weight value, adds discrete
 * condition bonuses, applies a year bucket, then widens to a low/high range with rounding to
 * the nearest $25. Yards routinely beat these numbers; under-promising protects expectations.
 */
import { z } from 'zod';

import pricing from '../../data/scrap-pricing.json' with { type: 'json' };

export type ScrapPricingConfig = typeof pricing;

const VehicleClassKeys = Object.keys(pricing.vehicleClasses) as [string, ...string[]];

/**
 * Input shape — what comes off the form. Numbers may arrive as strings from `URLSearchParams`,
 * so coerce explicitly. Booleans accept "true"/"false"/"on"/"off"/1/0 to tolerate any client
 * encoding without leaking parsing concerns into the calculator itself.
 */
export const CalculatorInputSchema = z.object({
  vehicleClass: z.enum(VehicleClassKeys),
  year: z.preprocess(
    (v) => (typeof v === 'string' ? parseInt(v, 10) : v),
    z
      .number()
      .int()
      .min(1950)
      .max(new Date().getFullYear() + 1),
  ),
  running: coerceBoolean(),
  catalyticConverter: coerceBoolean(),
  completeDrivetrain: coerceBoolean(),
  wheelsAndTires: coerceBoolean(),
});
export type CalculatorInput = z.infer<typeof CalculatorInputSchema>;

export type ModifierApplied = { key: string; label: string; bonus: number };

export type CalculatorResult = {
  low: number;
  high: number;
  point: number;
  display: string;
  vehicleClass: { key: string; label: string; weightLbs: number };
  yearBucket: { label: string; modifier: number };
  modifiersApplied: ModifierApplied[];
  basis: {
    scrapWeightValue: number;
    yearModifier: number;
    bonusesTotal: number;
    rawTotal: number;
    spreadLow: number;
    spreadHigh: number;
    roundedTo: number;
  };
};

function coerceBoolean(): z.ZodEffects<z.ZodBoolean, boolean, unknown> {
  return z.preprocess((v) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (['true', '1', 'on', 'yes'].includes(s)) return true;
      if (['false', '0', 'off', 'no', ''].includes(s)) return false;
    }
    return false;
  }, z.boolean());
}

function pickYearBucket(
  year: number,
  config: ScrapPricingConfig,
): { label: string; modifier: number } {
  for (const b of config.yearBuckets) {
    if (year <= b.maxYear) return { label: b.label, modifier: b.modifier };
  }
  const last = config.yearBuckets[config.yearBuckets.length - 1];
  if (!last) throw new Error('scrap-pricing.yearBuckets is empty');
  return { label: last.label, modifier: last.modifier };
}

function roundToNearest(n: number, step: number): number {
  return Math.round(n / step) * step;
}

function formatRange(low: number, high: number): string {
  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  return `${fmt.format(low)} – ${fmt.format(high)}`;
}

export function calculate(
  input: CalculatorInput,
  config: ScrapPricingConfig = pricing,
): CalculatorResult {
  const cls = config.vehicleClasses[input.vehicleClass as keyof typeof config.vehicleClasses];
  if (!cls) throw new Error(`unknown vehicleClass: ${input.vehicleClass}`);

  const rate = config.rates.scrapRatePerLb;
  const scrapWeightValue = Math.round(cls.weightLbs * rate);
  const yearBucket = pickYearBucket(input.year, config);

  const applied: ModifierApplied[] = [];
  const m = config.modifiers;
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

  const bonusesTotal = applied.reduce((sum, x) => sum + x.bonus, 0);
  const rawTotal = scrapWeightValue + yearBucket.modifier + bonusesTotal;

  const { spreadLow, spreadHigh, roundToNearest: step, minQuote, maxQuote } = config.rates;
  const low = Math.max(minQuote, Math.min(maxQuote, roundToNearest(rawTotal * spreadLow, step)));
  const high = Math.max(minQuote, Math.min(maxQuote, roundToNearest(rawTotal * spreadHigh, step)));
  const point = Math.round((low + high) / 2);

  return {
    low,
    high,
    point,
    display: formatRange(low, high),
    vehicleClass: { key: input.vehicleClass, label: cls.label, weightLbs: cls.weightLbs },
    yearBucket,
    modifiersApplied: applied,
    basis: {
      scrapWeightValue,
      yearModifier: yearBucket.modifier,
      bonusesTotal,
      rawTotal,
      spreadLow,
      spreadHigh,
      roundedTo: step,
    },
  };
}

export function loadPricing(): ScrapPricingConfig {
  return pricing;
}
