import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { IconChevronRight, IconStarFilled } from '@tabler/icons-react';
import { Country, Scores } from '../types';
import { getHeatmapColor } from '../utils/colors';

interface ParticipantCardProps {
  country: Country;
  scores: Scores;
  votedCount: number;
  totalScore: number;
  onClick: () => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  country,
  votedCount,
  totalScore,
  onClick,
}) => {
  const isComplete = votedCount === 4;
  const isPartial = votedCount > 0 && votedCount < 4;
  const avg = isComplete ? (totalScore / 4) : null;

  const stateClass = isComplete ? 'card--voted' : isPartial ? 'card--partial' : '';
  const scoreColor = isComplete ? getHeatmapColor(totalScore, 40) : 'var(--text-muted)';

  return (
    <button className={`card ${stateClass}`} onClick={onClick}>
      <div className="card__order">
        {country.performanceOrder.toString().padStart(2, '0')}
      </div>

      <ReactCountryFlag 
        countryCode={country.countryCode} 
        svg 
        style={{ 
          width: '36px', 
          height: '27px', 
          borderRadius: '4px', 
          objectFit: 'cover',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
        }} 
      />

      <div className="card__info">
        <div className="card__country">{country.country}</div>
        <div className="card__artist">{country.artist}</div>
        <div className="card__song">{country.song}</div>
      </div>

      <div className="card__right">
        {isComplete ? (
          <div className="card__score-block">
            <div className="card__score-total" style={{ color: scoreColor }}>
              {totalScore}<span>/40</span>
            </div>
            {avg !== null && (
              <div className="card__score-avg">
                <IconStarFilled size={12} style={{ color: scoreColor }} />
                {avg.toFixed(1)}
              </div>
            )}
          </div>
        ) : isPartial ? (
          <div className="card__status-text card__status-text--partial">
            Частково ({votedCount}/4)
          </div>
        ) : (
          <div className="card__status-text card__status-text--empty">
            Оцінити
          </div>
        )}
        <IconChevronRight stroke={1.5} size={20} color="var(--text-muted)" />
      </div>
    </button>
  );
};