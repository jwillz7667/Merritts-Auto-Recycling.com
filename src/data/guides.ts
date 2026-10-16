import { guides as searchGuides, type Guide } from './search-guides';
import { recoveryGuideUpdates, recoveryGuides } from './recovery-guides';
export type { Guide, GuideSection } from './search-guides';

// One final public catalogue: preserve established URLs and publication dates.
export const guides: Guide[] = [
  ...searchGuides.map((guide) => ({ ...guide, ...recoveryGuideUpdates[guide.slug] })),
  ...recoveryGuides,
];
