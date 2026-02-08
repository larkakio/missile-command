"use client";

import { useGame } from "@/context/GameContext";
import { COLORS } from "@/lib/game/constants";

export function GameUI() {
  const { state } = useGame();

  if (state.gameState !== "playing") {
    return null;
  }

  const aliveCities = state.cities.filter((c) => c.alive).length;
  const totalMissiles = state.batteries.reduce((sum, b) => sum + b.missiles, 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top HUD */}
      <div className="flex justify-between items-center px-4 py-3 font-mono text-sm md:text-base">
        <div className="text-[#00ff88]" style={{ textShadow: "0 0 10px #00ff88" }}>
          SCORE: {state.score.toString().padStart(6, "0")}
        </div>
        <div className="text-[#00ddff]" style={{ textShadow: "0 0 10px #00ddff" }}>
          WAVE {state.wave}
        </div>
        <div className="text-[#00ff88]" style={{ textShadow: "0 0 10px #00ff88" }}>
          HIGH: {state.highScore.toString().padStart(6, "0")}
        </div>
      </div>

      {/* Bottom indicators */}
      <div className="flex justify-center items-center gap-8 px-4 py-3 mt-2">
        {/* Cities indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#00ff88] font-mono">CITIES:</span>
          <div className="flex gap-1">
            {state.cities.map((city, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: city.alive ? "#00ff88" : "#ff0044",
                  boxShadow: city.alive ? "0 0 8px #00ff88" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Missiles indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#00ddff] font-mono">AMMO:</span>
          <div className="flex gap-2">
            {state.batteries.map((battery, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(20, battery.missiles * 3)}px`,
                    backgroundColor: battery.alive ? "#00ddff" : "#666",
                    boxShadow: battery.alive ? "0 0 8px #00ddff" : "none",
                  }}
                />
                <span className="text-[10px] text-[#00ddff] font-mono mt-0.5">
                  {battery.missiles}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
