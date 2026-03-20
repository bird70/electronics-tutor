import { useEffect, useState } from 'react';
import { useAppStore } from '@/state/store';
import { loadExamPapers, loadLessons } from '@/services/content/contentRepository';
import type { ExamPaper, Lesson } from '@/domain/learning/types';

/**
 * Progress dashboard showing learner stats.
 */
export function ProgressDashboard() {
  const progress = useAppStore((s) => s.progress);
  const [exams, setExams] = useState<ExamPaper[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    loadExamPapers().then(setExams);
    loadLessons().then(setLessons);
  }, []);

  const completedLessons = progress.completedLessonIds.length;
  const completedExams = progress.completedExamIds.length;
  const totalLessons = lessons.length;
  const totalExams = exams.length;

  return (
    <div className="progress-dashboard">
      <h2>📊 Your Progress</h2>

      <div className="progress-dashboard__stats">
        <div className="stat-card">
          <span className="stat-card__value">
            {completedLessons}/{totalLessons}
          </span>
          <span className="stat-card__label">Lessons Done</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {completedExams}/{totalExams}
          </span>
          <span className="stat-card__label">Exams Attempted</span>
        </div>
      </div>
    </div>
  );
}
