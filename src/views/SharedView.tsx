import React, { useState, useMemo } from 'react';
import { IconMicrophone2, IconHome } from '@tabler/icons-react';
import { Country, VoteStore } from '../types';
import { COUNTRIES } from '../data/countries';
import { SharedResultCard } from '../components/SharedResultCard';
import { SharedDetailModal } from '../components/SharedDetailModal';
import { calculateRanks } from '../utils/rank';

interface SharedViewProps {
  userName: string;
  sharedVotes: VoteStore;
  localVotes: VoteStore;
}

export const SharedView: React.FC<SharedViewProps> = ({ userName, sharedVotes, localVotes }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const hasLocalVotes = Object.keys(localVotes).length > 0;
  const [isCompareMode, setIsCompareMode] = useState(hasLocalVotes);

  // Використовуємо нову утиліту для розрахунку обох рейтингів
  const sharedRanked = useMemo(() => calculateRanks(sharedVotes), [sharedVotes]);
  const localRanked = useMemo(() => calculateRanks(localVotes), [localVotes]);

  const fullyVotedCount = Object.keys(sharedVotes).filter(id => {
    const s = sharedVotes[Number(id)];
    return s && s.vocal !== null && s.stage !== null && s.song !== null && s.overall !== null;
  }).length;

  const handleGoHome = () => {
    window.location.href = window.location.pathname; 
  };

  return (
    <div className="shared-page">
      <div className="app__bg-dynamic" />
      
      <header className="shared-header">
        <div className="shared-header__container">
          <div className="header__logo">
            <IconMicrophone2 size={24} color="var(--accent)" />
            <span>EURO</span><span>VOX</span>
          </div>
          <button className="shared-home-btn" onClick={handleGoHome}>
            <IconHome size={18} />
            <span>Мій рейтинг</span>
          </button>
        </div>
      </header>

      <main className="shared-main">
        <div className="shared-title-block">
          <h1 className="shared-title-block__main">Рейтинг від <span>{userName}</span></h1>
          <p className="shared-title-block__sub">Оцінено {fullyVotedCount} з {COUNTRIES.length} країн</p>
        </div>

        <div className="compare-control">
          <div className="compare-control__text">
            <strong>Режим порівняння</strong>
            <span>{hasLocalVotes ? 'Показувати ваші оцінки поруч' : 'Оцініть учасників, щоб порівнювати'}</span>
          </div>
          <label className={`toggle-switch ${!hasLocalVotes ? 'toggle-switch--disabled' : ''}`}>
            <input 
              type="checkbox" 
              checked={isCompareMode} 
              onChange={(e) => setIsCompareMode(e.target.checked)}
              disabled={!hasLocalVotes}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="view-list">
          {sharedRanked.map(sharedData => {
            const localData = localRanked.find(l => l.id === sharedData.id);
            return (
              <SharedResultCard
                key={sharedData.id}
                shared={sharedData}
                local={localData}
                isCompareMode={isCompareMode}
                onClick={() => setSelectedCountry(sharedData)}
              />
            );
          })}
        </div>
      </main>

      {selectedCountry && (
        <SharedDetailModal
          country={selectedCountry}
          authorName={userName}
          sharedScores={sharedVotes[selectedCountry.id] ?? { vocal: null, stage: null, song: null, overall: null }}
          localScores={localVotes[selectedCountry.id] ?? { vocal: null, stage: null, song: null, overall: null }}
          isCompareMode={isCompareMode}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
};