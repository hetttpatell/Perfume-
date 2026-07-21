import { useState, useCallback } from 'react';
import Loader from './components/Loader';
import HeroSlider from './components/HeroSlider';
import './App.css';

function App() {
  const [loaderKey, setLoaderKey] = useState(0);
  const [loaderState, setLoaderState] = useState('loading'); // 'loading' | 'exiting' | 'completed'

  const handleReplayLoader = useCallback(() => {
    setLoaderState('loading');
    setLoaderKey((prev) => prev + 1);
  }, []);

  const handleLoaderStartExit = useCallback(() => {
    setLoaderState('exiting');
  }, []);

  const handleLoaderComplete = useCallback(() => {
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

