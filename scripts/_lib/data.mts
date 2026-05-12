import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const repoRoot = resolve(__dirname, '..', '..');
export const dataDir = resolve(repoRoot, 'data');

export type CityType = 'city' | 'county' | 'state';

export type City = {
  name: string;
  type: CityType;
  county: string;
  countyShort: string;
  lat: number;
  lng: number;
  population: number;
  milesFromYard: number;
  driveTime: string;
  neighborhoods: string[];
  landmarks: string[];
  nearby: string[];
  isYardCity?: boolean;
};

export type CitiesData = {
  _meta: {
    yardLat: number;
    yardLng: number;
    yardCity: string;
    titlePatterns: string[];
    metaPatterns: string[];
  };
  cities: Record<string, City>;
};

export type Address = {
  street: string;
  city: string;
  region: string;
  regionName: string;
  postalCode: string;
  country: string;
};

export type Business = {
  name: string;
  alternateName: string;
  legalName: string;
  founder: string;
  foundingDate: string;
  yearsInBusiness: number;
  vehiclesRecycled: number;
  satisfiedCustomers: number;
  ratingValue: string;
  reviewCount: number;
  phone: string;
  phoneDisplay: string;
  smsEnabled: boolean;
  email: string;
  address: Address;
  geo: { latitude: number; longitude: number };
  openingHours: { dayOfWeek: string[]; opens: string; closes: string }[];
  openingHoursDisplay: string;
  closedDays: string[];
  priceRange: string;
  paymentAccepted: string[];
  currenciesAccepted: string;
  areaServedCounties: string[];
  gbpCid?: string;
  gbpUrl?: string;
  hasMap?: string;
  sameAs: string[];
  social: { facebook: string; googleBusinessProfile?: string };
  knowsAbout: string[];
  ogImage: string;
  logo: string;
  siteUrl: string;
  businessId: string;
  organizationId: string;
  websiteId: string;
  themeColor: string;
  tagline: string;
  verification?: {
    google?: string;
    bing?: string;
    yandex?: string;
    pinterest?: string;
    norton?: string;
  };
};

export type FaqEntry = { question: string; answer: string };
export type CityFaqTemplate = { id: string; question: string; answer: string };
export type FaqsData = {
  global: FaqEntry[];
  perCity: CityFaqTemplate[];
  perCounty: CityFaqTemplate[];
};

export type ServicesData = {
  primary: { name: string; serviceType: string; description: string };
  vehicleTypes: string[];
  features: { name: string; description: string }[];
};

export type TestimonialReview = {
  author: string;
  rating: number;
  body: string;
};

export type TestimonialsData = {
  reviews: TestimonialReview[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  datePublished: string;
  dateModified: string;
  image: string;
  imageAlt: string;
  readTimeMinutes: number;
  wordCount: number;
  summary: string;
  relatedCitySlugs: string[];
  relatedPostSlugs: string[];
};

export type BlogData = {
  _meta: {
    author: string;
    publisher: string;
    imageBase: string;
  };
  posts: BlogPost[];
};

export async function loadCities(): Promise<CitiesData> {
  const raw = await readFile(resolve(dataDir, 'cities.json'), 'utf8');
  return JSON.parse(raw) as CitiesData;
}

export async function loadBusiness(): Promise<Business> {
  const raw = await readFile(resolve(dataDir, 'business.json'), 'utf8');
  return JSON.parse(raw) as Business;
}

export async function loadFaqs(): Promise<FaqsData> {
  const raw = await readFile(resolve(dataDir, 'faqs.json'), 'utf8');
  return JSON.parse(raw) as FaqsData;
}

export async function loadServices(): Promise<ServicesData> {
  const raw = await readFile(resolve(dataDir, 'services.json'), 'utf8');
  return JSON.parse(raw) as ServicesData;
}

export async function loadTestimonials(): Promise<TestimonialsData> {
  const raw = await readFile(resolve(dataDir, 'testimonials.json'), 'utf8');
  return JSON.parse(raw) as TestimonialsData;
}

export async function loadBlogPosts(): Promise<BlogData> {
  const raw = await readFile(resolve(dataDir, 'blog-posts.json'), 'utf8');
  return JSON.parse(raw) as BlogData;
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = vars[key];
    return v === undefined ? `{${key}}` : String(v);
  });
}

export function stableHashIndex(input: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}

export function canonicalUrlFor(_city: City, slug: string): string {
  if (slug === 'minnesota') {
    return 'https://merritts-auto-recycling.com/placemarks/minnesota';
  }
  return `https://merritts-auto-recycling.com/placemarks/${slug}`;
}

export function placemarkFilePath(slug: string): string {
  const filename = slug === 'minnesota' ? 'minnesota.html' : `${slug}.html`;
  return resolve(repoRoot, 'placemarks', filename);
}
