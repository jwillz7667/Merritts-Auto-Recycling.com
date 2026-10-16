import { coverageRegions, serviceAreas as existingAreas } from './metro-existing';
import { recoveredAreas } from './recovery-areas';
export { coverageRegions } from './metro-existing';
export type { ServiceArea } from './metro-existing';
export const coverageCities = [...new Set(coverageRegions.flatMap((region) => [...region.cities]))];
export const serviceAreas = [...existingAreas, ...recoveredAreas];
export const areaServedSchema = coverageCities.map((city) => ({ '@type': 'City', name: `${city === 'St. Paul' ? 'Saint Paul' : city}, Minnesota` }));
