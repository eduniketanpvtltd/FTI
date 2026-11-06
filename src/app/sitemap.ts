import type { MetadataRoute } from 'next';
import { INITIAL_CATEGORIES } from '@/lib/db-store';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://fieldfast.in');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/market`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/raw-materials`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/fasteners`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tractor-parts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = INITIAL_CATEGORIES.filter((c) => !c.isComingSoon).map(
    (cat) => ({
      url: `${SITE_URL}/raw-materials/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  );

  return [...staticRoutes, ...categoryRoutes];
}

