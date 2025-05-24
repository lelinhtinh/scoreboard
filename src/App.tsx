import { useState, useEffect, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Crown, Menu, ArrowDownUp, ArrowLeftRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TeamConfig {
  name: string;
  color: string;
  score: number;
}

const defaultConfig = {
  winScore: 21,
  maxScore: 30,
  minDiff: 2,
  winRounds: 1,
  scoreStep: 1,
};

// Check the result of a round
function checkRoundResult(
  a: number,
  b: number,
  config: typeof defaultConfig,
  forceEnd = false
) {
  const { winScore, maxScore, minDiff } = config;
  if (forceEnd) {
    return a > b ? 0 : 1;
  }
  if ((a >= winScore || b >= winScore) && Math.abs(a - b) >= minDiff) {
    return a > b ? 0 : 1;
  }
  if (a >= maxScore || b >= maxScore) {
    return a > b ? 0 : 1;
  }
  return null;
}

function App() {
  const [teams, setTeams] = useState<TeamConfig[]>([
    { name: 'Team A', color: '#2563eb', score: 0 },
    { name: 'Team B', color: '#dc2626', score: 0 },
  ]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [config, setConfig] = useState(defaultConfig);
  const [rounds, setRounds] = useState([{ a: 0, b: 0, hasEnded: false }]);
  const [tempTeams, setTempTeams] = useState(teams);
  const [tempConfig, setTempConfig] = useState(config);
  const [editScoreOpen, setEditScoreOpen] = useState(false);
  const [editScores, setEditScores] = useState<{ a: number; b: number }[]>([]);
  // Calculate the total number of rounds won by each team
  const winCounts = rounds.reduce(
    (acc, r) => {
      const res = checkRoundResult(r.a, r.b, config);
      if (res === 0) acc[0]++;
      if (res === 1) acc[1]++;
      return acc;
    },
    [0, 0]
  );
  const winThreshold = Math.floor(config.winRounds / 2) + 1;
  const hasFinalWinner =
    config.winRounds > 1 &&
    (winCounts[0] >= winThreshold || winCounts[1] >= winThreshold);
  const finalWinner =
    winCounts[0] >= winThreshold ? 0 : winCounts[1] >= winThreshold ? 1 : null;

  const [showRoundWin, setShowRoundWin] = useState(false);
  const [roundWinner, setRoundWinner] = useState<number | null>(null);

  // Read config from localStorage on mount
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

  // Copy current state to temp form when opening settings
  const openSettings = () => {
    setTempTeams(teams);
    setTempConfig(config);
    setSettingsOpen(true);
  };

  // Save settings
  const saveSettings = () => {
    setTeams(tempTeams.map((t) => ({ ...t, score: 0 })));
    setConfig(tempConfig);
    setRounds([{ a: 0, b: 0, hasEnded: false }]);
    setSettingsOpen(false);
    localStorage.setItem('scoreboard_config', JSON.stringify(tempConfig));
  };

  // Reset settings to default
  const resetSettings = () => {
    setTempConfig(defaultConfig);
    setTempTeams([
      { name: 'Team A', color: '#2563eb', score: 0 },
      { name: 'Team B', color: '#dc2626', score: 0 },
    ]);
  };

  // Handle team form change
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

  // Handle score change for current round
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

  // Touch events
  const touchStartY = useRef([0, 0]);
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

  // Handle reset match
  const handleReset = () => {
    setRounds([{ a: 0, b: 0, hasEnded: false }]);
  };

  // Handle next round: hide round win message and create new round
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

  // Watch for round end to show round win message
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

  // Edit round results dialog
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

  // Get current round for display
  const currentRoundIdx = rounds.findIndex((r) => !r.hasEnded);
  const currentRound =
    currentRoundIdx === -1 ? rounds.length : currentRoundIdx + 1;
  const lastRound = rounds[Math.max(0, rounds.length - 1)];

  // Current round result state
  const roundResult = checkRoundResult(lastRound.a, lastRound.b, config);
  const winner =
    roundResult !== null && lastRound.hasEnded ? roundResult : null;

  // Helper: get last round result
  function getLastRoundResult(
    roundsArr: Array<{ a: number; b: number; hasEnded: boolean }>,
    configObj: typeof defaultConfig
  ): { last: { a: number; b: number; hasEnded: boolean }; res: number | null } {
    const last = roundsArr[roundsArr.length - 1];
    const res = checkRoundResult(last.a, last.b, configObj);
    return { last, res };
  }

  // Helper: can edit score
  function canEditScore(): boolean {
    return (
      !lastRound.hasEnded &&
      !hasFinalWinner &&
      !(config.winRounds > 1 && showRoundWin)
    );
  }

  // Swap teams and rounds
  const handleSwapTeams = () => {
    setTeams((prev) => [{ ...prev[1] }, { ...prev[0] }]);
    setRounds((prev) =>
      prev.map((r) => ({ a: r.b, b: r.a, hasEnded: r.hasEnded }))
    );
  };

  // Determine which icon to use based on orientation
  const isPortrait = window.innerHeight > window.innerWidth;
  const SwapIcon = isPortrait ? ArrowDownUp : ArrowLeftRight;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Menu */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Menu">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {config.winRounds > 1 && (
              <DropdownMenuItem
                onClick={handleNextRound}
                disabled={!lastRound.hasEnded || hasFinalWinner}
              >
                Vòng mới
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleReset}>Trận mới</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditScore}>
              Sửa kết quả
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openSettings}>Cấu hình</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Dialog Settings */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cài đặt trận đấu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {tempTeams.map((team, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Label className="w-16">Tên đội</Label>
                <Input
                  value={team.name}
                  onChange={(e) =>
                    handleTeamChange(idx, 'name', e.target.value)
                  }
                />
                <Label className="w-16">Màu</Label>
                <Input
                  type="color"
                  value={team.color}
                  onChange={(e) =>
                    handleTeamChange(idx, 'color', e.target.value)
                  }
                  className="w-10 h-10 p-0 border-none bg-transparent"
                />
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <Label className="w-40">Số điểm để thắng</Label>
              <Input
                type="number"
                min={1}
                value={tempConfig.winScore}
                onChange={(e) => handleConfigChange('winScore', e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="w-40">Số điểm tối đa</Label>
              <Input
                type="number"
                min={1}
                value={tempConfig.maxScore}
                onChange={(e) => handleConfigChange('maxScore', e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="w-40">Số điểm cách biệt</Label>
              <Input
                type="number"
                min={1}
                value={tempConfig.minDiff}
                onChange={(e) => handleConfigChange('minDiff', e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="w-40">Số vòng để thắng</Label>
              <Input
                type="number"
                min={1}
                value={tempConfig.winRounds}
                onChange={(e) =>
                  handleConfigChange('winRounds', e.target.value)
                }
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="w-40">Số điểm tăng mỗi lần</Label>
              <Input
                type="number"
                min={1}
                value={tempConfig.scoreStep}
                onChange={(e) =>
                  handleConfigChange('scoreStep', e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={resetSettings} variant="outline">
              Đặt lại
            </Button>
            <Button onClick={saveSettings}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog edit round results */}
      <Dialog open={editScoreOpen} onOpenChange={setEditScoreOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa kết quả các vòng</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {Array.from({ length: config.winRounds }).map((_, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-10">Vòng {i + 1}</span>
                <Input
                  type="number"
                  min={0}
                  value={editScores[i]?.a ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditScores((scores) =>
                      scores.map((s, idx) => (idx === i ? { ...s, a: val } : s))
                    );
                  }}
                  style={{ color: teams[0].color, width: 60 }}
                />
                <span className="mx-1 text-gray-500">:</span>
                <Input
                  type="number"
                  min={0}
                  value={editScores[i]?.b ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEditScores((scores) =>
                      scores.map((s, idx) => (idx === i ? { ...s, b: val } : s))
                    );
                  }}
                  style={{ color: teams[1].color, width: 60 }}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setEditScoreOpen(false)} variant="outline">
              Hủy
            </Button>
            <Button onClick={saveEditScores}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Swap team button in center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <Button
          variant="outline"
          size="icon"
          aria-label="Đảo chiều"
          onClick={handleSwapTeams}
          className="shadow-lg bg-white/80 hover:bg-white"
        >
          <SwapIcon className="w-8 h-8 text-gray-700" />
        </Button>
      </div>
      {/* Scoreboard */}
      {teams.map((team, idx) => (
        <div
          key={team.name}
          className="flex-1 flex flex-col items-center justify-center p-4 gap-4 select-none cursor-pointer"
          style={{ background: team.color + '22' }}
          onClick={() => {
            if (canEditScore()) {
              handleScoreChange(idx === 0 ? 'a' : 'b', config.scoreStep);
            }
          }}
          onTouchStart={(e) => handleTouchStart(idx, e)}
          onTouchEnd={(e) => handleTouchEnd(idx, e)}
        >
          <div className="relative flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: team.color }}>
              {team.name}
            </span>
            {(winner === idx ||
              (hasFinalWinner && finalWinner === idx) ||
              (config.winRounds === 1 && winner === idx)) && (
              <span
                className="absolute -top-3 -left-2"
                style={{ transform: 'rotate(-45deg)' }}
              >
                <Crown className="text-yellow-500 w-6 h-6" />
              </span>
            )}
          </div>
          <div
            className="font-extrabold select-none"
            style={{
              color: team.color,
              fontSize: 'min(20vw, 16vh)',
              lineHeight: 1,
              letterSpacing: '-0.05em',
              maxWidth: '2.2em',
              textAlign: 'center',
            }}
          >
            {lastRound[idx === 0 ? 'a' : 'b']}
          </div>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              if (canEditScore()) {
                handleScoreChange(idx === 0 ? 'a' : 'b', -config.scoreStep);
              }
            }}
            className="mt-2"
          >
            -
          </Button>
        </div>
      ))}
      {/* Display round dots */}
      {config.winRounds > 1 && (
        <div className="absolute left-1/2 top-8 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: config.winRounds }).map((_, i) => {
            let bg = '#fff';
            let popoverContent = null;
            const r = rounds[i] || { a: 0, b: 0, hasEnded: false };
            const res = checkRoundResult(r.a, r.b, config);
            if ((res === 0 || res === 1) && r.hasEnded) {
              popoverContent = (
                <span className="text-lg font-bold">
                  <span style={{ color: teams[0].color }}>{r.a}</span>
                  <span className="mx-1 text-gray-500">:</span>
                  <span style={{ color: teams[1].color }}>{r.b}</span>
                </span>
              );
              bg = teams[res].color;
            }
            return (
              <Popover key={i}>
                <PopoverTrigger asChild>
                  <span
                    className="w-5 h-5 rounded-full border border-white block cursor-pointer"
                    style={{ background: bg, boxShadow: '0 0 0 2px #fff' }}
                    tabIndex={0}
                  />
                </PopoverTrigger>
                {popoverContent && (
                  <PopoverContent
                    side="top"
                    align="center"
                    className="p-1 text-center min-w-0 w-auto max-w-[80px]"
                  >
                    {popoverContent}
                  </PopoverContent>
                )}
              </Popover>
            );
          })}
        </div>
      )}
      {/* Display round win result */}
      {showRoundWin && roundWinner !== null && !hasFinalWinner && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 20,
            alignItems:
              window.innerWidth > window.innerHeight ? 'flex-end' : 'center',
            justifyContent: 'center',
            paddingBottom: window.innerWidth > window.innerHeight ? '10vh' : 0,
          }}
        >
          <div className="bg-white/90 dark:bg.black/80 rounded-xl px-8 py-6 shadow-xl text-center">
            {config.winRounds > 1
              ? `${teams[roundWinner].name} đã thắng vòng ${currentRound}`
              : `${teams[roundWinner].name} đã giành chiến thắng!`}
          </div>
        </div>
      )}
      {/* Display match/final result, only show when not showRoundWin */}
      {!showRoundWin && (winner !== null || hasFinalWinner) && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 20,
            alignItems:
              window.innerWidth > window.innerHeight ? 'flex-end' : 'center',
            justifyContent: 'center',
            paddingBottom: window.innerWidth > window.innerHeight ? '10vh' : 0,
          }}
        >
          <div className="bg-white/90 dark:bg.black/80 rounded-xl px-8 py-6 shadow-xl text-center">
            {hasFinalWinner || config.winRounds === 1
              ? `${
                  teams[finalWinner ?? winner ?? 0].name
                } đã giành chiến thắng!`
              : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
