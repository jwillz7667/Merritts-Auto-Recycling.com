import { guides as establishedGuides, type Guide as BaseGuide } from './guide-base';
import { buyerComparisonGuide, type BuyerComparison } from './buyer-comparison';
export type { GuideSection } from './guide-base';
export type Guide = BaseGuide & { comparison?: BuyerComparison };

// Keep established URLs and their original publication dates. Improve existing
// answers instead of creating competing pages for every keyword variation.
const comparisonSlug = buyerComparisonGuide.slug;
const updates: Record<string, Partial<Guide>> = {
  'non-running-car-removal-checklist': {
    title: 'Sell a non-running car in the Twin Cities',
    shortTitle: 'Sell a car that does not run',
    seoTitle: "Sell a Non-Running Car in the Twin Cities | Merritt's",
    description: 'Sell a non-running car in the Twin Cities, including a car with a blown engine or bad transmission. Learn what to share about condition, documents, and pickup.',
    summary: 'Yes, you can ask Merritt’s about selling a car that does not run. Start with the known problem and where the vehicle is parked. We review the car and explain the offer and pickup terms before you decide.',
    updated: 'October 7, 2026', updatedIso: '2026-10-07', readingTime: '5 min read',
    sections: [
      {
        heading: 'Can I sell a car with a blown engine?',
        paragraphs: [
          'Yes, Merritt’s considers vehicles with major engine problems. Tell us the year, make, model, known fault, and whether the engine and other major components are still present. A current photo and an existing repair estimate can help explain the condition, but you do not need to pay for new diagnostics just to request an offer.',
          'Describe what you know rather than trying to diagnose the failure yourself. We review acceptance and pickup for the individual vehicle; an engine problem does not establish a fixed price or guarantee that every vehicle can be purchased.',
        ],
      },
      {
        heading: 'What about a car with a bad transmission?',
        paragraphs: [
          'A failed transmission is another condition you can discuss when selling the car as it sits. Say whether it is complete, whether all wheels are present, and whether the vehicle can roll and steer. Do not drive or push an unsafe car to demonstrate the problem.',
          'If the vehicle is still at a repair shop, identify who holds the keys and what the shop requires before release. Agree on access and any outstanding shop arrangements before scheduling pickup with a buyer.',
        ],
      },
      {
        heading: 'How much is a non-running car worth?',
        paragraphs: [
          'The amount depends on the actual vehicle and transaction: its identity, condition, completeness, location, access, and current demand. A complete car with an engine problem is not necessarily evaluated like a partly dismantled shell.',
          'Ask for the amount you would receive after any agreed removal charges. Compare offers using the same description, and ask whether an inspection or a change in the car’s condition could affect the offer.',
        ],
      },
      {
        heading: 'Can you pick up a car that will not move?',
        paragraphs: [
          'Explain whether the car rolls and steers, has all its wheels, and is blocked by another vehicle or stored inside a garage. Include the ground surface, gate or garage clearance, slope, and the route a truck would use to reach it.',
          'A car that will not start and a car that cannot roll are different loading situations. Merritt’s reviews the setting before confirming a suitable pickup plan. Leave unsafe movement and makeshift towing out of your preparation.',
        ],
      },
      {
        heading: 'Should I repair it before selling?',
        paragraphs: [
          'You can request an offer in its current condition before deciding about repairs. Compare a written repair estimate, the car’s other known needs, and the time and cost involved in your alternatives.',
          'Do not remove parts after accepting an offer without discussing the change with the buyer. A quote based on a complete vehicle may need to be reviewed when components or wheels are removed.',
        ],
      },
      {
        heading: 'What should I send to arrange the next step?',
        paragraphs: ['Call or text the details below. For a car in Minneapolis, St. Paul, or a surrounding suburb, include the exact pickup city and setting. Offer, documents, payment arrangements, and the pickup window are confirmed directly.'],
        items: ['Year, make, model, and known problem', 'Current photos and missing-component details', 'Whether the car starts, rolls, and steers', 'Pickup city, surface, and access restrictions', 'Title, lien, and key status', 'Any repair-shop or property-access arrangements'],
      },
    ],
    related: ['what-affects-a-junk-car-offer', 'repair-trade-in-or-sell-a-junk-car', comparisonSlug],
  },
  'repair-trade-in-or-sell-a-junk-car': {
    title: 'Repair, trade in, sell, or scrap your car: how to decide',
    shortTitle: 'Repair, sell, or scrap your car?',
    seoTitle: "Repair, Sell, or Scrap Your Car? How to Decide | Merritt's",
    description: 'Decide whether to repair, trade in, sell privately, or scrap your car. Compare repair costs, expected proceeds, time, documents, and pickup needs.',
    related: ['what-affects-a-junk-car-offer', 'non-running-car-removal-checklist', comparisonSlug],
  },
  'what-affects-a-junk-car-offer': {
    related: ['scrap-car-value-by-weight', 'repair-trade-in-or-sell-a-junk-car', comparisonSlug],
  },
};

export const guides: Guide[] = [
  ...establishedGuides.map((guide) => ({ ...guide, ...updates[guide.slug] })),
  buyerComparisonGuide,
];
