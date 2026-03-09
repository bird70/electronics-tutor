import { useMemo, useCallback } from 'react';
import { useAppStore } from '@/state/store';
import { CircuitWorkspace } from '@/components/circuit/CircuitWorkspace';
import { ComponentPalette } from '@/components/circuit/ComponentPalette';
import { ConceptTagBadge } from '@/components/lesson/ConceptTagBadge';
import { evaluateCircuit, checkCondition } from '@/services/simulation/evaluateCircuit';
import { explainCircuit } from '@/services/feedback/explainCircuit';
import { BEGINNER_COMPONENTS } from '@/domain/circuit/types';
import type { Lesson } from '@/domain/learning/types';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
}

/**
 * Guided lesson player: displays step instructions, circuit workspace,
 * component palette, real-time feedback, and step progression.
 */
export function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const stepIndex = useAppStore((s) => s.activeLessonStepIndex);
  const setStepIndex = useAppStore((s) => s.setActiveLessonStepIndex);
  const graph = useAppStore((s) => s.circuitGraph);
  const setGraph = useAppStore((s) => s.setCircuitGraph);
  const setLastEvaluation = useAppStore((s) => s.setLastEvaluation);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const currentStep = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;

  // Build a definitions lookup from the lesson's allowed palette
  const componentDefs = useMemo(() => {
    const map: Record<string, { type: string }> = {};
    for (const def of BEGINNER_COMPONENTS) {
      if (lesson.componentPalette.includes(def.id)) {
        map[def.id] = { type: def.type };
      }
    }
    return map;
  }, [lesson.componentPalette]);

  const availableComponents = useMemo(
    () => BEGINNER_COMPONENTS.filter((d) => lesson.componentPalette.includes(d.id)),
    [lesson.componentPalette],
  );

  // Evaluate on every graph change
  const evaluation = useMemo(() => {
    const result = evaluateCircuit(graph, componentDefs);
    return result;
  }, [graph, componentDefs]);

  const feedback = useMemo(() => explainCircuit(evaluation), [evaluation]);

  const conditionMet = currentStep
    ? checkCondition(evaluation, currentStep.targetCondition)
    : false;

  const handleEvaluate = useCallback(() => {
    setLastEvaluation(evaluation);
  }, [evaluation, setLastEvaluation]);

  const handleNextStep = useCallback(() => {
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
      {/* Header */}
      <header className="lesson-player__header">
        <h2>{lesson.title}</h2>
        <div className="lesson-player__tags">
          {lesson.conceptTags.map((tag) => (
            <ConceptTagBadge key={tag} tag={tag} />
          ))}
        </div>
        <p className="lesson-player__intro">{lesson.introText}</p>
        <div className="lesson-player__progress">
          Step {stepIndex + 1} of {lesson.steps.length}
        </div>
      </header>

      {/* Step instruction */}
      {currentStep && (
        <section className="lesson-player__step">
          <h3>📝 {currentStep.instructionText}</h3>
          {conditionMet ? (
            <div className="lesson-player__feedback lesson-player__feedback--success">
              ✅ {currentStep.feedbackOnSuccess}
            </div>
          ) : (
            evaluation.errors.length === 0 &&
            evaluation.isValid && (
              <div className="lesson-player__feedback lesson-player__feedback--hint">
                💡 {currentStep.feedbackOnFailure}
              </div>
            )
          )}
        </section>
      )}

      {/* Canvas area */}
      <div className="lesson-player__workspace">
        <div className="lesson-player__palette">
          <ComponentPalette
            graph={graph}
            onGraphChange={setGraph}
            availableComponents={availableComponents}
          />
        </div>
        <div className="lesson-player__canvas">
          <CircuitWorkspace graph={graph} onGraphChange={setGraph} />
        </div>
      </div>

      {/* Feedback panel */}
      <section className="lesson-player__feedback-panel">
        <h4>Circuit Analysis</h4>
        <ul>
          {feedback.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <div className="lesson-player__actions">
        <button className="btn" onClick={handleEvaluate}>
          ⚡ Evaluate Circuit
        </button>
        {conditionMet && (
          <button className="btn btn--accent" onClick={handleNextStep}>
            {isLastStep ? '🎉 Complete Lesson' : 'Next Step →'}
          </button>
        )}
      </div>
    </div>
  );
}
