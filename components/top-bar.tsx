// components/top-bar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "LIVE MAP", code: "LIV" },
  { to: "/delays", label: "DELAY BOARD", code: "DLY" },
  { to: "/routes", label: "ROUTE SEARCH", code: "RTE" },
  { to: "/airlines", label: "AIRLINES", code: "OTP" },
  { to: "/weather", label: "WX IMPACT", code: "WX" },
] as const;

function useUTC() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return t.toISOString().slice(11, 19) + "Z";
}

export function TopBar() {
  const pathname = usePathname();
  const utc = useUTC();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 backdrop-blur-xl bg-background/70">
      <div className="flex items-center gap-6 px-4 lg:px-6 h-14">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-sm border border-amber/60 grid place-items-center overflow-hidden glow-amber">
            <div className="absolute inset-0 radar-sweep opacity-70" />
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-amber relative"
              fill="currentColor"
            >
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
            </svg>
          </div>
          <div className="leading-none">
            <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              SIGNAL ACTIVE · ATC NET
            </div>
            <div className="font-display font-bold text-lg tracking-tight">
              FLIGHTAWARE<span className="text-amber">.BOT</span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`group relative px-3 py-2 font-mono text-xs tracking-wider transition-colors ${
                  active
                    ? "text-amber"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-amber/40 mr-2">[{n.code}]</span>
                {n.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-px bg-amber glow-amber" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-radar blink shadow-[0_0_8px_var(--color-radar)]" />
            <span className="text-muted-foreground">ADS-B</span>
            <span className="text-foreground">12,847</span>
            <span className="text-muted-foreground">aircraft</span>
          </div>
          <div className="font-mono text-xs text-amber tabular-nums border border-amber/40 px-2 py-1 rounded-sm">
            {utc}
          </div>
        </div>
      </div>

      <Ticker />
    </header>
  );
}

function Ticker() {
  const items = [
    "ZULU 0000Z · NAS NORMAL OPERATIONS",
    "EWR — GROUND DELAY PROGRAM · AVG 1H42M",
    "SFO — STRATUS BURNING OFF · APPROACHES TO 28L/R",
    "ORD — TSTM CELLS NW · GROUND STOP UNTIL 0245Z",
    "TRANS-PAC TRAFFIC NOMINAL · JET STREAM 195KT",
    "ATL — RWY 9L/27R CLOSED · MAINT WINDOW",
    "LHR — CAT II APPROACHES IN PROGRESS",
    "TRANSCON EAST OPS NORMAL · CONTRAILS LIGHT",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="border-t border-border/60 overflow-hidden bg-background/40">
      <div className="ticker py-1.5 font-mono text-[11px] tracking-wider">
        {doubled.map((t, i) => (
          <span key={i} className="text-muted-foreground">
            <span className="text-amber mr-2">◆</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
