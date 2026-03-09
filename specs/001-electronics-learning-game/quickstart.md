# Quickstart: Playful Electronics Learning Game

## Goal
Run the app locally, execute tests for core learning flows, and prepare a static production build.

## Prerequisites
- Node.js 20.x LTS or newer
- npm (bundled with Node.js)

## Setup
```bash
npm install
```

## Start Local Development
```bash
npm run dev
```

Expected result:
- Local dev server starts.
- You can open the app in a browser and access beginner lesson plans.

## Run Tests (Pragmatic Baseline)
```bash
npm run test
npm run test:integration
npm run test:e2e:smoke
```

Expected result:
- Domain logic tests pass for circuit evaluation and unlock logic.
- Integration tests pass for lesson completion and progress resume.
- Smoke E2E validates first-lesson flow and challenge unlock.

## Build for Static Deployment
```bash
npm run build
```

Expected result:
- Static assets generated in build output directory (for example, `dist/`).

## Serve Production Build Locally
```bash
npm run preview
```

## Build Verification Notes (automated)
- TypeScript compilation: ✓ PASS (`tsc --noEmit` — zero errors)
- Production build: ✓ PASS (`npm run build` — 74 modules, dist output: 269 kB JS + 2.7 kB CSS gzip)
- Node.js version: 18.20.8 (warnings from react-router about 20+, non-blocking)
- npm install: 287 packages, 0 vulnerabilities
- Complete one beginner lesson from start to finish.
- Modify a resistor value and verify explanation updates.
- Finish one challenge and confirm next level unlock.
- Reload the app and confirm progress resumes.
- Open at least one reference link from a lesson.
