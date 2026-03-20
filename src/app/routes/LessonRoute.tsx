import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { getLessonById } from '@/services/content/contentRepository';
import { LessonPlayer } from '@/components/lesson/LessonPlayer';
import { ConceptCheck } from '@/components/lesson/ConceptCheck';
import type { Lesson } from '@/domain/learning/types';

type Phase = 'loading' | 'playing' | 'quiz' | 'done';

export function LessonRoute() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const setActiveLesson = useAppStore((s) => s.setActiveLesson);
  const completeLesson = useAppStore((s) => s.completeLesson);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    getLessonById(lessonId).then((l) => {
      if (l) {
        setLesson(l);
        setActiveLesson(l);
        setPhase('playing');
      } else {
        setPhase('done');
      }
    });
    return () => {
      setActiveLesson(null);
    };
  }, [lessonId, setActiveLesson]);

  const handleLessonComplete = useCallback(() => {
    if (lesson?.assessment) {
      setPhase('quiz');
    } else {
      if (lesson) completeLesson(lesson.id);
      setPhase('done');
    }
  }, [lesson, completeLesson]);

  const handleQuizComplete = useCallback(
    (score: number, total: number) => {
      setQuizScore({ score, total });
      if (lesson) completeLesson(lesson.id);
      setPhase('done');
    },
    [lesson, completeLesson],
  );

  if (phase === 'loading') {
    return <div className="loading">Loading lesson…</div>;
  }

  if (!lesson) {
    return (
      <div className="error-page">
        <h2>Lesson not found</h2>
        <p>The lesson &ldquo;{lessonId}&rdquo; could not be found.</p>
        <button className="btn" onClick={() => navigate('/learn')}>
          ← Back to Lesson Plans
        </button>
      </div>
    );
  }

  if (phase === 'playing') {
    return <LessonPlayer lesson={lesson} onComplete={handleLessonComplete} />;
  }

  if (phase === 'quiz' && lesson.assessment) {
    return <ConceptCheck assessment={lesson.assessment} onComplete={handleQuizComplete} />;
  }

  return (
    <div className="lesson-complete">
      <h2>🎉 Lesson Complete!</h2>
      <p>You finished: <strong>{lesson.title}</strong></p>
      {quizScore && (
        <p>Quiz score: {quizScore.score}/{quizScore.total}</p>
      )}
      <div className="lesson-complete__actions">
        <button className="btn" onClick={() => navigate('/learn')}>
          ← Back to Lesson Plans
        </button>
        <button className="btn btn--accent" onClick={() => navigate('/')}>
          Home
        </button>
      </div>
    </div>
  );
}
