import type { Metadata } from 'next'
import { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema, SITE_URL, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Flight Route Search — Find Flights Between Any Two Airports',
  description:
    'Search flight routes between any two airports worldwide. See all airlines, schedules, average flight times, and current on-time performance for every route — free.',
  keywords: [
    'flight route search',
    'flights between airports',
    'route finder flights',
    'direct flights',
    'nonstop flights',
    'flight schedule lookup',
    'airport to airport flights',
    'airline route map',
    'flight path search',
  ],
  alternates: { canonical: `${SITE_URL}/flight-route-search` },
  openGraph: {
    title: 'Flight Route Search — Find Flights Between Any Two Airports',
    description: 'Discover all airlines, schedules, and on-time stats for any route worldwide.',
    url: `${SITE_URL}/flight-route-search`,
    images: [{ url: `${SITE_URL}/og-route-search.jpg`, width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: 'How do I find all flights on a specific route?',
    answer:
      'Enter the origin and destination airport codes (e.g., JFK → LHR) in the route search. FlightAware.bot returns all airlines operating that route, their scheduled frequencies, average block times, and current on-time performance ratings.',
  },
  {
    question: 'Can I search for nonstop flights only?',
    answer:
      'Yes. Toggle the "Nonstop only" filter to hide connecting itineraries and see only direct flights between your chosen airports.',
  },
  {
    question: 'How far back does historical route data go?',
    answer:
      'Route history is available for the past 12 months, including schedule changes, airline additions and removals, and seasonal frequency variations.',
  },
  {
    question: 'Does route search show cargo or charter flights?',
    answer:
      'Yes. Toggle between commercial passenger, all-cargo, and charter tabs to explore the full picture of traffic on any route.',
  },
]

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Flight Route Search', url: '/flight-route-search' },
]

export default function FlightRouteSearchPage() {
  const schemas = [
    buildArticleSchema({
      title: 'Flight Route Search — Find Flights Between Any Two Airports',
      description: 'Search flight routes between any two airports worldwide.',
      url: '/flight-route-search',
    }),
    buildFAQSchema(faqs),
    buildBreadcrumbSchema(breadcrumbs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">{SITE_NAME}</a></li>
            <li aria-current="page">Flight Route Search</li>
          </ol>
        </nav>

        <article>
          <h1>Flight Route Search</h1>
          <p><strong>Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></p>

          <p>
            FlightAware.bot's flight route search lets you explore every airline operating between any pair of airports worldwide.
            Compare schedules, typical flight times, and on-time performance — then track any specific flight live once you've found it.
          </p>

          <h2>How to Use Flight Route Search</h2>
          <p>
            Type an origin airport (IATA code or city name) and a destination. The tool instantly returns a route summary showing which airlines serve that pair, how many times per week they operate, the average block time (gate to gate), and the rolling 30-day on-time performance percentage.
          </p>
          <p>
            Click any airline row to drill into individual flight numbers, departure times, and equipment type (aircraft model).
            From there, jump directly to the live flight tracker for any departure.
          </p>

          <h2>Understanding Route Data</h2>
          <p>
            Route data is built from a combination of schedule feeds submitted by airlines to the Official Airline Guide (OAG), actual operations data from FAA and Eurocontrol, and FlightAware.bot's own historical flight records going back 12 months.
            This means you see not just what airlines plan to operate, but what they actually fly — including irregular operations and wet-lease substitutions.
          </p>

          <h2>Popular Routes Searched Today</h2>
          <ul>
            <li>New York JFK → London Heathrow (LHR) — transatlantic benchmark route</li>
            <li>Los Angeles (LAX) → New York JFK — busiest US domestic corridor</li>
            <li>Dubai (DXB) → London Heathrow (LHR) — world's busiest international route by seats</li>
            <li>Sydney (SYD) → Melbourne (MEL) — world's busiest domestic route</li>
            <li>Chicago O'Hare (ORD) → Dallas/Fort Worth (DFW) — high-frequency business corridor</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          <dl>
            {faqs.map(({ question, answer }) => (
              <div key={question}>
                <dt><strong>{question}</strong></dt>
                <dd><p>{answer}</p></dd>
              </div>
            ))}
          </dl>
        </article>
      </main>
    </>
  )
}
