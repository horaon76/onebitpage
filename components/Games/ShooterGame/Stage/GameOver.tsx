import React, { useEffect, useRef } from "react";

const GameOver = ({ restartGame }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger restart on Enter or Spacebar
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent page scroll when Space is pressed
        restartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [restartGame]);

  // Auto-focus the button when component mounts
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <div className="game-message">
      <h2>Game Over!</h2>
      <button 
        ref={buttonRef}
        onClick={restartGame}
        onKeyDown={(e) => {
          // Handle Enter/Space for button press
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            restartGame();
          }
        }}
        style={{
          // Optional: Add visual feedback for keyboard users
          outline: 'none',
          position: 'relative'
        }}
      >
        Restart
        <span style={{
          fontSize: '0.8em',
          position: 'absolute',
          bottom: '-1.5em',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap'
        }}>
          (Press Enter/Space)
        </span>
      </button>
    </div>
  );
};

export default GameOver;