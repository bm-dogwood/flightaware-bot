// Mock realistic flight data. Coordinates in [lat, lng].
export type Airport = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  tz: string;
};

export const AIRPORTS: Airport[] = [
  {
    iata: "JFK",
    icao: "KJFK",
    name: "John F. Kennedy Intl",
    city: "New York",
    country: "USA",
    lat: 40.6413,
    lng: -73.7781,
    tz: "EST",
  },
  {
    iata: "LAX",
    icao: "KLAX",
    name: "Los Angeles Intl",
    city: "Los Angeles",
    country: "USA",
    lat: 33.9416,
    lng: -118.4085,
    tz: "PST",
  },
  {
    iata: "ORD",
    icao: "KORD",
    name: "O'Hare Intl",
    city: "Chicago",
    country: "USA",
    lat: 41.9742,
    lng: -87.9073,
    tz: "CST",
  },
  {
    iata: "ATL",
    icao: "KATL",
    name: "Hartsfield–Jackson",
    city: "Atlanta",
    country: "USA",
    lat: 33.6407,
    lng: -84.4277,
    tz: "EST",
  },
  {
    iata: "DFW",
    icao: "KDFW",
    name: "Dallas/Fort Worth Intl",
    city: "Dallas",
    country: "USA",
    lat: 32.8998,
    lng: -97.0403,
    tz: "CST",
  },
  {
    iata: "SFO",
    icao: "KSFO",
    name: "San Francisco Intl",
    city: "San Francisco",
    country: "USA",
    lat: 37.6213,
    lng: -122.379,
    tz: "PST",
  },
  {
    iata: "SEA",
    icao: "KSEA",
    name: "Seattle-Tacoma Intl",
    city: "Seattle",
    country: "USA",
    lat: 47.4502,
    lng: -122.3088,
    tz: "PST",
  },
  {
    iata: "MIA",
    icao: "KMIA",
    name: "Miami Intl",
    city: "Miami",
    country: "USA",
    lat: 25.7959,
    lng: -80.287,
    tz: "EST",
  },
  {
    iata: "LHR",
    icao: "EGLL",
    name: "Heathrow",
    city: "London",
    country: "UK",
    lat: 51.47,
    lng: -0.4543,
    tz: "GMT",
  },
  {
    iata: "CDG",
    icao: "LFPG",
    name: "Charles de Gaulle",
    city: "Paris",
    country: "France",
    lat: 49.0097,
    lng: 2.5479,
    tz: "CET",
  },
  {
    iata: "FRA",
    icao: "EDDF",
    name: "Frankfurt",
    city: "Frankfurt",
    country: "Germany",
    lat: 50.0379,
    lng: 8.5622,
    tz: "CET",
  },
  {
    iata: "AMS",
    icao: "EHAM",
    name: "Schiphol",
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3105,
    lng: 4.7683,
    tz: "CET",
  },
  {
    iata: "DXB",
    icao: "OMDB",
    name: "Dubai Intl",
    city: "Dubai",
    country: "UAE",
    lat: 25.2532,
    lng: 55.3657,
    tz: "GST",
  },
  {
    iata: "DOH",
    icao: "OTHH",
    name: "Hamad Intl",
    city: "Doha",
    country: "Qatar",
    lat: 25.2731,
    lng: 51.6086,
    tz: "AST",
  },
  {
    iata: "SIN",
    icao: "WSSS",
    name: "Changi",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3644,
    lng: 103.9915,
    tz: "SGT",
  },
  {
    iata: "HND",
    icao: "RJTT",
    name: "Haneda",
    city: "Tokyo",
    country: "Japan",
    lat: 35.5494,
    lng: 139.7798,
    tz: "JST",
  },
  {
    iata: "NRT",
    icao: "RJAA",
    name: "Narita Intl",
    city: "Tokyo",
    country: "Japan",
    lat: 35.772,
    lng: 140.3929,
    tz: "JST",
  },
  {
    iata: "HKG",
    icao: "VHHH",
    name: "Hong Kong Intl",
    city: "Hong Kong",
    country: "China",
    lat: 22.308,
    lng: 113.9185,
    tz: "HKT",
  },
  {
    iata: "PEK",
    icao: "ZBAA",
    name: "Beijing Capital",
    city: "Beijing",
    country: "China",
    lat: 40.0799,
    lng: 116.6031,
    tz: "CST",
  },
  {
    iata: "SYD",
    icao: "YSSY",
    name: "Kingsford Smith",
    city: "Sydney",
    country: "Australia",
    lat: -33.9399,
    lng: 151.1753,
    tz: "AEDT",
  },
  {
    iata: "GRU",
    icao: "SBGR",
    name: "Guarulhos",
    city: "São Paulo",
    country: "Brazil",
    lat: -23.4356,
    lng: -46.4731,
    tz: "BRT",
  },
  {
    iata: "MEX",
    icao: "MMMX",
    name: "Benito Juárez",
    city: "Mexico City",
    country: "Mexico",
    lat: 19.4361,
    lng: -99.0719,
    tz: "CST",
  },
  {
    iata: "YYZ",
    icao: "CYYZ",
    name: "Toronto Pearson",
    city: "Toronto",
    country: "Canada",
    lat: 43.6777,
    lng: -79.6248,
    tz: "EST",
  },
  {
    iata: "BLR",
    icao: "VOBL",
    name: "Kempegowda Intl",
    city: "Bengaluru",
    country: "India",
    lat: 13.1986,
    lng: 77.7066,
    tz: "IST",
  },
  {
    iata: "DEL",
    icao: "VIDP",
    name: "Indira Gandhi Intl",
    city: "New Delhi",
    country: "India",
    lat: 28.5562,
    lng: 77.1,
    tz: "IST",
  },
  {
    iata: "BOM",
    icao: "VABB",
    name: "Chhatrapati Shivaji",
    city: "Mumbai",
    country: "India",
    lat: 19.0896,
    lng: 72.8656,
    tz: "IST",
  },
  {
    iata: "IST",
    icao: "LTFM",
    name: "Istanbul Airport",
    city: "Istanbul",
    country: "Türkiye",
    lat: 41.2753,
    lng: 28.7519,
    tz: "TRT",
  },
  {
    iata: "JNB",
    icao: "FAOR",
    name: "OR Tambo",
    city: "Johannesburg",
    country: "South Africa",
    lat: -26.1392,
    lng: 28.246,
    tz: "SAST",
  },
];

export const AIRLINES = [
  { code: "AAL", iata: "AA", name: "American Airlines", color: "#E0142B" },
  { code: "UAL", iata: "UA", name: "United Airlines", color: "#3399cc" },
  { code: "DAL", iata: "DL", name: "Delta Air Lines", color: "#9B1B30" },
  { code: "BAW", iata: "BA", name: "British Airways", color: "#075aaa" },
  { code: "AFR", iata: "AF", name: "Air France", color: "#002157" },
  { code: "DLH", iata: "LH", name: "Lufthansa", color: "#FFB81C" },
  { code: "UAE", iata: "EK", name: "Emirates", color: "#D71921" },
  { code: "QTR", iata: "QR", name: "Qatar Airways", color: "#5C0F32" },
  { code: "SIA", iata: "SQ", name: "Singapore Airlines", color: "#1d3a76" },
  { code: "ANA", iata: "NH", name: "All Nippon Airways", color: "#13448F" },
  { code: "JAL", iata: "JL", name: "Japan Airlines", color: "#C8102E" },
  { code: "CPA", iata: "CX", name: "Cathay Pacific", color: "#006564" },
  { code: "AIC", iata: "AI", name: "Air India", color: "#E63946" },
  { code: "KLM", iata: "KL", name: "KLM", color: "#00A1E0" },
  { code: "THY", iata: "TK", name: "Turkish Airlines", color: "#C8102E" },
];

export type Flight = {
  id: string;
  callsign: string;
  airline: string;
  airlineColor: string;
  number: string;
  origin: Airport;
  dest: Airport;
  aircraft: string;
  status: "ON TIME" | "DELAYED" | "BOARDING" | "EN ROUTE" | "LANDED";
  altitude: number; // ft
  speed: number; // kt
  // progress 0..1
  progress: number;
  heading: number;
};

const AIRCRAFT = [
  "B77W",
  "B789",
  "A359",
  "A388",
  "B738",
  "A320",
  "A321N",
  "B763",
  "E190",
  "A350",
  "B748",
  "A220",
];

function rand(seed: number) {
  // Mulberry32 deterministic PRNG
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateFlights(count = 60, seed = 42): Flight[] {
  const r = rand(seed);
  const flights: Flight[] = [];
  const statuses: Flight["status"][] = [
    "EN ROUTE",
    "EN ROUTE",
    "EN ROUTE",
    "ON TIME",
    "DELAYED",
    "BOARDING",
    "LANDED",
  ];
  for (let i = 0; i < count; i++) {
    const o = AIRPORTS[Math.floor(r() * AIRPORTS.length)];
    let d = AIRPORTS[Math.floor(r() * AIRPORTS.length)];
    while (d.iata === o.iata) d = AIRPORTS[Math.floor(r() * AIRPORTS.length)];
    const al = AIRLINES[Math.floor(r() * AIRLINES.length)];
    const num = String(Math.floor(r() * 8999 + 100));
    flights.push({
      id: `${al.iata}${num}-${i}`,
      callsign: `${al.code}${num}`,
      airline: al.name,
      airlineColor: al.color,
      number: `${al.iata}${num}`,
      origin: o,
      dest: d,
      aircraft: AIRCRAFT[Math.floor(r() * AIRCRAFT.length)],
      status: statuses[Math.floor(r() * statuses.length)],
      altitude: Math.floor(28000 + r() * 14000),
      speed: Math.floor(420 + r() * 200),
      progress: r(),
      heading: Math.floor(r() * 360),
    });
  }
  return flights;
}

// Great-circle interpolation
export function gcInterpolate(
  a: [number, number],
  b: [number, number],
  t: number
): [number, number] {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const toDeg = (x: number) => (x * 180) / Math.PI;
  const lat1 = toRad(a[0]);
  const lon1 = toRad(a[1]);
  const lat2 = toRad(b[0]);
  const lon2 = toRad(b[1]);
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
      )
    );
  if (d === 0) return a;
  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);
  const x =
    A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
  const y =
    A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);
  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  const lon = Math.atan2(y, x);
  return [toDeg(lat), toDeg(lon)];
}

export function gcArc(
  a: [number, number],
  b: [number, number],
  steps = 64
): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) out.push(gcInterpolate(a, b, i / steps));
  return out;
}

export function bearing(a: [number, number], b: [number, number]) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const toDeg = (x: number) => (x * 180) / Math.PI;
  const φ1 = toRad(a[0]),
    φ2 = toRad(b[0]);
  const λ1 = toRad(a[1]),
    λ2 = toRad(b[1]);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export const AIRPORT_DELAYS = [
  {
    iata: "EWR",
    name: "Newark Liberty",
    reason: "Volume / Wind",
    avg: 142,
    status: "GROUND DELAY",
  },
  {
    iata: "LGA",
    name: "LaGuardia",
    reason: "Low Ceilings",
    avg: 88,
    status: "GROUND DELAY",
  },
  {
    iata: "SFO",
    name: "San Francisco",
    reason: "Marine Stratus",
    avg: 64,
    status: "GROUND DELAY",
  },
  {
    iata: "ORD",
    name: "O'Hare",
    reason: "Thunderstorms",
    avg: 47,
    status: "GROUND STOP",
  },
  {
    iata: "BOS",
    name: "Boston Logan",
    reason: "Crosswinds",
    avg: 31,
    status: "ADVISORY",
  },
  {
    iata: "ATL",
    name: "Atlanta",
    reason: "Runway Construction",
    avg: 22,
    status: "ADVISORY",
  },
  { iata: "JFK", name: "JFK", reason: "Volume", avg: 18, status: "ADVISORY" },
  {
    iata: "DEN",
    name: "Denver",
    reason: "Snow / De-icing",
    avg: 53,
    status: "GROUND DELAY",
  },
];
