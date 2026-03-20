import type { Lesson, LessonPlan, ProgressProfile, LessonStatus } from '@/domain/learning/types'

export interface SequencedLesson {
  lesson: Lesson
  status: LessonStatus
  order: number
}

export function sequencePlan(
  plan: LessonPlan,
  allLessons: Lesson[],
  progress: ProgressProfile,
): SequencedLesson[] {
  const results: SequencedLesson[] = []
  for (let index = 0; index < plan.lessonIds.length; index++) {
    const id = plan.lessonIds[index]!
    const lesson = allLessons.find((l) => l.id === id)
    if (!lesson) continue
    let status: LessonStatus
    if (progress.completedLessonIds.includes(id)) {
      status = 'completed'
    } else if (index === 0 || progress.completedLessonIds.includes(plan.lessonIds[index - 1] ?? '')) {
      status = 'available'
    } else {
      status = 'locked'
    }
    results.push({ lesson, status, order: index + 1 })
  }
  return results
}

export function checkPrerequisites(
  plan: LessonPlan,
  allPlans: LessonPlan[],
  progress: ProgressProfile,
): { met: boolean; missingPlans: LessonPlan[] } {
  if (!plan.prerequisitePlanIds?.length) return { met: true, missingPlans: [] }
  const missingPlans: LessonPlan[] = []
  for (const prereqId of plan.prerequisitePlanIds) {
    const prereq = allPlans.find((p) => p.id === prereqId)
    if (!prereq) continue
    const allDone = prereq.lessonIds.every((lid) => progress.completedLessonIds.includes(lid))
    if (!allDone) missingPlans.push(prereq)
  }
  return { met: missingPlans.length === 0, missingPlans }
}

export function getPlanProgress(plan: LessonPlan, progress: ProgressProfile): number {
  if (plan.lessonIds.length === 0) return 100
  const completed = plan.lessonIds.filter((id) => progress.completedLessonIds.includes(id)).length
  return Math.round((completed / plan.lessonIds.length) * 100)
}
