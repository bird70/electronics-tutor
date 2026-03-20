import type { Lesson, LessonStep, CircuitCondition } from '@/domain/learning/types';

const CONCEPT_TAGS = new Set(['voltage', 'current', 'resistance', 'resistivity', 'power']);
const METRICS = new Set(['voltage', 'current', 'resistance', 'power', 'validCircuit']);
const OPERATORS = new Set(['eq', 'neq', 'lt', 'lte', 'gt', 'gte']);

function validateCondition(c: CircuitCondition, path: string): string[] {
  const errors: string[] = [];
  if (!METRICS.has(c.metric)) errors.push(`${path}.metric: invalid value "${c.metric}"`);
  if (!OPERATORS.has(c.operator)) errors.push(`${path}.operator: invalid value "${c.operator}"`);
  if (typeof c.value !== 'number' && typeof c.value !== 'boolean')
    errors.push(`${path}.value: must be number or boolean`);
  return errors;
}

function validateStep(step: LessonStep, index: number): string[] {
  const p = `steps[${index}]`;
  const errors: string[] = [];
  if (!step.id) errors.push(`${p}.id is required`);
  if (!step.instructionText) errors.push(`${p}.instructionText is required`);
  if (!step.feedbackOnSuccess) errors.push(`${p}.feedbackOnSuccess is required`);
  if (!step.feedbackOnFailure) errors.push(`${p}.feedbackOnFailure is required`);
  if (step.targetCondition) {
    errors.push(...validateCondition(step.targetCondition, `${p}.targetCondition`));
  } else {
    errors.push(`${p}.targetCondition is required`);
  }
  return errors;
}

export function validateLesson(lesson: Lesson): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!lesson.id) errors.push('id is required');
  if (!lesson.title) errors.push('title is required');
  if (!lesson.introText) errors.push('introText is required');

  if (!Array.isArray(lesson.conceptTags) || lesson.conceptTags.length === 0) {
    errors.push('conceptTags must contain at least one tag');
  } else {
    for (const tag of lesson.conceptTags) {
      if (!CONCEPT_TAGS.has(tag)) errors.push(`conceptTags: invalid tag "${tag}"`);
    }
  }

  if (!Array.isArray(lesson.learningObjectives) || lesson.learningObjectives.length === 0) {
    errors.push('learningObjectives must contain at least one objective');
  }

  if (!Array.isArray(lesson.componentPalette) || lesson.componentPalette.length === 0) {
    errors.push('componentPalette must contain at least one component');
  }

  if (!Array.isArray(lesson.steps) || lesson.steps.length === 0) {
    errors.push('steps must contain at least one step');
  } else {
    lesson.steps.forEach((step, i) => errors.push(...validateStep(step, i)));
  }

  return { valid: errors.length === 0, errors };
}
