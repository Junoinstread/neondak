'use client';

import { useState } from 'react';

type VoteType = 'agree' | 'disagree';

type VoteCounts = Record<VoteType, number>;

const voteLabels: Record<VoteType, string> = {
  agree: '인정',
  disagree: '노인정',
};

export default function VoteButtons() {
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({
    agree: 0,
    disagree: 0,
  });

  function handleVote(nextVote: VoteType) {
    setVoteCounts((currentCounts) => {
      if (selectedVote === nextVote) {
        return currentCounts;
      }

      return {
        agree:
          currentCounts.agree +
          (nextVote === 'agree' ? 1 : 0) -
          (selectedVote === 'agree' ? 1 : 0),
        disagree:
          currentCounts.disagree +
          (nextVote === 'disagree' ? 1 : 0) -
          (selectedVote === 'disagree' ? 1 : 0),
      };
    });
    setSelectedVote(nextVote);
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {(['agree', 'disagree'] as const).map((voteType) => {
        const isSelected = selectedVote === voteType;

        return (
          <button
            key={voteType}
            type="button"
            onClick={() => handleVote(voteType)}
            aria-pressed={isSelected}
            className={[
              'rounded-2xl py-4 text-base font-black transition active:scale-[0.98]',
              isSelected
                ? 'bg-fuchsia-400 text-zinc-950 shadow-lg shadow-fuchsia-950/40'
                : 'border border-white/15 bg-white/10 text-white',
            ].join(' ')}
          >
            <span className="block">{voteLabels[voteType]}</span>
            <span className="mt-1 block text-sm font-bold opacity-80">
              {voteCounts[voteType]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
