import type { Metadata, Viewport } from "next";
import Script from "next/script";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Project Kingdom - Sovereign Strategy Engine",
  description: "Decentralized Clinical Intelligence Platform - Privacy-First, Edge-Native, Offline-Capable Healthcare AI.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StratumEdge",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

const GA_ID = "G-E7SLXKN585";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 (GA4) - Seventeen Pockets & Stratum Telemetry */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#FAF7F2] text-[#1a1a1a]">
        <PWAInstallBanner />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
