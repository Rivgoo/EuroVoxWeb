import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactCountryFlag from 'react-country-flag';
import { IconX, IconMicrophone2, IconSparkles, IconMusic, IconHeart } from '@tabler/icons-react';
import { Country, Scores, CriterionKey } from '../types';
import { CRITERIA } from '../data/countries';
import { getHeatmapColor } from '../utils/colors';

interface SharedDetailModalProps {
  country: Country;
  authorName: string;
  sharedScores: Scores;
  localScores: Scores;
  isCompareMode: boolean;
  onClose: () => void;
}

const getIcon = (key: CriterionKey) => {
  switch (key) {
    case 'vocal': return <IconMicrophone2 size={18} />;
    case 'stage': return <IconSparkles size={18} />;
    case 'song': return <IconMusic size={18} />;
    case 'overall': return <IconHeart size={18} />;
  }
};

export const SharedDetailModal: React.FC<SharedDetailModalProps> = ({ 
  country, authorName, sharedScores, localScores, isCompareMode, onClose 
}) => {
  const sharedTotal = (sharedScores.vocal ?? 0) + (sharedScores.stage ?? 0) + (sharedScores.song ?? 0) + (sharedScores.overall ?? 0);
  const sharedColor = getHeatmapColor(sharedTotal, 40);

  const localTotal = (localScores.vocal ?? 0) + (localScores.stage ?? 0) + (localScores.song ?? 0) + (localScores.overall ?? 0);
  const localColor = localTotal > 0 ? getHeatmapColor(localTotal, 40) : 'var(--text-muted)';

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

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="modal-body">
          
          <div className="modal-header">
            <div className="modal-hero">
              <ReactCountryFlag 
                countryCode={country.countryCode} 
                svg 
                style={{ 
                  width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', flexShrink: 0
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
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${country.youtubeId}?rel=0`}
              title="YouTube video player" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="shared-score-split">
            <div className="shared-score-split__box">
              <div className="shared-score-split__label">Оцінка {authorName}</div>
              <div className="shared-score-split__value" style={{ color: sharedColor }}>
                {sharedTotal}<span>/40</span>
              </div>
            </div>
            
            {isCompareMode && (
              <>
                <div className="shared-score-split__divider" />
                <div className="shared-score-split__box">
                  <div className="shared-score-split__label">Ваша оцінка</div>
                  <div className="shared-score-split__value" style={{ color: localColor }}>
                    {localTotal > 0 ? localTotal : '—'}<span>/40</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="shared-bars-container">
            {CRITERIA.map(c => {
              const sVal = sharedScores[c.key];
              const sPct = sVal !== null ? (sVal / 10) * 100 : 0;
              const sColor = sVal !== null ? getHeatmapColor(sVal, 10) : 'var(--bg-elevated)';

              const lVal = localScores[c.key];
              const lPct = lVal !== null ? (lVal / 10) * 100 : 0;
              const lColor = lVal !== null ? getHeatmapColor(lVal, 10) : 'transparent';

              return (
                <div key={c.key} className="score-bar-row">
                  <div className="score-bar-label">
                    <span style={{ color: 'var(--text-secondary)' }}>{getIcon(c.key)}</span>
                    {c.labelUk}
                  </div>
                  
                  <div className="score-bar-dual">
                    <div className="score-bar-dual__info">
                      <span className="score-bar-dual__name">{authorName}</span>
                      <span className="score-bar-dual__val">{sVal !== null ? `${sVal}/10` : '—'}</span>
                    </div>
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{ width: `${sPct}%`, backgroundColor: sColor }} />
                    </div>
                  </div>

                  {isCompareMode && (
                    <div className="score-bar-dual score-bar-dual--local">
                      <div className="score-bar-dual__info">
                        <span className="score-bar-dual__name">Ви</span>
                        <span className="score-bar-dual__val">{lVal !== null ? `${lVal}/10` : '—'}</span>
                      </div>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{ width: `${lPct}%`, backgroundColor: lColor }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={onClose} style={{ width: '100%' }}>
            Закрити
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};