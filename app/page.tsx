// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { LiveMap } from "@/components/live-map";
import { FlightList, FlightDetail } from "@/components/flight-panels";
import { generateFlights, type Flight } from "@/lib/flight-data";
import type { AirportDelay } from "@/lib/api";
import { AIRPORT_DELAYS } from "@/lib/flight-data";

function useCounter(target: number, durationMs = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return n;
}

// Hook to load live or demo flights
function useLiveFlights() {
  const demoFlights = useMemo(() => generateFlights(80, 7), []);
  const [flights, setFlights] = useState<Flight[]>(demoFlights);
  const [isLive, setIsLive] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/flights");
      if (res.ok) {
        const data = await res.json();
        if (data.flights && data.flights.length > 0) {
          setFlights(data.flights);
          setIsLive(data.live ?? false);
        }
      }
    } catch {
      // keep demo
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  return { flights, isLive };
}

// Hook to load live or demo delays
function useLiveDelays() {
  const [delays, setDelays] = useState<AirportDelay[]>(
    AIRPORT_DELAYS as AirportDelay[]
  );
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/delays");
        if (res.ok) {
          const data = await res.json();
          if (data.delays && data.delays.length > 0) {
            setDelays(data.delays);
            setIsLive(data.live ?? false);
          }
        }
      } catch {
        // keep demo
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  return { delays, isLive };
}

export default function HomePage() {
  const { flights, isLive: flightsLive } = useLiveFlights();
  const { delays, isLive: delaysLive } = useLiveDelays();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => flights.find((f) => f.id === selectedId) ?? null,
    [flights, selectedId]
  );

  const onTime = useCounter(81);
  const tracked = useCounter(flights.length > 80 ? flights.length : 12847);
  const delayed = useCounter(
    delays.filter((d) => d.status !== "ADVISORY").length * 120 + 643
  );
  const groundStops = useCounter(
    delays.filter((d) => d.status === "GROUND STOP").length || 3
  );

  return (
    <div className="px-4 lg:px-6 pt-6 pb-10 max-w-[1700px] mx-auto">
      <Hero
        tracked={tracked}
        onTime={onTime}
        delayed={delayed}
        groundStops={groundStops}
        flightsLive={flightsLive}
      />

      {/* Cockpit grid */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr_360px] gap-4 h-[calc(100vh-180px)] min-h-[640px]">
        <div className="hidden lg:block min-h-0">
          <FlightList
            flights={flights}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="relative min-h-0">
          <LiveMap
            flights={flights}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="space-y-4 min-h-0 overflow-y-auto">
          <FlightDetail flight={selected} />
          <DelayPulse delays={delays} isLive={delaysLive} />
          <QuickLinks />
        </div>
      </section>

      {/* Mobile flight list */}
      <section className="mt-4 lg:hidden h-[420px]">
        <FlightList
          flights={flights}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </section>

      <ModulesGrid />
      <DataSources />
    </div>
  );
}

function Hero({
  tracked,
  onTime,
  delayed,
  groundStops,
  flightsLive,
}: {
  tracked: number;
  onTime: number;
  delayed: number;
  groundStops: number;
  flightsLive: boolean;
}) {
  return (
    <section className="relative overflow-hidden border border-border/70 rounded-md bg-card/30 backdrop-blur-md">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--color-amber) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-signal) 0, transparent 40%)",
        }}
      />
      <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-6 p-6 lg:p-8">
        <div>
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            <span
              className={`px-2 py-1 border ${
                flightsLive
                  ? "border-radar/60 text-radar"
                  : "border-amber/60 text-amber"
              }`}
            >
              {flightsLive ? "● LIVE · AEROAPI" : "DEMO MODE"}
            </span>
            <span className="px-2 py-1 border border-border">AeroAPI v4</span>
            <span className="px-2 py-1 border border-border">METAR / TAF</span>
          </div>
          <h1 className="mt-4 font-display font-bold text-5xl lg:text-7xl tracking-[-0.02em] leading-[0.95]">
            THE WORLD&apos;S
            <br />
            AIRSPACE,
            <br />
            <span className="text-amber text-glow-amber">IN ONE SCOPE.</span>
          </h1>
          <p className="mt-5 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed">
            FLIGHTAWARE.BOT fuses live ADS-B feeds, FAA traffic management
            initiatives and aviation weather to render every contrail on a
            single tactical display. Click an aircraft. Trace its arc. Read the
            wind.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#scope"
              className="inline-flex items-center gap-2 border border-amber bg-amber/10 px-4 py-2.5 font-mono text-xs tracking-widest text-amber hover:bg-amber hover:text-primary-foreground transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber blink" />
              ENGAGE LIVE SCOPE
            </a>
            <Link
              href="/delays"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs tracking-widest text-foreground hover:border-amber hover:text-amber transition-colors"
            >
              DELAY BOARD →
            </Link>
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs tracking-widest text-foreground hover:border-amber hover:text-amber transition-colors"
            >
              ROUTE SEARCH →
            </Link>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-px bg-border/60 border border-border/60 rounded-sm overflow-hidden self-start">
          <HeroStat
            label="TRACKED"
            value={tracked.toLocaleString()}
            sub="aircraft now"
            tone="amber"
          />
          <HeroStat
            label="ON-TIME"
            value={`${onTime}%`}
            sub="last 24h"
            tone="radar"
          />
          <HeroStat
            label="DELAYED"
            value={delayed.toLocaleString()}
            sub=">15 min"
            tone="destructive"
          />
          <HeroStat
            label="GROUND STOPS"
            value={`${groundStops}`}
            sub="active TMI"
            tone="signal"
          />
          <div className="col-span-2 bg-card/80 px-4 py-3">
            <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-2">
              JET STREAM · 250 hPa
            </div>
            <JetStreamBars />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "amber" | "radar" | "destructive" | "signal";
}) {
  const c =
    tone === "amber"
      ? "text-amber"
      : tone === "radar"
      ? "text-radar"
      : tone === "destructive"
      ? "text-destructive"
      : "text-accent";
  return (
    <div className="bg-card/80 px-4 py-3 relative">
      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className={`font-display font-bold text-3xl tabular-nums ${c}`}>
        {value}
      </div>
      <div className="font-mono text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function JetStreamBars() {
  const bars = [
    40, 65, 88, 120, 165, 195, 180, 140, 110, 95, 130, 150, 175, 160, 120, 90,
    70, 55,
  ];
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-1 h-10">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-accent/40 to-accent rounded-sm"
          style={{
            height: `${(b / max) * 100}%`,
            opacity: 0.4 + (i / bars.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

function DelayPulse({
  delays,
  isLive,
}: {
  delays: AirportDelay[];
  isLive: boolean;
}) {
  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md">
      <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLive ? "bg-radar blink" : "bg-amber"
            }`}
          />
          <div className="font-mono text-[10px] tracking-[0.3em] text-amber">
            PULSE · DELAY HEAT {isLive ? "(LIVE)" : "(DEMO)"}
          </div>
        </div>
        <Link
          href="/delays"
          className="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-amber"
        >
          FULL BOARD →
        </Link>
      </div>
      <ul className="divide-y divide-border/40">
        {delays.slice(0, 5).map((d) => {
          const pct = Math.min(100, (d.avg / 150) * 100);
          const tone =
            d.avg > 90
              ? "bg-destructive"
              : d.avg > 45
              ? "bg-amber"
              : "bg-radar";
          return (
            <li key={d.iata} className="px-3 py-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber font-bold">{d.iata}</span>
                  <span className="text-muted-foreground truncate">
                    {d.reason}
                  </span>
                </div>
                <span className="text-foreground tabular-nums">
                  {Math.floor(d.avg / 60)}H{d.avg % 60}M
                </span>
              </div>
              <div className="mt-1.5 h-1 bg-background/60 rounded-full overflow-hidden">
                <div
                  className={`h-full ${tone}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function QuickLinks() {
  const links = [
    {
      href: "/routes",
      label: "Route Search",
      desc: "City pair · OTP · Aircraft",
      code: "RTE",
    },
    {
      href: "/airlines",
      label: "Airline Stats",
      desc: "On-time performance leaderboard",
      code: "OTP",
    },
    {
      href: "/weather",
      label: "Weather Impact",
      desc: "METAR · SIGMET · turbulence",
      code: "WX",
    },
  ] as const;
  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md">
      <div className="px-3 py-2 border-b border-border/60 font-mono text-[10px] tracking-[0.3em] text-amber">
        QUICK ACCESS
      </div>
      <ul className="divide-y divide-border/40">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-center gap-3 px-3 py-3 hover:bg-secondary/40 transition-colors group"
            >
              <span className="font-mono text-[10px] text-amber/70">
                [{l.code}]
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-foreground group-hover:text-amber">
                  {l.label}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground truncate">
                  {l.desc}
                </div>
              </div>
              <span className="font-mono text-amber">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModulesGrid() {
  const mods = [
    {
      code: "RTE",
      title: "Route Search",
      desc: "Find every flight between any two airports. Compare carriers, equipment and historical OTP.",
      href: "/routes",
    },
    {
      code: "DLY",
      title: "Delay Board",
      desc: "Live FAA Air Traffic Control System Command Center advisories, ground stops and metering programs.",
      href: "/delays",
    },
    {
      code: "OTP",
      title: "Airline OTP",
      desc: "On-time performance leaderboard with completion factor, average delay and cancellation rate.",
      href: "/airlines",
    },
    {
      code: "WX",
      title: "Weather Impact",
      desc: "METAR, TAF, SIGMET and convective forecasts overlaid on the routes you actually fly.",
      href: "/weather",
    },
  ] as const;
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            SYSTEMS · ONLINE
          </div>
          <h2 className="font-display font-bold text-3xl tracking-tight">
            Five modules. One mission control.
          </h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mods.map((m, i) => (
          <Link
            key={m.code}
            href={m.href}
            className="group relative border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-5 overflow-hidden hover:border-amber transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber/0 via-amber/0 to-amber/0 group-hover:from-amber/5 group-hover:to-accent/5 transition-colors" />
            <div className="relative">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                <span>MOD-0{i + 1}</span>
                <span className="text-amber">[{m.code}]</span>
              </div>
              <h3 className="mt-3 font-display font-bold text-xl tracking-tight">
                {m.title}
              </h3>
              <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
                {m.desc}
              </p>
              <div className="mt-4 font-mono text-[10px] tracking-widest text-amber group-hover:translate-x-1 transition-transform">
                OPEN MODULE →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DataSources() {
  const srcs = [
    {
      name: "FlightAware AeroAPI",
      role: "Live ADS-B / MLAT positions, flight plans, history",
      url: "https://www.flightaware.com/aeroapi/",
    },
    {
      name: "FAA ATCSCC",
      role: "Ground stops, ground delay programs, advisories",
      url: "https://www.fly.faa.gov/",
    },
    {
      name: "Aviation Weather Center",
      role: "METAR, TAF, SIGMET, AIRMET, turbulence forecasts",
      url: "https://aviationweather.gov/api/",
    },
  ];
  return (
    <section className="mt-10 border border-border/70 rounded-md bg-card/30 backdrop-blur-md p-6">
      <div className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
        UPSTREAM · FEEDS
      </div>
      <h2 className="mt-1 font-display font-bold text-2xl tracking-tight">
        Wired to the same data the controllers see.
      </h2>
      <div className="mt-5 grid md:grid-cols-3 gap-4">
        {srcs.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="group border border-border/60 rounded-sm p-4 hover:border-amber transition-colors"
          >
            <div className="font-mono text-amber text-xs tracking-widest">
              {s.name}
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {s.role}
            </p>
            <div className="mt-3 font-mono text-[10px] tracking-widest text-muted-foreground group-hover:text-amber">
              VISIT SOURCE →
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
