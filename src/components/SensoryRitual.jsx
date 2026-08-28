import { useRef } from 'react';
import sensoryRitualBg from '../assets/sensory_ritual_bg.png';

export default function SensoryRitual() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[70vh] sm:h-[90vh] md:h-[110vh] min-h-[450px] sm:min-h-[600px] overflow-hidden bg-black flex items-center justify-center select-none"
      aria-label="The Sensory Ritual Showcase"
    >
      <img
        src={sensoryRitualBg}
        alt="Sensory Ritual Atmosphere"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none transform-gpu"
        loading="lazy"
      />
      {/* Ambient mist dark vignette overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/40 pointer-events-none" />
    </section>
  );
}
