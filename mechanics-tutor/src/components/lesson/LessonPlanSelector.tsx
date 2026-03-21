import type { LessonPlan, LessonStatus, DifficultyBand } from '@/domain/learning/types'

interface Props {
  plans: LessonPlan[]
  lessonStatuses: Record<string, LessonStatus>
  onSelectPlan: (plan: LessonPlan) => void
}

const FILTERS: Array<'all' | DifficultyBand> = ['all', 'beginner', 'intermediate', 'advanced']

import { useState } from 'react'

export function LessonPlanSelector({ plans, lessonStatuses, onSelectPlan }: Props) {
  const [filter, setFilter] = useState<'all' | DifficultyBand>('all')

  const visible = filter === 'all' ? plans : plans.filter((p) => p.difficultyBand === filter)

  return (
    <div className="lesson-plan-selector">
      <h2>Lesson Plans</h2>
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="plan-cards">
        {visible.map((plan) => {
          const completedCount = plan.lessonIds.filter((id) => lessonStatuses[id] === 'completed').length
          return (
            <div key={plan.id} className="plan-card" onClick={() => onSelectPlan(plan)}>
              <div className="plan-card__header">
                <span className="plan-card__title">{plan.title}</span>
                <span className={`difficulty-badge difficulty-badge--${plan.difficultyBand}`}>
                  {plan.difficultyBand}
                </span>
              </div>
              <p className="plan-card__goal">{plan.goal}</p>
              <div className="plan-card__meta">
                <span>⏱ {plan.estimatedMinutes} min</span>
                <span>📖 {completedCount}/{plan.lessonIds.length} lessons</span>
              </div>
            </div>
          )
        })}
        {visible.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)' }}>No plans found for this filter.</p>
        )}
      </div>
    </div>
  )
}
