# Content Authoring Guide

## Lessons

Lesson files live in `src/content/lessons/*.json` and follow the `Lesson` interface.

### Required fields
- `id` – unique kebab-case string
- `title` – display name
- `conceptTags` – array of `MechanicsConceptTag` values
- `learningObjectives` – array of strings
- `introText` – short introduction paragraph
- `steps` – array of `LessonStep` objects

### Step types

**text** – Body text with optional heading and deepDive expandable section.

**visualization** – Shows a simulation component by `visualizationKey` with a caption.

**interactive** – Shows a simulation component by `simulationKey` with instruction text.

**quiz** – Multiple-choice question with `options`, `correctIndex`, and `explanation`.

### Simulation keys
- `kinematics-solver` – SUVAT solver
- `projectile-sim` – Projectile trajectory
- `circular-motion-sim` – Circular motion animation
- `shm-sim` – SHM oscillation visualisation

## Lesson Plans

Files in `src/content/lesson-plans/*.json` follow the `LessonPlan` interface.
- `lessonIds` must reference existing lesson IDs
- `difficultyBand`: `"beginner"` | `"intermediate"` | `"advanced"`
- `prerequisitePlanIds` (optional) – IDs of plans that should be completed first

## Exam Papers

Files in `src/content/exams/*.json` follow the `ExamPaper` interface.
- Question types: `"mc"` (multiple choice), `"short"`, `"long"`
- MC questions need `options`, `correctIndex`, and `modelAnswer`
- Short/long questions need `modelAnswer` (shown after submission)

## Validation

Run `npm test` to validate all lesson files via `contentRepository.test.ts`.
The `validateLesson` function in `src/services/learning/lessonValidator.ts` checks all required fields.
