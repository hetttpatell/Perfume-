import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS_DATA = [
  {
    id: 1,
    author: 'VOGUE HAUTE PARFUMERIE',
    role: 'Editorial Review',
    location: 'PARIS, FRANCE',
    product: 'LUNE EXTRAIT DE PARFUM',
    rating: 5,
    title: 'AN AUDACIOUS STATEMENT OF ELEGANCE',
    quote:
      'Lune is not merely a fragrance; it is an audacious statement of independence. The green iris opening resolves into a velvet embrace that lingers with unmatched Parisian elegance.',
  },
  {
    id: 2,
    author: 'ELEANOR DE SAINT-GERMAIN',
    role: 'Fragrance Collector',
    location: 'LONDON, UK',
    product: 'EAU DE PARFUM SPRAY',
    rating: 5,
    title: 'MY SIGNATURE SCENT FOR TWENTY YEARS',
    quote:
      'The crisp galbanum contrasted against Iris Pallida leaves an unforgettable signature. It has been my signature scent for over twenty years—impeccable, daring, and timeless.',
  },
  {
    id: 3,
    author: "HARPER'S BAZAAR",
    role: 'Beauty Gazette',
    location: 'NEW YORK, USA',
    product: 'LES ATELIERS LUNE',
    rating: 5,
    title: 'THE ULTIMATE OLFACTORY SIGNATURE',
    quote:
      'The perfect balance between crisp Galbanum and velvety Iris Pallida. Lune remains the ultimate olfactory signature of modern haute couture sophistication.',
  },
  {
    id: 4,
    author: 'CAMILLE VALENTINE',
    role: 'Fashion Stylist',
    location: 'MILAN, ITALY',
    product: 'EAU DE TOILETTE SPRAY',
    rating: 5,
    title: 'INCOMPARABLE HAUTE COUTURE SILPAGE',
    quote:
      'Wearing Lune feels like wearing an invisible haute couture gown. The sillage is sophisticated, magnetic, and supremely refined without ever feeling overpowering.',
  },
  {
    id: 5,
    author: 'JEAN-LUC MOREAU',
    role: 'Master Critic',
    location: 'GRASSE, FRANCE',
    product: 'RITUELS DE SOIN BODY OIL',
    rating: 5,
    title: 'ETHEREAL BOTANICAL ALCHEMY',
    quote:
      'An ethereal composition where botanical boldness meets velvety softness. The artisanal flacon engraving service is divine, rendering each bottle an heirloom piece of art.',
  },
  {
    id: 6,
    author: 'SOPHIE VAN DER BERG',
    role: 'Art Director',
    location: 'AMSTERDAM, NETHERLANDS',
    product: 'LUNE EXTRAIT DE PARFUM',
    rating: 5,
    title: 'SENSORY UNBOXING RITUAL',
    quote:
      'Ordered the Extrait flacon with custom engraving. Unboxing it was a sensory ritual in itself. The fragrance lasts beautifully from morning until evening.',
  },
];

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState(0);

  // Group testimonials into pages of 3 cards for clean layout
  const totalPages = Math.ceil(TESTIMONIALS_DATA.length / 3);
  const visibleTestimonials = TESTIMONIALS_DATA.slice(activeTab * 3, activeTab * 3 + 3);

  // Auto-play interval: Automatically switch slides smoothly every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % totalPages);
    }, 4500);
    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <section className="w-full max-w-7xl mx-auto py-12 sm:py-16 px-4 border-t border-black/5 text-[#111111] bg-white font-sans">
      {/* Clean Theme-Aligned Header matching Navbar Pill Style */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="inline-block px-3.5 py-1 bg-[#F4F4F6] border border-black/10 rounded-full font-sans font-bold text-[9.5px] sm:text-[10px] text-[#555555] tracking-[0.25em] uppercase mb-2">
            TESTIMONIALS
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] uppercase tracking-tight leading-tight">
            WHAT OUR CLIENTS SAY
          </h2>
        </div>

        {/* Navbar Pill-Style Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-[#F4F4F6] border border-black/10 rounded-full p-1.5 shadow-2xs">
          <button
            onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : totalPages - 1))}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#111111] hover:text-white border border-black/10 transition-all duration-200 cursor-pointer flex items-center justify-center text-[#111111] active:scale-95"
            aria-label="Previous slide"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-[11px] font-sans font-extrabold tracking-widest text-[#111111] px-2">
            0{activeTab + 1} / 0{totalPages}
          </span>

          <button
            onClick={() => setActiveTab((prev) => (prev < totalPages - 1 ? prev + 1 : 0))}
            className="w-8 h-8 rounded-full bg-[#111111] hover:bg-black text-white transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95"
            aria-label="Next slide"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Animated 3-Card Grid matching Olfactory Product Tiles & Navbar Aesthetic */}
      <div className="relative min-h-[280px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {visibleTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-[#F4F4F6] border border-black/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* Top Bar: Stars + Product Tag */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
                    <div className="flex text-[#C08A3E]">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <span className="px-2.5 py-0.5 bg-black/85 text-white text-[8px] font-sans font-extrabold tracking-[0.18em] uppercase rounded-full">
                      VERIFIED
                    </span>
                  </div>

                  {/* Title / Headline */}
                  <h4 className="font-sans font-extrabold text-xs sm:text-sm text-[#111111] uppercase tracking-wide mb-2 leading-snug">
                    "{item.title}"
                  </h4>

                  {/* Quote */}
                  <p className="font-sans text-xs sm:text-sm text-[#555555] font-normal leading-relaxed mb-6">
                    {item.quote}
                  </p>
                </div>

                {/* Author Info Footer */}
                <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#111111] text-[#C08A3E] flex items-center justify-center font-extrabold text-xs font-serif shrink-0">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-sans font-extrabold text-[11px] sm:text-xs text-[#111111] uppercase tracking-wider">
                        {item.author}
                      </h5>
                      <p className="font-sans text-[10px] text-[#555555] font-semibold">
                        {item.role} • <span className="text-[#059669]">{item.location}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
