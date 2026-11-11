import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

/* ── Slide data ───────────────────────────────────────────────── */
const SLIDES = [
  {
    image: '/aboutus/kannuj.jpg',
    heading: 'Rooted in Kannauj',
    subheading: 'The Perfume Capital of India',
    content:
      'Maison Lune draws its soul from Kannauj — a city with over 5,000 years of perfumery heritage, where the ancient art of "deg bhapka" distillation still thrives.',
  },
  {
    image: '/aboutus/kannuj 2.jpg',
    heading: 'In-House Atelier',
    subheading: 'Complete Quality Control',
    content:
      'Every fragrance is crafted entirely in-house, giving us uncompromising control over quality, ingredient sourcing, and natural extraction processes.',
  },
  {
    image: '/aboutus/kannuj 3.jpg',
    heading: '100% Unique Blends',
    subheading: 'No Mass-Produced Formulas',
    content:
      'Each scent is a one-of-a-kind composition — hand-designed by our master perfumers, never replicated from generic templates or outsourced formulas.',
  },
  {
    image: '/aboutus/kannuj 4.jpg',
    heading: 'Chemical Free',
    subheading: 'Safe for You & Your Space',
    content:
      'We never use phthalates, parabens, or synthetic fillers. Every product is gentle on the skin and completely safe for your living spaces.',
  },
  {
    image: '/aboutus/aurelie-sgnl-V8IiD0GVb3o-unsplash.jpg',
    heading: 'Pure Natural Extracts',
    subheading: 'Nothing Synthetic, Ever',
    content:
      'Derived from pure, naturally sourced botanical extracts — florals, woods, resins, and spices distilled at their peak to preserve true character.',
  },
  {
    image: '/aboutus/dianne-NbFO1LocHUI-unsplash.jpg',
    heading: 'IFRA Certified',
    subheading: 'International Compliance',
    content:
      'Every formulation strictly follows the International Fragrance Association (IFRA) safety standards, ensuring peace of mind with every use.',
  },
  {
    image: '/aboutus/frederick-shaw-U93sPwZaiWY-unsplash.jpg',
    heading: 'Handcrafted Batches',
    subheading: 'Limited for Precision',
    content:
      'We produce in carefully controlled, limited batches — ensuring superior freshness, exacting precision, and an artisanal quality you can feel.',
  },
  {
    image: '/aboutus/jon-villanueva-dLyt-mceALY-unsplash.jpg',
    heading: 'Sustainable Craft',
    subheading: 'Crafted with Conscience',
    content:
      'From responsibly sourced raw materials to eco-conscious packaging, sustainability is woven into every step of our journey.',
  },
  {
    image: '/aboutus/mustafa-jUUNUFN5Pxo-unsplash.jpg',
    heading: 'The Lune Difference',
    subheading: 'Heritage Meets Modern Luxury',
    content:
      'Where centuries-old craftsmanship meets contemporary luxury — Maison Lune creates fragrances that resonate with authenticity and timeless elegance.',
  },
];

/* Preload next/prev images for instant transitions */
function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

export default function OurStory() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const imageWrapRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const bodyRef = useRef(null);
  const lineRef = useRef(null);
  const touchStartX = useRef(0);

  const active = SLIDES[activeIndex];

  /* ── Preload adjacent images ── */
  useEffect(() => {
    if (activeIndex < SLIDES.length - 1) preloadImage(SLIDES[activeIndex + 1].image);
    if (activeIndex > 0) preloadImage(SLIDES[activeIndex - 1].image);
  }, [activeIndex]);

  /* ── Navigate with cinematic GSAP transition ── */
  const goTo = useCallback(
    (nextIndex) => {
      if (isAnimating || nextIndex === activeIndex) return;
      if (nextIndex < 0 || nextIndex >= SLIDES.length) return;
      setIsAnimating(true);

      const direction = nextIndex > activeIndex ? 1 : -1;
      const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

      // Phase 1 — exit
      tl.to(imageWrapRef.current, {
        opacity: 0,
        x: -20 * direction,
        scale: 1.02,
        duration: 0.35,
        ease: 'power3.in',
      });
      tl.to(subRef.current, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in' }, '<');
      tl.to(headingRef.current, { opacity: 0, y: 12, duration: 0.25, ease: 'power2.in' }, '<0.04');
      tl.to(lineRef.current, { scaleX: 0, duration: 0.2, ease: 'power2.in' }, '<0.02');
      tl.to(bodyRef.current, { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' }, '<0.04');

      // Phase 2 — swap
      tl.call(() => setActiveIndex(nextIndex));

      // Phase 3 — enter
      tl.fromTo(
        imageWrapRef.current,
        { opacity: 0, x: 24 * direction, scale: 1.04 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        '<0.08'
      );
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '<0.06'
      );
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ease: 'power2.out', transformOrigin: 'left center' },
        '<0.06'
      );
      tl.fromTo(
        bodyRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '<0.08'
      );
    },
    [activeIndex, isAnimating]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  /* ── Keyboard ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext]);

  /* ── Touch swipe (mobile) ── */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <section className="w-full bg-[#faf9f7] text-[#111] overflow-hidden selection:bg-[#111] selection:text-white">
      {/* ── Header ── */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 text-center">
        <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#C08A3E] mb-3 block font-semibold">
          Our Story
        </span>
        <h2 className="font-serif font-light text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] tracking-tight leading-[1.1] text-[#111] uppercase">
          What Makes Us Different
        </h2>
        <div className="w-8 h-[1px] bg-[#C08A3E] mx-auto mt-4 mb-3" />
        <p className="font-sans font-light text-xs sm:text-[13px] text-[#777] max-w-lg mx-auto leading-relaxed">
          Crafted with integrity, rooted in nature — discover the Maison Lune difference.
        </p>
      </div>

      {/* ── Main Content ── */}
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20">
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.15fr_1fr] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)] sm:rounded-sm"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* ──────── LEFT — Image ──────── */}
          <div className="relative aspect-[4/3] sm:aspect-[4/3] md:aspect-auto md:min-h-[460px] lg:min-h-[520px] overflow-hidden bg-[#0c0c0c]">
            <div ref={imageWrapRef} className="absolute inset-0">
              <img
                src={active.image}
                alt={active.heading}
                className="w-full h-full object-cover object-center will-change-transform"
              />
              {/* Cinematic overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-black/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none hidden md:block" />
            </div>

            {/* Counter — top-left */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
              <div className="flex items-baseline gap-0.5">
                <span className="font-sans font-semibold text-lg sm:text-xl text-white leading-none">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="font-sans font-light text-[11px] text-white/40 tracking-wider">
                  &nbsp;/&nbsp;{String(SLIDES.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Arrow nav — bottom-right of image */}
            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-10 flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={isFirst}
                aria-label="Previous slide"
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border backdrop-blur-lg rounded-full transition-all duration-300 cursor-pointer ${
                  isFirst
                    ? 'border-white/10 bg-white/5 opacity-30 cursor-not-allowed'
                    : 'border-white/20 bg-black/30 hover:bg-white/95 group'
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300 ${
                    isFirst ? 'text-white/40' : 'text-white group-hover:text-[#111]'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                disabled={isLast}
                aria-label="Next slide"
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border backdrop-blur-lg rounded-full transition-all duration-300 cursor-pointer ${
                  isLast
                    ? 'border-white/10 bg-white/5 opacity-30 cursor-not-allowed'
                    : 'border-white/20 bg-black/30 hover:bg-white/95 group'
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300 ${
                    isLast ? 'text-white/40' : 'text-white group-hover:text-[#111]'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Progress bar — bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
              <div
                className="h-full bg-[#C08A3E] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${((activeIndex + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* ──────── RIGHT — Content ──────── */}
          <div className="flex flex-col justify-between px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-14 lg:py-14 xl:px-16">
            {/* Top content */}
            <div>
              {/* Subheading */}
              <p
                ref={subRef}
                className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-semibold mb-3 sm:mb-4"
              >
                {active.subheading}
              </p>

              {/* Heading */}
              <h3
                ref={headingRef}
                className="font-serif font-light text-[24px] sm:text-[28px] md:text-[26px] lg:text-[32px] xl:text-[36px] tracking-tight leading-[1.1] text-[#111] uppercase mb-4 sm:mb-5"
              >
                {active.heading}
              </h3>

              {/* Accent line */}
              <div ref={lineRef} className="w-10 h-[1.5px] bg-[#C08A3E] mb-5 sm:mb-6 origin-left" />

              {/* Body */}
              <p
                ref={bodyRef}
                className="font-sans font-light text-[13px] sm:text-sm md:text-[13px] lg:text-sm text-[#666] leading-[1.8] max-w-[420px]"
              >
                {active.content}
              </p>
            </div>

            {/* Bottom — dots + CTA */}
            <div className="mt-8 sm:mt-10">
              {/* Dot navigation */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`rounded-full transition-all duration-500 ease-out cursor-pointer ${
                      i === activeIndex
                        ? 'w-7 sm:w-8 h-[5px] bg-[#C08A3E]'
                        : 'w-[5px] h-[5px] bg-[#111]/10 hover:bg-[#111]/25'
                    }`}
                  />
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-5 sm:pt-6 border-t border-black/[0.06]">
                <button
                  onClick={() => navigate('/about')}
                  className="group relative px-7 sm:px-8 py-3 sm:py-3.5 bg-[#111] text-white font-sans font-semibold text-[10px] sm:text-[11px] tracking-[0.25em] uppercase overflow-hidden transition-all duration-300 cursor-pointer active:scale-[0.97]"
                >
                  <span className="relative z-10">Discover Our Heritage</span>
                  <div className="absolute inset-0 bg-[#C08A3E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </button>
                <span className="font-sans text-[10px] sm:text-[11px] text-[#999] tracking-wide hidden sm:inline">
                  Swipe or use arrow keys
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
