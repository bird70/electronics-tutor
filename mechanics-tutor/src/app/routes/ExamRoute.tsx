import { useEffect, useState } from 'react'
import { loadExamPapers } from '@/services/content/contentRepository'
import { ExamPlayer } from '@/components/exam/ExamPlayer'
import type { ExamPaper } from '@/domain/learning/types'

export function ExamRoute() {
  const [exams, setExams] = useState<ExamPaper[]>([])
  const [selected, setSelected] = useState<ExamPaper | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExamPapers().then((e) => { setExams(e); setLoading(false) })
  }, [])

  if (loading) return <div className="loading">Loading exams…</div>

  if (selected) {
    return (
      <div className="exam-route">
        <button className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setSelected(null)}>← Back to Exams</button>
        <ExamPlayer exam={selected} />
      </div>
    )
  }

  return (
    <div className="exam-route">
      <h1>Practice Exams</h1>
      <div className="exam-list">
        {exams.map((exam) => (
          <div key={exam.id} className="exam-card" onClick={() => setSelected(exam)}>
            <div className="exam-card__title">{exam.title}</div>
            <div className="exam-card__meta">
              <span>📋 {exam.standard}</span>
              <span>🏆 {exam.totalMarks} marks</span>
              <span>⏱ {exam.timeAllowedMinutes} min</span>
            </div>
          </div>
        ))}
        {exams.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No exams available.</p>}
      </div>
    </div>
  )
}
