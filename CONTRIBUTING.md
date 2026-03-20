# Contributing to Electronics Tutor

Thank you for your interest in contributing! This guide explains how to set up your development environment, follow the project's conventions, and submit changes.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Conventions](#project-conventions)
- [Running Tests](#running-tests)
- [Adding Educational Content](#adding-educational-content)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## Development Setup

### Prerequisites

- Node.js 20 LTS or newer
- npm (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. The server supports hot module replacement — changes appear instantly without a full page reload.

### Useful commands

```bash
npm run lint          # Check code quality with ESLint
npm run format        # Auto-format code with Prettier
npm test              # Run unit tests once
npm run test:watch    # Run tests in watch mode
npm run build         # Production build (also runs TypeScript type check)
```

---

## Project Conventions

### TypeScript

- **Strict mode is enabled** — avoid `any` types; prefer explicit type annotations at function boundaries.
- Use the `@/` path alias for imports from `src/` (e.g. `import { useAppStore } from '@/state/store'`).
- Domain types live in `src/domain/` and must not import from React or services.
- Service functions in `src/services/` are plain TypeScript — keep them free of React hooks.

### File organisation

| Location | What belongs here |
|----------|-------------------|
| `src/app/` | App shell, router, and top-level route components |
| `src/components/` | Reusable React components grouped by feature area |
| `src/domain/` | Types, pure functions, and business rules — no React |
| `src/services/` | Stateless service functions (simulation, persistence, content loading) |
| `src/state/` | Zustand store (`useAppStore`) |
| `src/content/` | Static JSON files for lessons, challenges, plans, and references |
| `src/styles/` | CSS custom properties (design tokens) and responsive rules |

### Code style

- Prettier handles formatting automatically. Run `npm run format` before committing, or configure your editor to format on save.
- ESLint enforces rules for TypeScript, React Hooks, and React Refresh. Run `npm run lint` and fix all warnings before opening a PR.
- Prefer named exports over default exports for components and functions.
- Use plain CSS classes for styling. Avoid inline styles except for dynamic values that cannot be expressed in CSS.

### Commit messages

Use short, imperative-mood messages:

```
add lesson for parallel circuits
fix scoring bonus calculation for zero-time completions
update architecture docs with content loading flow
```

---

## Running Tests

### Unit tests

```bash
npm test
```

Unit tests live alongside the source files in `src/` with a `.test.ts` or `.test.tsx` suffix. They test domain logic and service functions in isolation.

### Integration tests

```bash
npm run test:integration
```

Integration tests use a separate Vitest config (`vitest.integration.config.ts`) and cover multi-step flows such as lesson completion and progress resumption.

### Writing new tests

Follow the patterns in existing test files:

- Use `describe` / `it` blocks with descriptive names.
- Test one behaviour per `it` block.
- For React components, use `@testing-library/react` — query by accessible roles and labels rather than CSS selectors or implementation details.
- For pure functions and domain logic, import the function directly and assert its return values.

---

## Adding Educational Content

The quickest way to extend the app is by adding new JSON content. No code changes are required for straightforward additions.

See **[docs/content-authoring.md](docs/content-authoring.md)** for a complete guide covering:

- Adding a new lesson
- Adding a new challenge
- Creating a new learning path
- Adding reference resources

---

## Submitting a Pull Request

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feature/my-change
   ```

2. **Make your changes.** Keep each PR focused on a single concern.

3. **Lint and test:**
   ```bash
   npm run lint
   npm test
   ```

4. **Commit** your changes with a clear message.

5. **Open a pull request** against `main`. Fill in the PR description explaining _what_ changed and _why_.

6. A maintainer will review your PR. Address any feedback and push additional commits to the same branch — no need to open a new PR.

### What makes a good PR

- Focused on one thing (a bug fix, a new lesson, a refactor — not all three at once)
- Includes or updates tests for changed behaviour
- Passes lint and all existing tests
- Has a clear description explaining the motivation for the change
