export const business = {
  name: "Merritt's Auto Recycling",
  legalName: "Merritt's Auto Recycling",
  founder: 'Brad Emholtz',
  foundingDate: '1988',
  siteUrl: 'https://merritts-auto-recycling.com',
  phone: '763-533-2775',
  phoneUri: 'tel:+1-763-533-2775',
  textPhone: '763-438-2116',
  textUri: 'sms:+1-763-438-2116',
  email: 'merrittsautorecycling@gmail.com',
  address: {
    street: '3106 68th Ave N',
    city: 'Brooklyn Center',
    region: 'MN',
    postalCode: '55429',
    country: 'US',
  },
  hoursDisplay: 'Open every day, 8:00 AM–8:00 PM',
  hoursShort: 'Daily 8 AM–8 PM',
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '20:00',
  },
  googleBusinessProfile: 'https://share.google/V9RTL8Y2wxrYL6PS8',
  googleMaps: 'https://www.google.com/maps?cid=10346311406139911893',
  facebook: 'https://www.facebook.com/profile.php?id=61565403974405',
} as const;

export const primaryNavigation = [
  { label: 'Cash for cars', href: '/cash-for-junk-cars' },
  { label: 'Vehicle removal', href: '/junk-car-removal' },
  { label: 'Auto recycling', href: '/auto-recycling' },
  { label: 'Service areas', href: '/service-areas' },
  { label: 'Guides', href: '/guides' },
  { label: 'About', href: '/about' },
] as const;

export type Faq = {
  question: string;
  answer: string;
};

export const globalFaqs: Faq[] = [
  {
    question: 'What information should I have ready when I call?',
    answer:
      'The year, make, model, general condition, vehicle location, and whether you have the keys and title are the most useful details. If you are unsure about any item, say so—Merritt’s can ask follow-up questions.',
  },
  {
    question: 'Does a phone conversation guarantee an offer or pickup?',
    answer:
      'No. Merritt’s reviews the vehicle details and confirms any offer, removal terms, and pickup window directly with you before you decide whether to proceed.',
  },
  {
    question: 'Can I ask about a vehicle that does not run?',
    answer:
      'Yes. Describe the condition honestly, including whether the vehicle rolls, steers, has all four wheels, and is easy for a truck to access. Merritt’s will confirm whether removal is available for that vehicle and location.',
  },
  {
    question: 'Is this a general towing or repair service?',
    answer:
      'No. The towing information on this website concerns removal connected to vehicles Merritt’s is considering for purchase or recycling. Merritt’s does not advertise roadside repair or general breakdown towing here.',
  },
  {
    question: 'What if the title or keys are missing?',
    answer:
      'Tell Merritt’s before scheduling anything. Documentation requirements depend on the vehicle and ownership situation. Merritt’s can explain what it needs, while Minnesota Driver and Vehicle Services remains the authority for title questions.',
  },
  {
    question: 'How quickly will my vehicle be picked up?',
    answer:
      'Pickup timing depends on the vehicle, location, access, and current schedule. Merritt’s will provide a pickup window only after the details are confirmed; this website does not promise same-day service.',
  },
  {
    question: 'Which areas does Merritt’s serve?',
    answer:
      'Merritt’s is based in Brooklyn Center and publishes service information for Brooklyn Center and Minneapolis. Call with the exact vehicle location to confirm current availability elsewhere.',
  },
  {
    question: 'When can I call?',
    answer: `Merritt’s is available by phone ${business.hoursDisplay.toLowerCase()}.`,
  },
];

export type Service = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  image:
    | '/images/legacy/merritts-tow-truck.jpg'
    | '/images/legacy/junk-car-removal.jpg'
    | '/images/legacy/auto-recycling-yard.jpg';
  imageAlt: string;
  highlights: string[];
  sections: Array<{ heading: string; paragraphs: string[]; items?: string[] }>;
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: 'cash-for-junk-cars',
    name: 'Cash for junk cars',
    eyebrow: 'Call with the vehicle details',
    title: 'Get a straightforward cash offer for an unwanted vehicle',
    description:
      "Call Merritt's Auto Recycling about an unwanted car, truck, van, or SUV and discuss a cash offer in the Twin Cities area.",
    summary:
      'Share the basics by phone or text. Merritt’s will review the details, ask any necessary questions, and explain the next step before you make a decision.',
    image: '/images/legacy/merritts-tow-truck.jpg',
    imageAlt: "A Merritt's Auto Recycling truck carrying a vehicle",
    highlights: [
      'Direct phone conversation',
      'Vehicle details reviewed',
      'Offer and terms confirmed directly',
    ],
    sections: [
      {
        heading: 'What affects an offer',
        paragraphs: [
          'Vehicle value is not determined by a single generic price chart. Merritt’s considers the year, make, model, completeness, condition, location, access, and current market factors.',
          'Accurate information helps avoid surprises. Mention major damage, missing components, flat tires, blocked access, and title or key issues during the first conversation.',
        ],
      },
      {
        heading: 'What to have ready',
        paragraphs: ['A short checklist makes the first call faster:'],
        items: [
          'Year, make, and model',
          'Current city and exact pickup setting',
          'Whether the vehicle starts, rolls, and steers',
          'Major damage or missing parts',
          'Whether you have the title and keys',
        ],
      },
      {
        heading: 'No pressure and no made-up web estimate',
        paragraphs: [
          'The website does not display a made-up instant price. Merritt’s reviews the actual vehicle information and confirms an offer directly. You choose whether to proceed after the terms are clear.',
        ],
      },
    ],
    faqs: [globalFaqs[0]!, globalFaqs[1]!, globalFaqs[4]!, globalFaqs[5]!],
  },
  {
    slug: 'junk-car-removal',
    name: 'Junk car removal',
    eyebrow: 'Plan a safe, accessible pickup',
    title: 'Vehicle removal connected to a confirmed purchase',
    description:
      "Learn how Merritt's coordinates removal for an unwanted or non-running vehicle after the vehicle, location, terms, and schedule are confirmed.",
    summary:
      'Merritt’s discusses access, condition, location, and timing before scheduling. Removal information on this site applies only to vehicles Merritt’s is considering for purchase or recycling.',
    image: '/images/legacy/junk-car-removal.jpg',
    imageAlt: 'A car secured on a flatbed tow truck',
    highlights: [
      'Vehicle and access reviewed first',
      'Pickup window confirmed directly',
      'Not roadside repair or general towing',
    ],
    sections: [
      {
        heading: 'Describe the pickup setting',
        paragraphs: [
          'Tell Merritt’s whether the vehicle is in a driveway, garage, parking structure, street, yard, or another setting. Gates, low clearances, tight turns, snow, soft ground, and blocked wheels can affect what equipment is appropriate.',
        ],
      },
      {
        heading: 'Prepare before the truck arrives',
        paragraphs: ['Before a confirmed pickup window:'],
        items: [
          'Remove personal belongings and important documents',
          'Make sure Merritt’s knows about flat or missing tires',
          'Keep children and pets away from the work area',
          'Do not attempt unsafe repairs or repositioning',
          'Have the agreed ownership documents and keys ready',
        ],
      },
      {
        heading: 'Terms come before scheduling',
        paragraphs: [
          'A call or text is not a pickup appointment. Merritt’s confirms the vehicle, any offer, removal terms, and a pickup window directly with you before dispatch.',
        ],
      },
    ],
    faqs: [globalFaqs[2]!, globalFaqs[3]!, globalFaqs[4]!, globalFaqs[5]!],
  },
  {
    slug: 'auto-recycling',
    name: 'Auto recycling',
    eyebrow: 'A practical next step for an end-of-life vehicle',
    title: 'Ask Merritt’s about recycling an unwanted vehicle',
    description:
      "Contact Merritt's Auto Recycling about an end-of-life vehicle and learn what information is needed before purchase or removal is confirmed.",
    summary:
      'Vehicles contain reusable materials as well as fluids and components that require careful handling. Merritt’s can discuss whether it can accept your vehicle and how removal would be arranged.',
    image: '/images/legacy/auto-recycling-yard.jpg',
    imageAlt: 'Rows of end-of-life vehicles at an auto recycling yard',
    highlights: [
      'Vehicle details reviewed individually',
      'Ownership documentation discussed first',
      'Minnesota resources linked for reference',
    ],
    sections: [
      {
        heading: 'Why the vehicle details matter',
        paragraphs: [
          'Cars and trucks vary widely in construction, condition, and completeness. Merritt’s asks about the full vehicle so it can decide whether it fits the current acquisition and removal process.',
        ],
      },
      {
        heading: 'Environmental claims are kept specific',
        paragraphs: [
          'This site does not publish an unsupported percentage for how much of each vehicle is recycled. Minnesota regulates issues that can affect automotive salvage businesses, including hazardous waste and stormwater. The Minnesota Pollution Control Agency provides the authoritative compliance resources linked in the guides section.',
        ],
      },
      {
        heading: 'Start with a direct conversation',
        paragraphs: [
          'Call or text the vehicle details. Merritt’s will confirm whether it can move forward and what documents, access, and scheduling information are required.',
        ],
      },
    ],
    faqs: [globalFaqs[0]!, globalFaqs[2]!, globalFaqs[4]!, globalFaqs[6]!],
  },
  {
    slug: 'junk-car-towing',
    name: 'Junk vehicle towing',
    eyebrow: 'Removal, not mechanical service',
    title: 'Towing for vehicles Merritt’s agrees to acquire',
    description:
      "Merritt's towing information covers vehicle removal connected to a confirmed purchase—not roadside repair, routine transport, or general breakdown towing.",
    summary:
      'If Merritt’s agrees to acquire a vehicle, it will discuss the pickup setting and confirm the removal terms. Call a roadside-assistance or general towing provider for breakdown recovery or mechanical transport.',
    image: '/images/legacy/junk-car-removal.jpg',
    imageAlt: 'A vehicle being transported on a flatbed tow truck',
    highlights: [
      'Acquisition-related removal only',
      'Access and condition disclosed before dispatch',
      'No repair or roadside-assistance claims',
    ],
    sections: [
      {
        heading: 'What this service is',
        paragraphs: [
          'It is the removal step after Merritt’s has reviewed a junk, salvage, damaged, or unwanted vehicle and agreed on the terms with the owner.',
        ],
      },
      {
        heading: 'What this service is not',
        paragraphs: [
          'This website does not offer emergency roadside towing, collision-scene dispatch, impound release, mechanical diagnosis, vehicle maintenance, or transport between repair shops.',
        ],
      },
      {
        heading: 'Information the driver needs',
        paragraphs: [
          'Share the exact location, surface, clearances, wheel and tire condition, whether the vehicle rolls and steers, and any access restriction. Merritt’s will decide whether the available equipment is suitable.',
        ],
      },
    ],
    faqs: [globalFaqs[2]!, globalFaqs[3]!, globalFaqs[5]!, globalFaqs[6]!],
  },
];

export type ServiceArea = {
  slug: string;
  city: string;
  title: string;
  description: string;
  intro: string;
  proof: string;
  details: string[];
};

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'brooklyn-center',
    city: 'Brooklyn Center',
    title: 'Cash offers for junk cars in Brooklyn Center, MN',
    description:
      "Merritt's Auto Recycling is based in Brooklyn Center. Call with your vehicle details to discuss a cash offer and pickup availability.",
    intro:
      'Merritt’s real business address is in Brooklyn Center, making this the company’s home location—not a virtual office or doorway page.',
    proof: 'Business address: 3106 68th Ave N, Brooklyn Center, MN 55429.',
    details: [
      'Call with the year, make, model, condition, and exact vehicle location.',
      'Describe driveway, garage, street, or parking-lot access before scheduling.',
      'Merritt’s confirms the offer, removal terms, and pickup window directly.',
    ],
  },
  {
    slug: 'minneapolis',
    city: 'Minneapolis',
    title: 'Cash offers for junk cars in Minneapolis, MN',
    description:
      "Contact Merritt's Auto Recycling about an unwanted vehicle in Minneapolis and confirm current pickup availability for your exact address.",
    intro:
      'Minneapolis vehicle locations vary from driveways and alleys to garages and managed parking areas. Merritt’s reviews the exact setting before confirming removal.',
    proof:
      'Merritt’s is based in nearby Brooklyn Center. Minneapolis availability is confirmed case by case using the vehicle address and access details.',
    details: [
      'Share the neighborhood or ZIP code and exact pickup setting.',
      'Mention alleys, ramps, clearance limits, gates, permits, or property-manager rules.',
      'Do not promise access to private property without the property owner’s authorization.',
    ],
  },
];

export const publishedRoutes = [
  '/',
  ...services.map((service) => `/${service.slug}`),
  '/service-areas',
  ...serviceAreas.map((area) => `/service-areas/${area.slug}`),
  '/about',
  '/reviews',
  '/faq',
  '/contact',
  '/guides',
  '/privacy',
] as const;
