import { create } from 'zustand'
import type { Lesson, LessonPlan, ExamPaper, ProgressProfile, LastSessionState } from '@/domain/learning/types'
import { loadProgress, saveProgress } from '@/services/persistence/progressStore'

interface AppState {
  progress: ProgressProfile
  updateProgress: (partial: Partial<ProgressProfile>) => void
  activePlan: LessonPlan | null
  setActivePlan: (plan: LessonPlan | null) => void
  activeLesson: Lesson | null
  setActiveLesson: (lesson: Lesson | null) => void
  activeLessonStepIndex: number
  setActiveLessonStepIndex: (index: number) => void
  activeExam: ExamPaper | null
  setActiveExam: (exam: ExamPaper | null) => void
  setLastSession: (session: LastSessionState | undefined) => void
  completeLesson: (lessonId: string) => void
  completeExam: (examId: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  progress: loadProgress(),
  updateProgress: (partial) => {
    const updated = { ...get().progress, ...partial }
    saveProgress(updated)
    set({ progress: updated })
  },
  activePlan: null,
  setActivePlan: (plan) => set({ activePlan: plan }),
  activeLesson: null,
  setActiveLesson: (lesson) => set({ activeLesson: lesson, activeLessonStepIndex: 0 }),
  activeLessonStepIndex: 0,
  setActiveLessonStepIndex: (index) => set({ activeLessonStepIndex: index }),
  activeExam: null,
  setActiveExam: (exam) => set({ activeExam: exam }),
  setLastSession: (session) => {
    const updated = { ...get().progress, lastSessionState: session }
    saveProgress(updated)
    set({ progress: updated })
  },
  completeLesson: (lessonId) => {
    const { progress } = get()
    if (progress.completedLessonIds.includes(lessonId)) return
    const updated: ProgressProfile = {
      ...progress,
      completedLessonIds: [...progress.completedLessonIds, lessonId],
      lastSessionState: undefined,
    }
    saveProgress(updated)
    set({ progress: updated })
  },
  completeExam: (examId) => {
    const { progress } = get()
    if (progress.completedExamIds.includes(examId)) return
    const updated: ProgressProfile = {
      ...progress,
      completedExamIds: [...progress.completedExamIds, examId],
      lastSessionState: undefined,
    }
    saveProgress(updated)
    set({ progress: updated })
  },
}))
