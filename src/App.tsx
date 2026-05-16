import { useState } from 'react';
import { Header } from './components/Header';
import { ParticipantsView } from './views/ParticipantsView';
import { ResultsView } from './views/ResultsView';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useVotes } from './hooks/useVotes';
import { TabType } from './types';
import { COUNTRIES } from './data/countries';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('participants');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    getScores,
    setScore,
    getTotalScore,
    getVotedCount,
    clearAllVotes,
    fullyVotedCountries,
  } = useVotes();

  const handleReset = () => {
    clearAllVotes();
    setShowResetConfirm(false);
  };

  return (
    <div className="app">
      <div className="app__bg-dynamic" />

      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fullyVotedCount={fullyVotedCountries}
        totalCountries={COUNTRIES.length}
        onResetClick={() => setShowResetConfirm(true)}
      />

      <main className="app__main">
        <div className={`app__tab-content ${activeTab === 'participants' ? 'app__tab-content--active' : ''}`}>
          <ParticipantsView
            getScores={getScores}
            getVotedCount={getVotedCount}
            getTotalScore={getTotalScore}
            setScore={setScore}
          />
        </div>
        <div className={`app__tab-content ${activeTab === 'results' ? 'app__tab-content--active' : ''}`}>
          <ResultsView
            getScores={getScores}
            getVotedCount={getVotedCount}
            getTotalScore={getTotalScore}
            setScore={setScore}
            fullyVotedCount={fullyVotedCountries}
          />
        </div>
      </main>

      {showResetConfirm && (
        <ConfirmDialog
          title="Очистити всі оцінки?"
          message="Усі ваші оцінки буде видалено безповоротно. Цю дію неможливо скасувати."
          confirmLabel="Так, видалити"
          onConfirm={handleReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}

export default App;