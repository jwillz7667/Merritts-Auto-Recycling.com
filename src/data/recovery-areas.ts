import type { ServiceArea } from './metro-existing';

// Part of the complete 88-community directory, including restored historical cities.
// Historical city URLs lead to their own pages; county and state URLs stay regional.
// These are pickup inquiries, not additional business locations or branches.
type RecoveryInput = {
  slug: string;
  city: string;
  description: string;
  intro: string;
  heading: string;
  paragraphs: string[];
  secondHeading: string;
  secondParagraphs: string[];
  details: string[];
  question: string;
  answer: string;
  secondQuestion: string;
  secondAnswer: string;
  nearby: string[];
};
const makeArea = (item: RecoveryInput): ServiceArea => ({
  slug: item.slug,
  city: item.city,
  title: `Cash for junk cars in ${item.city}, MN`,
  description: item.description,
  intro: item.intro,
  proof:
    'Merritt’s Auto Recycling was established in 1988 and is based in Brooklyn Center. Discuss the vehicle, the amount payable, and pickup arrangements before accepting an offer.',
  sections: [
    { heading: item.heading, paragraphs: item.paragraphs },
    { heading: item.secondHeading, paragraphs: item.secondParagraphs },
  ],
  details: item.details,
  faqs: [
    { question: item.question, answer: item.answer },
    { question: item.secondQuestion, answer: item.secondAnswer },
  ],
  nearby: item.nearby,
  updated: '2026-10-16',
});

export const recoveredAreas: ServiceArea[] = [
  makeArea({
    slug: 'ramsey',
    city: 'Ramsey',
    description:
      'Selling an unwanted vehicle in Ramsey? Coordinate the owner, keys, Highway 10-area access, and complete pickup terms with Merritt’s Auto Recycling.',
    intro:
      'Selling a car in Ramsey that has stopped being useful? Call or text Merritt’s with its condition and location. We discuss the offer and the complete pickup arrangement before you decide.',
    heading: 'Plan the handoff when the car and its owner are in different places',
    paragraphs: [
      'Start with where the vehicle is actually parked in Ramsey, even if you live or work somewhere else. Identify who holds the keys and who can authorize access. The person opening a gate is not necessarily the person entitled to sign the vehicle documents, so coordinate both roles before an appointment.',
      'For a vehicle stored behind another car or beside a building, describe the approach and whether the wheels and steering move. Current photographs should show the car and the loading approach, not just an old picture taken when it was running. Do not attempt to tow it into a different position for the photographs.',
      'When comparing offers, include any storage deadline and ask how long the proposed terms remain available. Confirm the amount you would receive after any agreed pickup charge. Once a sale is agreed, remove belongings, arrange the required signatures, and keep a way to reach you during the pickup window.',
    ],
    secondHeading: 'Explain the Ramsey entrance beyond the highway corridor',
    secondParagraphs: [
      'Ramsey includes residential neighborhoods, business properties, and locations with longer private drives. If the vehicle is reached from the Highway 10 corridor, identify the actual side street or frontage-road entrance. A landmark can help explain the area, but the pickup operator needs the route that legally reaches the parked car, not instructions to stop beside the highway.',
      'For a property farther from the main road, describe the final driveway surface, gate, and available approach. A car behind an outbuilding or on soft ground needs that setting reviewed alongside its wheel condition. Send the complete physical address and current access photos; address-level availability and a suitable loading arrangement are confirmed before a pickup window is agreed.',
    ],
    details: [
      'Use the vehicle’s actual pickup address.',
      'Coordinate keys, signatures and property access separately.',
      'Tell us about storage deadlines before accepting an offer.',
    ],
    question: 'Can someone else meet the driver for my Ramsey car?',
    answer:
      'Discuss this before scheduling. Someone may be able to provide property access, but ownership documents, identification and authority to sell must still be confirmed for the transaction.',
    secondQuestion: 'What should I send for a Ramsey vehicle reached from Highway 10?',
    secondAnswer:
      'Send its complete street address, usable driveway or frontage-road entrance, and where it sits on the property. Describe gates, surface conditions, and whether it rolls and steers so the actual loading approach can be reviewed.',
    nearby: ['anoka', 'andover', 'champlin'],
  }),
  makeArea({
    slug: 'rogers',
    city: 'Rogers',
    description:
      'A Rogers car at a repair shop needs more than an offer. Review removed parts, authorized release, business hours, and pickup access with Merritt’s.',
    intro:
      'Contact Merritt’s about an unwanted vehicle in Rogers. A car at a home, shop or workplace can be reviewed in its present condition, without paying for a separate tow just to ask for an offer.',
    heading: 'Make a repair-shop release part of the pickup plan',
    paragraphs: [
      'When a repair estimate leads you to sell a vehicle in Rogers, tell us what the shop has already found and what has been removed. An engine taken apart for diagnosis, wheels stored separately, or parts left in the trunk all affect the description. An existing estimate can help; a new paid inspection is not required for an initial conversation.',
      'Ask the shop who can release the vehicle, where the keys are kept, and when the car will be accessible. Resolve any outstanding repair or storage arrangements with the shop. Accepting a buyer’s offer does not by itself give the driver authority to enter a closed lot or remove a car held by someone else.',
      'Before scheduling, compare the offer after any pickup costs and make sure the agreed vehicle condition still matches. Do not authorize further dismantling or move the vehicle to another shop without telling the buyer. Keep a record of the accepted terms and the contact who will handle release.',
    ],
    secondHeading: 'Distinguish an interchange landmark from the Rogers loading address',
    secondParagraphs: [
      'Rogers properties near Interstate 94 or Highway 101 may have several business entrances, service drives, or separate customer and storage lots. Give the exact address and the entrance authorized for vehicle collection. A general meeting point near an interchange does not establish where the car is stored or whether a truck can enter the right lot.',
      'For a vehicle at home, explain whether it is in a garage, on a short driveway, or behind another car. Report a low opening, tight turn, or locked steering before an appointment is discussed. We confirm address-level availability and access with the vehicle review, so leave a disabled car where it is rather than moving it into a public loading space.',
    ],
    details: [
      'Disclose parts removed during diagnosis.',
      'Check release arrangements and shop access hours.',
      'Compare the amount payable after pickup costs.',
    ],
    question: 'Will an offer cover a Rogers car already partly disassembled?',
    answer:
      'Describe exactly what remains and where removed parts are stored. Merritt’s reviews the actual condition and loading requirements before agreeing to a purchase.',
    secondQuestion: 'Can I arrange a Rogers pickup from a workplace lot?',
    secondAnswer:
      'First obtain the responsible person’s permission for access and provide the exact parking location, entrance, and available hours. We review the vehicle and loading setting before confirming an offer and pickup window.',
    nearby: ['maple-grove', 'dayton', 'st-michael', 'albertville'],
  }),
  makeArea({
    slug: 'ham-lake',
    city: 'Ham Lake',
    description:
      'Have a Ham Lake car on gravel, grass, or behind a gate? Describe its present condition and property access to discuss a vehicle sale with Merritt’s.',
    intro:
      'Have a non-running car or unwanted truck in Ham Lake? Share the condition, ownership information and pickup setting with Merritt’s to discuss selling it as it sits.',
    heading: 'Tell us about storage surfaces before moving a disabled vehicle',
    paragraphs: [
      'A vehicle sitting away from a paved driveway needs a clear access description. For a Ham Lake pickup, explain whether the car is on pavement, gravel, grass or another surface and whether a truck can approach it. Mention gates, slopes, overhead obstacles and anything blocking the wheels.',
      'If the ground is soft, icy or covered by snow, say so before scheduling. Do not drag the vehicle onto a lawn or release its brakes to make it easier to reach. A car that will not start and one that cannot safely roll are different loading situations; report what you can observe without testing it unsafely.',
      'The offer discussion includes the vehicle’s completeness, documents and removal conditions. Send current photographs from a safe position and explain missing keys, wheels or major parts. Once the plan is agreed, clear personal belongings and make the property entrance available for the confirmed window.',
    ],
    secondHeading: 'Use the actual Ham Lake property address and vehicle inventory',
    secondParagraphs: [
      'A reference to Highway 65 does not show how a truck would reach a vehicle on a Ham Lake property. Give the full street address and explain the turn into the usable entrance. If the car is beyond the house or beside an outbuilding, include photos showing the route as well as the vehicle itself.',
      'For a property cleanout involving several cars or trucks, list each vehicle separately with its year, make, model, completeness, and ownership documents. One vehicle may be easy to reach while another is blocked or missing wheels. Confirm acceptance and the terms for each vehicle, along with address-level availability, before planning the cleanout around a coordinated pickup.',
    ],
    details: [
      'Describe the ground surface and approach.',
      'Mention locked wheels and missing keys separately.',
      'Leave vehicle movement to the agreed loading plan.',
    ],
    question: 'Should I pull my Ham Lake car onto the driveway first?',
    answer:
      'Not without an agreed safe plan. Describe its current position and let us review access and equipment before you move a disabled vehicle.',
    secondQuestion: 'Can several vehicles on one Ham Lake property be reviewed together?',
    secondAnswer:
      'Yes. Send separate condition and ownership details for each, plus photographs of their positions. We assess acceptance, access, and purchase terms individually before discussing whether a coordinated appointment can be arranged.',
    nearby: ['blaine', 'andover', 'coon-rapids'],
  }),
  makeArea({
    slug: 'andover',
    city: 'Andover',
    description:
      'Review a long-unused Andover car with Merritt’s before buying a battery or tires. Discuss current condition, title questions, garage access, and pickup terms.',
    intro:
      'Free up space by discussing a sale of your unwanted vehicle in Andover. Merritt’s reviews running and non-running cars, trucks, vans and SUVs individually.',
    heading: 'When a second vehicle has become a storage project',
    paragraphs: [
      'A vehicle kept as a spare can sit long enough that its condition changes. Before asking about your Andover car, note the last known problem, whether all major components remain, and whether tires or wheels are missing. Do not buy a battery or new tires solely to start an offer conversation.',
      'Check for personal items in the console, glove box, cargo area and storage bins. Tools, remotes, toll tags and documents often remain in a vehicle that is no longer used every day. Remove what belongs to you safely before an agreed pickup, not while the driver is loading.',
      'Locate the title and explain any lien or name mismatch early. A vehicle may be physically ready to leave while its paperwork is not. We discuss the amount payable, any removal charge and the pickup window after reviewing both. You can compare those complete terms with repairing or privately selling the car.',
    ],
    secondHeading: 'Tell us which Andover entrance reaches the stored vehicle',
    secondParagraphs: [
      'Andover inquiries can come from a compact neighborhood driveway or a larger property with a detached garage. Give the physical pickup address and describe the car’s position relative to the house. If you use Bunker Lake Boulevard or another main road to explain the location, include the remaining turns and actual driveway rather than only a nearby intersection.',
      'At a shared driveway or managed property, ask who can approve truck access and where loading is permitted. Inside a garage, report the opening height, vehicle orientation, and anything blocking the exit. Address-level availability and the loading plan are confirmed before scheduling; do not move an unsafe vehicle onto a street or neighboring property for convenience.',
    ],
    details: [
      'Describe the current condition, not only the last repair.',
      'Remove stored belongings before pickup.',
      'Resolve title and lien questions before scheduling.',
    ],
    question: 'Should I replace the battery before selling my Andover car?',
    answer:
      'You can ask for an offer with the battery in its current condition. Tell us whether keys are available and whether the vehicle rolls and steers; decide about spending money only after comparing your options.',
    secondQuestion: 'What if my Andover spare car is inside a crowded garage?',
    secondAnswer:
      'Describe the garage opening, where the car faces, any obstructions, and whether the wheels and steering move. Send safe access photos and wait for a reviewed pickup plan before trying to reposition a disabled car.',
    nearby: ['ham-lake', 'anoka', 'ramsey', 'coon-rapids'],
  }),
  makeArea({
    slug: 'champlin',
    city: 'Champlin',
    description:
      'Plan a Champlin junk-car sale around shared-driveway access, keys, and documents. Merritt’s reviews the actual vehicle and complete removal terms before scheduling.',
    intro:
      'Sell an unwanted vehicle in Champlin with a clear plan for the offer, documents and pickup. Call or text Merritt’s before arranging any separate transportation.',
    heading: 'Keep a shared driveway accessible for the agreed pickup',
    paragraphs: [
      'If the Champlin vehicle is blocked by another car, a trailer or a locked gate, include that in the first message. Explain which entrance leads to it and whether the vehicle can roll and steer. The postal address alone may not identify a usable loading approach.',
      'Arrange permission with the person controlling shared access before agreeing on a pickup window. A neighbor or property manager should not be surprised by a truck needing room to load. Do not promise that another person’s vehicle will be moved until you have coordinated it with them.',
      'Confirm the payment arrangements and any removal charges along with the vehicle offer. Have the agreed documents ready and keep people and pets away from the loading area. A direct conversation beforehand helps avoid an appointment that fails because keys, signatures or access are unavailable.',
    ],
    secondHeading: 'Give the Champlin address rather than a river-crossing landmark',
    secondParagraphs: [
      'Champlin and Anoka sit across the Mississippi River from one another, so a reference to the Highway 169 crossing is not a substitute for the vehicle’s street address. Identify the correct driveway or parking entrance on the Champlin property. This is especially helpful when another person is coordinating the sale from somewhere else.',
      'If the car is in a garage or close to neighboring property, share its orientation and the space available around it. Report flat tires, missing keys, or locked steering separately from the engine problem. Address-level availability and suitable loading access are confirmed before scheduling, and changes to the vehicle’s position should be discussed before the appointment.',
    ],
    details: [
      'Show the actual loading approach.',
      'Coordinate blocked or shared access with its owner.',
      'Have keys and agreed documents ready together.',
    ],
    question: 'Can you load a Champlin car from a narrow driveway?',
    answer:
      'Share photographs and describe width, turns, obstructions and wheel condition. We review the approach before confirming whether a suitable pickup can be arranged.',
    secondQuestion: 'Why do you need the complete Champlin address before discussing pickup?',
    secondAnswer:
      'The address identifies the correct property, while driveway and garage details establish the usable loading approach. A nearby bridge or intersection may place the vehicle on the wrong side of the river or in a different lot.',
    nearby: ['anoka', 'brooklyn-park', 'dayton', 'ramsey'],
  }),
  makeArea({
    slug: 'columbia-heights',
    city: 'Columbia Heights',
    description:
      'Selling a Columbia Heights car behind a house or in a garage? Review alley access, clearance, locked steering, and ownership details with Merritt’s.',
    intro:
      'Merritt’s reviews unwanted vehicles in Columbia Heights. Send the year, make, model and known condition, then discuss a cash offer and pickup directly.',
    heading: 'Distinguish the street address from the garage entrance',
    paragraphs: [
      'For a car behind a home or inside a garage in Columbia Heights, identify the entrance that actually reaches the vehicle. Describe an alley approach, low door, tight turn or incline when one applies. A safe photo of the entrance can communicate more than a photo of the front of the house.',
      'If steering is locked or a tire is flat, mention it before scheduling. Do not roll a disabled car into a street or alley simply to make room. Loading equipment and access need to be considered together, especially when the vehicle is not facing the garage exit.',
      'Ownership, keys and site access are reviewed separately. Explain whether the title is available and whether the person arranging pickup can authorize the sale. Agree on the amount payable and any removal cost before making the property available for the appointment.',
    ],
    secondHeading: 'Plan around the actual Columbia Heights parking setting',
    secondParagraphs: [
      'A property near Central Avenue or University Avenue may hold the vehicle behind the building rather than at the front address. Explain whether access comes from a side street, driveway, or alley, and identify any shared approach. Do not assume that space along a busy road can be used as the loading area for a disabled vehicle.',
      'For an apartment or business lot, ask the responsible person about entry, loading permission, and any required check-in. Tell us about an existing storage or parking deadline during the first conversation. We confirm address-level availability, vehicle acceptance, and a pickup window before you should promise the space will be cleared or arrange someone else’s schedule around the appointment.',
    ],
    details: [
      'Identify the garage or alley entrance.',
      'Describe vehicle orientation and locked steering.',
      'Keep the public approach clear while awaiting the driver.',
    ],
    question: 'Do I need to move a Columbia Heights car out of its garage?',
    answer:
      'Describe its current position first. Do not move it into traffic or attempt improvised towing; the pickup plan depends on the garage, vehicle and available equipment.',
    secondQuestion: 'Can I inquire about a Columbia Heights car in a shared parking lot?',
    secondAnswer:
      'Yes. Send the exact parking location, the usable lot entrance, and the person who authorizes access. Disclose any deadline early and wait for confirmed availability and pickup terms before promising removal.',
    nearby: ['fridley', 'new-brighton', 'minneapolis', 'brooklyn-center'],
  }),
  makeArea({
    slug: 'crystal',
    city: 'Crystal',
    description:
      'A Crystal parking deadline needs a confirmed pickup plan. Discuss your vehicle, property-manager access, title, and net offer directly with Merritt’s.',
    intro:
      'Have a car taking up a space in Crystal? Call or text Merritt’s about its condition, ownership paperwork and pickup location to discuss a sale.',
    heading: 'A parking-space deadline is a scheduling detail, not a dispatch order',
    paragraphs: [
      'If a Crystal vehicle needs to leave an apartment, business or other shared lot, tell us the deadline when you first contact us. Identify who controls access, where the car is parked, and whether another vehicle or gate blocks it. A message requesting pickup does not establish a booked appointment.',
      'Ask the property manager how a truck can enter and where loading is permitted. Share any clearance or check-in requirement before accepting a pickup window. Property permission and permission to sell the car are different matters, so have the ownership information available too.',
      'Compare offers with the complete removal arrangement included. Ask about any charge, the payment method and what could change the amount if the car differs from its description. Once you accept, remove your belongings and arrange for keys and documents to be available when needed.',
    ],
    secondHeading: 'Review a Crystal vehicle in its present condition',
    secondParagraphs: [
      'Whether your Crystal car is at a home or a managed property near the Highway 81 corridor, use its actual storage address rather than a convenient nearby meeting point. Moving it first can create another towing bill or leave it somewhere without permission. The initial review can begin with photos and a description from its current safe position.',
      'Separate a dead battery from a vehicle that cannot roll, steer, or release its transmission. Also disclose collision damage, missing wheels, and major components removed during repair. Locate the title and explain any lien or another named owner before accepting terms. Physical loading access does not settle ownership questions, and both need attention before the appointment is agreed.',
    ],
    details: [
      'Mention the property’s deadline during the first call.',
      'Coordinate loading access with management.',
      'Wait for an agreed pickup window before promising removal.',
    ],
    question: 'Can you guarantee pickup before my Crystal parking deadline?',
    answer:
      'We review the vehicle, access and available schedule before confirming a window. Tell us the deadline early; do not assume same-day dispatch from an inquiry.',
    secondQuestion: 'Should I move my Crystal car to another lot while waiting for an offer?',
    secondAnswer:
      'Describe its current location first. A separate move may create expense and requires property permission. We review the actual vehicle, address, and access before confirming whether pickup can be arranged.',
    nearby: ['new-hope', 'robbinsdale', 'brooklyn-center', 'plymouth'],
  }),
  makeArea({
    slug: 'new-hope',
    city: 'New Hope',
    description:
      'Discuss a damaged New Hope car with Merritt’s, including wheel or suspension damage, removed parts, ownership authority, and shop-release requirements.',
    intro:
      'Discuss selling a damaged or unused vehicle in New Hope with Merritt’s. You can ask about the vehicle in its present condition before spending money on repairs.',
    heading: 'Describe collision damage that affects loading',
    paragraphs: [
      'When requesting an offer for a New Hope vehicle with collision damage, tell us about the wheels, suspension and steering as well as visible body damage. A car may start but still be unsuitable to drive or roll. Current photos from a safe distance help explain the condition without moving it.',
      'Mention leaking fluids, loose body panels or parts removed by a shop. Do not handle leaking materials or crawl beneath the vehicle to investigate. If the car is at a repair facility, arrange release with the shop before a buyer’s pickup appointment.',
      'Disclose any insurer or lender involvement and confirm your authority to sell before accepting terms. We discuss the vehicle, documents, any removal charge and the pickup window directly. Keep the accepted agreement and completed transaction records privately after the sale.',
    ],
    secondHeading: 'Give the usable entrance for a New Hope pickup',
    secondParagraphs: [
      'If a vehicle is at a property reached from 42nd Avenue or Bass Lake Road, provide the exact address and the driveway or business entrance that leads to it. A commercial lot can have separate customer, service, and storage areas. Identify the car’s current position and who can authorize access to that part of the property.',
      'For a damaged vehicle at home, describe whether it is in a garage, on a slope, or blocked by another car. Give clearance information and photographs of the approach when safe. Address-level availability and a suitable loading arrangement are confirmed before scheduling. Keep a collision-damaged vehicle secured where it is rather than trying to test whether it can be driven.',
    ],
    details: [
      'Describe damaged wheels, suspension and steering.',
      'Disclose removed parts and insurer or lender involvement.',
      'Arrange shop release before the loading appointment.',
    ],
    question: 'Can I sell a collision-damaged car in New Hope that still starts?',
    answer:
      'You can ask for a review, but do not assume it is safe to drive. Explain the damage and loading access along with the ownership and insurance situation.',
    secondQuestion: 'What access details matter for a New Hope vehicle with a damaged wheel?',
    secondAnswer:
      'Explain which wheel is damaged, the parking surface, slopes, garage clearance, and the route to the vehicle. Photos can help the review, but do not crawl underneath it or move it to demonstrate the damage.',
    nearby: ['crystal', 'plymouth', 'robbinsdale', 'maple-grove'],
  }),
  makeArea({
    slug: 'robbinsdale',
    city: 'Robbinsdale',
    description:
      'Missing keys or title for a Robbinsdale junk car? Discuss those issues separately with Merritt’s and review garage or alley access before arranging a sale.',
    intro:
      'Contact Merritt’s about a junk car in Robbinsdale. Share where it sits and what is wrong, and we will discuss a cash offer and suitable pickup arrangements.',
    heading: 'Prepare keys and documents for a car that has sat unused',
    paragraphs: [
      'Before scheduling removal of a Robbinsdale car, separate the paperwork question from the key question. A missing key can affect door access, steering and loading; a missing title affects ownership documentation. Tell us about both rather than discovering either issue when the truck arrives.',
      'Check the actual parking setting, including a garage exit, alley entrance or vehicle blocking the approach. Report whether every wheel is present and whether the car rolls, if you already know. There is no need to test movement on a slope or enter an unsafe space to answer.',
      'A review can begin with the year, make, model, condition and location. We then discuss what is needed to move forward, the amount payable after any removal charge, and a pickup window. Arrange signatures, keys and property access before the agreed time and remove personal items beforehand.',
    ],
    secondHeading: 'Make the Robbinsdale approach clear before the handoff',
    secondParagraphs: [
      'A Robbinsdale street address may point to the front of a home while the car sits behind it or in a detached garage. Identify the driveway or alley entrance and any tight turn. If you describe the property using Broadway Avenue or 42nd Avenue, include the final approach instead of treating a main-road landmark as a loading location.',
      'At a shared lot or driveway, coordinate permission with the person controlling access and explain when the area is available. A helper may be able to open a garage without being authorized to sell the vehicle. Confirm those roles, address-level availability, and the appointment contact before scheduling; keep belongings and private paperwork out of the car once the transaction plan is settled.',
    ],
    details: [
      'Discuss missing keys and missing documents separately.',
      'Describe wheel condition without unsafe testing.',
      'Coordinate the garage or alley entrance before dispatch.',
    ],
    question: 'What comes first when the Robbinsdale car’s title is missing?',
    answer:
      'Tell us the situation and ask DVS or a deputy registrar about the ownership record and replacement process. Do not assume possession of the car or its keys is enough to complete the sale.',
    secondQuestion: 'Can a neighbor open the garage for my Robbinsdale pickup?',
    secondAnswer:
      'Discuss that arrangement before scheduling. Property access, key handoff, ownership authority, and required documents are separate matters, and all must be agreed before anyone assumes a helper can complete the handoff.',
    nearby: ['minneapolis', 'brooklyn-center', 'crystal', 'new-hope'],
  }),
  makeArea({
    slug: 'fridley',
    city: 'Fridley',
    description:
      'Arrange a Fridley vehicle-sale inquiry with clear business-lot access, ownership authority, keys, and release hours. Review the complete offer with Merritt’s.',
    intro:
      'Sell an unwanted vehicle in Fridley without guessing what the pickup will involve. Merritt’s reviews the car, documents and access before confirming the terms.',
    heading: 'Coordinate a vehicle kept at a workplace or business lot',
    paragraphs: [
      'For a Fridley vehicle at a workplace or business, identify the correct lot entrance and where the keys are kept. Tell us whether there is a sign-in procedure, loading restriction or gate. Share sensitive access details privately only when needed for an agreed appointment.',
      'Confirm who owns the vehicle and who has authority to approve its sale. A business-owned car or one stored for another person can involve additional paperwork. The person granting access to a lot does not automatically have permission to sell everything parked there.',
      'Explain the condition, including removed components, flat tires or locked wheels, and compare the complete offer before accepting. Coordinate business access hours with the pickup window rather than assuming the truck can collect a vehicle from a closed property. Keep the responsible contact reachable during the handoff.',
    ],
    secondHeading: 'Identify the Fridley entrance that actually reaches the car',
    secondParagraphs: [
      'For a property near University Avenue, East River Road, or Interstate 694, give the actual street address and usable driveway. A workplace may have several entrances that do not connect to the storage lot. Explain the route to the vehicle and any clearance or gate restriction before discussing a pickup window with the buyer.',
      'For a vehicle parked at home, report a garage position, slope, flat tires, or missing keys just as you would for a business pickup. A car that starts may still have steering or suspension damage that affects loading. Address-level availability and suitable access are confirmed before scheduling, so do not move an unsafe vehicle onto a public roadway to meet a truck.',
    ],
    details: [
      'Identify the lot entrance and release contact.',
      'Confirm authority for business-owned vehicles.',
      'Coordinate access hours and the pickup window.',
    ],
    question: 'Can a coworker release my Fridley vehicle?',
    answer:
      'Discuss the arrangement first. Property access, keys, identification and required signatures must be addressed separately; a coworker’s presence alone does not establish sale authorization.',
    secondQuestion: 'What if my Fridley car is in a gated business storage area?',
    secondAnswer:
      'Provide the address, authorized entrance, release contact, and available hours. Share gate details privately when an appointment is agreed. We confirm the vehicle, documents, and access plan before arranging pickup.',
    nearby: ['columbia-heights', 'new-brighton', 'coon-rapids', 'brooklyn-center'],
  }),
  makeArea({
    slug: 'new-brighton',
    city: 'New Brighton',
    description:
      'Resolve ownership questions for a New Brighton vehicle and plan garage or managed-lot access. Contact Merritt’s to review the condition and complete pickup terms.',
    intro:
      'Merritt’s considers unwanted cars, vans, trucks and SUVs in New Brighton. Call or text with the vehicle details and review both the offer and pickup requirements.',
    heading: 'Resolve title and registration questions before a pickup deadline',
    paragraphs: [
      'A New Brighton vehicle can be ready to load while its ownership documents still need attention. Check the names on the title, disclose a lender’s interest and explain whether the title is missing. Do not sign blank documents or assume a registration card replaces an existing title.',
      'New Brighton’s municipal License Bureau publishes vehicle-sale and specialty-plate guidance. Use its official information or Minnesota DVS for the paperwork process, while Merritt’s confirms its own transaction requirements. Reporting a sale and completing a title transfer are not interchangeable tasks.',
      'Once documents and authority are clear, coordinate access to the vehicle. Explain garages, ramps, gates and wheel condition before scheduling. Compare the amount payable, any pickup charge and payment timing before accepting an offer, and keep copies of completed transaction records.',
    ],
    secondHeading: 'Locate the New Brighton vehicle beyond the freeway landmark',
    secondParagraphs: [
      'Near the Interstate 35W and Interstate 694 corridors, a business or apartment can have an address on one road and a usable parking entrance on another. Give the car’s physical storage address and describe that final entrance. Do not move a disabled vehicle onto a ramp, shoulder, or public roadside space for an appointment.',
      'For an enclosed garage, share its posted clearance, the route to the car, and whether the wheels and steering move. At a managed lot, identify the person authorizing loading and any access hours. Address-level availability and a suitable pickup plan are confirmed before scheduling, so discuss a removal deadline early rather than assuming the paperwork conversation also reserves a truck.',
    ],
    details: [
      'Check the owner names and any lien.',
      'Use official licensing resources for document questions.',
      'Coordinate access only after the transaction requirements are clear.',
    ],
    question: 'Where can I ask about vehicle paperwork in New Brighton?',
    answer:
      'The city’s License Bureau and Minnesota DVS publish vehicle transaction guidance. Confirm current services and requirements directly with the office; Merritt’s is a separate vehicle buyer, not a licensing agency.',
    secondQuestion: 'What should I send for a New Brighton car in a parking garage?',
    secondAnswer:
      'Send the garage clearance, entrance route, parking position, wheel and steering condition, and the person who can authorize access. Vehicle condition, ownership, and the loading setting are reviewed before pickup is confirmed.',
    nearby: ['roseville', 'fridley', 'columbia-heights', 'st-paul'],
  }),
  makeArea({
    slug: 'osseo',
    city: 'Osseo',
    description:
      'Contact Merritt’s about an Osseo car at its actual storage address. Review shared-driveway access, missing parts, payment, and any pickup charges before agreeing.',
    intro:
      'Have an unwanted car in Osseo? Start with a call or text to Merritt’s. We review the condition and parking setting before discussing an offer and pickup.',
    heading: 'Use the vehicle location rather than an approximate meeting point',
    paragraphs: [
      'For an Osseo pickup, give the place where the vehicle is stored rather than proposing a nearby parking lot as a meeting point. Moving a disabled car can create extra expense or unsafe conditions. The offer and loading plan should be based on its present position.',
      'Tell us if the car is behind a building, blocked by another vehicle or accessed through a shared drive. A photo of the approach can clarify a narrow turn or garage entrance. Coordinate access with the property owner and keep private codes out of public photos.',
      'Share current damage, missing parts, key status and the ownership documents you have. We discuss what you would receive after any agreed pickup charge and how payment will be handled. Do not remove components or relocate the car after accepting the terms without checking with the buyer.',
    ],
    secondHeading: 'Clarify the Osseo property and access contact',
    secondParagraphs: [
      'Because Osseo is closely surrounded by neighboring metro communities, provide the complete physical address instead of only the city name or a reference to Highway 81. Confirm where the car is parked now, especially when a family member is requesting the offer. The pickup plan needs to match the vehicle’s actual location rather than the owner’s mailing address.',
      'At a small business or shared parking area, ask who approves truck entry and whether loading must happen during certain hours. Inside a garage, report the door height, vehicle orientation, and obstructions. Address-level availability and loading access are confirmed before scheduling; arrange the legal seller, key holder, and property contact together once the complete terms are accepted.',
    ],
    details: [
      'Provide the actual storage address.',
      'Describe shared or blocked access.',
      'Keep vehicle condition consistent with the agreed offer.',
    ],
    question: 'Should I take my Osseo car to a public lot to meet you?',
    answer:
      'No separate move is needed to request an offer. Describe its current location and let us review a suitable pickup arrangement before moving an unsafe or disabled vehicle.',
    secondQuestion: 'What if my mailing address says Osseo but the car is stored elsewhere?',
    secondAnswer:
      'Use the address where the vehicle is physically parked. Explain any difference from the mailing address so we review the correct property, access conditions, and availability before agreeing to a pickup window.',
    nearby: ['maple-grove', 'brooklyn-park', 'champlin'],
  }),
  makeArea({
    slug: 'dayton',
    city: 'Dayton',
    description:
      'A Dayton junk car behind an outbuilding needs a clear loading route. Review entrances, ground conditions, ownership, and the amount payable with Merritt’s.',
    intro:
      'Discuss selling an unwanted vehicle in Dayton with Merritt’s. Include the condition, actual pickup address and access details so the offer reflects the complete job.',
    heading: 'Check access when a mailing address covers more than one entrance',
    paragraphs: [
      'When a Dayton property has multiple entrances, an outbuilding or a car stored away from the main drive, explain which approach reaches the vehicle. Tell us about gates, overhead obstacles, slopes and the ground surface. The driver needs the loading route, not only the nearest street.',
      'If the car cannot roll or steer, share that before scheduling. Do not release brakes, jack up the vehicle or attempt to drag it into a more visible position. Safe photographs and a clear account of what is blocked help the operator review appropriate equipment.',
      'Confirm the title and key situation, the amount you would receive and any pickup charges in the same discussion. A property cleanout deadline should be raised at the start, but the appointment is agreed only after the vehicle and access have been reviewed.',
    ],
    secondHeading: 'Plan for Dayton’s river-area and residential locations',
    secondParagraphs: [
      'Dayton includes properties near the Mississippi and Crow rivers as well as developing residential neighborhoods. A river landmark or nearby bridge does not identify a usable truck entrance. Supply the full street address and explain which drive reaches the vehicle, particularly when a property has a separate entrance for a garage, storage area, or business use.',
      'For a car in a newer neighborhood, mention a short driveway, shared access, or a garage exit blocked by another vehicle. For longer private drives, report surface softness and turning restrictions. Address-level availability is confirmed before scheduling, and any person controlling access should be part of the plan before you promise that a cleanout or parking space will be finished.',
    ],
    details: [
      'Identify the correct entrance and approach.',
      'Describe surface, slopes and obstructions.',
      'Raise any property-cleanout deadline early.',
    ],
    question: 'Can you review a Dayton car stored behind an outbuilding?',
    answer:
      'Yes, you can ask. Describe access and condition from a safe position. We confirm whether suitable removal can be arranged before scheduling.',
    secondQuestion: 'What information helps with a Dayton vehicle near a river-area property?',
    secondAnswer:
      'Give the full street address, usable entrance, driveway surface, and final route to the car. Describe slopes, gates, and turning space rather than relying on a bridge or river landmark alone.',
    nearby: ['champlin', 'rogers', 'brooklyn-park', 'ramsey'],
  }),
  makeArea({
    slug: 'elk-river',
    city: 'Elk River',
    description:
      'Compare an Elk River junk-car offer using the actual pickup address, missing components, documents, and removal costs. Discuss the complete arrangement with Merritt’s.',
    intro:
      'Contact Merritt’s about an unwanted vehicle in Elk River. A vehicle-specific review covers the car’s condition, paperwork, loading access and pickup terms.',
    heading: 'Compare the complete offer for a surrounding-community pickup',
    paragraphs: [
      'For an Elk River car, include the exact storage location and approach before comparing offers. A price quoted without the pickup address may not account for the same work as one based on a known driveway or garage. Ask each buyer what removal costs, if any, are included.',
      'Describe completeness and whether all wheels are present. Missing engines, transmissions or steering components can affect both value and loading. Do not dismantle the vehicle after agreeing on an offer unless the buyer has reviewed the change.',
      'Keep the document discussion separate from physical access. A title held by a lender or issued to another owner needs attention before release, even if loading is straightforward. Once the terms are accepted, coordinate the responsible contact, keys and agreed documents with the pickup window.',
    ],
    secondHeading: 'Pinpoint the Elk River vehicle beyond a highway reference',
    secondParagraphs: [
      'Highway 169 and Highway 10 help describe Elk River, but a vehicle may be on a neighborhood drive, at a repair shop, or farther from those corridors. Provide the exact physical address and authorized entrance. Address-level availability is confirmed before scheduling, including properties outside the city that use an Elk River mailing address.',
      'For a business-held vehicle, identify release hours, keys, and who approves collection. At a larger residential property, describe the final driveway, ground surface, and turning room. If the car is behind another vehicle or inside a low garage, send current photos of that setting. Do not relocate a disabled car to a roadside meeting point while the request is reviewed.',
    ],
    details: [
      'Compare offers using the same pickup address.',
      'Disclose missing mechanical components.',
      'Ask about removal charges and payment timing.',
    ],
    question: 'Does the pickup location affect an Elk River offer?',
    answer:
      'Location and loading access are part of the review. Ask for the amount you would receive after any agreed charges rather than comparing headline amounts alone.',
    secondQuestion:
      'Can I ask about a vehicle outside Elk River with an Elk River mailing address?',
    secondAnswer:
      'Yes. Send the actual street address, vehicle details, and approach information. Address-level availability and suitable loading access must be confirmed before an appointment is scheduled.',
    nearby: ['otsego', 'ramsey', 'rogers', 'monticello'],
  }),
  makeArea({
    slug: 'otsego',
    city: 'Otsego',
    description:
      'Plan an Otsego vehicle sale when the owner, keys, and property access are in different hands. Confirm documents and pickup terms directly with Merritt’s.',
    intro:
      'Merritt’s reviews unwanted vehicles in Otsego for purchase and removal. Call or text the year, make, model, condition and where the vehicle is parked.',
    heading: 'Arrange a handoff without assuming an unattended pickup',
    paragraphs: [
      'If your Otsego vehicle is stored at a property where you will not be present, discuss that before an appointment. Signatures, identification, key handoff and authority to sell still need to be arranged. Leaving keys inside the car is not a substitute for an agreed transaction.',
      'Tell us who can authorize access and whether a gate or another vehicle blocks the approach. Explain the surface, wheel condition and whether the vehicle can steer. Share gate codes privately only when needed rather than including them in photographs or public messages.',
      'Confirm the offer, any removal charge, payment arrangements and pickup contact together. Remove belongings before the window and notify us if the car’s location or condition changes. An accurate plan reduces the chance of a truck arriving when essential documents or property access are unavailable.',
    ],
    secondHeading: 'Use the Otsego storage location rather than a nearby city name',
    secondParagraphs: [
      'Otsego lies across the Mississippi River from Elk River, and general references to the area can leave the final location unclear. Give the full street address where the car is parked and the entrance a truck may use. A nearby bridge or shopping-area landmark should supplement those directions rather than replace the physical pickup address.',
      'Describe whether the vehicle is in a neighborhood garage, at a business, or on a larger property with a private drive. Mention ramps, gates, narrow turns, soft surfaces, and parking restrictions. Address-level availability and the loading plan are confirmed before scheduling. If another person will provide access, make sure they know the agreed window and can be reached during it.',
    ],
    details: [
      'Discuss who must be present before scheduling.',
      'Arrange keys, documents and access separately.',
      'Keep the pickup contact available.',
    ],
    question: 'Can I leave keys for an Otsego pickup while I am away?',
    answer:
      'Only after the required transaction and access arrangements are confirmed. Do not assume unattended collection is approved or leave ownership documents unsecured in the vehicle.',
    secondQuestion: 'Why should I specify Otsego rather than saying the vehicle is near Elk River?',
    secondAnswer:
      'The communities are on different sides of the river, and a general landmark can point to the wrong approach. The actual address and usable entrance allow the correct property and loading route to be reviewed.',
    nearby: ['elk-river', 'rogers', 'albertville', 'monticello'],
  }),
  makeArea({
    slug: 'monticello',
    city: 'Monticello',
    description:
      'Selling a long-stored Monticello car? Review current wheel condition, seasonal driveway access, documents, and address-level pickup availability with Merritt’s.',
    intro:
      'Sell an unwanted vehicle in Monticello with the location and pickup terms included in the conversation. Merritt’s can review the car before you decide what to do next.',
    heading: 'Plan removal of a vehicle that has been stored for a season',
    paragraphs: [
      'For a Monticello car parked for a long period, report what has changed since it last ran. Tires may be flat, wheels may not move and parts may have been removed. Current photos and known symptoms are more helpful than assuming its old condition still applies.',
      'Describe any garage, gate, surface or slope affecting access. Seasonal ground conditions and a blocked approach should be raised before scheduling. Do not attempt a jump-start, fluid handling or improvised towing if the vehicle is unsafe; a review can begin from its current condition.',
      'Locate ownership documents early and explain any lender or previous-owner issue. Ask about the complete offer and any removal charge for the actual address. Once accepted, agree on the pickup window and arrange for the keys, authorized person and property access to be available.',
    ],
    secondHeading: 'Distinguish the Monticello address from surrounding properties',
    secondParagraphs: [
      'For a vehicle near Interstate 94 or Highway 25, identify the actual driveway or business entrance that reaches it. A Monticello mailing address may also describe a property outside the compact city streets. Send the complete physical address and location photos; address-level availability is confirmed before scheduling because the route and loading setting need individual review.',
      'If a seasonal property or family cleanout is involved, identify both the legal seller and the person who can provide access. Avoid making a special trip or leaving keys outside before the arrangement is confirmed. Discuss any estate, lien, or owner-name issue early, and agree on the documents, handoff, and pickup terms before arranging other work around the appointment.',
    ],
    details: [
      'Describe the current condition after storage.',
      'Mention seasonal access problems.',
      'Confirm the exact address and net offer.',
    ],
    question: 'Does a long-stored Monticello car need to run before pickup?',
    answer:
      'A non-running vehicle can be reviewed. Tell us about wheels, steering, completeness and access so we can determine whether a suitable loading plan is available.',
    secondQuestion: 'Should I travel to a Monticello storage property before pickup is confirmed?',
    secondAnswer:
      'Start by sending accurate vehicle, document, and address details. Wait until availability, access, the purchase terms, and a pickup window are agreed before arranging travel specifically to meet a driver.',
    nearby: ['buffalo', 'albertville', 'st-michael', 'elk-river'],
  }),
  makeArea({
    slug: 'st-michael',
    city: 'St. Michael',
    description:
      'Before removing parts from a St. Michael car, review its current condition, shop release, loading access, and complete offer with Merritt’s Auto Recycling.',
    intro:
      'Discuss selling a car, van, truck or SUV in St. Michael with Merritt’s. Start with its condition and pickup setting, then compare the full offer before accepting.',
    heading: 'Keep a sale consistent when parts or repairs are being considered',
    paragraphs: [
      'Before removing parts from your St. Michael vehicle, compare an offer for the car as it stands with the effort and expense of dismantling it. Missing wheels or drivetrain components can make loading more difficult. A higher separate part price does not automatically improve the total result.',
      'If a shop has already removed components, list them and explain where they are stored. Tell us whether the car rolls and steers and whether it remains on a lift, in a garage or in an accessible lot. The loading arrangement must reflect the actual setting.',
      'After accepting an offer, tell the buyer before changing the car’s condition or location. Confirm any pickup charges, required documents and payment arrangements together. Coordinate access with the property holder and remove belongings before the agreed pickup window.',
    ],
    secondHeading: 'Identify the St. Michael property and actual loading position',
    secondParagraphs: [
      'A reference to Interstate 94 or Highway 241 helps locate the St. Michael area, but the pickup operator needs the vehicle’s precise street address and entrance. Explain whether it is at a home, shop, or workplace. A car in a repair bay, behind a business, or inside a garage can require different release and loading arrangements.',
      'Give the clearance and approach details before scheduling, including any gate, shared drive, slope, or vehicle blocking the exit. At a business, coordinate the responsible person and opening hours. Address-level availability and suitable loading access are confirmed with the vehicle review, so do not move or further dismantle the car while relying on an offer based on its earlier condition.',
    ],
    details: [
      'List removed parts before asking for an offer.',
      'Do not alter the agreed vehicle condition without checking.',
      'Coordinate shop or property release in advance.',
    ],
    question: 'Should I sell parts from my St. Michael car before selling the rest?',
    answer:
      'Compare the actual offers, effort, loading implications and disposal costs first. Merritt’s can review the complete vehicle or the condition you accurately describe; removing parts may change the offer.',
    secondQuestion: 'What if my St. Michael car is still on a repair-shop lift?',
    secondAnswer:
      'Tell us its exact position and what parts are removed. Ask the shop about release and loading access, then discuss the actual setup before assuming a pickup truck can collect it during a proposed window.',
    nearby: ['albertville', 'rogers', 'buffalo', 'monticello'],
  }),
  makeArea({
    slug: 'albertville',
    city: 'Albertville',
    description:
      'Coordinate an Albertville vehicle sale with the titled owner, key holder, and property contact. Review current photos and the complete pickup offer with Merritt’s.',
    intro:
      'Merritt’s serves Albertville vehicle owners looking to sell an unwanted car. Call or text for a vehicle-specific discussion of price, documents and removal.',
    heading: 'Coordinate a pickup when more than one person is involved',
    paragraphs: [
      'For an Albertville car used by a family member or stored at someone else’s home, identify the titled owner and the person controlling property access. The person requesting an offer may need someone else to provide signatures or keys. Sort out those roles before committing to a pickup date.',
      'Describe the current condition directly, including damage, missing parts and whether the wheels and steering move. When another person supplies the photographs, make sure they show the current car and its actual loading approach rather than an older location.',
      'Ask what would be paid after any removal charge, how payment is handled and which documents must be ready. Coordinate everyone’s availability with the pickup window. An inquiry is a chance to compare options; you decide whether to proceed when the vehicle and transaction details are clear.',
    ],
    secondHeading: 'Make an Albertville business or home pickup specific',
    secondParagraphs: [
      'For a vehicle near Interstate 94 or an Albertville shopping or business area, give the actual storage address and authorized lot entrance. Do not choose a public or store parking area as a meeting place without permission. A purchase inquiry can start from the car’s existing location, so a separate move is not needed merely to request a review.',
      'If the vehicle is at a family member’s home, describe its garage or driveway position and any vehicle blocking access. For a commercial property, identify loading restrictions and business hours. Address-level availability and a suitable loading plan are confirmed before scheduling. Share a parking or storage deadline early and wait for an agreed window before promising another person that the space will be cleared.',
    ],
    details: [
      'Identify the owner, key holder and access contact.',
      'Use current photographs from the actual location.',
      'Coordinate required signatures with the appointment.',
    ],
    question: 'Can I arrange the sale of a family member’s Albertville car?',
    answer:
      'You can ask about the process, but authority to sell and required owner participation must be established. Explain the ownership situation before any pickup is arranged.',
    secondQuestion: 'Can I move my Albertville car to a store lot for collection?',
    secondAnswer:
      'Describe its current storage location first. A store or other property must authorize parking and loading, and moving a disabled car can create extra expense. We review the existing address and access before discussing pickup.',
    nearby: ['st-michael', 'otsego', 'rogers', 'monticello'],
  }),
];
