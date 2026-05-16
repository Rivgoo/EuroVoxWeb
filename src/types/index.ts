export interface Country {
  id: number;
  performanceOrder: number;
  countryCode: string;
  country: string;
  artist: string;
  song: string;
  youtubeId: string;
}

export type CriterionKey = 'vocal' | 'stage' | 'song' | 'overall';

export interface Scores {
  vocal: number | null;
  stage: number | null;
  song: number | null;
  overall: number | null;
}

export interface VoteStore {
  [countryId: number]: Scores;
}

export interface CriterionInfo {
  key: CriterionKey;
  labelUk: string;
  labelEn: string;
  description: string;
}

export type TabType = 'participants' | 'results';

export interface RankedCountry extends Country {
  scores: Scores;
  totalScore: number;
  averageScore: number;
  votedCount: number;
  rank: number;
}