"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/context/GameContext";
import { useSwipeControls } from "@/hooks/useSwipeControls";
import { useAudio, triggerHaptic } from "@/hooks/useAudio";
import { selectBatteryForTarget } from "@/lib/game/batteries";
import { generateWave, splitMIRV } from "@/lib/game/waves";
import { checkExplosionCollision, checkCityHit, checkBatteryHit } from "@/lib/game/physics";
import { calculateEnemyScore, shouldAwardBonusCity } from "@/lib/game/scoring";
import { Explosion } from "@/lib/game/entities";
import { COLORS, GAME_CONFIG } from "@/lib/game/constants";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { state, dispatch } = useGame();
  const audio = useAudio();
  const audioRef = useRef(audio); // Store audio in ref
  const animationFrameRef = useRef<number | undefined>(undefined);
  const waveSpawnedRef = useRef(false);
  const enemiesSeenRef = useRef(false); // Track if we've seen enemies this wave
  const stateRef = useRef(state); // Store latest state in ref

  // Update refs whenever they change
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);

  // Responsive canvas
  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight - 120;
      const aspectRatio = 4 / 3;

      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Swipe controls
  const handleSwipe = (event: { x: number; y: number }) => {
    if (state.gameState !== "playing") return;

    const battery = selectBatteryForTarget(event.x, state.batteries);
    if (!battery || battery.missiles <= 0) {
      audio.playNoAmmo();
      triggerHaptic("light");
      return;
    }

    const missile = battery.launchMissile(event.x, event.y);
    if (missile) {
      dispatch({ type: "ADD_PLAYER_MISSILE", payload: missile });
      audio.playLaunch();
      triggerHaptic("light");
    }
  };

  useSwipeControls(canvasRef, handleSwipe);

  // Game loop
  useEffect(() => {
    if (state.gameState !== "playing") {
      waveSpawnedRef.current = false;
      enemiesSeenRef.current = false;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;

      if (deltaTime >= GAME_CONFIG.FRAME_TIME) {
        // Get current state from ref
        const currentState = stateRef.current;

        // Spawn wave enemies
        if (!waveSpawnedRef.current && currentState.enemyMissiles.length === 0) {
          const enemies = generateWave(currentState.wave, currentState.cities, currentState.batteries);
          dispatch({ type: "ADD_ENEMY_MISSILES", payload: enemies });
          waveSpawnedRef.current = true;
          enemiesSeenRef.current = false; // Reset for new wave
        }

        // Track if we've seen enemies (means dispatch worked)
        if (currentState.enemyMissiles.length > 0) {
          enemiesSeenRef.current = true;
        }

        // UPDATE PHASE
        // Update player missiles
        currentState.playerMissiles.forEach((missile) => {
          missile.update();
          if (missile.hasReachedTarget && missile.alive) {
            missile.alive = false;
            const explosion = new Explosion(missile.x, missile.y);
            dispatch({ type: "ADD_EXPLOSION", payload: explosion });
            audioRef.current.playExplosion();
          }
        });

        // Update enemy missiles
        currentState.enemyMissiles.forEach((missile) => {
          missile.update();

          // Check MIRV split
          if (missile.shouldSplit()) {
            missile.hasSplit = true;
            missile.alive = false;
            const splitMissiles = splitMIRV(missile, currentState.cities);
            dispatch({ type: "ADD_ENEMY_MISSILES", payload: splitMissiles });
          }
        });

        // Update explosions
        currentState.explosions.forEach((explosion) => {
          explosion.update();
        });

        // Check collisions - explosions vs enemies
        currentState.explosions.forEach((explosion) => {
          currentState.enemyMissiles.forEach((enemy) => {
            if (enemy.alive && checkExplosionCollision(explosion, enemy)) {
              enemy.alive = false;
              const score = calculateEnemyScore(enemy.type);
              const oldScore = currentState.score;
              dispatch({ type: "ADD_SCORE", payload: score });
              
              if (shouldAwardBonusCity(oldScore, oldScore + score)) {
                dispatch({ type: "RESTORE_CITY" });
              }
              triggerHaptic("medium");
            }
          });
        });

        // Check enemy hits on cities
        currentState.enemyMissiles.forEach((enemy) => {
          currentState.cities.forEach((city, index) => {
            if (city.alive && checkCityHit(city, enemy)) {
              enemy.alive = false;
              dispatch({ type: "DESTROY_CITY", payload: index });
              audioRef.current.playCityDestroyed();
              triggerHaptic("heavy");
            }
          });
        });

        // Check enemy hits on batteries
        currentState.enemyMissiles.forEach((enemy) => {
          currentState.batteries.forEach((battery, index) => {
            if (battery.alive && checkBatteryHit(battery, enemy)) {
              enemy.alive = false;
              dispatch({ type: "DESTROY_BATTERY", payload: index });
              audioRef.current.playCityDestroyed();
              triggerHaptic("heavy");
            }
          });
        });

        // Clean up dead objects
        dispatch({ type: "UPDATE_GAME_OBJECTS" });

        // Check wave completion - only if wave was spawned AND we've seen enemies
        if (
          waveSpawnedRef.current &&
          enemiesSeenRef.current && // Only check completion after we confirmed enemies were added
          currentState.enemyMissiles.length === 0 &&
          currentState.explosions.length === 0
        ) {
          // Check game over condition
          const aliveCities = currentState.cities.filter((c) => c.alive).length;
          const aliveBatteries = currentState.batteries.filter((b) => b.alive).length;

          if (aliveCities === 0 && aliveBatteries === 0) {
            dispatch({ type: "GAME_OVER" });
          } else {
            waveSpawnedRef.current = false;
            enemiesSeenRef.current = false;
            dispatch({ type: "NEXT_WAVE" });
          }
        }

        // RENDER PHASE
        ctx.save();
        ctx.scale(canvas.width / 800, canvas.height / 600);

        // Clear canvas
        ctx.fillStyle = COLORS.SKY;
        ctx.fillRect(0, 0, 800, 600);

        // Draw ground
        ctx.fillStyle = COLORS.GROUND;
        ctx.fillRect(0, 560, 800, 40);

        // Draw cities
        currentState.cities.forEach((city) => city.draw(ctx));

        // Draw batteries
        currentState.batteries.forEach((battery) => battery.draw(ctx));

        // Draw missiles
        currentState.enemyMissiles.forEach((missile) => missile.draw(ctx));
        currentState.playerMissiles.forEach((missile) => missile.draw(ctx));

        // Draw explosions
        currentState.explosions.forEach((explosion) => explosion.draw(ctx));

        ctx.restore();

        lastTime = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.gameState, dispatch]); // Only depend on gameState and dispatch

  if (state.gameState !== "playing") {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: "100%",
          border: "2px solid #00ddff",
          boxShadow: "0 0 20px rgba(0, 221, 255, 0.3)",
        }}
        className="touch-none"
      />
    </div>
  );
}
