import type { Metadata } from "next";
import {
  buildArticleSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Real-Time Flight Tracker — Live Flight Map & Status",
  description:
    "Track any flight live on an interactive map. See real-time position, altitude, speed, route, and ETA. Free flight tracker covering 190+ countries with ADS-B data.",
  keywords: [
    "real time flight tracker",
    "live flight tracker",
    "flight tracking map",
    "track a flight",
    "flight radar live",
    "live flight status",
    "ADS-B flight tracker",
    "flight position live",
  ],
  alternates: { canonical: `${SITE_URL}/real-time-flight-tracker` },
  openGraph: {
    title: "Real-Time Flight Tracker — Live Flight Map & Status",
    description:
      "Track any flight live: position, altitude, speed, route, and ETA — updated every 30 seconds.",
    url: `${SITE_URL}/real-time-flight-tracker`,
    images: [
      { url: `${SITE_URL}/og-flight-tracker.jpg`, width: 1200, height: 630 },
    ],
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "How does real-time flight tracking work?",
    answer:
      "Aircraft broadcast their position, altitude, and speed via ADS-B (Automatic Dependent Surveillance–Broadcast) transponders. A worldwide network of ground receivers and satellites picks up these signals and forwards them to flight-tracking services like FlightAware.bot, which plots them on a live map refreshed every 15–30 seconds.",
  },
  {
    question: "Can I track a flight by flight number?",
    answer:
      "Yes. Enter any IATA or ICAO flight number (e.g., AA123 or AAL123) in the search bar. The tracker instantly shows the aircrafts live position, departure and arrival airports, scheduled vs. estimated times, and current altitude and speed.",
  },
  {
    question: "Which flights can I track in real time?",
    answer:
      "You can track commercial airline flights, private jets, cargo aircraft, and some military flights worldwide — over 180,000 flights per day. Coverage depends on ADS-B receiver density; North America, Europe, and Australia have near-complete coverage.",
  },
  {
    question: "How accurate is the live position on the map?",
    answer:
      "Position accuracy is typically within 50–100 metres horizontally when ADS-B data is available. Over oceans, positions rely on satellite ADS-B and are updated every 60–90 seconds with slightly wider margins.",
  },
  {
    question: "Why is my flight not showing on the tracker?",
    answer:
      "Some flights operate with transponders switched off (military, sensitive cargo), fly below receiver range, or are blocked by the airline or owner. Most scheduled commercial flights are fully trackable.",
  },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Real-Time Flight Tracker", url: "/real-time-flight-tracker" },
];

export default function RealTimeFlightTrackerPage() {
  const schemas = [
    buildArticleSchema({
      title: "Real-Time Flight Tracker — Live Flight Map & Status",
      description:
        "Track any flight live on an interactive map with ADS-B data updated every 30 seconds.",
      url: "/real-time-flight-tracker",
    }),
    buildFAQSchema(faqs),
    buildBreadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <a href="/">{SITE_NAME}</a>
            </li>
            <li aria-current="page">Real-Time Flight Tracker</li>
          </ol>
        </nav>

        <article>
          <h1>Real-Time Flight Tracker</h1>
          <p>
            <strong>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </strong>
          </p>

          <p>
            FlightAware.bot's real-time flight tracker lets you follow any
            commercial, cargo, or private aircraft on a live interactive map —
            refreshed every 15 to 30 seconds using the world's largest network
            of ADS-B receivers. Whether you're meeting a friend at the airport,
            monitoring a connecting flight, or simply fascinated by aviation,
            our free live flight tracker gives you the same professional-grade
            data used by airline operations centres.
          </p>

          <h2>How Real-Time Flight Tracking Works</h2>
          <p>
            Modern commercial aircraft are equipped with ADS-B (Automatic
            Dependent Surveillance–Broadcast) transponders that continuously
            broadcast the aircraft's GPS-derived position, altitude, ground
            speed, heading, and flight number on the 1090 MHz frequency. A
            global network of over 30,000 ground-based receivers — plus a
            growing constellation of satellites — captures these signals and
            relays them to FlightAware.bot's servers in under five seconds.
          </p>
          <p>
            The result: a live flight map that shows the aircraft's precise
            location, altitude in feet, speed in knots, vertical rate (climbing
            or descending), and an estimated time of arrival updated
            continuously as conditions change.
          </p>

          <h2>What You Can See on the Live Flight Map</h2>
          <ul>
            <li>
              <strong>Live aircraft position</strong> — updated every 15–30
              seconds via ADS-B and multilateration (MLAT)
            </li>
            <li>
              <strong>Altitude and flight level</strong> — displayed in feet or
              metres
            </li>
            <li>
              <strong>Ground speed and heading</strong> — in knots and degrees
            </li>
            <li>
              <strong>Planned vs. actual route</strong> — see if the flight is
              following its filed flight plan
            </li>
            <li>
              <strong>Departure and arrival airports</strong> — with gate
              information when available
            </li>
            <li>
              <strong>Scheduled, estimated, and actual times</strong> — so you
              know exactly when to head to arrivals
            </li>
            <li>
              <strong>Aircraft type and registration</strong> — find out if
              you're on a 737 or an A320
            </li>
            <li>
              <strong>Operator and airline livery</strong> — for quick visual
              identification
            </li>
          </ul>

          <h2>How to Track a Flight on FlightAware.bot</h2>
          <ol>
            <li>
              <strong>By flight number</strong> — Enter the IATA code (e.g.,{" "}
              <em>UA456</em>) or ICAO code (e.g., <em>UAL456</em>) and press
              Search.
            </li>
            <li>
              <strong>By tail number</strong> — Enter the aircraft registration
              (e.g., <em>N12345</em>) to track private or charter flights.
            </li>
            <li>
              <strong>By route</strong> — Search <em>JFK → LAX</em> to see all
              flights currently operating on that route.
            </li>
            <li>
              <strong>By airport</strong> — Browse departures and arrivals for
              any airport with live gate status.
            </li>
          </ol>

          <h2>Global Coverage: 190+ Countries</h2>
          <p>
            FlightAware.bot provides live flight tracking in more than 190
            countries. Coverage is densest across North America, Europe,
            Australia, and East Asia, where ADS-B ground station networks are
            mature. Over oceans and remote regions, satellite ADS-B — provided
            by partners including Aireon — fills the gaps, giving near-global
            coverage for the first time in aviation history.
          </p>

          <h2>Why Use FlightAware.bot for Flight Tracking?</h2>
          <p>
            Unlike apps that charge for live data or hide key details behind
            paywalls, FlightAware.bot provides real-time position, ETA, delay
            status, and weather context entirely free. Our servers process over
            100,000 position updates per second so you always see the freshest
            data available.
          </p>

          <h2>Frequently Asked Questions</h2>
          <dl>
            {faqs.map(({ question, answer }) => (
              <div key={question}>
                <dt>
                  <strong>{question}</strong>
                </dt>
                <dd>
                  <p>{answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </main>
    </>
  );
}
