import { useState, useCallback, useEffect, useRef } from 'react';
import type { ExamPaper, ExamQuestion } from '@/domain/learning/types';

interface ExamPlayerProps {
  exam: ExamPaper;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

interface QuestionState {
  answer: string;
  selectedIndex: number | null;
  revealed: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function MCQuestion({
  question,
  state,
  onSelect,
  onReveal,
}: {
  question: ExamQuestion;
  state: QuestionState;
  onSelect: (i: number) => void;
  onReveal: () => void;
}) {
  return (
    <div className="exam-question exam-question--mc">
      <div className="exam-question__header">
        <span className="exam-question__marks">[{question.marks} mark{question.marks !== 1 ? 's' : ''}]</span>
        <span className="exam-question__type">Multiple Choice</span>
      </div>
      <p className="exam-question__text">{question.questionText}</p>
      <div className="exam-options">
        {question.options?.map((opt, i) => {
          let cls = 'exam-option';
          if (state.revealed) {
            if (i === question.correctIndex) cls += ' exam-option--correct';
            else if (i === state.selectedIndex) cls += ' exam-option--wrong';
          } else if (i === state.selectedIndex) {
            cls += ' exam-option--selected';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => onSelect(i)}
              disabled={state.revealed}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {state.selectedIndex !== null && !state.revealed && (
        <button className="btn btn--sm" onClick={onReveal}>
          Check Answer
        </button>
      )}
      {state.revealed && (
        <div className="exam-explanation">
          <strong>{state.selectedIndex === question.correctIndex ? '✅ Correct' : '❌ Incorrect'}:</strong>{' '}
          {question.explanation}
        </div>
      )}
    </div>
  );
}

function ShortQuestion({
  question,
  state,
  onChange,
  onReveal,
}: {
  question: ExamQuestion;
  state: QuestionState;
  onChange: (val: string) => void;
  onReveal: () => void;
}) {
  return (
    <div className="exam-question exam-question--short">
      <div className="exam-question__header">
        <span className="exam-question__marks">[{question.marks} mark{question.marks !== 1 ? 's' : ''}]</span>
        <span className="exam-question__type">Short Answer</span>
      </div>
      <p className="exam-question__text">{question.questionText}</p>
      <textarea
        className="exam-textarea"
        value={state.answer}
        onChange={(e) => onChange(e.target.value)}
        disabled={state.revealed}
        rows={3}
        placeholder="Write your answer here…"
      />
      {!state.revealed && (
        <button className="btn btn--sm" onClick={onReveal} disabled={!state.answer.trim()}>
          Reveal Model Answer
        </button>
      )}
      {state.revealed && (
        <div className="exam-explanation">
          <strong>Model Answer:</strong> {question.modelAnswer}
          <br />
          <em>{question.explanation}</em>
        </div>
      )}
    </div>
  );
}

/**
 * NCEA-style exam player.
 * Timed, shows questions, allows self-marking for short/long answers.
 */
export function ExamPlayer({ exam, onComplete, onBack }: ExamPlayerProps) {
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(() =>
    exam.questions.map(() => ({ answer: '', selectedIndex: null, revealed: false })),
  );
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exam.timeAllowedMinutes * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateState = useCallback(
    (index: number, patch: Partial<QuestionState>) => {
      setQuestionStates((prev) =>
        prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const handleFinish = useCallback(() => {
    clearInterval(timerRef.current!);
    setFinished(true);
    // Auto-reveal all answers
    setQuestionStates((prev) => prev.map((s) => ({ ...s, revealed: true })));
    // Calculate score for MC questions
    const score = exam.questions.reduce((acc, q, i) => {
      if (q.type === 'mc' && questionStates[i]?.selectedIndex === q.correctIndex) {
        return acc + q.marks;
      }
      return acc;
    }, 0);
    const total = exam.questions.filter((q) => q.type === 'mc').reduce((a, q) => a + q.marks, 0);
    onComplete(score, total);
  }, [exam.questions, questionStates, onComplete]);

  const allMCAnswered = exam.questions
    .filter((q) => q.type === 'mc')
    .every((q) => {
      const qi = exam.questions.indexOf(q);
      return questionStates[qi]?.selectedIndex !== null;
    });

  if (finished) {
    const mcScore = exam.questions.reduce((acc, q, i) => {
      if (q.type === 'mc' && questionStates[i]?.selectedIndex === q.correctIndex) {
        return acc + q.marks;
      }
      return acc;
    }, 0);
    const mcTotal = exam.questions.filter((q) => q.type === 'mc').reduce((a, q) => a + q.marks, 0);

    return (
      <div className="exam-complete">
        <h2>📝 Exam Complete</h2>
        <p className="exam-complete__standard">{exam.standard}</p>
        {mcTotal > 0 && (
          <p className="exam-complete__score">
            Multiple-choice score: <strong>{mcScore} / {mcTotal}</strong>
          </p>
        )}
        <p className="exam-complete__note">
          For short and extended answers, compare your responses against the model answers shown below.
        </p>
        <div className="exam-complete__questions">
          {exam.questions.map((q, i) => (
            <div key={q.id} className="exam-review">
              <p className="exam-review__q"><strong>Q{i + 1}.</strong> {q.questionText}</p>
              <p className="exam-review__answer">
                <strong>Model:</strong> {q.modelAnswer}
              </p>
            </div>
          ))}
        </div>
        <button className="btn" onClick={onBack}>← Back to Exams</button>
      </div>
    );
  }

  return (
    <div className="exam-player">
      <header className="exam-player__header">
        <button className="btn btn--sm" onClick={onBack}>← Back</button>
        <div className="exam-player__info">
          <h2>{exam.title}</h2>
          <span className="exam-player__standard">{exam.standard}</span>
        </div>
        <div className={`exam-timer ${timeLeft < 120 ? 'exam-timer--urgent' : ''}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </header>

      <div className="exam-player__instructions">
        <p>{exam.instructions}</p>
        <p>Total marks: <strong>{exam.totalMarks}</strong> · Time allowed: <strong>{exam.timeAllowedMinutes} minutes</strong></p>
      </div>

      <div className="exam-player__questions">
        {exam.questions.map((q, i) => {
          const state = questionStates[i]!;
          return (
            <div key={q.id} className="exam-question-wrapper">
              <span className="exam-question__number">Q{i + 1}</span>
              {q.type === 'mc' ? (
                <MCQuestion
                  question={q}
                  state={state}
                  onSelect={(idx) => updateState(i, { selectedIndex: idx })}
                  onReveal={() => updateState(i, { revealed: true })}
                />
              ) : (
                <ShortQuestion
                  question={q}
                  state={state}
                  onChange={(val) => updateState(i, { answer: val })}
                  onReveal={() => updateState(i, { revealed: true })}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="exam-player__actions">
        <button
          className="btn btn--accent"
          onClick={handleFinish}
        >
          ✅ Submit Exam
        </button>
        {!allMCAnswered && (
          <span className="exam-player__hint">You have unanswered questions.</span>
        )}
      </div>
    </div>
  );
}
