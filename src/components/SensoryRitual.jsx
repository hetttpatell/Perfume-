import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import sensoryRitualBg from '../assets/sensory_ritual_bg.png';

gsap.registerPlugin(ScrollTrigger);

export default function SensoryRitual() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !bgRef.current) return;

      gsap.fromTo(
        bgRef.current,
        { scale: 1.1, filter: 'brightness(0.9)' },
        {
          scale: 1.0,
          filter: 'brightness(1)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[65vh] sm:h-[80vh] md:h-[90vh] overflow-hidden bg-black text-white flex items-center justify-center select-none"
      aria-label="The Sensory Ritual Showcase"
    >
      {/* Full-Bleed Perfume Spray Picture with Parallax */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full will-change-transform">
        <img
          src={sensoryRitualBg}
          alt="Chanel N°19 Application Ritual"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        {/* Ambient mist dark vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/70" />
      </div>

      {/* Floating Section Badge */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full flex flex-col items-start justify-end h-full pb-10 sm:pb-14">
        <span className="inline-block px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white font-semibold rounded-full mb-3 shadow-lg">
          04 // THE APPLICATION RITUAL • CHANEL N°19
        </span>
        <h2 className="font-serif font-light text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase max-w-2xl drop-shadow-md">
          LE RITUEL DE SOIN ET D’ÉLÉGANCE
        </h2>
      </div>
    </section>
  );
}
