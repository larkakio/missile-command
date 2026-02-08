"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  City,
  Battery,
  PlayerMissile,
  EnemyMissile,
  Explosion,
} from "@/lib/game/entities";
import { GAME_CONFIG } from "@/lib/game/constants";

export type GameState = "menu" | "playing" | "gameOver";

interface GameContextState {
  gameState: GameState;
  score: number;
  highScore: number;
  wave: number;
  cities: City[];
  batteries: Battery[];
  playerMissiles: PlayerMissile[];
  enemyMissiles: EnemyMissile[];
  explosions: Explosion[];
  lastScore: number;
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "GAME_OVER" }
  | { type: "NEXT_WAVE" }
  | { type: "ADD_SCORE"; payload: number }
  | { type: "ADD_PLAYER_MISSILE"; payload: PlayerMissile }
  | { type: "ADD_ENEMY_MISSILES"; payload: EnemyMissile[] }
  | { type: "ADD_EXPLOSION"; payload: Explosion }
  | { type: "UPDATE_GAME_OBJECTS" }
  | { type: "DESTROY_CITY"; payload: number }
  | { type: "DESTROY_BATTERY"; payload: number }
  | { type: "RESTORE_CITY" }
  | { type: "SET_HIGH_SCORE"; payload: number };

const initialState: GameContextState = {
  gameState: "menu",
  score: 0,
  highScore: 0,
  wave: 1,
  cities: [],
  batteries: [],
  playerMissiles: [],
  enemyMissiles: [],
  explosions: [],
  lastScore: 0,
};

function initializeCities(): City[] {
  const cities: City[] = [];
  for (let i = 0; i < GAME_CONFIG.CITY_COUNT; i++) {
    const x = 150 + i * GAME_CONFIG.CITY_SPACING;
    cities.push(new City(x, GAME_CONFIG.CITY_Y));
  }
  return cities;
}

function initializeBatteries(): Battery[] {
  return [
    new Battery("left", GAME_CONFIG.BATTERY_POSITIONS[0].x, GAME_CONFIG.BATTERY_POSITIONS[0].y),
    new Battery("center", GAME_CONFIG.BATTERY_POSITIONS[1].x, GAME_CONFIG.BATTERY_POSITIONS[1].y),
    new Battery("right", GAME_CONFIG.BATTERY_POSITIONS[2].x, GAME_CONFIG.BATTERY_POSITIONS[2].y),
  ];
}

function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        gameState: "playing",
        highScore: state.highScore,
        cities: initializeCities(),
        batteries: initializeBatteries(),
      };

    case "GAME_OVER":
      return {
        ...state,
        gameState: "gameOver",
        lastScore: state.score,
        highScore: Math.max(state.score, state.highScore),
      };

    case "NEXT_WAVE":
      return {
        ...state,
        wave: state.wave + 1,
        playerMissiles: [],
        enemyMissiles: [],
        explosions: [],
      };

    case "ADD_SCORE":
      return {
        ...state,
        score: state.score + action.payload,
      };

    case "ADD_PLAYER_MISSILE":
      return {
        ...state,
        playerMissiles: [...state.playerMissiles, action.payload],
      };

    case "ADD_ENEMY_MISSILES":
      return {
        ...state,
        enemyMissiles: [...state.enemyMissiles, ...action.payload],
      };

    case "ADD_EXPLOSION":
      return {
        ...state,
        explosions: [...state.explosions, action.payload],
      };

    case "UPDATE_GAME_OBJECTS":
      return {
        ...state,
        playerMissiles: state.playerMissiles.filter((m) => m.alive),
        enemyMissiles: state.enemyMissiles.filter((m) => m.alive),
        explosions: state.explosions.filter((e) => e.alive),
      };

    case "DESTROY_CITY":
      const newCities = [...state.cities];
      if (newCities[action.payload]) {
        newCities[action.payload].alive = false;
      }
      return { ...state, cities: newCities };

    case "DESTROY_BATTERY":
      const newBatteries = [...state.batteries];
      if (newBatteries[action.payload]) {
        newBatteries[action.payload].alive = false;
      }
      return { ...state, batteries: newBatteries };

    case "RESTORE_CITY":
      const citiesWithRestore = [...state.cities];
      const firstDeadCity = citiesWithRestore.find((c) => !c.alive);
      if (firstDeadCity) {
        firstDeadCity.alive = true;
      }
      return { ...state, cities: citiesWithRestore };

    case "SET_HIGH_SCORE":
      return {
        ...state,
        highScore: action.payload,
      };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameContextState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
