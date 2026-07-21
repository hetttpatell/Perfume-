import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import sensoryRitualBg from '../assets/sensory_ritual_bg.png';
import brandHeritageBg from '../assets/brand_heritage_story.png';
import brandHeritageCraft from '../assets/brand_heritage_craft.png';

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
      className="relative w-full h-[260vh] bg-[#FAFAFA]"
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

        {/* Layer 2: WHITE SECTION OVERLAY (Matching reference video card grid sliding UP over picture) */}
        <div
          ref={whiteScreenRef}
          className="absolute inset-0 w-full h-full bg-[#FAFAFA] text-[#1A1A1A] z-20 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 shadow-2xl border-t border-black/10 select-auto will-change-transform overflow-y-auto"
        >
          {/* Header Row */}
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between border-b border-black/10 pb-4 md:pb-6">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#737373] font-semibold block mb-1">
                05 // HAUTE PARFUMERIE INSIGHTS
              </span>
              <h2 className="font-serif font-light text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] tracking-tight uppercase">
                CHANEL N°19 ARCHITECTURAL INSIGHTS
              </h2>
            </div>

            <button
              onClick={handleScrollToTop}
              className="px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#1A1A1A] bg-black/5 hover:bg-black hover:text-white rounded-full border border-black/15 transition-all duration-300 cursor-pointer shrink-0"
            >
              TOP OF PAGE
            </button>
          </div>

          {/* 3-Column Luxury Card Grid (Matching reference video "BLIP INSIGHTS") */}
          <div className="w-full max-w-7xl mx-auto py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 my-auto">
            {/* Card 1 */}
            <div className="flex flex-col bg-white border border-black/10 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div className="w-full h-44 sm:h-52 overflow-hidden bg-[#111111] relative">
                <img
                  src={brandHeritageBg}
                  alt="Florentine Iris Pallida"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-md text-[10px] font-sans tracking-widest text-white uppercase rounded-md border border-white/20">
                  IRIS PALLIDA
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-light text-[#1A1A1A] mb-2 uppercase tracking-wide">
                    FLORENTINE IRIS MATURATION
                  </h3>
                  <p className="font-sans text-xs text-[#555555] font-light leading-relaxed mb-4">
                    Six years of slow cultivation in Florence and Grasse yield the precious powdery butter that gives N°19 its noble backbone.
                  </p>
                </div>
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C08A3E]">
                  6 YEARS PATIENCE →
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col bg-white border border-black/10 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div className="w-full h-44 sm:h-52 overflow-hidden bg-[#111111] relative">
                <img
                  src={sensoryRitualBg}
                  alt="Application Gesture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-md text-[10px] font-sans tracking-widest text-white uppercase rounded-md border border-white/20">
                  GALBANUM CONTRAST
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-light text-[#1A1A1A] mb-2 uppercase tracking-wide">
                    UNCOMPROMISING GREEN BITE
                  </h3>
                  <p className="font-sans text-xs text-[#555555] font-light leading-relaxed mb-4">
                    Sharp Iranian Galbanum cuts through sweet floral conformism, creating Coco Chanel's final daring personal signature.
                  </p>
                </div>
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C08A3E]">
                  HAUTE HARVEST →
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col bg-white border border-black/10 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div className="w-full h-44 sm:h-52 overflow-hidden bg-[#111111] relative">
                <img
                  src={brandHeritageCraft}
                  alt="Baudruchage Craftsmanship"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-md text-[10px] font-sans tracking-widest text-white uppercase rounded-md border border-white/20">
                  ARTISANAL SEAL
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-light text-[#1A1A1A] mb-2 uppercase tracking-wide">
                    THE BAUDROUCHAGE CRAFT
                  </h3>
                  <p className="font-sans text-xs text-[#555555] font-light leading-relaxed mb-4">
                    Each flacon of Extrait is sealed by hand in Grasse using traditional membrane and gold thread techniques for tamperproof purity.
                  </p>
                </div>
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C08A3E]">
                  HAND SEALED →
                </span>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="w-full max-w-7xl mx-auto pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans tracking-widest text-[#737373] uppercase gap-2">
            <span>© CHANEL HAUTE PARFUMERIE</span>
            <div className="flex gap-4 sm:gap-6">
              <span>FLORENTINE IRIS</span>
              <span>•</span>
              <span>IRANIAN GALBANUM</span>
              <span>•</span>
              <span>GRASSE ROSE</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
