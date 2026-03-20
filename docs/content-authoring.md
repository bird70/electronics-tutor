# Content Authoring

This guide explains how to add new educational content to Electronics Tutor — lessons, challenges, learning paths, and reference resources. No code changes are needed for straightforward additions; you only need to create or edit JSON files.

## Table of Contents

- [Overview](#overview)
- [Adding a Lesson](#adding-a-lesson)
- [Adding a Challenge](#adding-a-challenge)
- [Adding a Learning Path](#adding-a-learning-path)
- [Adding Reference Resources](#adding-reference-resources)
- [Available Components](#available-components)
- [Circuit Conditions Reference](#circuit-conditions-reference)
- [Concept Tags Reference](#concept-tags-reference)

---

## Overview

All educational content lives in `src/content/` as static JSON files:

```
src/content/
├── lessons/         # One .json file per lesson
├── lesson-plans/    # One .json file per plan
├── challenges/      # One .json file per challenge track (array)
└── references/      # Single resources.json file
```

The content loading service uses Vite glob imports to automatically discover all JSON files in these directories. After adding or editing a file, restart the dev server (`npm run dev`) or rebuild (`npm run build`) for changes to take effect.

### Built-in lessons

The default beginner learning path (`beginner-foundations`) now ships with six guided lessons:

- `basics-series-circuit` — build your first loop and observe current in a simple series circuit.
- `measurement-basics-meters` — practice wiring a clean loop while comparing readings with a meter.
- `current-limiting-basics` — raise resistance to keep current inside safe limits.
- `voltage-divider-basics` — size a two-resistor divider that only draws a few milliamps.
- `series-dual-source-boost` — combine two sources in series to raise voltage safely.
- `power-budgeting-series` — adjust voltage and resistance to keep total power under control.

---

## Adding a Lesson

Create a new JSON file in `src/content/lessons/`. The filename should match the lesson `id` (e.g. `parallel-circuits.json`).

### Schema

```jsonc
{
  "id": "ohms-law-deep-dive",           // Unique string ID — must match filename
  "title": "Ohm's Law in Depth",        // Display name shown in the UI
  "conceptTags": ["voltage", "current", "resistance"],  // See Concept Tags section
  "learningObjectives": [
    "Apply Ohm's Law to predict current from voltage and resistance",
    "Observe how doubling resistance halves the current"
  ],
  "introText": "Ohm's Law (V = IR) is the foundation of circuit analysis...",
  "componentPalette": ["dc-source", "resistor", "wire"],  // See Available Components
  "steps": [
    {
      "id": "step-1",                   // Unique within this lesson
      "instructionText": "Place a 9V DC source on the workspace.",
      "targetCondition": {
        "metric": "voltage",            // See Circuit Conditions section
        "operator": "eq",
        "value": 9
      },
      "feedbackOnSuccess": "Great! You've added a 9V source.",
      "feedbackOnFailure": "Add a DC Voltage Source and set it to 9V."
    }
  ],
  "assessment": {                        // Optional post-lesson quiz
    "questions": [
      {
        "id": "q1",
        "questionText": "With a 6V source and a 300Ω resistor, what is the current?",
        "options": ["0.02A (20 mA)", "0.2A (200 mA)", "50A", "1800A"],
        "correctIndex": 0,              // Zero-based index into options
        "explanation": "Using Ohm's Law: I = V/R = 6/300 = 0.02A = 20 mA."
      }
    ]
  }
}
```

### Required fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique across all lessons; used in URLs (`/lesson/:id`) |
| `title` | string | Shown in lesson plan selectors and the lesson header |
| `conceptTags` | string[] | At least one; see [Concept Tags](#concept-tags-reference) |
| `learningObjectives` | string[] | At least one objective |
| `introText` | string | Introductory paragraph shown before step 1 |
| `componentPalette` | string[] | Components available in the workspace for this lesson |
| `steps` | LessonStep[] | At least one step |

### Tips for writing lesson steps

- Keep each step focused on a single observable change.
- Write `instructionText` in second person ("Add a resistor…", "Look at the current…").
- Make `feedbackOnSuccess` celebratory and educational.
- Make `feedbackOnFailure` specific about what is wrong and how to fix it.
- Steps are shown in order. Design them to build knowledge incrementally.

---

## Adding a Challenge

Challenges are stored as arrays in `src/content/challenges/`. You can add a new entry to an existing file or create a new file for a new track.

### Schema

```jsonc
[
  {
    "id": "challenge-my-new-challenge",  // Unique string ID
    "title": "My New Challenge",
    "level": 4,                          // Integer >= 1; controls unlock order
    "objectiveText": "Build a circuit where...",
    "allowedComponents": ["dc-source", "resistor", "wire"],
    "winConditions": [
      { "metric": "validCircuit", "operator": "eq", "value": true },
      { "metric": "voltage", "operator": "eq", "value": 12 },
      { "metric": "current", "operator": "lt", "value": 0.05 }
    ],
    "scoringRules": {
      "maxScore": 150,
      "timeBonusEnabled": true,
      "penaltyPerHint": 20
    },
    "reward": {                          // Optional — shown on completion
      "title": "Precision Engineer",
      "description": "You hit the target precisely!"
    }
  }
]
```

### Required fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique across all challenges |
| `title` | string | Short display name |
| `level` | integer | Must be contiguous within a track (1, 2, 3…) |
| `objectiveText` | string | Describes the goal; shown to the user before they start |
| `allowedComponents` | string[] | Restricts the palette — see [Available Components](#available-components) |
| `winConditions` | CircuitCondition[] | All conditions must be satisfied simultaneously |
| `scoringRules.maxScore` | number | Base score before time bonus or hint penalties |
| `scoringRules.timeBonusEnabled` | boolean | `true` awards extra points for fast completions |
| `scoringRules.penaltyPerHint` | number | Score deducted per hint the user requests |

### Challenge design guidelines

- Level 1 challenges should be solvable immediately after completing the beginner lesson plan.
- Higher levels should require combining multiple concepts or applying constraints simultaneously.
- All `winConditions` are checked against the same `CircuitEvaluation` — the circuit must satisfy all of them at once.
- Use `objectiveText` to hint at the physics without giving away the answer.

---

## Adding a Learning Path

Create a new JSON file in `src/content/lesson-plans/`. The filename should match the plan `id` (e.g. `intermediate-power.json`).

### Schema

```jsonc
{
  "id": "intermediate-power",           // Unique string ID
  "title": "Power and Energy",
  "goal": "Understand how power is calculated and why it matters for real circuits.",
  "difficultyBand": "intermediate",     // "beginner" or "intermediate"
  "lessonIds": [                        // Ordered list of lesson IDs
    "basics-series-circuit",
    "ohms-law-deep-dive"
  ],
  "prerequisitePlanIds": ["beginner-foundations"],  // Optional — IDs of plans that must be completed first
  "estimatedMinutes": 45
}
```

### Required fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique across all plans |
| `title` | string | Display name |
| `goal` | string | One-sentence description of what the learner will achieve |
| `difficultyBand` | `"beginner"` \| `"intermediate"` | Shown in the selector UI |
| `lessonIds` | string[] | Ordered; all IDs must match existing lessons |
| `estimatedMinutes` | number | Helps learners decide whether to start now |

`prerequisitePlanIds` is optional. If provided, the `PrerequisiteGate` component blocks access until those plans are completed.

---

## Adding Reference Resources

All reference resources are stored in a single file: `src/content/references/resources.json`.

Add a new entry to the top-level array:

```jsonc
{
  "id": "khan-ohms-law",
  "title": "Ohm's Law — Khan Academy",
  "url": "https://www.khanacademy.org/science/physics/circuits-topic/circuits-resistance/a/ee-ohms-law",
  "type": "article",                  // "article" | "video" | "simulation" | "worksheet"
  "conceptTags": ["voltage", "current", "resistance"],
  "readingLevel": "high_school"       // "beginner" | "high_school" | "advanced"
}
```

### Required fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique across all resources |
| `title` | string | Display name shown as a link |
| `url` | string | Absolute URL; verify it is reachable before committing |
| `type` | string | One of `article`, `video`, `simulation`, `worksheet` |
| `conceptTags` | string[] | At least one — see [Concept Tags](#concept-tags-reference) |
| `readingLevel` | string | One of `beginner`, `high_school`, `advanced` |

Reference resources are associated with lessons by adding their IDs to the lesson's optional `referenceResourceIds` field.

---

## Available Components

Use these string identifiers in `componentPalette` (lessons) and `allowedComponents` (challenges):

| ID | Description | Configurable property |
|----|-------------|----------------------|
| `dc-source` | DC Voltage Source | `voltage` (Volts) |
| `resistor` | Resistor | `resistance` (Ohms) |
| `wire` | Connecting wire | — |
| `meter` | Measurement meter | — |
| `switch` | On/off switch | — |

> **Note:** The current simulation engine evaluates series circuits only. Parallel configurations are not supported by `evaluateCircuit`. Lessons involving parallel circuits should use the `validCircuit` condition and explain the behavior textually.

---

## Circuit Conditions Reference

`targetCondition` (lessons) and `winConditions` (challenges) use this shape:

```typescript
{
  metric: 'validCircuit' | 'voltage' | 'current' | 'resistance' | 'power';
  operator: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte';
  value: number | boolean;
}
```

### Metrics

| Metric | Maps to | Unit |
|--------|---------|------|
| `validCircuit` | `evaluation.isValid` | boolean |
| `voltage` | `evaluation.totalVoltage` | Volts (V) |
| `current` | `evaluation.totalCurrent` | Amperes (A) |
| `resistance` | `evaluation.totalResistance` | Ohms (Ω) |
| `power` | `evaluation.totalPower` | Watts (W) |

### Operators

| Operator | Meaning |
|----------|---------|
| `eq` | Equal (within ±0.001 for numbers) |
| `neq` | Not equal |
| `lt` | Less than |
| `lte` | Less than or equal |
| `gt` | Greater than |
| `gte` | Greater than or equal |

### Examples

```jsonc
// Circuit must be valid (connected and no short circuit)
{ "metric": "validCircuit", "operator": "eq", "value": true }

// Voltage source must be exactly 9V
{ "metric": "voltage", "operator": "eq", "value": 9 }

// Current must be between 29 mA and 31 mA (targeting 30 mA)
{ "metric": "current", "operator": "gte", "value": 0.029 }
{ "metric": "current", "operator": "lte", "value": 0.031 }

// Resistance must be at least 500Ω
{ "metric": "resistance", "operator": "gte", "value": 500 }

// Power must stay below 0.5W
{ "metric": "power", "operator": "lt", "value": 0.5 }
```

---

## Concept Tags Reference

Use these exact strings for `conceptTags` in lessons and references:

| Tag | Topic |
|-----|-------|
| `voltage` | Electric potential difference (Volts) |
| `current` | Electric current (Amperes) |
| `resistance` | Resistance (Ohms) |
| `resistivity` | Material property affecting resistance |
| `power` | Power dissipation (Watts) |
