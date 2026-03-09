import type { ProgressProfile, CircuitChallenge } from '@/domain/learning/types';

/**
 * Determines which challenges are unlocked based on the player's current level
 * and completed challenges.
 */
export function getUnlockedChallenges(
  challenges: CircuitChallenge[],
  progress: ProgressProfile,
): { challenge: CircuitChallenge; status: 'locked' | 'unlocked' | 'completed' }[] {
  return challenges.map((challenge) => {
    if (progress.completedChallengeIds.includes(challenge.id)) {
      return { challenge, status: 'completed' as const };
    }
    if (progress.unlockedLevels.includes(challenge.level)) {
      return { challenge, status: 'unlocked' as const };
    }
    return { challenge, status: 'locked' as const };
  });
}

/**
 * Check if completing a challenge should unlock the next level.
 * Returns the new level number if unlocked, or null.
 */
export function getNextUnlockedLevel(
  challenge: CircuitChallenge,
  progress: ProgressProfile,
): number | null {
  const nextLevel = challenge.level + 1;
  if (progress.unlockedLevels.includes(nextLevel)) return null;
  return nextLevel;
}

/**
 * Get the highest unlocked level from the progress profile.
 */
export function getHighestLevel(progress: ProgressProfile): number {
  return Math.max(...progress.unlockedLevels, 1);
}

/**
 * Get the recommended next challenge — the lowest-level unlocked-but-not-completed one.
 */
export function getRecommendedChallenge(
  challenges: CircuitChallenge[],
  progress: ProgressProfile,
): CircuitChallenge | null {
  const unlocked = getUnlockedChallenges(challenges, progress);
  const available = unlocked
    .filter((u) => u.status === 'unlocked')
    .sort((a, b) => a.challenge.level - b.challenge.level);
  return available[0]?.challenge ?? null;
}
