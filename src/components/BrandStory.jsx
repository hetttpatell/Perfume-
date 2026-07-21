import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brandHeritageBg from '../assets/brand_heritage_story.png';
import brandHeritageCraft from '../assets/brand_heritage_craft.png';

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
  const containerRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const block3Ref = useRef(null);
  const block4Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = [block1Ref.current, block2Ref.current, block3Ref.current, block4Ref.current];

      blocks.forEach((block) => {
        if (!block) return;
        gsap.fromTo(
          block,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#FAFAFA] text-[#1A1A1A] overflow-hidden border-t border-black/10 selection:bg-[#1A1A1A] selection:text-white"
      aria-label="Brand Heritage Grid"
    >
      {/* 2x2 Interlocking Editorial Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* ROW 1 — BLOCK 1: High-Fashion Heritage Photography (Top Left) */}
        <div
          ref={block1Ref}
          className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[560px] lg:min-h-[640px] overflow-hidden bg-[#111111] group border-b md:border-r border-black/10"
        >
          <img
            src={brandHeritageBg}
            alt="Chanel N°19 Heritage Photography"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Floating Caption Badge */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 text-white pointer-events-none">
            <span className="inline-block px-3 py-1 mb-2 bg-white/20 backdrop-blur-md border border-white/30 font-sans text-[10px] uppercase tracking-[0.3em] text-white font-medium">
              PARIS, 1970 // ARCHIVE
            </span>
            <p className="font-serif text-lg md:text-xl font-light text-white tracking-wide">
              Mademoiselle Chanel & Henri Robert
            </p>
          </div>
        </div>

        {/* ROW 1 — BLOCK 2: Editorial Text Block (Top Right) */}
        <div
          ref={block2Ref}
          className="p-8 sm:p-12 md:p-14 lg:p-20 flex flex-col justify-center bg-[#FAFAFA] border-b border-black/10"
        >
          <div className="max-w-xl">
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#737373] mb-4 block font-semibold">
              02 // THE HERITAGE & VISION
            </span>

            <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08] text-[#1A1A1A] mb-4 uppercase">
              THE AUDACIOUS SIGNATURE
            </h2>

            <h3 className="font-sans font-medium text-xs sm:text-sm tracking-[0.25em] uppercase text-[#737373] mb-6">
              BORN FROM UNCOMPROMISING COURAGE
            </h3>

            <p className="font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed text-[#4A4A4A] mb-8">
              In 1970, at eighty-seven years of age, Coco Chanel commissioned master perfumer Henri Robert to craft her final personal fragrance signature. Refusing sweet conformist florals, she demanded a scent with bite—an unexpected contrast between sharp galbanum green freshness and rich iris nobility.
            </p>

            <div className="pt-6 border-t border-black/10 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#737373] block mb-1">
                  HERITAGE MILESTONE
                </span>
                <span className="font-serif text-xl sm:text-2xl font-light text-[#1A1A1A]">
                  19 AUGUST 1883
                </span>
              </div>

              <span className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-[#737373]">
                01 / 02
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2 — BLOCK 3: Editorial Text Block (Bottom Left) */}
        <div
          ref={block3Ref}
          className="p-8 sm:p-12 md:p-14 lg:p-20 flex flex-col justify-center bg-[#FAFAFA] border-b md:border-b-0 md:border-r border-black/10 order-2 md:order-1"
        >
          <div className="max-w-xl">
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#737373] mb-4 block font-semibold">
              03 // THE BOTANICAL ALCHEMY
            </span>

            <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08] text-[#1A1A1A] mb-4 uppercase">
              THE SIX-YEAR IRIS RITUAL
            </h2>

            <h3 className="font-sans font-medium text-xs sm:text-sm tracking-[0.25em] uppercase text-[#737373] mb-6">
              FLORENTINE IRIS PALLIDA HARVEST
            </h3>

            <p className="font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed text-[#4A4A4A] mb-8">
              The soul of N°19 rests upon Iris Pallida, cultivated in the historic fields of Florence and Grasse. Maturing the rhizomes requires six years of unhurried patience—three years growing in the soil and three years drying in quiet darkness before slow steam distillation yields the precious powdery iris butter.
            </p>

            <div className="pt-6 border-t border-black/10 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#737373] block mb-1">
                  MATURATION RITUAL
                </span>
                <span className="font-serif text-xl sm:text-2xl font-light text-[#1A1A1A]">
                  6 YEARS PATIENCE
                </span>
              </div>

              <span className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-[#737373]">
                02 / 02
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2 — BLOCK 4: High-Fashion Craft Photography (Bottom Right) */}
        <div
          ref={block4Ref}
          className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[560px] lg:min-h-[640px] overflow-hidden bg-[#111111] group order-1 md:order-2"
        >
          <img
            src={brandHeritageCraft}
            alt="Florentine Iris Pallida Macro Detail"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Floating Caption Badge */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 text-white pointer-events-none">
            <span className="inline-block px-3 py-1 mb-2 bg-white/20 backdrop-blur-md border border-white/30 font-sans text-[10px] uppercase tracking-[0.3em] text-white font-medium">
              GRASSE, FRANCE // HARVEST
            </span>
            <p className="font-serif text-lg md:text-xl font-light text-white tracking-wide">
              Florentine Iris Pallida & Artisanal Distillation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
