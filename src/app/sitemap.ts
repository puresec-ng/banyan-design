import type { MetadataRoute } from 'next';
import { publicRoutes, siteConfig } from './site';

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteConfig.url}${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.startsWith('/services') ? 0.8 : 0.6,
  }));
}
