// app/flight-tracking-faq/page.tsx
import type { Metadata } from "next";
import {
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildArticleSchema,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Flight Tracking FAQ — Frequently Asked Questions About Tracking Flights",
  description:
    "Answers to the most common flight tracking questions: how to track a flight, why a flight is not showing, what ADS-B is, and more — from FlightAware.bot.",
  keywords: [
    "flight tracking FAQ",
    "how to track a flight",
    "flight tracker questions",
    "ADS-B explained",
    "flight not showing on tracker",
    "how does flight tracking work",
    "flight tracker accuracy",
    "can I track a private jet",
    "flight tracking without flight number",
  ],
  alternates: { canonical: `${SITE_URL}/flight-tracking-faq` },
  openGraph: {
    title: "Flight Tracking FAQ — All Your Questions Answered",
    description:
      "How does flight tracking work? Why isn't my flight showing? What is ADS-B? Get answers on FlightAware.bot.",
    url: `${SITE_URL}/flight-tracking-faq`,
    images: [{ url: `${SITE_URL}/og-faq.jpg`, width: 1200, height: 630 }],
  },
};

const allFAQs = [
  {
    question: "How does flight tracking work?",
    answer:
      "Aircraft transmit their GPS position, altitude, speed, and flight number via ADS-B (Automatic Dependent Surveillance–Broadcast) transponders. A global network of ground stations and satellites receives these signals and forwards them to platforms like FlightAware.bot, which display them on a live map updated every 15–30 seconds.",
  },
  {
    question: "Can I track a flight without knowing the flight number?",
    answer:
      "Yes. You can track flights by tail number (aircraft registration), by route (e.g., LAX → ORD), or by browsing an airport's live departure and arrival board. If you know the airline and approximate departure time, you can identify the flight from the airport board.",
  },
  {
    question: "Why isn't my flight showing on the tracker?",
    answer:
      "Several reasons: the aircraft's transponder may be off or malfunctioning; the flight may be in an area with sparse ADS-B coverage (remote ocean, polar regions); the operator may have blocked tracking; or the flight may have been cancelled or not yet entered the system. Military and some government flights do not appear.",
  },
  {
    question: "What is ADS-B and why does it matter?",
    answer:
      "ADS-B stands for Automatic Dependent Surveillance–Broadcast. It is the primary technology behind modern flight tracking. The FAA mandated ADS-B Out for most US airspace from January 2020. It is more accurate, more reliable, and lower cost than traditional radar surveillance.",
  },
  {
    question: "Can I track a private jet?",
    answer:
      "Many private jets broadcast ADS-B and are trackable by default. However, owners and operators can request LADD (Limiting Aircraft Data Displayed) status with the FAA, which removes the aircraft from public tracking feeds while preserving safety-critical ATC visibility.",
  },
  {
    question: "How accurate is live flight position data?",
    answer:
      "Within ADS-B coverage (most of North America, Europe, Australia, and East Asia), position accuracy is typically within 50–100 metres. Over oceans using satellite ADS-B, accuracy is 1–3 km with 60–90 second update intervals.",
  },
  {
    question: "Why does a flight's ETA keep changing?",
    answer:
      "ETA is continuously recalculated based on actual airspeed, altitude, winds aloft, and Air Traffic Control routing. A flight that catches a strong tailwind may arrive 20+ minutes early; one held in a stack waiting to land may arrive late even after departing on time.",
  },
  {
    question: 'What does "estimated" vs "actual" departure time mean?',
    answer:
      '"Scheduled" is the published timetable time. "Estimated" is the current prediction based on gate readiness, ATC slot, and taxi time. "Actual" is recorded once the aircraft lifts off (wheels-up) or, for departure, when the aircraft pushes back from the gate.',
  },
  {
    question: "Can FlightAware.bot show me historical flight data?",
    answer:
      "Yes. FlightAware.bot maintains 12 months of historical flight data accessible by flight number, tail number, or route. You can see past departure and arrival times, delays, routing, and aircraft type for any specific date.",
  },
  {
    question: "Is FlightAware.bot free to use?",
    answer:
      "Yes. All core features — live tracking, airport delays, route search, and airline stats — are free with no account required. Advanced features like extended history and bulk data exports may require registration.",
  },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Flight Tracking FAQ", url: "/flight-tracking-faq" },
];

export default function FlightTrackingFAQPage() {
  const schemas = [
    buildFAQSchema(allFAQs),
    buildBreadcrumbSchema(breadcrumbs),
    buildArticleSchema({
      title:
        "Flight Tracking FAQ — Frequently Asked Questions About Tracking Flights",
      description:
        "Comprehensive answers to the most common questions about real-time flight tracking.",
      url: "/flight-tracking-faq",
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <a href="/">{SITE_NAME}</a>
            </li>
            <li aria-current="page">Flight Tracking FAQ</li>
          </ol>
        </nav>

        <article>
          <h1>Flight Tracking — Frequently Asked Questions</h1>
          <p>
            Everything you need to know about tracking flights, understanding
            flight data, and getting the most from FlightAware.bot.
          </p>

          <dl>
            {allFAQs.map(({ question, answer }) => (
              <div key={question} style={{ marginBottom: "2rem" }}>
                <dt>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {question}
                  </h2>
                </dt>
                <dd>
                  <p>{answer}</p>
                </dd>
              </div>
            ))}
          </dl>

          <h2>Still Have Questions?</h2>
          <p>
            Browse our other guides:{" "}
            <a href="/real-time-flight-tracker">
              How the live flight tracker works
            </a>
            ,{" "}
            <a href="/airport-delays-status">
              understanding airport delay types
            </a>
            , and{" "}
            <a href="/weather-flight-delays">how weather impacts flights</a>.
          </p>
        </article>
      </main>
    </>
  );
}
