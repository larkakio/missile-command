"use client";

import { useGame } from "@/context/GameContext";

export function GameOver() {
  const { state, dispatch } = useGame();

  if (state.gameState !== "gameOver") {
    return null;
  }

  const aliveCities = state.cities.filter((c) => c.alive).length;
  const totalMissiles = state.batteries.reduce((sum, b) => sum + b.missiles, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* THE END */}
        <h1
          className="text-6xl md:text-8xl font-bold text-[#ff0044]"
          style={{ textShadow: "0 0 30px #ff0044, 0 0 60px #ff0044" }}
        >
          THE END
        </h1>

        {/* Stats */}
        <div className="space-y-4 font-mono text-lg">
          <div className="text-[#00ff88]" style={{ textShadow: "0 0 10px #00ff88" }}>
            FINAL SCORE: {state.lastScore.toString().padStart(6, "0")}
          </div>

          <div className="text-[#00ddff]" style={{ textShadow: "0 0 10px #00ddff" }}>
            WAVE REACHED: {state.wave}
          </div>

          <div className="text-gray-400">
            CITIES SAVED: {aliveCities} / {state.cities.length}
          </div>
        </div>

        {/* High Score */}
        {state.lastScore === state.highScore && state.highScore > 0 && (
          <div
            className="text-2xl font-bold text-[#ffdd00] animate-pulse"
            style={{ textShadow: "0 0 20px #ffdd00" }}
          >
            NEW HIGH SCORE!
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={() => dispatch({ type: "START_GAME" })}
          className="px-12 py-4 text-xl font-bold text-[#0a0e1a] bg-[#00ff88] rounded-lg
                     hover:bg-[#00ddff] transition-all duration-200 transform hover:scale-105
                     mt-8"
          style={{
            boxShadow: "0 0 30px #00ff88",
            minWidth: "200px",
            minHeight: "44px",
          }}
        >
          TAP TO RESTART
        </button>

        {/* Share prompt */}
        <p className="text-sm text-gray-500 mt-4">
          Share your score with friends!
        </p>
      </div>
    </div>
  );
}
