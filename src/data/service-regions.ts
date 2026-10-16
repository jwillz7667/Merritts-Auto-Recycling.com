export type ServiceRegion = {
  slug: string; name: string; title: string; description: string; intro: string;
  towns: string[]; citySlugs: string[]; sections: Array<{ heading: string; paragraphs: string[] }>;
  updated: string;
};
export const serviceRegions: ServiceRegion[] = [
  {
    slug: 'hennepin-county', name: 'Hennepin County', title: 'Junk car pickup in Hennepin County',
    description: 'Discuss selling an unwanted vehicle in Hennepin County. Find local pickup pages, plan garage or lot access, and check ownership documents with Merritt’s.',
    intro: 'Merritt’s is based in Brooklyn Center and serves vehicle owners across the Twin Cities. Use the local pages below or send the exact vehicle location to discuss a Hennepin County pickup.',
    towns: ['Brooklyn Center', 'Minneapolis', 'Brooklyn Park', 'Maple Grove', 'Plymouth', 'Crystal', 'New Hope', 'Robbinsdale', 'Osseo', 'Champlin', 'Rogers', 'Dayton', 'Corcoran'],
    citySlugs: ['brooklyn-center', 'minneapolis', 'brooklyn-park', 'maple-grove', 'plymouth', 'crystal', 'new-hope', 'robbinsdale', 'osseo', 'champlin', 'rogers', 'dayton'],
    sections: [
      { heading: 'Match the pickup plan to the property', paragraphs: ['A vehicle in an open driveway, one inside a parking ramp, and one behind a property gate need different access discussions. Include the approach, clearance, ground surface and wheel condition when describing the car. Do not arrange a separate tow or move an unsafe vehicle just to obtain an offer.', 'For Corcoran or another community without a separate page here, send the exact address and access details. A mailing city is not enough to confirm a route or equipment. We review the vehicle and location together before agreeing on a pickup window.'] },
      { heading: 'Coordinate residential and managed-property access', paragraphs: ['If the car is at an apartment, repair shop or workplace, find out who can release it and who controls the entrance. Access permission and authority to sell the vehicle are separate. A property manager cannot replace the titled owner’s required participation simply by opening a gate.', 'Mention a storage deadline at the start. Confirm the schedule with Merritt’s before telling a manager that a car will leave at a particular time. Arrange keys, agreed paperwork and a reachable contact for the actual appointment.'] },
      { heading: 'Compare the sale, not just the advertised price', paragraphs: ['Give buyers the same current description, including removed components, collision damage and whether the vehicle rolls and steers. Ask what amount you would receive after any agreed pickup or handling cost and what inspection findings could change it.', 'Use the vehicle-title guide for paperwork preparation, and the official Minnesota DVS resources for requirements. Do not publish your title, identification or full vehicle identification number in a review or public message.'] },
    ], updated: '2026-10-16',
  },
  {
    slug: 'wright-county', name: 'Wright County and nearby communities', title: 'Junk car pickup options around Wright County',
    description: 'Vehicle-selling and pickup information for Buffalo, Monticello, St. Michael, Albertville, Otsego and nearby communities. Discuss the address with Merritt’s.',
    intro: 'Find pickup information for the Wright County communities listed below. For Rockford, Hanover, Maple Lake or Clearwater, ask about the exact address before making a removal plan.',
    towns: ['Buffalo', 'Monticello', 'St. Michael', 'Albertville', 'Otsego', 'Rockford', 'Hanover', 'Maple Lake', 'Clearwater'],
    citySlugs: ['buffalo', 'monticello', 'st-michael', 'albertville', 'otsego', 'rogers'],
    sections: [
      { heading: 'Start with the actual address and storage setting', paragraphs: ['A nearby city name can describe a broad pickup area. Explain whether the vehicle is at a home, shop, business lot or another property and which entrance reaches it. This is especially useful when a mailing address differs from the local community name.', 'Merritt’s reviews access and route availability before confirming surrounding-community jobs. Do not infer a guaranteed pickup from a town appearing in this directory. Ask about the particular vehicle and any removal charge before accepting an offer.'] },
      { heading: 'Stored cars need a current condition report', paragraphs: ['A vehicle left unused through a season may have flat tires, locked wheels or removed parts. Send current photos of what remains and describe whether the car rolls and steers. Do not spend money on new diagnostics simply to start the conversation.', 'Tell us about a long approach, gate, slope, snow or soft ground if it affects loading. Do not attempt makeshift towing or move the car to a less stable surface while waiting for pickup. The equipment plan needs to reflect the vehicle as it is stored.'] },
      { heading: 'Resolve handoff details before a trip is scheduled', paragraphs: ['Confirm which owner must participate, what paperwork is needed and who has the keys. For a vehicle at a repair shop, arrange its release and access hours with the shop. An offer does not automatically settle a storage bill or authorize entry to someone else’s property.', 'Keep a record of the agreed amount, any deductions, payment arrangements and pickup window. Compare that complete agreement with your other selling options rather than assuming that a high advertised number is what you will receive.'] },
    ], updated: '2026-10-16',
  },
  {
    slug: 'sherburne-county', name: 'Sherburne County enquiries', title: 'Junk car pickup enquiries in Sherburne County',
    description: 'Ask Merritt’s about an unwanted vehicle in Elk River, Becker, Big Lake, Zimmerman, Orrock or Clear Lake. Check address-level availability and pickup terms first.',
    intro: 'For Elk River, see the detailed local page. For Becker, Big Lake, Zimmerman, Orrock or Clear Lake, send the vehicle details and exact location so availability can be reviewed before scheduling.',
    towns: ['Elk River', 'Becker', 'Big Lake', 'Zimmerman', 'Orrock', 'Clear Lake'],
    citySlugs: ['elk-river', 'otsego', 'monticello', 'ramsey'],
    sections: [
      { heading: 'Extended-area availability is confirmed before you commit', paragraphs: ['Merritt’s operates from Brooklyn Center, not a branch in every town. A request from Becker, Big Lake, Zimmerman, Orrock or Clear Lake needs a vehicle and address review before any pickup commitment. There is no automatic dispatch or guaranteed free removal attached to this page.', 'Include whether the car is complete, why it no longer runs, its wheel condition and the loading setting. A current description allows the buyer to discuss the actual job rather than quoting solely from a model name.'] },
      { heading: 'Account for access as well as distance', paragraphs: ['Explain the road or driveway entrance, surface, gates, clearance and obstructions when relevant. A car accessible on pavement and one blocked behind a building can need different equipment. Photos should be taken from a safe position without lifting or moving the vehicle.', 'Ask whether a proposed offer already accounts for removal and whether any charge will be deducted. Comparing the amount payable on the same facts is more useful than comparing an advertisement with a fully reviewed offer.'] },
      { heading: 'Have a document and property-release plan', paragraphs: ['A missing title, lien or another owner’s name should be raised before arranging a trip. Use Minnesota DVS or a deputy registrar for the ownership process. The seller’s authority and the property holder’s permission are different questions.', 'If this pickup is not available, do not leave the car on a road or another property. Resolve a removal plan with an appropriate local provider. Keep any agreement, title documents and vehicle identifiers private rather than posting them publicly.'] },
    ], updated: '2026-10-16',
  },
  {
    slug: 'north-metro', name: 'North metro', title: 'North metro junk car pickup and selling options',
    description: 'Find junk-car selling information around Anoka, Ramsey, Andover, Ham Lake and Coon Rapids. Ask about Nowthen, Oak Grove, St. Francis and Spring Lake Park.',
    intro: 'Explore the established north-metro pickup pages below. For Nowthen, Oak Grove, St. Francis or Spring Lake Park, discuss the exact address and vehicle with Merritt’s before agreeing on removal.',
    towns: ['Anoka', 'Ramsey', 'Andover', 'Ham Lake', 'Blaine', 'Coon Rapids', 'Fridley', 'Nowthen', 'Oak Grove', 'St. Francis', 'Spring Lake Park'],
    citySlugs: ['anoka', 'ramsey', 'andover', 'ham-lake', 'blaine', 'coon-rapids', 'fridley'],
    sections: [
      { heading: 'Choose the right next step for a car that no longer runs', paragraphs: ['A failed engine, transmission problem or long period in storage does not require repairing the car before asking for an offer. Start with its actual condition and compare selling, repairing and recycling before committing to additional costs.', 'For communities without a dedicated page, address-level availability is reviewed directly. A county name or the term north metro does not establish a promised pickup time. Describe the car, the loading area and any deadline in the initial conversation.'] },
      { heading: 'Describe storage and loading limitations early', paragraphs: ['Mention whether all wheels are present, the steering moves and the vehicle is blocked. For a garage or gated property, explain the entrance and clearance. For an outdoor location, include the ground surface and slope if relevant.', 'Do not try to free locked brakes, crawl underneath a damaged car or tow it with makeshift equipment to prepare for the call. A safe description is enough for an initial review, and the loading plan is agreed afterward.'] },
      { heading: 'Keep paperwork and payment explicit', paragraphs: ['Check the title holder, lien and key status. If the car belongs to an estate, business or another family member, confirm authority to sell before arranging release. Access granted by a property manager is not a replacement for that authority.', 'Ask about the amount payable, any pickup charge, payment method and pickup window. Put those details together when comparing buyers. Keep copies of completed records rather than assuming a phone conversation completes a transfer.'] },
    ], updated: '2026-10-16',
  },
  {
    slug: 'central-minnesota', name: 'Central Minnesota enquiries', title: 'Selling an unwanted car in central Minnesota',
    description: 'Plan a sale or removal for an unwanted car near St. Cloud, Sartell, Sauk Rapids, Waite Park, Foley, Foreston, Milaca or Princeton. Check service availability first.',
    intro: 'This guide is for extended-area enquiries, not a claim of a local Merritt’s branch or guaranteed coverage. Describe the vehicle and exact address before making any pickup commitment.',
    towns: ['St. Cloud', 'Sartell', 'Sauk Rapids', 'Waite Park', 'Foley', 'Foreston', 'Milaca', 'Princeton', 'Clearwater'],
    citySlugs: ['monticello', 'buffalo', 'elk-river'],
    sections: [
      { heading: 'Confirm who can actually collect the vehicle', paragraphs: ['For a car in St. Cloud, Sartell, Sauk Rapids, Waite Park, Foley, Foreston, Milaca or Princeton, ask about availability before comparing pickup times. Merritt’s is based in Brooklyn Center. Publishing this guide does not mean a truck is stationed nearby or that every extended-area job can be accepted.', 'Provide the year, make, model, completeness, condition and address. Ask a buyer whether its offer includes the actual removal arrangements or depends on another company collecting the car. Keep the responsible business and contact clear.'] },
      { heading: 'Compare selling locally with arranging a longer pickup', paragraphs: ['Consider the amount you would receive after any transport charge, the time needed to complete the sale and any storage deadline. A higher preliminary figure may not be the better result after fees or conditions are included.', 'Do not move a disabled vehicle to the Twin Cities simply to request an offer. First ask whether the car can be reviewed where it is stored. If Merritt’s cannot serve the address, arrange another appropriate provider rather than treating an enquiry as an appointment.'] },
      { heading: 'Prepare a safe release and ownership record', paragraphs: ['Explain gates, soft ground, low garage clearances, locked wheels and removed parts before scheduling. Get permission from the property holder and resolve any repair-shop release requirements. Leave unsafe vehicle movement to an agreed plan.', 'Gather the title and lien information, identify who can authorize the sale and use Minnesota DVS for unusual documentation situations. After the sale, retain the agreed terms and completed records. Never post identity documents or a complete vehicle identification number in a public review.'] },
    ], updated: '2026-10-16',
  },
  {
    slug: 'minnesota', name: 'Minnesota vehicle-selling information', title: 'Selling a junk car in Minnesota: pickup and documents',
    description: 'Find Minnesota vehicle-selling guides and Merritt’s Twin Cities pickup areas. Check title, plates, condition and exact-address availability before scheduling.',
    intro: 'Merritt’s focuses on the Twin Cities and nearby communities. Use this directory to find the relevant local information and prepare a vehicle-specific enquiry; it does not advertise blanket statewide pickup.',
    towns: ['Twin Cities', 'North metro', 'Hennepin County', 'Wright County', 'Sherburne County', 'Central Minnesota enquiries'],
    citySlugs: ['minneapolis', 'st-paul', 'brooklyn-center', 'maple-grove', 'bloomington', 'woodbury'],
    sections: [
      { heading: 'Separate ownership paperwork from removal arrangements', paragraphs: ['A car can be mechanically ready to load but not ready to sell. Check whose name is on the title, disclose any lien and ask about missing paperwork before setting a pickup date. Keys and permission to enter a property do not establish ownership.', 'Minnesota title, plate and junk-record processes depend on the transaction. Use the specific guides and official resources linked here rather than a blanket statement that every no-title vehicle can be sold. A phone offer does not replace the required documents.'] },
      { heading: 'Find the local page or ask about the exact address', paragraphs: ['The city directory covers Minneapolis, St. Paul and communities across the metro. Regional pages explain surrounding-area enquiries and connect related locations. For an address outside established coverage, availability must be reviewed before any dispatch commitment.', 'Give the actual vehicle location, not a proposed meeting point. Describe the surface, garage or gate access and whether the vehicle rolls and steers. Do not spend money moving an unsafe car merely to request an offer.'] },
      { heading: 'Compare complete vehicle-specific offers', paragraphs: ['Use the same condition, missing-part and access description with each buyer. Ask for the amount you would receive after any pickup cost, what could change the offer, and the payment method and timing. Decide only after those terms are clear.', 'If keeping or repairing the vehicle is also an option, compare realistic repair and transport costs with the sale proceeds and effort. The guides explain the decision without publishing a made-up universal price or ranking of buyers.'] },
    ], updated: '2026-10-16',
  },
];
export const regionalRoutes = serviceRegions.map((region) => `/service-regions/${region.slug}`);
