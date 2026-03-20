import type { ProgressProfile } from '@/domain/learning/types';

const STORAGE_KEY = 'mechanics-tutor-progress';
const CURRENT_VERSION = '1.0.0';

function createDefaultProfile(): ProgressProfile {
  return {
    profileVersion: CURRENT_VERSION,
    completedLessonIds: [],
    completedExamIds: [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadProgress(): ProgressProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProfile();
    const parsed = JSON.parse(raw) as ProgressProfile;
    if (parsed.profileVersion !== CURRENT_VERSION) {
      return createDefaultProfile();
    }
    return parsed;
  } catch {
    return createDefaultProfile();
  }
}

export function saveProgress(profile: ProgressProfile): void {
  const updated: ProgressProfile = {
    ...profile,
    profileVersion: CURRENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
