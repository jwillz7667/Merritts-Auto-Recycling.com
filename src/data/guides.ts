export type GuideSection = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  updated: string;
  readingTime: string;
  sections: GuideSection[];
  sources: Array<{ label: string; href: string }>;
};

export const guides: Guide[] = [
  {
    slug: 'prepare-an-unwanted-car-for-pickup',
    title: 'How to prepare an unwanted vehicle for pickup',
    shortTitle: 'Prepare a vehicle for pickup',
    description:
      'A practical checklist for removing belongings, documenting condition, confirming access, and getting ready for a scheduled junk-car pickup.',
    summary:
      'Good preparation is mostly about accurate information and a clear work area. Do not attempt risky repairs or move a disabled vehicle just to make it look ready.',
    updated: 'August 23, 2026',
    readingTime: '4 min read',
    sections: [
      {
        heading: '1. Confirm the agreement first',
        paragraphs: [
          'Do not treat a web form as a dispatch confirmation. Make sure the buyer has confirmed the vehicle, offer or other terms, required documents, and pickup window.',
        ],
      },
      {
        heading: '2. Remove personal property',
        paragraphs: [
          'Check the glove box, console, trunk, under seats, door pockets, roof racks, and any aftermarket storage. Remove toll tags, garage remotes, work equipment, child seats, and paperwork you need to retain.',
        ],
      },
      {
        heading: '3. Describe access honestly',
        paragraphs: [
          'Tell the buyer about gates, ramps, low clearances, narrow alleys, soft ground, snow, locked wheels, missing tires, and whether the vehicle rolls or steers. A clear description lets the operator decide what equipment is suitable.',
        ],
      },
      {
        heading: '4. Keep the work area safe',
        items: [
          'Keep people and pets away from the loading area.',
          'Do not crawl under, jack up, or tow the vehicle yourself.',
          'Do not place the vehicle where it blocks traffic or emergency access.',
          'Follow the operator’s instructions when the truck arrives.',
        ],
        paragraphs: [],
      },
      {
        heading: '5. Have the confirmed documents ready',
        paragraphs: [
          'Ownership and title situations vary. Ask the buyer what it needs and use Minnesota Driver and Vehicle Services for official title guidance. Do not sign a document you do not understand.',
        ],
      },
    ],
    sources: [
      {
        label: 'Minnesota Driver and Vehicle Services',
        href: 'https://dps.mn.gov/divisions/dvs',
      },
    ],
  },
  {
    slug: 'minnesota-junk-car-documents',
    title: 'Minnesota documents to discuss before selling a junk car',
    shortTitle: 'Minnesota vehicle documents',
    description:
      'Questions to ask about a Minnesota vehicle title, identification, keys, plates, and ownership before arranging a junk-car sale.',
    summary:
      'The exact paperwork depends on the vehicle and ownership history. This guide is a preparation checklist, not legal advice; Minnesota Driver and Vehicle Services is the authority.',
    updated: 'August 23, 2026',
    readingTime: '5 min read',
    sections: [
      {
        heading: 'Start with the title in your possession',
        paragraphs: [
          'Tell the buyer whether the title is current, lost, damaged, branded, held by a lender, or in someone else’s name. Do not conceal a lien or ownership dispute. A buyer may pause the transaction until the paperwork is resolved.',
        ],
      },
      {
        heading: 'Ask what identification is required',
        paragraphs: [
          'Confirm which owner must be present and what identification the buyer needs. If more than one person is named on the title, ask Driver and Vehicle Services how signatures must be handled.',
        ],
      },
      {
        heading: 'Discuss plates and personal records',
        paragraphs: [
          'Before pickup, ask what should happen to license plates and keep copies or photos of completed transaction documents for your records. Requirements can change, so rely on current state instructions rather than a generic blog checklist.',
        ],
      },
      {
        heading: 'Avoid “no title needed” promises',
        paragraphs: [
          'A missing-title situation is not automatically approved. Explain the facts and let the buyer and state requirements determine the next step. Merritt’s does not promise that every no-title vehicle can be purchased.',
        ],
      },
      {
        heading: 'Use official help for unusual situations',
        paragraphs: [
          'Estates, abandoned vehicles, business-owned vehicles, out-of-state titles, liens, and salvage brands can require additional steps. Contact Minnesota Driver and Vehicle Services before scheduling if ownership is unclear.',
        ],
      },
    ],
    sources: [
      {
        label: 'Minnesota DVS: Understanding salvage transactions',
        href: 'https://learningcenter.dps.mn.gov/mndrive/dealers/MNSalvage.html',
      },
      {
        label: 'Minnesota Driver and Vehicle Services',
        href: 'https://dps.mn.gov/divisions/dvs',
      },
    ],
  },
  {
    slug: 'what-affects-a-junk-car-offer',
    title: 'What affects a cash offer for a junk car?',
    shortTitle: 'What affects an offer',
    description:
      'Understand why year, model, completeness, condition, location, access, and current demand can affect a junk-car cash offer.',
    summary:
      'There is no honest universal price chart for every unwanted vehicle. A useful estimate starts with specific, accurate vehicle and pickup information.',
    updated: 'August 23, 2026',
    readingTime: '4 min read',
    sections: [
      {
        heading: 'Vehicle identity',
        paragraphs: [
          'Year, make, model, body style, drivetrain, and engine identify what the vehicle is. The VIN can help resolve uncertainty, but never publish it in a public message or social post.',
        ],
      },
      {
        heading: 'Condition and completeness',
        paragraphs: [
          'Whether the vehicle starts, rolls, steers, and has major components affects how it can be handled. Collision damage, fire or flood exposure, missing wheels, and removed components should be disclosed up front.',
        ],
      },
      {
        heading: 'Location and access',
        paragraphs: [
          'Distance is only one part of removal. Garages, ramps, alleys, soft ground, blocked vehicles, and property rules can affect equipment and scheduling.',
        ],
      },
      {
        heading: 'Documentation',
        paragraphs: [
          'Clear ownership information makes a transaction easier to evaluate. A lien, missing title, or name mismatch can delay or prevent a purchase until the situation is resolved.',
        ],
      },
      {
        heading: 'Current market conditions',
        paragraphs: [
          'Demand for parts, metals, and complete vehicles changes. That is why old blog posts that publish a fixed dollar range can be misleading. Request a current offer for the actual vehicle instead.',
        ],
      },
    ],
    sources: [],
  },
  {
    slug: 'what-happens-after-junk-car-pickup',
    title: 'What can happen after an end-of-life vehicle is picked up?',
    shortTitle: 'After vehicle pickup',
    description:
      'A plain-language overview of evaluation, parts recovery, material recycling, and regulated automotive-salvage considerations in Minnesota.',
    summary:
      'An end-of-life vehicle contains usable parts and recyclable material, but it can also contain fluids, batteries, refrigerants, tires, and emissions equipment that require responsible handling.',
    updated: 'August 23, 2026',
    readingTime: '5 min read',
    sections: [
      {
        heading: 'The vehicle is evaluated',
        paragraphs: [
          'The next step depends on the vehicle’s condition, ownership status, completeness, and potential for reuse. Not every vehicle follows the same path.',
        ],
      },
      {
        heading: 'Usable components may be recovered',
        paragraphs: [
          'Components that are suitable for lawful reuse may be identified before the remaining vehicle is processed. This site does not claim a fixed recovery percentage because outcomes vary by vehicle and facility.',
        ],
      },
      {
        heading: 'Fluids and regulated items require care',
        paragraphs: [
          'Automotive salvage can involve fuel, oil, coolant, batteries, refrigerants, tires, and stormwater concerns. Minnesota Pollution Control Agency guidance describes environmental requirements that may apply to salvage businesses.',
        ],
      },
      {
        heading: 'Emissions equipment cannot simply be removed for road use',
        paragraphs: [
          'Federal and Minnesota rules restrict tampering with vehicle pollution-control equipment. The MPCA identifies catalytic converters and other components among the systems covered by anti-tampering requirements.',
        ],
      },
      {
        heading: 'Metal and other materials can enter recycling streams',
        paragraphs: [
          'After appropriate preparation, metals and other suitable materials can be separated for recycling. The exact downstream process depends on the facility and vehicle.',
        ],
      },
    ],
    sources: [
      {
        label: 'Minnesota Pollution Control Agency: automotive salvage',
        href: 'https://www.pca.state.mn.us/business-with-us/automotive-repair-body-shops-and-salvage',
      },
      {
        label: 'Minnesota Pollution Control Agency: vehicle tampering',
        href: 'https://www.pca.state.mn.us/business-with-us/vehicle-tampering',
      },
    ],
  },
  {
    slug: 'non-running-car-removal-checklist',
    title: 'Non-running car removal: details to share before pickup',
    shortTitle: 'Non-running vehicle checklist',
    description:
      'A concise checklist covering wheels, steering, brakes, access, clearances, surface conditions, keys, and ownership documents for a non-running car.',
    summary:
      '“Does not run” is only the beginning of the description. A few practical details help a vehicle buyer decide whether removal is possible and what equipment may be appropriate.',
    updated: 'August 23, 2026',
    readingTime: '4 min read',
    sections: [
      {
        heading: 'Does it roll and steer?',
        paragraphs: [
          'Say whether all wheels and tires are present, whether any wheel is locked, whether the steering turns, and whether the parking brake releases. Do not test these items in an unsafe setting.',
        ],
      },
      {
        heading: 'Where exactly is it parked?',
        items: [
          'Driveway, garage, alley, street, lot, ramp, yard, or other setting',
          'Pavement, gravel, snow, mud, soft ground, or slope',
          'Gate width, ceiling height, sharp turns, or overhead obstacles',
          'Other vehicles or objects blocking a direct approach',
        ],
        paragraphs: [],
      },
      {
        heading: 'What damage or missing parts matter?',
        paragraphs: [
          'Mention collision damage, broken suspension, missing wheels, loose body panels, leaking fluids, fire or flood exposure, and removed major components. Photos can help when the buyer provides a secure way to send them.',
        ],
      },
      {
        heading: 'Who controls the property?',
        paragraphs: [
          'Confirm that the vehicle owner and property owner authorize access. Apartments, businesses, garages, and managed lots may have separate rules or require coordination.',
        ],
      },
      {
        heading: 'Wait for a confirmed plan',
        paragraphs: [
          'Do not move the vehicle into traffic or attempt makeshift towing. Merritt’s will confirm whether it can accept the vehicle and provide a pickup window only after reviewing the details.',
        ],
      },
    ],
    sources: [],
  },
];
