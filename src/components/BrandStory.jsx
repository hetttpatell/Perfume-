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
      /* Previous theme: bg-[#FAFAFA] border-black/10 */
      className="w-full bg-white text-[#111111] overflow-hidden border-t border-black/5 selection:bg-[#111111] selection:text-white"
      aria-label="Brand Heritage Grid"
    >
      {/* 2x2 Interlocking Editorial Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* ROW 1 — BLOCK 1: High-Fashion Heritage Photography (Top Left) */}
        <div
          ref={block1Ref}
          /* Previous theme: bg-[#111111] border-black/10 */
          className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[560px] lg:min-h-[640px] overflow-hidden bg-white group border-b md:border-r border-black/5"
        >
          <img
            src={brandHeritageBg}
            alt="Lune Heritage Photography"
            /* Previous theme filter: filter brightness-95 contrast-105 */
            className="w-full h-full object-cover object-center filter brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Previous overlay: bg-gradient-to-t from-black/60 via-black/10 to-transparent */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Floating Caption Badge */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 text-white pointer-events-none">
            <span className="inline-block px-3 py-1 mb-2 bg-[#C08A3E]/90 backdrop-blur-md border border-[#C08A3E] font-sans text-[10px] uppercase tracking-[0.3em] text-white font-semibold shadow-sm">
              ALL-INDIA TERROIR EXPEDITION • RAW HARVEST
            </span>
            <p className="font-serif text-lg md:text-xl font-light text-white tracking-wide drop-shadow-sm">
              Every Region’s Most Potent Secret, Extracted Without Apology
            </p>
          </div>
        </div>

        {/* ROW 1 — BLOCK 2: Editorial Text Block (Top Right) */}
        <div
          ref={block2Ref}
          /* Previous theme: bg-[#FAFAFA] border-black/10 */
          className="p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-center bg-white border-b border-black/5"
        >
          <div className="max-w-xl">
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C08A3E] mb-4 block font-bold">
              THE INGREDIENT CONQUEST • STATE BY STATE
            </span>

            <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08] text-[#111111] mb-4 uppercase">
              INDIA’S WILDEST EARTH IN ONE BOTTLE.
            </h2>

            <h3 className="font-sans font-medium text-xs sm:text-sm tracking-[0.25em] uppercase text-[#555555] mb-6">
              WE SCOURED THE SUB-CONTINENT SO YOU DON'T COMPROMISE
            </h3>

            <p className="font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed text-[#333333] mb-6">
              We didn’t sit in a lab synthesizing shortcuts. We took the road less traveled — hunting the absolute richest botanical treasures across India's microclimates. Pure, potent, and unapologetically alive.
            </p>

            {/* Grid of State Ingredients */}
            <div className="grid grid-cols-2 gap-3 pb-6 border-b border-black/5">
              <div className="p-3 bg-[#faf9f7] border-l-2 border-[#C08A3E]">
                <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#C08A3E] font-bold">
                  KASHMIR VALLEYS
                </span>
                <span className="block font-sans text-xs font-semibold text-[#111111] mt-0.5">
                  Hand-Plucked Crimson Saffron
                </span>
              </div>
              <div className="p-3 bg-[#faf9f7] border-l-2 border-[#C08A3E]">
                <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#C08A3E] font-bold">
                  KANNAUJ, UP
                </span>
                <span className="block font-sans text-xs font-semibold text-[#111111] mt-0.5">
                  Dawn-Distilled Damask Gulab
                </span>
              </div>
              <div className="p-3 bg-[#faf9f7] border-l-2 border-[#C08A3E]">
                <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#C08A3E] font-bold">
                  MYSORE, KARNATAKA
                </span>
                <span className="block font-sans text-xs font-semibold text-[#111111] mt-0.5">
                  Aged Royal Chandan Wood
                </span>
              </div>
              <div className="p-3 bg-[#faf9f7] border-l-2 border-[#C08A3E]">
                <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#C08A3E] font-bold">
                  ASSAM RAINFORESTS
                </span>
                <span className="block font-sans text-xs font-semibold text-[#111111] mt-0.5">
                  Dense Wild Oudh Resin
                </span>
              </div>
            </div>

            <div className="pt-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C08A3E] block mb-1 font-semibold">
                  SOURCING CRITERIA
                </span>
                <span className="font-serif text-xl sm:text-2xl font-light text-[#111111]">
                  ZERO DILUTION • SINGLE-ORIGIN PURITY
                </span>
              </div>

              <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#111111]">
                01 / 02
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2 — BLOCK 3: Editorial Text Block (Bottom Left) */}
        <div
          ref={block3Ref}
          /* Previous theme: bg-[#FAFAFA] border-black/10 */
          className="p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-center bg-white border-b md:border-b-0 md:border-r border-black/5 order-2 md:order-1"
        >
          <div className="max-w-xl">
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-[#C08A3E] mb-4 block font-bold">
              THE NEWCOMER STANDARD • UNFILTERED POWER
            </span>

            <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.08] text-[#111111] mb-4 uppercase">
              RICH BY NATURE. HONEST BY DESIGN.
            </h2>

            <h3 className="font-sans font-medium text-xs sm:text-sm tracking-[0.25em] uppercase text-[#555555] mb-6">
              CRAFTED FOR YOUR PULSE • ACCESSIBLE TO ALL
            </h3>

            <p className="font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed text-[#333333] mb-6">
              Traditional fragrance houses charge 10x markups for watered-down blends and legacy logos. We blew that open. By pairing wild spices from Malabar with the coastal florals of Tamil Nadu and high-concentration maceration, we deliver intoxicating, long-lasting extrait density at honest prices. Luxury shouldn't be exclusive — it should be undeniable.
            </p>

            {/* Additional Regional Alignment */}
            <div className="grid grid-cols-2 gap-3 pb-6 border-b border-black/5">
              <div className="p-3 bg-[#faf9f7] border-l-2 border-[#111111]">
                <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#555555] font-bold">
                  MALABAR COAST, KERALA
                </span>
                <span className="block font-sans text-xs font-semibold text-[#111111] mt-0.5">
                  Black Tellicherry Peppercorn
                </span>
              </div>
              <div className="p-3 bg-[#faf9f7] border-l-2 border-[#111111]">
                <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-[#555555] font-bold">
                  MADURAI, TAMIL NADU
                </span>
                <span className="block font-sans text-xs font-semibold text-[#111111] mt-0.5">
                  Midnight Sambac Jasmine
                </span>
              </div>
            </div>

            <div className="pt-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C08A3E] block mb-1 font-semibold">
                  CONCENTRATION & PROJECTION
                </span>
                <span className="font-serif text-xl sm:text-2xl font-light text-[#111111]">
                  BEAST MODE EXTRAIT DE PARFUM
                </span>
              </div>

              <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-[#111111]">
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
            <span className="inline-block px-3 py-1 mb-2 bg-[#C08A3E]/90 backdrop-blur-md border border-[#C08A3E] font-sans text-[10px] uppercase tracking-[0.3em] text-white font-semibold">
              UNCOMPROMISED EXTRACTION // ZERO MIDDLEMEN
            </span>
            <p className="font-serif text-lg md:text-xl font-light text-white tracking-wide">
              Rare Earth Botanicals Direct From Origin To Your Skin
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
