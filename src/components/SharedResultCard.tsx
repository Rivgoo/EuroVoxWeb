import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { IconChevronRight } from '@tabler/icons-react';
import { RankedCountry } from '../types';
import { getHeatmapColor } from '../utils/colors';

interface SharedResultCardProps {
  shared: RankedCountry;
  local?: RankedCountry;
  isCompareMode: boolean;
  onClick: () => void;
}

export const SharedResultCard: React.FC<SharedResultCardProps> = ({ shared, local, isCompareMode, onClick }) => {
  const isTop3 = shared.rank <= 3;
  const medal = shared.rank === 1 ? '🥇' : shared.rank === 2 ? '🥈' : shared.rank === 3 ? '🥉' : shared.rank;
  const scoreColor = isTop3 ? 'var(--score-cyan)' : getHeatmapColor(shared.totalScore, 40);

  const hasLocalVote = local && local.votedCount > 0;
  const scoreDelta = hasLocalVote ? local.totalScore - shared.totalScore : 0;

  return (
    <button className="result-card" onClick={onClick}>
      <div className="result-card__rank" style={{ color: isTop3 ? 'var(--score-cyan)' : 'var(--text-secondary)' }}>
        {medal}
      </div>

      <div className="result-card__flag">
        <ReactCountryFlag 
          countryCode={shared.countryCode} 
          svg 
          style={{ 
            width: '36px', 
            height: '27px', 
            borderRadius: '4px', 
            objectFit: 'cover',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
          }} 
        />
      </div>

      <div className="result-card__info">
        <div className="card__country">{shared.country}</div>
        <div className="card__artist">{shared.artist}</div>
        
        {isCompareMode && (
          <div className="shared-card__local-rank">
            {hasLocalVote ? `Ваше місце: #${local.rank}` : 'Ви не оцінили'}
          </div>
        )}
      </div>

      <div className="shared-card__right">
        <div className="shared-card__score-block">
          <div className="shared-card__score-main" style={{ color: scoreColor }}>
            {shared.totalScore}
          </div>
          
          {isCompareMode && (
            <div className="shared-card__score-local">
              Ви: {hasLocalVote ? local.totalScore : '—'}
              {hasLocalVote && scoreDelta !== 0 && (
                <span className={`delta ${scoreDelta > 0 ? 'delta--pos' : 'delta--neg'}`}>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                </span>
              )}
            </div>
          )}
        </div>
        <IconChevronRight stroke={1.5} size={20} color="var(--text-muted)" />
      </div>
    </button>
  );
};