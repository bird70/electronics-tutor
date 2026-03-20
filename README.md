# ⚡ Electronics Tutor

An interactive web application for learning practical electronics through hands-on circuit building, guided lessons, and gamified challenges. Designed for high-school students and adult beginners — no prior electronics knowledge required.

## Features

- **Interactive Circuit Workspace** — Build circuits by placing components (resistors, voltage sources, wires) and connecting them on a visual canvas
- **Guided Lessons** — Step-by-step lessons that teach Ohm's Law, series circuits, and more with real-time feedback
- **Gamified Challenges** — Progressively harder circuit challenges with scoring, time bonuses, rewards, and level progression
- **Learning Paths** — Curated sequences of lessons with prerequisite tracking and estimated duration
- **Concept Checks** — Post-lesson quizzes to reinforce understanding
- **Progress Tracking** — All progress saved automatically in your browser — no account required
- **Circuit Simulation** — Real-time Ohm's Law evaluation (V = IR) with instant feedback on voltage, current, resistance, and power

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 + TypeScript 5 |
| Build Tool | Vite 6 |
| Routing | React Router 7 |
| State Management | Zustand 5 |
| Persistence | Browser `localStorage` |
| Testing | Vitest 3 + Testing Library |
| Styling | CSS custom properties (design tokens) |
| Hosting | Static — deployable anywhere |

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm 9+

### Install & Run

```bash
# Clone the repository
git clone https://github.com/bird70/electronics-tutor.git
cd electronics-tutor

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

The `dist/` folder can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:integration` | Run integration tests |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BASE_PATH` | `/` | Base URL path for deployment (e.g. `/electronics-tutor/` for GitHub Pages) |

Set variables in a `.env.local` file at the project root for local overrides.

## Project Structure

```
electronics-tutor/
├── src/
│   ├── app/              # App shell, router, and route-level pages
│   │   └── routes/       # HomePage, LessonRoute, ChallengeRoute, LearningPathRoute
│   ├── components/       # React UI components
│   │   ├── circuit/      # CircuitWorkspace, ComponentPalette
│   │   ├── challenge/    # ChallengeBoard, ChallengePlayer
│   │   ├── lesson/       # LessonPlayer, ConceptCheck, PrerequisiteGate, etc.
│   │   └── progress/     # ProgressDashboard, ResumePrompt
│   ├── content/          # Static JSON educational content
│   │   ├── lessons/      # Individual lesson definitions
│   │   ├── lesson-plans/ # Curated learning paths
│   │   ├── challenges/   # Gamified challenge tracks
│   │   └── references/   # External learning resources
│   ├── domain/           # Core types and business logic (no React)
│   │   ├── circuit/      # CircuitGraph, ComponentInstance, CircuitEvaluation types
│   │   ├── gamification/ # Scoring (calculateScore), unlock rules
│   │   └── learning/     # Lesson, LessonPlan, ProgressProfile types; plan sequencer
│   ├── services/         # Application service layer
│   │   ├── content/      # Content loading via Vite glob imports
│   │   ├── feedback/     # Plain-language circuit explanations
│   │   ├── persistence/  # localStorage adapters with schema migration
│   │   └── simulation/   # Circuit evaluation engine (Ohm's Law)
│   ├── state/            # Zustand global store (AppState)
│   └── styles/           # CSS design tokens and responsive layout
├── specs/                # Feature specifications and design artifacts
├── docs/                 # Developer documentation
│   ├── architecture.md   # System architecture and data flow
│   └── content-authoring.md  # Guide for adding lessons and challenges
├── index.html
├── vite.config.ts
└── package.json
```

## Deployment

### GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys to GitHub Pages on every push to the default branch. Set the `VITE_BASE_PATH` repository secret to the subpath (e.g. `/electronics-tutor/`).

### Other Static Hosts

Build the project with `npm run build` and upload the `dist/` directory to any static hosting provider. No server-side rendering or backend is required.

## Documentation

- **[Architecture](docs/architecture.md)** — System design, data flow, and component overview
- **[Content Authoring](docs/content-authoring.md)** — How to add new lessons, challenges, and learning paths
- **[Contributing](CONTRIBUTING.md)** — Developer setup, code style, and contribution guidelines
- **[Feature Spec](specs/001-electronics-learning-game/spec.md)** — Requirements and acceptance criteria
- **[Data Model](specs/001-electronics-learning-game/data-model.md)** — Entity definitions and relationships

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, code style guidelines, and the pull request process.

## License

ISC
