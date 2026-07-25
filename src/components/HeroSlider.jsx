import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import FragranceDetails from './FragranceDetails';
import SensoryRitual from './SensoryRitual';
import BrandStory from './BrandStory';
import OlfactoryExperience from './OlfactoryExperience';
import Navbar from './Navbar';
import AccountModal from './AccountModal';
import { SLIDES } from '../utils/slidesData';

const HERO_SVG = '/SVGs/Perfume-SVG.png';

// ──────────────────────────────────────────────────────────────────────────────
// Floating Fragrance Notes Badges Subcomponent
// ──────────────────────────────────────────────────────────────────────────────
function FloatingNotes({ slideData }) {
  if (!slideData || !slideData.keyNotes) return null;
  const notes = slideData.keyNotes;
  const accent = slideData.accent || '#8A9A86';

  return (
    <>
      {/* Floating Note 1 - Top Left (Lowered clear of watermark text) */}
      {notes[0] && (
        <div className="absolute top-[26%] -left-6 sm:-left-8 md:-left-12 lg:-left-16 z-20 animate-float-slow pointer-events-auto">
          <div className="px-2 py-0.5 sm:px-3.5 sm:py-1.5 bg-white/85 backdrop-blur-md border border-white/90 rounded-full shadow-md shadow-black/5 flex items-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-105 hover:bg-white/95">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-semibold text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] uppercase text-[#1A1A1A] whitespace-nowrap">
              {notes[0]}
            </span>
          </div>
        </div>
      )}

      {/* Floating Note 2 - Middle Right (Pushed out into wide right margin) */}
      {notes[1] && (
        <div className="absolute top-[42%] -right-6 sm:-right-8 md:-right-12 lg:-right-16 z-20 animate-float-reverse pointer-events-auto">
          <div className="px-2 py-0.5 sm:px-3.5 sm:py-1.5 bg-white/85 backdrop-blur-md border border-white/90 rounded-full shadow-md shadow-black/5 flex items-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-105 hover:bg-white/95">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-semibold text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] uppercase text-[#1A1A1A] whitespace-nowrap">
              {notes[1]}
            </span>
          </div>
        </div>
      )}

      {/* Floating Note 3 - Bottom Left (Pushed out into wide left margin) */}
      {notes[2] && (
        <div className="absolute bottom-[6%] -left-5 sm:-left-7 md:-left-10 lg:-left-14 z-20 animate-float-delayed pointer-events-auto">
          <div className="px-2 py-0.5 sm:px-3.5 sm:py-1.5 bg-white/85 backdrop-blur-md border border-white/90 rounded-full shadow-md shadow-black/5 flex items-center gap-1 sm:gap-2 transition-all duration-300 hover:scale-105 hover:bg-white/95">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-semibold text-[8px] sm:text-[10px] md:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] uppercase text-[#1A1A1A] whitespace-nowrap">
              {notes[2]}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SVG Product Image Hero Component - Clean Presentation with Responsive Motion
// ──────────────────────────────────────────────────────────────────────────────
function HeroProductImage({ loaderState, onModelLoaded, currentSlide, slideDirection }) {
  const currentBottleRef = useRef(null);
  const incomingBottleRef = useRef(null);
  const activeSlideRef = useRef(currentSlide);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(currentSlide);
  const [incomingSlideIdx, setIncomingSlideIdx] = useState(currentSlide);

  // Notify parent component that asset is ready
  useEffect(() => {
    if (onModelLoaded) {
      onModelLoaded();
    }
  }, [onModelLoaded]);

  useEffect(() => {
    if (activeSlideRef.current === currentSlide) return;

    setIncomingSlideIdx(currentSlide);

    const isNext = slideDirection === 'next';
    const isMobile = window.innerWidth < 768;

    const currentEl = currentBottleRef.current;
    const incomingEl = incomingBottleRef.current;

    if (currentEl && incomingEl) {
      if (isMobile) {
        // Mobile horizontal slide animation:
        // isNext: current product goes left out of screen (-100vw), incoming product enters from right (100vw)
        // isPrev: current product goes right out of screen (100vw), incoming product enters from left (-100vw)
        const exitX = isNext ? '-100vw' : '100vw';
        const entryX = isNext ? '100vw' : '-100vw';

        gsap.set(incomingEl, {
          x: entryX,
          y: 0,
          opacity: 1,
          scale: 1,
          display: 'flex',
        });

        gsap.set(currentEl, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            activeSlideRef.current = currentSlide;
            setCurrentSlideIdx(currentSlide);
            // Snap current bottle back to center x: 0, y: 0
            gsap.set(currentEl, { x: 0, y: 0, opacity: 1, scale: 1 });
            // Hide temporary incoming bottle off-screen
            gsap.set(incomingEl, { display: 'none', x: entryX, y: 0 });
          },
        });

        tl.to(currentEl, {
          x: exitX,
          duration: 0.7,
          ease: 'power2.inOut',
          force3D: true,
        }, 0);

        tl.to(incomingEl, {
          x: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          force3D: true,
        }, 0);
      } else {
        // Desktop & iPad vertical slide animation along single vertical line
        const exitY = isNext ? '-110vh' : '110vh';
        const entryY = isNext ? '110vh' : '-110vh';

        gsap.set(incomingEl, {
          x: 0,
          y: entryY,
          opacity: 1,
          scale: 1,
          display: 'flex',
        });

        gsap.set(currentEl, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            activeSlideRef.current = currentSlide;
            setCurrentSlideIdx(currentSlide);
            // Snap current bottle back to center y: 0
            gsap.set(currentEl, { x: 0, y: 0, opacity: 1, scale: 1 });
            // Hide temporary incoming bottle off-screen
            gsap.set(incomingEl, { display: 'none', x: 0, y: entryY });
          },
        });

        tl.to(currentEl, {
          y: exitY,
          duration: 0.8,
          ease: 'power2.inOut',
          force3D: true,
        }, 0);

        tl.to(incomingEl, {
          y: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          force3D: true,
        }, 0);
      }
    } else {
      activeSlideRef.current = currentSlide;
      setCurrentSlideIdx(currentSlide);
    }
  }, [currentSlide, slideDirection]);

  const currentData = SLIDES[currentSlideIdx] || SLIDES[0];
  const incomingData = SLIDES[incomingSlideIdx] || SLIDES[0];

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Active Product Flacon */}
      <div
        ref={currentBottleRef}
        className="absolute inset-0 flex flex-col items-center justify-center max-w-[250px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] w-full mx-auto will-change-transform pt-14 sm:pt-16 md:pt-0"
      >
        <FloatingNotes slideData={currentData} />
        <img
          src={HERO_SVG}
          alt="Chanel N°19 Perfume Flacon"
          className="w-auto h-[36vh] sm:h-[42vh] md:h-[50vh] lg:h-[58vh] max-h-[620px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] select-none pointer-events-none"
          draggable={false}
        />
        {/* Contact Shadow */}
        <div className="w-3/5 h-4 sm:h-5 bg-black/20 rounded-[100%] blur-md -mt-2 sm:-mt-4 pointer-events-none select-none opacity-30" />
      </div>

      {/* Incoming Product Flacon */}
      <div
        ref={incomingBottleRef}
        style={{ display: 'none' }}
        className="absolute inset-0 flex flex-col items-center justify-center max-w-[250px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] w-full mx-auto will-change-transform pt-14 sm:pt-16 md:pt-0"
      >
        <FloatingNotes slideData={incomingData} />
        <img
          src={HERO_SVG}
          alt="Chanel N°19 Perfume Flacon"
          className="w-auto h-[36vh] sm:h-[42vh] md:h-[50vh] lg:h-[58vh] max-h-[620px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] select-none pointer-events-none"
          draggable={false}
        />
        {/* Contact Shadow */}
        <div className="w-3/5 h-4 sm:h-5 bg-black/20 rounded-[100%] blur-md -mt-2 sm:-mt-4 pointer-events-none select-none opacity-30" />
      </div>
    </div>
  );
}

export default function HeroSlider({ onReplayLoader, loaderState, onModelLoaded }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [displayedSlideIndex, setDisplayedSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  // E-commerce state shared across top Navbar and Boutique
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

      const isNext = targetIndex > currentSlide 
        ? (currentSlide === 0 && targetIndex === SLIDES.length - 1 ? false : true)
        : (currentSlide === SLIDES.length - 1 && targetIndex === 0 ? true : false);

      setSlideDirection(isNext ? 'next' : 'prev');
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
    setSlideDirection('next');
    const nextIndex = (currentSlide + 1) % SLIDES.length;
    goToSlide(nextIndex);
  }, [currentSlide, goToSlide]);

  const handlePrev = useCallback(() => {
    setSlideDirection('prev');
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
      {/* Top Floating Luxury Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Account VIP Drawer Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Showcase Section */}
      <section
        id="hero"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[100dvh] md:min-h-screen flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 touch-pan-y"
        style={{ backgroundColor: SLIDES[0].bg, color: SLIDES[0].text }}
        aria-label="Chanel N°19 Interactive Fragrance Showcase"
      >
        {/* Large Background Watermark Text */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-start pt-24 sm:pt-28 md:items-center md:pt-0 justify-center md:justify-end md:pl-0 md:pr-8 lg:pr-12 overflow-hidden select-none">
          <h1
            ref={watermarkRef}
            className="font-serif font-extrabold text-[15vw] sm:text-[14vw] md:text-[11vw] lg:text-[13vw] xl:text-[15vw] leading-none text-black/20 sm:text-black/30 md:text-black/35 lg:text-black/22 tracking-tighter uppercase whitespace-nowrap will-change-transform"
          >
            {activeSlideData.shortTitle}
          </h1>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* 3D WebGL Canvas Layer — COMMENTED OUT (client requested     */}
        {/* SVG product image). Uncomment below + the Scene import      */}
        {/* at top of file to restore the WebGL 3D model.               */}
        {/* ──────────────────────────────────────────────────────────── */}
        {/* <Scene currentSlide={currentSlide} slideData={SLIDES[currentSlide]} loaderState={loaderState} onModelLoaded={onModelLoaded} /> */}

        {/* Main Split Screen Content Area */}
        <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-6 pt-20 sm:pt-24 md:pt-28 lg:pt-20 pb-4 sm:pb-6 md:pb-10 pointer-events-none">

          {/* Right Product Showcase Panel (Scoped strictly to right side of Hero) */}
          <div className="relative w-full md:w-[46%] lg:w-[54%] h-[40vh] min-h-[260px] sm:h-[46vh] md:h-[65vh] flex items-center justify-center pointer-events-auto order-first md:order-last shrink-0 overflow-visible">
            <HeroProductImage
              loaderState={loaderState}
              onModelLoaded={onModelLoaded}
              currentSlide={currentSlide}
              isTransitioning={isTransitioning}
              slideDirection={slideDirection}
            />
          </div>

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
            <div ref={notesBadgeRef} className="flex flex-wrap justify-center md:justify-start gap-1 sm:gap-2 pt-0.5">
              {activeSlideData.keyNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-[8.5px] sm:text-[10px] font-sans font-medium tracking-widest uppercase bg-black/5 text-[#4A4A4A] rounded-full border border-black/10"
                >
                  {note}
                </span>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div ref={actionBtnRef} className="flex flex-wrap justify-center md:justify-start items-center gap-1.5 sm:gap-3 pt-1">
              <button
                onClick={handleNext}
                className="px-3.5 sm:px-6 py-2 sm:py-3 text-[10px] sm:text-xs font-sans font-semibold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] rounded-full hover:bg-black hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-1.5 min-h-[36px] sm:min-h-[42px]"
              >
                <span>{currentSlide === SLIDES.length - 1 ? 'REPLAY STORY' : 'NEXT NOTE'}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Separate Page Details CTA Button */}
              <button
                onClick={() => setShowDetailsPage(true)}
                className="px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[#1A1A1A] bg-white/90 border border-black/20 rounded-full hover:bg-black/5 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-2xs min-h-[36px] sm:min-h-[42px]"
              >
                <span>EXPLORE DETAILS</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal High-Fashion Bottom Navigation Bar */}
        <footer
          ref={stepperBarRef}
          className="relative z-20 w-full px-4 sm:px-8 md:px-12 py-2 sm:py-3.5 bg-gradient-to-t from-white/95 via-white/70 to-transparent flex items-center justify-center md:justify-end border-t border-black/5"
        >
          {/* Directional Controls & Counter */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Fragrance Step"
              className="p-2 sm:p-2.5 rounded-full border border-black/20 hover:border-black/60 hover:bg-black/5 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] min-w-[36px] min-h-[36px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="font-sans text-[11px] sm:text-xs tracking-[0.2em] font-semibold text-[#1A1A1A] px-1">
              {activeSlideData.id} / 0{SLIDES.length}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next Fragrance Step"
              className="p-2 sm:p-2.5 rounded-full border border-black/20 hover:border-black/60 hover:bg-black/5 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] min-w-[36px] min-h-[36px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </footer>
      </section>

      {/* Brand Heritage & Story Section (Right after Hero) */}
      <div id="about" className="scroll-mt-24">
        <BrandStory
          onSelectNote={(idx) => {
            goToSlide(idx);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {/* The Sensory Ritual (Lifestyle & Usage) */}
      <div id="services" className="scroll-mt-24">
        <SensoryRitual />
      </div>

      {/* Haute Parfumerie Boutique (Products, Testimonials, Map & Footer) */}
      <OlfactoryExperience
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        cartItems={cartItems}
        setCartItems={setCartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
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