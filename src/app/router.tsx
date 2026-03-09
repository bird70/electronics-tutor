import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LessonRoute } from './routes/LessonRoute';
import { LearningPathRoute } from './routes/LearningPathRoute';
import { ChallengeRoute } from './routes/ChallengeRoute';
import { HomePage } from './routes/HomePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="nav-bar">
          <Link to="/" className="nav-logo">⚡ Electronics Tutor</Link>
          <div className="nav-links">
            <Link to="/learn">Lesson Plans</Link>
            <Link to="/challenges">Challenges</Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearningPathRoute />} />
            <Route path="/lesson/:lessonId" element={<LessonRoute />} />
            <Route path="/challenges" element={<ChallengeRoute />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
