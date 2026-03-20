import type { CircuitChallenge, ChallengeReward } from '@/domain/learning/types';

export interface ChallengeResult {
  challengeId: string;
  score: number;
  maxScore: number;
  timeTakenMs: number;
  hintsUsed: number;
  stars: 1 | 2 | 3;
  reward: ChallengeReward | null;
}

/**
 * Calculate score for a completed challenge given elapsed time and hints used.
 */
export function calculateScore(
  challenge: CircuitChallenge,
  timeTakenMs: number,
  hintsUsed: number,
): ChallengeResult {
  const { scoringRules } = challenge;
  let score = scoringRules.maxScore;

  // Hint penalties
  score -= hintsUsed * scoringRules.penaltyPerHint;

  // Time bonus: award up to 20% extra if completed quickly (under 60s)
  if (scoringRules.timeBonusEnabled && timeTakenMs < 60_000) {
    const timeBonus = Math.round(scoringRules.maxScore * 0.2 * (1 - timeTakenMs / 60_000));
    score += timeBonus;
  }

  // Clamp
  score = Math.max(0, Math.min(score, Math.round(scoringRules.maxScore * 1.2)));

  // Star rating
  const pct = score / scoringRules.maxScore;
  const stars: 1 | 2 | 3 = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;

  return {
    challengeId: challenge.id,
    score,
    maxScore: scoringRules.maxScore,
    timeTakenMs,
    hintsUsed,
    stars,
    reward: stars >= 2 ? (challenge.reward ?? null) : null,
  };
}

/**
 * Format score for display.
 */
export function formatScore(result: ChallengeResult): string {
  return `${result.score}/${result.maxScore} ${'⭐'.repeat(result.stars)}`;
}
