import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '@/state/store';
import { CircuitWorkspace } from '@/components/circuit/CircuitWorkspace';
import { ComponentPalette } from '@/components/circuit/ComponentPalette';
import { evaluateCircuit, checkCondition } from '@/services/simulation/evaluateCircuit';
import { explainCircuit } from '@/services/feedback/explainCircuit';
import { calculateScore, formatScore, type ChallengeResult } from '@/domain/gamification/scoring';
import { BEGINNER_COMPONENTS } from '@/domain/circuit/types';
import type { CircuitChallenge } from '@/domain/learning/types';

interface ChallengePlayerProps {
  challenge: CircuitChallenge;
  onComplete: (result: ChallengeResult) => void;
  onBack: () => void;
}

/**
 * Challenge run view: shows objective, circuit workspace, and evaluates
 * win conditions when the user submits their solution.
 */
export function ChallengePlayer({ challenge, onComplete, onBack }: ChallengePlayerProps) {
  const graph = useAppStore((s) => s.circuitGraph);
  const setGraph = useAppStore((s) => s.setCircuitGraph);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const startTimeRef = useRef(Date.now());

  // Reset circuit on mount
  useEffect(() => {
    setGraph({ components: [], wires: [] });
    startTimeRef.current = Date.now();
  }, [challenge.id, setGraph]);

  const availableComponents = useMemo(
    () => BEGINNER_COMPONENTS.filter((d) => challenge.allowedComponents.includes(d.id)),
    [challenge.allowedComponents],
  );

  const componentDefs = useMemo(() => {
    const map: Record<string, { type: string }> = {};
    for (const def of availableComponents) {
      map[def.id] = { type: def.type };
    }
    return map;
  }, [availableComponents]);

  const evaluation = useMemo(() => evaluateCircuit(graph, componentDefs), [graph, componentDefs]);
  const feedback = useMemo(() => explainCircuit(evaluation), [evaluation]);

  const allConditionsMet = useMemo(
    () => challenge.winConditions.every((cond) => checkCondition(evaluation, cond)),
    [challenge.winConditions, evaluation],
  );

  const handleSubmit = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const challengeResult = calculateScore(challenge, elapsed, hintsUsed);
    setResult(challengeResult);
    onComplete(challengeResult);
  }, [challenge, hintsUsed, onComplete]);

  if (result) {
    return (
      <div className="challenge-result">
        <h2>{allConditionsMet ? '🎉 Challenge Complete!' : '❌ Not Quite...'}</h2>
        <p className="challenge-result__score">{formatScore(result)}</p>
        {result.reward && (
          <div className="challenge-result__reward">
            <h3>🏅 {result.reward.title}</h3>
            <p>{result.reward.description}</p>
          </div>
        )}
        <button className="btn" onClick={onBack}>
          ← Back to Challenges
        </button>
      </div>
    );
  }

  return (
    <div className="challenge-player">
      <header className="challenge-player__header">
        <button className="btn btn--sm" onClick={onBack}>← Back</button>
        <h2>{challenge.title}</h2>
        <span className="challenge-player__level">Level {challenge.level}</span>
      </header>

      <section className="challenge-player__objective">
        <h3>🎯 Objective</h3>
        <p>{challenge.objectiveText}</p>
      </section>

      <div className="challenge-player__workspace">
        <div className="challenge-player__palette">
          <ComponentPalette
            graph={graph}
            onGraphChange={setGraph}
            availableComponents={availableComponents}
          />
        </div>
        <div className="challenge-player__canvas">
          <CircuitWorkspace graph={graph} onGraphChange={setGraph} />
        </div>
      </div>

      <section className="challenge-player__feedback">
        <h4>Circuit Analysis</h4>
        <ul>
          {feedback.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <div className="challenge-player__actions">
        <button
          className="btn btn--accent"
          onClick={handleSubmit}
          disabled={!allConditionsMet}
        >
          {allConditionsMet ? '✅ Submit Solution' : '⚡ Keep Building...'}
        </button>
        <span className="challenge-player__hints">
          Hints used: {hintsUsed}
          <button className="btn btn--sm" onClick={() => setHintsUsed((h) => h + 1)}>
            💡 Use Hint
          </button>
        </span>
      </div>
    </div>
  );
}
