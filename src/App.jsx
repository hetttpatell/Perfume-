import { useState, useCallback } from 'react';
import Loader from './components/Loader';
import HeroSlider from './components/HeroSlider';
import './App.css';

function App() {
  const [loaderKey, setLoaderKey] = useState(0);
  const [loaderState, setLoaderState] = useState(() => {
    // Only play smooth loader on initial website visit, skip on page refresh
    try {
      return sessionStorage.getItem('perfume_has_visited') ? 'completed' : 'loading';
    } catch {
      return 'loading';
    }
  });

  const handleReplayLoader = useCallback(() => {
    setLoaderState('loading');
    setLoaderKey((prev) => prev + 1);
  }, []);

  const handleLoaderStartExit = useCallback(() => {
    try {
      sessionStorage.setItem('perfume_has_visited', 'true');
    } catch (e) {
      // ignore storage errors
    }
    setLoaderState('exiting');
  }, []);

  const handleLoaderComplete = useCallback(() => {
    try {
      sessionStorage.setItem('perfume_has_visited', 'true');
    } catch (e) {
      // ignore storage errors
    }
    setLoaderState('completed');
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between overflow-hidden">
      {loaderState !== 'completed' && (
        <Loader
          key={loaderKey}
          onStartExit={handleLoaderStartExit}
          onComplete={handleLoaderComplete}
        />
      )}

      <div className="w-full min-h-screen z-10">
        <HeroSlider
          onReplayLoader={handleReplayLoader}
          loaderState={loaderState}
        />
      </div>
    </main>
  );
}

export default App;

