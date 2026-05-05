// app/routes/page.tsx
"use client";

import { useMemo, useState } from "react";
import type { Metadata } from "next";
import { AIRPORTS, AIRLINES, generateFlights } from "@/lib/flight-data";

export default function RoutesPage() {
  const [origin, setOrigin] = useState("JFK");
  const [dest, setDest] = useState("LHR");
  const all = useMemo(() => generateFlights(160, 13), []);
  const matches = useMemo(
    () => all.filter((f) => f.origin.iata === origin && f.dest.iata === dest),
    [all, origin, dest]
  );

  const o = AIRPORTS.find((a) => a.iata === origin)!;
  const d = AIRPORTS.find((a) => a.iata === dest)!;

  // Distance (nautical miles, great-circle)
  const dist = haversineNM([o.lat, o.lng], [d.lat, d.lng]);
  const flightTime = Math.round((dist / 460) * 60); // minutes at ~460kt cruise

  return (
    <div className="px-4 lg:px-6 pt-6 max-w-[1400px] mx-auto">
      <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-3 items-end">
        <AirportPicker
          label="ORIGIN"
          value={origin}
          onChange={setOrigin}
          accent="amber"
        />
        <SwapButton
          onClick={() => {
            const a = origin;
            setOrigin(dest);
            setDest(a);
          }}
        />
        <AirportPicker
          label="DESTINATION"
          value={dest}
          onChange={setDest}
          accent="cyan"
        />
        <button className="border border-amber bg-amber/10 px-5 py-3 font-mono text-xs tracking-widest text-amber hover:bg-amber hover:text-primary-foreground transition-colors">
          QUERY ROUTE →
        </button>
      </div>

      <section className="mt-6 grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 font-mono text-[10px] tracking-[0.3em] text-amber">
            {origin} → {dest} · {matches.length} OPERATORS ·{" "}
            {Math.round(dist).toLocaleString()} NM
          </div>
          <div className="grid grid-cols-[100px_1fr_120px_120px_100px] gap-px bg-border/60 border-b border-border/60 font-mono text-[10px] tracking-widest text-muted-foreground">
            {["FLIGHT", "CARRIER", "EQUIPMENT", "STATUS", "DEP"].map((h) => (
              <div key={h} className="bg-card/80 px-3 py-2">
                {h}
              </div>
            ))}
          </div>
          <ul>
            {matches.length === 0 && (
              <li className="p-8 text-center font-mono text-xs text-muted-foreground">
                NO SCHEDULED OPERATIONS ON THIS PAIR
              </li>
            )}
            {matches.map((f, i) => (
              <li
                key={f.id}
                className="grid grid-cols-[100px_1fr_120px_120px_100px] gap-px bg-border/40"
              >
                <div className="bg-card/40 px-3 py-3 font-mono text-amber">
                  {f.callsign}
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-xs flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: f.airlineColor,
                      boxShadow: `0 0 8px ${f.airlineColor}`,
                    }}
                  />
                  {f.airline}
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-xs">
                  {f.aircraft}
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-[11px] tracking-widest text-radar">
                  ● {f.status}
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-xs tabular-nums">
                  {String(6 + i).padStart(2, "0")}:
                  {String((i * 17) % 60).padStart(2, "0")}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4">
          <RouteVitals dist={dist} ftMin={flightTime} from={o} to={d} />
          <CarrierMix flights={matches} />
        </aside>
      </section>
    </div>
  );
}

function AirportPicker({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accent: "amber" | "cyan";
}) {
  const c =
    accent === "amber"
      ? "text-amber border-amber/60"
      : "text-accent border-accent/60";
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
      <div
        className={`mt-1 border ${c} bg-background/50 rounded-sm px-3 py-3 flex items-center gap-3`}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent font-display font-bold text-2xl tracking-tight focus:outline-none"
        >
          {AIRPORTS.map((a) => (
            <option
              key={a.iata}
              value={a.iata}
              className="bg-background text-foreground"
            >
              {a.iata} — {a.city}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function SwapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="self-end mb-0 border border-border bg-card/60 w-12 h-12 grid place-items-center hover:border-amber hover:text-amber transition-colors"
      title="Swap"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M7 4v12M3 12l4 4 4-4M17 20V8M21 12l-4-4-4 4" />
      </svg>
    </button>
  );
}

function RouteVitals({
  dist,
  ftMin,
  from,
  to,
}: {
  dist: number;
  ftMin: number;
  from: { city: string; tz: string };
  to: { city: string; tz: string };
}) {
  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber mb-3">
        ROUTE VITALS
      </div>
      <div className="grid grid-cols-2 gap-3 font-mono">
        <Vital
          label="DISTANCE"
          value={`${Math.round(dist).toLocaleString()} NM`}
        />
        <Vital
          label="FLIGHT TIME"
          value={`${Math.floor(ftMin / 60)}h ${ftMin % 60}m`}
        />
        <Vital label="DEP TZ" value={from.tz} />
        <Vital label="ARR TZ" value={to.tz} />
      </div>
      <div className="mt-3 font-mono text-[10px] text-muted-foreground leading-relaxed">
        Computed over WGS-84 great-circle at 460 kt cruise. Real ETE varies with
        winds aloft.
      </div>
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/60 rounded-sm p-2">
      <div className="text-[9px] tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="text-base text-foreground tabular-nums">{value}</div>
    </div>
  );
}

function CarrierMix({
  flights,
}: {
  flights: ReturnType<typeof generateFlights>;
}) {
  const counts = new Map<string, { name: string; n: number; color: string }>();
  flights.forEach((f) => {
    const cur = counts.get(f.airline) ?? {
      name: f.airline,
      n: 0,
      color: f.airlineColor,
    };
    cur.n += 1;
    counts.set(f.airline, cur);
  });
  const arr = [...counts.values()].sort((a, b) => b.n - a.n);
  const total = arr.reduce((s, x) => s + x.n, 0) || 1;
  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber mb-3">
        CARRIER MIX
      </div>
      {arr.length === 0 && (
        <div className="font-mono text-xs text-muted-foreground">No data</div>
      )}
      <ul className="space-y-2">
        {arr.map((a) => (
          <li key={a.name} className="font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: a.color }}
                />
                {a.name}
              </span>
              <span className="text-muted-foreground">{a.n}</span>
            </div>
            <div className="mt-1 h-1 bg-background/60 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${(a.n / total) * 100}%`,
                  background: a.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// reuse logos from AIRLINES so list stays consistent
void AIRLINES;

function haversineNM(a: [number, number], b: [number, number]) {
  const R = 3440.065;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
