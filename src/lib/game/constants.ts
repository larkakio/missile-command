export const GAME_CONFIG = {
  // Canvas dimensions (logical coordinates)
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  // Cities
  CITY_COUNT: 6,
  CITY_WIDTH: 30,
  CITY_HEIGHT: 20,
  CITY_SPACING: 100,
  CITY_Y: 550,

  // Batteries
  BATTERY_COUNT: 3,
  BATTERY_MISSILES: 10,
  BATTERY_POSITIONS: [
    { x: 100, y: 550 }, // Left
    { x: 400, y: 570 }, // Center (lower)
    { x: 700, y: 550 }, // Right
  ],

  // Player missiles
  PLAYER_MISSILE_SPEED: {
    LEFT: 8,
    CENTER: 12, // Faster!
    RIGHT: 8,
  },
  EXPLOSION_RADIUS: 80,
  EXPLOSION_DURATION: 60, // frames (1 sec at 60fps)

  // Enemies
  ENEMY_ICBM_SPEED: 2.5,
  ENEMY_MIRV_SPEED: 3,
  ENEMY_BOMBER_SPEED: 3.5,
  ENEMY_SATELLITE_SPEED: 2,
  ENEMY_SMART_BOMB_SPEED: 2.8,

  // Waves
  WAVE_INITIAL_MISSILES: 5,
  WAVE_INCREMENT: 3,
  MAX_SIMULTANEOUS_ATTACKS: 8,

  // Scoring
  SCORE_ICBM: 25,
  SCORE_MIRV: 50,
  SCORE_BOMBER: 100,
  SCORE_SATELLITE: 100,
  SCORE_SMART_BOMB: 125,
  SCORE_REMAINING_CITY: 100,
  SCORE_REMAINING_MISSILE: 5,
  BONUS_CITY_INTERVAL: 10000, // Every 10k points

  // FPS
  TARGET_FPS: 60,
  FRAME_TIME: 1000 / 60,
};

export const COLORS = {
  SKY: "#0a0e1a",
  GROUND: "#1a1a2e",
  CITY: "#00ff88",
  CITY_DESTROYED: "#ff0044",
  BATTERY: "#00ddff",
  PLAYER_MISSILE: "#ffffff",
  PLAYER_TRAIL: "#88ccff",
  ENEMY_MISSILE: "#ff3366",
  ENEMY_TRAIL: "#ff8899",
  EXPLOSION: "#ffdd00",
  EXPLOSION_CORE: "#ffffff",
  UI_TEXT: "#00ff88",
  UI_ACCENT: "#00ddff",
};

export type EnemyType = "icbm" | "mirv" | "bomber" | "satellite" | "smart";
