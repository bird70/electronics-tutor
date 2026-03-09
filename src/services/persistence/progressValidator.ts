import type { ProgressProfile } from '@/domain/learning/types';

const VERSION_PATTERN = /^[0-9]+\.[0-9]+\.[0-9]+$/;

export function validateProgressProfile(
  profile: ProgressProfile,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!profile.profileVersion || !VERSION_PATTERN.test(profile.profileVersion)) {
    errors.push('profileVersion must match semver pattern (e.g. "1.0.0")');
  }

  if (!Array.isArray(profile.completedLessonIds)) {
    errors.push('completedLessonIds must be an array');
  }

  if (!Array.isArray(profile.completedChallengeIds)) {
    errors.push('completedChallengeIds must be an array');
  }

  if (!Array.isArray(profile.unlockedLevels)) {
    errors.push('unlockedLevels must be an array');
  } else {
    for (const level of profile.unlockedLevels) {
      if (!Number.isInteger(level) || level < 1) {
        errors.push(`unlockedLevels: each entry must be an integer >= 1, got ${level}`);
      }
    }
  }

  if (!profile.updatedAt) {
    errors.push('updatedAt is required');
  }

  return { valid: errors.length === 0, errors };
}
