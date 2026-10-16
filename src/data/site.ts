// Business content stays independent from the complete route inventory.
import { publishedRoutes as establishedRoutes } from './business-content';
import { regionalRoutes } from './service-regions';
export * from './business-content';
export const publishedRoutes = [...establishedRoutes, '/get-a-quote', '/service-regions', ...regionalRoutes] as const;
