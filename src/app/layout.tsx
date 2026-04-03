import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Providers } from "./providers";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://missile-command-two.vercel.app";

// Farcaster Mini App Embed
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "Missile Command - Defend Your Cities",
  description:
    "Classic arcade defense game on Base Network. Protect cities from missiles in this mobile mini app.",
  openGraph: {
    title: "Missile Command",
    description: "Defend your cities from nuclear attack",
    images: [
      {
        url: `${APP_URL}/hero-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Missile Command",
    description: "Classic arcade defense on Base",
    images: [`${APP_URL}/hero-image.png`],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "base:app_id":
      process.env.NEXT_PUBLIC_BASE_APP_ID ?? "6988951b6dea3c7b8e149fb4",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <GameProvider>{children}</GameProvider>
        </Providers>
      </body>
    </html>
  );
}
