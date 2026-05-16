import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { IconChevronRight, IconStarFilled, IconMicrophone2, IconSparkles, IconMusic, IconHeart } from '@tabler/icons-react';
import { RankedCountry } from '../types';
import { getHeatmapColor } from '../utils/colors';

interface ResultCardProps {
  ranked: RankedCountry;
  onClick: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ ranked, onClick }) => {
  const isTop3 = ranked.rank <= 3;
  const isFullyVoted = ranked.votedCount === 4;

  const medal = ranked.rank === 1 ? '🥇' : ranked.rank === 2 ? '🥈' : ranked.rank === 3 ? '🥉' : ranked.rank;
  
  const scoreColor = isTop3 ? 'var(--score-cyan)' : getHeatmapColor(ranked.totalScore, 40);

  return (
    <button
      className="result-card"
      onClick={onClick}
      style={{ opacity: isFullyVoted ? 1 : 0.6 }}
    >
      <div className="result-card__rank" style={{ color: isTop3 ? 'var(--score-cyan)' : 'var(--text-secondary)' }}>
        {medal}
      </div>

      <div className="result-card__flag">
        <ReactCountryFlag 
          countryCode={ranked.countryCode} 
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
        <div className="card__country">{ranked.country}</div>
        <div className="card__artist">{ranked.artist}</div>
      </div>

      <div className="result-card__badges">
        <div className="badge">
          <IconMicrophone2 size={14} /> Вокал: <span>{ranked.scores.vocal ?? '-'}</span>
        </div>
        <div className="badge">
          <IconSparkles size={14} /> Шоу: <span>{ranked.scores.stage ?? '-'}</span>
        </div>
        <div className="badge">
          <IconMusic size={14} /> Пісня: <span>{ranked.scores.song ?? '-'}</span>
        </div>
        <div className="badge">
          <IconHeart size={14} /> Загальне: <span>{ranked.scores.overall ?? '-'}</span>
        </div>
      </div>

      <div className="result-card__right">
        {isFullyVoted ? (
          <div className="card__score-block">
            <div className="card__score-total" style={{ color: scoreColor }}>
              {ranked.totalScore}<span>/40</span>
            </div>
            <div className="card__score-avg">
              <IconStarFilled size={12} style={{ color: scoreColor }} />
              {ranked.averageScore.toFixed(1)}
            </div>
          </div>
        ) : (
          <div className="card__status-text card__status-text--empty" style={{ opacity: 0.7 }}>
            {ranked.votedCount > 0 ? `${ranked.votedCount}/4` : '—'}
          </div>
        )}
        <IconChevronRight stroke={1.5} size={20} color="var(--text-muted)" />
      </div>
    </button>
  );
};