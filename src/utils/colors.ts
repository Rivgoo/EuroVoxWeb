export function getHeatmapColor(score: number, max: number = 10): string {
  if (score === 0) return 'var(--text-muted)';
  
  const ratio = score / max;
  
  if (ratio <= 0.35) return 'var(--score-red)';
  if (ratio <= 0.65) return 'var(--score-yellow)';
  if (ratio <= 0.85) return 'var(--score-orange)';
  if (ratio < 1.0) return 'var(--accent)';
  
  return 'var(--score-cyan)'; // Perfect 10 (or 40)
}

export function getHeatmapClass(score: number, max: number = 10): string {
  const ratio = score / max;
  
  if (ratio <= 0.35) return 'score-btn--red';
  if (ratio <= 0.65) return 'score-btn--yellow';
  if (ratio <= 0.85) return 'score-btn--orange';
  if (ratio < 1.0) return 'score-btn--accent';
  
  return 'score-btn--cyan'; // Perfect 10
}