import { useState, useCallback } from 'react';
import { useAppStore } from '@/state/store';
import { getSimulation } from '@/components/simulation';
import type { Lesson, LessonStep, TextStep, VisualizationStep, InteractiveStep, QuizStep } from '@/domain/learning/types';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
}

function TextStepView({ step }: { step: TextStep }) {
  const [deepOpen, setDeepOpen] = useState(false);
  return (
    <div className="lesson-step lesson-step--text">
      {step.heading && <h3 className="lesson-step__heading">{step.heading}</h3>}
      <div className="lesson-step__body">{step.body}</div>
      {step.deepDive && (
        <div className="deep-dive">
          <button
            className="btn btn--ghost deep-dive__toggle"
            onClick={() => setDeepOpen((o) => !o)}
            aria-expanded={deepOpen}
          >
            🔬 {deepOpen ? 'Hide' : 'Show'} Deep Dive
          </button>
          {deepOpen && (
            <div className="deep-dive__content">{step.deepDive}</div>
          )}
        </div>
      )}
    </div>
  );
}

function VisualizationStepView({ step }: { step: VisualizationStep }) {
  const SimComponent = getSimulation(step.visualizationKey);
  return (
    <div className="lesson-step lesson-step--visualization">
      {step.heading && <h3 className="lesson-step__heading">{step.heading}</h3>}
      {SimComponent ? (
        <SimComponent config={step.config} />
      ) : (
        <p className="lesson-step__missing">
          Visualisation &quot;{step.visualizationKey}&quot; not available.
        </p>
      )}
      <p className="lesson-step__caption">{step.caption}</p>
    </div>
  );
}

function InteractiveStepView({ step }: { step: InteractiveStep }) {
  const SimComponent = getSimulation(step.simulationKey);
  const [deepOpen, setDeepOpen] = useState(false);
  return (
    <div className="lesson-step lesson-step--interactive">
      {step.heading && <h3 className="lesson-step__heading">{step.heading}</h3>}
      <p className="lesson-step__instruction">🎛️ {step.instructionText}</p>
      {SimComponent ? (
        <SimComponent config={step.config} />
      ) : (
        <p className="lesson-step__missing">
          Simulation &quot;{step.simulationKey}&quot; not available.
        </p>
      )}
      {step.deepDive && (
        <div className="deep-dive">
          <button
            className="btn btn--ghost deep-dive__toggle"
            onClick={() => setDeepOpen((o) => !o)}
            aria-expanded={deepOpen}
          >
            🔬 {deepOpen ? 'Hide' : 'Show'} Deep Dive
          </button>
          {deepOpen && (
            <div className="deep-dive__content">{step.deepDive}</div>
          )}
        </div>
      )}
    </div>
  );
}

function QuizStepView({
  step,
  onAnswered,
}: {
  step: QuizStep;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = useCallback(
    (index: number) => {
      if (selected !== null) return;
      setSelected(index);
      onAnswered(index === step.correctIndex);
    },
    [selected, step.correctIndex, onAnswered],
  );

  return (
    <div className="lesson-step lesson-step--quiz">
      <h3 className="lesson-step__heading">❓ Quick Check</h3>
      <p className="quiz-question">{step.questionText}</p>
      <div className="quiz-options">
        {step.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (selected !== null) {
            if (i === step.correctIndex) cls += ' quiz-option--correct';
            else if (i === selected) cls += ' quiz-option--wrong';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div
          className={`quiz-feedback ${selected === step.correctIndex ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`}
        >
          {selected === step.correctIndex ? '✅ Correct! ' : '❌ Not quite. '}
          {step.explanation}
        </div>
      )}
    </div>
  );
}

function renderStep(
  step: LessonStep,
  onQuizAnswered: (correct: boolean) => void,
) {
  switch (step.type) {
    case 'text':
      return <TextStepView key={step.id} step={step} />;
    case 'visualization':
      return <VisualizationStepView key={step.id} step={step} />;
    case 'interactive':
      return <InteractiveStepView key={step.id} step={step} />;
    case 'quiz':
      return <QuizStepView key={step.id} step={step} onAnswered={onQuizAnswered} />;
    default:
      return null;
  }
}

/**
 * Guided lesson player for mechanics-tutor.
 * Supports text, visualisation, interactive, and quiz step types.
 */
export function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const stepIndex = useAppStore((s) => s.activeLessonStepIndex);
  const setStepIndex = useAppStore((s) => s.setActiveLessonStepIndex);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const currentStep = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;

  // Quiz steps require answering before continuing
  const [quizAnswered, setQuizAnswered] = useState(false);

  const canContinue =
    currentStep?.type !== 'quiz' || quizAnswered;

  const handleNext = useCallback(() => {
    setQuizAnswered(false);
    if (isLastStep) {
      onComplete();
    } else {
      const next = stepIndex + 1;
      setStepIndex(next);
      setLastSession({ type: 'lesson', id: lesson.id, stepIndex: next });
    }
  }, [isLastStep, stepIndex, setStepIndex, onComplete, setLastSession, lesson.id]);

  return (
    <div className="lesson-player">
      <header className="lesson-player__header">
        <h2>{lesson.title}</h2>
        <div className="lesson-player__tags">
          {lesson.conceptTags.map((tag) => (
            <span key={tag} className="concept-tag">{tag}</span>
          ))}
        </div>
        <p className="lesson-player__intro">{lesson.introText}</p>
        <div className="lesson-player__progress">
          Step {stepIndex + 1} of {lesson.steps.length}
          <div className="lesson-player__progress-bar-track">
            <div
              className="lesson-player__progress-bar"
              style={{ width: `${((stepIndex + 1) / lesson.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="lesson-player__step-area">
        {currentStep && renderStep(
          currentStep,
          (correct) => { void correct; setQuizAnswered(true); },
        )}
      </div>

      <div className="lesson-player__actions">
        {canContinue && (
          <button className="btn btn--accent" onClick={handleNext}>
            {isLastStep ? '🎉 Complete Lesson' : 'Next →'}
          </button>
        )}
        {!canContinue && (
          <span className="lesson-player__hint">Answer the question to continue.</span>
        )}
      </div>
    </div>
  );
}
