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
  | 'projectile';

/** Difficulty bands for lesson plans */
export type DifficultyBand = 'beginner' | 'intermediate' | 'advanced';

/** Reading level for reference resources */
export type ReadingLevel = 'beginner' | 'high_school' | 'advanced';

/** Resource type for external/internal references */
export type ResourceType = 'article' | 'video' | 'simulation' | 'worksheet';

/** The type of a lesson step */
export type LessonStepType = 'text' | 'visualization' | 'interactive' | 'quiz';

/** A text-only step (explanatory content, possibly with a deep-dive) */
export interface TextStep {
  type: 'text';
  id: string;
  heading?: string;
  body: string;
  deepDive?: string;
}

/** A static-diagram step linking to an SVG visualisation component */
export interface VisualizationStep {
  type: 'visualization';
  id: string;
  heading?: string;
  caption: string;
  /** Key that maps to a registered visualisation component */
  visualizationKey: string;
  /** Serialisable config passed to the visualisation */
  config?: Record<string, unknown>;
}

/** An interactive simulation step */
export interface InteractiveStep {
  type: 'interactive';
  id: string;
  heading?: string;
  instructionText: string;
  /** Key that maps to a registered interactive component */
  simulationKey: string;
  /** Initial parameter values */
  config?: Record<string, unknown>;
  deepDive?: string;
}

/** A multiple-choice quiz step */
export interface QuizStep {
  type: 'quiz';
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Union of all step types */
export type LessonStep = TextStep | VisualizationStep | InteractiveStep | QuizStep;

/** Optional post-lesson assessment (NCEA-style) */
export interface Assessment {
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** A single lesson teaching one or more mechanics concepts */
export interface Lesson {
  id: string;
  title: string;
  conceptTags: MechanicsConceptTag[];
  learningObjectives: string[];
  introText: string;
  steps: LessonStep[];
  referenceResourceIds?: string[];
  assessment?: Assessment;
}

/** Lesson state from the learner's perspective */
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';

/** A curated learning path */
export interface LessonPlan {
  id: string;
  title: string;
  goal: string;
  difficultyBand: DifficultyBand;
  lessonIds: string[];
  prerequisitePlanIds?: string[];
  estimatedMinutes: number;
}

/** A question in an NCEA-style exam paper */
export interface ExamQuestion {
  id: string;
  marks: number;
  /** 'mc' = multiple-choice, 'short' = short answer, 'long' = extended */
  type: 'mc' | 'short' | 'long';
  questionText: string;
  /** For 'mc' type only */
  options?: string[];
  correctIndex?: number;
  /** Model answer / marking schedule */
  modelAnswer: string;
  explanation: string;
}

/** An NCEA-style exam paper */
export interface ExamPaper {
  id: string;
  title: string;
  standard: string;
  totalMarks: number;
  timeAllowedMinutes: number;
  instructions: string;
  questions: ExamQuestion[];
}

/** A curated reference link for further learning */
export interface ReferenceResource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  conceptTags: MechanicsConceptTag[];
  readingLevel: ReadingLevel;
}

/** Learner progress stored locally */
export interface ProgressProfile {
  profileVersion: string;
  activePlanId?: string;
  completedLessonIds: string[];
  completedExamIds: string[];
  lastSessionState?: LastSessionState;
  updatedAt: string;
}

export interface LastSessionState {
  type: 'lesson' | 'exam';
  id: string;
  stepIndex?: number;
}
