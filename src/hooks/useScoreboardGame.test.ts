import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScoreboardGame } from './useScoreboardGame';
import type { GameConfig } from '../types/game';

describe('useScoreboardGame', () => {
  const defaultConfig: GameConfig = {
    winScore: 21,
    maxScore: 30,
    minDiff: 2,
    winRounds: 3,
    scoreStep: 1,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useScoreboardGame());

    expect(result.current.teams).toEqual([
      { name: 'Team A', color: '#2563eb', score: 0 },
      { name: 'Team B', color: '#dc2626', score: 0 },
    ]);

    expect(result.current.config).toEqual(defaultConfig);
    expect(result.current.rounds).toEqual([{ a: 0, b: 0, hasEnded: false }]);
    expect(result.current.settingsOpen).toBe(false);
    expect(result.current.editScoreOpen).toBe(false);
    expect(result.current.showRoundWin).toBe(false);
    expect(result.current.hasFinalWinner).toBe(false);
  });

  it('should load saved config from localStorage', () => {
    const savedConfig = { ...defaultConfig, winScore: 15 };
    localStorage.setItem('scoreboard_config', JSON.stringify(savedConfig));

    const { result } = renderHook(() => useScoreboardGame());

    expect(result.current.config.winScore).toBe(15);
  });

  it('should calculate current round correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    // Should start at round 1
    expect(result.current.currentRound).toBe(1);

    // Add more rounds
    act(() => {
      result.current.setRounds([
        { a: 21, b: 18, hasEnded: true },
        { a: 10, b: 15, hasEnded: false },
      ]);
    });

    expect(result.current.currentRound).toBe(2);
  });

  it('should detect final winner correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    // Set up scenario where Team A wins 2 rounds (majority of 3)
    act(() => {
      result.current.setRounds([
        { a: 21, b: 18, hasEnded: true },
        { a: 21, b: 19, hasEnded: true },
        { a: 10, b: 8, hasEnded: false },
      ]);
    });

    expect(result.current.hasFinalWinner).toBe(true);
    expect(result.current.finalWinner).toBe(0); // Team A
  });

  it('should determine who can edit scores correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    // Should be able to edit when only one round exists
    expect(result.current.canEditScore()).toBe(true);

    // Add multiple rounds
    act(() => {
      result.current.setRounds([
        { a: 21, b: 18, hasEnded: true },
        { a: 19, b: 21, hasEnded: true },
        { a: 10, b: 8, hasEnded: false },
      ]);
    });

    // Should still be able to edit
    expect(result.current.canEditScore()).toBe(true);
  });

  it('should get last round result correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    const rounds = [
      { a: 21, b: 18, hasEnded: true },
      { a: 19, b: 21, hasEnded: true },
    ];

    const { last, res } = result.current.getLastRoundResult(
      rounds,
      defaultConfig
    );

    expect(last).toEqual({ a: 19, b: 21, hasEnded: true });
    expect(res).toBe(1); // Team B won last round
  });

  it('should handle single round games correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    const singleRoundConfig = { ...defaultConfig, winRounds: 1 };

    act(() => {
      result.current.setConfig(singleRoundConfig);
      result.current.setRounds([{ a: 21, b: 18, hasEnded: true }]);
    });

    // Single round games don't have final winners (use round winner instead)
    expect(result.current.hasFinalWinner).toBe(false);
    expect(result.current.winner).toBe(0); // Team A won the round
  });

  it('should update teams correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    const newTeams = [
      { name: 'Red Team', color: '#ff0000', score: 5 },
      { name: 'Blue Team', color: '#0000ff', score: 3 },
    ];

    act(() => {
      result.current.setTeams(newTeams);
    });

    expect(result.current.teams).toEqual(newTeams);
  });

  it('should handle temp values for settings correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    const newTempTeams = [
      { name: 'New Team A', color: '#ff0000', score: 0 },
      { name: 'New Team B', color: '#00ff00', score: 0 },
    ];

    act(() => {
      result.current.setTempTeams(newTempTeams);
    });

    expect(result.current.tempTeams).toEqual(newTempTeams);
    // Original teams should remain unchanged
    expect(result.current.teams).toEqual([
      { name: 'Team A', color: '#2563eb', score: 0 },
      { name: 'Team B', color: '#dc2626', score: 0 },
    ]);
  });

  it('should manage dialog states correctly', () => {
    const { result } = renderHook(() => useScoreboardGame());

    // Test settings dialog
    act(() => {
      result.current.setSettingsOpen(true);
    });
    expect(result.current.settingsOpen).toBe(true);

    // Test edit score dialog
    act(() => {
      result.current.setEditScoreOpen(true);
    });
    expect(result.current.editScoreOpen).toBe(true);

    // Test round win state
    act(() => {
      result.current.setShowRoundWin(true);
      result.current.setRoundWinner(1);
    });
    expect(result.current.showRoundWin).toBe(true);
    expect(result.current.roundWinner).toBe(1);
  });
});
