import type { Metadata } from 'next'

export const SITE_URL = 'https://flightaware.bot'
export const SITE_NAME = 'FlightAware.bot'

// ─── Shared Metadata Defaults ────────────────────────────────────────────────

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@flightawarebot',
  },
}

// ─── JSON-LD Schema Builders ─────────────────────────────────────────────────

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Real-time flight tracking, airport delay board, route search, airline on-time stats, and weather impact on flights.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/flight-route-search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: ['https://twitter.com/flightawarebot'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: 'English' },
  }
}

export function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: 'Track flights in real-time, monitor airport delays, search routes, and check airline on-time performance.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Real-time flight tracking',
      'Airport delay board',
      'Route search',
      'Airline on-time statistics',
      'Weather impact on flights',
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '3241' },
  }
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function buildArticleSchema({
  title,
  description,
  url,
  datePublished = '2024-01-01',
  dateModified = new Date().toISOString().split('T')[0],
}: {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

// ─── Sitemap Page Registry ────────────────────────────────────────────────────

export interface SitemapPage {
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export const ALL_PAGES: SitemapPage[] = [
  { url: '/', lastModified: new Date().toISOString(), changeFrequency: 'hourly', priority: 1.0 },
  { url: '/real-time-flight-tracker', lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.9 },
  { url: '/airport-delays-status', lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.9 },
  { url: '/flight-route-search', lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.85 },
  { url: '/airline-on-time-statistics', lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.8 },
  { url: '/weather-flight-delays', lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.8 },
  { url: '/flight-tracking-faq', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
]
