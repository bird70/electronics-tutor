import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChallengeBoard } from '@/components/challenge/ChallengeBoard';
import { ChallengePlayer } from '@/components/challenge/ChallengePlayer';
import { getChallengeById } from '@/services/content/contentRepository';
import { syncChallengeCompletion } from '@/services/persistence/progressSync';
import type { CircuitChallenge } from '@/domain/learning/types';
import type { ChallengeResult } from '@/domain/gamification/scoring';

export function ChallengeRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const playId = searchParams.get('play');
  const [activeChallenge, setActiveChallenge] = useState<CircuitChallenge | null>(null);

  useEffect(() => {
    if (playId) {
      getChallengeById(playId).then((c) => setActiveChallenge(c ?? null));
    } else {
      setActiveChallenge(null);
    }
  }, [playId]);

  const handleComplete = useCallback(
    (result: ChallengeResult) => {
      if (activeChallenge) {
        syncChallengeCompletion(result, activeChallenge.level);
      }
    },
    [activeChallenge],
  );

  const handleBack = useCallback(() => {
    setSearchParams({});
    setActiveChallenge(null);
  }, [setSearchParams]);

  if (activeChallenge) {
    return (
      <ChallengePlayer
        challenge={activeChallenge}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    );
  }

  return <ChallengeBoard />;
}
