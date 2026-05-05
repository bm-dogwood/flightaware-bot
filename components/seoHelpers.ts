// Utility: generate a canonical <link> tag value for any page path.
// Use this in generateMetadata() functions:
//   alternates: { canonical: canonicalUrl('/real-time-flight-tracker') }

import { SITE_URL } from '@/lib/seo'

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

// Utility: standard OG image object builder
export function ogImage(filename: string, altText: string) {
  return [{ url: `${SITE_URL}/${filename}`, width: 1200, height: 630, alt: altText }]
}
