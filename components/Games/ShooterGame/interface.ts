export interface Enemies {
  x: number;
  y: number;
  image: HTMLImageElement;
  points: number;
  speed: number;
}

export interface PowerUps {
  x: number;
  y: number;
  image: HTMLImageElement;
  type: "bullet";
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Projectile {
  x: number;
  y: number;
  radius: number;
}
