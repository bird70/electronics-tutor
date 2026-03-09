import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { loadChallenges, loadLessons } from '@/services/content/contentRepository';
import { getHighestLevel, getRecommendedChallenge } from '@/domain/gamification/unlockRules';
import type { CircuitChallenge, Lesson } from '@/domain/learning/types';

/**
 * Progress dashboard showing learner stats, current level,
 * and recommended next challenge or lesson.
 */
export function ProgressDashboard() {
  const progress = useAppStore((s) => s.progress);
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<CircuitChallenge[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    loadChallenges().then(setChallenges);
    loadLessons().then(setLessons);
  }, []);

  const level = getHighestLevel(progress);
  const nextChallenge = getRecommendedChallenge(challenges, progress);
  const completedLessons = progress.completedLessonIds.length;
  const completedChallenges = progress.completedChallengeIds.length;
  const totalLessons = lessons.length;
  const totalChallenges = challenges.length;

  return (
    <div className="progress-dashboard">
      <h2>📊 Your Progress</h2>

      <div className="progress-dashboard__stats">
        <div className="stat-card">
          <span className="stat-card__value">{level}</span>
          <span className="stat-card__label">Current Level</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {completedLessons}/{totalLessons}
          </span>
          <span className="stat-card__label">Lessons Done</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {completedChallenges}/{totalChallenges}
          </span>
          <span className="stat-card__label">Challenges Won</span>
        </div>
      </div>

      {nextChallenge && (
        <div className="progress-dashboard__next">
          <h3>Recommended Next</h3>
          <div className="challenge-card challenge-card--unlocked">
            <div className="challenge-card__level">Lvl {nextChallenge.level}</div>
            <h4>{nextChallenge.title}</h4>
            <p>{nextChallenge.objectiveText}</p>
            <button
              className="btn btn--accent btn--sm"
              onClick={() => navigate(`/challenges?play=${nextChallenge.id}`)}
            >
              Play →
            </button>
          </div>
        </div>
      )}

      {!nextChallenge && completedChallenges > 0 && (
        <div className="progress-dashboard__next">
          <h3>🎉 All challenges completed!</h3>
          <p>Nice work — you've mastered all available levels.</p>
        </div>
      )}
    </div>
  );
}
