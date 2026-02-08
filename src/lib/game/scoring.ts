import { GAME_CONFIG, EnemyType } from "./constants";

export function calculateEnemyScore(type: EnemyType): number {
  switch (type) {
    case "icbm":
      return GAME_CONFIG.SCORE_ICBM;
    case "mirv":
      return GAME_CONFIG.SCORE_MIRV;
    case "bomber":
      return GAME_CONFIG.SCORE_BOMBER;
    case "satellite":
      return GAME_CONFIG.SCORE_SATELLITE;
    case "smart":
      return GAME_CONFIG.SCORE_SMART_BOMB;
    default:
      return 0;
  }
}

export function calculateWaveBonus(
  remainingCities: number,
  remainingMissiles: number
): number {
  return (
    remainingCities * GAME_CONFIG.SCORE_REMAINING_CITY +
    remainingMissiles * GAME_CONFIG.SCORE_REMAINING_MISSILE
  );
}

export function shouldAwardBonusCity(oldScore: number, newScore: number): boolean {
  const oldBonuses = Math.floor(oldScore / GAME_CONFIG.BONUS_CITY_INTERVAL);
  const newBonuses = Math.floor(newScore / GAME_CONFIG.BONUS_CITY_INTERVAL);
  return newBonuses > oldBonuses;
}
