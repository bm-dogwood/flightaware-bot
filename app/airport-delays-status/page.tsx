import type { Metadata } from 'next'
import { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema, SITE_URL, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Airport Delays & Status Board — Live Ground Stops & Ground Delays',
  description:
    'Check live airport delay status for every major US and international airport. See ground stops, ground delay programs, FAA advisories, and average delay times updated in real time.',
  keywords: [
    'airport delays',
    'airport delay status',
    'airport delay board',
    'FAA ground stop',
    'ground delay program',
    'airport status today',
    'flight delays airport',
    'airport delay tracker',
    'ATCSCC delays',
    'airport closure status',
  ],
  alternates: { canonical: `${SITE_URL}/airport-delays-status` },
  openGraph: {
    title: 'Airport Delays & Status Board — Live Ground Stops & Ground Delays',
    description: 'Real-time airport delay status: ground stops, FAA advisories, average delay minutes, and closure alerts.',
    url: `${SITE_URL}/airport-delays-status`,
    images: [{ url: `${SITE_URL}/og-airport-delays.jpg`, width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: 'What is a ground stop at an airport?',
    answer:
      'A ground stop (GS) is an FAA traffic management initiative that halts departures to a specific airport for a set period, usually due to weather, runway closures, or airspace congestion. Planes already en route continue; only new departures are held at their origin airports.',
  },
  {
    question: 'What is a Ground Delay Program (GDP)?',
    answer:
      'A Ground Delay Program meters the flow of traffic into a congested airport by delaying departures at origin airports rather than holding aircraft airborne. Average delays during a GDP range from 15 minutes to several hours depending on severity.',
  },
  {
    question: 'How often is the airport delay board updated?',
    answer:
      'FlightAware.bot refreshes airport delay data every two minutes using direct feeds from the FAA Air Traffic Control System Command Center (ATCSCC) and international equivalents such as Eurocontrol NMOC.',
  },
  {
    question: 'Which airports does the delay board cover?',
    answer:
      'The board covers all 500+ FAA-designated commercial service airports in the United States and more than 2,000 international airports. Filter by continent or country to narrow results.',
  },
  {
    question: 'What causes most airport delays?',
    answer:
      'Weather accounts for roughly 75% of delays — convective activity (thunderstorms), low visibility (fog), and high winds top the list. Equipment outages, staffing shortages, and high traffic volume make up most of the remainder.',
  },
]

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Airport Delays & Status', url: '/airport-delays-status' },
]

export default function AirportDelaysPage() {
  const schemas = [
    buildArticleSchema({
      title: 'Airport Delays & Status Board — Live Ground Stops & Ground Delays',
      description: 'Check live airport delay status for every major US and international airport.',
      url: '/airport-delays-status',
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
            <li aria-current="page">Airport Delays &amp; Status</li>
          </ol>
        </nav>

        <article>
          <h1>Airport Delays &amp; Status Board</h1>
          <p><strong>Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>

          <p>
            FlightAware.bot's airport delay board gives you a live overview of ground stops, ground delay programs, FAA advisories, and average delay times for every major airport in the United States and thousands of international airports.
            Bookmark this page to check delays before you leave for the airport.
          </p>

          <h2>Understanding the FAA Delay System</h2>
          <p>
            The FAA Air Traffic Control System Command Center (ATCSCC) in Warrenton, Virginia monitors the entire US airspace in real time and issues traffic management initiatives (TMIs) when demand for a resource — a runway, an airspace fix, or an airport — exceeds capacity.
            FlightAware.bot ingests these advisories within seconds and displays them on the delay board with plain-English summaries.
          </p>

          <h2>Types of Airport Delays Explained</h2>
          <ul>
            <li>
              <strong>Ground Stop (GS)</strong> — Stops all departures bound for an affected airport. Planes already airborne continue. Duration: typically 15 minutes to 2 hours.
            </li>
            <li>
              <strong>Ground Delay Program (GDP)</strong> — Spreads demand over time by assigning departure slots. Delays compound across the day; book the earliest flight to minimise impact.
            </li>
            <li>
              <strong>Airspace Flow Program (AFP)</strong> — Restricts flow through a congested en-route sector or fix, often caused by weather over the Midwest.
            </li>
            <li>
              <strong>Severe Weather Avoidance Program (SWAP)</strong> — Reroutes traffic around hazardous weather, adding distance and time to many flights.
            </li>
            <li>
              <strong>Departure Delay (DD)</strong> — Airport-level departure delays caused by runway or taxiway constraints, gate shortages, or crew availability.
            </li>
          </ul>

          <h2>Top Airports Frequently Affected by Delays</h2>
          <p>
            Certain airports are disproportionately delay-prone due to their geographic location, runway layout, or traffic volume. New York's JFK, LaGuardia (LGA), and Newark (EWR) consistently rank highest for average delay minutes, followed by San Francisco (SFO) — notorious for summer fog — and Chicago O'Hare (ORD), which sits in the path of Midwest weather systems.
          </p>
          <p>
            International hubs like London Heathrow (LHR), Frankfurt (FRA), and Amsterdam Schiphol (AMS) appear most frequently on European delay reports, largely due to slot-controlled congestion and cross-border weather systems.
          </p>

          <h2>How to Use the Airport Status Board</h2>
          <ol>
            <li>Search for your departure or arrival airport by name, city, or IATA code (e.g., <em>LAX</em>, <em>DFW</em>).</li>
            <li>View the current FAA advisory type and reason in plain English.</li>
            <li>See the average delay in minutes and the expected end time of the program.</li>
            <li>Enable push notifications to receive alerts when a new advisory is issued for your airport.</li>
          </ol>

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
