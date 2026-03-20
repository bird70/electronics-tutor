import { useEffect, useState } from 'react';
import { useAppStore } from '@/state/store';
import { loadLessonPlans } from '@/services/content/contentRepository';
import { getPlanProgress } from '@/domain/learning/planSequencer';
import type { LessonPlan, DifficultyBand } from '@/domain/learning/types';

interface LessonPlanSelectorProps {
  onSelect: (plan: LessonPlan) => void;
}

const BAND_EMOJI: Record<DifficultyBand, string> = {
  beginner: '🟢',
  intermediate: '🟡',
  advanced: '🔴',
};

/**
 * Grid of available lesson plans with progress indicators.
 * User clicks to activate a plan.
 */
export function LessonPlanSelector({ onSelect }: LessonPlanSelectorProps) {
  const progress = useAppStore((s) => s.progress);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [filter, setFilter] = useState<DifficultyBand | 'all'>('all');

  useEffect(() => {
    loadLessonPlans().then(setPlans);
  }, []);

  if (plans.length === 0) {
    return <p>No lesson plans available yet.</p>;
  }

  const filteredPlans =
    filter === 'all' ? plans : plans.filter((plan) => plan.difficultyBand === filter);

  const difficulties: Array<DifficultyBand | 'all'> = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="plan-selector">
      <h2>📚 Lesson Plans</h2>
      <div className="plan-selector__filters" role="group" aria-label="Filter lesson plans by level">
        {difficulties.map((value) => (
          <button
            key={value}
            className={`btn btn--ghost ${filter === value ? 'btn--active' : ''}`}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === 'all'
              ? 'All'
              : `${BAND_EMOJI[value as DifficultyBand]} ${value.charAt(0).toUpperCase() + value.slice(1)}`}
          </button>
        ))}
      </div>
      {filteredPlans.length === 0 && <p>No lesson plans found for this level.</p>}
      <div className="plan-selector__grid">
        {filteredPlans.map((plan) => {
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
              <div className="plan-card__band">
                {BAND_EMOJI[plan.difficultyBand]} {plan.difficultyBand}
              </div>
              <h3 className="plan-card__title">{plan.title}</h3>
              <p className="plan-card__goal">{plan.goal}</p>
              <div className="plan-card__meta">
                <span>📖 {plan.lessonIds.length} lessons</span>
                <span>⏱ ~{plan.estimatedMinutes} min</span>
              </div>
              <div className="plan-card__progress">
                <div className="plan-card__progress-bar-track">
                  <div
                    className="plan-card__progress-bar"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
