import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://missile-command-two.vercel.app";

// Farcaster Mini App Embed
const FC_EMBED = {
  version: "1",
  imageUrl: `${APP_URL}/hero-image.png`,
  button: {
    title: "Defend Cities",
    action: {
      type: "launch_frame",
      name: "Missile Command",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/hero-image.png`,
      splashBackgroundColor: "#0a0e1a",
    },
  },
};

export const metadata: Metadata = {
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
    viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
    "theme-color": "#0a0e1a",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "fc:miniapp": JSON.stringify(FC_EMBED),
    "fc:frame": JSON.stringify(FC_EMBED),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="base:app_id" content="6988951b6dea3c7b8e149fb4" />
      </head>
      <body className="antialiased">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
