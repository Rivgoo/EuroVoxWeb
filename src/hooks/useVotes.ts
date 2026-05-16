import { useState, useCallback } from 'react';
import { VoteStore, CriterionKey, Scores } from '../types';

const STORAGE_KEY = 'eurovox_votes_2026';

const defaultScores = (): Scores => ({
  vocal: null,
  stage: null,
  song: null,
  overall: null,
});

function loadFromStorage(): VoteStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as VoteStore;
  } catch {
    return {};
  }
}

function saveToStorage(store: VoteStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage errors
  }
}

export function useVotes() {
  const [votes, setVotes] = useState<VoteStore>(loadFromStorage);

  const getScores = useCallback((countryId: number): Scores => {
    return votes[countryId] ?? defaultScores();
  }, [votes]);

  const setScore = useCallback((countryId: number, criterion: CriterionKey, value: number | null) => {
    setVotes(prev => {
      const current = prev[countryId] ?? defaultScores();
      const updated: VoteStore = {
        ...prev,
        [countryId]: { ...current, [criterion]: value },
      };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearScore = useCallback((countryId: number, criterion: CriterionKey) => {
    setScore(countryId, criterion, null);
  }, [setScore]);

  const clearAllVotes = useCallback(() => {
    setVotes({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const getTotalScore = useCallback((countryId: number): number => {
    const s = getScores(countryId);
    return (s.vocal ?? 0) + (s.stage ?? 0) + (s.song ?? 0) + (s.overall ?? 0);
  }, [getScores]);

  const getVotedCount = useCallback((countryId: number): number => {
    const s = getScores(countryId);
    return [s.vocal, s.stage, s.song, s.overall].filter(v => v !== null).length;
  }, [getScores]);

  const isFullyVoted = useCallback((countryId: number): boolean => {
    return getVotedCount(countryId) === 4;
  }, [getVotedCount]);

  const fullyVotedCountries = Object.entries(votes).filter(([, s]) =>
    s.vocal !== null && s.stage !== null && s.song !== null && s.overall !== null
  ).length;

  return {
    votes,
    getScores,
    setScore,
    clearScore,
    clearAllVotes,
    getTotalScore,
    getVotedCount,
    isFullyVoted,
    fullyVotedCountries,
  };
}