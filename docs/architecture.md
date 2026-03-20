# Architecture

Electronics Tutor is a fully client-side single-page application (SPA). There is no backend server, database, or network API. All data is either bundled with the build (educational content) or stored in the browser's `localStorage` (user progress).

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [Directory Layout](#directory-layout)
- [Layer Descriptions](#layer-descriptions)
  - [Domain Layer](#domain-layer)
  - [Services Layer](#services-layer)
  - [State Layer](#state-layer)
  - [Components Layer](#components-layer)
- [Data Flow](#data-flow)
- [Circuit Simulation](#circuit-simulation)
- [Content Loading](#content-loading)
- [Progress Persistence](#progress-persistence)
- [Routing](#routing)
- [Styling System](#styling-system)
- [Key Design Decisions](#key-design-decisions)

---

## High-Level Overview

```
┌──────────────────────────────────────────────────────────┐
│                      Browser (SPA)                        │
│                                                          │
│  ┌──────────────┐    ┌──────────────────────────────┐   │
│  │   React UI   │◄──►│     Zustand Global Store     │   │
│  │  Components  │    │  (progress, circuit, content) │   │
│  └──────┬───────┘    └───────────────┬──────────────┘   │
│         │                            │                   │
│  ┌──────▼─────────────────────────────▼──────────────┐  │
│  │                  Services Layer                    │  │
│  │  simulation │ content │ persistence │ feedback     │  │
│  └──────┬──────────────┬────────┬────────────────────┘  │
│         │              │        │                        │
│  ┌──────▼──────┐  ┌────▼────┐  ┌▼────────────────────┐ │
│  │   Domain    │  │ Static  │  │    localStorage      │ │
│  │   Types &   │  │  JSON   │  │  (ProgressProfile)   │ │
│  │   Logic     │  │ Content │  └─────────────────────-┘ │
│  └─────────────┘  └─────────┘                           │
└──────────────────────────────────────────────────────────┘
```

---

## Directory Layout

```
src/
├── app/            # Entry point, router, and route-level page components
├── components/     # React UI components (grouped by feature area)
├── content/        # Static JSON educational content (immutable at build time)
├── domain/         # Pure TypeScript: types and business logic (no React)
├── services/       # Stateless service functions (no React)
├── state/          # Zustand store
└── styles/         # CSS custom properties and layout rules
```

---

## Layer Descriptions

### Domain Layer

**Location:** `src/domain/`

The domain layer contains:

- **TypeScript types** that model the core entities: `Lesson`, `LessonPlan`, `CircuitChallenge`, `ProgressProfile`, `CircuitGraph`, `ComponentInstance`, `CircuitEvaluation`, `CircuitCondition`.
- **Pure business logic** with no side effects and no React dependencies.

Sub-modules:

| Module | Contents |
|--------|----------|
| `domain/circuit/` | `CircuitGraph`, `ComponentInstance`, `Wire`, `CircuitEvaluation` types |
| `domain/learning/` | `Lesson`, `LessonStep`, `LessonPlan`, `ProgressProfile`, `CircuitChallenge` types; `planSequencer` function; `lessonValidator` |
| `domain/gamification/` | `calculateScore(challenge, timeTakenMs, hintsUsed)`, `unlockRules` (which challenges are available) |

The domain layer is intentionally isolated — it can be tested without a browser or React rendering context.

### Services Layer

**Location:** `src/services/`

Services implement application capabilities by combining domain logic with I/O (file system, `localStorage`, JSON parsing). All service functions are plain TypeScript functions with no React hooks.

| Service | Key functions | Purpose |
|---------|--------------|---------|
| `services/simulation/evaluateCircuit` | `evaluateCircuit(graph, defs)`, `checkCondition(eval, condition)` | Simulates circuit behaviour using Ohm's Law |
| `services/feedback/explainCircuit` | `explainCircuit(evaluation)` | Returns high-school-level text explanations |
| `services/content/contentRepository` | `loadLessons()`, `loadChallenges()`, `loadLessonPlans()`, `loadReferences()`, `getLessonById(id)` | Loads and indexes JSON content via Vite glob imports |
| `services/persistence/progressStore` | `loadProgress()`, `saveProgress(profile)`, `clearProgress()` | `localStorage` adapter for `ProgressProfile` |
| `services/persistence/progressSync` | internal | Schema version migration when the stored format changes |
| `services/persistence/progressValidator` | internal | Validates the shape of data read from `localStorage` |

### State Layer

**Location:** `src/state/store.ts`

The global Zustand store (`useAppStore`) is the single source of truth for runtime application state. It holds:

| State slice | Type | Description |
|-------------|------|-------------|
| `progress` | `ProgressProfile` | Loaded from `localStorage` on startup; synced on every update |
| `activePlan` | `LessonPlan \| null` | The learning path the user is currently following |
| `activeLesson` | `Lesson \| null` | The lesson currently open in `LessonPlayer` |
| `activeLessonStepIndex` | `number` | Which step of the active lesson the user is on |
| `activeChallenge` | `CircuitChallenge \| null` | The challenge currently open in `ChallengePlayer` |
| `circuitGraph` | `CircuitGraph` | Components and wires on the workspace |
| `lastEvaluation` | `CircuitEvaluation \| null` | Most recent simulation result |

Key actions: `completeLesson(id)`, `completeChallenge(id, level)`, `setCircuitGraph(graph)`, `updateProgress(partial)`.

### Components Layer

**Location:** `src/components/`

React components are grouped into four feature areas:

```
components/
├── circuit/
│   ├── CircuitWorkspace   # SVG canvas for component placement and wiring
│   └── ComponentPalette   # Draggable palette of available component types
├── challenge/
│   ├── ChallengeBoard     # Grid showing all challenges with lock/completion status
│   └── ChallengePlayer    # Challenge workspace with timer, scoring, hint system
├── lesson/
│   ├── LessonPlayer       # Step-by-step lesson interface
│   ├── ConceptCheck       # Post-lesson multiple-choice quiz
│   ├── PrerequisiteGate   # Blocks access to locked content; shows requirements
│   ├── LessonDetail       # Summary of a lesson's objectives and references
│   └── LessonPlanSelector # Browse and select learning paths
└── progress/
    ├── ProgressDashboard  # User achievements and completion summary
    └── ResumePrompt       # Dialog to resume the last incomplete activity
```

---

## Data Flow

### Lesson flow

```
User → LearningPathRoute
         │
         ▼
  LessonPlanSelector → loads plans via contentRepository
         │
         ▼
  User selects plan → setActivePlan() in store
         │
         ▼
  LessonRoute (/:lessonId) → getLessonById() → setActiveLesson()
         │
         ▼
  LessonPlayer
    │  shows step instructions
    │
    ▼
  CircuitWorkspace ←→ ComponentPalette
    │  user places components, draws wires
    │  setCircuitGraph() → store
    │
    ▼
  evaluateCircuit(circuitGraph, componentDefs)
    │  returns CircuitEvaluation
    │  setLastEvaluation() → store
    │
    ▼
  checkCondition(evaluation, step.targetCondition)
    │  true → show feedbackOnSuccess, advance step
    │  false → show feedbackOnFailure
    │
    ▼ (all steps complete)
  ConceptCheck (optional quiz)
    │
    ▼
  completeLesson(lessonId) → updates ProgressProfile → saveProgress()
```

### Challenge flow

```
User → ChallengeRoute
         │
         ▼
  ChallengeBoard → loads challenges → getUnlockedChallenges(challenges, progress)
         │
         ▼
  User selects challenge → setActiveChallenge() in store
         │
         ▼
  ChallengePlayer
    │  shows objective, starts timer
    │
    ▼
  CircuitWorkspace (same as lessons)
    │
    ▼
  All winConditions pass?
    │  yes → calculateScore(challenge, elapsed, hintsUsed)
    │       → completeChallenge(id, level) → unlocks next level
    │
    ▼
  Reward / score display
```

---

## Circuit Simulation

**File:** `src/services/simulation/evaluateCircuit.ts`

The simulation engine intentionally keeps complexity appropriate for high school level education. It uses **series-circuit simplification** rather than full SPICE-style nodal analysis:

1. **Validate** — ensure there is at least one component, at least one wire, at least one voltage source, and that every component has at least one wire attached.
2. **Sum voltages** — add the `voltage` property of all `source` components.
3. **Sum resistances** — add the `resistance` property of all `resistor` components.
4. **Apply Ohm's Law** — `I = V / R`, `P = V × I`.
5. **Compute node voltages** — voltage divider drop across each series resistor.
6. **Return** a `CircuitEvaluation` object with `{ isValid, totalVoltage, totalCurrent, totalResistance, totalPower, nodeVoltages, branchCurrents, errors }`.

`checkCondition(evaluation, condition)` compares a named metric from the evaluation (`voltage`, `current`, `resistance`, `power`, `validCircuit`) against a target value using an operator (`eq`, `neq`, `lt`, `lte`, `gt`, `gte`).

---

## Content Loading

**File:** `src/services/content/contentRepository.ts`

Educational content is stored as JSON files under `src/content/`. At build time, Vite resolves these files via **glob imports** (`import.meta.glob`). This means content is bundled into the production build and loaded asynchronously on demand — no network requests to a CMS or API are needed.

```
src/content/
├── lessons/         # One JSON file per lesson (e.g. basics-series-circuit.json)
├── lesson-plans/    # One JSON file per plan (e.g. beginner-foundations.json)
├── challenges/      # One JSON file per challenge track (array of challenges)
└── references/      # Single resources.json with all reference entries
```

To add new content, create a JSON file in the appropriate folder. The content repository automatically discovers it at the next build or dev server restart. See [Content Authoring](content-authoring.md) for schema details.

---

## Progress Persistence

**Files:** `src/services/persistence/`

User progress is stored in `localStorage` under the key `electronics-tutor-progress` as a serialised `ProgressProfile` object:

```typescript
interface ProgressProfile {
  profileVersion: string;        // e.g. "1.0.0"
  activePlanId?: string;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  unlockedLevels: number[];      // e.g. [1, 2]
  lastSessionState?: {
    type: 'lesson' | 'challenge';
    id: string;
    stepIndex?: number;
  };
  updatedAt: string;             // ISO 8601 datetime
}
```

On startup, `loadProgress()` reads and validates the stored object. If the schema version is outdated, `progressSync` migrates it. If the data is corrupt or missing, a fresh default profile is returned.

Every state mutation that touches progress calls `saveProgress(profile)` immediately — there is no manual save step.

---

## Routing

**File:** `src/app/router.tsx`

React Router 7 provides client-side navigation with four routes:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Hero section, app stats, resume-last-session prompt |
| `/learn` | `LearningPathRoute` | Browse and select a lesson plan |
| `/lesson/:lessonId` | `LessonRoute` | Guided lesson player for a specific lesson |
| `/challenges` | `ChallengeRoute` | Challenge board and active challenge player |

The `AppRouter` wraps all routes in a persistent navigation bar with links to **Lesson Plans** and **Challenges**.

---

## Styling System

**Files:** `src/styles/`

Styles use **CSS custom properties** (design tokens) defined in `tokens.css`. All colours, typography scales, spacing values, and transition durations are expressed as variables and consumed throughout component stylesheets.

Key tokens (dark theme, cyan accent):

```css
--color-bg-primary       /* Main page background */
--color-bg-secondary     /* Card / panel background */
--color-text-primary     /* Primary text */
--color-text-secondary   /* Muted / helper text */
--color-accent           /* Interactive accent (cyan) */
--color-success          /* Success feedback */
--color-warning          /* Warning / pending state */
--color-error            /* Error / failure feedback */
```

`responsive.css` defines media-query breakpoints and grid/flexbox layout rules for the main content areas.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No backend | Eliminates infrastructure cost and complexity; the target audience does not require accounts |
| Static JSON content | Easy to author, version-control alongside code, and bundle for offline use |
| Zustand over Context | Simpler API than React Context + reducer for cross-cutting state (circuit, progress, active content) |
| Series-only simulation | Matches the high-school curriculum target; avoids confusing parallel-circuit edge cases in early lessons |
| localStorage for progress | No login friction; suitable for single-device learners; easily cleared or exported |
| CSS custom properties for theming | Allows future light/dark mode switching with a single variable override; no CSS-in-JS dependency |
