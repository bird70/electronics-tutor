import { create } from 'zustand';
import type {
  Lesson,
  LessonPlan,
  CircuitChallenge,
  ProgressProfile,
  LastSessionState,
} from '@/domain/learning/types';
import type { CircuitGraph, CircuitEvaluation } from '@/domain/circuit/types';
import { loadProgress, saveProgress } from '@/services/persistence/progressStore';

interface AppState {
  // Progress
  progress: ProgressProfile;
  updateProgress: (partial: Partial<ProgressProfile>) => void;

  // Active content
  activePlan: LessonPlan | null;
  setActivePlan: (plan: LessonPlan | null) => void;

  activeLesson: Lesson | null;
  setActiveLesson: (lesson: Lesson | null) => void;
  activeLessonStepIndex: number;
  setActiveLessonStepIndex: (index: number) => void;

  activeChallenge: CircuitChallenge | null;
  setActiveChallenge: (challenge: CircuitChallenge | null) => void;

  // Circuit workspace
  circuitGraph: CircuitGraph;
  setCircuitGraph: (graph: CircuitGraph) => void;

  lastEvaluation: CircuitEvaluation | null;
  setLastEvaluation: (evaluation: CircuitEvaluation | null) => void;

  // Session
  setLastSession: (session: LastSessionState | undefined) => void;

  // Completion actions
  completeLesson: (lessonId: string) => void;
  completeChallenge: (challengeId: string, level: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  progress: loadProgress(),

  updateProgress: (partial) => {
    const updated = { ...get().progress, ...partial };
    saveProgress(updated);
    set({ progress: updated });
  },

  activePlan: null,
  setActivePlan: (plan) => set({ activePlan: plan }),

  activeLesson: null,
  setActiveLesson: (lesson) => set({ activeLesson: lesson, activeLessonStepIndex: 0 }),
  activeLessonStepIndex: 0,
  setActiveLessonStepIndex: (index) => set({ activeLessonStepIndex: index }),

  activeChallenge: null,
  setActiveChallenge: (challenge) => set({ activeChallenge: challenge }),

  circuitGraph: { components: [], wires: [] },
  setCircuitGraph: (graph) => set({ circuitGraph: graph }),

  lastEvaluation: null,
  setLastEvaluation: (evaluation) => set({ lastEvaluation: evaluation }),

  setLastSession: (session) => {
    const { progress } = get();
    const updated = { ...progress, lastSessionState: session };
    saveProgress(updated);
    set({ progress: updated });
  },

  completeLesson: (lessonId) => {
    const { progress } = get();
    if (progress.completedLessonIds.includes(lessonId)) return;
    const updated: ProgressProfile = {
      ...progress,
      completedLessonIds: [...progress.completedLessonIds, lessonId],
      lastSessionState: undefined,
    };
    saveProgress(updated);
    set({ progress: updated });
  },

  completeChallenge: (challengeId, level) => {
    const { progress } = get();
    const completedChallengeIds = progress.completedChallengeIds.includes(challengeId)
      ? progress.completedChallengeIds
      : [...progress.completedChallengeIds, challengeId];
    const nextLevel = level + 1;
    const unlockedLevels = progress.unlockedLevels.includes(nextLevel)
      ? progress.unlockedLevels
      : [...progress.unlockedLevels, nextLevel];
    const updated: ProgressProfile = {
      ...progress,
      completedChallengeIds,
      unlockedLevels,
      lastSessionState: undefined,
    };
    saveProgress(updated);
    set({ progress: updated });
  },
}));
