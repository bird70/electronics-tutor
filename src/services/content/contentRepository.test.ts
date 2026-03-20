import { describe, expect, it } from 'vitest';
import { loadLessons, loadLessonPlans } from '@/services/content/contentRepository';
import { validateLesson } from '@/services/learning/lessonValidator';

const EXPECTED_BEGINNER_LESSONS = [
  'basics-series-circuit',
  'measurement-basics-meters',
  'current-limiting-basics',
  'voltage-divider-basics',
  'series-dual-source-boost',
  'power-budgeting-series',
];

const EXPECTED_INTERMEDIATE_LESSONS = [
  'intermediate-stable-current-supply',
  'intermediate-dual-resistor-tuning',
  'intermediate-switchable-load',
  'intermediate-meter-crosscheck',
  'intermediate-power-headroom',
];

const EXPECTED_ADVANCED_LESSONS = [
  'advanced-high-resistance-sensing',
  'advanced-two-source-rail',
  'advanced-power-derating',
  'advanced-low-current-tracing',
  'advanced-efficient-rail-tuning',
];

const EXPECTED_ALL_LESSONS = [
  ...EXPECTED_BEGINNER_LESSONS,
  ...EXPECTED_INTERMEDIATE_LESSONS,
  ...EXPECTED_ADVANCED_LESSONS,
];

describe('contentRepository', () => {
  it('loads all lessons and validates their shape', async () => {
    const lessons = await loadLessons();
    const ids = lessons.map((l) => l.id);

    expect(ids).toHaveLength(EXPECTED_ALL_LESSONS.length);
    expect(ids).toEqual(expect.arrayContaining(EXPECTED_ALL_LESSONS));

    for (const lesson of lessons) {
      const { valid, errors } = validateLesson(lesson);
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    }
  });

  it('verifies lesson plans reference existing lessons and match expected sequences', async () => {
    const [lessons, plans] = await Promise.all([loadLessons(), loadLessonPlans()]);
    const lessonIdSet = new Set(lessons.map((l) => l.id));

    const beginnerPlan = plans.find((p) => p.id === 'beginner-foundations');
    const intermediatePlan = plans.find((p) => p.id === 'intermediate-series-progression');
    const advancedPlan = plans.find((p) => p.id === 'advanced-safety-efficiency');

    expect(beginnerPlan?.lessonIds).toEqual(EXPECTED_BEGINNER_LESSONS);
    expect(intermediatePlan?.lessonIds).toEqual(EXPECTED_INTERMEDIATE_LESSONS);
    expect(advancedPlan?.lessonIds).toEqual(EXPECTED_ADVANCED_LESSONS);

    for (const id of beginnerPlan?.lessonIds ?? []) expect(lessonIdSet.has(id)).toBe(true);
    for (const id of intermediatePlan?.lessonIds ?? []) expect(lessonIdSet.has(id)).toBe(true);
    for (const id of advancedPlan?.lessonIds ?? []) expect(lessonIdSet.has(id)).toBe(true);
  });
});
