import { useState } from 'react'
import type { ExamPaper, ExamQuestion } from '@/domain/learning/types'
import { useAppStore } from '@/state/store'

interface Props {
  exam: ExamPaper
}

type Answer = string | number | null

interface QuestionResult {
  question: ExamQuestion
  answer: Answer
  marksEarned: number
}

function isCorrect(q: ExamQuestion, answer: Answer): boolean {
  if (q.type === 'mc') return answer === q.correctIndex
  return false
}

export function ExamPlayer({ exam }: Props) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [submitted, setSubmitted] = useState(false)
  const completeExam = useAppStore((s) => s.completeExam)

  const setAnswer = (id: string, value: Answer) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    completeExam(exam.id)
  }

  const results: QuestionResult[] = exam.questions.map((q) => {
    const answer = answers[q.id] ?? null
    const marksEarned = q.type === 'mc' && isCorrect(q, answer) ? q.marks : 0
    return { question: q, answer, marksEarned }
  })

  const totalEarned = results.reduce((sum, r) => sum + r.marksEarned, 0)

  return (
    <div className="exam-player">
      <div className="exam-player__header">
        <h2>{exam.title}</h2>
        <div className="exam-player__meta">
          <span>📋 {exam.standard}</span>
          <span>🏆 {exam.totalMarks} marks</span>
          <span>⏱ {exam.timeAllowedMinutes} min</span>
        </div>
      </div>

      <div className="exam-player__instructions">{exam.instructions}</div>

      {exam.questions.map((q, qi) => (
        <div key={q.id} className="exam-question">
          <p className="exam-question__prompt">Q{qi + 1}. {q.questionText}</p>
          <p className="exam-question__marks">[{q.marks} mark{q.marks !== 1 ? 's' : ''}]</p>

          {q.type === 'mc' && q.options && (
            <div className="exam-options">
              {q.options.map((opt, i) => (
                <label key={i} className="exam-option">
                  <input
                    type="radio"
                    name={q.id}
                    value={i}
                    checked={answers[q.id] === i}
                    onChange={() => setAnswer(q.id, i)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {(q.type === 'short' || q.type === 'long') && (
            <textarea
              className="exam-textarea"
              rows={q.type === 'long' ? 6 : 3}
              value={typeof answers[q.id] === 'string' ? (answers[q.id] as string) : ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              disabled={submitted}
              placeholder="Write your answer here…"
            />
          )}
        </div>
      ))}

      {!submitted && (
        <button className="btn btn--accent" onClick={handleSubmit}>
          Submit Exam
        </button>
      )}

      {submitted && (
        <div className="exam-result">
          <h3>Results</h3>
          <div className="exam-result__score">{totalEarned} / {exam.totalMarks}</div>
          <div className="exam-result__breakdown">
            {results.map((r, i) => (
              <div
                key={r.question.id}
                className={`exam-result__item ${r.question.type === 'mc' ? (r.marksEarned > 0 ? 'exam-result__item--correct' : 'exam-result__item--wrong') : ''}`}
              >
                <strong>Q{i + 1}.</strong>{' '}
                {r.question.type === 'mc'
                  ? r.marksEarned > 0 ? `✓ Correct (+${r.marksEarned})` : '✗ Incorrect (0)'
                  : `Written answer — see model answer`}
                <div className="exam-result__model-answer">
                  <em>Model answer:</em> {r.question.modelAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
