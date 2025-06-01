import { useScoreboardGame } from './hooks/useScoreboardGame';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import type { TeamConfig } from './types/game';
import { defaultConfig } from './types/game';
import { checkRoundResult } from './utils/gameLogic';
import { MenuDropdown } from './components/MenuDropdown';
import { SettingsDialog } from './components/SettingsDialog';
import { EditScoreDialog } from './components/EditScoreDialog';
import { SwapButton } from './components/SwapButton';
import { Scoreboard } from './components/Scoreboard';
import { RoundIndicator } from './components/RoundIndicator';
import { WinMessage } from './components/WinMessage';

function App() {
  const { t } = useTranslation();

  // Update document title when language changes
  useEffect(() => {
    document.title = t('app.title');
  }, [t]);

  const {
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
    hasFinalWinner,
    finalWinner,
    currentRound,
    lastRound,
    winner,
    touchStartY,
    canEditScore,
    getLastRoundResult,
  } = useScoreboardGame();

  // Helper functions
  const openSettings = () => {
    setTempTeams(teams);
    setTempConfig(config);
    setSettingsOpen(true);
  };

  const saveSettings = () => {
    setTeams(tempTeams.map((t) => ({ ...t, score: 0 })));
    setConfig(tempConfig);
    setRounds([{ a: 0, b: 0, hasEnded: false }]);
    setSettingsOpen(false);
    localStorage.setItem('scoreboard_config', JSON.stringify(tempConfig));
  };

  const resetSettings = () => {
    setTempConfig(defaultConfig);
    setTempTeams([
      { name: t('defaultTeams.teamA'), color: '#2563eb', score: 0 },
      { name: t('defaultTeams.teamB'), color: '#dc2626', score: 0 },
    ]);
  };

  const handleTeamChange = (
    idx: number,
    field: keyof TeamConfig,
    value: string
  ) => {
    setTempTeams((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    );
  };

  const handleConfigChange = (
    field: keyof typeof defaultConfig,
    value: number | string
  ) => {
    setTempConfig((prev) => ({ ...prev, [field]: Number(value) || value }));
  };

  const handleScoreChange = (team: 'a' | 'b', delta: number) => {
    if (hasFinalWinner) return;
    setRounds((prev) => {
      const last = prev[prev.length - 1];
      if (last.hasEnded) return prev;
      const updated = { ...last, [team]: Math.max(0, last[team] + delta) };
      const winner = checkRoundResult(updated.a, updated.b, config);
      if (winner !== null) updated.hasEnded = true;
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleTouchStart = (idx: number, e: React.TouchEvent) => {
    touchStartY.current[idx] = e.touches[0].clientY;
  };

  const handleTouchEnd = (idx: number, e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = endY - touchStartY.current[idx];
    if (Math.abs(diff) > 30) {
      if (diff < 0) handleScoreChange(idx === 0 ? 'a' : 'b', config.scoreStep);
      else handleScoreChange(idx === 0 ? 'a' : 'b', -config.scoreStep);
    }
  };

  const handleReset = () => {
    setRounds([{ a: 0, b: 0, hasEnded: false }]);
  };

  const handleNextRound = () => {
    if (hasFinalWinner) return;
    setShowRoundWin(false);
    setRoundWinner(null);
    setRounds((prev) => {
      if (prev[prev.length - 1].hasEnded && prev.length < config.winRounds) {
        return [...prev, { a: 0, b: 0, hasEnded: false }];
      }
      return prev;
    });
  };

  const openEditScore = () => {
    setEditScores(rounds.map((r) => ({ a: r.a, b: r.b })));
    setEditScoreOpen(true);
  };

  const saveEditScores = () => {
    const newRounds = editScores.map((s, i) => ({
      a: s.a,
      b: s.b,
      hasEnded:
        checkRoundResult(s.a, s.b, config) !== null ||
        i < editScores.length - 1,
    }));
    setRounds(newRounds);
    setEditScoreOpen(false);
    setTimeout(() => {
      if (config.winRounds > 1) {
        const { last, res } = getLastRoundResult(newRounds, config);
        if (last.hasEnded && res !== null && !hasFinalWinner) {
          setRoundWinner(res);
          setShowRoundWin(true);
        } else {
          setShowRoundWin(false);
        }
      }
    }, 0);
  };

  const handleSwapTeams = () => {
    setTeams((prev) => [{ ...prev[1] }, { ...prev[0] }]);
    setRounds((prev) =>
      prev.map((r) => ({ a: r.b, b: r.a, hasEnded: r.hasEnded }))
    );
  };

  const handleEditScoreChange = (scores: { a: number; b: number }[]) => {
    setEditScores(scores);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <MenuDropdown
        config={config}
        lastRoundEnded={lastRound.hasEnded}
        hasFinalWinner={hasFinalWinner}
        onNextRound={handleNextRound}
        onReset={handleReset}
        onEditScore={openEditScore}
        onSettings={openSettings}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        tempTeams={tempTeams}
        tempConfig={tempConfig}
        onTeamChange={handleTeamChange}
        onConfigChange={handleConfigChange}
        onReset={resetSettings}
        onSave={saveSettings}
      />

      <EditScoreDialog
        open={editScoreOpen}
        onOpenChange={setEditScoreOpen}
        editScores={editScores}
        config={config}
        teams={teams}
        onScoreChange={handleEditScoreChange}
        onSave={saveEditScores}
      />

      <SwapButton onSwap={handleSwapTeams} />

      <Scoreboard
        teams={teams}
        lastRound={lastRound}
        config={config}
        winner={winner}
        hasFinalWinner={hasFinalWinner}
        finalWinner={finalWinner}
        canEditScore={canEditScore()}
        onScoreChange={handleScoreChange}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <RoundIndicator config={config} rounds={rounds} teams={teams} />

      <WinMessage
        showRoundWin={showRoundWin}
        roundWinner={roundWinner}
        hasFinalWinner={hasFinalWinner}
        winner={winner}
        finalWinner={finalWinner}
        teams={teams}
        config={config}
        currentRound={currentRound}
      />
    </div>
  );
}

export default App;
