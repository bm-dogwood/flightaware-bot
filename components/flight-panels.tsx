import { useMemo, useState } from "react";
import type { Flight } from "@/lib/flight-data";

export function FlightStrip({
  flight,
  active,
  onClick,
}: {
  flight: Flight;
  active: boolean;
  onClick: () => void;
}) {
  const status = flight.status;
  const statusColor =
    status === "DELAYED"
      ? "text-destructive"
      : status === "EN ROUTE"
      ? "text-radar"
      : status === "BOARDING"
      ? "text-accent"
      : status === "LANDED"
      ? "text-muted-foreground"
      : "text-amber";
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left grid grid-cols-[auto_1fr_auto] gap-3 items-center px-3 py-2 border-l-2 font-mono text-xs transition-colors ${
        active
          ? "border-amber bg-amber/5"
          : "border-transparent hover:border-amber/50 hover:bg-secondary/40"
      }`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: flight.airlineColor,
          boxShadow: `0 0 8px ${flight.airlineColor}`,
        }}
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-bold">{flight.callsign}</span>
          <span className="text-muted-foreground truncate">
            {flight.airline}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-amber">{flight.origin.iata}</span>
          <Arrow />
          <span className="text-accent">{flight.dest.iata}</span>
          <span className="ml-2">FL{Math.floor(flight.altitude / 100)}</span>
          <span>·</span>
          <span>{flight.speed}kt</span>
        </div>
      </div>
      <span className={`${statusColor} text-[10px] tracking-widest`}>
        {status}
      </span>
    </button>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="6"
      viewBox="0 0 14 6"
      className="text-muted-foreground"
    >
      <path
        d="M0 3 H11 M8 0 L13 3 L8 6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function FlightList({
  flights,
  selectedId,
  onSelect,
}: {
  flights: Flight[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toUpperCase();
    if (!s) return flights;
    return flights.filter(
      (f) =>
        f.callsign.includes(s) ||
        f.number.includes(s) ||
        f.origin.iata.includes(s) ||
        f.dest.iata.includes(s) ||
        f.airline.toUpperCase().includes(s)
    );
  }, [flights, q]);

  return (
    <div className="flex flex-col h-full border border-border/70 rounded-md bg-card/40 backdrop-blur-md">
      <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-[0.3em] text-amber">
          LIVE TRACKS · {filtered.length}
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-radar blink shadow-[0_0_6px_var(--color-radar)]" />
      </div>
      <div className="px-3 py-2 border-b border-border/60">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="QUERY · CALLSIGN, IATA, AIRLINE"
            className="w-full bg-input/60 border border-border rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] text-muted-foreground">
            ⌕
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {filtered.map((f) => (
          <FlightStrip
            key={f.id}
            flight={f}
            active={selectedId === f.id}
            onClick={() => onSelect(selectedId === f.id ? null : f.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="p-6 text-center font-mono text-xs text-muted-foreground">
            NO TRACKS MATCH FILTER
          </div>
        )}
      </div>
    </div>
  );
}

export function FlightDetail({ flight }: { flight: Flight | null }) {
  if (!flight) {
    return (
      <div className="border border-border/70 rounded-md p-4 bg-card/40 backdrop-blur-md">
        <div className="font-mono text-[10px] tracking-[0.3em] text-amber mb-3">
          FLIGHT TELEMETRY
        </div>
        <div className="font-mono text-xs text-muted-foreground leading-relaxed">
          Select an aircraft on the scope or from the track list to display live
          telemetry, route projection, and flight plan details.
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 border border-border/40 bg-background/30 rounded-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  const statusColor =
    flight.status === "DELAYED"
      ? "text-destructive"
      : flight.status === "EN ROUTE"
      ? "text-radar"
      : "text-amber";

  return (
    <div className="border border-amber/50 rounded-md bg-card/60 backdrop-blur-md glow-amber">
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-amber">
            FLIGHT TELEMETRY
          </div>
          <div className="font-display font-bold text-2xl tracking-tight">
            {flight.callsign}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {flight.airline} · {flight.aircraft}
          </div>
        </div>
        <div className={`font-mono text-xs ${statusColor} tracking-widest`}>
          ● {flight.status}
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <RoutePoint
          label="DEPARTURE"
          iata={flight.origin.iata}
          city={flight.origin.city}
          tz={flight.origin.tz}
          accent="amber"
        />
        <RoutePoint
          label="ARRIVAL"
          iata={flight.dest.iata}
          city={flight.dest.city}
          tz={flight.dest.tz}
          accent="cyan"
        />
      </div>
      <div className="px-4">
        <ProgressArc progress={flight.progress} />
      </div>
      <div className="grid grid-cols-4 gap-px bg-border/60 border-t border-border/60">
        <Stat label="ALT" value={`FL${Math.floor(flight.altitude / 100)}`} />
        <Stat label="SPD" value={`${flight.speed} kt`} />
        <Stat
          label="HDG"
          value={`${flight.heading.toString().padStart(3, "0")}°`}
        />
        <Stat
          label="SQK"
          value={`${
            1000 + (parseInt(flight.number.replace(/\D/g, "")) % 6000)
          }`}
        />
      </div>
    </div>
  );
}

function RoutePoint({
  label,
  iata,
  city,
  tz,
  accent,
}: {
  label: string;
  iata: string;
  city: string;
  tz: string;
  accent: "amber" | "cyan";
}) {
  const color = accent === "amber" ? "text-amber" : "text-accent";
  return (
    <div className="border border-border/60 rounded-sm p-3 bg-background/40">
      <div className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`font-display font-bold text-3xl tracking-tight ${color}`}
      >
        {iata}
      </div>
      <div className="font-mono text-[10px] text-muted-foreground truncate">
        {city} · {tz}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/60 px-3 py-2">
      <div className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-sm text-foreground tabular-nums">
        {value}
      </div>
    </div>
  );
}

function ProgressArc({ progress }: { progress: number }) {
  const pct = Math.min(100, Math.max(0, progress * 100));
  return (
    <div className="py-3">
      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground tracking-widest mb-1">
        <span>DEP</span>
        <span className="text-amber">{pct.toFixed(0)}% COMPLETE</span>
        <span>ARR</span>
      </div>
      <div className="relative h-2 rounded-full bg-background/60 border border-border/60 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber via-amber to-accent"
          style={{ width: `${pct}%`, boxShadow: "0 0 12px var(--color-amber)" }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber border border-background"
          style={{
            left: `calc(${pct}% - 6px)`,
            boxShadow: "0 0 10px var(--color-amber)",
          }}
        />
      </div>
    </div>
  );
}
