# ⚡ Electronics Tutor

An interactive web application for learning practical electronics through hands-on circuit building, guided lessons, and gamified challenges.

## Features

- **Interactive Circuit Workspace** — Build circuits by placing components and wiring them together on a visual canvas
- **Guided Lessons** — Step-by-step lessons that teach Ohm's Law, series circuits, and more with real-time feedback
- **Gamified Challenges** — Progressively harder circuit challenges with scoring, rewards, and level progression
- **Learning Paths** — Curated sequences of lessons with prerequisite tracking
- **Concept Checks** — Post-lesson quizzes to reinforce understanding
- **Progress Tracking** — All progress saved locally in your browser

## Tech Stack

- TypeScript 5, React 19, Vite 6
- Zustand for state management
- Browser localStorage for persistence
- No backend required — fully static-hostable

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
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/              # App shell, router, route pages
├── components/       # React components
│   ├── circuit/      # CircuitWorkspace, ComponentPalette
│   ├── challenge/    # ChallengeBoard, ChallengePlayer
│   ├── lesson/       # LessonPlayer, ConceptCheck, etc.
│   └── progress/     # ProgressDashboard, ResumePrompt
├── content/          # JSON lesson, challenge, and reference data
├── domain/           # Domain types and business logic
│   ├── circuit/      # Circuit types and evaluation
│   ├── gamification/ # Scoring and unlock rules
│   └── learning/     # Lesson types, plan sequencer
├── services/         # Application services
│   ├── content/      # Content loading
│   ├── feedback/     # Circuit explanations
│   ├── persistence/  # localStorage adapters
│   └── simulation/   # Circuit evaluation engine
├── state/            # Zustand store
└── styles/           # CSS tokens and responsive styles
```

## License

ISC
