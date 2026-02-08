import { Battery } from "./entities";

export function selectBatteryForTarget(
  targetX: number,
  batteries: Battery[]
): Battery | null {
  // Filter available batteries
  const available = batteries.filter((b) => b.missiles > 0 && b.alive);
  if (available.length === 0) return null;

  // Prefer center battery if target is within 200px of center
  const center = available.find((b) => b.id === "center");
  if (center && Math.abs(targetX - center.x) < 200) {
    return center;
  }

  // Otherwise use closest battery
  return available.reduce((closest, battery) => {
    const dist = Math.abs(battery.x - targetX);
    const closestDist = Math.abs(closest.x - targetX);
    return dist < closestDist ? battery : closest;
  });
}
