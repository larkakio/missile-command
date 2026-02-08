"use client";

import { FarcasterReady } from "@/components/FarcasterReady";
import { StartScreen } from "@/components/StartScreen";
import { GameCanvas } from "@/components/GameCanvas";
import { GameUI } from "@/components/GameUI";
import { GameOver } from "@/components/GameOver";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0e1a]">
      <FarcasterReady />
      <div className="w-full max-w-4xl">
        <StartScreen />
        <GameUI />
        <GameCanvas />
        <GameOver />
      </div>
    </main>
  );
}
