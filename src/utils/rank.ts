import { RankedCountry, VoteStore, Scores } from '../types';
import { COUNTRIES } from '../data/countries';

const defaultScores: Scores = { vocal: null, stage: null, song: null, overall: null };

export function calculateRanks(votes: VoteStore): RankedCountry[] {
  const getScores = (countryId: number) => votes[countryId] ?? defaultScores;
  
  const getTotalScore = (countryId: number) => {
    const s = getScores(countryId);
    return (s.vocal ?? 0) + (s.stage ?? 0) + (s.song ?? 0) + (s.overall ?? 0);
  };
  
  const getVotedCount = (countryId: number) => {
    const s = getScores(countryId);
    return [s.vocal, s.stage, s.song, s.overall].filter(v => v !== null).length;
  };

  const withScores = COUNTRIES.map(c => ({
    ...c,
    scores: getScores(c.id),
    totalScore: getTotalScore(c.id),
    averageScore: getVotedCount(c.id) === 4 ? getTotalScore(c.id) / 4 : 0,
    votedCount: getVotedCount(c.id),
    rank: 0,
  }));

  withScores.sort((a, b) => {
    if (a.votedCount === 4 && b.votedCount < 4) return -1;
    if (b.votedCount === 4 && a.votedCount < 4) return 1;
    if (a.totalScore !== b.totalScore) return b.totalScore - a.totalScore;
    if (a.votedCount !== b.votedCount) return b.votedCount - a.votedCount;
    return a.performanceOrder - b.performanceOrder;
  });

  let currentRank = 1;
  withScores.forEach((c, i) => {
    if (i === 0) {
      c.rank = 1;
    } else {
      const prev = withScores[i - 1];
      if (c.totalScore === prev.totalScore && c.votedCount === prev.votedCount && c.votedCount === 4) {
        c.rank = prev.rank;
      } else {
        currentRank = i + 1;
        c.rank = currentRank;
      }
    }
  });

  return withScores;
}