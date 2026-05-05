// app/api/flights/route.ts
// Server-side proxy for FlightAware AeroAPI (avoids exposing key on client)
import { NextResponse } from "next/server";
import { generateFlights, AIRPORTS } from "@/lib/flight-data";

const FLIGHTAWARE_API_KEY = process.env.FLIGHTAWARE_API_KEY ?? "";
const FLIGHTAWARE_BASE = "https://aeroapi.flightaware.com/aeroapi";

function airlineColor(icao: string): string {
  const map: Record<string, string> = {
    AAL: "#E0142B",
    UAL: "#3399cc",
    DAL: "#9B1B30",
    BAW: "#075aaa",
    AFR: "#002157",
    DLH: "#FFB81C",
    UAE: "#D71921",
    QTR: "#5C0F32",
    SIA: "#1d3a76",
    ANA: "#13448F",
    JAL: "#C8102E",
    CPA: "#006564",
    AIC: "#E63946",
    KLM: "#00A1E0",
    THY: "#C8102E",
    SWA: "#F9A825",
    ASA: "#00467F",
    JBU: "#003876",
  };
  return map[icao] ?? "#64748b";
}

function airlineName(icao: string): string {
  const map: Record<string, string> = {
    AAL: "American Airlines",
    UAL: "United Airlines",
    DAL: "Delta Air Lines",
    BAW: "British Airways",
    AFR: "Air France",
    DLH: "Lufthansa",
    UAE: "Emirates",
    QTR: "Qatar Airways",
    SIA: "Singapore Airlines",
    ANA: "All Nippon Airways",
    JAL: "Japan Airlines",
    CPA: "Cathay Pacific",
    AIC: "Air India",
    KLM: "KLM",
    THY: "Turkish Airlines",
    SWA: "Southwest Airlines",
    ASA: "Alaska Airlines",
    JBU: "JetBlue",
  };
  return map[icao] ?? icao;
}

export async function GET() {
  if (!FLIGHTAWARE_API_KEY) {
    const demo = generateFlights(80, 7);
    return NextResponse.json({ flights: demo, live: false });
  }

  try {
    // Fetch flights in the North Atlantic region as an example
    const res = await fetch(
      `${FLIGHTAWARE_BASE}/flights/search?query=-latlong "30 -90 60 -10" -type A&max_pages=1`,
      {
        headers: { "x-apikey": FLIGHTAWARE_API_KEY },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) throw new Error(`AeroAPI error: ${res.status}`);
    const data = await res.json();

    const flights = [];
    for (const f of data.flights ?? []) {
      const origin = AIRPORTS.find(
        (a) => a.iata === f.origin?.code_iata?.toUpperCase()
      );
      const dest = AIRPORTS.find(
        (a) => a.iata === f.destination?.code_iata?.toUpperCase()
      );
      if (!origin || !dest) continue;

      const icao = f.operator ?? "";
      flights.push({
        id: f.fa_flight_id ?? `${icao}-${Math.random()}`,
        callsign: f.ident ?? icao,
        airline: airlineName(icao),
        airlineColor: airlineColor(icao),
        number: f.ident ?? icao,
        origin,
        dest,
        aircraft: f.aircraft_type ?? "B738",
        status: f.status?.includes("En Route")
          ? "EN ROUTE"
          : f.status?.includes("Landed")
          ? "LANDED"
          : "ON TIME",
        altitude: f.last_position?.altitude
          ? f.last_position.altitude * 100
          : 35000,
        speed: f.last_position?.groundspeed ?? 480,
        progress: f.progress_percent ? f.progress_percent / 100 : 0.5,
        heading: f.last_position?.heading ?? 0,
        lat: f.last_position?.latitude,
        lng: f.last_position?.longitude,
      });
    }

    if (flights.length === 0) {
      const demo = generateFlights(80, 7);
      return NextResponse.json({ flights: demo, live: false });
    }

    return NextResponse.json({ flights, live: true });
  } catch (err) {
    console.warn("FlightAware API error, using demo data:", err);
    const demo = generateFlights(80, 7);
    return NextResponse.json({ flights: demo, live: false });
  }
}
