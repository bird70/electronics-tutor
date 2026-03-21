# Architecture

## Overview

Mechanics Tutor is a Vite + React + TypeScript single-page app. It follows a domain-driven layered architecture.

## Layers

```
src/
├── app/            # Router, routes, entry point
├── components/     # UI components (simulation, lesson, exam, progress)
├── domain/         # Core types and business logic (planSequencer)
├── services/       # Data access and computation (physics, content, persistence)
├── state/          # Zustand global store
├── content/        # JSON data files (lessons, plans, exams, references)
└── styles/         # Global CSS
```

## State Management

[Zustand](https://github.com/pmndrs/zustand) is used for global state (`src/state/store.ts`). It holds:
- `progress` – persisted progress profile (completed lessons/exams, last session)
- `activePlan` / `activeLesson` / `activeExam` – current navigation context

Progress is saved to `localStorage` via `progressStore.ts`.

## Content Loading

Content JSON files are loaded via `import.meta.glob` at runtime in `contentRepository.ts`. This allows dynamic content updates without code changes.

## Physics Services

Pure TypeScript functions with no side effects:
- `kinematics.ts` – SUVAT, projectile, circular motion, SHM
- `rotational.ts` – torque, angular momentum

## Routing

React Router v6 with routes:
- `/` – Home page
- `/learn` – Lesson plan selector
- `/lesson/:lessonId` – Lesson player
- `/exams` – Exam list and player
