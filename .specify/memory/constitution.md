<!-- 
  SYNC IMPACT REPORT
  Version: 1.0.0 (initial constitution)
  Ratification: 2026-03-09
  
  Initial Constitution Creation:
  - Established 5 core principles for electronics tutoring hobby project
  - Defined TypeScript/Node.js technology stack
  - Set documentation-first approach with pragmatic testing
  - Configured for local and web deployment flexibility
  
  Template Consistency Status:
  ✅ plan-template.md - aligned with tech stack and testing approach
  ✅ spec-template.md - compatible with educational focus
  ✅ tasks-template.md - supports optional testing workflow
  
  Follow-up Actions: None required
-->

# Elector Constitution

## Core Principles

### I. Documentation-First

**Every feature MUST be comprehensively documented before and during implementation.**

- User-facing features require clear tutorials and examples
- API/component interfaces require inline documentation and usage guides
- Architecture decisions must be captured in design documents
- README files must be kept current with feature changes
- Educational value is paramount—documentation teaches as much as the app itself

**Rationale**: As an electronics tutoring application, clear documentation serves dual purposes: guiding development and providing educational value to users learning electronics concepts.

### II. Educational Focus

**The application exists to teach electronics concepts effectively.**

- User experience must prioritize learning outcomes over technical complexity
- Features should break down complex electronics topics into digestible lessons
- Interactive elements should reinforce understanding through practice
- Error messages and feedback should be instructive, not just informative
- UI/UX decisions favor clarity and comprehension

**Rationale**: This is fundamentally an educational tool. Every technical decision should support the goal of making electronics accessible and understandable.

### III. Pragmatic Testing

**Testing is encouraged but proportional to project scope as a hobby project.**

- Core learning paths and critical user flows SHOULD have integration tests
- Utility functions and complex logic SHOULD have unit tests
- Testing is NOT mandatory for every component—use judgment
- Manual testing and user feedback are valid quality assurance methods
- Test coverage goals are advisory, not blocking

**Rationale**: As a hobby project, testing should add value without creating excessive overhead. Focus testing effort where it matters most—core user journeys and complex logic.

### IV. TypeScript & Node.js Stack

**The project is built on TypeScript and Node.js ecosystem.**

- All application code MUST be written in TypeScript
- Use modern JavaScript/TypeScript features (ES2020+)
- Leverage npm ecosystem for dependencies, but avoid dependency bloat
- Type safety is valued—minimize use of `any` types
- Build tooling should be simple and maintainable (e.g., esbuild, Vite)

**Rationale**: TypeScript provides type safety and excellent developer experience while Node.js enables both local and web deployment scenarios.

### V. Deployment Flexibility

**The application MUST support both local execution and web deployment.**

- Architecture should be deployment-agnostic where possible
- Local development experience MUST be straightforward (npm install, npm start)
- Web deployment should target static hosting (AWS S3, Netlify, Vercel, etc.)
- Configuration should adapt to deployment environment (env variables, build-time flags)
- No hard dependencies on specific cloud services—keep portability

**Rationale**: Hobby projects benefit from deployment flexibility. Users should be able to run locally, and the app should be easy to host on free or low-cost platforms.

## Technology Stack

**Language**: TypeScript 5.x (targeting ES2020+)

**Runtime**: Node.js 20.x LTS or later

**Package Manager**: npm (locks via package-lock.json)

**Frontend** (if web-based):
- Modern framework (React, Vue, Svelte—choose based on familiarity)
- Build tool: Vite or similar for fast development
- Styling: CSS modules, Tailwind, or similar utility-first approach

**Backend** (if needed):
- Express.js or Fastify for API endpoints
- File-based storage acceptable for hobby scope
- Database if justified: SQLite for local, PostgreSQL for production

**Testing** (when used):
- Vitest or Jest for unit/integration tests
- Playwright or Cypress for E2E tests (optional)

**Deployment**:
- Static build output for web deployment
- Docker optional, not required
- CI/CD optional, not required for initial releases

## Development Workflow

**Feature Development**:
- Follow SpecKit workflow: specify → plan → tasks → implement
- Document features in `/specs/[###-feature-name]/`
- User stories drive development priorities
- Iterate based on manual testing and user feedback

**Code Quality**:
- ESLint for code linting (enforce TypeScript rules)
- Prettier for consistent formatting
- Pre-commit hooks encouraged but not mandatory
- Peer review appreciated for significant changes (if collaborating)

**Version Control**:
- Git with feature branches (`###-feature-name` pattern)
- Commit messages should be descriptive
- Main branch should remain deployable
- Squash merging acceptable for cleaner history

**Release Process**:
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog maintained in CHANGELOG.md
- Git tags for releases
- No formal release schedule—ship when ready

## Governance

This constitution defines the development philosophy and non-negotiable patterns for Elector. 

**Authority**: This constitution supersedes ad-hoc decisions and establishes the default approach for all development activities.

**Amendments**:
- Constitution changes require updating this document with rationale
- Version must be incremented per semantic rules (MAJOR/MINOR/PATCH)
- LAST_AMENDED_DATE must be updated
- Dependent templates must be reviewed for consistency

**Compliance**:
- Feature specifications should reference relevant constitutional principles
- Implementation plans should verify constitutional alignment
- Violating principles requires explicit justification in documentation
- As a hobby project, pragmatism may override strict compliance when documented

**Living Document**:
- Constitution should evolve as project understanding deepens
- Regularly review principles for continued relevance
- Remove or update principles that no longer serve the project
- Capture lessons learned from development experience

**Version**: 1.0.0 | **Ratified**: 2026-03-09 | **Last Amended**: 2026-03-09
