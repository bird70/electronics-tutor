import { describe, expect, it } from 'vitest';
import { loadLessons, loadLessonPlans } from '@/services/content/contentRepository';
import { validateLesson } from '@/services/learning/lessonValidator';

const EXPECTED_LESSON_IDS = [
  'basics-series-circuit',
  'measurement-basics-meters',
  'current-limiting-basics',
  'voltage-divider-basics',
  'series-dual-source-boost',
  'power-budgeting-series',
];

describe('contentRepository', () => {
  it('loads all lessons and validates their shape', async () => {
    const lessons = await loadLessons();
    const ids = lessons.map((l) => l.id);

    expect(ids).toHaveLength(EXPECTED_LESSON_IDS.length);
    expect(ids).toEqual(expect.arrayContaining(EXPECTED_LESSON_IDS));

    for (const lesson of lessons) {
      const { valid, errors } = validateLesson(lesson);
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    }
  });

  it('keeps the beginner plan aligned with the lesson catalog', async () => {
    const [lessons, plans] = await Promise.all([loadLessons(), loadLessonPlans()]);
    const lessonIdSet = new Set(lessons.map((l) => l.id));

    const beginnerPlan = plans.find((p) => p.id === 'beginner-foundations');
    expect(beginnerPlan).toBeDefined();
    expect(beginnerPlan?.lessonIds).toEqual(EXPECTED_LESSON_IDS);

    for (const id of beginnerPlan?.lessonIds ?? []) {
      expect(lessonIdSet.has(id)).toBe(true);
    }
  });
});
