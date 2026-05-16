import React, { useState, useMemo } from 'react';
import { pdf } from '@react-pdf/renderer';
import { IconDownload, IconShare } from '@tabler/icons-react';
import { Country, CriterionKey, VoteStore, Scores } from '../types';
import { COUNTRIES } from '../data/countries';
import { ResultCard } from '../components/ResultCard';
import { VotingModal } from '../components/VotingModal';
import { PdfReport } from '../components/PdfReport';
import { ExportModal } from '../components/ExportModal';
import { ShareModal } from '../components/ShareModal';
import { encodeShareData } from '../utils/share';
import { calculateRanks } from '../utils/rank';

interface ResultsViewProps {
  votes: VoteStore;
  getScores: (countryId: number) => Scores;
  setScore: (countryId: number, criterion: CriterionKey, value: number | null) => void;
  fullyVotedCount: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  votes,
  getScores,
  setScore,
  fullyVotedCount,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const ranked = useMemo(() => calculateRanks(votes), [votes]);

  const handleExport = async (userName: string) => {
    const doc = <PdfReport ranked={ranked} userName={userName} />;
    const blob = await pdf(doc).toBlob();
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
    
    const safeName = userName.replace(/[^a-zA-Zа-яА-Я0-9іІїЇєЄ]/g, '_').substring(0, 30);
    const fileName = `EuroVox_${safeName}_${timestamp}.pdf`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
  };

  const handleGenerateShareLink = (userName: string): string => {
    const encoded = encodeShareData(userName, votes);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?s=${encoded}`;
  };

  return (
    <div>
      <div className="results-header">
        <div className="results-header__text">
          <h2 className="results-title">Рейтинг</h2>
          <p className="results-subtitle">
            {fullyVotedCount === COUNTRIES.length
              ? `Усі ${COUNTRIES.length} країн оцінено`
              : `Оцінено ${fullyVotedCount} з ${COUNTRIES.length}`}
          </p>
        </div>

        <div className="results-header__actions">
          <button 
            className="action-btn action-btn--primary" 
            onClick={() => setShowShareModal(true)}
            disabled={fullyVotedCount === 0}
          >
            <IconShare stroke={1.5} size={18} />
            <span>Поділитися</span>
          </button>
          <button 
            className="action-btn" 
            onClick={() => setShowExportModal(true)}
            disabled={fullyVotedCount === 0}
          >
            <IconDownload stroke={1.5} size={18} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {fullyVotedCount === 0 ? (
        <div className="empty-state">
          <p>Оцініть хоча б одну країну повністю, щоб побачити свій рейтинг.</p>
        </div>
      ) : (
        <div className="view-list">
          {ranked.map(r => (
            <ResultCard
              key={r.id}
              ranked={r}
              onClick={() => setSelectedCountry(r)}
            />
          ))}
        </div>
      )}

      {selectedCountry && (
        <VotingModal
          country={selectedCountry}
          scores={getScores(selectedCountry.id)}
          onScoreChange={(crit, val) => setScore(selectedCountry.id, crit, val)}
          onClose={() => setSelectedCountry(null)}
        />
      )}

      {showExportModal && (
        <ExportModal
          onConfirm={handleExport}
          onCancel={() => setShowExportModal(false)}
        />
      )}

      {showShareModal && (
        <ShareModal
          onGenerate={handleGenerateShareLink}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};