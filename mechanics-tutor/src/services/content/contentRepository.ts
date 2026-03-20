import type { Lesson, LessonPlan, ExamPaper, ReferenceResource } from '@/domain/learning/types'

let lessonCache: Lesson[] | null = null
let planCache: LessonPlan[] | null = null
let examCache: ExamPaper[] | null = null
let referenceCache: ReferenceResource[] | null = null

export async function loadLessons(): Promise<Lesson[]> {
  if (lessonCache) return lessonCache
  const modules = import.meta.glob<{ default: Lesson }>('/src/content/lessons/*.json', { eager: true })
  lessonCache = Object.values(modules).map((m) => m.default)
  return lessonCache
}

export async function loadLessonPlans(): Promise<LessonPlan[]> {
  if (planCache) return planCache
  const modules = import.meta.glob<{ default: LessonPlan }>('/src/content/lesson-plans/*.json', { eager: true })
  planCache = Object.values(modules).map((m) => m.default)
  return planCache
}

export async function loadExamPapers(): Promise<ExamPaper[]> {
  if (examCache) return examCache
  const modules = import.meta.glob<{ default: ExamPaper }>('/src/content/exams/*.json', { eager: true })
  examCache = Object.values(modules).map((m) => m.default)
  return examCache
}

export async function loadReferences(): Promise<ReferenceResource[]> {
  if (referenceCache) return referenceCache
  const modules = import.meta.glob<{ default: ReferenceResource[] }>('/src/content/references/*.json', { eager: true })
  referenceCache = Object.values(modules).flatMap((m) => m.default)
  return referenceCache
}

export async function getLessonById(id: string): Promise<Lesson | undefined> {
  return (await loadLessons()).find((l) => l.id === id)
}

export async function getExamById(id: string): Promise<ExamPaper | undefined> {
  return (await loadExamPapers()).find((e) => e.id === id)
}
