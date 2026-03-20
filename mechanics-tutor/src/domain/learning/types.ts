/** Concept tags for mapping lessons to mechanics topics */
export type MechanicsConceptTag =
  | 'kinematics'
  | 'dynamics'
  | 'forces'
  | 'energy'
  | 'momentum'
  | 'circular-motion'
  | 'rotation'
  | 'shm'
  | 'projectile'

export type DifficultyBand = 'beginner' | 'intermediate' | 'advanced'
export type ReadingLevel = 'beginner' | 'high_school' | 'advanced'
export type ResourceType = 'article' | 'video' | 'simulation' | 'worksheet'
export type LessonStepType = 'text' | 'visualization' | 'interactive' | 'quiz'

export interface TextStep {
  type: 'text'
  id: string
  heading?: string
  body: string
  deepDive?: string
}

export interface VisualizationStep {
  type: 'visualization'
  id: string
  heading?: string
  caption: string
  visualizationKey: string
  config?: Record<string, unknown>
}

export interface InteractiveStep {
  type: 'interactive'
  id: string
  heading?: string
  instructionText: string
  simulationKey: string
  config?: Record<string, unknown>
  deepDive?: string
}

export interface QuizStep {
  type: 'quiz'
  id: string
  questionText: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type LessonStep = TextStep | VisualizationStep | InteractiveStep | QuizStep

export interface Assessment {
  questions: AssessmentQuestion[]
}

export interface AssessmentQuestion {
  id: string
  questionText: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Lesson {
  id: string
  title: string
  conceptTags: MechanicsConceptTag[]
  learningObjectives: string[]
  introText: string
  steps: LessonStep[]
  referenceResourceIds?: string[]
  assessment?: Assessment
}

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface LessonPlan {
  id: string
  title: string
  goal: string
  difficultyBand: DifficultyBand
  lessonIds: string[]
  prerequisitePlanIds?: string[]
  estimatedMinutes: number
}

export interface ExamQuestion {
  id: string
  marks: number
  type: 'mc' | 'short' | 'long'
  questionText: string
  options?: string[]
  correctIndex?: number
  modelAnswer: string
  explanation: string
}

export interface ExamPaper {
  id: string
  title: string
  standard: string
  totalMarks: number
  timeAllowedMinutes: number
  instructions: string
  questions: ExamQuestion[]
}

export interface ReferenceResource {
  id: string
  title: string
  url: string
  type: ResourceType
  conceptTags: MechanicsConceptTag[]
  readingLevel: ReadingLevel
}

export interface ProgressProfile {
  profileVersion: string
  activePlanId?: string
  completedLessonIds: string[]
  completedExamIds: string[]
  lastSessionState?: LastSessionState
  updatedAt: string
}

export interface LastSessionState {
  type: 'lesson' | 'exam'
  id: string
  stepIndex?: number
}
