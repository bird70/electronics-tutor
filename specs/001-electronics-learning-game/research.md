# Research: Playful Electronics Learning Game

## Decision 1: Frontend-First SPA with Static Deployment
- Decision: Build the MVP as a TypeScript SPA delivered as static assets.
- Rationale: Aligns with constitution deployment flexibility, minimizes operations overhead, and enables fast iteration on educational UX.
- Alternatives considered: Full client-server split with persistent backend (rejected for MVP complexity), desktop app packaging (rejected due to reduced web accessibility).

## Decision 2: Deterministic Educational Circuit Evaluation Layer
- Decision: Use a deterministic rule-based circuit evaluation layer for beginner circuits (series/parallel resistance, Ohm's law, simple source-load checks) rather than full SPICE simulation in MVP.
- Rationale: High-school learning goals prioritize explainability and immediate feedback over advanced simulation fidelity.
- Alternatives considered: Integrating SPICE/WebAssembly solver from day one (rejected due to complexity and opaque beginner feedback), purely static precomputed answers (rejected due to low interactivity).

## Decision 3: Content-as-Data for Lessons and Challenges
- Decision: Define lesson plans, lessons, and challenges as versioned JSON content files validated against schemas.
- Rationale: Separates educational authoring from UI code, supports iterative curriculum updates, and creates explicit contracts.
- Alternatives considered: Hardcoded lesson content in components (rejected due to maintainability), CMS integration in MVP (rejected due to overhead).

## Decision 4: Local Progress Persistence for MVP
- Decision: Store learner progress in browser local storage with a versioned profile schema.
- Rationale: Satisfies resume requirements without introducing account systems or backend dependencies.
- Alternatives considered: No persistence (rejected because it harms learning continuity), backend user accounts (rejected as non-essential for MVP).

## Decision 5: Pragmatic Test Pyramid
- Decision: Prioritize unit tests for domain logic, integration tests for lesson/challenge flows, and a small set of E2E smoke tests for primary learner journeys.
- Rationale: Matches constitution's pragmatic testing principle while reducing regression risk in critical educational paths.
- Alternatives considered: Full E2E-heavy strategy (rejected for maintenance burden), manual-only testing (rejected for regression risk).

## Decision 6: Responsive, Playful Technical UI System
- Decision: Implement a responsive UI system with a modern technical visual language, high contrast educational overlays, and touch-safe component interactions.
- Rationale: Directly supports engagement requirements and cross-device accessibility for students.
- Alternatives considered: Desktop-first layout only (rejected due to mobile access needs), text-only lessons (rejected due to low engagement).

## Clarifications Resolved

All planning uncertainties identified during technical context drafting are now resolved:
- Circuit evaluation scope: deterministic educational engine for MVP.
- Persistence strategy: local storage with versioned schema.
- Content modeling: schema-validated JSON content packs.
