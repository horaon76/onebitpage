import { planeOptions } from "./utils";
import { create } from "zustand";

// Define the game store
type GameState = {
  totalScore: number;
  selectedPlane: string;
  bulletCount: number;
  bulletSpeed: number;
  isMuted: boolean;
  gameStarted: boolean;
  gameOver: boolean;
  levelCompleted: boolean;
  level: number;
  score: number;
  maxScore: number;
  lives: number;
  velocity: number;
  highestScore: number;
  selectedMusic: string;
  setTotalScore: (score: number) => void;
  setSelectedPlane: (plane: string) => void;
  setBulletCount: (count: number) => void;
  setBulletSpeed: (speed: number) => void;
  setGameStarted: (started: boolean) => void;
  setGameOver: (over: boolean) => void;
  setLevelCompleted: (completed: boolean) => void;
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  setVelocity: (velocity: number) => void;
  setSelectedMusic: (music: string) => void;
  setLevel: (level: number) => void;
  setIsMuted: (muted: boolean) => void;
  setMaxScore: (maxScore: number) => void;
};

export const useGameStore = create<GameState>((set) => ({
  selectedPlane: planeOptions[0], // Default plane
  bulletCount: 1,
  bulletSpeed: 8,
  isMuted: false,
  gameStarted: false,
  gameOver: false,
  levelCompleted: false,
  level: 1,
  score: 0,
  maxScore: 10,
  lives: 3,
  velocity: 1.2,
  highestScore: 0,
  selectedMusic: "",
  totalScore: 0,
  setTotalScore: (score) => set({ totalScore: score }),
  setSelectedPlane: (plane) => set({ selectedPlane: plane }),
  setBulletCount: (count) => set({ bulletCount: count }),
  setBulletSpeed: (speed) => set({ bulletSpeed: speed }),
  setGameStarted: (started) => set({ gameStarted: started }),
  setGameOver: (over) => set({ gameOver: over }),
  setLevelCompleted: (completed) => set({ levelCompleted: completed }),
  setScore: (newScore) => set((state) => ({
    score: newScore,
    totalScore: state.totalScore + (newScore - state.score) // Calculate the difference
  })),
  setLives: (lives) => set({ lives }),
  setVelocity: (velocity) => set({ velocity }),
  setSelectedMusic: (music) => set({ selectedMusic: music }),
  setLevel: (level) => set({ level }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setMaxScore: (maxScore) => set({ maxScore }),
}));