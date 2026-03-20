import { useAppStore } from '@/state/store';
import type { ChallengeResult } from '@/domain/gamification/scoring';

/**
 * Sync challenge completion results back to the progress profile.
 * Called after a challenge is completed successfully.
 */
export function syncChallengeCompletion(result: ChallengeResult, level: number): void {
  const { completeChallenge } = useAppStore.getState();
  completeChallenge(result.challengeId, level);
}

/**
 * Sync lesson completion to the progress profile.
 */
export function syncLessonCompletion(lessonId: string): void {
  const { completeLesson } = useAppStore.getState();
  completeLesson(lessonId);
}

/**
 * Sync last session state for resume functionality.
 */
export function syncLastSession(
  type: 'lesson' | 'challenge',
  id: string,
  stepIndex?: number,
): void {
  const { setLastSession } = useAppStore.getState();
  setLastSession({ type, id, stepIndex });
}
