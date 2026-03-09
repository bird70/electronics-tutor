import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/state/store';
import { loadLessons, loadLessonPlans, loadReferences } from '@/services/content/contentRepository';
import { sequencePlan, checkPrerequisites } from '@/domain/learning/planSequencer';
import { LessonPlanSelector } from '@/components/lesson/LessonPlanSelector';
import { LessonDetail } from '@/components/lesson/LessonDetail';
import { PrerequisiteGate } from '@/components/lesson/PrerequisiteGate';
import type { Lesson, LessonPlan, ReferenceResource } from '@/domain/learning/types';

export function LearningPathRoute() {
  const progress = useAppStore((s) => s.progress);
  const activePlan = useAppStore((s) => s.activePlan);
  const setActivePlan = useAppStore((s) => s.setActivePlan);

  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [allPlans, setAllPlans] = useState<LessonPlan[]>([]);
  const [references, setReferences] = useState<ReferenceResource[]>([]);

  useEffect(() => {
    loadLessons().then(setAllLessons);
    loadLessonPlans().then(setAllPlans);
    loadReferences().then(setReferences);
  }, []);

  const handleSelect = useCallback(
    (plan: LessonPlan) => {
      setActivePlan(plan);
    },
    [setActivePlan],
  );

  // No active plan — show selector
  if (!activePlan) {
    return <LessonPlanSelector onSelect={handleSelect} />;
  }

  // Check prerequisites
  const { met, missingPlans } = checkPrerequisites(activePlan, allPlans, progress);
  if (!met) {
    return (
      <div>
        <button className="btn btn--sm" onClick={() => setActivePlan(null)}>
          ← Back to Plans
        </button>
        <PrerequisiteGate missingPlans={missingPlans} />
      </div>
    );
  }

  // Sequence the plan
  const sequence = sequencePlan(activePlan, allLessons, progress);

  return (
    <div className="learning-path">
      <header className="learning-path__header">
        <button className="btn btn--sm" onClick={() => setActivePlan(null)}>
          ← Back to Plans
        </button>
        <h2>{activePlan.title}</h2>
        <p>{activePlan.goal}</p>
      </header>

      <div className="learning-path__lessons">
        {sequence.map((item) => (
          <LessonDetail
            key={item.lesson.id}
            lesson={item.lesson}
            status={item.status}
            order={item.order}
            references={references}
          />
        ))}
      </div>
    </div>
  );
}
