import { guides as searchGuides, type Guide } from './search-guides';
import { recoveryGuideUpdates, recoveryGuides } from './recovery-guides';
import { legacyGuideUpdates, restoredMinneapolisGuide } from './legacy-guide-restoration';
export type { Guide, GuideSection } from './search-guides';

// Final publication review uses the primary plate statute rather than extending
// ordinary-transfer advice into a universal rule for a scrap transaction.
const reviewedRecoveryGuides = recoveryGuides.map((guide): Guide => guide.slug !== 'minnesota-license-plates-before-junking' ? guide : {
  ...guide,
  sections: [
    { heading: 'Can I keep the plates or move them to another car?', paragraphs: [
      'Do not assume that removing plates lets you use them on a replacement car. Minnesota Statutes 168.12 generally restricts moving issued plates and registration stickers to a different vehicle during their registration period, with specified exceptions. Personalized and other eligible plate transfers follow their own rules.',
      'For a car being sold for scrap, identify the plate type and ask DVS or a deputy registrar whether the plates should stay, be retained, transferred through an application, or disposed of for that transaction. Coordinate this with the buyer’s vehicle-identification and receipt process before pickup. A rule about transferring plates is not a universal instruction about physically removing them from every junk car.',
    ] },
    ...guide.sections.slice(1),
  ],
  sources: guide.sources.filter((source) => !source.href.includes('mncourts.gov')),
});
// Preserve established URLs and original publication dates.
const currentGuides: Guide[] = [
  ...searchGuides.map((guide) => ({ ...guide, ...recoveryGuideUpdates[guide.slug] })),
  ...reviewedRecoveryGuides,
];
export const guides: Guide[] = [
  ...currentGuides.map((guide) => ({ ...guide, ...legacyGuideUpdates[guide.slug] })),
  restoredMinneapolisGuide,
];
