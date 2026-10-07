import { serviceAreas } from './metro';
export { serviceAreas, coverageRegions, coverageCities, areaServedSchema } from './metro';
export type { ServiceArea } from './metro';

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
  address: { street: '3106 68th Ave N', city: 'Brooklyn Center', region: 'MN', postalCode: '55429', country: 'US' },
  hoursDisplay: 'Open every day, 8:00 AM–8:00 PM',
  hoursShort: 'Daily 8 AM–8 PM',
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '08:00', closes: '20:00' },
  googleBusinessProfile: 'https://share.google/V9RTL8Y2wxrYL6PS8',
  googleMaps: 'https://www.google.com/maps?cid=10346311406139911893',
  facebook: 'https://www.facebook.com/profile.php?id=61565403974405',
} as const;

export const homeSeo = {
  title: "Cash for Junk Cars in the Twin Cities | Merritt's",
  heading: 'Cash for junk cars across the Twin Cities',
  description: "Sell an unwanted car in Minneapolis, St. Paul or the suburbs. Call or text Merritt's for a cash offer and pickup options. Open daily, 8 AM–8 PM.",
};

export const primaryNavigation = [
  { label: 'Cash for cars', href: '/cash-for-junk-cars' },
  { label: 'Vehicle removal', href: '/junk-car-removal' },
  { label: 'Auto recycling', href: '/auto-recycling' },
  { label: 'Service areas', href: '/service-areas' },
  { label: 'Guides', href: '/guides' },
  { label: 'About', href: '/about' },
] as const;

export type Faq = { question: string; answer: string };
export const globalFaqs: Faq[] = [
  { question: 'What should I send for a cash offer?', answer: 'Send the year, make, model, condition, pickup city, and whether you have the title and keys. Current photos help show damage, missing parts, and the approach to the vehicle. Call or text if you are unsure about a detail.' },
  { question: 'How much will you pay for my junk car?', answer: 'The offer depends on the vehicle, its completeness and condition, the pickup location and access, and current demand. Merritt’s explains the offer and any removal charges directly so you can compare the full terms before accepting.' },
  { question: 'Do you consider cars that do not run?', answer: 'Yes. Tell us what is wrong, whether all wheels are present, and whether the vehicle rolls and steers. We review non-running and damaged vehicles individually and discuss a suitable pickup plan.' },
  { question: 'Do you offer emergency roadside towing?', answer: 'Our vehicle removal is for cars Merritt’s agrees to buy or recycle. For a breakdown, roadside repair, impound release, or transport to a repair shop, contact an appropriate towing or roadside-assistance provider.' },
  { question: 'Can I sell a car without a title or keys?', answer: 'Tell us about missing documents or keys before scheduling. Ownership documents and loading access are separate questions. We explain what is needed for your situation; missing-title acceptance is not automatic. Use Minnesota Driver and Vehicle Services for official title guidance.' },
  { question: 'Is pickup free, and how soon can it happen?', answer: 'Ask about removal costs when we discuss the offer. We confirm any charges and a pickup window for the actual vehicle, location, access, and schedule before you agree. Same-day availability and free pickup are not guaranteed for every job.' },
  { question: 'Which Twin Cities areas do you serve?', answer: 'Merritt’s is based in Brooklyn Center and serves Minneapolis, St. Paul, and surrounding Twin Cities communities. Our service-area directory covers the north, south, east, and west metro. Send the exact pickup location so we can confirm availability, access, and terms for your vehicle.' },
  { question: 'When can I call?', answer: `Merritt’s is available by phone ${business.hoursDisplay.toLowerCase()}. You can also text the vehicle details to ${business.textPhone}.` },
];

export type Service = {
  slug: string;
  name: string;
  eyebrow: string;
  seoTitle: string;
  title: string;
  description: string;
  summary: string;
  image: '/images/legacy/merritts-tow-truck.jpg' | '/images/legacy/junk-car-removal.jpg' | '/images/legacy/auto-recycling-yard.jpg';
  imageAlt: string;
  highlights: string[];
  sections: Array<{ heading: string; paragraphs: string[]; items?: string[] }>;
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: 'cash-for-junk-cars', name: 'Cash for junk cars', eyebrow: 'Your unwanted vehicle. A clear next step.',
    seoTitle: "Sell Your Junk Car in the Twin Cities | Merritt's",
    title: 'Sell your junk car in Minneapolis, St. Paul and the suburbs',
    description: "Selling a junk car in the Twin Cities? Send Merritt's the vehicle details to discuss a cash offer, documents, and pickup. Call or text, daily 8 AM–8 PM.",
    summary: 'Have a car you no longer drive, a truck with a costly repair, or an SUV taking up space? Talk directly with Merritt’s about selling it in its current condition and arranging pickup.',
    image: '/images/legacy/merritts-tow-truck.jpg', imageAlt: "A Merritt's Auto Recycling truck carrying a vehicle",
    highlights: ['Cars, trucks, vans and SUVs', 'Running and non-running vehicles considered', 'Offer and pickup terms explained together'],
    sections: [
      { heading: 'A cash offer based on your actual vehicle', paragraphs: ['The year, make, model, condition, and completeness help us evaluate the vehicle. Tell us about collision damage, major mechanical problems, flat tires, removed components, or missing keys. A current photo can make those details easier to explain.', 'The pickup setting matters too. Include the city and whether the car is in a driveway, garage, ramp, repair-shop lot, or another location. We consider those details before confirming the offer.'] },
      { heading: 'What to send by phone or text', paragraphs: ['Start with the basics. You do not need to pay for repairs or new diagnostics just to ask about selling the car.'], items: ['Year, make, model, and known condition', 'Pickup city and parking setting', 'Whether it starts, rolls, and steers', 'Major damage or missing components', 'Title, lien, and key status'] },
      { heading: 'Know what you would actually receive', paragraphs: ['Compare the full agreement, not just a headline number. Ask whether removal has a charge, what conditions could change the offer, how payment will be handled, and which documents are needed.', 'Once you accept the terms, we coordinate access and a pickup window. Remove personal belongings and have the agreed documents ready. You choose whether to proceed after the details are clear.'] },
    ],
    faqs: [globalFaqs[1]!, globalFaqs[2]!, globalFaqs[4]!, globalFaqs[5]!],
  },
  {
    slug: 'junk-car-removal', name: 'Junk car removal', eyebrow: 'Clear the space. Plan the pickup.',
    seoTitle: "Junk Car Removal Across the Twin Cities | Merritt's",
    title: 'Junk car removal across the Twin Cities metro',
    description: "Arrange junk car removal in Minneapolis, St. Paul and nearby suburbs with Merritt's. Discuss a non-running vehicle, access, pickup terms, and scheduling.",
    summary: 'A disabled car does not need to become your towing project. Tell us where it is and what condition it is in. For vehicles we agree to buy or recycle, we work through the loading details with you.',
    image: '/images/legacy/junk-car-removal.jpg', imageAlt: 'A car secured on a flatbed tow truck',
    highlights: ['Driveway, garage and lot pickups reviewed', 'Non-running vehicles considered', 'A pickup window agreed directly'],
    sections: [
      { heading: 'Describe the pickup setting', paragraphs: ['Explain how the truck reaches the vehicle. Include gates, ramps, low clearances, tight turns, snow, soft ground, slopes, and blocked access. Say whether all wheels are present and whether the car rolls and steers.', 'At a repair shop, apartment, or business, coordinate authorization with whoever controls the property. Do not assume an address alone provides access to a shared garage or locked lot.'] },
      { heading: 'Prepare before the truck arrives', paragraphs: ['Once the pickup window is agreed, use this checklist.'], items: ['Remove belongings, documents, remotes, and toll tags', 'Arrange the agreed ownership paperwork and keys', 'Make sure any gate or property access is coordinated', 'Keep people and pets away from the loading area', 'Leave unsafe vehicle movement to the agreed pickup plan'] },
      { heading: 'Pickup costs and timing', paragraphs: ['We discuss removal terms with the offer, including any charge. The vehicle, location, loading conditions, and available schedule determine the pickup plan.', 'Mention a deadline during the first conversation. Do not promise a property manager that a car will be removed at a particular time until that window has been confirmed with us.'] },
    ],
    faqs: [globalFaqs[2]!, globalFaqs[5]!, globalFaqs[6]!, globalFaqs[3]!],
  },
  {
    slug: 'auto-recycling', name: 'Auto recycling', eyebrow: 'A next step for an end-of-life vehicle',
    seoTitle: "Auto Recycling in the Twin Cities Metro | Merritt's",
    title: 'Auto recycling for Twin Cities vehicle owners',
    description: "Talk to Merritt's about recycling an unwanted car in the Twin Cities. Review vehicle condition, ownership documents, and pickup options with a local business.",
    summary: 'When a vehicle is no longer useful to you, start by discussing its condition and ownership documents. Merritt’s reviews unwanted cars, trucks, vans, and SUVs from across the metro.',
    image: '/images/legacy/auto-recycling-yard.jpg', imageAlt: 'Rows of end-of-life vehicles at an auto recycling yard',
    highlights: ['Established in 1988', 'Based in Brooklyn Center', 'Serving Twin Cities vehicle owners'],
    sections: [
      { heading: 'Tell us what you have', paragraphs: ['Vehicle identity, completeness, and condition help determine the next step. Mention missing engines or transmissions, collision damage, fire or flood exposure, or wheels that do not move.', 'Do not dismantle a car or drain its fluids to prepare for an initial offer. Explain its current condition and let us discuss whether the vehicle and location fit a suitable purchase and removal arrangement.'] },
      { heading: 'What happens after pickup?', paragraphs: ['Vehicles can follow different paths after evaluation. Suitable components may be recovered, and prepared materials may enter recycling streams. Fluids, batteries, tires, and other regulated items require appropriate handling.', 'Our recycling guide links to Minnesota Pollution Control Agency information about automotive salvage. It explains the general process without promising the same outcome for every vehicle.'] },
      { heading: 'Vehicle buying rather than a parts-shopping trip', paragraphs: ['This website helps owners discuss selling and removing unwanted vehicles. It is not a searchable used-parts inventory. Call before making a visit or arranging a vehicle drop-off.', 'For service-area availability, use the metro directory or call with the exact vehicle location. We explain acceptance, documents, removal terms, and scheduling directly.'] },
    ],
    faqs: [globalFaqs[0]!, globalFaqs[1]!, globalFaqs[4]!, globalFaqs[6]!],
  },
  {
    slug: 'junk-car-towing', name: 'Junk vehicle towing', eyebrow: 'Pickup for vehicles we buy',
    seoTitle: "Junk Car Towing and Pickup | Twin Cities | Merritt's",
    title: 'Junk car towing for vehicles we agree to buy',
    description: "Need a junk vehicle picked up in the Twin Cities? Merritt's coordinates towing for cars it agrees to acquire. Call to discuss condition, access, and terms.",
    summary: 'When Merritt’s agrees to acquire your vehicle, towing is part of the pickup discussion. You do not need to arrange a separate tow just to ask about an offer.',
    image: '/images/legacy/junk-car-removal.jpg', imageAlt: 'A vehicle being transported on a flatbed tow truck',
    highlights: ['Pickup coordinated with the sale', 'Loading access reviewed first', 'Removal terms confirmed before dispatch'],
    sections: [
      { heading: 'How towing fits the sale', paragraphs: ['First we review the vehicle and its location. Then we discuss the offer, any removal charges, ownership documents, and the loading arrangement. A pickup window follows once the terms and access are clear.'] },
      { heading: 'Details the driver needs', paragraphs: ['Describe the surface, slope, clearance, wheel and tire condition, and whether the car rolls and steers. Tell us about locked garages, gates, removed parts, and another vehicle blocking access.', 'For a car at a shop or managed property, arrange release and access with the appropriate person before scheduling. Do not attempt improvised towing to move the car into a different position.'] },
      { heading: 'Need roadside help instead?', paragraphs: ['Our removal service is connected to vehicles we buy or recycle. It is not emergency roadside dispatch, mechanical repair, impound release, or transport between repair shops. Contact an appropriate roadside-assistance provider for those situations.'] },
    ],
    faqs: [globalFaqs[2]!, globalFaqs[3]!, globalFaqs[5]!, globalFaqs[6]!],
  },
];

export const publishedRoutes = [
  '/', ...services.map((service) => `/${service.slug}`), '/service-areas',
  ...serviceAreas.map((area) => `/service-areas/${area.slug}`),
  '/about', '/reviews', '/faq', '/contact', '/guides', '/privacy',
] as const;
