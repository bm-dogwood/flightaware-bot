import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { FooterStrip, SideRail } from "@/components/side-rail";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLIGHTAWARE.BOT — Live Flight Tracking & Airport Status",
  description:
    "Real-time global flight tracker, airport delay board, route search, airline OTP and weather impact analysis.",
  authors: [{ name: "FLIGHTAWARE.BOT" }],
  keywords: [
    "flight tracker",
    "real time flight tracking",
    "airport delays",
    "flight status",
    "airline on-time statistics",
    "weather flight delays",
    "route search",
    "live flight map",
    "airport status board",
    "flight delay checker",
  ],
  openGraph: {
    type: "website",
    siteName: "Flightaware.Bot",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="min-h-screen flex flex-col">
          <TopBar />
          <SideRail />
          <main className="flex-1">{children}</main>
          <FooterStrip />
        </div>
      </body>
    </html>
  );
}
