import { guides as establishedGuides, type Guide, type GuideSection } from './search-guides';
import { recoveryGuides, recoveryGuideUpdates } from './recovery-guides';

// Preserve the useful answers from the pre-overhaul articles without copying
// their unverified prices, operational promises, rankings, or legal instructions.
// Publication dates below come from Article JSON-LD in revision 94010cc.
const existingGuides = new Map<string, Guide>([
  ...establishedGuides.map((guide): [string, Guide] => [
    guide.slug,
    { ...guide, ...recoveryGuideUpdates[guide.slug] },
  ]),
  ...recoveryGuides.map((guide): [string, Guide] => [guide.slug, guide]),
]);

const restoreSections = (slug: string, sections: GuideSection[]): GuideSection[] => {
  const guide = existingGuides.get(slug);
  if (!guide) throw new Error(`Cannot restore missing guide: ${slug}`);
  // Keep the established introduction and put concrete answers before its final
  // checklist. The existing canonical route and all existing sections survive.
  return [...guide.sections.slice(0, -1), ...sections, ...guide.sections.slice(-1)];
};

const updated = { updated: 'October 16, 2026', updatedIso: '2026-10-16' };

export const legacyGuideUpdates: Record<string, Partial<Guide>> = {
  'what-affects-a-junk-car-offer': {
    ...updated,
    publishedIso: '2026-02-04',
    readingTime: '6 min read',
    sections: restoreSections('what-affects-a-junk-car-offer', [
      {
        heading: 'Does the catalytic converter affect the offer?',
        paragraphs: [
          'Tell the buyer if the catalytic converter or another major component has been removed, replaced, stolen, or damaged. Original equipment and replacement components can differ, and their presence alone does not establish a payout. You do not need to crawl beneath a vehicle or identify a part number to make an initial inquiry.',
          'Describe the car as it sits. Ask for an offer for the complete vehicle before deciding to remove anything: selling a component separately can change the vehicle offer, the work involved, and the remaining removal arrangement. Do not remove pollution-control equipment from a vehicle that will return to road use.',
        ],
      },
      {
        heading: 'Why can two similar cars receive different offers?',
        paragraphs: [
          'The same model can have different engines, transmissions, drivetrains, and major damage. One car may be complete and accessible while another is missing parts, cannot roll, or sits in a difficult garage. Buyers also can have different demand and downstream options for the vehicle.',
          'An advertisement for another car is a starting point for questions, rather than a record of a completed purchase. When comparing offers, use your exact model and current photographs, disclose the same faults, and compare the amount payable after agreed costs. Ask what inspection findings could change a preliminary estimate.',
        ],
      },
    ]),
  },
  'minnesota-junk-car-documents': { publishedIso: '2026-02-11' },
  'minnesota-license-plates-before-junking': { publishedIso: '2026-02-25' },
  'scrap-car-value-by-weight': {
    ...updated,
    publishedIso: '2026-02-18',
    readingTime: '6 min read',
    sections: restoreSections('scrap-car-value-by-weight', [
      {
        heading: 'Where can I find the correct vehicle weight?',
        paragraphs: [
          'Start with the manufacturer’s specifications for the exact model, model year, body style, engine, and drivetrain. The owner’s manual or manufacturer can help identify which figure applies. Accessories, removed parts, and items stored in the vehicle can make the actual vehicle different from a published specification.',
          'Curb weight and gross vehicle weight rating are different measurements. Curb weight describes the vehicle under a specified equipment and fluid condition; GVWR describes the maximum rated loaded weight. A door-jamb label showing GVWR is not a measurement of the empty car’s recyclable material. Ask what the buyer weighs and how that relates to the purchase terms.',
        ],
      },
      {
        heading: 'Short ton, gross ton, or metric tonne?',
        paragraphs: [
          'A U.S. short ton is 2,000 pounds. A gross ton, also called a long ton, is 2,240 pounds. A metric tonne is 1,000 kilograms, approximately 2,204.62 pounds. A per-ton rate cannot be compared correctly until you know which unit the seller is using.',
          'For a material-only calculation, divide the measured pounds of that material by the pounds in the quoted ton, then multiply by the matching material rate. That arithmetic does not convert a complete car’s curb weight into a cash offer: a vehicle includes other materials, and preparation, loading, transport, and purchase terms still need to be considered.',
        ],
      },
      {
        heading: 'What about aluminum, copper, and a catalytic converter?',
        paragraphs: [
          'A vehicle can contain steel, aluminum components, copper wiring, and a catalytic converter containing recoverable metals. They are different material streams. A quoted rate for clean, separated metal is not automatically a rate for an assembled car, and a component’s advertised resale price is not the amount a vehicle buyer can pay for it.',
          'Leave components in place while obtaining an initial vehicle offer. Tell the buyer about parts already removed and ask whether its proposal concerns the whole car or a different arrangement. Do not assume dismantling will increase your proceeds after tools, labor, storage, and removal costs.',
        ],
      },
    ]),
  },
  'running-vs-non-running-car-value': {
    ...updated,
    publishedIso: '2026-03-11',
    readingTime: '6 min read',
    sections: restoreSections('running-vs-non-running-car-value', [
      {
        heading: 'It starts but will not move: how should I describe it?',
        paragraphs: [
          'Say exactly that. An engine that starts does not establish that the transmission engages, the brakes release, or the suspension can support movement. Share a repair shop’s existing diagnosis if you have one, and distinguish that diagnosis from a guess.',
          'Tell the buyer separately whether the vehicle can roll and steer. A transmission problem and locked wheels create different loading questions. Do not drive, push, or tow an unsafe car to demonstrate its condition; discuss the access and equipment before scheduling.',
        ],
      },
      {
        heading: 'It ran when parked, but now the battery is dead',
        paragraphs: [
          'Give the last date it was known to run, how long it has been parked, and what you have observed since. “Ran when parked” is useful history, but it does not establish its condition today. A dead battery can hide other faults, and a long-parked vehicle can have tire, brake, fuel, or fluid issues.',
          'You can request an offer without buying a battery or attempting a restart. If you are considering professional testing or repairs, first compare the cost with an actual offer for the vehicle as it sits. Avoid the assumption that a small repair will always produce a larger payment.',
        ],
      },
      {
        heading: 'Does a warning light make it a non-running car?',
        paragraphs: [
          'A warning light alone does not describe the underlying condition. State whether the engine starts, whether the vehicle moves normally, any known warning or diagnostic code, and symptoms such as overheating, smoke, leaks, or unusual noises. Say when the symptom was last observed.',
          'Use an existing diagnostic report if available; do not guess that every light is a minor issue or promise a buyer that the vehicle is roadworthy. An accurate description makes it easier to compare a repair buyer, private sale, trade-in, and recycling offer for the same car.',
        ],
      },
    ]),
  },
  'repair-trade-in-or-sell-a-junk-car': {
    ...updated,
    publishedIso: '2026-03-18',
    readingTime: '6 min read',
    sections: restoreSections('repair-trade-in-or-sell-a-junk-car', [
      {
        heading: 'Use net proceeds to compare the offers',
        paragraphs: [
          'For a private sale, subtract advertising, agreed repairs, transport, and any other selling expense from the realistic sale proceeds. For a recycling purchase, subtract any agreed removal charge from the payment. Compare an actual offer with another actual offer; an optimistic asking price is a different kind of number.',
          'When a trade-in is part of buying another car, request the full written out-the-door transaction, including the vehicle price, trade allowance, fees, financing, and applicable taxes. A larger trade allowance can be offset elsewhere in the deal. Ask the dealer or Minnesota Department of Revenue about the tax treatment for your transaction instead of applying an old blog’s tax rate.',
        ],
      },
      {
        heading: 'How much time can you give a private sale?',
        paragraphs: [
          'Include photographs, listing messages, appointments, test-drive arrangements, document preparation, and buyer removal in your decision. A running vehicle another owner wants can be a reasonable private-sale candidate. A disabled project can also have a buyer, but transport and an honest condition description become especially important.',
          'Choose a review date if a property deadline or storage cost makes waiting expensive. You can discuss a vehicle offer while testing other options; ask when each offer expires rather than assuming a quote remains available indefinitely. Do not promise collection to a property manager until the buyer confirms a pickup window.',
        ],
      },
      {
        heading: 'Check the buyer and payment before handing over the car',
        paragraphs: [
          'The Federal Trade Commission warns sellers about fake checks and overpayment requests. A request to refund an excess payment or pay a supposed shipper deserves particular scrutiny. Funds appearing in an account do not by themselves establish that a check is genuine.',
          'Identify the buyer, confirm the payment arrangement with the appropriate financial institution, and keep a transaction record. Use official Minnesota instructions for the documents and any required sale reporting. Do not send photographs of identification or an unsigned title to an unknown person merely to answer a marketplace inquiry.',
        ],
      },
    ]),
    sources: [
      {
        label: 'Federal Trade Commission: how to spot, avoid, and report fake check scams',
        href: 'https://consumer.ftc.gov/articles/how-spot-avoid-report-fake-check-scams',
      },
      {
        label: 'Minnesota Department of Revenue: motor vehicle sales tax',
        href: 'https://www.revenue.state.mn.us/guide/motor-vehicle-sales',
      },
      {
        label: 'Minnesota DVS: vehicle title transfer',
        href: 'https://dps.mn.gov/divisions/dvs/vehicle/vehicle-titles/vehicle-title-transfer',
      },
    ],
  },
  'vehicles-considered-for-recycling': {
    ...updated,
    publishedIso: '2026-04-01',
    title: 'Selling an unwanted car, pickup, SUV, or minivan in Minnesota',
    seoTitle: "Sell an Unwanted Car, Truck, SUV or Van in MN | Merritt's",
    summary:
      'Send the model, condition, and pickup details for the vehicle you have. The examples below help you describe a sedan, pickup, SUV, or minivan so the buyer can review the complete vehicle and loading arrangement.',
    readingTime: '6 min read',
    sections: [
      {
        heading: 'Ford F-150, Chevrolet Silverado, GMC Sierra, and Ram 1500',
        paragraphs: [
          'For a Ford F-150, Chevrolet Silverado, GMC Sierra, or Dodge/Ram 1500, include the model year, cab and bed configuration, engine if known, and two-wheel or four-wheel drive. Explain known mechanical faults, collision damage, removed parts, and the condition of the frame and suspension. These details identify your truck; the model name alone does not establish an offer.',
          'Say whether a plow, camper, aftermarket lift, trailer, or other attachment is present. Tell the buyer about material in the bed and remove personal property safely. For heavier or commercial trucks outside these examples, ask about acceptance and equipment before arranging release or a drop-off.',
        ],
      },
      {
        heading: 'Honda Civic and Toyota Camry',
        paragraphs: [
          'For a Honda Civic or Toyota Camry, provide the year, body style, engine or hybrid version if known, mileage, and actual condition. A car with an engine problem can present a different proposal from a running car with collision damage or a dismantled project. Describe the faults instead of relying on another listing’s price.',
          'Tell the buyer whether the engine, transmission, wheels, and exhaust components remain. Identify a hybrid vehicle at the first call and disclose known battery damage without handling high-voltage components. Acceptance and loading are reviewed for the individual vehicle.',
        ],
      },
      {
        heading: 'Ford Taurus, Mercury Sable, and Chevrolet Impala',
        paragraphs: [
          'For a Ford Taurus, Mercury Sable, or Chevrolet Impala, explain whether it starts, moves, rolls, and steers. Include how long it has been parked and known body or underbody damage. An older car can have several unrelated problems; an existing repair estimate can help explain them without purchasing a new diagnosis.',
          'If the car is at a repair shop, confirm who holds the keys and what is needed for release. A driveway pickup and a vehicle behind a shop’s locked gate need different access arrangements even when the vehicle model is identical.',
        ],
      },
      {
        heading: 'Jeep Grand Cherokee and Subaru Outback, Forester, or Legacy',
        paragraphs: [
          'Identify the exact model, year, drivetrain, and known fault for a Jeep Grand Cherokee or Subaru Outback, Forester, or Legacy. Explain any engine, transmission, collision, fire, or flood issue that you know about. These are examples for describing a vehicle, rather than a prediction that a particular model has a particular defect.',
          'Describe wheel, tire, steering, and suspension condition separately from the engine problem. Include garage clearance, tight turns, soft ground, or a slope at the pickup site. Let the operator select a suitable loading method after reviewing the vehicle and access.',
        ],
      },
      {
        heading: 'Chrysler Town & Country and Dodge Caravan minivans',
        paragraphs: [
          'For a Chrysler Town & Country or Dodge Caravan, send the model year, condition, missing-component details, and whether the van can roll and steer. Disclose mobility equipment or other substantial modifications so the buyer can determine whether the vehicle fits the proposed arrangement.',
          'Before a confirmed pickup, check under and between seats, folding-seat compartments, door pockets, cargo storage, and the spare-key location. Remove child seats, work equipment, personal paperwork, and remotes safely. Keep the agreed documents ready and coordinate any shared-garage or property access.',
        ],
      },
      {
        heading: 'Other models, business vehicles, and unusual equipment',
        paragraphs: [
          'You can ask about other cars, trucks, vans, and SUVs using the same details: identity, condition, completeness, ownership documents, and pickup setting. These examples are not a statewide ranking, a price list, or a guarantee that any specific vehicle will be purchased.',
          'For a business-owned vehicle, identify who is authorized to sell it. Ask directly about recreational vehicles, buses, tractors, farm equipment, trailers, and commercial vehicles; their size, documents, condition, and loading needs require an individual acceptance discussion. Wait for confirmation before arranging a drop-off.',
        ],
      },
    ],
  },
  'auto-recycling-environmental-considerations': {
    ...updated,
    publishedIso: '2026-03-04',
    readingTime: '6 min read',
    sections: restoreSections('auto-recycling-environmental-considerations', [
      {
        heading: 'Why do leaking fluids and stormwater matter?',
        paragraphs: [
          'A parked vehicle can still contain fuel, engine oil, coolant, transmission fluid, and brake fluid. A leak on pavement or bare soil can spread with rain or snowmelt. Report visible leaks and the parking surface when asking about removal, especially near a drain or waterway.',
          'Do not hose a leak into the street, pour fluids onto the ground, or attempt to drain a vehicle for pickup. If a spill needs a response, use the appropriate emergency or environmental reporting service. A vehicle offer is separate from a spill-cleanup or contaminated-soil service.',
        ],
      },
      {
        heading: 'Batteries, refrigerants, tires, and other components',
        paragraphs: [
          'A lead-acid battery, a hybrid or electric-vehicle battery, an air-conditioning system, and a tire require different handling. EPA’s motor-vehicle air-conditioning resources explain refrigerant servicing and recovery requirements. Releasing refrigerant is not a preparation step for selling a car.',
          'Tell the buyer about known battery damage, fire exposure, loose parts, or tires missing from the vehicle. Leave high-voltage systems and damaged components to appropriately equipped personnel. Ask about loose tires or spare batteries separately instead of assuming the vehicle purchase includes every item stored alongside it.',
        ],
      },
      {
        heading: 'What does material recovery include?',
        paragraphs: [
          'Usable parts can continue serving another vehicle, while prepared metals can enter material-recovery streams. These are different outcomes: reusing a component is different from melting its material. Mixed plastics, glass, rubber, and other residue may follow different downstream paths.',
          'Ask the operator what it expects to do with your vehicle and which facilities are involved. A universal percentage would conceal differences in condition and processing. The MPCA’s automotive-salvage guidance is a better basis for environmental questions than an unverified claim that every part of every vehicle is recycled.',
        ],
      },
    ]),
    sources: [
      {
        label: 'Minnesota Pollution Control Agency: automotive repair, body shops and salvage',
        href: 'https://www.pca.state.mn.us/business-with-us/automotive-repair-body-shops-and-salvage',
      },
      {
        label: 'U.S. Environmental Protection Agency: motor vehicle air conditioning',
        href: 'https://www.epa.gov/mvac',
      },
    ],
  },
  'what-happens-after-junk-car-pickup': {
    ...updated,
    publishedIso: '2026-03-25',
    readingTime: '6 min read',
    sections: restoreSections('what-happens-after-junk-car-pickup', [
      {
        heading: 'How inspection can lead to reuse or material recycling',
        paragraphs: [
          'The vehicle’s condition helps determine whether it can be repaired, whether components are suitable for reuse, or whether prepared materials will be recovered. Evaluation can concern the drivetrain, body, wheels, electrical equipment, and missing or damaged components. A buyer needs the actual vehicle details to explain its intended next step.',
          'A complete working assembly and a damaged component do not necessarily have the same use. Inspection, testing, lawful reuse, demand, and the work required affect what can be recovered. A used part listed online is not proof that the same part in your vehicle will be resold at that price.',
        ],
      },
      {
        heading: 'What depollution and dismantling mean',
        paragraphs: [
          'Before further processing, an end-of-life vehicle can require appropriate handling of fuel, oils, coolant, batteries, refrigerants, tires, and other regulated items. Suitable parts may be removed for reuse through the facility’s process. The MPCA explains environmental considerations for automotive salvage operations.',
          'These stages belong with appropriately equipped operators. You do not need to empty the fuel tank, remove a battery, cut off a converter, or dismantle the car to obtain an initial offer. Disclose leaks, damage, and missing parts so the collecting business can decide how to handle it.',
        ],
      },
      {
        heading: 'What happens to the remaining vehicle body?',
        paragraphs: [
          'Prepared vehicle bodies may be sent to downstream metal processors. Shredding and sorting can separate ferrous metals, nonferrous metals, and other materials; magnets can separate iron and steel, while other equipment separates additional streams. The resulting materials can become inputs for manufacturing.',
          'The exact equipment, destinations, recovery results, and time involved depend on the facilities and the vehicle. Ask the buyer about its actual process if the downstream path matters to you. A collection date alone does not establish when every component becomes a new product.',
        ],
      },
      {
        heading: 'What records should the seller keep?',
        paragraphs: [
          'Keep the accepted terms, buyer’s business details, receipt, date of handoff, and completed transaction documents you are entitled to retain. Ask who handles any applicable title or junk notification and what confirmation you will receive. Plate handling and insurance changes require their own appropriate instructions.',
          'If a document or confirmation is missing, contact the buyer and the appropriate official office with your private records. Do not post your title, identification, full vehicle identification number, or home address in a public review to resolve a question.',
        ],
      },
    ]),
  },
};

export const restoredMinneapolisGuide: Guide = {
  slug: 'minneapolis-junk-car-removal-costs-and-pickup',
  title: 'Junk car removal in Minneapolis: costs, access, and pickup',
  shortTitle: 'Minneapolis removal and pickup costs',
  seoTitle: "Minneapolis Junk Car Removal: Costs and Pickup | Merritt's",
  description:
    'Plan junk car removal in Minneapolis. Ask about free pickup, the net offer, apartment and alley access, paperwork, non-running vehicles, and scheduling.',
  summary:
    'For a car in a Minneapolis driveway, alley, apartment garage, or repair-shop lot, start with its condition and exact pickup setting. Ask what you would receive and whether removal has a charge before accepting the offer.',
  publishedIso: '2026-04-08',
  ...updated,
  readingTime: '6 min read',
  sections: [
    {
      heading: 'Is junk car removal in Minneapolis free?',
      paragraphs: [
        'Ask whether the offer for your specific car includes pickup and whether any removal or handling charge will be deducted. “Free removal” should be clarified alongside the amount you would receive, the vehicle description, and any conditions. A large advertised amount tells you less than an agreed net offer.',
        'Merritt’s discusses removal terms after reviewing the vehicle, location, and loading access. Free pickup is not guaranteed for every vehicle or setting. Ask for the complete terms before arranging release from a shop or telling a property manager that collection is scheduled.',
      ],
    },
    {
      heading: 'What should I send for an offer?',
      paragraphs: [
        'Call 763-533-2775 or text 763-438-2116 with the details below. You can ask about selling the car as it sits without buying repairs or arranging a separate tow.',
      ],
      items: [
        'Year, make, model, and known mechanical or collision damage',
        'Whether it starts, rolls, and steers, and whether all wheels are present',
        'Missing components, keys, and title or lien questions',
        'Minneapolis neighborhood, pickup address, and parking setting',
        'Garage or gate clearance, surface, and anything blocking access',
        'Current photographs and any removal deadline',
      ],
    },
    {
      heading: 'Alley and driveway pickups in Minneapolis',
      paragraphs: [
        'For a car in North Minneapolis, Northeast, Uptown, Longfellow, or another Minneapolis neighborhood, describe the actual approach rather than relying on the neighborhood name. Explain a narrow alley, tight turn, garage door, slope, snow, or another parked vehicle between the truck and the car.',
        'If another car blocks the approach, arrange its removal with its owner when it is safe to do so. Do not push the disabled vehicle into the alley or public street to make collection easier. The operator needs to confirm a suitable loading plan for the existing setting.',
      ],
    },
    {
      heading: 'Apartment garages, parking ramps, and repair-shop lots',
      paragraphs: [
        'A Downtown or Loring Park ramp can involve clearance, gate access, and property rules that differ from an open driveway. Send the entry route and any known height restriction. Identify who can open the gate and whether management requires a particular collection arrangement.',
        'For a vehicle at a repair shop, confirm release, keys, property access, and any outstanding shop arrangements before booking a buyer’s pickup. Property permission and authority to sell the vehicle are separate questions; resolve both before the truck is scheduled.',
      ],
    },
    {
      heading: 'Flat tires, no keys, or a car that will not start',
      paragraphs: [
        'A failed engine, flat tires, locked wheels, and missing keys create different questions. Tell the buyer which ones apply. A car that will not start may still roll and steer, while a running engine does not make damaged suspension safe to move.',
        'Do not attempt improvised towing or unsafe testing to prove a condition. Merritt’s reviews the vehicle and setting before confirming acceptance and equipment. Tell us how long it has been parked and what is known rather than assuming every disabled car loads the same way.',
      ],
    },
    {
      heading: 'Titles, plates, and payment arrangements',
      paragraphs: [
        'Explain missing titles, liens, a different owner’s name, or an estate situation at the first conversation. Use Minnesota DVS and the applicable scrap-vehicle rules to confirm the required documents. A car located at your address does not automatically belong to you.',
        'Ask how payment will be handled, which records you receive, and what should happen to the plates for this transaction. Confirm any required owner participation before scheduling. Keep sensitive documents private and follow the current official instructions rather than an old blanket rule.',
      ],
    },
    {
      heading: 'Can pickup happen today, or before a parking deadline?',
      paragraphs: [
        'Mention a deadline when you first call. Availability depends on the vehicle, location, loading conditions, and schedule; sending a form is not a dispatch confirmation. Merritt’s confirms the pickup window directly after reviewing the details.',
        'A purchase arrangement does not suspend city parking, snow-emergency, impound, or property rules. If the car is on a Minneapolis street, check the city’s current parking information. Coordinate with the appropriate authority or property manager instead of assuming a planned pickup prevents enforcement.',
      ],
    },
    {
      heading: 'Before the agreed pickup window',
      paragraphs: [
        'Remove belongings, toll tags, remotes, personal paperwork, and stored keys when safe. Have the agreed documents ready, coordinate gate access, and keep people and pets clear of loading. Keep a receipt and your completed records after handoff.',
      ],
      items: [
        'Offer, any charges, payment, and documents confirmed',
        'Pickup window agreed directly with the buyer',
        'Vehicle owner and property access coordinated',
        'Personal items removed safely',
        'Plate handling and insurance timing checked separately',
      ],
    },
  ],
  sources: [
    {
      label: 'Minnesota DVS: vehicle title transfer',
      href: 'https://dps.mn.gov/divisions/dvs/vehicle/vehicle-titles/vehicle-title-transfer',
    },
    {
      label: 'Minnesota Statutes 168A.1501: scrap vehicle purchases',
      href: 'https://www.revisor.mn.gov/statutes/cite/168A.1501',
    },
    {
      label: 'City of Minneapolis: parking, meters, and snow information',
      href: 'https://www.minneapolismn.gov/getting-around/parking-driving/',
    },
  ],
  related: [
    'what-affects-a-junk-car-offer',
    'minnesota-junk-car-documents',
    'non-running-car-removal-checklist',
  ],
};
