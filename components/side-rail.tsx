// components/side-rail.tsx
"use client";

import Link from "next/link";

export function SideRail() {
  const links = [
    { label: "FAA ATCSCC", href: "https://www.fly.faa.gov/", code: "01" },
    {
      label: "AeroAPI",
      href: "https://www.flightaware.com/aeroapi/",
      code: "02",
    },
    { label: "Aviation WX", href: "https://aviationweather.gov/", code: "03" },
    { label: "FlightAware", href: "https://flightaware.com/", code: "04" },
  ];
  return (
    <aside className="hidden xl:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-px border border-border/60 bg-card/60 backdrop-blur-md">
      <div className="px-2 py-1.5 font-mono text-[9px] tracking-[0.2em] text-amber border-b border-border/60">
        DATA·LINK
      </div>
      {links.map((l) => (
        <a
          key={l.code}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 px-2 py-2 hover:bg-secondary/60 transition-colors"
          title={l.label}
        >
          <span className="font-mono text-[10px] text-muted-foreground group-hover:text-amber">
            {l.code}
          </span>
          <span className="font-mono text-[9px] tracking-widest text-foreground/80 group-hover:text-amber [writing-mode:vertical-rl] rotate-180">
            {l.label}
          </span>
        </a>
      ))}
    </aside>
  );
}

export function FooterStrip() {
  return (
    <footer className="mt-12 border-t border-border/60 bg-background/60">
      <div className="max-w-[1600px] mx-auto px-6 py-8 grid md:grid-cols-4 gap-6 font-mono text-xs">
        <div>
          <div className="text-amber tracking-[0.3em] mb-3">
            FLIGHTAWARE.BOT
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Real-time flight intelligence, delay analytics and weather impact
            assessment for the global airspace system.
          </p>
        </div>
        <div>
          <div className="text-foreground tracking-widest mb-3">NAVIGATE</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-amber">
                Live Map
              </Link>
            </li>
            <li>
              <Link href="/delays" className="hover:text-amber">
                Delay Board
              </Link>
            </li>
            <li>
              <Link href="/routes" className="hover:text-amber">
                Route Search
              </Link>
            </li>
            <li>
              <Link href="/airlines" className="hover:text-amber">
                Airline OTP
              </Link>
            </li>
            <li>
              <Link href="/weather" className="hover:text-amber">
                Weather Impact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-foreground tracking-widest mb-3">
            DATA SOURCES
          </div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <a
                className="hover:text-amber"
                href="https://www.flightaware.com/aeroapi/"
                target="_blank"
                rel="noreferrer"
              >
                FlightAware AeroAPI
              </a>
            </li>
            <li>
              <a
                className="hover:text-amber"
                href="https://www.fly.faa.gov/"
                target="_blank"
                rel="noreferrer"
              >
                FAA ATCSCC
              </a>
            </li>
            <li>
              <a
                className="hover:text-amber"
                href="https://aviationweather.gov/api/"
                target="_blank"
                rel="noreferrer"
              >
                Aviation Weather API
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-foreground tracking-widest mb-3">SYSTEM</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <span className="text-radar">●</span> ADS-B receivers nominal
            </li>
            <li>
              <span className="text-amber">●</span> ATCSCC feed: live
            </li>
            <li>
              <span className="text-radar">●</span> METAR/TAF: 4 min ago
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-6 py-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground tracking-widest">
        <span>© FLIGHTAWARE.BOT · UNOFFICIAL FAN INTERFACE</span>
        <span className="text-amber">SQUAWK 1200 · VFR</span>
      </div>
    </footer>
  );
}
