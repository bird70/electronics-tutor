import type { LessonPlan } from '@/domain/learning/types';

interface PrerequisiteGateProps {
  missingPlans: LessonPlan[];
}

/**
 * Overlay shown when a learning path has unmet prerequisites.
 * Shows which plans must be completed first.
 */
export function PrerequisiteGate({ missingPlans }: PrerequisiteGateProps) {
  return (
    <div className="prerequisite-gate">
      <div className="prerequisite-gate__overlay">
        <div className="prerequisite-gate__content">
          <h3>🔒 Prerequisites Required</h3>
          <p>Complete these learning paths first:</p>
          <ul className="prerequisite-gate__list">
            {missingPlans.map((plan) => (
              <li key={plan.id} className="prerequisite-gate__item">
                <span className="prerequisite-gate__icon">📚</span>
                <div>
                  <strong>{plan.title}</strong>
                  <p>{plan.goal}</p>
                  <span className="prerequisite-gate__est">
                    ~{plan.estimatedMinutes} min
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
