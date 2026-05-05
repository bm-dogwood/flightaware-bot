"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AIRPORTS,
  type Flight,
  gcArc,
  gcInterpolate,
  bearing,
  generateFlights,
} from "@/lib/flight-data";

function planeIcon(color: string, heading: number) {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div style="transform: rotate(${heading}deg); width:28px;height:28px;display:grid;place-items:center;">
        <svg viewBox="0 0 24 24" width="22" height="22" style="filter: drop-shadow(0 0 6px ${color});">
          <path fill="${color}" stroke="rgba(0,0,0,0.4)" stroke-width="0.5"
            d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
        </svg>
      </div>`,
  });
}

function airportIcon(active: boolean) {
  const color = active ? "var(--color-amber)" : "var(--color-signal)";
  return L.divIcon({
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `
      <div style="position:relative;width:16px;height:16px;">
        <div style="position:absolute;inset:0;border-radius:50%;border:1.5px solid ${color};box-shadow:0 0 10px ${color};"></div>
        <div style="position:absolute;inset:5px;border-radius:50%;background:${color};"></div>
      </div>`,
  });
}

function FitToWorld() {
  const map = useMap();
  useEffect(() => {
    map.setView([22, 5], 2);
  }, [map]);
  return null;
}

export type LiveMapProps = {
  flights: Flight[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  height?: string;
};

export function LiveMap({
  flights,
  selectedId,
  onSelect,
  height = "100%",
}: LiveMapProps) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const animated = useMemo(() => {
    return flights.map((f) => {
      // If the flight has real lat/lng from AeroAPI, use those directly
      const hasRealPos =
        typeof (f as any).lat === "number" &&
        typeof (f as any).lng === "number";

      if (hasRealPos) {
        const pos: [number, number] = [(f as any).lat, (f as any).lng];
        return { ...f, pos, hd: f.heading, livep: f.progress };
      }

      // Otherwise, animate along great-circle
      const p = (f.progress + tick * 0.0015) % 1;
      const a: [number, number] = [f.origin.lat, f.origin.lng];
      const b: [number, number] = [f.dest.lat, f.dest.lng];
      const pos = gcInterpolate(a, b, p);
      const ahead = gcInterpolate(a, b, Math.min(1, p + 0.01));
      const hd = bearing(pos, ahead);
      return { ...f, pos, hd, livep: p };
    });
  }, [flights, tick]);

  const selected = animated.find((f) => f.id === selectedId);
  const arc = selected
    ? gcArc(
        [selected.origin.lat, selected.origin.lng],
        [selected.dest.lat, selected.dest.lng],
        80
      )
    : null;

  return (
    <div
      className="relative w-full overflow-hidden border border-border/70 rounded-md"
      style={{ height }}
    >
      <MapContainer
        center={[22, 5]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        worldCopyJump
        style={{
          height: "100%",
          width: "100%",
          background: "oklch(0.09 0.02 240)",
        }}
        zoomControl={true}
        attributionControl={false}
      >
        <FitToWorld />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
          opacity={0.55}
        />

        {AIRPORTS.map((a) => (
          <Marker
            key={a.iata}
            position={[a.lat, a.lng]}
            icon={airportIcon(
              selected?.origin.iata === a.iata || selected?.dest.iata === a.iata
            )}
          >
            <Tooltip
              direction="top"
              offset={[0, -8]}
              className="!bg-card !text-foreground !border !border-border !font-mono !text-[10px]"
            >
              <div className="font-mono">
                <div className="text-amber font-bold">
                  {a.iata} · {a.icao}
                </div>
                <div className="text-muted-foreground">
                  {a.city}, {a.country}
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {selected && arc && (
          <>
            <Polyline
              positions={arc}
              pathOptions={{ color: "#fbbf24", weight: 1.5, opacity: 0.4 }}
            />
            <Polyline
              positions={arc.slice(
                0,
                Math.floor(arc.length * selected.livep) + 1
              )}
              pathOptions={{
                color: "#fbbf24",
                weight: 2.5,
                opacity: 1,
                className: "dash-flow",
              }}
            />
            <CircleMarker
              center={[selected.origin.lat, selected.origin.lng]}
              radius={10}
              pathOptions={{
                color: "#fbbf24",
                weight: 1,
                fillColor: "#fbbf24",
                fillOpacity: 0.15,
              }}
            />
            <CircleMarker
              center={[selected.dest.lat, selected.dest.lng]}
              radius={10}
              pathOptions={{
                color: "#22d3ee",
                weight: 1,
                fillColor: "#22d3ee",
                fillOpacity: 0.15,
              }}
            />
          </>
        )}

        {animated.map((f) => (
          <Marker
            key={f.id}
            position={f.pos}
            icon={planeIcon(
              f.id === selectedId ? "#fbbf24" : f.airlineColor,
              f.hd
            )}
            eventHandlers={{
              click: () => onSelect(f.id === selectedId ? null : f.id),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              className="!bg-card !text-foreground !border !border-border !font-mono !text-[10px]"
            >
              <div className="font-mono leading-tight">
                <div className="text-amber font-bold">{f.callsign}</div>
                <div>
                  {f.origin.iata} → {f.dest.iata}
                </div>
                <div className="text-muted-foreground">
                  FL{Math.floor(f.altitude / 100)} · {f.speed}kt
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* HUD overlays */}
      <div className="pointer-events-none absolute inset-0">
        <CornerBrackets />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between font-mono text-[10px] tracking-widest">
          <div className="glass px-3 py-2 rounded-sm pointer-events-auto">
            <div className="text-amber">SCOPE · GLOBAL</div>
            <div className="text-muted-foreground">PROJECTION · MERCATOR</div>
            <div className="text-muted-foreground">RANGE · 20,038 NM</div>
          </div>
          <div className="glass px-3 py-2 rounded-sm text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-radar blink shadow-[0_0_6px_var(--color-radar)]" />
              <span className="text-radar">LIVE FEED</span>
            </div>
            <div className="text-muted-foreground">ADS-B · MLAT · FAA SWIM</div>
            <div className="text-foreground">
              {flights.length} TRACKS RENDERED
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between font-mono text-[10px] tracking-widest">
          <div className="glass px-3 py-2 rounded-sm">
            <span className="text-muted-foreground">CLICK ANY AIRCRAFT</span>
            <span className="text-amber"> · TRACE ROUTE</span>
          </div>
          <Compass />
        </div>
      </div>
    </div>
  );
}

function CornerBrackets() {
  const cls = "absolute w-6 h-6 border-amber/70";
  return (
    <>
      <div className={`${cls} top-0 left-0 border-t-2 border-l-2`} />
      <div className={`${cls} top-0 right-0 border-t-2 border-r-2`} />
      <div className={`${cls} bottom-0 left-0 border-b-2 border-l-2`} />
      <div className={`${cls} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

function Compass() {
  return (
    <div className="glass w-20 h-20 rounded-full grid place-items-center relative">
      <div className="absolute inset-0 rounded-full border border-amber/40" />
      <div className="absolute inset-2 rounded-full border border-border/80" />
      <span className="absolute top-1 text-[9px] text-amber font-bold">N</span>
      <span className="absolute bottom-1 text-[9px] text-muted-foreground">
        S
      </span>
      <span className="absolute left-1 text-[9px] text-muted-foreground">
        W
      </span>
      <span className="absolute right-1 text-[9px] text-muted-foreground">
        E
      </span>
      <div
        className="w-px h-7 bg-amber origin-bottom"
        style={{ transform: "rotate(35deg)" }}
      />
    </div>
  );
}

export function useDemoFlights() {
  return useMemo(() => generateFlights(80, 7), []);
}
