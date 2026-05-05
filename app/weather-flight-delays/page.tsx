import type { Metadata } from 'next'
import { buildArticleSchema, buildFAQSchema, buildBreadcrumbSchema, SITE_URL, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Weather Impact on Flights — How Weather Causes Flight Delays & Cancellations',
  description:
    'Learn how weather affects flights: thunderstorms, fog, snow, and wind cause 75% of all delays. Check live weather-related delay alerts for airports worldwide.',
  keywords: [
    'weather flight delays',
    'weather impact on flights',
    'thunderstorm flight delay',
    'fog flight cancellation',
    'snow airport delays',
    'wind speed flight cancellation',
    'weather related flight delay',
    'aviation weather delays',
    'flight delay weather today',
    'hurricane flight cancellations',
  ],
  alternates: { canonical: `${SITE_URL}/weather-flight-delays` },
  openGraph: {
    title: 'Weather Impact on Flights — How Weather Causes Flight Delays & Cancellations',
    description: 'Weather causes 75% of flight delays. Learn how storms, fog, and wind affect your flights and track live weather alerts.',
    url: `${SITE_URL}/weather-flight-delays`,
    images: [{ url: `${SITE_URL}/og-weather-delays.jpg`, width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: 'What types of weather cause the most flight delays?',
    answer:
      'Convective weather (thunderstorms) causes the majority of weather-related delays in the US, particularly in summer. Winter storms (ice, snow, freezing rain) cause the most cancellations. Low visibility from fog is a leading cause of delays at coastal airports year-round.',
  },
  {
    question: 'At what wind speed do flights get cancelled?',
    answer:
      'There is no universal wind speed threshold — it depends on aircraft type, runway orientation, and crosswind limits. Most commercial jets have crosswind limits between 25–38 knots (29–44 mph). Operations continue in strong headwinds but crosswinds and tailwinds are more limiting.',
  },
  {
    question: 'Can a flight take off during a thunderstorm?',
    answer:
      'Aircraft generally avoid flying through active thunderstorm cells, but can fly around them. Departure delays occur when storms are directly over or near an airport. The FAA issues ground stops when convective activity makes approach or departure paths unsafe.',
  },
  {
    question: 'Does rain cause flight delays?',
    answer:
      'Light to moderate rain alone rarely causes delays. Heavy rain reduces visibility and can affect runway braking performance. The bigger factor is the associated convective activity (lightning, wind shear, microbursts) that often accompanies heavy rainfall.',
  },
  {
    question: 'How far in advance can weather delays be predicted?',
    answer:
      'The aviation weather community can identify high-risk delay days 3–5 days in advance using ensemble forecast models. Specific delay programs and ground stops are typically issued 2–6 hours before impact.',
  },
]

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Weather Impact on Flights', url: '/weather-flight-delays' },
]

export default function WeatherFlightDelaysPage() {
  const schemas = [
    buildArticleSchema({
      title: 'Weather Impact on Flights — How Weather Causes Flight Delays & Cancellations',
      description: 'How weather affects flights: thunderstorms, fog, snow, and wind cause 75% of all delays.',
      url: '/weather-flight-delays',
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
            <li aria-current="page">Weather Impact on Flights</li>
          </ol>
        </nav>

        <article>
          <h1>Weather Impact on Flights</h1>
          <p><strong>Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></p>

          <p>
            Weather is the single largest cause of flight disruption, accounting for approximately 75% of all delays and the majority of cancellations.
            Understanding how different weather phenomena affect aviation helps travellers make smarter booking decisions and plan around disruption more effectively.
          </p>

          <h2>The Five Major Weather Threats to Aviation</h2>

          <h3>1. Thunderstorms and Convective Activity</h3>
          <p>
            Thunderstorms produce lightning, turbulence, hail, microbursts (sudden downdrafts), and heavy precipitation — all of which are hazardous to aircraft.
            Even if a storm isn't directly over an airport, controllers must reroute traffic around convective cells, reducing the number of aircraft that can arrive or depart per hour and generating systemwide delays.
            The peak thunderstorm season in the continental US runs from May through September, with the highest impact in the Southeast and Midwest.
          </p>

          <h3>2. Winter Precipitation (Snow, Ice, Freezing Rain)</h3>
          <p>
            Ice and snow require de-icing and anti-icing treatment before departure, adding 15–45 minutes per aircraft and reducing overall throughput.
            Freezing rain is particularly disruptive — runways can become slippery, and anti-icing fluid is less effective against freezing rain than against snowfall.
            Major winter storms can close airports entirely for hours and trigger thousands of cancellations across airline networks.
          </p>

          <h3>3. Low Visibility (Fog and Mist)</h3>
          <p>
            When visibility drops below certain minimums, airports switch to Instrument Landing System (ILS) approaches, which require greater separation between aircraft and reduce the number of landings per hour by 30–50%.
            Dense fog that drops visibility below 600 metres (Category III conditions) can halt operations at airports without the requisite precision approach systems.
            San Francisco, London Heathrow, Amsterdam, and Brussels are among the airports most frequently affected by low-visibility procedures.
          </p>

          <h3>4. High Winds and Crosswinds</h3>
          <p>
            All aircraft have certified crosswind limits. When crosswind components exceed these limits on the available runways, aircraft must divert or wait for wind direction to shift.
            Strong headwinds add flight time, increasing fuel burn and sometimes requiring a fuel stop on long-haul routes.
            Wind shear — a rapid change in wind speed or direction over a short distance — is particularly dangerous during approach and departure and can trigger go-arounds.
          </p>

          <h3>5. Volcanic Ash and Extreme Events</h3>
          <p>
            Volcanic ash clouds are invisible to weather radar and can cause catastrophic engine damage.
            When Iceland's Eyjafjallajökull erupted in 2010, over 100,000 flights were cancelled across Europe over six days.
            Volcanic ash advisories from the nine Volcanic Ash Advisory Centres (VAACs) worldwide appear on FlightAware.bot's weather overlay in real time.
          </p>

          <h2>How FlightAware.bot Shows Weather Delays</h2>
          <p>
            Toggle the weather layer on the live flight map to overlay NEXRAD radar, surface analysis charts, and pilot reports (PIREPs).
            The airport delay board highlights weather-caused delays in amber and severe weather alerts in red, with a plain-English explanation of the meteorological cause.
          </p>

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
