// app/api/weather/route.ts
import { NextResponse } from "next/server";
import { AIRPORTS } from "@/lib/flight-data";

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

function parseCat(cat?: string): "VFR" | "MVFR" | "IFR" | "LIFR" {
  const c = (cat ?? "").toUpperCase();
  if (c === "LIFR") return "LIFR";
  if (c === "IFR") return "IFR";
  if (c === "MVFR") return "MVFR";
  return "VFR";
}

function catImpact(cat: string) {
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

export async function GET() {
  const icaos = AIRPORTS.slice(0, 12).map((a) => a.icao);

  try {
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${icaos.join(
        ","
      )}&format=json&hours=2`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`AWC error: ${res.status}`);
    const data: RawMetar[] = await res.json();
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("No METAR data");

    const obs = data.map((m) => {
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

    return NextResponse.json({ obs, live: true });
  } catch (err) {
    console.warn("AWC METAR API unavailable:", err);
    return NextResponse.json({ obs: [], live: false });
  }
}
