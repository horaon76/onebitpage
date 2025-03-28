import React, { useEffect, useRef } from "react";

const LevelComplete = ({ level, startNextLevel }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger start next level on Enter or Spacebar
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent page scroll when Space is pressed
        startNextLevel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [startNextLevel]);

  // Auto-focus the button when component mounts
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <div className="game-message">
      <h2>Level {level} Completed!</h2>
      <button 
        ref={buttonRef}
        onClick={startNextLevel}
        onKeyDown={(e) => {
          // Handle Enter/Space for button press
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startNextLevel();
          }
        }}
      >
        Start Level {level + 1}
      </button>
    </div>
  );
};

export default LevelComplete;