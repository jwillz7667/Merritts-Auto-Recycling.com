// Service territory approved in the October 2026 metro expansion request.
// These are pickup areas, not additional business locations. Confirm each job directly.
export const coverageRegions = [
  { name: 'Minneapolis and St. Paul', cities: ['Minneapolis', 'St. Paul', 'Brooklyn Center'] },
  { name: 'Northwest metro', cities: ['Brooklyn Park', 'Maple Grove', 'Osseo', 'Plymouth', 'Crystal', 'New Hope', 'Robbinsdale', 'Champlin', 'Dayton', 'Rogers'] },
  { name: 'North and northeast metro', cities: ['Blaine', 'Coon Rapids', 'Anoka', 'Andover', 'Ramsey', 'Ham Lake', 'Fridley', 'Columbia Heights', 'New Brighton', 'Mounds View', 'Shoreview', 'Lino Lakes'] },
  { name: 'West and southwest metro', cities: ['Golden Valley', 'St. Louis Park', 'Hopkins', 'Minnetonka', 'Edina', 'Eden Prairie', 'Wayzata', 'Medina', 'Chanhassen', 'Chaska', 'Victoria', 'Waconia'] },
  { name: 'South metro', cities: ['Bloomington', 'Richfield', 'Burnsville', 'Eagan', 'Apple Valley', 'Lakeville', 'Rosemount', 'Farmington', 'Savage', 'Shakopee', 'Prior Lake'] },
  { name: 'East metro', cities: ['Roseville', 'Maplewood', 'Oakdale', 'Woodbury', 'Cottage Grove', 'White Bear Lake', 'Stillwater', 'Forest Lake', 'Inver Grove Heights', 'West St. Paul', 'South St. Paul', 'North St. Paul'] },
  { name: 'Surrounding communities', cities: ['Elk River', 'Otsego', 'St. Michael', 'Albertville', 'Buffalo', 'Monticello'] },
] as const;

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
  intro: string;
  focus: string;
  paragraphs: string[];
  details: string[];
  question: string;
  answer: string;
  nearby: string[];
};

function area(input: AreaInput): ServiceArea {
  return {
    slug: input.slug,
    city: input.city,
    title: `Cash for junk cars in ${input.city}, MN`,
    description: `Sell an unwanted car in ${input.city}, MN. Call or text Merritt's about vehicle condition, a cash offer, and pickup arrangements. Open daily, 8 AM–8 PM.`,
    intro: input.intro,
    proof: "Merritt's Auto Recycling is based in Brooklyn Center and has served vehicle owners since 1988. Call 763-533-2775 or text 763-438-2116 to discuss your vehicle.",
    details: input.details,
    sections: [{ heading: input.focus, paragraphs: input.paragraphs }],
    faqs: [{ question: input.question, answer: input.answer }],
    nearby: input.nearby,
    updated: '2026-10-06',
  };
}

export const serviceAreas: ServiceArea[] = [
  area({
    slug: 'brooklyn-center', city: 'Brooklyn Center',
    intro: 'Sell an unwanted vehicle to a business based right here in Brooklyn Center. Call or text the year, make, model, condition, and pickup location to discuss a cash offer.',
    focus: 'Start with the local team, not a trip with a disabled car',
    paragraphs: [
      'A vehicle does not need to be driven to the business address for an initial conversation. Describe where it is parked and whether it starts, rolls, and steers. This lets us discuss an appropriate pickup plan before you move anything.',
      'For a car stored at home, check for another vehicle blocking the approach, a locked garage, or a gate. For a vehicle at an apartment or business, identify the person who can authorize truck access. Tell us about any deadline before agreeing on a pickup window.',
      'Our business address is 3106 68th Ave N, Brooklyn Center, MN 55429. Call before arranging a visit or vehicle delivery. Pickup arrangements, vehicle acceptance, and any offer are confirmed directly with you.',
    ],
    details: ['Tell us whether you need pickup or are asking about delivery.', 'Have the title and key status ready before scheduling.', 'Do not drive an unsafe vehicle to obtain an offer.'],
    question: 'Should I bring the car to your Brooklyn Center address?',
    answer: 'Call first. We can review the vehicle by phone or text and discuss pickup. Do not arrange an unconfirmed drop-off or drive an unsafe vehicle to the business.',
    nearby: ['minneapolis', 'brooklyn-park', 'maple-grove'],
  }),
  area({
    slug: 'minneapolis', city: 'Minneapolis',
    intro: 'Have an unwanted car in Minneapolis? Merritt’s buys vehicles for recycling and coordinates pickup after reviewing the car, ownership documents, and access.',
    focus: 'Minneapolis pickups: alleys, garages, and shared access',
    paragraphs: [
      'A Minneapolis pickup may start in a driveway, alley, garage, street space, or managed parking area. Explain which entrance reaches the vehicle rather than relying only on its mailing address. A photo of the approach can help explain a tight turn or an obstruction.',
      'For an underground garage or parking ramp, share the posted clearance and whether the vehicle can roll and steer. Do not push it onto a public street or attempt makeshift towing. The loading plan needs to fit the setting and the vehicle.',
      'If a property manager or another resident controls a gate or shared driveway, arrange authorization before the appointment. We will discuss the offer, any removal charges, and the pickup window together so you know what to expect.',
    ],
    details: ['Identify the driveway, alley, or garage entrance.', 'Mention a ramp, gate, clearance limit, or blocked approach.', 'Keep a way to reach you while the driver locates the vehicle.'],
    question: 'Can you pick up a non-running car from a Minneapolis garage?',
    answer: 'Send the garage clearance, access details, and whether the wheels and steering move. We review the setting before confirming suitable equipment and a pickup plan.',
    nearby: ['brooklyn-center', 'plymouth', 'bloomington', 'st-paul'],
  }),
  area({
    slug: 'st-paul', city: 'St. Paul',
    intro: 'Merritt’s serves St. Paul vehicle owners who want to sell an unwanted car, truck, van, or SUV. Discuss the vehicle and pickup setting by phone or text, without arranging a separate tow first.',
    focus: 'Selling a vehicle in Saint Paul without moving it first',
    paragraphs: [
      'Whether the vehicle is at your home, a repair shop, or a shared lot in Saint Paul, start with its present location. Tell us if it is behind a building or reached from a different street. Accurate access information is more useful than moving a disabled car for an appointment.',
      'If the vehicle is on an incline, has locked brakes, or is surrounded by other cars, describe that in the first message. Do not release brakes or reposition it yourself to test whether it moves. We need that information to review the loading arrangement.',
      'For a car waiting at a repair shop, confirm who authorizes release and whether the shop must be open when the truck arrives. Share any storage deadline, but wait for an agreed pickup window before telling the property that the vehicle will be removed.',
    ],
    details: ['Send the pickup address and the entrance the truck should use.', 'Mention slopes, locked wheels, and parking restrictions.', 'Coordinate keys and release authorization with the person holding the vehicle.'],
    question: 'Do I need to tow my St. Paul car to Brooklyn Center first?',
    answer: 'No separate tow is needed to ask about an offer. Call or text from wherever the vehicle is stored. We discuss whether pickup can be arranged and confirm its terms before scheduling.',
    nearby: ['roseville', 'woodbury', 'eagan', 'minneapolis'],
  }),
  area({
    slug: 'brooklyn-park', city: 'Brooklyn Park',
    intro: 'Make room for what comes next. Contact Merritt’s about selling a car, truck, or SUV in Brooklyn Park, including a vehicle that has been sitting unused.',
    focus: 'Plan pickup for a car that has been parked for a while',
    paragraphs: [
      'A car that has been sitting may have a dead battery, flat tires, locked brakes, or belongings stored inside. Tell us what you already know. You do not need to spend money making it run just to have the first conversation.',
      'Describe whether the vehicle is on pavement, gravel, grass, or another surface. If it is behind a fence or other vehicles, explain the available approach. Avoid moving it onto soft ground or dismantling it while a pickup is being planned.',
      'Take out your belongings and arrange access to the keys and agreed documents before the confirmed appointment. For a shared lot, check who needs to authorize access and whether the truck has a suitable place to load.',
    ],
    details: ['Report flat tires or wheels that may not turn.', 'Describe the parking surface and any fence or gate.', 'Mention removed parts before discussing the offer.'],
    question: 'Does my Brooklyn Park car need a working battery?',
    answer: 'A dead battery does not prevent an initial review. Tell us whether you have keys, whether the vehicle rolls and steers, and where it is parked so we can assess pickup.',
    nearby: ['brooklyn-center', 'maple-grove', 'coon-rapids', 'anoka'],
  }),
  area({
    slug: 'maple-grove', city: 'Maple Grove',
    intro: 'Sell an unwanted vehicle in Maple Grove without guessing its value from a generic price chart. Merritt’s reviews the actual vehicle and explains the offer and pickup options.',
    focus: 'From a driveway or repair-shop lot to an agreed pickup',
    paragraphs: [
      'For a car parked at home in Maple Grove, include a photo of the vehicle and its approach when you text. Show a blocked driveway, narrow opening, or garage entrance if it affects access. Photos support the conversation; an appointment is confirmed separately.',
      'If a repair estimate prompted the sale, tell us the known problem, whether the vehicle is complete, and whether it can roll and steer. You do not need to authorize repairs to request an offer. Disclose missing wheels or removed components before agreeing on terms.',
      'For a vehicle at a repair shop, arrange release with the shop and ask when the car and keys will be accessible. Any storage or repair balance is a matter to settle with the shop; a purchase inquiry does not authorize us to release someone else’s vehicle.',
    ],
    details: ['Text vehicle photos and a view of the pickup approach.', 'Describe the known mechanical issue without paying for new diagnostics.', 'Coordinate shop release and key access before the pickup window.'],
    question: 'Can I sell a Maple Grove car that is still at a repair shop?',
    answer: 'Call with its condition, shop location, and ownership details. If we agree to buy it, you will need to coordinate the shop’s release and access requirements before pickup.',
    nearby: ['brooklyn-park', 'plymouth', 'brooklyn-center', 'anoka'],
  }),
  area({
    slug: 'plymouth', city: 'Plymouth',
    intro: 'Have a car in Plymouth that is no longer worth keeping? Tell Merritt’s about its condition and location to discuss a cash offer and a practical removal plan.',
    focus: 'Check garage and managed-parking access before scheduling',
    paragraphs: [
      'If your Plymouth vehicle is inside a garage, report the doorway or ramp clearance and whether the car is facing toward the exit. Also tell us whether it has all its wheels, rolls, and steers. These details help determine whether a pickup can be arranged safely.',
      'At an apartment, condominium, or workplace, the address may not identify the correct loading location. Share the parking area and ask who can authorize access. A locked gate or a requirement to collect keys from an office needs to be coordinated in advance.',
      'An offer should account for the vehicle as it stands. Mention a failed transmission, engine problem, collision damage, or missing components before deciding. Ask us to clarify the removal terms and any charges before agreeing to the sale.',
    ],
    details: ['Describe the garage exit, ramp, and vehicle orientation.', 'Arrange property-manager access where necessary.', 'Confirm the net offer and removal terms together.'],
    question: 'What should I send about a Plymouth vehicle in a parking ramp?',
    answer: 'Send the posted clearance, route to the car, wheel and steering condition, and the person who can authorize access. Do not move it into traffic to make pickup easier.',
    nearby: ['maple-grove', 'minneapolis', 'eden-prairie'],
  }),
  area({
    slug: 'blaine', city: 'Blaine',
    intro: 'Call or text Merritt’s about a junk car, unwanted truck, van, or SUV in Blaine. We review the vehicle and its pickup setting before confirming an offer.',
    focus: 'Describe the whole truck or SUV, not just the engine problem',
    paragraphs: [
      'When selling a truck or SUV in Blaine, include its body style, major damage, wheel condition, and whether the bed or cargo area contains personal property. Explain whether the engine and transmission are present. Completeness and loading access are part of the review.',
      'For a vehicle sitting at the side of a property or behind a gate, describe the ground surface and how a truck would approach it. Snow, mud, or a narrow opening can change the loading plan. Do not move the vehicle onto softer ground while waiting.',
      'You do not need a running vehicle to start a conversation. We will ask about the details that affect the offer and confirm whether pickup is suitable for your location before a window is agreed.',
    ],
    details: ['Include truck or SUV body style and condition.', 'Remove belongings from the bed or cargo area.', 'Identify gates, ground conditions, and wheel issues.'],
    question: 'Will you consider a non-running truck in Blaine?',
    answer: 'Yes, you can ask about a non-running truck. Tell us its year, make, model, completeness, wheels, and location. Acceptance and pickup are confirmed after review.',
    nearby: ['coon-rapids', 'anoka', 'roseville'],
  }),
  area({
    slug: 'coon-rapids', city: 'Coon Rapids',
    intro: 'Talk to Merritt’s about an unwanted car in Coon Rapids. Share its condition, title and key status, and location to find out what the next step would be.',
    focus: 'A clear plan when keys or tires are missing',
    paragraphs: [
      'Lost keys and flat or missing tires are important pickup details, not details to leave until the truck arrives. For a Coon Rapids vehicle, explain whether the steering is locked, the parking brake releases, and every wheel is present. Only report what you can safely observe.',
      'Tell us whether the car is tucked into a garage, surrounded by stored items, or blocked by another vehicle. Clear your belongings when it is safe, but do not lift the car or try to drag it free. The operator needs to decide the suitable loading method.',
      'A missing key is separate from a missing title. Discuss both so ownership paperwork and physical access can be addressed before you accept an offer or schedule pickup.',
    ],
    details: ['Separate key, title, and lien information.', 'Report missing wheels and locked steering.', 'Describe obstructions without trying to tow the car yourself.'],
    question: 'Can I ask about selling a Coon Rapids car without keys?',
    answer: 'Yes. Explain whether the doors, steering, or transmission are locked. Missing keys do not resolve ownership requirements; we review documents and loading access separately.',
    nearby: ['blaine', 'anoka', 'brooklyn-park'],
  }),
  area({
    slug: 'anoka', city: 'Anoka',
    intro: 'Merritt’s helps Anoka vehicle owners discuss selling an unwanted car and arranging removal. Start with a call or text, especially when a vehicle has been stored for a long time.',
    focus: 'Sort out ownership and access before a cleanout pickup',
    paragraphs: [
      'A property cleanout can uncover a vehicle with an old title, missing keys, or a different owner’s name on its paperwork. Before planning pickup in Anoka, identify who owns the car and who can authorize the sale. Possession of a vehicle or property does not by itself establish authority to sell it.',
      'Tell us where the car is stored and whether it is complete. If it is part of an estate or a business cleanout, describe that at the start. Unusual paperwork should be resolved through the appropriate official process rather than rushed to fit a removal deadline.',
      'Once the vehicle, documents, and access have been reviewed, we discuss the offer and pickup window. Keep transaction records and remove belongings before the agreed appointment.',
    ],
    details: ['Identify the owner and paperwork currently available.', 'Mention an estate or business-owned vehicle at the start.', 'Explain storage deadlines before scheduling.'],
    question: 'Can I arrange pickup of a car left on an Anoka property?',
    answer: 'Contact us to explain the situation, but do not assume you can sell a car just because it is on the property. Ownership and authority must be established before any purchase or pickup is agreed.',
    nearby: ['coon-rapids', 'blaine', 'brooklyn-park', 'buffalo'],
  }),
  area({
    slug: 'bloomington', city: 'Bloomington',
    intro: 'Sell an unwanted vehicle in Bloomington with the pickup details worked out in advance. Merritt’s reviews cars, trucks, vans, and SUVs by phone or text.',
    focus: 'Coordinate pickups from residential and business parking',
    paragraphs: [
      'A Bloomington pickup can involve a home driveway, workplace lot, repair facility, or managed garage. Identify the area where the car is actually parked and who can authorize access. Share any gate, check-in, clearance, or loading restrictions before an appointment.',
      'If the car has collision damage, photograph the affected corners and describe any damaged wheels or suspension. Mention leaking fluids without approaching or handling them. The pickup plan must reflect the vehicle’s current condition, not how it drove before the damage.',
      'When a lot has limited access hours, coordinate availability with us before committing to a pickup time. Confirm the offer and removal terms together, and have the agreed documents and keys ready.',
    ],
    details: ['Identify the correct lot entrance or garage.', 'Disclose collision damage affecting wheels or suspension.', 'Coordinate business access hours with the pickup window.'],
    question: 'Can you collect a Bloomington car from my workplace?',
    answer: 'We can discuss it after reviewing the car and location. Confirm that the property permits access and share any check-in, clearance, or loading restrictions before scheduling.',
    nearby: ['minneapolis', 'eden-prairie', 'burnsville', 'eagan'],
  }),
  area({
    slug: 'eagan', city: 'Eagan',
    intro: 'Have an unwanted vehicle in Eagan? Contact Merritt’s for a conversation about the car, a cash offer, and pickup rather than relying on an automatic online estimate.',
    focus: 'Plan around gated, shared, or workplace parking',
    paragraphs: [
      'For an Eagan vehicle in a managed lot or shared garage, explain how the truck reaches the car and who controls the entrance. Access codes should be shared privately only when needed for an agreed job, not posted in public photographs or reviews.',
      'Describe whether the vehicle starts and whether it can roll and steer. A working engine does not guarantee that a damaged wheel or transmission will allow normal movement. Do not test an unsafe vehicle just to answer a question.',
      'If you will be away from the property, discuss document signing, keys, and who must be present before scheduling. An unanswered phone or unavailable gate can interrupt an otherwise agreed pickup, so coordinate the contact arrangement with us.',
    ],
    details: ['Explain access without publicly sharing codes.', 'Discuss key handoff and who must be present.', 'Confirm the pickup contact and agreed paperwork.'],
    question: 'Do I have to be present for an Eagan pickup?',
    answer: 'Discuss that before scheduling. Presence, signatures, identification, and key handoff depend on the agreed transaction and ownership situation; do not assume an unattended pickup is approved.',
    nearby: ['st-paul', 'bloomington', 'burnsville', 'woodbury'],
  }),
  area({
    slug: 'woodbury', city: 'Woodbury',
    intro: 'Merritt’s serves vehicle owners in Woodbury and the east metro. Call or text about an unwanted car and confirm the offer, access requirements, and pickup window together.',
    focus: 'Clear pickup expectations for an east-metro vehicle',
    paragraphs: [
      'Send the actual Woodbury pickup location rather than assuming a route or time based on the city name. A driveway pickup and a vehicle in a managed garage may need different arrangements. Location and access are reviewed along with the vehicle.',
      'For shared driveways and townhome parking, coordinate with the person who controls the loading area. Tell us if another vehicle needs to move or if access is limited to certain hours. Do not promise access that has not been arranged.',
      'If you have a deadline for clearing the vehicle, mention it when you first call. Pickup timing is agreed after review, not guaranteed by an online page. Ask about any removal charges when discussing the offer so you can compare the complete terms.',
    ],
    details: ['Provide the exact location and driveway or garage setting.', 'Arrange shared-property access in advance.', 'Discuss the full offer and any removal charges.'],
    question: 'Is pickup in Woodbury included automatically in an offer?',
    answer: 'We confirm removal terms directly for the specific vehicle and address. Ask whether any pickup charge applies and compare the amount you would actually receive before accepting.',
    nearby: ['st-paul', 'roseville', 'eagan'],
  }),
  area({
    slug: 'burnsville', city: 'Burnsville',
    intro: 'Ready to sell an unwanted car in Burnsville? Merritt’s can review a non-running, damaged, or unused vehicle and explain its offer and removal options.',
    focus: 'When repair costs change the decision to keep a vehicle',
    paragraphs: [
      'An engine or transmission problem can lead you to compare repair, private sale, and recycling. For a Burnsville vehicle, send the known fault and what is still complete. A clear description is enough to start; do not spend money on repairs just to request a cash offer.',
      'Explain whether the car is at home or still at a shop. For a shop pickup, resolve its release requirements and confirm access to the keys. For a home pickup, mention a slope, blocked driveway, or garage before agreeing on a loading plan.',
      'Compare the complete terms, including any pickup charges and documents needed, rather than the headline offer alone. You decide whether to proceed once those details are clear.',
    ],
    details: ['Describe the known engine or transmission fault.', 'Identify whether the vehicle is at a shop or at home.', 'Compare the net offer after any agreed removal costs.'],
    question: 'Should I repair my Burnsville car before asking for an offer?',
    answer: 'You can ask for an offer in its current condition. Explain the known problem and completeness first. Decide about repairs only after comparing the costs and your alternatives.',
    nearby: ['bloomington', 'eagan', 'eden-prairie'],
  }),
  area({
    slug: 'roseville', city: 'Roseville',
    intro: 'Contact Merritt’s about selling an unwanted vehicle in Roseville. A direct conversation covers its condition, ownership paperwork, and a pickup setting that works for both sides.',
    focus: 'Prepare a vehicle in a shared residential or commercial lot',
    paragraphs: [
      'For a Roseville car in a shared lot, send a clear description of the space and the entrance. The vehicle’s mailing address may point to a building rather than its parking area. Mention gates, overhead restrictions, and where a truck could load without blocking access.',
      'If the vehicle has been stored while you live elsewhere, confirm who holds the keys and whether you can provide the required documents. Permission from a property manager addresses site access; it does not replace the vehicle owner’s authorization to sell.',
      'Before the appointment, remove belongings and arrange for any obstructing vehicle to be moved by its owner. Do not reposition a disabled car yourself. We will discuss an appropriate pickup plan after reviewing the conditions.',
    ],
    details: ['Identify the actual parking space and entrance.', 'Separate property permission from authority to sell.', 'Arrange belongings, keys, and document access before pickup.'],
    question: 'Can a property manager sell a car in a Roseville parking lot?',
    answer: 'Property access and vehicle ownership are separate issues. Explain the situation first; the legal authority and required documents must be established before a sale or removal is agreed.',
    nearby: ['st-paul', 'minneapolis', 'blaine', 'woodbury'],
  }),
  area({
    slug: 'eden-prairie', city: 'Eden Prairie',
    intro: 'Sell an unused or non-running vehicle in Eden Prairie. Merritt’s reviews the car and pickup location directly, so the offer reflects the vehicle you actually have.',
    focus: 'Review tight garages and long-term storage before pickup',
    paragraphs: [
      'A car stored in an Eden Prairie garage may be surrounded by belongings or unable to roll. Describe the path from the vehicle to the exit, any clearance limit, and the condition of its wheels. Clear personal items safely, but leave loading and vehicle movement to an agreed plan.',
      'Tell us whether keys are available and whether the vehicle has been partly dismantled. Missing components, loose panels, or removed wheels affect the review. Send current photographs instead of relying on pictures from when the car was running.',
      'For a vehicle parked on shared property, arrange access with the owner or manager before the pickup window. Confirm the paperwork, offer, and any removal terms in the same conversation so there is one clear agreement.',
    ],
    details: ['Use current photos showing condition and access.', 'Mention removed components or loose panels.', 'Keep the garage exit available for the agreed appointment.'],
    question: 'Can you review a partly dismantled car in Eden Prairie?',
    answer: 'Call or text what remains, which wheels and major components are present, and where the car sits. We assess acceptance and loading arrangements case by case.',
    nearby: ['plymouth', 'bloomington', 'burnsville'],
  }),
  area({
    slug: 'buffalo', city: 'Buffalo',
    intro: 'Contact Merritt’s about an unwanted vehicle in Buffalo. For surrounding-community pickups, the exact address, vehicle condition, and access are reviewed together before scheduling.',
    focus: 'A surrounding-community pickup needs complete location details',
    paragraphs: [
      'For a Buffalo vehicle, send the actual address and explain whether it is reached from a paved driveway, gravel approach, or another setting. Do not assume that a city name alone is enough to confirm a route or equipment.',
      'A vehicle stored behind a building or on soft ground may need a different plan from one on pavement. Mention gates, slopes, long driveways, and any seasonal access problem. Do not move the car into a difficult position while waiting for a response.',
      'Distance and access are part of the offer and pickup discussion. Confirm whether the location can be served, any removal charges, and the appointment window before committing to a sale. A call does not commit you to accepting the terms.',
    ],
    details: ['Provide the full pickup location and approach.', 'Mention soft ground, gates, and seasonal access.', 'Confirm service availability and removal terms before accepting.'],
    question: 'Is pickup always available for a Buffalo address?',
    answer: 'We review the exact address, vehicle, access, and schedule before confirming. Call or text those details to discuss availability and any removal charges.',
    nearby: ['maple-grove', 'plymouth', 'anoka'],
  }),
];
