import { Volume2, VolumeX } from "lucide-react";

const GameHeader = ({
  lives,
  totalscore,
  bgMusicRef,
  setIsMuted,
  isMuted,
  score,
  maxScore,
  bulletSpeed,
  bulletCount,
  level,
}) => {
  return (
    <header>
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
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (bgMusicRef.current) {
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
        Score: {score} / {maxScore} | Level: {level} |
        Bullets: {bulletCount}
      </div>
    </header>
  );
};

export default GameHeader;
