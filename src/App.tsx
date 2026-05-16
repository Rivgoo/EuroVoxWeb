import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ParticipantsView } from './views/ParticipantsView';
import { ResultsView } from './views/ResultsView';
import { SharedView } from './views/SharedView';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useVotes } from './hooks/useVotes';
import { TabType, VoteStore } from './types';
import { COUNTRIES } from './data/countries';
import { decodeShareData } from './utils/share';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('participants');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const [sharedData, setSharedData] = useState<{ userName: string, votes: VoteStore } | null>(null);

  const {
    votes,
    getScores,
    setScore,
    getTotalScore,
    getVotedCount,
    clearAllVotes,
    fullyVotedCountries,
  } = useVotes();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('s');
    
    if (shareParam) {
      const decoded = decodeShareData(shareParam);
      if (decoded) {
        setSharedData(decoded);
      }
    }
  }, []);

  const handleReset = () => {
    clearAllVotes();
    setShowResetConfirm(false);
  };

  // Передаємо локальні голоси (votes) у SharedView для режиму порівняння
  if (sharedData) {
    return (
      <SharedView 
        userName={sharedData.userName} 
        sharedVotes={sharedData.votes} 
        localVotes={votes} 
      />
    );
  }

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
            votes={votes}
            getScores={getScores}
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