import { useNavigate } from 'react-router-dom';
import { ConceptTagBadge } from '@/components/lesson/ConceptTagBadge';
import type { Lesson, LessonStatus, ReferenceResource } from '@/domain/learning/types';

interface LessonDetailProps {
  lesson: Lesson;
  status: LessonStatus;
  order: number;
  references?: ReferenceResource[];
}

/**
 * Detailed view of a single lesson within a learning path:
 * objectives, concept tags, reference links, and start button.
 */
export function LessonDetail({ lesson, status, order, references = [] }: LessonDetailProps) {
  const navigate = useNavigate();
  const isPlayable = status === 'available' || status === 'completed';

  const relevantRefs = references.filter((ref) =>
    ref.conceptTags.some((tag) => lesson.conceptTags.includes(tag)),
  );

  return (
    <div className={`lesson-detail lesson-detail--${status}`}>
      <div className="lesson-detail__header">
        <span className="lesson-detail__order">#{order}</span>
        <h3 className="lesson-detail__title">{lesson.title}</h3>
        {status === 'completed' && <span className="lesson-detail__check">✅</span>}
        {status === 'locked' && <span className="lesson-detail__lock">🔒</span>}
      </div>

      <div className="lesson-detail__tags">
        {lesson.conceptTags.map((tag) => (
          <ConceptTagBadge key={tag} tag={tag} />
        ))}
      </div>

      <p className="lesson-detail__intro">{lesson.introText}</p>

      <div className="lesson-detail__objectives">
        <h4>Learning Objectives</h4>
        <ul>
          {lesson.learningObjectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>

      {relevantRefs.length > 0 && (
        <div className="lesson-detail__references">
          <h4>📖 Further Reading</h4>
          <ul>
            {relevantRefs.map((ref) => (
              <li key={ref.id}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lesson-detail__ref-link"
                >
                  {ref.title}
                </a>
                <span className="lesson-detail__ref-type">{ref.type}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="lesson-detail__actions">
        {isPlayable && (
          <button
            className="btn btn--accent"
            onClick={() => navigate(`/lesson/${lesson.id}`)}
          >
            {status === 'completed' ? '🔁 Replay' : '▶️ Start Lesson'}
          </button>
        )}
        {status === 'locked' && (
          <p className="lesson-detail__locked-msg">
            Complete the previous lesson to unlock this one.
          </p>
        )}
      </div>
    </div>
  );
}
