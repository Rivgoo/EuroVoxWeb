import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactCountryFlag from 'react-country-flag';
import { IconX, IconCheck, IconChartPie } from '@tabler/icons-react';
import { Country, Scores, CriterionKey } from '../types';
import { CRITERIA } from '../data/countries';
import { ScoreSelector } from './ScoreSelector';
import { getHeatmapColor } from '../utils/colors';

interface VotingModalProps {
  country: Country;
  scores: Scores;
  onScoreChange: (criterion: CriterionKey, value: number | null) => void;
  onClose: () => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({ country, scores, onScoreChange, onClose }) => {
  const votedCount = [scores.vocal, scores.stage, scores.song, scores.overall].filter(v => v !== null).length;
  const totalScore = (scores.vocal ?? 0) + (scores.stage ?? 0) + (scores.song ?? 0) + (scores.overall ?? 0);
  const isComplete = votedCount === 4;

  const scoreColor = isComplete ? getHeatmapColor(totalScore, 40) : 'var(--text-primary)';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-body">
          
          <div className="modal-header">
            <div className="modal-hero">
              <ReactCountryFlag 
                countryCode={country.countryCode} 
                svg 
                style={{ 
                  width: '48px', 
                  height: '36px', 
                  borderRadius: '4px', 
                  objectFit: 'cover',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                  flexShrink: 0
                }} 
              />
              <div className="modal-hero__text">
                <h2 className="modal-hero__title">{country.country}</h2>
                <p className="modal-hero__subtitle">
                  {country.artist} — <span style={{ fontStyle: 'italic' }}>{country.song}</span>
                </p>
              </div>
            </div>
            
            <button className="modal-close" onClick={onClose} aria-label="Закрити">
              <IconX stroke={1.5} size={20} />
            </button>
          </div>

          <div className="yt-container">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${country.youtubeId}?rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="modal-summary">
            <div className="modal-summary__left">
              <div className={`modal-summary__icon ${isComplete ? 'modal-summary__icon--complete' : ''}`}>
                {isComplete ? <IconCheck stroke={2} size={24} /> : <IconChartPie stroke={1.5} size={24} />}
              </div>
              <div className="modal-summary__text">
                Оцінено: <strong>{votedCount}</strong> з 4
              </div>
            </div>
            
            <div className="modal-summary__divider" />

            <div className="modal-summary__right">
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Загальний бал</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: scoreColor }}>
                {totalScore} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>/40</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CRITERIA.map(c => (
              <ScoreSelector
                key={c.key}
                criterion={c}
                value={scores[c.key]}
                onChange={(val) => onScoreChange(c.key, val)}
              />
            ))}
          </div>
        </div>

        <div className="modal-footer">
          {isComplete ? (
            <button className="btn-primary" onClick={onClose}>
              <IconCheck size={20} /> Зберегти та закрити
            </button>
          ) : (
            <>
              <div className="modal-footer__text">
                Залишилось оцінити: <strong>{4 - votedCount}</strong>
              </div>
              <button className="btn-secondary" onClick={onClose}>
                Закрити
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    modalRoot
  );
};