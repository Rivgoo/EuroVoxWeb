import React, { useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { Country, CriterionKey, Scores } from '../types';
import { COUNTRIES } from '../data/countries';
import { ParticipantCard } from '../components/ParticipantCard';
import { VotingModal } from '../components/VotingModal';

interface ParticipantsViewProps {
  getScores: (countryId: number) => Scores;
  getVotedCount: (countryId: number) => number;
  getTotalScore: (countryId: number) => number;
  setScore: (countryId: number, criterion: CriterionKey, value: number | null) => void;
}

export const ParticipantsView: React.FC<ParticipantsViewProps> = ({
  getScores,
  getVotedCount,
  getTotalScore,
  setScore,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c =>
    search === '' ||
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.artist.toLowerCase().includes(search.toLowerCase()) ||
    c.song.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="search-input-wrapper">
        <IconSearch stroke={1.5} size={20} className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Пошук (країна, артист, пісня)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>
            <IconX stroke={1.5} size={18} />
          </button>
        )}
      </div>

      <div className="list-hint">
        {search ? `Знайдено: ${filtered.length}` : `Усі учасники (${COUNTRIES.length})`}
      </div>

      <div className="view-list">
        {filtered.map((country) => (
          <ParticipantCard
            key={country.id}
            country={country}
            scores={getScores(country.id)}
            votedCount={getVotedCount(country.id)}
            totalScore={getTotalScore(country.id)}
            onClick={() => setSelectedCountry(country)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>За вашим запитом нічого не знайдено.</p>
          </div>
        )}
      </div>

      {selectedCountry && (
        <VotingModal
          country={selectedCountry}
          scores={getScores(selectedCountry.id)}
          onScoreChange={(crit, val) => setScore(selectedCountry.id, crit, val)}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
};