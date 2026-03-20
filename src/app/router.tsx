import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { LessonRoute } from './routes/LessonRoute';
import { LearningPathRoute } from './routes/LearningPathRoute';
import { ExamRoute } from './routes/ExamRoute';
import { HomePage } from './routes/HomePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="nav-bar">
          <Link to="/" className="nav-logo">⚛️ Mechanics Tutor</Link>
          <div className="nav-links">
            <NavLink to="/learn" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              Lesson Plans
            </NavLink>
            <NavLink to="/exams" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              Practice Exams
            </NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearningPathRoute />} />
            <Route path="/lesson/:lessonId" element={<LessonRoute />} />
            <Route path="/exams" element={<ExamRoute />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
