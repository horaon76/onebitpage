import React from "react";
import Link from "next/link";
import { Crosshair, Gamepad2 } from "lucide-react";

const GAMES = [
  {
    slug: "shooter",
    title: "1Bit Shooter",
    description:
      "A classic space shooter — pilot your jet, dodge incoming threats, collect power-ups and climb through increasingly difficult levels.",
    icon: <Crosshair size={32} />,
    color: "#ef4444",
    tags: ["Canvas", "Single Player", "Arcade"],
  },
];

const Games = () => {
  return (
    <div className="games-landing">
      <div className="games-landing__hero">
        <Gamepad2 size={40} className="games-landing__hero-icon" />
        <h1>Games Arcade</h1>
        <p className="games-landing__subtitle">
          Take a break from studying — play browser-based games built with React
          &amp; Canvas.
        </p>
      </div>

      <div className="games-landing__grid">
        {GAMES.map((game) => (
          <Link
            key={game.slug}
            href={`/games/${game.slug}`}
            className="game-card"
          >
            <div
              className="game-card__icon"
              style={{ color: game.color }}
            >
              {game.icon}
            </div>
            <div className="game-card__body">
              <h2 className="game-card__title">{game.title}</h2>
              <p className="game-card__desc">{game.description}</p>
              <div className="game-card__tags">
                {game.tags.map((t) => (
                  <span key={t} className="game-card__tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <span className="game-card__play">Play →</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Games;