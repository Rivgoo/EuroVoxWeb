import React, { useState, useMemo } from 'react';
import { pdf } from '@react-pdf/renderer';
import { IconDownload } from '@tabler/icons-react';
import { Country, CriterionKey, RankedCountry, Scores } from '../types';
import { COUNTRIES } from '../data/countries';
import { ResultCard } from '../components/ResultCard';
import { VotingModal } from '../components/VotingModal';
import { PdfReport } from '../components/PdfReport';
import { ExportModal } from '../components/ExportModal';

interface ResultsViewProps {
  getScores: (countryId: number) => Scores;
  getVotedCount: (countryId: number) => number;
  getTotalScore: (countryId: number) => number;
  setScore: (countryId: number, criterion: CriterionKey, value: number | null) => void;
  fullyVotedCount: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  getScores,
  getVotedCount,
  getTotalScore,
  setScore,
  fullyVotedCount,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const ranked: RankedCountry[] = useMemo(() => {
    const withScores = COUNTRIES.map(c => ({
      ...c,
      scores: getScores(c.id),
      totalScore: getTotalScore(c.id),
      averageScore: getVotedCount(c.id) === 4 ? getTotalScore(c.id) / 4 : 0,
      votedCount: getVotedCount(c.id),
      rank: 0,
    }));

    withScores.sort((a, b) => {
      if (a.votedCount === 4 && b.votedCount < 4) return -1;
      if (b.votedCount === 4 && a.votedCount < 4) return 1;
      if (a.totalScore !== b.totalScore) return b.totalScore - a.totalScore;
      if (a.votedCount !== b.votedCount) return b.votedCount - a.votedCount;
      return a.performanceOrder - b.performanceOrder;
    });

    let currentRank = 1;
    withScores.forEach((c, i) => {
      if (i === 0) c.rank = 1;
      else {
        const prev = withScores[i - 1];
        if (c.totalScore === prev.totalScore && c.votedCount === prev.votedCount && c.votedCount === 4) {
          c.rank = prev.rank;
        } else {
          currentRank = i + 1;
          c.rank = currentRank;
        }
      }
    });

    return withScores;
  }, [getScores, getTotalScore, getVotedCount]);

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

  return (
    <div>
      <div className="results-header">
        <div>
          <h2 className="results-title">Рейтинг</h2>
          <p className="results-subtitle">
            {fullyVotedCount === COUNTRIES.length
              ? `Усі ${COUNTRIES.length} країн оцінено`
              : `Оцінено ${fullyVotedCount} з ${COUNTRIES.length}`}
          </p>
        </div>

        <button 
          className="pdf-btn" 
          onClick={() => setShowExportModal(true)}
          disabled={fullyVotedCount === 0}
        >
          <IconDownload stroke={1.5} size={18} />
          <span>PDF</span>
        </button>
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
    </div>
  );
};