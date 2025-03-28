import React, { useEffect, useRef, useCallback, useState } from "react";
import Ratings from "@/components/Games/ShooterGame/Ratings";
import { useGameStore } from "@/components/Games/ShooterGame/Store";
import {
  planeOptions,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "@/components/Games/ShooterGame/utils";
import {
  Enemies,
  PowerUps,
  Player,
  Projectile,
} from "@/components/Games/ShooterGame/interface";
import { playShootSound } from "@/components/Games/ShooterGame/Sound";
import ShooterGameIntro from "@/components/Games/ShooterGame/ShooterGameIntro";
import LevelComplete from "@/components/Games/ShooterGame/Stage/LevelComplete";
import GameOver from "@/components/Games/ShooterGame/Stage/GameOver";
import GameStartMenu from "@/components/Games/ShooterGame/Stage/GameStartMenu";
import GameHeader from "@/components/Games/ShooterGame/GameHeader";
import {
  createPowerUp,
  createEnemy,
  drawPlayer,
  drawProjectiles,
  drawEnemies,
  drawPowerUps,
  checkProjectileEnemyCollisions,
  checkEnemyBottomCollisions,
  checkPowerUpCollisions,
  initializeGame,
} from "@/components/Games/ShooterGame/Logic";

// Add these variables at the top of your component
// Frame rate control constants
const TARGET_FPS = 60;
const MS_PER_FRAME = 1000 / TARGET_FPS;

const ShooterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const fighterImgRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const projectiles = useRef<Projectile[]>([]);
  const enemies = useRef<Enemies[]>([]);
  const powerUps = useRef<PowerUps[]>([]);
  const player = useRef<Player>({ x: 0, y: 0, width: 40, height: 40 });
  // Add state for tracking pressed keys
  const keys = useRef({
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  });
  // Frame rate tracking
  const lastFrameTime = useRef(performance.now());
  const fpsCounter = useRef(0);
  const lastFpsUpdate = useRef(performance.now());
  const [currentFps, setCurrentFps] = useState(0);
  const frameDelta = useRef(0);
  const {
    isMuted,
    gameStarted,
    gameOver,
    levelCompleted,
    score,
    maxScore,
    level,
    lives,
    bulletCount,
    bulletSpeed,
    velocity,
    selectedPlane,
    totalScore,
    setSelectedMusic,
    setGameStarted,
    setGameOver,
    setLevel,
    setLevelCompleted,
    setScore,
    setSelectedPlane,
    setBulletCount,
    setBulletSpeed,
    setLives,
    setVelocity,
    setIsMuted,
    setMaxScore,
  } = useGameStore();


  console.log("isMuted", isMuted);
  
  // Initialize player and canvas
  useEffect(() => {
    const planeImg = new Image();
    planeImg.src = selectedPlane;
    planeImg.onload = () => (fighterImgRef.current = planeImg);
    player.current.x = CANVAS_WIDTH / 2;
    player.current.y = CANVAS_HEIGHT - 60;
  }, [selectedPlane]);
  const spawnEntities = useCallback(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    // 10% chance to spawn power-up
    if (Math.random() < 0.1) {
      const powerUp = createPowerUp();
      powerUp.image.onload = () => {
        powerUps.current.push(powerUp);
      };
    } else {
      // Spawn enemy
      const enemy = createEnemy(velocity);
      enemy.image.onload = () => {
        enemies.current.push(enemy);
      };
    }
  }, [gameStarted, gameOver, levelCompleted, velocity]);

  // Optimized game loop with fixed timestep
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameOver || levelCompleted || !gameStarted) {
        return;
      }

      // Calculate delta time
      frameDelta.current = timestamp - lastFrameTime.current;
      lastFrameTime.current = timestamp;

      // Update FPS counter
      fpsCounter.current++;
      if (timestamp - lastFpsUpdate.current >= 1000) {
        setCurrentFps(fpsCounter.current);
        fpsCounter.current = 0;
        lastFpsUpdate.current = timestamp;
      }

      // Process game updates with fixed timestep
      const ctx = initializeGame(canvasRef);
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update and draw entities
      updateGame(frameDelta.current);
      drawGame(ctx);

      animationRef.current = requestAnimationFrame(gameLoop);
    },
    [gameStarted, gameOver, levelCompleted, score, keys, lives]
  );

  // Separate update logic
  const updateGame = (deltaTime: number) => {
    const timeScale = deltaTime / MS_PER_FRAME;
    const moveSpeed = 10 * timeScale; // Adjust base speed as needed
    // Update projectiles
    projectiles.current.forEach((p) => {
      p.y -= bulletSpeed * timeScale;
    });

    // Update enemies
    enemies.current.forEach((e) => {
      e.y += e.speed * timeScale;
    });

    // Update power-ups
    powerUps.current.forEach((p) => {
      p.y += 3 * timeScale;
    });

    // Player movement - now using keys.current
    if (keys.current.ArrowLeft) {
      player.current.x = Math.max(25, player.current.x - moveSpeed);
    }
    if (keys.current.ArrowRight) {
      player.current.x = Math.min(
        CANVAS_WIDTH - 25,
        player.current.x + moveSpeed
      );
    }

    // Check collisions
    checkProjectileEnemyCollisions(
      projectiles,
      enemies,
      score,
      maxScore,
      isMuted,
      setScore,
      setLevelCompleted
    );
    checkEnemyBottomCollisions(enemies, lives, isMuted, setLives, setGameOver);
    checkPowerUpCollisions(
      powerUps,
      player,
      bulletCount,
      bulletSpeed,
      isMuted,
      setBulletCount,
      setBulletSpeed
    );
  };

  // Separate draw logic
  const drawGame = (ctx: CanvasRenderingContext2D) => {
    drawPlayer(ctx, player, fighterImgRef);
    drawProjectiles(ctx, projectiles, 0); // Movement is handled in update
    drawEnemies(ctx, enemies);
    drawPowerUps(ctx, powerUps);
  };

  // Main game effect
  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    const spawnInterval = setInterval(spawnEntities, 1000);
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(spawnInterval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, gameOver, levelCompleted, spawnEntities, gameLoop]);

  const restartGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(false);
    setLevel(1);
    setScore(0);
    setLives(3);
    setVelocity(2);
    setLevelCompleted(false);
    setBulletCount(1);
    setBulletSpeed(8);
    enemies.current = [];
    projectiles.current = [];
    powerUps.current = [];
  }, [
    setGameStarted,
    setGameOver,
    setLevel,
    setScore,
    setLives,
    setVelocity,
    setLevelCompleted,
    setBulletCount,
    setBulletSpeed,
  ]);

  const startNextLevel = useCallback(() => {
    setLevel(level + 1);
    setScore(0);
    setMaxScore(maxScore + 5);
    setVelocity(velocity + 0.3);
    setLevelCompleted(false);
    enemies.current = [];
    projectiles.current = [];
    powerUps.current = [];
  }, [
    level,
    maxScore,
    velocity,
    setLevel,
    setScore,
    setMaxScore,
    setVelocity,
    setLevelCompleted,
  ]);

  const handleShoot = useCallback(() => {
    playShootSound(isMuted);
    const spreadAngle = Math.PI / 16;

    if (bulletCount === 1) {
      projectiles.current.push({
        x: player.current.x,
        y: player.current.y,
        radius: 5,
      });
    } else {
      const centerOffset = ((bulletCount - 1) * 10) / 2;

      for (let i = 0; i < bulletCount; i++) {
        projectiles.current.push({
          x: player.current.x - centerOffset + i * 10,
          y: player.current.y,
          radius: 5,
        });
      }
    }
  }, [isMuted, bulletCount]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          keys.current.ArrowLeft = true;
          break;
        case "ArrowRight":
          keys.current.ArrowRight = true;
          break;
        case "Space":
          if (!keys.current.Space) {
            keys.current.Space = true;
            handleShoot();
          }
          break;
      }
    },
    [handleShoot]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowLeft":
        keys.current.ArrowLeft = false;
        break;
      case "ArrowRight":
        keys.current.ArrowRight = false;
        break;
      case "Space":
        keys.current.Space = false;
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Handle continuous movement when keys are held down
  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    const movePlayer = () => {
      const moveSpeed = 10; // Adjust this value for faster/slower movement

      if (keys.ArrowLeft) {
        player.current.x = Math.max(25, player.current.x - moveSpeed);
      }
      if (keys.ArrowRight) {
        player.current.x = Math.min(
          CANVAS_WIDTH - 25,
          player.current.x + moveSpeed
        );
      }
    };

    const moveInterval = setInterval(movePlayer, 16); // ~60fps

    return () => {
      clearInterval(moveInterval);
    };
  }, [keys, gameStarted, gameOver, levelCompleted]);
  return (
    <div className="onebitpage-shootergame">
      <div className="onebitpage-shootergame__name">
        <Ratings />
      </div>
      <div className="onebitpage-shootergame__gamecontainer">
        <GameHeader
          totalscore={totalScore}
          bgMusicRef={bgMusicRef}
          setIsMuted={setIsMuted}
          isMuted={isMuted}
          score={score}
          maxScore={maxScore}
          bulletSpeed={bulletSpeed}
          bulletCount={bulletCount}
          level={level}
          lives={lives}
        />
        {!gameStarted && (
          <GameStartMenu
            setGameStarted={setGameStarted}
            selectedPlane={selectedPlane}
            setSelectedPlane={setSelectedPlane}
            planeOptions={planeOptions}
          />
        )}
        <div
          style={{
            border: "3px solid red",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
          }}
        >
          {gameStarted && (
            <canvas
              ref={canvasRef}
              onMouseMove={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) player.current.x = e.clientX - rect.left;
              }}
              onClick={handleShoot}
            />
          )}
        </div>

        {gameOver && <GameOver restartGame={restartGame} />}
        {levelCompleted && (
          <LevelComplete level={level} startNextLevel={startNextLevel} />
        )}
      </div>
      <div className="onebitpage-shootergame__intro">
        <ShooterGameIntro />
      </div>
    </div>
  );
};

export default ShooterGame;
