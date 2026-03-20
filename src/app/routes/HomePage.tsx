import { Link } from 'react-router-dom';
import { ResumePrompt } from '@/components/progress/ResumePrompt';
import { useAppStore } from '@/state/store';

export function HomePage() {
  const progress = useAppStore((s) => s.progress);
  const completedLessons = progress.completedLessonIds.length;
  const completedChallenges = progress.completedChallengeIds.length;

  return (
    <div className="home-page">
      <ResumePrompt />

      <section className="hero">
        <h1 className="hero__title">Learn Electronics by Building</h1>
        <p className="hero__subtitle">
          Assemble circuits, explore voltage and resistance, and level up your
          understanding — all at your own pace.
        </p>
        <div className="hero__actions">
          <Link to="/learn" className="btn btn--accent btn--lg">
            Start a Lesson Plan
          </Link>
          <Link to="/challenges" className="btn btn--outline btn--lg">
            Try a Challenge
          </Link>
        </div>
      </section>

      <section className="stats-strip">
        <div className="stat-card">
          <span className="stat-card__value">{completedLessons}</span>
          <span className="stat-card__label">Lessons Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{completedChallenges}</span>
          <span className="stat-card__label">Challenges Beaten</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{Math.max(...progress.unlockedLevels)}</span>
          <span className="stat-card__label">Current Level</span>
        </div>
      </section>
    </div>
  );
}
