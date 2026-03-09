# Tasks: Playful Electronics Learning Game

**Input**: Design documents from `/specs/001-electronics-learning-game/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`

**Tests**: No explicit TDD or test-first requirement was specified in the feature spec, so test tasks are not mandated in this task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the TypeScript web app, core folders, and base tooling.

- [X] T001 Initialize project scripts and dependencies in package.json
- [X] T002 Create Vite + TypeScript app shell in src/app/main.tsx
- [X] T003 [P] Configure TypeScript compiler options in tsconfig.json
- [X] T004 [P] Configure linting and formatting rules in .eslintrc.cjs
- [X] T005 Create feature folder structure in src/components/.gitkeep
- [X] T006 [P] Add base visual design tokens and layout variables in src/styles/tokens.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core domain contracts and infrastructure required by all user stories.

**CRITICAL**: No user story implementation should begin before this phase is complete.

- [X] T007 Implement shared domain types for lessons, challenges, and progress in src/domain/learning/types.ts
- [X] T008 [P] Implement circuit primitives and graph models in src/domain/circuit/types.ts
- [X] T009 [P] Implement progress profile storage adapter in src/services/persistence/progressStore.ts
- [X] T010 Implement lesson-content schema validation service in src/services/learning/lessonValidator.ts
- [X] T011 Implement progress-profile schema validation service in src/services/persistence/progressValidator.ts
- [X] T012 Implement app-level state container for lesson, circuit, and progress state in src/state/store.ts
- [X] T013 Create content loading service for lesson plans, lessons, and challenges in src/services/content/contentRepository.ts
- [X] T014 Create shared app routes and navigation shell in src/app/router.tsx
- [X] T014b Implement session-resume prompt on app launch using last progress state in src/components/progress/ResumePrompt.tsx

**Checkpoint**: Foundation ready. User story phases can now proceed.

---

## Phase 3: User Story 1 - Build and Learn Basic Circuits (Priority: P1) 🎯 MVP

**Goal**: Users can assemble beginner circuits and receive immediate visual and textual explanations.

**Independent Test**: Start a beginner lesson, build the target circuit, modify a component value, and verify feedback updates correctly.

- [X] T015 [P] [US1] Implement deterministic circuit evaluation engine for beginner rules in src/services/simulation/evaluateCircuit.ts
- [X] T016 [P] [US1] Implement educational feedback generator for circuit outcomes in src/services/feedback/explainCircuit.ts
- [X] T017 [P] [US1] Build interactive circuit workspace canvas and node wiring UI in src/components/circuit/CircuitWorkspace.tsx
- [X] T018 [US1] Build component palette with adjustable values for lesson context in src/components/circuit/ComponentPalette.tsx
- [X] T019 [US1] Build guided lesson player with step instructions and target checks in src/components/lesson/LessonPlayer.tsx
- [X] T019b [US1] Implement concept-tag index and per-lesson tag badges in src/components/lesson/ConceptTagBadge.tsx
- [X] T020 [US1] Compose lesson page integrating workspace, palette, and feedback panel in src/app/routes/LessonRoute.tsx
- [X] T021 [US1] Add beginner lesson content pack with valid/invalid wiring examples in src/content/lessons/basics-series-circuit.json
- [X] T021b [US1] Build post-lesson concept check quiz component and sample assessment content in src/components/lesson/ConceptCheck.tsx

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Progress Through Gamified Levels (Priority: P2)

**Goal**: Users complete challenges, unlock higher levels, and track progression.

**Independent Test**: Complete one challenge and confirm unlock, progression indicators, and lock messaging for higher levels.

- [X] T022 [P] [US2] Implement challenge completion and unlock rule engine in src/domain/gamification/unlockRules.ts
- [X] T023 [P] [US2] Implement challenge scoring and reward calculation service in src/domain/gamification/scoring.ts
- [X] T024 [US2] Build challenge board UI with level gating states in src/components/challenge/ChallengeBoard.tsx
- [X] T025 [US2] Build challenge run view with objectives and completion feedback in src/components/challenge/ChallengePlayer.tsx
- [X] T026 [US2] Build learner progress dashboard for levels and next recommended challenge in src/components/progress/ProgressDashboard.tsx
- [X] T027 [US2] Add challenge content set with increasing levels and win conditions in src/content/challenges/challenge-track-01.json
- [X] T028 [US2] Persist challenge completion and unlocked levels to progress profile in src/services/persistence/progressSync.ts

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: User Story 3 - Follow Personalized Learning Paths (Priority: P3)

**Goal**: Users choose lesson plans and follow sequenced content with deeper physics resources.

**Independent Test**: Select a plan, complete first lesson in sequence, and open linked references from lesson details.

- [X] T029 [P] [US3] Implement lesson plan sequencing and prerequisite resolver in src/domain/learning/planSequencer.ts
- [X] T029b [US3] Build prerequisite gate overlay with lock state and unlock instructions in src/components/lesson/PrerequisiteGate.tsx
- [X] T030 [P] [US3] Build lesson plan selector and activation UI in src/components/lesson/LessonPlanSelector.tsx
- [X] T031 [US3] Build lesson detail panel with objective tags and reference links in src/components/lesson/LessonDetail.tsx
- [X] T032 [US3] Implement route for active learning path and lesson progression in src/app/routes/LearningPathRoute.tsx
- [X] T033 [US3] Add starter lesson plan content for beginner progression in src/content/lesson-plans/beginner-foundations.json
- [X] T034 [US3] Add curated reference resource catalog mapped to lesson concepts in src/content/references/resources.json

**Checkpoint**: User Story 3 is fully functional and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve quality, resilience, and release readiness across stories.

- [X] T035 [P] Implement edge-case handling for invalid circuits and out-of-range values in src/services/simulation/circuitGuards.ts
- [X] T036 [P] Add responsive refinements for mobile lesson and challenge layouts in src/styles/responsive.css
- [X] T037 Improve accessibility labels and keyboard interactions in src/components/circuit/CircuitWorkspace.tsx
- [X] T038 Update onboarding and run instructions for local and static deployment in README.md
- [X] T039 Validate quickstart flow and record manual verification notes in specs/001-electronics-learning-game/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): No dependencies.
- Phase 2 (Foundational): Depends on Phase 1 and blocks all user stories.
- Phase 3 (US1): Depends on Phase 2.
- Phase 4 (US2): Depends on Phase 2; can run in parallel with US1 after foundational completion.
- Phase 5 (US3): Depends on Phase 2; can run in parallel with US1 and US2 after foundational completion.
- Phase 6 (Polish): Depends on completion of desired user stories.

### User Story Dependencies

- US1 (P1): No dependency on other user stories.
- US2 (P2): No hard dependency on US1; integrates with shared progression infrastructure from Phase 2.
- US3 (P3): No hard dependency on US1/US2; consumes shared lesson and persistence foundations.

### Story Completion Order (Recommended)

- US1 -> US2 -> US3

### Parallel Opportunities

- Setup: T003, T004, and T006 can run in parallel after T001-T002.
- Foundational: T008, T009 can run in parallel; T010 and T011 can run in parallel after shared types.
- US1: T015, T016, T017 can run in parallel.
- US2: T022 and T023 can run in parallel.
- US3: T029 and T030 can run in parallel.
- Polish: T035 and T036 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: T015 [US1] Implement deterministic circuit evaluation engine in src/services/simulation/evaluateCircuit.ts
Task: T016 [US1] Implement educational feedback generator in src/services/feedback/explainCircuit.ts
Task: T017 [US1] Build interactive circuit workspace UI in src/components/circuit/CircuitWorkspace.tsx
```

## Parallel Example: User Story 2

```bash
Task: T022 [US2] Implement challenge unlock rule engine in src/domain/gamification/unlockRules.ts
Task: T023 [US2] Implement challenge scoring service in src/domain/gamification/scoring.ts
```

## Parallel Example: User Story 3

```bash
Task: T029 [US3] Implement lesson plan sequencer in src/domain/learning/planSequencer.ts
Task: T030 [US3] Build lesson plan selector UI in src/components/lesson/LessonPlanSelector.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently against its independent test criterion.
4. Demo/deploy MVP.

### Incremental Delivery

1. Finish Setup + Foundational.
2. Deliver US1 (core learning loop).
3. Deliver US2 (gamified progression).
4. Deliver US3 (personalized learning paths).
5. Execute polish tasks and quickstart validation.

### Suggested MVP Scope

- Complete through Phase 3 (US1) before expanding to P2/P3.
