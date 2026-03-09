import type { Lesson, LessonPlan, CircuitChallenge, ReferenceResource } from '@/domain/learning/types';

// Content is loaded from JSON modules at build time via Vite's JSON import.
// Each loader returns a typed array so consuming code doesn't handle raw JSON.

let lessonCache: Lesson[] | null = null;
let planCache: LessonPlan[] | null = null;
let challengeCache: CircuitChallenge[] | null = null;
let referenceCache: ReferenceResource[] | null = null;

export async function loadLessons(): Promise<Lesson[]> {
  if (lessonCache) return lessonCache;
  const modules = import.meta.glob<{ default: Lesson }>('/src/content/lessons/*.json', { eager: true });
  lessonCache = Object.values(modules).map((m) => m.default);
  return lessonCache;
}

export async function loadLessonPlans(): Promise<LessonPlan[]> {
  if (planCache) return planCache;
  const modules = import.meta.glob<{ default: LessonPlan }>('/src/content/lesson-plans/*.json', { eager: true });
  planCache = Object.values(modules).map((m) => m.default);
  return planCache;
}

export async function loadChallenges(): Promise<CircuitChallenge[]> {
  if (challengeCache) return challengeCache;
  const modules = import.meta.glob<{ default: CircuitChallenge[] }>('/src/content/challenges/*.json', { eager: true });
  challengeCache = Object.values(modules).flatMap((m) => m.default);
  return challengeCache;
}

export async function loadReferences(): Promise<ReferenceResource[]> {
  if (referenceCache) return referenceCache;
  const modules = import.meta.glob<{ default: ReferenceResource[] }>('/src/content/references/*.json', { eager: true });
  referenceCache = Object.values(modules).flatMap((m) => m.default);
  return referenceCache;
}

export async function getLessonById(id: string): Promise<Lesson | undefined> {
  const lessons = await loadLessons();
  return lessons.find((l) => l.id === id);
}

export async function getChallengeById(id: string): Promise<CircuitChallenge | undefined> {
  const challenges = await loadChallenges();
  return challenges.find((c) => c.id === id);
}
