// app/airlines/page.tsx
import type { Metadata } from "next";
import { AIRLINES } from "@/lib/flight-data";

export const metadata: Metadata = {
  title: "Airline On-Time Performance — FLIGHTAWARE.BOT",
  description:
    "Carrier on-time performance leaderboard. Completion factor, average delay, cancellation rate over the trailing 30 days.",
  openGraph: {
    title: "Airline On-Time Performance — FLIGHTAWARE.BOT",
    description: "Live OTP leaderboard across global carriers.",
  },
};

type Row = {
  iata: string;
  name: string;
  color: string;
  otp: number;
  comp: number;
  avgDelay: number;
  cancel: number;
};

function buildRows(): Row[] {
  const seedRand = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return () => {
      h = (h * 1664525 + 1013904223) >>> 0;
      return (h & 0xffff) / 0x10000;
    };
  };
  return AIRLINES.map((a) => {
    const r = seedRand(a.code);
    return {
      iata: a.iata,
      name: a.name,
      color: a.color,
      otp: 62 + Math.floor(r() * 30),
      comp: 95 + Math.floor(r() * 5),
      avgDelay: 8 + Math.floor(r() * 30),
      cancel: Math.round(r() * 25) / 10,
    };
  }).sort((a, b) => b.otp - a.otp);
}

export default function AirlinesPage() {
  const rows = buildRows();
  const top = rows[0];

  return (
    <div className="px-4 lg:px-6 pt-6 max-w-[1400px] mx-auto">
      <section className="mt-6 grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 font-mono text-[10px] tracking-[0.3em] text-amber flex items-center justify-between">
            <span>LEADERBOARD · {rows.length} CARRIERS</span>
            <span className="text-muted-foreground">RANK BY ON-TIME %</span>
          </div>
          <div className="grid grid-cols-[40px_1fr_120px_120px_120px_120px] gap-px bg-border/60 border-b border-border/60 font-mono text-[10px] tracking-widest text-muted-foreground">
            {[
              "#",
              "CARRIER",
              "ON-TIME",
              "COMPLETED",
              "AVG DELAY",
              "CANCEL %",
            ].map((h) => (
              <div key={h} className="bg-card/80 px-3 py-2">
                {h}
              </div>
            ))}
          </div>
          <ul>
            {rows.map((r, i) => (
              <li
                key={r.iata}
                className="grid grid-cols-[40px_1fr_120px_120px_120px_120px] gap-px bg-border/40"
              >
                <div className="bg-card/40 px-3 py-3 font-mono text-amber">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-xs flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{
                      background: r.color,
                      boxShadow: `0 0 8px ${r.color}`,
                    }}
                  />
                  <span className="font-bold text-foreground">{r.iata}</span>
                  <span className="text-muted-foreground">{r.name}</span>
                </div>
                <div className="bg-card/40 px-3 py-3">
                  <Bar
                    pct={r.otp}
                    label={`${r.otp}%`}
                    tone={
                      r.otp >= 80
                        ? "radar"
                        : r.otp >= 70
                        ? "amber"
                        : "destructive"
                    }
                  />
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-xs tabular-nums">
                  {r.comp}%
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-xs tabular-nums">
                  {r.avgDelay} min
                </div>
                <div className="bg-card/40 px-3 py-3 font-mono text-xs tabular-nums">
                  {r.cancel}%
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="relative border border-amber/60 rounded-md bg-card/60 backdrop-blur-md p-5 glow-amber overflow-hidden">
            <div className="font-mono text-[10px] tracking-[0.3em] text-amber">
              ★ LEADER · 30-DAY
            </div>
            <div className="mt-2 font-display font-bold text-3xl tracking-tight">
              {top.name}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {top.iata}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 font-mono">
              <Stat label="OTP" value={`${top.otp}%`} />
              <Stat label="COMP" value={`${top.comp}%`} />
              <Stat label="DELAY" value={`${top.avgDelay}m`} />
            </div>
          </div>

          <div className="border border-border/70 rounded-md bg-card/40 backdrop-blur-md p-4 font-mono text-xs text-muted-foreground leading-relaxed">
            <div className="text-amber tracking-[0.3em] text-[10px] mb-2">
              METHODOLOGY
            </div>
            On-time performance defined as arrival within 15 minutes of
            scheduled. Completion factor excludes cancellations from
            denominator. Cancellation rate is gate-out cancels per scheduled
            departure.
          </div>
        </aside>
      </section>
    </div>
  );
}

function Bar({
  pct,
  label,
  tone,
}: {
  pct: number;
  label: string;
  tone: "radar" | "amber" | "destructive";
}) {
  const c =
    tone === "radar"
      ? "bg-radar"
      : tone === "amber"
      ? "bg-amber"
      : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-background/60 rounded-full overflow-hidden">
        <div className={`h-full ${c}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs tabular-nums">{label}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/60 rounded-sm px-2 py-1.5">
      <div className="text-[9px] tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="text-sm text-foreground tabular-nums">{value}</div>
    </div>
  );
}
