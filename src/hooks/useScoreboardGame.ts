import { useState, useEffect, useRef } from 'react';
import type { TeamConfig, GameConfig, Round } from '../types/game';
import { defaultConfig } from '../types/game';
import {
  checkRoundResult,
  calculateWinCounts,
  checkFinalWinner,
} from '../utils/gameLogic';

export function useScoreboardGame() {
  const [teams, setTeams] = useState<TeamConfig[]>([
    { name: 'Team A', color: '#2563eb', score: 0 },
    { name: 'Team B', color: '#dc2626', score: 0 },
  ]);

  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [rounds, setRounds] = useState<Round[]>([
    { a: 0, b: 0, hasEnded: false },
  ]);

  // Dialog states
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editScoreOpen, setEditScoreOpen] = useState(false);
  const [tempTeams, setTempTeams] = useState(teams);
  const [tempConfig, setTempConfig] = useState(config);
  const [editScores, setEditScores] = useState<{ a: number; b: number }[]>([]);

  // Win states
  const [showRoundWin, setShowRoundWin] = useState(false);
  const [roundWinner, setRoundWinner] = useState<number | null>(null);

  // Touch events
  const touchStartY = useRef([0, 0]);

  // Tính toán win counts và final winner
  const winCounts = calculateWinCounts(rounds, config);
  const { hasFinalWinner, finalWinner } = checkFinalWinner(winCounts, config);

  // Tính toán round hiện tại
  const currentRoundIdx = rounds.findIndex((r) => !r.hasEnded);
  const currentRound =
    currentRoundIdx === -1 ? rounds.length : currentRoundIdx + 1;
  const lastRound = rounds[Math.max(0, rounds.length - 1)];

  // Kết quả vòng hiện tại
  const roundResult = checkRoundResult(lastRound.a, lastRound.b, config);
  const winner =
    roundResult !== null && lastRound.hasEnded ? roundResult : null;

  // Load config từ localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('scoreboard_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsed });
        setTempConfig({ ...defaultConfig, ...parsed });
      } catch {
        /* empty */
      }
    }
  }, []);

  // Watch cho round end để hiển thị thông báo thắng vòng
  useEffect(() => {
    if (config.winRounds > 1) {
      const last = rounds[rounds.length - 1];
      const res = checkRoundResult(last.a, last.b, config);
      if (last.hasEnded && res !== null && !hasFinalWinner) {
        setRoundWinner(res);
        setShowRoundWin(true);
      } else if (!last.hasEnded) {
        setShowRoundWin(false);
      }
    }
  }, [rounds, config.winRounds, hasFinalWinner, config]);

  // Helper functions
  const canEditScore = (): boolean => {
    return (
      !lastRound.hasEnded &&
      !hasFinalWinner &&
      !(config.winRounds > 1 && showRoundWin)
    );
  };

  const getLastRoundResult = (
    roundsArr: Round[],
    configObj: GameConfig
  ): { last: Round; res: number | null } => {
    const last = roundsArr[roundsArr.length - 1];
    const res = checkRoundResult(last.a, last.b, configObj);
    return { last, res };
  };

  return {
    // States
    teams,
    setTeams,
    config,
    setConfig,
    rounds,
    setRounds,
    settingsOpen,
    setSettingsOpen,
    editScoreOpen,
    setEditScoreOpen,
    tempTeams,
    setTempTeams,
    tempConfig,
    setTempConfig,
    editScores,
    setEditScores,
    showRoundWin,
    setShowRoundWin,
    roundWinner,
    setRoundWinner,

    // Computed values
    winCounts,
    hasFinalWinner,
    finalWinner,
    currentRound,
    lastRound,
    winner,
    touchStartY,

    // Helper functions
    canEditScore,
    getLastRoundResult,
  };
}
