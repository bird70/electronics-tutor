import { describe, expect, it } from 'vitest';
import { loadLessons, loadLessonPlans, loadExamPapers } from '@/services/content/contentRepository';
import { validateLesson } from '@/services/learning/lessonValidator';

const EXPECTED_BEGINNER_LESSONS = [
  'intro-kinematics',
  'newtons-laws',
  'work-energy-power',
];

const EXPECTED_INTERMEDIATE_LESSONS = [
  'projectile-motion',
  'circular-motion',
  'momentum-impulse',
];

const EXPECTED_ADVANCED_LESSONS = [
  'rotational-mechanics',
  'simple-harmonic-motion',
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
      expect(valid, `Lesson ${lesson.id} failed validation: ${errors.join(', ')}`).toBe(true);
      expect(errors).toHaveLength(0);
    }
  });

  it('verifies lesson plans reference existing lessons and match expected sequences', async () => {
    const [lessons, plans] = await Promise.all([loadLessons(), loadLessonPlans()]);
    const lessonIdSet = new Set(lessons.map((l) => l.id));

    const beginnerPlan = plans.find((p) => p.id === 'beginner-mechanics-foundations');
    const intermediatePlan = plans.find((p) => p.id === 'intermediate-ncea-mechanics');
    const advancedPlan = plans.find((p) => p.id === 'advanced-ncea-mechanics');

    expect(beginnerPlan?.lessonIds).toEqual(EXPECTED_BEGINNER_LESSONS);
    expect(intermediatePlan?.lessonIds).toEqual(EXPECTED_INTERMEDIATE_LESSONS);
    expect(advancedPlan?.lessonIds).toEqual(EXPECTED_ADVANCED_LESSONS);

    for (const id of beginnerPlan?.lessonIds ?? []) expect(lessonIdSet.has(id)).toBe(true);
    for (const id of intermediatePlan?.lessonIds ?? []) expect(lessonIdSet.has(id)).toBe(true);
    for (const id of advancedPlan?.lessonIds ?? []) expect(lessonIdSet.has(id)).toBe(true);
  });

  it('loads exam papers with valid structure', async () => {
    const exams = await loadExamPapers();
    expect(exams.length).toBeGreaterThan(0);

    for (const exam of exams) {
      expect(exam.id).toBeTruthy();
      expect(exam.title).toBeTruthy();
      expect(exam.standard).toBeTruthy();
      expect(exam.totalMarks).toBeGreaterThan(0);
      expect(exam.timeAllowedMinutes).toBeGreaterThan(0);
      expect(exam.questions.length).toBeGreaterThan(0);

      for (const q of exam.questions) {
        expect(q.id).toBeTruthy();
        expect(q.marks).toBeGreaterThan(0);
        expect(['mc', 'short', 'long']).toContain(q.type);
        expect(q.questionText).toBeTruthy();
        expect(q.modelAnswer).toBeTruthy();

        if (q.type === 'mc') {
          expect(q.options).toBeDefined();
          expect(q.options!.length).toBeGreaterThanOrEqual(2);
          expect(q.correctIndex).toBeDefined();
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.options!.length);
        }
      }
    }
  });
});
