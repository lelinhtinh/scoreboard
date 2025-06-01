import type { GameConfig } from '../types/game';

/**
 * Kiểm tra kết quả của một vòng đấu
 * @param a - Điểm của đội A
 * @param b - Điểm của đội B
 * @param config - Cấu hình trận đấu
 * @param forceEnd - Buộc kết thúc vòng (mặc định false)
 * @returns 0 nếu đội A thắng, 1 nếu đội B thắng, null nếu chưa có kết quả
 */
export function checkRoundResult(
  a: number,
  b: number,
  config: GameConfig,
  forceEnd = false
): number | null {
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

/**
 * Tính số vòng thắng của mỗi đội
 * @param rounds - Danh sách các vòng đấu
 * @param config - Cấu hình trận đấu
 * @returns Mảng [số vòng thắng của đội A, số vòng thắng của đội B]
 */
export function calculateWinCounts(
  rounds: Array<{ a: number; b: number; hasEnded: boolean }>,
  config: GameConfig
): [number, number] {
  return rounds.reduce(
    (acc, r) => {
      const res = checkRoundResult(r.a, r.b, config);
      if (res === 0) acc[0]++;
      if (res === 1) acc[1]++;
      return acc;
    },
    [0, 0]
  );
}

/**
 * Kiểm tra xem có người thắng cuối cùng không
 * @param winCounts - Số vòng thắng của mỗi đội
 * @param config - Cấu hình trận đấu
 * @returns Đối tượng chứa thông tin về người thắng cuối cùng
 */
export function checkFinalWinner(
  winCounts: [number, number],
  config: GameConfig
): { hasFinalWinner: boolean; finalWinner: number | null } {
  const winThreshold = Math.floor(config.winRounds / 2) + 1;
  const hasFinalWinner =
    config.winRounds > 1 &&
    (winCounts[0] >= winThreshold || winCounts[1] >= winThreshold);

  const finalWinner =
    winCounts[0] >= winThreshold ? 0 : winCounts[1] >= winThreshold ? 1 : null;

  return { hasFinalWinner, finalWinner };
}
