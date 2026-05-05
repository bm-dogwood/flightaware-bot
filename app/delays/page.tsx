// app/delays/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { AIRPORT_DELAYS } from "@/lib/flight-data";
import type { AirportDelay } from "@/lib/api";

export default function DelaysPage() {
  const [delays, setDelays] = useState<AirportDelay[]>(
    AIRPORT_DELAYS as AirportDelay[]
  );
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [filter, setFilter] = useState<
    "ALL" | "GROUND DELAY" | "GROUND STOP" | "ADVISORY"
  >("ALL");

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
        // keep demo data
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  const rows = useMemo(
    () =>
      filter === "ALL" ? delays : delays.filter((r) => r.status === filter),
    [delays, filter]
  );

  return (
    <div className="px-4 lg:px-6 pt-6 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="ATCSCC · TRAFFIC MANAGEMENT"
        title="Departure Hold Board"
        sub="Real-time FAA Air Traffic Control System Command Center initiatives. Updated continuously from the National Traffic Management Log."
      />

      <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Big board */}
        <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive
                    ? "bg-radar blink shadow-[0_0_6px_var(--color-radar)]"
                    : "bg-amber"
                }`}
              />
              <div className="font-mono text-[10px] tracking-[0.3em] text-amber">
                {isLive ? "LIVE" : "DEMO"} BOARD · {rows.length} ACTIVE
              </div>
              {lastUpdated && (
                <div className="font-mono text-[9px] text-muted-foreground">
                  UPD {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {(
                ["ALL", "GROUND STOP", "GROUND DELAY", "ADVISORY"] as const
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-mono text-[10px] tracking-widest px-2 py-1 border transition-colors ${
                    filter === f
                      ? "border-amber text-amber bg-amber/10"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[80px_1fr_140px_120px_140px] gap-px bg-border/60 border-b border-border/60 font-mono text-[10px] tracking-widest text-muted-foreground">
            {["IATA", "AIRPORT · REASON", "AVG DELAY", "STATUS", "TREND"].map(
              (h) => (
                <div key={h} className="bg-card/80 px-3 py-2">
                  {h}
                </div>
              )
            )}
          </div>

          <ul>
            {loading && rows.length === 0 ? (
              <li className="p-8 text-center font-mono text-xs text-muted-foreground">
                FETCHING FAA DATA…
              </li>
            ) : rows.length === 0 ? (
              <li className="p-8 text-center font-mono text-xs text-radar">
                ● NO ACTIVE INITIATIVES
              </li>
            ) : (
              rows.map((r) => {
                const tone =
                  r.status === "GROUND STOP"
                    ? "destructive"
                    : r.status === "GROUND DELAY"
                    ? "amber"
                    : "radar";
                const toneCls =
                  tone === "destructive"
                    ? "text-destructive"
                    : tone === "amber"
                    ? "text-amber"
                    : "text-radar";
                return (
                  <li
                    key={r.iata}
                    className="grid grid-cols-[80px_1fr_140px_120px_140px] gap-px bg-border/40"
                  >
                    <div className="bg-card/40 px-3 py-3 font-display font-bold text-xl text-amber">
                      {r.iata}
                    </div>
                    <div className="bg-card/40 px-3 py-3 font-mono text-xs">
                      <div className="text-foreground">{r.name}</div>
                      <div className="text-muted-foreground">{r.reason}</div>
                    </div>
                    <div className="bg-card/40 px-3 py-3 font-mono text-base tabular-nums text-foreground">
                      {Math.floor(r.avg / 60)}h{" "}
                      {String(r.avg % 60).padStart(2, "0")}m
                    </div>
                    <div
                      className={`bg-card/40 px-3 py-3 font-mono text-[11px] tracking-widest ${toneCls}`}
                    >
                      ● {r.status}
                    </div>
                    <div className="bg-card/40 px-3 py-3">
                      <Sparkline tone={tone} />
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Legend />
          <NASOverview delays={delays} />
        </aside>
      </div>
    </div>
  );
}

function Sparkline({ tone }: { tone: "destructive" | "amber" | "radar" }) {
  const stroke =
    tone === "destructive"
      ? "var(--color-destructive)"
      : tone === "amber"
      ? "var(--color-amber)"
      : "var(--color-radar)";
  const pts = [10, 14, 12, 22, 18, 28, 35, 30, 40, 48, 55, 50, 62, 58, 70];
  const max = Math.max(...pts);
  const path = pts
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 100} ${
          50 - (p / max) * 40
        }`
    )
    .join(" ");
  return (
    <svg viewBox="0 0 100 50" className="w-full h-7">
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" />
      <path d={`${path} L 100 50 L 0 50 Z`} fill={stroke} opacity="0.15" />
    </svg>
  );
}

function Legend() {
  const items = [
    { c: "bg-destructive", l: "GROUND STOP", d: "All departures held" },
    { c: "bg-amber", l: "GROUND DELAY", d: "Programmed metering" },
    { c: "bg-radar", l: "ADVISORY", d: "Information only" },
  ];
  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber mb-3">
        LEGEND
      </div>
      <ul className="space-y-2 font-mono text-xs">
        {items.map((i) => (
          <li key={i.l} className="flex items-start gap-2">
            <span className={`mt-1.5 w-2 h-2 rounded-full ${i.c}`} />
            <div>
              <div className="text-foreground tracking-widest">{i.l}</div>
              <div className="text-muted-foreground">{i.d}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NASOverview({ delays }: { delays: AirportDelay[] }) {
  const groundStops = delays.filter((d) => d.status === "GROUND STOP").length;
  const groundDelays = delays.filter((d) => d.status === "GROUND DELAY").length;

  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber mb-3">
        NAS OVERVIEW · LIVE
      </div>
      <div className="grid grid-cols-2 gap-3 font-mono">
        {[
          { l: "GROUND STOPS", v: String(groundStops) },
          { l: "GROUND DELAYS", v: String(groundDelays) },
          {
            l: "ADVISORIES",
            v: String(delays.filter((d) => d.status === "ADVISORY").length),
          },
          { l: "TOTAL TMI", v: String(delays.length) },
        ].map((s) => (
          <div key={s.l} className="border border-border/60 rounded-sm p-2">
            <div className="text-[9px] tracking-[0.3em] text-muted-foreground">
              {s.l}
            </div>
            <div className="text-lg text-foreground tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  const words = title.split(" ");
  return (
    <header className="pt-2">
      <div className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
        {eyebrow}
      </div>
      <h1 className="mt-1 font-display font-bold text-4xl lg:text-5xl tracking-tight">
        <span className="text-amber">{words[0]}</span>{" "}
        {words.slice(1).join(" ")}
      </h1>
      <p className="mt-3 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
        {sub}
      </p>
    </header>
  );
}
