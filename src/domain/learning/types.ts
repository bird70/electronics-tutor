/** Concept tags for mapping lessons to electronics topics */
export type ConceptTag = 'voltage' | 'current' | 'resistance' | 'resistivity' | 'power';

/** Difficulty bands for lesson plans */
export type DifficultyBand = 'beginner' | 'intermediate';

/** Reading level for reference resources */
export type ReadingLevel = 'beginner' | 'high_school' | 'advanced';

/** Resource type for external/internal references */
export type ResourceType = 'article' | 'video' | 'simulation' | 'worksheet';

/** Condition operators for circuit evaluation targets */
export type ConditionOperator = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte';

/** Metric that a circuit condition evaluates */
export type ConditionMetric = 'voltage' | 'current' | 'resistance' | 'power' | 'validCircuit';

/** A single evaluable condition on a circuit state */
export interface CircuitCondition {
  metric: ConditionMetric;
  operator: ConditionOperator;
  value: number | boolean;
}

/** One step in a guided lesson */
export interface LessonStep {
  id: string;
  instructionText: string;
  targetCondition: CircuitCondition;
  feedbackOnSuccess: string;
  feedbackOnFailure: string;
}

/** Optional post-lesson assessment */
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

/** A single lesson teaching one or more electronics concepts */
export interface Lesson {
  id: string;
  title: string;
  conceptTags: ConceptTag[];
  learningObjectives: string[];
  introText: string;
  componentPalette: string[];
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

/** Scoring rules for a challenge */
export interface ScoringRules {
  maxScore: number;
  timeBonusEnabled: boolean;
  penaltyPerHint: number;
}

/** Reward given on challenge completion */
export interface ChallengeReward {
  title: string;
  description: string;
}

/** A gamified circuit challenge */
export interface CircuitChallenge {
  id: string;
  title: string;
  level: number;
  objectiveText: string;
  allowedComponents: string[];
  winConditions: CircuitCondition[];
  scoringRules: ScoringRules;
  reward?: ChallengeReward;
}

/** Challenge state from the learner's perspective */
export type ChallengeStatus = 'locked' | 'unlocked' | 'attempted' | 'completed';

/** A curated reference link for further learning */
export interface ReferenceResource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  conceptTags: ConceptTag[];
  readingLevel: ReadingLevel;
}

/** Learner progress stored locally */
export interface ProgressProfile {
  profileVersion: string;
  activePlanId?: string;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  unlockedLevels: number[];
  lastSessionState?: LastSessionState;
  updatedAt: string;
}

export interface LastSessionState {
  type: 'lesson' | 'challenge';
  id: string;
  stepIndex?: number;
}
