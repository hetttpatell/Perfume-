import { useState } from 'react';
import Loader from './components/Loader';
import HeroSlider from './components/HeroSlider';
import './App.css';

function App() {
  const [loaderKey, setLoaderKey] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleReplayLoader = () => {
    setIsFinished(false);
    setLoaderKey((prev) => prev + 1);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between overflow-hidden">
      <Loader
        key={loaderKey}
        onComplete={() => setIsFinished(true)}
      />

      {isFinished && (
        <div className="w-full min-h-screen z-10 animate-fade-in">
          <HeroSlider onReplayLoader={handleReplayLoader} />
        </div>
      )}
    </main>
  );
}

export default App;
