import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { loadExamPapers, getExamById } from '@/services/content/contentRepository';
import { ExamPlayer } from '@/components/exam/ExamPlayer';
import type { ExamPaper } from '@/domain/learning/types';

export function ExamRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const playId = searchParams.get('play');

  const setActiveExam = useAppStore((s) => s.setActiveExam);
  const completeExam = useAppStore((s) => s.completeExam);
  const progress = useAppStore((s) => s.progress);

  const [exams, setExams] = useState<ExamPaper[]>([]);
  const [active, setActive] = useState<ExamPaper | null>(null);
  const [, setResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    loadExamPapers().then((papers) => {
      setExams(papers);
      if (playId) {
        const found = papers.find((e) => e.id === playId);
        if (found) {
          setActive(found);
          setActiveExam(found);
        }
      }
    });
    return () => setActiveExam(null);
  }, [playId, setActiveExam]);

  // Also support direct load by playId
  useEffect(() => {
    if (playId && !active) {
      getExamById(playId).then((e) => {
        if (e) { setActive(e); setActiveExam(e); }
      });
    }
  }, [playId, active, setActiveExam]);

  const handleComplete = useCallback(
    (score: number, total: number) => {
      setResult({ score, total });
      if (active) completeExam(active.id);
    },
    [active, completeExam],
  );

  const handleBack = useCallback(() => {
    setActive(null);
    setActiveExam(null);
    setResult(null);
    navigate('/exams');
  }, [navigate, setActiveExam]);

  if (active) {
    return (
      <ExamPlayer
        exam={active}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    );
  }

  if (exams.length === 0) {
    return <p className="loading">Loading exam papers…</p>;
  }

  return (
    <div className="exam-list">
      <h2>📋 Practice Exams</h2>
      <p className="exam-list__intro">
        These practice papers are based on the NZ NCEA Level 3 Physics external assessment standards.
        Work through them to prepare for your exams.
      </p>
      <div className="exam-list__grid">
        {exams.map((exam) => {
          const done = progress.completedExamIds.includes(exam.id);
          return (
            <div key={exam.id} className={`exam-card ${done ? 'exam-card--done' : ''}`}>
              {done && <span className="exam-card__badge">✅ Attempted</span>}
              <h3 className="exam-card__title">{exam.title}</h3>
              <p className="exam-card__standard">{exam.standard}</p>
              <div className="exam-card__meta">
                <span>📝 {exam.questions.length} questions</span>
                <span>⏱ {exam.timeAllowedMinutes} min</span>
                <span>🎯 {exam.totalMarks} marks</span>
              </div>
              <button
                className="btn btn--accent btn--sm"
                onClick={() => { setActive(exam); setActiveExam(exam); }}
              >
                {done ? 'Retry Exam' : 'Start Exam'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
