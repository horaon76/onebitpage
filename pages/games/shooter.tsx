import React, { useEffect, useRef, useState } from "react";
import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon } from "lucide-react";
import { Volume2, VolumeX } from "lucide-react";
import { Popover } from "@ark-ui/react/popover";

const musicFiles = ["/onebitpage/shooterbg1.mp3"];
const planeOptions = [1, 2, 3].map(
  (num) => `/onebitpage/shooterGame/jet-plane${num}.png`
);
const balloonOptions = [1, 2, 3].map((num) => ({
  src: `/onebitpage/shooterGame/baloon${num}.png`,
  points: num,
}));

// Global AudioContext to prevent multiple instances
let audioCtx;

if (typeof window !== "undefined") {
  audioCtx = new (window.AudioContext || window?.['webkitAudioContext'])();
}

function ensureAudioContext() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// ✅ Simple Beep Sound
function playBeep() {
  ensureAudioContext();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // "A" note
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // Volume

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

// ✅ Shooting Sound (Laser Effect)
function playShootSound() {
  ensureAudioContext();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(1500, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    200,
    audioCtx.currentTime + 0.1
  );

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.15);
}

// ✅ Victory Melody 🎺🎶 (Trumpet-Like)
function playVictoryMelody() {
  ensureAudioContext();

  function playNote(frequency, startTime, duration) {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sawtooth"; // Brighter sound
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + startTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + startTime + duration
    );

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + startTime);
    osc.stop(audioCtx.currentTime + startTime + duration);
  }

  // Da Da Da Daaa! 🎺
  playNote(523, 0.0, 0.3); // C5
  playNote(659, 0.3, 0.3); // E5
  playNote(784, 0.6, 0.3); // G5
  playNote(880, 1.0, 0.5); // A5 (final note)
}

// ✅ Game Over Sound 💥 (Boom + Splash)
function playGameOverSound() {
  ensureAudioContext();

  function playBoom(frequency, startTime, duration) {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "square"; // Heavy sound
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + startTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + startTime + duration
    );

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + startTime);
    osc.stop(audioCtx.currentTime + startTime + duration);
  }

  function playSplash(startTime) {
    const whiteNoise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    whiteNoise.buffer = buffer;
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + startTime + 0.5
    );

    whiteNoise.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start(audioCtx.currentTime + startTime);
  }

  // Boom + Splash for game over
//   playBoom(80, 0.0, 1.0);
  playSplash(0.3);
}

const ShooterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(10);
  const [lives, setLives] = useState(3);
  const [velocity, setVelocity] = useState(2);
  const [highestScore, setHighestScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const [selectedPlane, setSelectedPlane] = useState(planeOptions[0]); // Default plane

  const fighterImgRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const projectiles = useRef<{ x: number; y: number; radius: number }[]>([]);
  const enemies = useRef<
    {
      x: number;
      y: number;
      image: HTMLImageElement;
      points: number;
      speed: number;
    }[]
  >([]);
  const player = useRef({ x: 0, y: 0, width: 50, height: 50 });

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  // 🎵 Load background music once
  useEffect(() => {
    const randomMusic =
      musicFiles[Math.floor(Math.random() * musicFiles.length)];
    setSelectedMusic(randomMusic);
    bgMusicRef.current = new Audio(randomMusic);
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const storedScore = Number(localStorage.getItem("highestScore")) || 0;
    setHighestScore(storedScore);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    const planeImg = new Image();
    planeImg.src = selectedPlane;
    planeImg.onload = () => (fighterImgRef.current = planeImg);

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
      const balloonType =
        balloonOptions[Math.floor(Math.random() * balloonOptions.length)];
      const enemyImg = new Image();
      enemyImg.src = balloonType.src;
      enemyImg.onload = () => {
        enemies.current.push({
          x,
          y: 0,
          image: enemyImg,
          points: balloonType.points,
          speed: velocity,
        });
      };
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
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      enemies.current.forEach((e) => {
        e.y += e.speed;
        ctx.drawImage(e.image, e.x - 20, e.y, 40, 40);
      });

      // Check collisions
      projectiles.current = projectiles.current.filter((p) => {
        return !enemies.current.some((e, eIndex) => {
          const dist = Math.hypot(p.x - e.x, p.y - e.y);
          if (dist < 20 + p.radius) {
            setScore((prevScore) => {
              const newScore = prevScore + e.points;
              if (newScore >= maxScore) {
                playVictoryMelody();
                setLevelCompleted(true);
              }
              return newScore;
            });
            enemies.current.splice(eIndex, 1);
            playBeep();
            return true;
          }
          return false;
        });
      });

      enemies.current = enemies.current.filter((e) => {
        if (e.y > canvas.height) {
          setLives((prev) => {
            if (prev - 1 <= 0) {
              playGameOverSound();
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
  }, [gameStarted, velocity, gameOver, levelCompleted, selectedPlane]);

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
    setVelocity(velocity + 0.3); // Increase enemy speed
    setLevelCompleted(false);
    enemies.current = [];
    projectiles.current = [];
  };

  return (
    <div className="onebitpage-shootergame">
      <div className="onebitpage-shootergame__name">
        <RatingGroup.Root count={5} defaultValue={3}>
          <RatingGroup.Label>1Bit-Shooter (Single - Player)</RatingGroup.Label>
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
        <div className="game-info lives">
          Lives:{" "}
          {Array.from({ length: lives }).map((_, index) => (
            <span
              key={index}
              style={{ color: "red", fontSize: "12px", margin: "0 2px" }}
            >
              ❤️
            </span>
          ))}
        </div>
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
          </button>
        </div>
        <div className="game-info score">
          Score: {score} / {maxScore} | Level: {level}
        </div>
        {!gameStarted && (
          <div className="game-menu game-message">
            <h1>Select Your Plane</h1>
            <div className="plane-selection">
              {planeOptions.map((plane) => (
                <img
                  key={plane}
                  src={plane}
                  alt="Plane"
                  className={`plane-option ${
                    selectedPlane === plane ? "selected" : ""
                  }`}
                  onClick={() => setSelectedPlane(plane)}
                  style={{
                    width: "80px",
                    cursor: "pointer",
                    border: selectedPlane === plane ? "2px solid #000" : "none",
                  }}
                />
              ))}
            </div>
            <button onClick={() => setGameStarted(true)}>Start Game</button>
          </div>
        )}
        <div
          style={{
            border: "3px solid red",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
          }}
        >
          {gameStarted && (
            <>
              <canvas
                ref={canvasRef}
                onMouseMove={(e) => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) player.current.x = e.clientX - rect.left;
                }}
                onClick={() => {
                  playShootSound();
                  projectiles.current.push({
                    x: player.current.x,
                    y: player.current.y,
                    radius: 5,
                  });
                }}
              />{" "}
              {/* <ManhattanShadow /> */}
            </>
          )}
        </div>

        {gameOver && (
          <div className="game-message">
            <h2>Game Over!</h2>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
        {levelCompleted && (
          <div className="game-message">
            <h2>Level {level} Completed!</h2>
            <button onClick={startNextLevel}>Start Level {level + 1}</button>
          </div>
        )}
      </div>
      <div className="onebitpage-shootergame__intro">
        <p>
          Music & Code by :{" "}
          <a href="https://www.linkedin.com/in/harishoraon/" target="_blank">
            Harish Oraon
          </a>
        </p>
        <br />
        <br />
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
