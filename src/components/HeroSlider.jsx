import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import Scene from './Scene';
import FragranceDetails from './FragranceDetails';
import OlfactoryExperience from './OlfactoryExperience';
import { SLIDES } from '../utils/slidesData';

export default function HeroSlider({ onReplayLoader, loaderState }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedSlideIndex, setDisplayedSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  const containerRef = useRef(null);
  const watermarkRef = useRef(null);
  const textGroupRef = useRef(null);
  const stepLabelRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const notesBadgeRef = useRef(null);
  const actionBtnRef = useRef(null);
  const stepperBarRef = useRef(null);

  const activeSlideData = SLIDES[displayedSlideIndex];

  // Handshake entrance animation for Hero editorial content
  useEffect(() => {
    const textElements = [
      stepLabelRef.current,
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      notesBadgeRef.current,
      actionBtnRef.current,
      stepperBarRef.current,
    ].filter(Boolean);

    if (loaderState === 'loading') {
      gsap.set(textElements, { opacity: 0, y: 40 });
      if (watermarkRef.current) {
        gsap.set(watermarkRef.current, { opacity: 0, scale: 0.92, y: 20 });
      }
    } else if (loaderState === 'exiting' || loaderState === 'completed') {
      gsap.killTweensOf(textElements);
      gsap.to(textElements, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.25,
      });

      if (watermarkRef.current) {
        gsap.killTweensOf(watermarkRef.current);
        gsap.to(watermarkRef.current, {
          opacity: 0.35,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.15,
        });
      }
    }
  }, [loaderState]);

  // Function to switch slides safely with GSAP timeline
  const goToSlide = useCallback(
    (targetIndex) => {
      if (isTransitioning || targetIndex === currentSlide) return;
      if (targetIndex < 0 || targetIndex >= SLIDES.length) return;

      const isNext = targetIndex > currentSlide || (currentSlide === SLIDES.length - 1 && targetIndex === 0);
      setIsTransitioning(true);
      setCurrentSlide(targetIndex);

      const targetSlideData = SLIDES[targetIndex];

      // 1. GSAP Background Color Morph Transition
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          backgroundColor: targetSlideData.bg,
          color: targetSlideData.text,
          duration: 0.8,
          ease: 'power2.inOut',
        });
      }

      // 2. Background Watermark Left / Right Slide Transition
      if (watermarkRef.current) {
        const exitX = isNext ? -200 : 200;
        const entryX = isNext ? 200 : -200;

        gsap.timeline()
          .to(watermarkRef.current, {
            x: exitX,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.in',
          })
          .set(watermarkRef.current, { x: entryX, opacity: 0 })
          .to(watermarkRef.current, {
            x: 0,
            opacity: 0.35,
            duration: 0.6,
            ease: 'power2.out',
          });
      }

      // 3. Editorial Content Fade Out/In Transition
      const textElements = [
        stepLabelRef.current,
        titleRef.current,
        subtitleRef.current,
        descriptionRef.current,
        notesBadgeRef.current,
        actionBtnRef.current,
      ].filter(Boolean);

      const outTl = gsap.timeline({
        onComplete: () => {
          setDisplayedSlideIndex(targetIndex);

          // Text In Animation after state update
          requestAnimationFrame(() => {
            const newTextElements = [
              stepLabelRef.current,
              titleRef.current,
              subtitleRef.current,
              descriptionRef.current,
              notesBadgeRef.current,
              actionBtnRef.current,
            ].filter(Boolean);

            gsap.fromTo(
              newTextElements,
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.05,
                ease: 'power3.out',
                onComplete: () => {
                  setIsTransitioning(false);
                },
              }
            );
          });
        },
      });

      outTl.to(textElements, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.in',
      });
    },
    [currentSlide, isTransitioning]
  );

  const handleNext = useCallback(() => {
    const nextIndex = (currentSlide + 1) % SLIDES.length;
    goToSlide(nextIndex);
  }, [currentSlide, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentSlide - 1 + SLIDES.length) % SLIDES.length;
    goToSlide(prevIndex);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation listener (WCAG accessible)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDetailsPage) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(SLIDES.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, goToSlide, showDetailsPage]);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Showcase Section */}
      <section
        ref={containerRef}
        className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden select-none transition-colors duration-300"
        style={{ backgroundColor: SLIDES[0].bg, color: SLIDES[0].text }}
        aria-label="Chanel N°19 Interactive Fragrance Showcase"
      >
        {/* Large Background Watermark Text (Optimized positioning for Mobile, iPad & Desktop) */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-start pt-16 justify-center md:items-center md:pt-0 md:justify-center lg:justify-end md:pl-[30vw] lg:pl-0 md:pr-4 overflow-hidden select-none">
          <h1
            ref={watermarkRef}
            className="font-serif font-extrabold text-[16vw] sm:text-[20vw] md:text-[22vw] lg:text-[25vw] leading-none text-black/20 md:text-black/35 tracking-tighter uppercase whitespace-nowrap will-change-transform drop-shadow-xs"
          >
            {activeSlideData.shortTitle}
          </h1>
        </div>

        {/* 3D WebGL Canvas Layer */}
        <Scene currentSlide={currentSlide} slideData={SLIDES[currentSlide]} loaderState={loaderState} />

        {/* Main Split Screen Content Area */}
        <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-6 pt-3 sm:pt-6 md:pt-16 pb-6 md:pb-12 pointer-events-none">
          
          {/* Top 3D Model Spacer Area on Mobile (order-first), Right Panel on iPad/Desktop (order-last) */}
          <div className="w-full md:w-[45%] lg:w-[58%] h-[190px] sm:h-[230px] md:h-full pointer-events-none order-first md:order-last shrink-0" />

          {/* Editorial Content Panel (order-last on mobile centered under 3D model, order-first on desktop/iPad) */}
          <div className="w-full md:w-[55%] lg:w-[42%] flex flex-col items-center md:items-start text-center md:text-left justify-center gap-3.5 sm:gap-5 md:gap-6 pointer-events-auto order-last md:order-first px-1 md:px-0">
            
            <div ref={textGroupRef} className="flex flex-col items-center md:items-start gap-1.5 sm:gap-3">
              {/* Step Label / Category */}
              <span
                ref={stepLabelRef}
                className="inline-block text-[11px] sm:text-xs md:text-sm font-sans font-semibold tracking-[0.3em] uppercase text-[#737373]"
                style={{ color: activeSlideData.accent }}
              >
                {activeSlideData.stepLabel}
              </span>

              {/* Main Garamond Heading */}
              <h1
                ref={titleRef}
                className="font-serif font-light text-3xl sm:text-4xl lg:text-6xl tracking-tight leading-[1.05] text-[#1A1A1A]"
              >
                {activeSlideData.title}
              </h1>

              {/* Subtitle / Note Theme */}
              <h2
                ref={subtitleRef}
                className="font-sans font-medium text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-[#737373]"
              >
                {activeSlideData.subtitle}
              </h2>
            </div>

            {/* Detailed Narrative Body Copy */}
            <p
              ref={descriptionRef}
              className="font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed text-[#4A4A4A] max-w-sm md:max-w-md lg:max-w-lg"
            >
              {activeSlideData.description}
            </p>

            {/* Key Notes Badges */}
            <div ref={notesBadgeRef} className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 pt-0.5">
              {activeSlideData.keyNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-sans font-medium tracking-wider uppercase bg-black/5 text-[#1A1A1A] rounded-full border border-black/10 shadow-2xs"
                >
                  {note}
                </span>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div ref={actionBtnRef} className="flex flex-wrap justify-center md:justify-start items-center gap-2.5 sm:gap-3 pt-1 sm:pt-3">
              <button
                onClick={handleNext}
                className="px-6 sm:px-7 py-3 sm:py-3.5 text-xs font-sans font-semibold tracking-[0.25em] uppercase text-white bg-[#1A1A1A] rounded-full hover:bg-black hover:shadow-lg hover:shadow-black/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <span>{currentSlide === SLIDES.length - 1 ? 'REPLAY STORY' : 'NEXT NOTE'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Separate Page Details CTA Button */}
              <button
                onClick={() => setShowDetailsPage(true)}
                className="px-5 sm:px-6 py-3 sm:py-3.5 text-xs font-sans font-semibold tracking-[0.25em] uppercase text-[#1A1A1A] bg-white border border-black/20 rounded-full hover:bg-black/5 hover:border-black/50 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2 shadow-xs"
              >
                <span>EXPLORE DETAILS</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal High-Fashion Bottom Navigation Bar (Step Tab List Removed as requested) */}
        <footer
          ref={stepperBarRef}
          className="relative z-20 w-full px-6 md:px-12 py-4 bg-gradient-to-t from-white/95 via-white/60 to-transparent flex items-center justify-end border-t border-black/5"
        >
          {/* Directional Controls & Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Fragrance Step"
              className="p-2.5 sm:p-3 rounded-full border border-black/20 hover:border-black/60 hover:bg-black/5 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-sans text-xs tracking-[0.2em] font-semibold text-[#1A1A1A]">
              {activeSlideData.id} / 0{SLIDES.length}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next Fragrance Step"
              className="p-3 rounded-full border border-black/20 hover:border-black/60 hover:bg-black/5 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </footer>
      </section>

      {/* Olfactory Experience Full Page Extension */}
      <OlfactoryExperience
        onSelectNote={(idx) => {
          goToSlide(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDetails={() => setShowDetailsPage(true)}
      />

      {/* Separate Details Page Overlay */}
      {showDetailsPage && (
        <FragranceDetails
          slideData={activeSlideData}
          onClose={() => setShowDetailsPage(false)}
          onReplayLoader={onReplayLoader}
        />
      )}
    </div>
  );
}
