export interface TeamConfig {
  name: string;
  color: string;
  score: number;
}

export interface Round {
  a: number;
  b: number;
  hasEnded: boolean;
}

export interface GameConfig {
  winScore: number;
  maxScore: number;
  minDiff: number;
  winRounds: number;
  scoreStep: number;
}

export const defaultConfig: GameConfig = {
  winScore: 21,
  maxScore: 30,
  minDiff: 2,
  winRounds: 3,
  scoreStep: 1,
};
