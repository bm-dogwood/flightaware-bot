// lib/api.ts
// Dynamic API integrations for FlightAware AeroAPI, FAA ATCSCC, and Aviation Weather Center
// Falls back to demo data if APIs are unavailable or keys are not set.

import {
  AIRPORT_DELAYS,
  AIRPORTS,
  generateFlights,
  type Flight,
} from "./flight-data";

// ─── Config ───────────────────────────────────────────────────────────────────
const FLIGHTAWARE_API_KEY = process.env.NEXT_PUBLIC_FLIGHTAWARE_API_KEY ?? "";
const FLIGHTAWARE_BASE = "https://aeroapi.flightaware.com/aeroapi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LiveFlight = {
  id: string;
  callsign: string;
  airline: string;
  airlineColor: string;
  number: string;
  origin: (typeof AIRPORTS)[0];
  dest: (typeof AIRPORTS)[0];
  aircraft: string;
  status: "ON TIME" | "DELAYED" | "BOARDING" | "EN ROUTE" | "LANDED";
  altitude: number;
  speed: number;
  progress: number;
  heading: number;
  lat?: number;
  lng?: number;
};

export type AirportDelay = {
  iata: string;
  name: string;
  reason: string;
  avg: number; // minutes
  status: "GROUND DELAY" | "GROUND STOP" | "ADVISORY";
};

export type WeatherObs = {
  iata: string;
  icao: string;
  name: string;
  metar: string;
  cat: "VFR" | "MVFR" | "IFR" | "LIFR";
  wind: string;
  vis: string;
  ceiling: string;
  temp: number;
  impact: string;
};

// ─── Utility ──────────────────────────────────────────────────────────────────

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
    NKS: "#FFF000",
    SPR: "#D71921",
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
    NKS: "Spirit Airlines",
    SPR: "Frontier Airlines",
  };
  return map[icao] ?? icao;
}

function matchAirport(iata?: string): (typeof AIRPORTS)[0] | undefined {
  if (!iata) return undefined;
  return AIRPORTS.find((a) => a.iata === iata.toUpperCase());
}

// ─── FlightAware AeroAPI ──────────────────────────────────────────────────────

async function fetchFlightAwareFlights(): Promise<LiveFlight[] | null> {
  if (!FLIGHTAWARE_API_KEY) return null;
  try {
    const res = await fetch(
      `${FLIGHTAWARE_BASE}/flights/search?query=-latlong "20 -140 60 -50" -type A&max_pages=1`,
      {
        headers: { "x-apikey": FLIGHTAWARE_API_KEY },
        next: { revalidate: 30 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const flights: LiveFlight[] = [];
    for (const f of data.flights ?? []) {
      const origin = matchAirport(f.origin?.code_iata);
      const dest = matchAirport(f.destination?.code_iata);
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
          : f.status?.includes("Cancelled")
          ? "DELAYED"
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
    return flights.length > 0 ? flights : null;
  } catch {
    return null;
  }
}

export async function getLiveFlights(): Promise<LiveFlight[]> {
  const live = await fetchFlightAwareFlights();
  if (live) return live;
  // Fallback: use deterministic demo data
  return generateFlights(80, 7) as unknown as LiveFlight[];
}

// ─── FAA ATCSCC (TFMS / NASSTATUS) ───────────────────────────────────────────

async function fetchFAADelays(): Promise<AirportDelay[] | null> {
  try {
    // FAA SWIM / NAS Status API — publicly available XML feed
    const res = await fetch(
      "https://nasstatus.faa.gov/api/airport-status-information",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();

    const delays: AirportDelay[] = [];

    // Ground delays
    for (const gd of json.GroundDelays?.GroundDelay ?? []) {
      const ap = matchAirport(gd.ARPT);
      delays.push({
        iata: gd.ARPT ?? "???",
        name: ap?.name ?? gd.ARPT,
        reason: gd.Reason ?? "Unknown",
        avg: parseInt(String(gd.Avg ?? "30").replace(/\D.*/, ""), 10) || 30,
        status: "GROUND DELAY",
      });
    }
    // Ground stops
    for (const gs of json.GroundStops?.Program ?? []) {
      const ap = matchAirport(gs.ARPT);
      delays.push({
        iata: gs.ARPT ?? "???",
        name: ap?.name ?? gs.ARPT,
        reason: gs.Reason ?? "Unknown",
        avg: 90,
        status: "GROUND STOP",
      });
    }
    // Advisories
    for (const gd of json.GeneralAviationDelay?.Delay ?? []) {
      const ap = matchAirport(gd.ARPT);
      delays.push({
        iata: gd.ARPT ?? "???",
        name: ap?.name ?? gd.ARPT,
        reason: gd.Reason ?? "Volume",
        avg: parseInt(String(gd.Avg ?? "15").replace(/\D.*/, ""), 10) || 15,
        status: "ADVISORY",
      });
    }

    return delays.length > 0 ? delays : null;
  } catch {
    return null;
  }
}

export async function getAirportDelays(): Promise<AirportDelay[]> {
  const live = await fetchFAADelays();
  if (live) return live;
  // Fallback: typed demo data
  return AIRPORT_DELAYS as AirportDelay[];
}

// ─── Aviation Weather Center (AWC) ────────────────────────────────────────────

type RawMetar = {
  icaoId: string;
  rawOb: string;
  wdir?: number | string;
  wspd?: number;
  wgst?: number;
  visib?: number | string;
  skyCondition?: { skyCover: string; cloudBase?: number }[];
  temp?: number;
  altim?: number;
  fltcat?: string;
};

function parseCat(cat?: string): WeatherObs["cat"] {
  const c = (cat ?? "").toUpperCase();
  if (c === "LIFR") return "LIFR";
  if (c === "IFR") return "IFR";
  if (c === "MVFR") return "MVFR";
  return "VFR";
}

function catImpact(cat: WeatherObs["cat"]) {
  if (cat === "LIFR") return "CAT III approaches required · expect holding";
  if (cat === "IFR") return "Instrument approaches in use · minor metering";
  if (cat === "MVFR") return "VFR flights operating IFR · light delays";
  return "Nominal operations";
}

function buildCeiling(sky: { skyCover: string; cloudBase?: number }[]): string {
  for (const l of sky) {
    if (["OVC", "BKN"].includes(l.skyCover)) {
      return `${l.skyCover}${String(l.cloudBase ?? 0).padStart(3, "0")}`;
    }
  }
  return "FEW250";
}

async function fetchAWCMetars(icaos: string[]): Promise<WeatherObs[] | null> {
  try {
    const ids = icaos.join(",");
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${ids}&format=json&hours=2`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data: RawMetar[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return data.map((m) => {
      const airport = AIRPORTS.find((a) => a.icao === m.icaoId);
      const dir =
        typeof m.wdir === "number" ? String(m.wdir).padStart(3, "0") : "000";
      const spd = m.wspd ?? 0;
      const gust = m.wgst ? `G${m.wgst}` : "";
      const vis =
        typeof m.visib === "number"
          ? `${m.visib}SM`
          : String(m.visib ?? "10SM");
      const sky = m.skyCondition ?? [];
      const ceiling = buildCeiling(sky);
      const cat = parseCat(m.fltcat);
      const temp = typeof m.temp === "number" ? Math.round(m.temp) : 15;

      return {
        iata: airport?.iata ?? m.icaoId,
        icao: m.icaoId,
        name: airport?.city ?? m.icaoId,
        metar: m.rawOb ?? "",
        cat,
        wind: `${dir}° at ${spd}kt${gust ? " " + gust : ""}`,
        vis,
        ceiling,
        temp,
        impact: catImpact(cat),
      };
    });
  } catch {
    return null;
  }
}

export async function getAirportWeather(): Promise<WeatherObs[]> {
  const icaos = AIRPORTS.slice(0, 12).map((a) => a.icao);
  const live = await fetchAWCMetars(icaos);
  if (live && live.length > 0) return live;

  // Fallback: build deterministic demo data (mirrors weather/page.tsx buildWx)
  const cats: WeatherObs["cat"][] = ["VFR", "MVFR", "IFR", "LIFR"];
  const seedRand = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return () => {
      h = (h * 1664525 + 1013904223) >>> 0;
      return (h & 0xffff) / 0x10000;
    };
  };
  return AIRPORTS.slice(0, 12).map((a) => {
    const r = seedRand(a.icao);
    const cat = cats[Math.floor(r() * cats.length)];
    const dir = Math.floor(r() * 360)
      .toString()
      .padStart(3, "0");
    const spd = Math.floor(8 + r() * 22)
      .toString()
      .padStart(2, "0");
    const gust =
      r() > 0.7 ? `G${Math.floor(parseInt(spd) + 6 + r() * 10)}` : "";
    const vis =
      cat === "LIFR"
        ? "1/2SM"
        : cat === "IFR"
        ? "2SM"
        : cat === "MVFR"
        ? "5SM"
        : "10SM";
    const ceil =
      cat === "LIFR"
        ? "OVC003"
        : cat === "IFR"
        ? "OVC008"
        : cat === "MVFR"
        ? "BKN025"
        : "FEW250";
    const temp = Math.floor(-5 + r() * 35);
    const dew = temp - Math.floor(r() * 8);
    const metar = `${a.icao} 0152Z ${dir}${spd}${gust}KT ${vis} ${ceil} ${temp
      .toString()
      .padStart(2, "0")}/${dew.toString().padStart(2, "0")} A2992 RMK AO2`;
    return {
      iata: a.iata,
      icao: a.icao,
      name: a.city,
      metar,
      cat,
      wind: `${dir}° at ${spd}kt${gust ? " " + gust : ""}`,
      vis,
      ceiling: ceil,
      temp,
      impact: catImpact(cat),
    };
  });
}

// ─── SIGMET / AIRMET ─────────────────────────────────────────────────────────

export type Sigmet = { id: string; text: string };

export async function getSigmets(): Promise<Sigmet[]> {
  try {
    const res = await fetch(
      "https://aviationweather.gov/api/data/airsigmet?format=json&type=sigmet",
      { next: { revalidate: 600 } }
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    return (data ?? [])
      .slice(0, 5)
      .map((s: { isigmetId?: string; rawAirSigmet?: string }) => ({
        id: s.isigmetId ?? "SIG",
        text: s.rawAirSigmet ?? "",
      }));
  } catch {
    return [
      {
        id: "WS US 36",
        text: "CONVECTIVE SIGMET 36C · TX/OK · TS TOPS FL420 · MOV E 25KT",
      },
      { id: "WA 102", text: "AIRMET TANGO · MTNS NW · MOD TURB BLW FL220" },
      { id: "WS UR-T", text: "URET · WAVE ACT · NRN ROCKIES · OCNL SEV" },
    ];
  }
}
