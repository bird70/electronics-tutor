import type { ProgressProfile } from '@/domain/learning/types'

const STORAGE_KEY = 'mechanics-tutor-progress'
const CURRENT_VERSION = '1.0.0'

function createDefault(): ProgressProfile {
  return {
    profileVersion: CURRENT_VERSION,
    completedLessonIds: [],
    completedExamIds: [],
    updatedAt: new Date().toISOString(),
  }
}

export function loadProgress(): ProgressProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefault()
    const parsed = JSON.parse(raw) as ProgressProfile
    if (parsed.profileVersion !== CURRENT_VERSION) return createDefault()
    return parsed
  } catch {
    return createDefault()
  }
}

export function saveProgress(profile: ProgressProfile): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...profile, profileVersion: CURRENT_VERSION, updatedAt: new Date().toISOString() }),
  )
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}
