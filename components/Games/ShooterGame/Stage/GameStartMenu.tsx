import React, { useEffect, useRef } from "react";

const GameStartMenu = ({
  setGameStarted,
  selectedPlane,
  setSelectedPlane,
  planeOptions,
}) => {
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger start game on Enter or Spacebar
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent page scroll when Space is pressed
        setGameStarted(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setGameStarted]);

  // Focus the button when component mounts for better keyboard accessibility
  useEffect(() => {
    if (startButtonRef.current) {
      startButtonRef.current.focus();
    }
  }, []);

  return (
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
            onKeyDown={(e) => {
              // Allow plane selection with Enter/Space
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedPlane(plane);
              }
            }}
            tabIndex={0} // Make images focusable
            style={{
              width: "80px",
              cursor: "pointer",
              border: selectedPlane === plane ? "2px solid #000" : "none",
              outline: 'none', // Add custom focus styles
            }}
          />
        ))}
      </div>
      <button 
        ref={startButtonRef}
        onClick={() => setGameStarted(true)}
        onKeyDown={(e) => {
          // Handle Enter/Space for button press
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setGameStarted(true);
          }
        }}
      >
        Start Game
      </button>
    </div>
  );
};

export default GameStartMenu;