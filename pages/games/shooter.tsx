import React, { useEffect, useRef, useState } from "react";
import FighterPlane from "../../public/jet-plane.png";
import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon } from "lucide-react";
import { Volume2, VolumeX } from "lucide-react";
import { Popover } from "@ark-ui/react/popover";
import { ChevronRightIcon } from "lucide-react";

const musicFiles = [
  "/onebitpage/shooterbg1.mp3"
];

const ShooterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(10); // Max score per level
  const [lives, setLives] = useState(3);
  const [velocity, setVelocity] = useState(2);
  const [highestScore, setHighestScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string>("");

  const fighterImgRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const projectiles = useRef<{ x: number; y: number; radius: number }[]>([]);
  const enemies = useRef<
    { x: number; y: number; radius: number; speed: number; color: string }[]
  >([]);
  const player = useRef({ x: 0, y: 0, width: 50, height: 50 });

  // 🎵 Load background music once
  useEffect(() => {
    // Pick a random music file
    const randomMusic =
      musicFiles[Math.floor(Math.random() * musicFiles.length)];
    setSelectedMusic(randomMusic);

    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio(randomMusic);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    const storedScore = Number(localStorage.getItem("highestScore")) || 0;
    setHighestScore(storedScore);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    const img = new Image();
    img.src = FighterPlane.src;
    img.onload = () => (fighterImgRef.current = img);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    player.current.x = canvas.width / 2;
    player.current.y = canvas.height - 60;

    const spawnEnemies = setInterval(() => {
      if (!gameStarted || gameOver || levelCompleted) return;
      const x = Math.random() * canvas.width;
      enemies.current.push({
        x,
        y: 0,
        radius: 15,
        speed: velocity,
        color: "#FF6600",
      });
    }, 1000);

    const animate = () => {
      if (gameOver || levelCompleted) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (fighterImgRef.current) {
        ctx.drawImage(
          fighterImgRef.current,
          player.current.x - 25,
          player.current.y,
          50,
          50
        );
      }

      projectiles.current.forEach((p) => {
        p.y -= 8;
        ctx.fillStyle = "#FFEB00";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      enemies.current.forEach((e) => {
        e.y += e.speed;
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Check collisions
      projectiles.current = projectiles.current.filter((p) => {
        return !enemies.current.some((e, eIndex) => {
          const dist = Math.hypot(p.x - e.x, p.y - e.y);
          if (dist < e.radius + p.radius) {
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              if (newScore >= maxScore) {
                setLevelCompleted(true);
              }
              return newScore;
            });
            enemies.current.splice(eIndex, 1);
            return true;
          }
          return false;
        });
      });

      enemies.current = enemies.current.filter((e) => {
        if (e.y > canvas.height) {
          setLives((prev) => {
            if (prev - 1 <= 0) {
              setGameOver(true);
              return 0;
            }
            return prev - 1;
          });
          return false;
        }
        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(spawnEnemies);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, velocity, gameOver, levelCompleted]);

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setLevel(1);
    setScore(0);
    setLives(3);
    setVelocity(2);
    setLevelCompleted(false);
    enemies.current = [];
    projectiles.current = [];
  };

  const startNextLevel = () => {
    setLevel((prev) => prev + 1);
    setScore(0);
    setMaxScore(maxScore + 5); // Increase max score for next level
    setVelocity(velocity + 1); // Increase enemy speed
    setLevelCompleted(false);
    enemies.current = [];
    projectiles.current = [];
  };

  return (
    <div className="onebitpage-shootergame">
      <div className="onebitpage-shootergame__name">
        <RatingGroup.Root count={5} defaultValue={3}>
          <RatingGroup.Label>
                1Bit-Shooter (Single - Player)
            </RatingGroup.Label>
          <RatingGroup.Control>
            <RatingGroup.Context>
              {({ items }) =>
                items.map((item) => (
                  <RatingGroup.Item key={item} index={item}>
                    <RatingGroup.ItemContext>
                      {({ highlighted }) =>
                        highlighted ? <StarIcon fill="current" /> : <StarIcon />
                      }
                    </RatingGroup.ItemContext>
                  </RatingGroup.Item>
                ))
              }
            </RatingGroup.Context>
            <RatingGroup.HiddenInput />
          </RatingGroup.Control>
        </RatingGroup.Root>
      </div>
      <div className="onebitpage-shootergame__gamecontainer">
        <div className="game-info lives">Lives: {lives}</div>
        <div className="game-info audio">
          {/* 🎵 Mute/Unmute Button */}
          <button
            onClick={() => {
              if (bgMusicRef.current) {
                setIsMuted(!isMuted);
                bgMusicRef.current.muted = !bgMusicRef.current.muted;
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
        <div className="game-info score">
          Score: {score} / {maxScore} | Level: {level}
        </div>
        {!gameStarted && !gameOver && !levelCompleted && (
          <div className="game-message">
            <h1>Press Start to Play</h1>
            <button
              onClick={() => {
                setGameStarted(true);
                if (bgMusicRef.current) {
                  bgMusicRef.current.src = selectedMusic; // Set the random track
                  bgMusicRef.current
                    .play()
                    .catch((err) => console.log("Music blocked:", err));
                }
              }}
            >
              Start Game
            </button>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="game-canvas"
          onMouseMove={(e) => {
            if (gameOver || levelCompleted) return;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              player.current.x = e.clientX - rect.left;
            }
          }}
          onClick={() => {
            if (gameOver || levelCompleted) return;
            projectiles.current.push({
              x: player.current.x,
              y: player.current.y,
              radius: 5,
            });
          }}
        ></canvas>
        {gameOver && (
          <div className="game-message">
            <h1>Game Over!</h1>
            <button onClick={restartGame}>Restart Game</button>
          </div>
        )}
        {levelCompleted && (
          <div className="game-message">
            <h1>Level {level} Completed!</h1>
            <button onClick={startNextLevel}>Start Level {level + 1}</button>
          </div>
        )}
      </div>{" "}
      <div className="onebitpage-shootergame__intro">
        <p>Music & Code by : <a href="https://www.linkedin.com/in/harishoraon/" target="_blank">Harish Oraon</a></p>
        <br /><br />
        <p>
          1Bit Shooter is an action-packed arcade-style shooting game where you
          control a fighter jet to take down incoming enemies. Navigate your
          plane using the mouse and shoot down enemies before they reach the
          bottom. Each level brings faster enemies and greater challenges. Keep
          an eye on your lives—once they reach zero, it's game over! Can you
          survive and set the highest score?{" "}
        </p>
        <br />
        <br />
        <div>
          Press Start to begin your mission! 🚀🔥
          <br />
          <Popover.Root>
            <Popover.Trigger>Instructions</Popover.Trigger>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Description>
                  <ul>
                    <li>
                      🎮 <b>Move Left:</b> Press <kbd>←</kbd> (Left Arrow)
                    </li>
                    <li>
                      🎮 <b>Move Right:</b> Press <kbd>→</kbd> (Right Arrow)
                    </li>
                    <li>
                      💥 <b>Shoot:</b> Press <kbd>Spacebar</kbd>
                    </li>
                    <li>
                      🚀 <b>Start Game:</b> Press <kbd>Spacebar</kbd> or Click
                      "Start Game"
                    </li>
                    <li>
                      🔥 <b>Goal:</b> Shoot all enemies before they reach the
                      bottom!
                    </li>
                  </ul>
                </Popover.Description>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
      </div>
    </div>
  );
};

export default ShooterGame;
