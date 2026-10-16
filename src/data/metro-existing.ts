// The directory includes the approved metro list and restored historical communities.
// These are pickup areas, not additional business locations. Confirm each job directly.
import cityDirectory from './city-directory.json' with { type: 'json' };
export const coverageRegions = cityDirectory.map((region) => ({
  name: region.name,
  cities: region.cities.map((place) => place.city),
}));

export const coverageCities = [...new Set(coverageRegions.flatMap((region) => [...region.cities]))];
export const areaServedSchema = coverageCities.map((city) => ({
  '@type': 'City',
  name: `${city === 'St. Paul' ? 'Saint Paul' : city}, Minnesota`,
}));

export type ServiceArea = {
  slug: string;
  city: string;
  title: string;
  description: string;
  intro: string;
  proof: string;
  details: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
  nearby: string[];
  updated: string;
};

type AreaInput = {
  slug: string;
  city: string;
  description: string;
  intro: string;
  focus: string;
  paragraphs: string[];
  secondFocus: string;
  secondParagraphs: string[];
  details: string[];
  question: string;
  answer: string;
  secondQuestion: string;
  secondAnswer: string;
  nearby: string[];
};

function area(input: AreaInput): ServiceArea {
  return {
    slug: input.slug,
    city: input.city,
    title: `Cash for junk cars in ${input.city}, MN`,
    description: input.description,
    intro: input.intro,
    proof:
      "Merritt's Auto Recycling is based in Brooklyn Center and has served vehicle owners since 1988. Call 763-533-2775 or text 763-438-2116 to discuss your vehicle.",
    details: input.details,
    sections: [
      { heading: input.focus, paragraphs: input.paragraphs },
      { heading: input.secondFocus, paragraphs: input.secondParagraphs },
    ],
    faqs: [
      { question: input.question, answer: input.answer },
      { question: input.secondQuestion, answer: input.secondAnswer },
    ],
    nearby: input.nearby,
    updated: '2026-10-16',
  };
}

export const serviceAreas: ServiceArea[] = [
  area({
    slug: 'brooklyn-center',
    city: 'Brooklyn Center',
    description:
      'Sell an unwanted Brooklyn Center vehicle to Merritt’s, established in 1988. Discuss a cash offer, documents, and pickup before arranging a visit.',
    intro:
      'Sell an unwanted vehicle to a business based right here in Brooklyn Center. Call or text the year, make, model, condition, and pickup location to discuss a cash offer.',
    focus: 'Start with the local team, not a trip with a disabled car',
    paragraphs: [
      'A vehicle does not need to be driven to the business address for an initial conversation. Describe where it is parked and whether it starts, rolls, and steers. This lets us discuss an appropriate pickup plan before you move anything.',
      'For a car stored at home, check for another vehicle blocking the approach, a locked garage, or a gate. For a vehicle at an apartment or business, identify the person who can authorize truck access. Tell us about any deadline before agreeing on a pickup window.',
      'Our business address is 3106 68th Ave N, Brooklyn Center, MN 55429. Call before arranging a visit or vehicle delivery. Pickup arrangements, vehicle acceptance, and any offer are confirmed directly with you.',
    ],
    details: [
      'Tell us whether you need pickup or are asking about delivery.',
      'Have the title and key status ready before scheduling.',
      'Do not drive an unsafe vehicle to obtain an offer.',
    ],
    secondFocus: 'Work through the sale with the business based in Brooklyn Center',
    secondParagraphs: [
      'A nearby vehicle still needs a clear description before we can discuss a purchase. Send its year, make, model, known faults, and current photos. Identify missing components, collision damage, and tires that will not hold air. If you are close to Highway 100 or I-694, finish your directions with the actual driveway or parking entrance rather than only naming the highway.',
      'Before accepting, ask how the vehicle’s condition affects the offer and whether any removal charge applies. Explain whose name is on the title, any recorded lien, and whether keys are available. We can then discuss the required documents, payment arrangements, and who should be present. Keep your belongings and personal paperwork separate from the vehicle until the agreed transaction is completed.',
    ],
    question: 'Should I bring the car to your Brooklyn Center address?',
    answer:
      'Call first. We can review the vehicle by phone or text and discuss pickup. Do not arrange an unconfirmed drop-off or drive an unsafe vehicle to the business.',
    secondQuestion: 'What should I send before discussing a Brooklyn Center cash offer?',
    secondAnswer:
      'Send the year, make, model, present condition, current photos, title and key status, and exact parking location. We will review those details and discuss the offer, any removal charges, and the documents needed before scheduling.',
    nearby: ['minneapolis', 'brooklyn-park', 'maple-grove'],
  }),
  area({
    slug: 'minneapolis',
    city: 'Minneapolis',
    description:
      'Sell an unwanted Minneapolis car with alley, garage, or shared-lot access reviewed first. Call Merritt’s about an offer, paperwork, and pickup arrangements.',
    intro:
      'Have an unwanted car in Minneapolis? Merritt’s buys vehicles for recycling and coordinates pickup after reviewing the car, ownership documents, and access.',
    focus: 'Minneapolis pickups: alleys, garages, and shared access',
    paragraphs: [
      'A Minneapolis pickup may start in a driveway, alley, garage, street space, or managed parking area. Explain which entrance reaches the vehicle rather than relying only on its mailing address. A photo of the approach can help explain a tight turn or an obstruction.',
      'For an underground garage or parking ramp, share the posted clearance and whether the vehicle can roll and steer. Do not push it onto a public street or attempt makeshift towing. The loading plan needs to fit the setting and the vehicle.',
      'If a property manager or another resident controls a gate or shared driveway, arrange authorization before the appointment. We will discuss the offer, any removal charges, and the pickup window together so you know what to expect.',
    ],
    details: [
      'Identify the driveway, alley, or garage entrance.',
      'Mention a ramp, gate, clearance limit, or blocked approach.',
      'Keep a way to reach you while the driver locates the vehicle.',
    ],
    secondFocus: 'Keep a disabled Minneapolis vehicle in its current safe position',
    secondParagraphs: [
      'When a Minneapolis car is parked at the curb, explain its location, surrounding traffic, and any signs that affect access. A residential street and an alley behind the same building may require different approaches. Share a deadline or parking concern at the start, but do not move the car into traffic, block an alley, or promise a collection time before we confirm the plan.',
      'For the offer discussion, describe both the mechanical fault and the vehicle’s completeness. A running engine does not establish that damaged wheels or steering will let the car move normally. Tell us about title and lien status separately from lost keys. Agree on payment, any removal charges, and required paperwork before the appointment, then remove belongings from the cabin, trunk, and storage compartments.',
    ],
    question: 'Can you pick up a non-running car from a Minneapolis garage?',
    answer:
      'Send the garage clearance, access details, and whether the wheels and steering move. We review the setting before confirming suitable equipment and a pickup plan.',
    secondQuestion: 'Can I ask about a Minneapolis car currently parked on the street?',
    secondAnswer:
      'Yes. Give the exact location, condition, surrounding access, and any parking deadline. We review whether suitable pickup can be arranged; do not move the disabled car or assume a requested collection time is confirmed.',
    nearby: ['brooklyn-center', 'plymouth', 'bloomington', 'st-paul'],
  }),
  area({
    slug: 'st-paul',
    city: 'St. Paul',
    description:
      'Discuss selling a non-running St. Paul vehicle where it sits. Merritt’s reviews slopes, shop release, ownership documents, and pickup terms with you.',
    intro:
      'Merritt’s serves St. Paul vehicle owners who want to sell an unwanted car, truck, van, or SUV. Discuss the vehicle and pickup setting by phone or text, without arranging a separate tow first.',
    focus: 'Selling a vehicle in Saint Paul without moving it first',
    paragraphs: [
      'Whether the vehicle is at your home, a repair shop, or a shared lot in Saint Paul, start with its present location. Tell us if it is behind a building or reached from a different street. Accurate access information is more useful than moving a disabled car for an appointment.',
      'If the vehicle is on an incline, has locked brakes, or is surrounded by other cars, describe that in the first message. Do not release brakes or reposition it yourself to test whether it moves. We need that information to review the loading arrangement.',
      'For a car waiting at a repair shop, confirm who authorizes release and whether the shop must be open when the truck arrives. Share any storage deadline, but wait for an agreed pickup window before telling the property that the vehicle will be removed.',
    ],
    details: [
      'Send the pickup address and the entrance the truck should use.',
      'Mention slopes, locked wheels, and parking restrictions.',
      'Coordinate keys and release authorization with the person holding the vehicle.',
    ],
    secondFocus: 'Bring repair-shop and ownership details into the same conversation',
    secondParagraphs: [
      'If a Saint Paul repair estimate changed your plans for the car, use the diagnosis you already have when contacting us. State what parts are still installed and whether the shop has disassembled anything. Ask the shop about key storage, its release process, and available loading hours. Any outstanding shop balance remains something to resolve with that business before an agreed pickup can proceed.',
      'Directions from I-94 or I-35E should end at the specific lot or driveway entrance, especially when the vehicle is behind a building. Arrange for an authorized contact to answer access questions during the confirmed window. Before accepting, clarify the amount offered, any removal charge, title and lien status, and documents required. A car being accessible on a property does not establish who can authorize its sale.',
    ],
    question: 'Do I need to tow my St. Paul car to Brooklyn Center first?',
    answer:
      'No separate tow is needed to ask about an offer. Call or text from wherever the vehicle is stored. We discuss whether pickup can be arranged and confirm its terms before scheduling.',
    secondQuestion: 'What if my St. Paul repair shop has already removed parts?',
    secondAnswer:
      'Describe what was removed, whether it is still available with the car, and how the vehicle can be loaded. Coordinate release and any balance with the shop. We review the vehicle as it stands before agreeing on an offer or pickup.',
    nearby: ['roseville', 'woodbury', 'eagan', 'minneapolis'],
  }),
  area({
    slug: 'brooklyn-park',
    city: 'Brooklyn Park',
    description:
      'Have a long-parked car in Brooklyn Park? Discuss its present condition, missing parts, ground access, and a cash offer with Merritt’s Auto Recycling.',
    intro:
      'Make room for what comes next. Contact Merritt’s about selling a car, truck, or SUV in Brooklyn Park, including a vehicle that has been sitting unused.',
    focus: 'Plan pickup for a car that has been parked for a while',
    paragraphs: [
      'A car that has been sitting may have a dead battery, flat tires, locked brakes, or belongings stored inside. Tell us what you already know. You do not need to spend money making it run just to have the first conversation.',
      'Describe whether the vehicle is on pavement, gravel, grass, or another surface. If it is behind a fence or other vehicles, explain the available approach. Avoid moving it onto soft ground or dismantling it while a pickup is being planned.',
      'Take out your belongings and arrange access to the keys and agreed documents before the confirmed appointment. For a shared lot, check who needs to authorize access and whether the truck has a suitable place to load.',
    ],
    details: [
      'Report flat tires or wheels that may not turn.',
      'Describe the parking surface and any fence or gate.',
      'Mention removed parts before discussing the offer.',
    ],
    secondFocus: 'Separate the vehicle from the things stored around it',
    secondParagraphs: [
      'A car beside a garage or behind a fence may have become a place to keep tools or household items. Explain what needs to be removed and whether belongings outside it block the approach. For a Brooklyn Park location near Highway 252 or Highway 169, identify the actual residential or business entrance. A map pin does not show a locked gate, a narrow side yard, or another car in the way.',
      'Use recent photos rather than pictures from when the vehicle was driven regularly. Tell us if the engine, transmission, battery, or wheels have been removed since then. If someone else is named on the title, explain their involvement before scheduling. We will discuss the vehicle’s accepted condition, payment, paperwork, and any removal charges together; let us know if the car changes after you agree to the offer.',
    ],
    question: 'Does my Brooklyn Park car need a working battery?',
    answer:
      'A dead battery does not prevent an initial review. Tell us whether you have keys, whether the vehicle rolls and steers, and where it is parked so we can assess pickup.',
    secondQuestion: 'Can I remove parts from my Brooklyn Park car after getting an offer?',
    secondAnswer:
      'Discuss any planned parts removal before accepting. An offer is based on the vehicle described, so removing a battery, wheels, or other components can change its review and loading requirements. Report any change before the appointment.',
    nearby: ['brooklyn-center', 'maple-grove', 'coon-rapids', 'anoka'],
  }),
  area({
    slug: 'maple-grove',
    city: 'Maple Grove',
    description:
      'Compare selling your Maple Grove car with another repair. Merritt’s reviews photos, mechanical condition, shop release, and the complete offer and pickup terms.',
    intro:
      'Sell an unwanted vehicle in Maple Grove without guessing its value from a generic price chart. Merritt’s reviews the actual vehicle and explains the offer and pickup options.',
    focus: 'From a driveway or repair-shop lot to an agreed pickup',
    paragraphs: [
      'For a car parked at home in Maple Grove, include a photo of the vehicle and its approach when you text. Show a blocked driveway, narrow opening, or garage entrance if it affects access. Photos support the conversation; an appointment is confirmed separately.',
      'If a repair estimate prompted the sale, tell us the known problem, whether the vehicle is complete, and whether it can roll and steer. You do not need to authorize repairs to request an offer. Disclose missing wheels or removed components before agreeing on terms.',
      'For a vehicle at a repair shop, arrange release with the shop and ask when the car and keys will be accessible. Any storage or repair balance is a matter to settle with the shop; a purchase inquiry does not authorize us to release someone else’s vehicle.',
    ],
    details: [
      'Text vehicle photos and a view of the pickup approach.',
      'Describe the known mechanical issue without paying for new diagnostics.',
      'Coordinate shop release and key access before the pickup window.',
    ],
    secondFocus: 'Compare a Maple Grove repair decision with a complete purchase offer',
    secondParagraphs: [
      'A large estimate is one part of deciding what to do with an older car. Share the known fault, accident damage, and any other reason you are considering a sale. Include its year, make, model, and current photos so the discussion concerns the vehicle you actually own. You can ask for an offer before paying for more diagnostics, buying parts, or arranging a separate tow.',
      'Maple Grove’s interstate connections do not establish a pickup time for a particular property. Explain the entrance, any shop closing time, and when someone can provide the keys and agreed documents. Before choosing to proceed, compare the amount you would actually receive after any stated removal charges. Confirm how payment will be handled and keep the shop or property contact informed of the agreed window rather than an unconfirmed request.',
    ],
    question: 'Can I sell a Maple Grove car that is still at a repair shop?',
    answer:
      'Call with its condition, shop location, and ownership details. If we agree to buy it, you will need to coordinate the shop’s release and access requirements before pickup.',
    secondQuestion: 'Do I need another diagnostic inspection before selling my Maple Grove car?',
    secondAnswer:
      'You can begin with the condition and diagnosis you already know. Tell us about uncertainty, disassembly, and missing parts instead of paying for new work simply to request an offer. We may ask follow-up questions before confirming terms.',
    nearby: ['brooklyn-park', 'plymouth', 'brooklyn-center', 'anoka'],
  }),
  area({
    slug: 'plymouth',
    city: 'Plymouth',
    description:
      'Sell an unwanted Plymouth vehicle with garage or ramp access planned first. Discuss clearance, wheel condition, ownership, and a cash offer with Merritt’s.',
    intro:
      'Have a car in Plymouth that is no longer worth keeping? Tell Merritt’s about its condition and location to discuss a cash offer and a practical removal plan.',
    focus: 'Check garage and managed-parking access before scheduling',
    paragraphs: [
      'If your Plymouth vehicle is inside a garage, report the doorway or ramp clearance and whether the car is facing toward the exit. Also tell us whether it has all its wheels, rolls, and steers. These details help determine whether a pickup can be arranged safely.',
      'At an apartment, condominium, or workplace, the address may not identify the correct loading location. Share the parking area and ask who can authorize access. A locked gate or a requirement to collect keys from an office needs to be coordinated in advance.',
      'An offer should account for the vehicle as it stands. Mention a failed transmission, engine problem, collision damage, or missing components before deciding. Ask us to clarify the removal terms and any charges before agreeing to the sale.',
    ],
    details: [
      'Describe the garage exit, ramp, and vehicle orientation.',
      'Arrange property-manager access where necessary.',
      'Confirm the net offer and removal terms together.',
    ],
    secondFocus: 'Know what the garage photos need to show',
    secondParagraphs: [
      'A close-up of the car alone may not explain how it can leave a Plymouth garage. Show the door or ramp, the space around the vehicle, and any turn between it and the exit. Include posted clearance where available. Explain whether the car faces inward or outward and whether another resident’s vehicle blocks it. You do not need to reposition the car to take useful access photographs.',
      'For a property reached from Highway 55 or I-494, provide the exact entrance and parking level rather than relying on a nearby interchange. If keys are held in a management office, coordinate its availability before agreeing on timing. Keep ownership documents with the authorized seller, and discuss liens, signatures, payment, and any removal charge in advance. Building access and authority to sell the vehicle are separate parts of the arrangement.',
    ],
    question: 'What should I send about a Plymouth vehicle in a parking ramp?',
    answer:
      'Send the posted clearance, route to the car, wheel and steering condition, and the person who can authorize access. Do not move it into traffic to make pickup easier.',
    secondQuestion: 'Which photos help with a Plymouth garage pickup?',
    secondAnswer:
      'Send current views of the car, garage doorway or ramp, posted clearance, and the route to the exit. Show any obstruction without moving the disabled vehicle. We will discuss whether the setting permits a suitable loading plan.',
    nearby: ['maple-grove', 'minneapolis', 'eden-prairie'],
  }),
  area({
    slug: 'blaine',
    city: 'Blaine',
    description:
      'Sell an unwanted Blaine truck, SUV, van, or car. Merritt’s reviews completeness, cargo, ground access, ownership details, and pickup terms before scheduling.',
    intro:
      'Call or text Merritt’s about a junk car, unwanted truck, van, or SUV in Blaine. We review the vehicle and its pickup setting before confirming an offer.',
    focus: 'Describe the whole truck or SUV, not just the engine problem',
    paragraphs: [
      'When selling a truck or SUV in Blaine, include its body style, major damage, wheel condition, and whether the bed or cargo area contains personal property. Explain whether the engine and transmission are present. Completeness and loading access are part of the review.',
      'For a vehicle sitting at the side of a property or behind a gate, describe the ground surface and how a truck would approach it. Snow, mud, or a narrow opening can change the loading plan. Do not move the vehicle onto softer ground while waiting.',
      'You do not need a running vehicle to start a conversation. We will ask about the details that affect the offer and confirm whether pickup is suitable for your location before a window is agreed.',
    ],
    details: [
      'Include truck or SUV body style and condition.',
      'Remove belongings from the bed or cargo area.',
      'Identify gates, ground conditions, and wheel issues.',
    ],
    secondFocus: 'Prepare an accurate truck description before discussing value',
    secondParagraphs: [
      'For a Blaine pickup truck, tell us whether it has a regular, extended, or crew cab if known, and describe the bed and any major body damage. For a van, explain whether seats or cargo equipment remain inside. Describe what you intend to keep before an offer is agreed. Loose tools, household storage, or materials in the cargo area should not be assumed to be part of a vehicle purchase.',
      'Highway 65 may help describe the general area, but loading requires the exact driveway or lot entrance. Explain whether the vehicle is on firm ground and whether its wheels turn, even if the engine runs. Have title, lien, and key information ready, and mention a business-owned truck at the start. Confirm payment, any removal charge, and access preparations before committing to the sale or clearing a work schedule for pickup.',
    ],
    question: 'Will you consider a non-running truck in Blaine?',
    answer:
      'Yes, you can ask about a non-running truck. Tell us its year, make, model, completeness, wheels, and location. Acceptance and pickup are confirmed after review.',
    secondQuestion: 'Is equipment stored in my Blaine truck included in the purchase?',
    secondAnswer:
      'Describe it and clarify what you plan to keep before accepting an offer. Do not assume tools, cargo, or unrelated stored materials are included or will be removed. Agree on the vehicle’s contents and loading access in advance.',
    nearby: ['coon-rapids', 'anoka', 'roseville'],
  }),
  area({
    slug: 'coon-rapids',
    city: 'Coon Rapids',
    description:
      'Ask about selling a Coon Rapids car with lost keys or tire problems. Merritt’s reviews loading access, title status, an offer, and pickup arrangements.',
    intro:
      'Talk to Merritt’s about an unwanted car in Coon Rapids. Share its condition, title and key status, and location to find out what the next step would be.',
    focus: 'A clear plan when keys or tires are missing',
    paragraphs: [
      'Lost keys and flat or missing tires are important pickup details, not details to leave until the truck arrives. For a Coon Rapids vehicle, explain whether the steering is locked, the parking brake releases, and every wheel is present. Only report what you can safely observe.',
      'Tell us whether the car is tucked into a garage, surrounded by stored items, or blocked by another vehicle. Clear your belongings when it is safe, but do not lift the car or try to drag it free. The operator needs to decide the suitable loading method.',
      'A missing key is separate from a missing title. Discuss both so ownership paperwork and physical access can be addressed before you accept an offer or schedule pickup.',
    ],
    details: [
      'Separate key, title, and lien information.',
      'Report missing wheels and locked steering.',
      'Describe obstructions without trying to tow the car yourself.',
    ],
    secondFocus: 'Explain missing keys without guessing about the paperwork',
    secondParagraphs: [
      'A missing ignition key may affect steering or transmission access even when the doors open normally. Describe which keys you have and what remains locked; do not force a shifter or try to defeat a steering lock. For a Coon Rapids vehicle with flat or missing tires, photograph it from a safe standing position. There is no need to lift the car or place yourself underneath it for an initial review.',
      'Give the precise parking location and entrance, including whether it is near Highway 10 but reached from another road. Tell us if access depends on another household member or a management office. Title, lien, and authority-to-sell questions must be discussed separately from how the car will load. Once those issues are clear, confirm the offer, any removal charges, payment arrangements, and what must be available during the agreed pickup window.',
    ],
    question: 'Can I ask about selling a Coon Rapids car without keys?',
    answer:
      'Yes. Explain whether the doors, steering, or transmission are locked. Missing keys do not resolve ownership requirements; we review documents and loading access separately.',
    secondQuestion: 'Do I need to install tires before asking about my Coon Rapids car?',
    secondAnswer:
      'No replacement tires are needed for the initial inquiry. Tell us which wheels and tires are present, whether the car rolls, and where it sits. We review the loading requirements before confirming pickup or suggesting any preparation.',
    nearby: ['blaine', 'anoka', 'brooklyn-park'],
  }),
  area({
    slug: 'anoka',
    city: 'Anoka',
    description:
      'Discuss an unwanted Anoka vehicle before a property cleanout. Merritt’s reviews ownership, estate or business paperwork, vehicle access, and pickup terms.',
    intro:
      'Merritt’s helps Anoka vehicle owners discuss selling an unwanted car and arranging removal. Start with a call or text, especially when a vehicle has been stored for a long time.',
    focus: 'Sort out ownership and access before a cleanout pickup',
    paragraphs: [
      'A property cleanout can uncover a vehicle with an old title, missing keys, or a different owner’s name on its paperwork. Before planning pickup in Anoka, identify who owns the car and who can authorize the sale. Possession of a vehicle or property does not by itself establish authority to sell it.',
      'Tell us where the car is stored and whether it is complete. If it is part of an estate or a business cleanout, describe that at the start. Unusual paperwork should be resolved through the appropriate official process rather than rushed to fit a removal deadline.',
      'Once the vehicle, documents, and access have been reviewed, we discuss the offer and pickup window. Keep transaction records and remove belongings before the agreed appointment.',
    ],
    details: [
      'Identify the owner and paperwork currently available.',
      'Mention an estate or business-owned vehicle at the start.',
      'Explain storage deadlines before scheduling.',
    ],
    secondFocus: 'Document what you know before an Anoka property changes hands',
    secondParagraphs: [
      'For a vehicle included in a family or business cleanout, start by collecting its identity and the paperwork already available. Note the title owner, year, make, model, and whether the keys are present. Explain your relationship to the owner without assuming that permission to enter the property also permits a sale. If ownership documents are incomplete, ask about the next step before arranging a removal deadline.',
      'An Anoka address near Highway 10 can still lead to a car behind a garage, in a side yard, or at a separate storage property. Describe the exact position, ground surface, and any fence or locked entrance. Use current photos and disclose removed parts or missing wheels. We can then discuss acceptance, the offer, any removal charges, and a realistic pickup window while the required authority and documents are being established.',
    ],
    question: 'Can I arrange pickup of a car left on an Anoka property?',
    answer:
      'Contact us to explain the situation, but do not assume you can sell a car just because it is on the property. Ownership and authority must be established before any purchase or pickup is agreed.',
    secondQuestion: 'What information helps with an Anoka estate or business vehicle?',
    secondAnswer:
      'Identify the titled owner, who has authority to act, documents currently available, key status, and the vehicle’s condition and location. Explain the situation before scheduling so paperwork and access can be reviewed together rather than left until pickup.',
    nearby: ['coon-rapids', 'ramsey', 'andover', 'champlin'],
  }),
  area({
    slug: 'bloomington',
    city: 'Bloomington',
    description:
      'Sell a damaged or unwanted Bloomington vehicle. Review wheel damage, workplace or garage access, ownership paperwork, and pickup terms with Merritt’s.',
    intro:
      'Sell an unwanted vehicle in Bloomington with the pickup details worked out in advance. Merritt’s reviews cars, trucks, vans, and SUVs by phone or text.',
    focus: 'Coordinate pickups from residential and business parking',
    paragraphs: [
      'A Bloomington pickup can involve a home driveway, workplace lot, repair facility, or managed garage. Identify the area where the car is actually parked and who can authorize access. Share any gate, check-in, clearance, or loading restrictions before an appointment.',
      'If the car has collision damage, photograph the affected corners and describe any damaged wheels or suspension. Mention leaking fluids without approaching or handling them. The pickup plan must reflect the vehicle’s current condition, not how it drove before the damage.',
      'When a lot has limited access hours, coordinate availability with us before committing to a pickup time. Confirm the offer and removal terms together, and have the agreed documents and keys ready.',
    ],
    details: [
      'Identify the correct lot entrance or garage.',
      'Disclose collision damage affecting wheels or suspension.',
      'Coordinate business access hours with the pickup window.',
    ],
    secondFocus: 'Describe collision damage before moving a Bloomington car',
    secondParagraphs: [
      'After a collision, a vehicle that starts may still have damaged suspension, a wheel turned out of position, or bodywork interfering with a tire. Explain these conditions and send current photos from a safe place. Do not drive it simply to make pickup easier or approach leaking fluids. Tell us where the keys are and whether a shop, property manager, or another business currently controls release of the vehicle.',
      'For parking near I-494 or I-35W, identify the actual lot entrance, level, or reserved space rather than the nearest large building. Workplaces and managed garages may require a contact to meet the truck or permit loading during certain hours. Arrange that access in advance, then discuss title and lien status, the amount offered, payment, and any removal charges. Coordinate your belongings and documents before the agreed appointment.',
    ],
    question: 'Can you collect a Bloomington car from my workplace?',
    answer:
      'We can discuss it after reviewing the car and location. Confirm that the property permits access and share any check-in, clearance, or loading restrictions before scheduling.',
    secondQuestion: 'Can a collision-damaged Bloomington car be reviewed if it still starts?',
    secondAnswer:
      'Yes. Explain the damage, particularly wheels, steering, and suspension, and send safe current photos. A working engine does not mean the car is safe to move. We assess its present condition and access before discussing suitable pickup.',
    nearby: ['minneapolis', 'eden-prairie', 'burnsville', 'eagan'],
  }),
  area({
    slug: 'eagan',
    city: 'Eagan',
    description:
      'Sell an unwanted Eagan car with gate access and key handoff arranged first. Merritt’s discusses ownership requirements, a cash offer, and pickup availability.',
    intro:
      'Have an unwanted vehicle in Eagan? Contact Merritt’s for a conversation about the car, a cash offer, and pickup rather than relying on an automatic online estimate.',
    focus: 'Plan around gated, shared, or workplace parking',
    paragraphs: [
      'For an Eagan vehicle in a managed lot or shared garage, explain how the truck reaches the car and who controls the entrance. Access codes should be shared privately only when needed for an agreed job, not posted in public photographs or reviews.',
      'Describe whether the vehicle starts and whether it can roll and steer. A working engine does not guarantee that a damaged wheel or transmission will allow normal movement. Do not test an unsafe vehicle just to answer a question.',
      'If you will be away from the property, discuss document signing, keys, and who must be present before scheduling. An unanswered phone or unavailable gate can interrupt an otherwise agreed pickup, so coordinate the contact arrangement with us.',
    ],
    details: [
      'Explain access without publicly sharing codes.',
      'Discuss key handoff and who must be present.',
      'Confirm the pickup contact and agreed paperwork.',
    ],
    secondFocus: 'Coordinate an Eagan sale when your schedule is limited',
    secondParagraphs: [
      'If work or travel makes it difficult to meet at the vehicle, describe your availability in the first conversation. Tell us who owns the car, who holds the keys, and whether someone else controls the parking area. We can discuss the required signatures and contact arrangements before a window is agreed. Leaving keys in the car or asking a coworker to meet the truck does not by itself complete those arrangements.',
      'For a property reached from I-35E or Highway 77, provide the specific driveway, gate, or parking level. Explain any office hours that affect key collection or permission to enter. Send recent vehicle photos, known mechanical problems, and missing-component details so the offer reflects its present state. Confirm payment and any removal charges before accepting, then keep the agreed contact reachable while the operator locates the vehicle.',
    ],
    question: 'Do I have to be present for an Eagan pickup?',
    answer:
      'Discuss that before scheduling. Presence, signatures, identification, and key handoff depend on the agreed transaction and ownership situation; do not assume an unattended pickup is approved.',
    secondQuestion: 'Can a coworker provide access to my Eagan workplace vehicle?',
    secondAnswer:
      'Tell us the proposed arrangement before scheduling. A coworker may be able to help with property access, but required seller documents, signatures, identification, and key handoff must still be agreed. Confirm who is authorized for each part of the transaction.',
    nearby: ['st-paul', 'bloomington', 'burnsville', 'woodbury'],
  }),
  area({
    slug: 'woodbury',
    city: 'Woodbury',
    description:
      'Discuss your Woodbury junk car’s complete offer and removal terms. Merritt’s reviews east-metro pickup access, shared parking, paperwork, and timing directly.',
    intro:
      'Merritt’s serves vehicle owners in Woodbury and the east metro. Call or text about an unwanted car and confirm the offer, access requirements, and pickup window together.',
    focus: 'Clear pickup expectations for an east-metro vehicle',
    paragraphs: [
      'Send the actual Woodbury pickup location rather than assuming a route or time based on the city name. A driveway pickup and a vehicle in a managed garage may need different arrangements. Location and access are reviewed along with the vehicle.',
      'For shared driveways and townhome parking, coordinate with the person who controls the loading area. Tell us if another vehicle needs to move or if access is limited to certain hours. Do not promise access that has not been arranged.',
      'If you have a deadline for clearing the vehicle, mention it when you first call. Pickup timing is agreed after review, not guaranteed by an online page. Ask about any removal charges when discussing the offer so you can compare the complete terms.',
    ],
    details: [
      'Provide the exact location and driveway or garage setting.',
      'Arrange shared-property access in advance.',
      'Discuss the full offer and any removal charges.',
    ],
    secondFocus: 'Evaluate the offer against the actual Woodbury pickup setting',
    secondParagraphs: [
      'Start with the year, make, model, present condition, and current photos, rather than a price listed for a different vehicle online. Tell us whether the engine and transmission are present and if the car rolls and steers. Major damage, missing wheels, or a locked garage affects the review. Ask us to explain what is included in the proposed purchase before you decide whether it meets your needs.',
      'Woodbury locations near I-94 or I-494 still require specific entrance and parking instructions. For a townhome or managed property, coordinate any shared loading space and keep the responsible contact available during the agreed window. Title and lien status, payment arrangements, required documents, and any removal charge should be settled in the same discussion. If a deadline changes, contact us rather than assuming the original request has reserved a collection time.',
    ],
    question: 'Is pickup in Woodbury included automatically in an offer?',
    answer:
      'We confirm removal terms directly for the specific vehicle and address. Ask whether any pickup charge applies and compare the amount you would actually receive before accepting.',
    secondQuestion: 'Can a Woodbury townhome parking deadline be considered when scheduling?',
    secondAnswer:
      'Explain the deadline and the person who controls access when you first contact us. We review availability and loading conditions before confirming a window. Keep the property informed of the agreed appointment instead of treating a requested date as booked.',
    nearby: ['st-paul', 'roseville', 'eagan'],
  }),
  area({
    slug: 'burnsville',
    city: 'Burnsville',
    description:
      'Compare repairing or selling your Burnsville car. Merritt’s reviews known faults, shop release or home access, a cash offer, and any agreed removal costs.',
    intro:
      'Ready to sell an unwanted car in Burnsville? Merritt’s can review a non-running, damaged, or unused vehicle and explain its offer and removal options.',
    focus: 'When repair costs change the decision to keep a vehicle',
    paragraphs: [
      'An engine or transmission problem can lead you to compare repair, private sale, and recycling. For a Burnsville vehicle, send the known fault and what is still complete. A clear description is enough to start; do not spend money on repairs just to request a cash offer.',
      'Explain whether the car is at home or still at a shop. For a shop pickup, resolve its release requirements and confirm access to the keys. For a home pickup, mention a slope, blocked driveway, or garage before agreeing on a loading plan.',
      'Compare the complete terms, including any pickup charges and documents needed, rather than the headline offer alone. You decide whether to proceed once those details are clear.',
    ],
    details: [
      'Describe the known engine or transmission fault.',
      'Identify whether the vehicle is at a shop or at home.',
      'Compare the net offer after any agreed removal costs.',
    ],
    secondFocus: 'Use the repair information you already have',
    secondParagraphs: [
      'A repair estimate can help explain the problem without becoming a requirement to buy more diagnostics. Share whether the engine starts, the transmission engages, and the vehicle can roll and steer, but only report what you already know safely. Tell us if a Burnsville shop has removed components or if parts are stored separately. Current photos and a clear description make the initial offer discussion more useful than an assumption about the car’s age.',
      'If the vehicle is near the I-35W and I-35E junction, give the exact address and final approach rather than only naming the interstate. A shop lot may have release hours; a home driveway may have a slope or other parked cars. Before scheduling, review title and lien status, keys, payment, and any removal charges. Keep the shop’s release arrangements separate from accepting our offer so both sides know what needs to happen.',
    ],
    question: 'Should I repair my Burnsville car before asking for an offer?',
    answer:
      'You can ask for an offer in its current condition. Explain the known problem and completeness first. Decide about repairs only after comparing the costs and your alternatives.',
    secondQuestion: 'What if my Burnsville car starts but the transmission will not move it?',
    secondAnswer:
      'Describe that fault and whether the wheels and steering move independently. You do not need to test-drive it. Tell us where it is parked and about any shop release requirements so the offer and loading plan can be reviewed together.',
    nearby: ['bloomington', 'eagan', 'eden-prairie'],
  }),
  area({
    slug: 'roseville',
    city: 'Roseville',
    description:
      'Sell an unwanted Roseville car with shared-lot access and seller authority clarified. Merritt’s reviews ownership, keys, vehicle condition, and pickup terms.',
    intro:
      'Contact Merritt’s about selling an unwanted vehicle in Roseville. A direct conversation covers its condition, ownership paperwork, and a pickup setting that works for both sides.',
    focus: 'Prepare a vehicle in a shared residential or commercial lot',
    paragraphs: [
      'For a Roseville car in a shared lot, send a clear description of the space and the entrance. The vehicle’s mailing address may point to a building rather than its parking area. Mention gates, overhead restrictions, and where a truck could load without blocking access.',
      'If the vehicle has been stored while you live elsewhere, confirm who holds the keys and whether you can provide the required documents. Permission from a property manager addresses site access; it does not replace the vehicle owner’s authorization to sell.',
      'Before the appointment, remove belongings and arrange for any obstructing vehicle to be moved by its owner. Do not reposition a disabled car yourself. We will discuss an appropriate pickup plan after reviewing the conditions.',
    ],
    details: [
      'Identify the actual parking space and entrance.',
      'Separate property permission from authority to sell.',
      'Arrange belongings, keys, and document access before pickup.',
    ],
    secondFocus: 'Plan a Roseville transaction when the owner lives elsewhere',
    secondParagraphs: [
      'If you are helping a family member with a car stored in Roseville, explain who owns it, who has the title, and who can complete the sale. A neighbor or manager may help identify the space without having authority to transfer the vehicle. Discuss the paperwork and any presence requirements first. Avoid promising removal as part of a move or cleanout until ownership and pickup arrangements are confirmed.',
      'For a lot reached from Highway 36 or I-35W, include the actual entrance, building, and parking-space location. Current photos should show both the car’s condition and the loading approach. Disclose missing parts, flat tires, and locked steering rather than trying to move it between spaces. Confirm the payment amount, any removal charge, keys, and contact arrangements before the appointment, and keep personal belongings out of the agreed vehicle sale.',
    ],
    question: 'Can a property manager sell a car in a Roseville parking lot?',
    answer:
      'Property access and vehicle ownership are separate issues. Explain the situation first; the legal authority and required documents must be established before a sale or removal is agreed.',
    secondQuestion: 'Can I help a relative arrange a sale of a car stored in Roseville?',
    secondAnswer:
      'Yes, you can start the inquiry and share its condition and access details. Explain whose name is on the title and who can authorize and complete the transaction. Required documents and any presence arrangements must be settled before pickup.',
    nearby: ['st-paul', 'minneapolis', 'blaine', 'woodbury'],
  }),
  area({
    slug: 'eden-prairie',
    city: 'Eden Prairie',
    description:
      'Discuss a stored or partly dismantled Eden Prairie car with Merritt’s. Current photos, remaining parts, garage access, and ownership details guide the offer.',
    intro:
      'Sell an unused or non-running vehicle in Eden Prairie. Merritt’s reviews the car and pickup location directly, so the offer reflects the vehicle you actually have.',
    focus: 'Review tight garages and long-term storage before pickup',
    paragraphs: [
      'A car stored in an Eden Prairie garage may be surrounded by belongings or unable to roll. Describe the path from the vehicle to the exit, any clearance limit, and the condition of its wheels. Clear personal items safely, but leave loading and vehicle movement to an agreed plan.',
      'Tell us whether keys are available and whether the vehicle has been partly dismantled. Missing components, loose panels, or removed wheels affect the review. Send current photographs instead of relying on pictures from when the car was running.',
      'For a vehicle parked on shared property, arrange access with the owner or manager before the pickup window. Confirm the paperwork, offer, and any removal terms in the same conversation so there is one clear agreement.',
    ],
    details: [
      'Use current photos showing condition and access.',
      'Mention removed components or loose panels.',
      'Keep the garage exit available for the agreed appointment.',
    ],
    secondFocus: 'Show what remains of an unfinished project vehicle',
    secondParagraphs: [
      'If an Eden Prairie project has stopped making progress, list the major components still installed and any parts kept separately. Explain whether the engine and transmission are present, whether all wheels are fitted, and if the steering can turn. Loose panels and parts should be identified before an offer, rather than assumed to be included. Do not reassemble or lift the vehicle simply to take photos for the initial review.',
      'An address near Highway 212 or I-494 does not show the route out of a crowded garage. Send the doorway, available turning space, and car position, including anything blocking access. Tell us whose name is on the title and whether keys or liens need discussion. Once acceptance is confirmed, agree on the included vehicle and parts, payment, any removal charges, and pickup preparations so the appointment reflects the vehicle’s actual condition.',
    ],
    question: 'Can you review a partly dismantled car in Eden Prairie?',
    answer:
      'Call or text what remains, which wheels and major components are present, and where the car sits. We assess acceptance and loading arrangements case by case.',
    secondQuestion: 'Are loose parts from my Eden Prairie project car part of the offer?',
    secondAnswer:
      'List and photograph them before accepting. We need to agree on which components are included and how they will be accessible, rather than assume every item in the garage is part of the vehicle purchase.',
    nearby: ['plymouth', 'bloomington', 'burnsville'],
  }),
  area({
    slug: 'buffalo',
    city: 'Buffalo',
    description:
      'Ask about selling an unwanted Buffalo vehicle. Merritt’s reviews the exact address, seasonal access, vehicle condition, pickup availability, and removal terms.',
    intro:
      'Contact Merritt’s about an unwanted vehicle in Buffalo. For surrounding-community pickups, the exact address, vehicle condition, and access are reviewed together before scheduling.',
    focus: 'A surrounding-community pickup needs complete location details',
    paragraphs: [
      'For a Buffalo vehicle, send the actual address and explain whether it is reached from a paved driveway, gravel approach, or another setting. Do not assume that a city name alone is enough to confirm a route or equipment.',
      'A vehicle stored behind a building or on soft ground may need a different plan from one on pavement. Mention gates, slopes, long driveways, and any seasonal access problem. Do not move the car into a difficult position while waiting for a response.',
      'Distance and access are part of the offer and pickup discussion. Confirm whether the location can be served, any removal charges, and the appointment window before committing to a sale. A call does not commit you to accepting the terms.',
    ],
    details: [
      'Provide the full pickup location and approach.',
      'Mention soft ground, gates, and seasonal access.',
      'Confirm service availability and removal terms before accepting.',
    ],
    secondFocus: 'Confirm the Buffalo address and current access before making plans',
    secondParagraphs: [
      'Highway 55 may identify the general route to Buffalo, but it cannot describe the final stretch to a vehicle behind a house or outbuilding. Tell us the actual parking surface, available turning room, and whether a gate or another vehicle blocks the path. Use a current photo of the approach, especially if snow, mud, or stored equipment changes the access from what an older image would show.',
      'Include the car’s year, make, model, known faults, and completeness alongside the location. State title and lien status, keys, and whether another person must authorize the sale or property access. You can begin without paying to move the car closer to the metro. We will discuss whether the address and vehicle can be accommodated, the offer, any removal charges, payment, and an agreed window before you commit to a separate tow or sale.',
    ],
    question: 'Is pickup always available for a Buffalo address?',
    answer:
      'We review the exact address, vehicle, access, and schedule before confirming. Call or text those details to discuss availability and any removal charges.',
    secondQuestion: 'Should I tow my Buffalo car toward the metro before requesting an offer?',
    secondAnswer:
      'Contact us from its current location first. Provide the address, vehicle condition, ownership details, and approach. We review availability and removal terms before you spend money on a separate tow or make plans to deliver it.',
    nearby: ['maple-grove', 'plymouth', 'anoka'],
  }),
];
