import type { Metadata } from "next";
import {
  buildArticleSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Airline On-Time Statistics — Best & Worst Airlines for Punctuality",
  description:
    "Compare on-time performance for every major airline. Monthly updated rankings show which airlines arrive on time, cancel most flights, and have the longest average delays.",
  keywords: [
    "airline on time statistics",
    "airline punctuality ranking",
    "most on time airline",
    "best airline for delays",
    "airline delay statistics",
    "flight cancellation rates",
    "airline performance data",
    "on time performance airline",
    "worst airlines for delays",
    "DOT airline statistics",
  ],
  alternates: { canonical: `${SITE_URL}/airline-on-time-statistics` },
  openGraph: {
    title: "Airline On-Time Statistics — Best & Worst Airlines for Punctuality",
    description:
      "Monthly airline rankings: on-time arrivals, cancellation rates, and average delay minutes.",
    url: `${SITE_URL}/airline-on-time-statistics`,
    images: [
      { url: `${SITE_URL}/og-airline-stats.jpg`, width: 1200, height: 630 },
    ],
  },
};

const faqs = [
  {
    question: "How is airline on-time performance calculated?",
    answer:
      "The US Department of Transportation (DOT) counts a flight as on-time if it arrives within 15 minutes of its scheduled arrival time. On-time percentage is the share of operated flights meeting that threshold, excluding cancellations.",
  },
  {
    question: "Which airline has the best on-time performance?",
    answer:
      "Rankings shift monthly. Historically, Delta Air Lines, Alaska Airlines, and Hawaiian Airlines consistently score above 80% on-time for US domestic operations. Check the live ranking table for the current months leader.",
  },
  {
    question: "What is a good on-time arrival rate for an airline?",
    answer:
      "Anything above 80% is generally considered good in the industry. Top performers regularly exceed 85%. Below 75% warrants concern, especially if cancellation rates are also elevated.",
  },
  {
    question: "Does on-time performance vary by season?",
    answer:
      "Yes significantly. Winter (December–February) and summer peak season (June–August) see the most delays and cancellations due to weather. Spring typically offers the best on-time performance industry-wide.",
  },
  {
    question: "How often is on-time data updated?",
    answer:
      "DOT publishes official monthly reports with a ~45-day lag. FlightAware.bot supplements this with real-time operational data so you can see rolling 30-day performance for any airline, updated daily.",
  },
];

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Airline On-Time Statistics", url: "/airline-on-time-statistics" },
];

export default function AirlineOnTimeStatsPage() {
  const schemas = [
    buildArticleSchema({
      title:
        "Airline On-Time Statistics — Best & Worst Airlines for Punctuality",
      description:
        "Compare on-time performance for every major airline with monthly updated rankings.",
      url: "/airline-on-time-statistics",
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
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <a href="/">{SITE_NAME}</a>
            </li>
            <li aria-current="page">Airline On-Time Statistics</li>
          </ol>
        </nav>

        <article>
          <h1>Airline On-Time Statistics</h1>
          <p>
            <strong>
              Data through:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </strong>
          </p>

          <p>
            Choosing an airline that runs on time can make the difference
            between a smooth trip and a missed connection. FlightAware.bot
            aggregates US Department of Transportation data with live
            operational feeds to give you the most current airline punctuality
            rankings available — updated daily.
          </p>

          <h2>How On-Time Performance Is Measured</h2>
          <p>
            The DOT Bureau of Transportation Statistics (BTS) requires US
            carriers operating more than one percent of domestic
            scheduled-service passenger revenues to report detailed on-time data
            monthly. A flight is officially counted as "on-time" if the aircraft
            pushes back from the gate within 15 minutes of its scheduled
            departure time and arrives at the destination gate within 15 minutes
            of its scheduled arrival.
          </p>
          <p>
            FlightAware.bot's rolling 30-day metric uses the same 15-minute
            threshold applied to actual gate-in times from ADS-B and ACARS data,
            giving you near-real-time performance figures weeks before DOT
            publishes its official report.
          </p>

          <h2>Key Metrics Explained</h2>
          <ul>
            <li>
              <strong>On-Time Arrival Rate (%)</strong> — Percentage of flights
              arriving within 15 minutes of schedule. The headline metric most
              travellers care about.
            </li>
            <li>
              <strong>Cancellation Rate (%)</strong> — Percentage of scheduled
              flights that were cancelled. High cancellation rates often signal
              operational instability.
            </li>
            <li>
              <strong>Average Delay (minutes)</strong> — Average minutes late
              for delayed flights only. A low average here means delays, when
              they happen, are short.
            </li>
            <li>
              <strong>Tarmac Delay Rate</strong> — Percentage of flights where
              passengers sat on the tarmac more than 3 hours — a DOT enforcement
              threshold.
            </li>
            <li>
              <strong>Mishandled Bags (per 1,000)</strong> — Bags lost, delayed,
              damaged, or pilfered per thousand enplaned passengers.
            </li>
          </ul>

          <h2>Factors That Affect Airline Punctuality</h2>
          <p>
            Airlines don't operate in a vacuum. Network structure, hub
            concentration, aircraft age, crew scheduling practices, and the
            geographic locations they serve all influence on-time performance.
            An airline concentrated in weather-prone hubs like Chicago O'Hare or
            New York will face structural headwinds that a Hawaii-focused
            carrier avoids. Point-to-point airlines with shorter average stage
            lengths also tend to recover from delays faster than hub-and-spoke
            carriers with complex connection banks.
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
