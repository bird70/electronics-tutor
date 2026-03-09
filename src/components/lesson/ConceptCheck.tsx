import { useState, useCallback } from 'react';
import type { Assessment, AssessmentQuestion } from '@/domain/learning/types';

interface ConceptCheckProps {
  assessment: Assessment;
  onComplete: (score: number, total: number) => void;
}

/**
 * Post-lesson concept check quiz. Presents multiple-choice questions
 * and gives immediate feedback with explanations.
 */
export function ConceptCheck({ assessment, onComplete }: ConceptCheckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = assessment.questions.length;
  const question = assessment.questions[currentIndex];

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (revealed || !question) return;
      setSelectedOption(optionIndex);
      setRevealed(true);
      if (optionIndex === question.correctIndex) {
        setCorrectCount((c) => c + 1);
      }
    },
    [revealed, question],
  );

  const handleNext = useCallback(() => {
    if (!question) return;
    if (currentIndex + 1 >= total) {
      setFinished(true);
      onComplete(correctCount, total);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setRevealed(false);
    }
  }, [currentIndex, total, onComplete, correctCount, question]);

  if (finished) {
    return (
      <div className="concept-check concept-check--done">
        <h3>Quiz Complete!</h3>
        <p className="concept-check__score">
          You got <strong>{correctCount}</strong> out of <strong>{total}</strong> correct.
        </p>
        {correctCount === total ? (
          <p className="concept-check__msg">🎉 Perfect score! Great understanding.</p>
        ) : correctCount >= total * 0.5 ? (
          <p className="concept-check__msg">👍 Good effort! Review the concepts you missed.</p>
        ) : (
          <p className="concept-check__msg">📚 Consider revisiting the lesson before moving on.</p>
        )}
      </div>
    );
  }

  return (
    <div className="concept-check">
      <div className="concept-check__header">
        <h3>Concept Check</h3>
        <span>
          Question {currentIndex + 1} of {total}
        </span>
      </div>

      {question && (
        <QuestionCard
          question={question}
          selectedOption={selectedOption}
          revealed={revealed}
          onSelect={handleSelect}
        />
      )}

      {revealed && (
        <div className="concept-check__actions">
          <button className="btn btn--accent" onClick={handleNext}>
            {currentIndex + 1 >= total ? 'Finish Quiz' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  selectedOption,
  revealed,
  onSelect,
}: {
  question: AssessmentQuestion;
  selectedOption: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="concept-check__question">
      <p className="concept-check__text">{question.questionText}</p>
      <div className="concept-check__options">
        {question.options.map((option, i) => {
          let className = 'concept-check__option';
          if (revealed) {
            if (i === question.correctIndex) className += ' concept-check__option--correct';
            else if (i === selectedOption) className += ' concept-check__option--wrong';
          } else if (i === selectedOption) {
            className += ' concept-check__option--selected';
          }

          return (
            <button
              key={i}
              className={className}
              onClick={() => onSelect(i)}
              disabled={revealed}
            >
              {option}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="concept-check__explanation">
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}
