import React from 'react';
import { IconMicrophone2, IconSparkles, IconMusic, IconHeart } from '@tabler/icons-react';
import { CriterionInfo, CriterionKey } from '../types';
import { getHeatmapClass } from '../utils/colors';

interface ScoreSelectorProps {
  criterion: CriterionInfo;
  value: number | null;
  onChange: (value: number | null) => void;
}

const getIcon = (key: CriterionKey) => {
  switch (key) {
    case 'vocal': return <IconMicrophone2 size={18} />;
    case 'stage': return <IconSparkles size={18} />;
    case 'song': return <IconMusic size={18} />;
    case 'overall': return <IconHeart size={18} />;
  }
};

export const ScoreSelector: React.FC<ScoreSelectorProps> = ({ criterion, value, onChange }) => {
  const handleClick = (score: number) => {
    onChange(value === score ? null : score);
  };

  return (
    <div className="score-row">
      <div className="score-row__header">
        <div>
          <div className="score-row__title">
            <span style={{ color: 'var(--text-secondary)' }}>{getIcon(criterion.key)}</span>
            {criterion.labelUk}
          </div>
          <div className="score-row__desc">{criterion.description}</div>
        </div>
        <div className="score-row__status">
          {value !== null ? `${value} / 10` : '—'}
        </div>
      </div>
      <div className="score-row__buttons">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(score => {
          const isSelected = value === score;
          const heatClass = isSelected ? getHeatmapClass(score) : '';
          
          return (
            <button
              key={score}
              className={`score-btn ${heatClass}`}
              onClick={() => handleClick(score)}
              aria-label={`Оцінка ${score} для ${criterion.labelUk}`}
              aria-pressed={isSelected}
            >
              {score}
            </button>
          );
        })}
      </div>
    </div>
  );
};