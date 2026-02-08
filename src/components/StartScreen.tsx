"use client";

import { useGame } from "@/context/GameContext";
import { useEffect } from "react";

export function StartScreen() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    // Load high score from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("missile-command-highscore");
      if (saved) {
        dispatch({ type: "SET_HIGH_SCORE", payload: parseInt(saved, 10) });
      }
    }
  }, [dispatch]);

  useEffect(() => {
    // Save high score
    if (typeof window !== "undefined" && state.highScore > 0) {
      localStorage.setItem("missile-command-highscore", state.highScore.toString());
    }
  }, [state.highScore]);

  if (state.gameState !== "menu") {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Title */}
        <h1
          className="text-5xl md:text-7xl font-bold text-[#00ff88] animate-pulse"
          style={{ textShadow: "0 0 30px #00ff88, 0 0 60px #00ff88" }}
        >
          MISSILE
          <br />
          COMMAND
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-[#00ddff]"
          style={{ textShadow: "0 0 10px #00ddff" }}
        >
          Defend Your Cities
        </p>

        {/* High Score */}
        {state.highScore > 0 && (
          <div className="font-mono text-[#00ff88]" style={{ textShadow: "0 0 10px #00ff88" }}>
            HIGH SCORE: {state.highScore.toString().padStart(6, "0")}
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Tap or swipe to fire missiles</p>
          <p>• Protect your cities from attack</p>
          <p>• Destroy MIRVs before they split</p>
          <p>• Survive as long as you can</p>
        </div>

        {/* Start Button */}
        <button
          onClick={() => dispatch({ type: "START_GAME" })}
          className="px-12 py-4 text-xl font-bold text-[#0a0e1a] bg-[#00ff88] rounded-lg
                     hover:bg-[#00ddff] transition-all duration-200 transform hover:scale-105
                     animate-pulse"
          style={{
            boxShadow: "0 0 30px #00ff88",
            minWidth: "200px",
            minHeight: "44px",
          }}
        >
          TAP TO START
        </button>

        {/* Credits */}
        <p className="text-xs text-gray-600 mt-8">Original by Atari 1980</p>
      </div>
    </div>
  );
}
