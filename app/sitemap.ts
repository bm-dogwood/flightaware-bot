import type { MetadataRoute } from 'next'
import { ALL_PAGES } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_PAGES.map((page) => ({
    url: `https://flightaware.bot${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
