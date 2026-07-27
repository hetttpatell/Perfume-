import { useRef } from 'react';
import sensoryRitualBg from '../assets/sensory_ritual_bg.png';

export default function SensoryRitual() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[80vh] sm:h-[110vh] md:h-[135vh] min-h-[550px] sm:min-h-[750px] overflow-hidden bg-black flex items-center justify-center select-none bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${sensoryRitualBg})` }}
      aria-label="The Sensory Ritual Showcase"
    >
      {/* Ambient mist dark vignette overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/40 pointer-events-none" />
    </section>
  );
}


