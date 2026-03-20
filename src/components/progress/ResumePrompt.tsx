import { useAppStore } from '@/state/store';
import { useNavigate } from 'react-router-dom';

export function ResumePrompt() {
  const lastSession = useAppStore((s) => s.progress.lastSessionState);
  const setLastSession = useAppStore((s) => s.setLastSession);
  const navigate = useNavigate();

  if (!lastSession) return null;

  const label =
    lastSession.type === 'lesson'
      ? `Continue lesson "${lastSession.id}"`
      : `Continue exam "${lastSession.id}"`;

  const handleResume = () => {
    if (lastSession.type === 'lesson') {
      navigate(`/lesson/${lastSession.id}`);
    } else {
      navigate(`/exams?play=${lastSession.id}`);
    }
  };

  const handleDismiss = () => {
    setLastSession(undefined);
  };

  return (
    <div className="resume-prompt">
      <div className="resume-prompt__card">
        <p className="resume-prompt__text">Welcome back! Pick up where you left off?</p>
        <p className="resume-prompt__label">{label}</p>
        <div className="resume-prompt__actions">
          <button className="btn btn--accent" onClick={handleResume}>
            Resume
          </button>
          <button className="btn btn--ghost" onClick={handleDismiss}>
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}
