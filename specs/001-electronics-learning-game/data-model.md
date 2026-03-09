# Data Model: Playful Electronics Learning Game

## Entity: LessonPlan
- Purpose: Curated learning path for beginners and intermediate learners.
- Fields:
- `id` (string, required, unique)
- `title` (string, required)
- `goal` (string, required)
- `difficultyBand` (enum: beginner|intermediate, required)
- `lessonIds` (array<string>, required, ordered)
- `prerequisitePlanIds` (array<string>, optional)
- `estimatedMinutes` (number, required, >= 1)
- Validation:
- `lessonIds` cannot be empty.
- `lessonIds` must reference existing `Lesson` records.
- State transitions:
- `draft` -> `published` -> `archived`

## Entity: Lesson
- Purpose: Teaches one or more electronics concepts with guided interaction.
- Fields:
- `id` (string, required, unique)
- `title` (string, required)
- `conceptTags` (array<enum>, required; voltage|current|resistance|resistivity|power)
- `learningObjectives` (array<string>, required, min length 1)
- `introText` (string, required)
- `componentPalette` (array<string>, required)
- `steps` (array<LessonStep>, required)
- `referenceResourceIds` (array<string>, optional)
- `assessment` (object, optional)
- Validation:
- Must include at least one objective and one interactive step.
- All referenced resources must exist.
- State transitions:
- `locked` -> `available` -> `in_progress` -> `completed`

## Entity: LessonStep
- Purpose: A single actionable interaction and explanation segment within a lesson.
- Fields:
- `id` (string, required)
- `instructionText` (string, required)
- `targetCondition` (CircuitCondition, required)
- `feedbackOnSuccess` (string, required)
- `feedbackOnFailure` (string, required)
- Validation:
- `targetCondition` must be evaluable by simulation service.

## Entity: CircuitChallenge
- Purpose: Gamified task with objective constraints and completion rules.
- Fields:
- `id` (string, required, unique)
- `title` (string, required)
- `level` (integer, required, >= 1)
- `objectiveText` (string, required)
- `allowedComponents` (array<string>, required)
- `winConditions` (array<CircuitCondition>, required)
- `scoringRules` (object, required)
- `reward` (object, optional)
- Validation:
- At least one win condition required.
- Level must be contiguous within a challenge track.
- State transitions:
- `locked` -> `unlocked` -> `attempted` -> `completed`

## Entity: ComponentDefinition
- Purpose: Defines electrical parts available in workspace and their educational constraints.
- Fields:
- `id` (string, required, unique)
- `name` (string, required)
- `type` (enum: source|resistor|wire|meter|switch, required)
- `adjustableProperties` (array<PropertyRule>, optional)
- `minValue` (number, optional)
- `maxValue` (number, optional)
- `unit` (string, optional)
- Validation:
- Numeric ranges must satisfy `minValue <= maxValue`.
- Required properties vary by component type.

## Entity: ProgressProfile
- Purpose: Learner progress and resume state persisted locally.
- Fields:
- `profileVersion` (string, required)
- `activePlanId` (string, optional)
- `completedLessonIds` (array<string>, required)
- `completedChallengeIds` (array<string>, required)
- `unlockedLevels` (array<number>, required)
- `lastSessionState` (object, optional)
- `updatedAt` (ISO datetime string, required)
- Validation:
- Completed items must be valid IDs.
- `profileVersion` must be compatible with migration logic.
- State transitions:
- `new` -> `active` -> `returning`

## Entity: ReferenceResource
- Purpose: Curated links for deeper exploration of component behavior and underlying physics.
- Fields:
- `id` (string, required, unique)
- `title` (string, required)
- `url` (string, required)
- `type` (enum: article|video|simulation|worksheet, required)
- `conceptTags` (array<enum>, required)
- `readingLevel` (enum: beginner|high_school|advanced, required)
- Validation:
- URL must be absolute and reachable at content validation time.
- At least one concept tag is required.

## Relationships
- `LessonPlan` 1-to-many `Lesson`
- `Lesson` many-to-many `ReferenceResource`
- `Lesson` many-to-many `ComponentDefinition`
- `CircuitChallenge` many-to-many `ComponentDefinition`
- `ProgressProfile` references one `LessonPlan` and many `Lesson`/`CircuitChallenge`

## Derived Views
- Learner Dashboard: Built from `ProgressProfile` + unlocked `Lesson` + next `CircuitChallenge`.
- Lesson Detail: Built from `Lesson`, required `ComponentDefinition`, and linked `ReferenceResource`.
