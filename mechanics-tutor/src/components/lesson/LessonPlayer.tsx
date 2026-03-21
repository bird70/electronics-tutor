import { useState } from 'react'
import type { Lesson, LessonStep, TextStep, VisualizationStep, InteractiveStep, QuizStep } from '@/domain/learning/types'
import { useAppStore } from '@/state/store'
import { ConceptTagBadge } from './ConceptTagBadge'
import { KinematicsSolver } from '@/components/simulation/KinematicsSolver'
import { ProjectileSim } from '@/components/simulation/ProjectileSim'
import { CircularMotionSim } from '@/components/simulation/CircularMotionSim'
import { SHMSim } from '@/components/simulation/SHMSim'

const SIM_MAP: Record<string, () => JSX.Element> = {
  'kinematics-solver': KinematicsSolver,
  'projectile-sim': ProjectileSim,
  'circular-motion-sim': CircularMotionSim,
  'shm-sim': SHMSim,
}

interface Props {
  lesson: Lesson
  initialStepIndex?: number
}

function TextStepView({ step }: { step: TextStep }) {
  return (
    <div className="lesson-step">
      {step.heading && <h2>{step.heading}</h2>}
      <p>{step.body}</p>
      {step.deepDive && (
        <details className="deep-dive">
          <summary>Deep Dive ▾</summary>
          <div className="deep-dive__content">{step.deepDive}</div>
        </details>
      )}
    </div>
  )
}

function VisualizationStepView({ step }: { step: VisualizationStep }) {
  const Sim = SIM_MAP[step.visualizationKey]
  return (
    <div className="lesson-step">
      {step.heading && <h2>{step.heading}</h2>}
      {Sim ? <Sim /> : <p style={{ color: 'var(--color-text-muted)' }}>Visualization: {step.visualizationKey}</p>}
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>{step.caption}</p>
    </div>
  )
}

function InteractiveStepView({ step }: { step: InteractiveStep }) {
  const Sim = SIM_MAP[step.simulationKey]
  return (
    <div className="lesson-step">
      {step.heading && <h2>{step.heading}</h2>}
      <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{step.instructionText}</p>
      {Sim ? <Sim /> : <p style={{ color: 'var(--color-text-muted)' }}>Simulation: {step.simulationKey}</p>}
    </div>
  )
}

function QuizStepView({ step, onAnswered }: { step: QuizStep; onAnswered: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    onAnswered()
  }

  return (
    <div className="lesson-step">
      <h2>Quiz</h2>
      <p style={{ marginBottom: '0.75rem' }}>{step.questionText}</p>
      <div className="quiz-options">
        {step.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (selected !== null) {
            if (i === step.correctIndex) cls += ' quiz-option--correct'
            else if (i === selected) cls += ' quiz-option--wrong'
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={selected !== null}>
              {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className={`quiz-explanation quiz-explanation--${selected === step.correctIndex ? 'correct' : 'wrong'}`}>
          {selected === step.correctIndex ? '✓ Correct! ' : '✗ Incorrect. '}{step.explanation}
        </div>
      )}
    </div>
  )
}

function renderStep(step: LessonStep, onQuizAnswered: () => void) {
  switch (step.type) {
    case 'text': return <TextStepView step={step} />
    case 'visualization': return <VisualizationStepView step={step} />
    case 'interactive': return <InteractiveStepView step={step} />
    case 'quiz': return <QuizStepView step={step} onAnswered={onQuizAnswered} />
  }
}

export function LessonPlayer({ lesson, initialStepIndex = 0 }: Props) {
  const [stepIndex, setStepIndex] = useState(initialStepIndex)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)
  const completeLesson = useAppStore((s) => s.completeLesson)

  const step = lesson.steps[stepIndex]!
  const total = lesson.steps.length
  const isLast = stepIndex === total - 1

  const goNext = () => {
    if (isLast) {
      completeLesson(lesson.id)
      setCompleted(true)
    } else {
      setStepIndex((i) => i + 1)
      setQuizAnswered(false)
    }
  }

  const goPrev = () => {
    setStepIndex((i) => Math.max(0, i - 1))
    setQuizAnswered(false)
  }

  const canAdvance = step.type !== 'quiz' || quizAnswered

  if (completed) {
    return (
      <div className="lesson-complete">
        <h2>🎉 Lesson Complete!</h2>
        <p>You've finished <strong>{lesson.title}</strong>.</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {lesson.conceptTags.map((tag) => <ConceptTagBadge key={tag} tag={tag} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-player">
      <div className="lesson-player__header">
        <h1 className="lesson-player__title">{lesson.title}</h1>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {lesson.conceptTags.map((tag) => <ConceptTagBadge key={tag} tag={tag} />)}
        </div>
      </div>
      <span className="step-indicator">Step {stepIndex + 1} of {total}</span>
      {renderStep(step, () => setQuizAnswered(true))}
      <div className="step-nav">
        <button className="btn btn--outline btn--sm" onClick={goPrev} disabled={stepIndex === 0}>
          ← Previous
        </button>
        <span className="step-indicator">{stepIndex + 1} / {total}</span>
        <button className="btn btn--accent btn--sm" onClick={goNext} disabled={!canAdvance}>
          {isLast ? 'Finish ✓' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
