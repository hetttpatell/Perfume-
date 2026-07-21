import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import sensoryRitualBg from '../assets/sensory_ritual_bg.png';
import brandHeritageBg from '../assets/brand_heritage_story.png';
import brandHeritageCraft from '../assets/brand_heritage_craft.png';
import OlfactoryExperience from './OlfactoryExperience';

gsap.registerPlugin(ScrollTrigger);

export default function SensoryRitual() {
  const pinnedWrapperRef = useRef(null);
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const whiteScreenRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!pinnedWrapperRef.current || !containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedWrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: containerRef.current,
        },
      });

      // 1. Perfume Picture holds pinned & subtle scale effect
      if (bgRef.current) {
        tl.fromTo(
          bgRef.current,
          { scale: 1.08, filter: 'brightness(0.92)' },
          {
            scale: 1.0,
            filter: 'brightness(1)',
            duration: 1,
            ease: 'none',
          },
          0
        );
      }

      // 2. White Card Grid Section (Matching reference video "BLIP INSIGHTS") slides UP over the pinned image
      if (whiteScreenRef.current) {
        tl.fromTo(
          whiteScreenRef.current,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 2.2,
            ease: 'power2.inOut',
          },
          0.5
        );
      }
    }, pinnedWrapperRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={pinnedWrapperRef}
      className="relative w-full h-[170vh] sm:h-[220vh] md:h-[260vh] bg-[#FAFAFA]"
      aria-label="The Sensory Ritual Pinned Showcase"
    >
      {/* Sticky Viewport Container */}
      <section
        ref={containerRef}
        className="sticky top-0 w-full h-screen overflow-hidden text-[#FAFAFA] select-none"
      >
        {/* Layer 1: Full-Bleed Perfume Spray Picture (Visible immediately as Section pins) */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none will-change-transform z-10"
        >
          <picture className="w-full h-full block">
            <img
              src={sensoryRitualBg}
              alt="Chanel N°19 Application Ritual"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />
          </picture>

          {/* Ambient mist overlay effect */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />

          {/* Floating Badge */}
          <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 z-10">
            <span className="inline-block px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 font-sans text-[11px] uppercase tracking-[0.3em] text-white font-medium rounded-full">
              04 // THE APPLICATION RITUAL • CHANEL N°19
            </span>
          </div>
        </div>

        {/* Layer 2: WHITE SECTION OVERLAY - SHOPPING BOUTIQUE */}
        <div
          ref={whiteScreenRef}
          className="absolute inset-0 w-full h-full bg-[#FAFAFA] text-[#1A1A1A] z-20 shadow-2xl border-t border-black/10 select-auto will-change-transform overflow-y-auto"
        >
          <OlfactoryExperience onScrollToTop={handleScrollToTop} />
        </div>
      </section>
    </div>
  );
}
