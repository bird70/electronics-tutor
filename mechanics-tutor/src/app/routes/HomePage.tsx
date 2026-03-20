import { Link } from 'react-router-dom'
import { ResumePrompt } from '@/components/progress/ResumePrompt'
import { useAppStore } from '@/state/store'

export function HomePage() {
  const progress = useAppStore((s) => s.progress)
  const completedLessons = progress.completedLessonIds.length
  const completedExams = progress.completedExamIds.length

  return (
    <div className="home-page">
      <ResumePrompt />

      <section className="hero">
        <h1 className="hero__title">Master NZ NCEA Level 3 Mechanics</h1>
        <p className="hero__subtitle">
          Explore kinematics, circular motion, rotational dynamics, and simple harmonic motion
          through interactive simulations and structured lesson plans — all at your own pace.
        </p>
        <div className="hero__actions">
          <Link to="/learn" className="btn btn--accent btn--lg">
            Start a Lesson Plan
          </Link>
          <Link to="/exams" className="btn btn--outline btn--lg">
            Practice Exams
          </Link>
        </div>
      </section>

      <section className="stats-strip">
        <div className="stat-card">
          <span className="stat-card__value">{completedLessons}</span>
          <span className="stat-card__label">Lessons Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{completedExams}</span>
          <span className="stat-card__label">Exams Attempted</span>
        </div>
      </section>

      <section className="topics-strip">
        <h2>Topics Covered</h2>
        <div className="topics-grid">
          {[
            { emoji: '📐', title: 'Kinematics', desc: 'SUVAT equations, displacement, velocity & acceleration' },
            { emoji: '🏀', title: 'Projectile Motion', desc: '2D motion under gravity' },
            { emoji: '⭕', title: 'Circular Motion', desc: 'Centripetal force, angular velocity & period' },
            { emoji: '🔄', title: 'Rotational Dynamics', desc: 'Torque, moment of inertia & angular momentum' },
            { emoji: '🔁', title: 'Simple Harmonic Motion', desc: 'Pendulums, springs & energy in SHM' },
            { emoji: '💥', title: 'Momentum & Impulse', desc: 'Conservation of momentum & collisions' },
          ].map((t) => (
            <div key={t.title} className="topic-card">
              <span className="topic-card__emoji">{t.emoji}</span>
              <h3 className="topic-card__title">{t.title}</h3>
              <p className="topic-card__desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
