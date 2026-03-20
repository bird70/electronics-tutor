import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { loadChallenges } from '@/services/content/contentRepository';
import { getUnlockedChallenges, getHighestLevel } from '@/domain/gamification/unlockRules';
import type { CircuitChallenge } from '@/domain/learning/types';

/**
 * Level-gated challenge board showing all challenges sorted by level,
 * with locked/unlocked/completed states.
 */
export function ChallengeBoard() {
  const progress = useAppStore((s) => s.progress);
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<CircuitChallenge[]>([]);

  useEffect(() => {
    loadChallenges().then(setChallenges);
  }, []);

  const statuses = getUnlockedChallenges(challenges, progress);
  const highestLevel = getHighestLevel(progress);

  return (
    <div className="challenge-board">
      <div className="challenge-board__header">
        <h2>🏆 Challenge Board</h2>
        <span className="challenge-board__level">Level {highestLevel}</span>
      </div>

      {statuses.length === 0 && (
        <p>No challenges available yet. Complete some lessons first!</p>
      )}

      <div className="challenge-board__grid">
        {statuses
          .sort((a, b) => a.challenge.level - b.challenge.level)
          .map(({ challenge, status }) => (
            <div
              key={challenge.id}
              className={`challenge-card challenge-card--${status}`}
            >
              <div className="challenge-card__level">Lvl {challenge.level}</div>
              <h3 className="challenge-card__title">{challenge.title}</h3>
              <p className="challenge-card__objective">{challenge.objectiveText}</p>
              <div className="challenge-card__footer">
                {status === 'locked' && (
                  <span className="challenge-card__lock">🔒 Locked</span>
                )}
                {status === 'completed' && (
                  <span className="challenge-card__done">✅ Completed</span>
                )}
                {status === 'unlocked' && (
                  <button
                    className="btn btn--accent btn--sm"
                    onClick={() => navigate(`/challenges?play=${challenge.id}`)}
                  >
                    Play →
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
