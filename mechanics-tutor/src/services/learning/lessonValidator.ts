import type { Lesson, LessonStep } from '@/domain/learning/types'

const CONCEPT_TAGS = new Set([
  'kinematics', 'dynamics', 'forces', 'energy', 'momentum',
  'circular-motion', 'rotation', 'shm', 'projectile',
])

const STEP_TYPES = new Set(['text', 'visualization', 'interactive', 'quiz'])

function validateStep(step: LessonStep, index: number): string[] {
  const p = `steps[${index}]`
  const errors: string[] = []
  if (!step.id) errors.push(`${p}.id is required`)
  if (!STEP_TYPES.has(step.type)) errors.push(`${p}.type: invalid value "${step.type}"`)
  switch (step.type) {
    case 'text':
      if (!step.body) errors.push(`${p}.body is required for text steps`)
      break
    case 'visualization':
      if (!step.visualizationKey) errors.push(`${p}.visualizationKey is required`)
      if (!step.caption) errors.push(`${p}.caption is required`)
      break
    case 'interactive':
      if (!step.simulationKey) errors.push(`${p}.simulationKey is required`)
      if (!step.instructionText) errors.push(`${p}.instructionText is required`)
      break
    case 'quiz':
      if (!step.questionText) errors.push(`${p}.questionText is required`)
      if (!Array.isArray(step.options) || step.options.length < 2)
        errors.push(`${p}.options must have at least 2 items`)
      if (typeof step.correctIndex !== 'number') errors.push(`${p}.correctIndex is required`)
      if (!step.explanation) errors.push(`${p}.explanation is required`)
      break
  }
  return errors
}

export function validateLesson(lesson: Lesson): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!lesson.id) errors.push('id is required')
  if (!lesson.title) errors.push('title is required')
  if (!lesson.introText) errors.push('introText is required')
  if (!Array.isArray(lesson.conceptTags) || lesson.conceptTags.length === 0) {
    errors.push('conceptTags must contain at least one tag')
  } else {
    for (const tag of lesson.conceptTags)
      if (!CONCEPT_TAGS.has(tag)) errors.push(`conceptTags: invalid tag "${tag}"`)
  }
  if (!Array.isArray(lesson.learningObjectives) || lesson.learningObjectives.length === 0)
    errors.push('learningObjectives must contain at least one objective')
  if (!Array.isArray(lesson.steps) || lesson.steps.length === 0)
    errors.push('steps must contain at least one step')
  else
    lesson.steps.forEach((step, i) => errors.push(...validateStep(step, i)))
  return { valid: errors.length === 0, errors }
}
