import { EnemyMissile, City, Battery } from "./entities";
import { GAME_CONFIG } from "./constants";

export function generateWave(
  waveNumber: number,
  cities: City[],
  batteries: Battery[]
): EnemyMissile[] {
  const enemies: EnemyMissile[] = [];
  const aliveCities = cities.filter((c) => c.alive);
  const aliveBatteries = batteries.filter((b) => b.alive);

  if (aliveCities.length === 0 && aliveBatteries.length === 0) {
    return enemies;
  }

  const targets = [...aliveCities, ...aliveBatteries];

  // Base count + progression
  const icbmCount = 5 + waveNumber * 2;
  const mirvCount = Math.floor(waveNumber / 2);
  const bomberCount = waveNumber > 3 ? Math.floor(waveNumber / 3) : 0;
  const smartBombCount = waveNumber > 5 ? Math.floor(waveNumber / 4) : 0;

  // Create ICBMs
  for (let i = 0; i < icbmCount; i++) {
    const target = targets[Math.floor(Math.random() * targets.length)];
    const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 100) + 50;
    enemies.push(
      new EnemyMissile("icbm", x, 0, target.x, target.y, GAME_CONFIG.ENEMY_ICBM_SPEED)
    );
  }

  // Create MIRVs
  for (let i = 0; i < mirvCount; i++) {
    const target = targets[Math.floor(Math.random() * targets.length)];
    const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 100) + 50;
    const splitCount = Math.floor(Math.random() * 4) + 3;
    enemies.push(
      new EnemyMissile(
        "mirv",
        x,
        0,
        target.x,
        target.y,
        GAME_CONFIG.ENEMY_MIRV_SPEED,
        splitCount
      )
    );
  }

  // Create Bombers
  for (let i = 0; i < bomberCount; i++) {
    const fromLeft = Math.random() > 0.5;
    const x = fromLeft ? 0 : GAME_CONFIG.CANVAS_WIDTH;
    const targetX = fromLeft ? GAME_CONFIG.CANVAS_WIDTH : 0;
    const y = Math.random() * 100 + 100;
    enemies.push(
      new EnemyMissile("bomber", x, y, targetX, y, GAME_CONFIG.ENEMY_BOMBER_SPEED)
    );
  }

  // Create Smart Bombs
  for (let i = 0; i < smartBombCount; i++) {
    const target = aliveBatteries[Math.floor(Math.random() * aliveBatteries.length)] || 
                   aliveCities[Math.floor(Math.random() * aliveCities.length)];
    if (target) {
      const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 100) + 50;
      enemies.push(
        new EnemyMissile(
          "smart",
          x,
          0,
          target.x,
          target.y,
          GAME_CONFIG.ENEMY_SMART_BOMB_SPEED
        )
      );
    }
  }

  // Shuffle to randomize spawn order
  return shuffleArray(enemies);
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function splitMIRV(mirv: EnemyMissile, cities: City[]): EnemyMissile[] {
  const aliveCities = cities.filter((c) => c.alive);
  if (aliveCities.length === 0) return [];

  const splitMissiles: EnemyMissile[] = [];
  const count = mirv.splitCount || 4;

  for (let i = 0; i < count; i++) {
    const target = aliveCities[Math.floor(Math.random() * aliveCities.length)];
    const offsetX = (Math.random() - 0.5) * 100;
    splitMissiles.push(
      new EnemyMissile(
        "icbm",
        mirv.x + offsetX,
        mirv.y,
        target.x + offsetX,
        target.y,
        GAME_CONFIG.ENEMY_ICBM_SPEED * 1.2
      )
    );
  }

  return splitMissiles;
}
