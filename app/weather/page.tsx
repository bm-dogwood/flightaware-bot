// app/weather/page.tsx
import { getAirportWeather, getSigmets } from "@/lib/api";
import { PageHeader } from "@/app/delays/page";
import type { Metadata } from "next";
import type { WeatherObs } from "@/lib/api";

export const metadata: Metadata = {
  title: "Weather Impact — FLIGHTAWARE.BOT",
  description: "Live METAR, TAF, and SIGMET data from Aviation Weather Center.",
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function WeatherPage() {
  const [rows, sigmets] = await Promise.all([
    getAirportWeather(),
    getSigmets(),
  ]);

  return (
    <div className="px-4 lg:px-6 pt-6 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="METAR · TAF · SIGMET"
        title="Weather Impact"
        sub="Live observations from the Aviation Weather Center, decoded for the flights that matter to you."
      />

      <section className="mt-6 grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {rows.map((w) => (
            <WxCard key={w.iata} w={w} />
          ))}
        </div>
        <aside className="space-y-4">
          <CatLegend />
          <Sigmets items={sigmets} />
        </aside>
      </section>
    </div>
  );
}

function WxCard({ w }: { w: WeatherObs }) {
  const tone =
    w.cat === "VFR"
      ? "radar"
      : w.cat === "MVFR"
      ? "accent"
      : w.cat === "IFR"
      ? "amber"
      : "destructive";
  const toneCls =
    tone === "radar"
      ? "text-radar border-radar/50"
      : tone === "accent"
      ? "text-accent border-accent/50"
      : tone === "amber"
      ? "text-amber border-amber/50"
      : "text-destructive border-destructive/50";
  return (
    <article className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4">
      <header className="flex items-start justify-between">
        <div>
          <div className="font-display font-bold text-3xl text-amber leading-none">
            {w.iata}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground mt-1">
            {w.name}
          </div>
        </div>
        <span
          className={`border px-2 py-1 font-mono text-[10px] tracking-widest rounded-sm ${toneCls}`}
        >
          ● {w.cat}
        </span>
      </header>
      <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
        <Cell label="WIND" value={w.wind} />
        <Cell label="VIS" value={w.vis} />
        <Cell label="CEILING" value={w.ceiling} />
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-wider text-muted-foreground bg-background/40 border border-border/60 rounded-sm p-2 break-all">
        {w.metar}
      </div>
      <div className="mt-2 font-mono text-[11px] text-foreground/80">
        ⤷ {w.impact}
      </div>
    </article>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/60 rounded-sm p-2">
      <div className="text-[9px] tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="text-foreground">{value}</div>
    </div>
  );
}

function CatLegend() {
  const items: { c: WeatherObs["cat"]; cls: string; d: string }[] = [
    { c: "VFR", cls: "bg-radar", d: "Ceiling >3,000 · vis >5SM" },
    { c: "MVFR", cls: "bg-accent", d: "Ceiling 1,000–3,000 · vis 3–5SM" },
    { c: "IFR", cls: "bg-amber", d: "Ceiling 500–1,000 · vis 1–3SM" },
    { c: "LIFR", cls: "bg-destructive", d: "Ceiling <500 · vis <1SM" },
  ];
  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber mb-3">
        FLIGHT CATEGORY
      </div>
      <ul className="space-y-2 font-mono text-xs">
        {items.map((i) => (
          <li key={i.c} className="flex items-start gap-2">
            <span className={`mt-1.5 w-2 h-2 rounded-full ${i.cls}`} />
            <div>
              <div className="text-foreground tracking-widest">{i.c}</div>
              <div className="text-muted-foreground">{i.d}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Sigmets({ items }: { items: { id: string; text: string }[] }) {
  return (
    <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4">
      <div className="font-mono text-[10px] tracking-[0.3em] text-amber mb-3">
        SIGMET / AIRMET · ACTIVE
      </div>
      <ul className="space-y-2 font-mono text-xs">
        {items.map((s) => (
          <li key={s.id} className="border-l-2 border-amber/60 pl-2">
            <div className="text-amber tracking-widest text-[10px]">{s.id}</div>
            <div className="text-muted-foreground">{s.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
