import { GAME_CONFIG, COLORS, EnemyType } from "./constants";

export interface Point {
  x: number;
  y: number;
}

export abstract class GameObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;

  constructor(x: number, y: number, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.alive = true;
  }

  abstract update(): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;

  checkCollision(other: GameObject, radius: number): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius;
  }
}

export class PlayerMissile extends GameObject {
  targetX: number;
  targetY: number;
  speed: number;
  trail: Point[];
  hasReachedTarget: boolean;

  constructor(x: number, y: number, targetX: number, targetY: number, speed: number) {
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;

    super(x, y, vx, vy);
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = speed;
    this.trail = [];
    this.hasReachedTarget = false;
  }

  update(): void {
    if (!this.alive || this.hasReachedTarget) return;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) {
      this.trail.shift();
    }

    this.x += this.vx;
    this.y += this.vy;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.hasReachedTarget = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    // Draw trail
    ctx.strokeStyle = COLORS.PLAYER_TRAIL;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    this.trail.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw missile head
    ctx.fillStyle = COLORS.PLAYER_MISSILE;
    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.PLAYER_MISSILE;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export class EnemyMissile extends GameObject {
  type: EnemyType;
  targetX: number;
  targetY: number;
  speed: number;
  trail: Point[];
  splitAltitude?: number;
  hasSplit: boolean;
  splitCount?: number;

  constructor(
    type: EnemyType,
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    speed: number,
    splitCount?: number
  ) {
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;

    super(x, y, vx, vy);
    this.type = type;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = speed;
    this.trail = [];
    this.hasSplit = false;

    if (type === "mirv") {
      this.splitAltitude = Math.random() * 200 + 200;
      this.splitCount = splitCount || Math.floor(Math.random() * 4) + 3;
    }
  }

  update(): void {
    if (!this.alive) return;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) {
      this.trail.shift();
    }

    this.x += this.vx;
    this.y += this.vy;

    // Check if reached target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    // Draw trail
    ctx.strokeStyle = COLORS.ENEMY_TRAIL;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    this.trail.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw missile
    ctx.fillStyle = COLORS.ENEMY_MISSILE;
    ctx.shadowBlur = 8;
    ctx.shadowColor = COLORS.ENEMY_MISSILE;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  shouldSplit(): boolean {
    return (
      this.type === "mirv" &&
      !this.hasSplit &&
      this.splitAltitude !== undefined &&
      this.y > this.splitAltitude
    );
  }
}

export class Explosion {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  currentFrame: number;
  duration: number;
  alive: boolean;

  constructor(x: number, y: number, maxRadius = GAME_CONFIG.EXPLOSION_RADIUS) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = maxRadius;
    this.currentFrame = 0;
    this.duration = GAME_CONFIG.EXPLOSION_DURATION;
    this.alive = true;
  }

  update(): void {
    this.currentFrame++;

    if (this.currentFrame < this.duration / 2) {
      // Expanding phase - grow to max radius
      this.radius = (this.currentFrame / (this.duration / 2)) * this.maxRadius;
    } else if (this.currentFrame < (this.duration / 2) + 15) {
      // Hold at max radius for 15 frames (~0.25 seconds)
      this.radius = this.maxRadius;
    } else if (this.currentFrame < this.duration) {
      // Contracting phase
      const contractStart = (this.duration / 2) + 15;
      const contractDuration = this.duration - contractStart;
      const progress = (this.currentFrame - contractStart) / contractDuration;
      this.radius = this.maxRadius * (1 - progress);
    } else {
      this.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || this.radius <= 0) return;

    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, COLORS.EXPLOSION_CORE);
    gradient.addColorStop(0.3, COLORS.EXPLOSION);
    gradient.addColorStop(0.7, "#ff6600");
    gradient.addColorStop(1, "rgba(255, 102, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 20;
    ctx.shadowColor = COLORS.EXPLOSION;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  checkCollision(enemy: EnemyMissile): boolean {
    const dx = this.x - enemy.x;
    const dy = this.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius;
  }
}

export class City {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = GAME_CONFIG.CITY_WIDTH;
    this.height = GAME_CONFIG.CITY_HEIGHT;
    this.alive = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const color = this.alive ? COLORS.CITY : COLORS.CITY_DESTROYED;

    ctx.fillStyle = color;
    if (this.alive) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
    }

    // Draw simple building shape
    ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
    ctx.fillRect(this.x - this.width / 3, this.y - this.height - 10, this.width / 1.5, 10);

    ctx.shadowBlur = 0;
  }

  checkHit(missile: EnemyMissile): boolean {
    if (!this.alive) return false;

    const dx = this.x - missile.x;
    const dy = this.y - missile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < 30;
  }
}

export class Battery {
  id: "left" | "center" | "right";
  x: number;
  y: number;
  missiles: number;
  maxMissiles: number;
  alive: boolean;

  constructor(id: "left" | "center" | "right", x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.missiles = GAME_CONFIG.BATTERY_MISSILES;
    this.maxMissiles = GAME_CONFIG.BATTERY_MISSILES;
    this.alive = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) return;

    ctx.fillStyle = COLORS.BATTERY;
    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.BATTERY;

    // Draw battery base
    ctx.fillRect(this.x - 15, this.y - 10, 30, 10);
    // Draw turret
    ctx.beginPath();
    ctx.arc(this.x, this.y - 10, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  launchMissile(targetX: number, targetY: number): PlayerMissile | null {
    if (!this.alive || this.missiles <= 0) return null;

    this.missiles--;
    const speed =
      this.id === "center"
        ? GAME_CONFIG.PLAYER_MISSILE_SPEED.CENTER
        : this.id === "left"
          ? GAME_CONFIG.PLAYER_MISSILE_SPEED.LEFT
          : GAME_CONFIG.PLAYER_MISSILE_SPEED.RIGHT;

    return new PlayerMissile(this.x, this.y - 10, targetX, targetY, speed);
  }

  checkHit(missile: EnemyMissile): boolean {
    if (!this.alive) return false;

    const dx = this.x - missile.x;
    const dy = this.y - missile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < 25;
  }
}
