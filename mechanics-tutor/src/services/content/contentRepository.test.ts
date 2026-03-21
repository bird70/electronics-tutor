import { describe, it, expect } from 'vitest'
import { validateLesson } from '@/services/learning/lessonValidator'

// Direct JSON imports (avoids import.meta.glob Vite dependency in tests)
import introKinematics from '@/content/lessons/intro-kinematics.json'
import newtonsLaws from '@/content/lessons/newtons-laws.json'
import workEnergyPower from '@/content/lessons/work-energy-power.json'
import projectileMotion from '@/content/lessons/projectile-motion.json'
import circularMotion from '@/content/lessons/circular-motion.json'
import momentumImpulse from '@/content/lessons/momentum-impulse.json'
import rotationalMechanics from '@/content/lessons/rotational-mechanics.json'
import simpleHarmonicMotion from '@/content/lessons/simple-harmonic-motion.json'

import beginnerPlan from '@/content/lesson-plans/beginner-mechanics.json'
import intermediatePlan from '@/content/lesson-plans/intermediate-mechanics.json'
import advancedPlan from '@/content/lesson-plans/advanced-mechanics.json'

import type { Lesson, LessonPlan } from '@/domain/learning/types'

const allLessons = [
  introKinematics,
  newtonsLaws,
  workEnergyPower,
  projectileMotion,
  circularMotion,
  momentumImpulse,
  rotationalMechanics,
  simpleHarmonicMotion,
] as Lesson[]

const allPlans = [beginnerPlan, intermediatePlan, advancedPlan] as LessonPlan[]

const EXPECTED_LESSON_IDS = [
  'intro-kinematics',
  'newtons-laws',
  'work-energy-power',
  'projectile-motion',
  'circular-motion',
  'momentum-impulse',
  'rotational-mechanics',
  'simple-harmonic-motion',
]

const EXPECTED_PLAN_IDS = [
  'beginner-mechanics',
  'intermediate-mechanics',
  'advanced-mechanics',
]

describe('Content: lessons', () => {
  it('has all 8 expected lesson IDs', () => {
    const ids = allLessons.map((l) => l.id)
    for (const expectedId of EXPECTED_LESSON_IDS) {
      expect(ids).toContain(expectedId)
    }
  })

  it('every lesson passes validateLesson', () => {
    for (const lesson of allLessons) {
      const { valid, errors } = validateLesson(lesson)
      expect(errors, `${lesson.id}: ${errors.join(', ')}`).toHaveLength(0)
      expect(valid, `${lesson.id} should be valid`).toBe(true)
    }
  })

  it('each lesson has at least one step', () => {
    for (const lesson of allLessons) {
      expect(lesson.steps.length, `${lesson.id} should have steps`).toBeGreaterThan(0)
    }
  })

  it('each lesson has required fields', () => {
    for (const lesson of allLessons) {
      expect(lesson.id).toBeTruthy()
      expect(lesson.title).toBeTruthy()
      expect(lesson.introText).toBeTruthy()
      expect(lesson.conceptTags.length).toBeGreaterThan(0)
      expect(lesson.learningObjectives.length).toBeGreaterThan(0)
    }
  })
})

describe('Content: lesson plans', () => {
  it('has all 3 expected plan IDs', () => {
    const ids = allPlans.map((p) => p.id)
    for (const expectedId of EXPECTED_PLAN_IDS) {
      expect(ids).toContain(expectedId)
    }
  })

  it('each plan references existing lesson IDs', () => {
    const lessonIds = new Set(allLessons.map((l) => l.id))
    for (const plan of allPlans) {
      for (const lessonId of plan.lessonIds) {
        expect(lessonIds.has(lessonId), `Plan ${plan.id} references unknown lesson ${lessonId}`).toBe(true)
      }
    }
  })

  it('each plan has required fields', () => {
    for (const plan of allPlans) {
      expect(plan.id).toBeTruthy()
      expect(plan.title).toBeTruthy()
      expect(plan.goal).toBeTruthy()
      expect(['beginner', 'intermediate', 'advanced']).toContain(plan.difficultyBand)
      expect(plan.estimatedMinutes).toBeGreaterThan(0)
      expect(plan.lessonIds.length).toBeGreaterThan(0)
    }
  })
})
