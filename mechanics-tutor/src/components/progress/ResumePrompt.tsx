import { Link } from 'react-router-dom'
import { useAppStore } from '@/state/store'

export function ResumePrompt() {
  const lastSession = useAppStore((s) => s.progress.lastSessionState)

  if (!lastSession) return null

  const to = lastSession.type === 'lesson' ? `/lesson/${lastSession.id}` : '/exams'
  const label = lastSession.type === 'lesson' ? `lesson: ${lastSession.id}` : 'practice exam'

  return (
    <div className="resume-prompt">
      <span>📚 Continue where you left off?</span>
      <Link to={to}>Resume {label} →</Link>
    </div>
  )
}
