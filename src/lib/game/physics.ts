import { Explosion, EnemyMissile, City, Battery } from "./entities";

export function checkExplosionCollision(
  explosion: Explosion,
  missile: EnemyMissile
): boolean {
  if (!missile.alive || !explosion.alive) return false;
  return explosion.checkCollision(missile);
}

export function checkCityHit(city: City, missile: EnemyMissile): boolean {
  return city.checkHit(missile);
}

export function checkBatteryHit(battery: Battery, missile: EnemyMissile): boolean {
  return battery.checkHit(missile);
}
