import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import Scene from './Scene';
import FragranceDetails from './FragranceDetails';
import SensoryRitual from './SensoryRitual';
import BrandStory from './BrandStory';
import OlfactoryExperience from './OlfactoryExperience';
import { SLIDES } from '../utils/slidesData';

export default function HeroSlider({ onReplayLoader, loaderState, onModelLoaded }) {
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
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const activeSlideData = SLIDES[displayedSlideIndex];

  // Ref to prevent double-triggering the entrance animation
  const hasAnimatedRef = useRef(false);
  const entranceTimelineRef = useRef(null);
  const prevLoaderStateRef = useRef(null);

  // Unified entrance animation — single GSAP timeline for frame-locked synchronization.
  //
  // Previously this waited for loaderState === 'exiting' before starting, so
  // it was racing the curtain: the curtain's yPercent:-100 lift uncovers the
  // viewport progressively from the BOTTOM edge upward (its own bottom edge
  // is the first thing to clear the screen), which means the footer/stepper
  // bar becomes physically visible within the first moments of the lift —
  // while the old timeline didn't animate the stepper in until ~0.75s later.
  // That gap between "uncovered" and "actually faded in" is what read as lag.
  //
  // Fix: the curtain is fully opaque (z-50) the entire time it's covering the
  // screen, so there's nothing to lose by having the hero compose itself
  // WHILE STILL HIDDEN, starting as soon as the loader mounts in 'loading'
  // rather than waiting for the exit signal. The full entrance sequence below
  // takes well under the ~1.6s the loader's counter already runs for, so by
  // the time the curtain starts lifting the hero is fully settled — the lift
  // then just reveals a scene that's already there, with nothing left to
  // catch up on regardless of which edge is uncovered first.
  useEffect(() => {
    const allElements = [
      watermarkRef.current,
      stepLabelRef.current,
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      notesBadgeRef.current,
      actionBtnRef.current,
      stepperBarRef.current,
    ].filter(Boolean);

    if (loaderState === 'loading') {
      hasAnimatedRef.current = false;
      if (entranceTimelineRef.current) {
        entranceTimelineRef.current.kill();
        entranceTimelineRef.current = null;
      }
      gsap.set(allElements, { opacity: 0, y: 40, clearProps: 'scale,filter,letterSpacing' });
      if (watermarkRef.current) {
        gsap.set(watermarkRef.current, { opacity: 0, scale: 0.92, y: 20 });
      }
    } else if ((loaderState === 'exiting' || loaderState === 'completed') && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;

      gsap.killTweensOf(allElements);
      if (entranceTimelineRef.current) entranceTimelineRef.current.kill();

      const isExiting = loaderState === 'exiting';
      // Frame-locked delay: starts entrance sequence right as curtain begins moving
      const tl = gsap.timeline({
        delay: isExiting ? 0.08 : 0.05,
        defaults: { ease: 'power2.out', force3D: true },
      });
      entranceTimelineRef.current = tl;

      // Bottom Navigation Stepper — reveals gracefully as curtain lifts off bottom
      if (stepperBarRef.current) {
        tl.fromTo(
          stepperBarRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.1 },
          0.05
        );
      }

      // Watermark — ambient background
      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { opacity: 0, scale: 0.94, y: 25 },
          { opacity: 0.35, scale: 1, y: 0, duration: 1.6, ease: 'power2.out' },
          0.10
        );
      }

      // Step Label
      if (stepLabelRef.current) {
        tl.fromTo(
          stepLabelRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.1 },
          0.18
        );
      }

      // Main Title
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out' },
          0.26
        );
      }

      // Subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0 },
          0.36
        );
      }

      // Description
      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0 },
          0.44
        );
      }

      // Key Notes Badges
      if (notesBadgeRef.current) {
        tl.fromTo(
          notesBadgeRef.current,
          { opacity: 0, y: 15, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
          0.52
        );
      }

      // Action CTA Buttons
      if (actionBtnRef.current) {
        tl.fromTo(
          actionBtnRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.60
        );
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

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartXRef.current || showDetailsPage) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger horizontal swipe if X movement > 40px and dominant over vertical scroll
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = 0;
    touchStartYRef.current = 0;
  };

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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[100dvh] md:min-h-screen flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 touch-pan-y"
        style={{ backgroundColor: SLIDES[0].bg, color: SLIDES[0].text }}
        aria-label="Chanel N°19 Interactive Fragrance Showcase"
      >
        {/* Large Background Watermark Text */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-start pt-6 sm:pt-8 md:items-center md:pt-0 justify-center md:justify-end md:pl-0 md:pr-8 lg:pr-12 overflow-hidden select-none">
          <h1
            ref={watermarkRef}
            className="font-serif font-extrabold text-[15vw] sm:text-[14vw] md:text-[11vw] lg:text-[13vw] xl:text-[15vw] leading-none text-black/45 sm:text-black/50 md:text-black/35 lg:text-black/22 tracking-tighter uppercase whitespace-nowrap will-change-transform"
          >
            {activeSlideData.shortTitle}
          </h1>
        </div>

        {/* 3D WebGL Canvas Layer */}
        <Scene currentSlide={currentSlide} slideData={SLIDES[currentSlide]} loaderState={loaderState} onModelLoaded={onModelLoaded} />

        {/* Main Split Screen Content Area */}
        <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 md:gap-6 pt-3 sm:pt-6 md:pt-16 pb-4 sm:pb-6 md:pb-12 pointer-events-none">

          {/* Dynamic 3D Model Spacer Area on Mobile (order-first), Right Panel on iPad/Desktop (order-last) */}
          <div className="w-full md:w-[46%] lg:w-[54%] h-[28vh] min-h-[170px] max-h-[240px] sm:h-[220px] md:h-full pointer-events-none order-first md:order-last shrink-0" />

          {/* Editorial Content Panel (order-last on mobile centered under 3D model, order-first on desktop/iPad) */}
          <div className="w-full md:w-[54%] lg:w-[46%] flex flex-col items-center md:items-start text-center md:text-left justify-center gap-3 sm:gap-5 md:gap-6 pointer-events-auto order-last md:order-first px-1 md:px-0">

            <div ref={textGroupRef} className="flex flex-col items-center md:items-start gap-1 sm:gap-2.5">
              {/* Step Label / Category */}
              <span
                ref={stepLabelRef}
                className="inline-block text-[10px] sm:text-xs md:text-sm font-sans font-semibold tracking-[0.3em] uppercase text-[#737373]"
                style={{ color: activeSlideData.accent }}
              >
                {activeSlideData.stepLabel}
              </span>

              {/* Main Garamond Heading */}
              <h1
                ref={titleRef}
                className="font-serif font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight leading-[1.08] text-[#1A1A1A]"
              >
                {activeSlideData.title}
              </h1>

              {/* Subtitle / Note Theme */}
              <h2
                ref={subtitleRef}
                className="font-sans font-medium text-[10px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-[#737373]"
              >
                {activeSlideData.subtitle}
              </h2>
            </div>

            {/* Detailed Narrative Body Copy */}
            <p
              ref={descriptionRef}
              className="font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed text-[#4A4A4A] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
            >
              {activeSlideData.description}
            </p>

            {/* Key Notes Badges */}
            <div ref={notesBadgeRef} className="flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 pt-0.5">
              {activeSlideData.keyNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[9px] sm:text-[11px] font-sans font-medium tracking-wider uppercase bg-black/5 text-[#1A1A1A] rounded-full border border-black/10 shadow-2xs"
                >
                  {note}
                </span>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div ref={actionBtnRef} className="flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
              <button
                onClick={handleNext}
                className="px-5 sm:px-7 py-3 sm:py-3.5 text-[11px] sm:text-xs font-sans font-semibold tracking-[0.25em] uppercase text-white bg-[#1A1A1A] rounded-full hover:bg-black hover:shadow-lg hover:shadow-black/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2 min-h-[44px]"
              >
                <span>{currentSlide === SLIDES.length - 1 ? 'REPLAY STORY' : 'NEXT NOTE'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Separate Page Details CTA Button */}
              <button
                onClick={() => setShowDetailsPage(true)}
                className="px-4 sm:px-6 py-3 sm:py-3.5 text-[11px] sm:text-xs font-sans font-semibold tracking-[0.25em] uppercase text-[#1A1A1A] bg-white border border-black/20 rounded-full hover:bg-black/5 hover:border-black/50 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2 shadow-xs min-h-[44px]"
              >
                <span>EXPLORE DETAILS</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal High-Fashion Bottom Navigation Bar */}
        <footer
          ref={stepperBarRef}
          className="relative z-20 w-full px-4 sm:px-8 md:px-12 py-3 sm:py-4 bg-gradient-to-t from-white/95 via-white/70 to-transparent flex items-center justify-between md:justify-end border-t border-black/5"
        >
          {/* Mobile Quick Note Stepper Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[55%] md:hidden pr-1">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Jump to note ${slide.id}`}
                className={`px-2.5 py-1 text-[10px] font-sans font-semibold tracking-wider rounded-full transition-all duration-300 shrink-0 ${currentSlide === idx
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-black/5 text-[#737373] hover:bg-black/10'
                  }`}
              >
                {slide.id}
              </button>
            ))}
          </div>

          {/* Directional Controls & Counter */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Fragrance Step"
              className="p-3 rounded-full border border-black/20 hover:border-black/60 hover:bg-black/5 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] shadow-xs min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-sans text-xs tracking-[0.2em] font-semibold text-[#1A1A1A] px-0.5">
              {activeSlideData.id} / 0{SLIDES.length}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next Fragrance Step"
              className="p-3 rounded-full border border-black/20 hover:border-black/60 hover:bg-black/5 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] shadow-xs min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </footer>
      </section>

      {/* Brand Heritage & Story Section (Right after Hero) */}
      <BrandStory
        onSelectNote={(idx) => {
          goToSlide(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />



      {/* The Sensory Ritual (Lifestyle & Usage) */}
      <SensoryRitual />

      {/* Haute Parfumerie Boutique (Products, Testimonials, Map & Footer) */}
      <OlfactoryExperience onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

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