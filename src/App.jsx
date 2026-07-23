import { useState, useCallback, useEffect } from 'react';
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

  // Separate flag to control when Loader is actually unmounted from the DOM.
  // The Loader stays mounted (but invisible at yPercent:-100) for 500ms after 'completed'
  // to avoid a synchronous DOM teardown that freezes the main thread during hero entrance.
  const [loaderMounted, setLoaderMounted] = useState(() => {
    try {
      return !sessionStorage.getItem('perfume_has_visited');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (loaderState === 'completed' && loaderMounted) {
      const timer = setTimeout(() => setLoaderMounted(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loaderState, loaderMounted]);

  const handleReplayLoader = useCallback(() => {
    setLoaderMounted(true);
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
    // Defer the state change to the next animation frame so the React re-render
    // (and its useEffect cascade) doesn't block the current GSAP animation frame.
    requestAnimationFrame(() => {
      setLoaderState('completed');
    });
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between overflow-hidden">
      {loaderMounted && (
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
