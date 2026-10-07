import { guides as library, type Guide as LibraryGuide } from './guide-library';
export type { GuideSection } from './guide-library';
export type Guide = LibraryGuide & { seoTitle?: string; updatedIso?: string; publishedIso?: string; related?: string[] };

// Retain the original article library and URLs; revise useful content rather than deleting it.
const revisions: Record<string, Partial<Guide>> = {
  'minnesota-junk-car-documents': {
    title: 'Minnesota junk-car title, plates, and document checklist',
    shortTitle: 'Minnesota titles and documents',
    seoTitle: "Minnesota Junk Car Title and Document Checklist | Merritt's",
    description: 'Prepare to sell a junk car in Minnesota: title and lien questions, owner authorization, license plates, transaction records, and official sources.',
    summary: 'Start with the paperwork you have. Tell the buyer about missing titles, a lien, or a different owner’s name before arranging pickup. Use Minnesota DVS for the requirements that apply to your transaction.',
    updated: 'October 7, 2026', updatedIso: '2026-10-07',
    sections: [
      { heading: 'Check the title before setting a pickup date', paragraphs: ['Locate the title and compare its vehicle information with the car you want to sell. Tell the buyer whether the title is lost, damaged, held by a lender, from another state, or in someone else’s name. Do not sign blank transaction documents or hide an ownership dispute.', 'Vehicle title transfer and reporting the sale are different parts of a transaction. Confirm the process that applies to your buyer and vehicle with Minnesota Driver and Vehicle Services or a deputy registrar. This checklist is preparation information, not a substitute for state instructions.'] },
      { heading: 'Missing title or an outstanding lien?', paragraphs: ['Ask about the correct next step before promising that a vehicle can be released. A missing title may require replacement paperwork, and a lender’s interest needs to be addressed. A bill of sale, possession of keys, or permission to enter a property does not automatically resolve those issues.', 'Explain the situation to Merritt’s at the start. We do not promise that every vehicle without a title can be purchased.'] },
      { heading: 'Identify who can authorize the sale', paragraphs: ['Check whose names appear on the title and discuss which owners must participate. Estate, business-owned, jointly owned, abandoned, and out-of-state vehicles may need additional steps. Confirm authority before scheduling a cleanout pickup.', 'Property-manager permission concerns access to the lot or garage. It does not by itself establish authority to sell a vehicle stored there.'] },
      { heading: 'License plates: confirm the vehicle-specific instructions', paragraphs: ['Ask DVS or a deputy registrar what to do with the plates for this transaction and plate type. A transfer to another owner, a vehicle processed as junk, and special or personalized plates can raise different questions. Do not rely on a blanket internet instruction to always remove or always leave plates.', 'Separate plate handling from removing personal property. Take out toll tags, garage remotes, personal documents, and other belongings before the agreed pickup. Do not cancel or transfer insurance solely because you sent an inquiry; discuss the effective date with your insurer after the transaction arrangements are clear.'] },
      { heading: 'Keep a record of the transaction', paragraphs: ['Retain the buyer’s business details, the agreed offer and removal terms, the date, and copies of completed documents you are entitled to keep. Ask who handles any required title or junk notification and what confirmation you will receive.', 'Keep records privately. Do not upload titles, vehicle identification numbers, personal addresses, or identification documents into public reviews or social posts.'] },
      { heading: 'Your pre-pickup checklist', paragraphs: ['Resolve document questions before the truck is scheduled.'], items: ['Title and lien status discussed', 'Authority to sell established', 'Required identification and signatures confirmed', 'Plate handling checked with the appropriate official office', 'Offer, payment, access, and pickup window agreed', 'Transaction records retained privately'] },
    ],
    sources: [
      { label: 'Minnesota Driver and Vehicle Services', href: 'https://dps.mn.gov/divisions/dvs' },
      { label: 'Minnesota Attorney General: transferring a motor-vehicle title', href: 'https://www.ag.state.mn.us/Consumer/Publications/TransferMVTitle.asp' },
      { label: 'Minnesota DVS: title and junk notifications', href: 'https://learningcenter.dps.mn.gov/mndrive/Dealers/AddTitleNotifications.html' },
    ],
    related: ['prepare-an-unwanted-car-for-pickup', 'what-affects-a-junk-car-offer'],
  },
  'what-affects-a-junk-car-offer': {
    title: 'How much is my junk car worth in Minnesota?', shortTitle: 'What is my junk car worth?',
    seoTitle: "How Much Is My Junk Car Worth in Minnesota? | Merritt's",
    description: 'Understand what affects a Minnesota junk-car offer: vehicle condition, completeness, reusable components, location, loading access, and removal costs.',
    summary: 'The useful number is the amount you would actually receive for your vehicle under the agreed terms. A generic price range or a weight calculator cannot replace that conversation.',
    updated: 'October 7, 2026', updatedIso: '2026-10-07',
    sections: [
      { heading: 'Start with the exact vehicle', paragraphs: ['Send the year, make, model, body style, and known condition. Describe a failed engine or transmission, major collision damage, missing components, or a car that has sat unused. Current photographs help show what the buyer is evaluating.', 'A running vehicle, a complete non-running car, and a partly dismantled shell are different situations. Explain what remains rather than assuming that a similar model advertised online has the same value.'] },
      { heading: 'Condition and completeness affect the review', paragraphs: ['Tell the buyer whether the vehicle starts, rolls, and steers, and whether all wheels and major components are present. A working engine does not eliminate a loading problem caused by damaged suspension or locked wheels.', 'Do not remove parts after agreeing on an offer without discussing it. An offer based on a complete vehicle may need to be reviewed if its condition changes before pickup.'] },
      { heading: 'Weight alone is not a purchase price', paragraphs: ['A vehicle contains more than one material, and its listed weight is not the same as a measured amount of one recyclable metal. A raw-material price does not account for vehicle preparation, recovery, transport, or the buyer’s purchase terms.', 'Use weight as background information, not a guaranteed payment calculation. Our scrap-value-by-weight guide explains the distinction without publishing unverified market prices.'] },
      { heading: 'Location and loading access matter', paragraphs: ['A car accessible on pavement and one blocked inside a low garage can require different loading arrangements. Include the exact pickup city and setting, plus gates, slopes, soft ground, flat tires, or another car blocking the approach.', 'Ask about any removal charge while discussing the offer. A higher quoted amount is not necessarily the better result if fees or conditions change the amount you receive.'] },
      { heading: 'Compare complete offers on the same facts', paragraphs: ['Give each buyer the same current description and ask the same questions. Avoid comparing an unconditional-looking advertisement with a vehicle-specific offer that already includes the pickup details.'], items: ['What amount would I receive?', 'Does any removal or handling charge apply?', 'What conditions could change the offer?', 'How and when will payment be handled?', 'What documents and access are needed?', 'When is the pickup window actually confirmed?'] },
      { heading: 'Get a vehicle-specific answer', paragraphs: ['Call or text Merritt’s with the year, make, model, condition, pickup city, and title status. We review the car and explain the terms before you decide.', 'An offer may change with the vehicle or market conditions, so ask how long the terms apply. Do not rely on an old quote or an outdated article as a promise of today’s payment.'] },
    ],
    related: ['scrap-car-value-by-weight', 'repair-trade-in-or-sell-a-junk-car', 'minnesota-junk-car-documents'],
  },
};

const additions: Guide[] = [
  {
    slug: 'scrap-car-value-by-weight', title: 'Scrap car value by weight: what a calculator misses', shortTitle: 'Scrap value and vehicle weight',
    seoTitle: "Scrap Car Value by Weight: What to Know | Merritt's",
    description: 'Why multiplying a car’s weight by a scrap-metal price is not a reliable cash offer. Learn how completeness, loading, and pickup terms affect the comparison.',
    summary: 'A weight-based calculation can look precise while leaving out the parts of a vehicle purchase that matter. Ask for the net offer for the actual car and pickup setting.',
    updated: 'October 7, 2026', updatedIso: '2026-10-07', publishedIso: '2026-10-07', readingTime: '4 min read',
    sections: [
      { heading: 'A car is not a single pile of metal', paragraphs: ['Vehicle weight includes different metals, glass, plastics, rubber, fluids, and components. Multiplying the entire weight by one material price treats all of those things as if they were the same saleable material.', 'Online listings also may describe a different trim, drivetrain, or weight measure from your car. That makes a seemingly exact calculation less useful for deciding what you will receive.'] },
      { heading: 'Completeness changes the starting point', paragraphs: ['A complete vehicle and one missing its engine, transmission, wheels, or body panels are not equivalent. Describe removed components before asking a buyer to compare an offer.', 'Removing parts also can change how the vehicle loads. Do not dismantle it on the assumption that every item removed will increase your combined proceeds. Compare the actual costs, buyer terms, and effort first.'] },
      { heading: 'Pickup is part of the transaction', paragraphs: ['Distance, surface, access, and wheel condition affect the removal discussion. A car inside a low garage may need a different plan from a vehicle on an open paved driveway.', 'Ask whether the offer includes removal and whether any fee will be deducted. The important comparison is the amount you receive under the agreed conditions.'] },
      { heading: 'Check units and dates before trusting a rate', paragraphs: ['An advertised material rate may use pounds, a short ton, or a metric tonne, and it may concern a processed material rather than a complete vehicle. A number without its unit, material, date, and conditions is not a useful quote.', 'This guide does not publish a live metal rate or promise a fixed payout. Ask the buyer for current vehicle-specific terms instead of applying an old rate to a registration weight.'] },
      { heading: 'Use a practical offer checklist', paragraphs: ['Send the same details to buyers when comparing options.'], items: ['Year, make, model, and known condition', 'Missing parts and wheel or steering issues', 'Pickup city, surface, and access restrictions', 'Title and lien status', 'Amount payable after any agreed removal costs', 'Payment arrangements and offer validity'] },
    ],
    sources: [], related: ['what-affects-a-junk-car-offer', 'non-running-car-removal-checklist'],
  },
  {
    slug: 'repair-trade-in-or-sell-a-junk-car', title: 'Repair, trade in, or sell a junk car?', shortTitle: 'Compare your options',
    seoTitle: "Repair, Trade In, or Sell Your Junk Car? | Merritt's",
    description: 'Compare repairing a vehicle, selling it privately, trading it in, or discussing a junk-car offer. Consider costs, time, vehicle condition, and pickup needs.',
    summary: 'The best next step depends on your vehicle and priorities. Compare realistic net proceeds and effort rather than assuming every older or non-running car should be recycled.',
    updated: 'October 7, 2026', updatedIso: '2026-10-07', publishedIso: '2026-10-07', readingTime: '4 min read',
    sections: [
      { heading: 'Repairing and keeping the car', paragraphs: ['Start with a written estimate for the known problem, the vehicle’s overall condition, and other work it already needs. Compare the repair expense with the cost and practicality of a replacement.', 'Do not authorize work simply to obtain a junk-car offer. You can ask about selling it in its current condition while you compare alternatives.'] },
      { heading: 'Selling privately', paragraphs: ['A private sale may suit a vehicle another owner or project buyer wants. Consider the time to answer messages, arrange viewings, disclose condition, handle documents, and coordinate safe payment and removal.', 'An asking price is not a completed sale. Compare realistic proceeds and effort, especially when the car cannot be driven or must be removed by a deadline.'] },
      { heading: 'Trading it in', paragraphs: ['When buying another vehicle, ask the dealer whether it will accept your current car in its condition. Compare the complete transaction rather than focusing only on the trade-in figure.', 'A disabled vehicle may also require transport. Confirm who handles that cost and whether the trade-in offer depends on inspection or repair.'] },
      { heading: 'Discussing a junk-car offer', paragraphs: ['For an unwanted, damaged, or non-running vehicle, a buyer such as Merritt’s can review the car and pickup setting. Ask about the amount payable, any removal charge, documents, and how payment is handled.', 'The inquiry does not obligate you to accept an offer. Decide after the vehicle and transaction details are clear.'] },
      { heading: 'Compare the net outcome', paragraphs: ['Write down the likely outcome of each option using the same current vehicle description.'], items: ['Money received or spent after repairs, fees, and transport', 'Time required to complete the transaction', 'Documents and authority to sell', 'Access and removal arrangements', 'A deadline or ongoing storage expense', 'Your need for a replacement vehicle'] },
    ],
    sources: [], related: ['what-affects-a-junk-car-offer', 'minnesota-junk-car-documents', 'prepare-an-unwanted-car-for-pickup'],
  },
];
export const guides: Guide[] = [
  ...library.map((guide) => ({ ...guide, publishedIso: '2026-08-23', updatedIso: '2026-08-23', ...revisions[guide.slug] })),
  ...additions,
];
