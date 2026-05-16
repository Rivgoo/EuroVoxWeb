import React from 'react';
import { IconList, IconTrophy, IconTrash, IconMicrophone2 } from '@tabler/icons-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  fullyVotedCount: number;
  totalCountries: number;
  onResetClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  fullyVotedCount,
  totalCountries,
  onResetClick,
}) => {
  const progress = (fullyVotedCount / totalCountries) * 100;

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__top">
          <div className="header__logo">
            <IconMicrophone2 size={24} color="var(--accent)" />
            <span>EURO</span><span>VOX</span>
          </div>

          <div className="header__right">
            <div className="header__progress" title={`Оцінено ${fullyVotedCount} з ${totalCountries}`}>
              <div className="header__progress-text">
                {fullyVotedCount}<span>/{totalCountries}</span>
              </div>
              <div className="header__progress-bar-bg">
                <div
                  className="header__progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              className="header__reset-btn"
              onClick={onResetClick}
              title="Очистити всі оцінки"
              aria-label="Очистити всі оцінки"
            >
              <IconTrash stroke={1.5} size={18} />
            </button>
          </div>
        </div>

        <nav className="header__tabs">
          <button
            className={`header__tab ${activeTab === 'participants' ? 'header__tab--active' : ''}`}
            onClick={() => onTabChange('participants')}
          >
            <IconList stroke={1.5} size={18} />
            Учасники
          </button>
          <button
            className={`header__tab ${activeTab === 'results' ? 'header__tab--active' : ''}`}
            onClick={() => onTabChange('results')}
          >
            <IconTrophy stroke={1.5} size={18} />
            Результати
          </button>
          <div
            className="header__tab-indicator"
            style={{ transform: activeTab === 'results' ? 'translateX(100%)' : 'translateX(0)' }}
          />
        </nav>
      </div>
    </header>
  );
};