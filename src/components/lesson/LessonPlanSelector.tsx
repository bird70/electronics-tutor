import { useEffect, useState } from 'react';
import { useAppStore } from '@/state/store';
import { loadLessonPlans } from '@/services/content/contentRepository';
import { getPlanProgress } from '@/domain/learning/planSequencer';
import type { LessonPlan } from '@/domain/learning/types';

interface LessonPlanSelectorProps {
  onSelect: (plan: LessonPlan) => void;
}

/**
 * Grid of available lesson plans with progress indicators.
 * User clicks to activate a plan.
 */
export function LessonPlanSelector({ onSelect }: LessonPlanSelectorProps) {
  const progress = useAppStore((s) => s.progress);
  const [plans, setPlans] = useState<LessonPlan[]>([]);

  useEffect(() => {
    loadLessonPlans().then(setPlans);
  }, []);

  if (plans.length === 0) {
    return <p>No lesson plans available yet.</p>;
  }

  return (
    <div className="plan-selector">
      <h2>📚 Learning Paths</h2>
      <div className="plan-selector__grid">
        {plans.map((plan) => {
          const pct = getPlanProgress(plan, progress);
          return (
            <div
              key={plan.id}
              className="plan-card"
              onClick={() => onSelect(plan)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(plan)}
            >
              <div className="plan-card__band">{plan.difficultyBand}</div>
              <h3 className="plan-card__title">{plan.title}</h3>
              <p className="plan-card__goal">{plan.goal}</p>
              <div className="plan-card__meta">
                <span>📖 {plan.lessonIds.length} lessons</span>
                <span>⏱ ~{plan.estimatedMinutes} min</span>
              </div>
              <div className="plan-card__progress">
                <div
                  className="plan-card__progress-bar"
                  style={{ width: `${pct}%` }}
                />
                <span>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
