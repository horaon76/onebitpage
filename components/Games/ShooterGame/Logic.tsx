import { Enemies, Player, PowerUps, Projectile } from "./interface";
import { playBeep, playGameOverSound, playVictoryMelody } from "./Sound";
import {
  balloonOptions,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  powerUpOptions,
} from "./utils";

// Entity creation functions
export const createPowerUp = () => {
  const x = Math.random() * CANVAS_WIDTH;
  const powerUpType = powerUpOptions[0];
  const powerUpImg = new Image();
  powerUpImg.src = powerUpType.src;

  return {
    x,
    y: 0,
    image: powerUpImg,
    type: powerUpType.type,
  };
};

export const createEnemy = (velocity: number) => {
  const x = Math.random() * CANVAS_WIDTH;
  const balloonType =
    balloonOptions[Math.floor(Math.random() * balloonOptions.length)];
  const enemyImg = new Image();
  enemyImg.src = balloonType.src;

  return {
    x,
    y: 0,
    image: enemyImg,
    points: balloonType.points,
    speed: velocity,
  };
};

// Drawing functions
export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: React.MutableRefObject<Player>,
  fighterImgRef: React.MutableRefObject<HTMLImageElement | null>
) => {
  if (fighterImgRef.current) {
    ctx.drawImage(
      fighterImgRef.current,
      player.current.x - 25,
      player.current.y,
      50,
      50
    );
  }
};

export const drawProjectiles = (
  ctx: CanvasRenderingContext2D,
  projectiles: React.MutableRefObject<Projectile[]>,
  bulletSpeed: number
) => {
  projectiles.current.forEach((p) => {
    p.y -= bulletSpeed;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });
};

export const drawEnemies = (
  ctx: CanvasRenderingContext2D,
  enemies: React.MutableRefObject<Enemies[]>
) => {
  enemies.current.forEach((e) => {
    e.y += e.speed;
    ctx.drawImage(e.image, e.x - 20, e.y, 40, 40);
  });
};

export const drawPowerUps = (
  ctx: CanvasRenderingContext2D,
  powerUps: React.MutableRefObject<PowerUps[]>
) => {
  powerUps.current.forEach((p) => {
    p.y += 3;
    ctx.drawImage(p.image, p.x - 15, p.y, 30, 30);
  });
};

// Collision detection functions
export const checkProjectileEnemyCollisions = (
  projectiles: React.MutableRefObject<Projectile[]>,
  enemies: React.MutableRefObject<Enemies[]>,
  score: number,
  maxScore: number,
  isMuted: boolean,
  setScore: (score: number) => void,
  setLevelCompleted: (completed: boolean) => void
) => {
  projectiles.current = projectiles.current.filter((p) => {
    return !enemies.current.some((e, eIndex) => {
      const dist = Math.hypot(p.x - e.x, p.y - e.y);
      if (dist < 20 + p.radius) {
        const newScore = score + e.points;
        if (newScore >= maxScore) {
          playVictoryMelody(isMuted);
          setLevelCompleted(true);
        }
        setScore(newScore);
        enemies.current.splice(eIndex, 1);
        playBeep(isMuted);
        return true;
      }
      return false;
    });
  });
};

export const checkEnemyBottomCollisions = (
  enemies: React.MutableRefObject<Enemies[]>,
  lives: number,
  isMuted: boolean,
  setLives: (lives: number) => void,
  setGameOver: (over: boolean) => void
) => {
  enemies.current = enemies.current.filter((e) => {
    if (e.y > CANVAS_HEIGHT) {
      if (lives - 1 <= 0) {
        playGameOverSound(isMuted);
        setGameOver(true);
      }
      setLives(lives - 1 <= 0 ? 0 : lives - 1);
      return false;
    }
    return true;
  });
};

export const checkPowerUpCollisions = (
  powerUps: React.MutableRefObject<PowerUps[]>,
  player: React.MutableRefObject<Player>,
  bulletCount: number,
  bulletSpeed: number,
  isMuted: boolean,
  setBulletCount: (count: number) => void,
  setBulletSpeed: (speed: number) => void
) => {
  powerUps.current = powerUps.current.filter((p) => {
    const dist = Math.hypot(p.x - player.current.x, p.y - player.current.y);

    if (dist < 25 + 15) {
      if (p.type === "bullet") {
        if (bulletCount < 5) {
          setBulletCount(bulletCount + 1);
        } else {
          setBulletSpeed(bulletSpeed + 2);
        }
        playBeep(isMuted);
      }
      return false;
    }

    if (p.y > CANVAS_HEIGHT) return false;

    return true;
  });
};

// Game initialization
export const initializeGame = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  if (!canvas) return null;
  
  // Only resize if dimensions changed
  if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }
  
  const ctx = canvas.getContext("2d", { 
    // alpha: false, // Disable alpha for better performance
    // desynchronized: true // Better for games
  });
  
  if (!ctx) return null;
  
  // Optimize rendering settings
  ctx.imageSmoothingEnabled = true; // For pixel art
  return ctx;
};

