import { VoteStore } from '../types';

export function encodeShareData(userName: string, votes: VoteStore): string {
  const parts: string[] = [];
  
  for (const [idStr, s] of Object.entries(votes)) {
    const v = s.vocal ?? '';
    const st = s.stage ?? '';
    const so = s.song ?? '';
    const o = s.overall ?? '';
    
    if (v !== '' || st !== '' || so !== '' || o !== '') {
      parts.push(`${idStr}:${v},${st},${so},${o}`);
    }
  }
  
  const raw = `${userName}|${parts.join('-')}`;

  return btoa(encodeURIComponent(raw));
}


export function decodeShareData(encoded: string): { userName: string, votes: VoteStore } | null {
  try {
    const raw = decodeURIComponent(atob(encoded));
    const splitIdx = raw.indexOf('|');
    
    if (splitIdx === -1) return null;
    
    const userName = raw.slice(0, splitIdx);
    const votesStr = raw.slice(splitIdx + 1);
    const votes: VoteStore = {};
    
    if (votesStr) {
      const countryParts = votesStr.split('-');
      for (const cp of countryParts) {
        const [id, scores] = cp.split(':');
        if (id && scores) {
          const [v, st, so, o] = scores.split(',');
          votes[Number(id)] = {
            vocal: v !== '' ? Number(v) : null,
            stage: st !== '' ? Number(st) : null,
            song: so !== '' ? Number(so) : null,
            overall: o !== '' ? Number(o) : null,
          };
        }
      }
    }
    
    return { userName, votes };
  } catch {
    return null;
  }
}