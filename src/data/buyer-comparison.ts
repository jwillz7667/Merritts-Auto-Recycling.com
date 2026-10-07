import type { Guide as BaseGuide } from './guide-base';

export type ComparisonSource = { label: string; href: string };
export type BuyerComparison = {
  competitor: string;
  checkedIso: string;
  checkedDisplay: string;
  disclosure: string;
  rows: Array<{
    topic: string;
    merritts: string;
    merrittsSource: ComparisonSource;
    competitor: string;
    competitorSource: ComparisonSource;
    question: string;
  }>;
};

const competitorHome = { label: 'Cash for Junkers MN: published process and FAQs', href: 'https://www.cashforjunkersmn.com/' };
const competitorAreas = { label: 'Cash for Junkers MN: published service areas', href: 'https://www.cashforjunkersmn.com/areas/' };
const selling = { label: 'Merritt’s: selling and offer process', href: '/cash-for-junk-cars' };
const removal = { label: 'Merritt’s: pickup terms', href: '/junk-car-removal' };

export const buyerComparisonGuide: BaseGuide & { comparison: BuyerComparison } = {
  slug: 'cash-for-junkers-mn-vs-merritts',
  title: 'Cash for Junkers MN vs. Merritt’s Auto Recycling',
  shortTitle: 'Cash for Junkers MN vs. Merritt’s',
  seoTitle: "Cash for Junkers MN vs. Merritt's: Compare Options",
  description: 'Compare Cash for Junkers MN and Merritt’s using published offer, pickup, payment, and service-area information. A comparison published by Merritt’s.',
  summary: 'Comparing junk-car buyers in the Twin Cities? Check the amount you would receive, pickup arrangements, and documentation before choosing. Start with these published service details.',
  updated: 'October 7, 2026',
  updatedIso: '2026-10-07',
  publishedIso: '2026-10-07',
  readingTime: '5 min read',
  comparison: {
    competitor: 'Cash for Junkers MN',
    checkedIso: '2026-10-07',
    checkedDisplay: 'October 7, 2026',
    disclosure: 'Published by Merritt’s Auto Recycling. Cash for Junkers MN is a separate business. This page is not affiliated with or endorsed by Cash for Junkers MN, and it is not an independent review.',
    rows: [
      {
        topic: 'Getting an offer',
        merritts: 'Call or text the vehicle details. We review condition, completeness, location, and access before discussing the offer and removal terms.',
        merrittsSource: selling,
        competitor: 'Its website offers phone and text inquiries and an email quote form. Its process describes a phone estimate followed by an inspection to finalize the offer.',
        competitorSource: competitorHome,
        question: 'Is this a preliminary estimate, and what could change it after inspection?',
      },
      {
        topic: 'Pickup charges',
        merritts: 'We explain any removal charge with the offer. Free pickup is not guaranteed for every vehicle or location.',
        merrittsSource: removal,
        competitor: 'Its website advertises free towing and no hidden charges.',
        competitorSource: competitorHome,
        question: 'What amount would I actually receive after any agreed pickup or handling costs?',
      },
      {
        topic: 'Payment arrangements',
        merritts: 'Payment arrangements are discussed directly before you accept the offer. Confirm the method and timing for your transaction.',
        merrittsSource: selling,
        competitor: 'Its website states that customers receive cash when the vehicle is collected.',
        competitorSource: competitorHome,
        question: 'How and when will I receive payment, and what receipt or transaction record is provided?',
      },
      {
        topic: 'Service territory',
        merritts: 'Based in Brooklyn Center, with pickup information for Minneapolis, St. Paul, and surrounding communities. Exact-address availability is confirmed directly.',
        merrittsSource: { label: 'Merritt’s: Twin Cities service areas', href: '/service-areas' },
        competitor: 'Its area directory lists Minneapolis, St. Paul, surrounding suburbs, and nine Minnesota counties.',
        competitorSource: competitorAreas,
        question: 'Can you collect this vehicle from its exact location, and what access is required?',
      },
      {
        topic: 'Pickup scheduling',
        merritts: 'We agree on a pickup window after reviewing the vehicle, documents, access, and schedule. Same-day service is not guaranteed.',
        merrittsSource: removal,
        competitor: 'Its website advertises fast pickup and says it works with the customer’s schedule.',
        competitorSource: competitorHome,
        question: 'Is a pickup window confirmed, and who should I contact if access or timing changes?',
      },
    ],
  },
  sections: [
    {
      heading: 'Compare actual offers for the same vehicle',
      paragraphs: [
        'Give both businesses the same current description: year, make, model, known condition, missing parts, title status, and pickup setting. Use current photographs rather than pictures taken before damage or dismantling.',
        'Write down whether an estimate depends on inspection and what would change the amount. Comparing a preliminary number with an offer that already accounts for loading and access can give you the wrong impression. Ask each buyer to explain the conditions before you decide.',
      ],
    },
    {
      heading: 'Which buyer will pay more?',
      paragraphs: [
        'We have not obtained competing offers for your vehicle, so this page does not claim that either business pays more. Request current, vehicle-specific offers and compare the amount you would receive after any agreed charges.',
        'Also consider the agreed pickup window, document requirements, and time needed to release a car from a shop or managed lot. You do not have to choose a buyer based only on a headline price or a general advertisement.',
      ],
    },
    {
      heading: 'Questions to ask before accepting',
      paragraphs: ['Use the same checklist for both buyers. Keep the answers with your transaction records.'],
      items: [
        'What is the offer for the vehicle as described, and how long does it apply?',
        'What conditions or inspection findings could change the offer?',
        'Are any pickup, handling, or other charges deducted?',
        'What payment method and timing are agreed?',
        'Which documents, signatures, and keys need to be ready?',
        'Who arranges property access, and when is pickup confirmed?',
      ],
    },
    {
      heading: 'Considering Merritt’s as an alternative?',
      paragraphs: [
        'Call or text Merritt’s with the vehicle details and pickup city. We discuss the car in its current condition, including a non-running vehicle, major damage, or missing components. Tell us about any title, key, or loading issue at the start.',
        'You can compare that conversation with another buyer’s offer before making a decision. All call and text buttons on this website contact Merritt’s, not Cash for Junkers MN. To contact the other business, use its official website linked in the comparison.',
      ],
    },
    {
      heading: 'Sources, dates, and limits of this comparison',
      paragraphs: [
        'The side-by-side information is based on the linked business websites checked on October 7, 2026. Each competitor entry describes what that business publishes, not a service outcome independently verified by Merritt’s. Policies and availability can change; confirm current terms with the business you choose.',
        'We have not tested either service for this article or compared customer satisfaction scores. The page does not rank the businesses, reproduce competitor reviews, or make a claim about who offers the highest payment. The competitor’s name identifies the business being compared; it does not imply an affiliation.',
      ],
    },
  ],
  sources: [competitorHome, competitorAreas, selling, removal],
  related: ['what-affects-a-junk-car-offer', 'non-running-car-removal-checklist', 'repair-trade-in-or-sell-a-junk-car'],
};
