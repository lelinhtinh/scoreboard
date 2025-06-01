import { describe, it, expect } from 'vitest';
import {
  checkRoundResult,
  calculateWinCounts,
  checkFinalWinner,
} from './gameLogic';
import type { GameConfig } from '../types/game';

const defaultConfig: GameConfig = {
  winScore: 21,
  maxScore: 30,
  minDiff: 2,
  winRounds: 3,
  scoreStep: 1,
};

describe('gameLogic', () => {
  describe('checkRoundResult', () => {
    it('should return null when no team has reached win condition', () => {
      expect(checkRoundResult(10, 8, defaultConfig)).toBe(null);
      expect(checkRoundResult(20, 19, defaultConfig)).toBe(null);
    });

    it('should return winner when win score is reached with sufficient difference', () => {
      expect(checkRoundResult(21, 19, defaultConfig)).toBe(0); // Team A wins
      expect(checkRoundResult(19, 21, defaultConfig)).toBe(1); // Team B wins
    });

    it('should return null when win score is reached but difference is insufficient', () => {
      expect(checkRoundResult(21, 20, defaultConfig)).toBe(null);
      expect(checkRoundResult(20, 21, defaultConfig)).toBe(null);
    });

    it('should return winner when max score is reached', () => {
      expect(checkRoundResult(30, 28, defaultConfig)).toBe(0);
      expect(checkRoundResult(28, 30, defaultConfig)).toBe(1);
    });

    it('should force end when forceEnd is true', () => {
      expect(checkRoundResult(10, 8, defaultConfig, true)).toBe(0);
      expect(checkRoundResult(8, 10, defaultConfig, true)).toBe(1);
    });
  });

  describe('calculateWinCounts', () => {
    it('should calculate win counts correctly', () => {
      const rounds = [
        { a: 21, b: 19, hasEnded: true },
        { a: 19, b: 21, hasEnded: true },
        { a: 22, b: 20, hasEnded: true },
        { a: 10, b: 8, hasEnded: false },
      ];

      const [teamAWins, teamBWins] = calculateWinCounts(rounds, defaultConfig);
      expect(teamAWins).toBe(2);
      expect(teamBWins).toBe(1);
    });

    it('should return [0, 0] for empty rounds', () => {
      const [teamAWins, teamBWins] = calculateWinCounts([], defaultConfig);
      expect(teamAWins).toBe(0);
      expect(teamBWins).toBe(0);
    });
  });

  describe('checkFinalWinner', () => {
    it('should detect final winner when threshold is reached', () => {
      const winCounts: [number, number] = [2, 1];
      const { hasFinalWinner, finalWinner } = checkFinalWinner(
        winCounts,
        defaultConfig
      );

      expect(hasFinalWinner).toBe(true);
      expect(finalWinner).toBe(0);
    });

    it('should not detect final winner when threshold is not reached', () => {
      const winCounts: [number, number] = [1, 1];
      const { hasFinalWinner, finalWinner } = checkFinalWinner(
        winCounts,
        defaultConfig
      );

      expect(hasFinalWinner).toBe(false);
      expect(finalWinner).toBe(null);
    });
    it('should handle single round games correctly', () => {
      const singleRoundConfig: GameConfig = { ...defaultConfig, winRounds: 1 };
      const winCounts: [number, number] = [1, 0];
      const { hasFinalWinner, finalWinner } = checkFinalWinner(
        winCounts,
        singleRoundConfig
      );

      expect(hasFinalWinner).toBe(false); // Single round games don't use final winner logic
      expect(finalWinner).toBe(0); // But still returns the winner based on win counts
    });
  });
});
