// app/api/delays/route.ts
// Server-side proxy for FAA ATCSCC NAS Status API to avoid CORS issues
import { NextResponse } from "next/server";
import { AIRPORT_DELAYS } from "@/lib/flight-data";
import type { AirportDelay } from "@/lib/api";
import { AIRPORTS } from "@/lib/flight-data";

function matchAirport(iata?: string) {
  if (!iata) return undefined;
  return AIRPORTS.find((a) => a.iata === iata.toUpperCase());
}

export async function GET() {
  try {
    const res = await fetch(
      "https://nasstatus.faa.gov/api/airport-status-information",
      { next: { revalidate: 60 }, headers: { Accept: "application/json" } }
    );

    if (!res.ok) throw new Error(`FAA API error: ${res.status}`);

    const json = await res.json();
    const delays: AirportDelay[] = [];

    // Ground delays
    const groundDelays = json.GroundDelays?.GroundDelay ?? [];
    const gdArray = Array.isArray(groundDelays) ? groundDelays : [groundDelays];
    for (const gd of gdArray) {
      if (!gd?.ARPT) continue;
      const ap = matchAirport(gd.ARPT);
      delays.push({
        iata: gd.ARPT,
        name: ap?.name ?? gd.ARPT,
        reason: gd.Reason ?? "Unspecified",
        avg: parseInt(String(gd.Avg ?? "30").replace(/\D.*/, ""), 10) || 30,
        status: "GROUND DELAY",
      });
    }

    // Ground stops
    const groundStops = json.GroundStops?.Program ?? [];
    const gsArray = Array.isArray(groundStops) ? groundStops : [groundStops];
    for (const gs of gsArray) {
      if (!gs?.ARPT) continue;
      const ap = matchAirport(gs.ARPT);
      delays.push({
        iata: gs.ARPT,
        name: ap?.name ?? gs.ARPT,
        reason: gs.Reason ?? "Ground Stop",
        avg: 90,
        status: "GROUND STOP",
      });
    }

    // General/advisory delays
    const advisories = json.GeneralAviationDelay?.Delay ?? [];
    const advArray = Array.isArray(advisories) ? advisories : [advisories];
    for (const gd of advArray) {
      if (!gd?.ARPT) continue;
      const ap = matchAirport(gd.ARPT);
      delays.push({
        iata: gd.ARPT,
        name: ap?.name ?? gd.ARPT,
        reason: gd.Reason ?? "Volume",
        avg: parseInt(String(gd.Avg ?? "15").replace(/\D.*/, ""), 10) || 15,
        status: "ADVISORY",
      });
    }

    if (delays.length === 0) {
      return NextResponse.json({ delays: AIRPORT_DELAYS, live: false });
    }

    return NextResponse.json({ delays, live: true });
  } catch (err) {
    console.warn("FAA API unavailable, serving demo data:", err);
    return NextResponse.json({ delays: AIRPORT_DELAYS, live: false });
  }
}
