import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import FragranceDetails from './FragranceDetails';
import SensoryRitual from './SensoryRitual';
import BrandStory from './BrandStory';
import OlfactoryExperience from './OlfactoryExperience';
import Navbar from './Navbar';
import Loader from './Loader';
import AccountModal from './AccountModal';
import { SLIDES } from '../utils/slidesData';
import { fetchHeroProducts } from '../services/api';
import { useCart } from '../context/CartContext';
const HERO_SVG = '/SVGs/Perfume-SVG.png';


// ──────────────────────────────────────────────────────────────────────────────
// Floating Fragrance Notes Badges Subcomponent
// ──────────────────────────────────────────────────────────────────────────────
function FloatingNotes({ slideData }) {
  if (!slideData || !slideData.keyNotes) return null;
  const notes = slideData.keyNotes;
  const accent = slideData.accent || '#059669';

  return (
    <>
      {/* Floating Note 1 - Top Left */}
      {notes[0] && (
        <div className="absolute top-[24%] -left-6 sm:-left-8 md:-left-12 lg:-left-16 z-20 animate-float-slow pointer-events-auto">
          <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white backdrop-blur-xl border border-black/10 rounded-full shadow-lg shadow-black/5 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-bold text-[9px] sm:text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-[#111111] whitespace-nowrap">
              {notes[0]}
            </span>
          </div>
        </div>
      )}

      {/* Floating Note 2 - Middle Right */}
      {notes[1] && (
        <div className="absolute top-[42%] -right-6 sm:-right-8 md:-right-12 lg:-right-16 z-20 animate-float-reverse pointer-events-auto">
          <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white backdrop-blur-xl border border-black/10 rounded-full shadow-lg shadow-black/5 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-bold text-[9px] sm:text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-[#111111] whitespace-nowrap">
              {notes[1]}
            </span>
          </div>
        </div>
      )}

      {/* Floating Note 3 - Bottom Left */}
      {notes[2] && (
        <div className="absolute bottom-[6%] -left-5 sm:-left-7 md:-left-10 lg:-left-14 z-20 animate-float-delayed pointer-events-auto">
          <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white backdrop-blur-xl border border-black/10 rounded-full shadow-lg shadow-black/5 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-bold text-[9px] sm:text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-[#111111] whitespace-nowrap">
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
function HeroProductImage({ loaderState, onModelLoaded, currentSlide, slideDirection, slidesList = SLIDES }) {
  const currentBottleRef = useRef(null);
  const incomingBottleRef = useRef(null);
  const activeSlideRef = useRef(currentSlide);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(currentSlide);
  const [incomingSlideIdx, setIncomingSlideIdx] = useState(currentSlide);

  const hasEntranceAnimatedRef = useRef(false);

  // Notify parent component that asset is ready
  useEffect(() => {
    if (onModelLoaded) {
      onModelLoaded();
    }
  }, [onModelLoaded]);

  // Initial loader entrance animation for product SVG flacon
  useEffect(() => {
    if (loaderState === 'loading') {
      hasEntranceAnimatedRef.current = false;
      if (currentBottleRef.current) {
        gsap.set(currentBottleRef.current, {
          y: 110,
          opacity: 0,
          scale: 0.85,
          rotation: -2,
          force3D: true,
        });
      }
    } else if ((loaderState === 'exiting' || loaderState === 'completed') && !hasEntranceAnimatedRef.current) {
      hasEntranceAnimatedRef.current = true;
      if (currentBottleRef.current) {
        const bottleEl = currentBottleRef.current;
        const imgEl = bottleEl.querySelector('img');
        const shadowEl = bottleEl.querySelector('.bg-black\\/20');

        const tl = gsap.timeline({
          delay: loaderState === 'exiting' ? 0.02 : 0,
          defaults: { ease: 'power4.out', force3D: true },
        });

        tl.to(
          bottleEl,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.35,
          },
          0
        );

        if (imgEl) {
          tl.fromTo(
            imgEl,
            { filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.05))' },
            { filter: 'drop-shadow(0px 25px 35px rgba(0,0,0,0.18))', duration: 1.35 },
            0
          );
        }

        if (shadowEl) {
          tl.fromTo(
            shadowEl,
            { opacity: 0, scale: 0.5 },
            { opacity: 0.3, scale: 1, duration: 1.2 },
            0.1
          );
        }
      }
    }
  }, [loaderState]);

  useEffect(() => {
    if (activeSlideRef.current === currentSlide) return;

    setIncomingSlideIdx(currentSlide);

    const currentEl = currentBottleRef.current;
    const incomingEl = incomingBottleRef.current;

    if (currentEl && incomingEl) {
      const isMobile = window.innerWidth < 768;
      const isNext = slideDirection === 'next';

      let exitX = 0;
      let exitY = 0;
      let entryX = 0;
      let entryY = 0;

      if (isMobile) {
        // Mobile view: horizontal transition
        // Next product: current goes out left (-100vw), new comes from right (100vw)
        // Prev product: current goes out right (100vw), new comes from left (-100vw)
        exitX = isNext ? '-100vw' : '100vw';
        entryX = isNext ? '100vw' : '-100vw';
      } else {
        // Desktop view: vertical transition
        exitY = isNext ? '-110vh' : '110vh';
        entryY = isNext ? '110vh' : '-110vh';
      }

      gsap.set(incomingEl, {
        x: entryX,
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
          gsap.set(currentEl, { x: 0, y: 0, opacity: 1, scale: 1 });
          gsap.set(incomingEl, { display: 'none', x: entryX, y: entryY });
        },
      });

      tl.to(
        currentEl,
        {
          x: exitX,
          y: exitY,
          duration: 0.8,
          ease: 'power2.inOut',
          force3D: true,
        },
        0
      );

      tl.to(
        incomingEl,
        {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          force3D: true,
        },
        0
      );
    } else {
      activeSlideRef.current = currentSlide;
      setCurrentSlideIdx(currentSlide);
    }
  }, [currentSlide, slideDirection]);

  const currentData = slidesList[currentSlideIdx] || slidesList[0];
  const incomingData = slidesList[incomingSlideIdx] || slidesList[0];

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Subtle Transparent Ambient Glow (Does not obscure background watermark text) */}
      <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] bg-radial from-black/5 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Active Product Flacon */}
      <div
        ref={currentBottleRef}
        className="absolute inset-0 flex flex-col items-center justify-center max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[460px] w-full mx-auto will-change-transform pt-6 sm:pt-8 md:pt-0"
      >
        <FloatingNotes slideData={currentData} />
        <img
          src={currentData?.image || HERO_SVG}
          alt={currentData?.title || "Lune Perfume Flacon"}
          className="w-auto h-[44vh] sm:h-[50vh] md:h-[58vh] lg:h-[65vh] xl:h-[70vh] max-h-[720px] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.15)] select-none pointer-events-none"
          draggable={false}
        />
        {/* Contact Shadow */}
        <div className="w-3/5 h-4 sm:h-5 bg-black/20 rounded-[100%] blur-md -mt-2 sm:-mt-4 pointer-events-none select-none opacity-25" />
      </div>

      {/* Incoming Product Flacon */}
      <div
        ref={incomingBottleRef}
        style={{ display: 'none' }}
        className="absolute inset-0 flex flex-col items-center justify-center max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[460px] w-full mx-auto will-change-transform pt-6 sm:pt-8 md:pt-0"
      >
        <FloatingNotes slideData={incomingData} />
        <img
          src={incomingData?.image || HERO_SVG}
          alt={incomingData?.title || "Lune Perfume Flacon"}
          className="w-auto h-[44vh] sm:h-[50vh] md:h-[58vh] lg:h-[65vh] xl:h-[70vh] max-h-[720px] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.15)] select-none pointer-events-none"
          draggable={false}
        />
        {/* Contact Shadow */}
        <div className="w-3/5 h-4 sm:h-5 bg-black/20 rounded-[100%] blur-md -mt-2 sm:-mt-4 pointer-events-none select-none opacity-25" />
      </div>
    </div>
  );
}

// Dynamic font scaling helper for background watermark text based on character length
const getWatermarkFontSize = (title = '') => {
  const len = (title || '').trim().length;
  if (!len || len <= 4) {
    return { fontSize: 'clamp(4.5rem, 17vw, 15rem)' };
  } else if (len <= 7) {
    return { fontSize: 'clamp(3.5rem, 13vw, 12rem)' };
  } else if (len <= 10) {
    return { fontSize: 'clamp(2.6rem, 10vw, 9.5rem)' };
  } else if (len <= 14) {
    return { fontSize: 'clamp(2.1rem, 7.8vw, 7.2rem)' };
  } else {
    return { fontSize: 'clamp(1.6rem, 5.8vw, 5.6rem)' };
  }
};

export default function HeroSlider({
  loaderKey,
  loaderState,
  isModelLoaded,
  onModelLoaded,
  onLoaderStartExit,
  onLoaderComplete,
  onReplayLoader,
}) {
  const navigate = useNavigate();
  const [slidesList, setSlidesList] = useState(SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [displayedSlideIndex, setDisplayedSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  // E-commerce state shared across top Navbar and Boutique via live CartContext
  const { cartItems, setCartItems, isCartOpen, setIsCartOpen, totalCartCount } = useCart();
  const [isAccountOpen, setIsAccountOpen] = useState(false);


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

  useEffect(() => {
    let isMounted = true;
    fetchHeroProducts().then((heroProds) => {
      if (isMounted && heroProds && heroProds.length > 0) {
        const dynamicSlides = heroProds.map((prod, index) => ({
          id: String(index + 1).padStart(2, '0'),
          productId: prod.id,
          shortTitle: prod.heroTitle || prod.name.split(' ')[0],
          stepLabel: prod.heroSubtitle || prod.subtitle || prod.category,
          title: prod.heroTitle || prod.name,
          subtitle: prod.heroSubtitle || prod.frenchName || prod.subtitle,
          oneLiner: prod.heroQuote || prod.description,
          tagline: prod.badge || 'HAUTE COUTURE',
          description: prod.description,
          bg: '#FFFFFF',
          text: '#111111',
          secondaryText: '#555555',
          accent: '#C08A3E',
          noteCategory: prod.category,
          keyNotes: [
            prod.heroNote1 || prod.notes?.top?.split(',')[0] || 'Galbanum',
            prod.heroNote2 || prod.notes?.heart?.split(',')[0] || 'Iris Pallida',
            prod.heroNote3 || prod.notes?.base?.split(',')[0] || 'Vetiver'
          ],
          image: prod.heroImageUrl || prod.image,
          pose: { rotation: [0, 0, 0] }
        }));
        setSlidesList(dynamicSlides);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const activeSlideData = slidesList[displayedSlideIndex] || slidesList[0];

  // Ref to prevent double-triggering the entrance animation
  const hasAnimatedRef = useRef(false);
  const entranceTimelineRef = useRef(null);
  const prevLoaderStateRef = useRef(null);

  // Unified entrance animation — single GSAP timeline for frame-locked synchronization.
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
      if (containerRef.current) {
        gsap.set(containerRef.current, { y: 100, opacity: 0.8 });
      }
      gsap.set(allElements, { opacity: 0, y: 50, clearProps: 'scale,filter,letterSpacing' });
      if (watermarkRef.current) {
        gsap.set(watermarkRef.current, { opacity: 0, scale: 0.92, y: 40 });
      }
    } else if ((loaderState === 'exiting' || loaderState === 'completed') && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;

      gsap.killTweensOf(allElements);
      if (containerRef.current) gsap.killTweensOf(containerRef.current);
      if (entranceTimelineRef.current) entranceTimelineRef.current.kill();

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', force3D: true },
      });
      entranceTimelineRef.current = tl;

      // 1. Whole Hero Section container rises smoothly from below in sync with loader curtain
      if (containerRef.current) {
        tl.to(
          containerRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
          },
          0
        );
      }

      // 2. Bottom Navigation Stepper Bar
      if (stepperBarRef.current) {
        tl.fromTo(
          stepperBarRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0 },
          0.05
        );
      }

      // 3. Background Watermark Text
      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { opacity: 0, scale: 0.94, y: 40 },
          { opacity: 0.35, scale: 1, y: 0, duration: 1.3, ease: 'power2.out' },
          0.05
        );
      }

      // 4. Step Label
      if (stepLabelRef.current) {
        tl.fromTo(
          stepLabelRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.0 },
          0.10
        );
      }

      // 5. Main Title
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 45, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power2.out' },
          0.15
        );
      }

      // 6. Subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.22
        );
      }

      // 7. Description Copy
      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.28
        );
      }

      // 8. Key Notes Badges
      if (notesBadgeRef.current) {
        tl.fromTo(
          notesBadgeRef.current,
          { opacity: 0, y: 30, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
          0.34
        );
      }

      // 9. Action CTA Buttons
      if (actionBtnRef.current) {
        tl.fromTo(
          actionBtnRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.40
        );
      }
    }
  }, [loaderState]);

  // Function to switch slides safely with GSAP timeline
  const goToSlide = useCallback(
    (targetIndex) => {
      const len = slidesList.length;
      if (len === 0 || isTransitioning || targetIndex === currentSlide) return;
      if (targetIndex < 0 || targetIndex >= len) return;

      const isNext = targetIndex > currentSlide 
        ? (currentSlide === 0 && targetIndex === len - 1 ? false : true)
        : (currentSlide === len - 1 && targetIndex === 0 ? true : false);

      setSlideDirection(isNext ? 'next' : 'prev');
      setIsTransitioning(true);
      setCurrentSlide(targetIndex);

      const targetSlideData = slidesList[targetIndex];

      // 1. GSAP Background Color Morph Transition
      if (containerRef.current && targetSlideData) {
        gsap.to(containerRef.current, {
          backgroundColor: targetSlideData.bg || '#FFFFFF',
          color: targetSlideData.text || '#111111',
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
    [currentSlide, isTransitioning, slidesList]
  );

  const handleNext = useCallback(() => {
    const len = slidesList.length;
    if (len === 0) return;
    setSlideDirection('next');
    const nextIndex = (currentSlide + 1) % len;
    goToSlide(nextIndex);
  }, [currentSlide, goToSlide, slidesList]);

  const handlePrev = useCallback(() => {
    const len = slidesList.length;
    if (len === 0) return;
    setSlideDirection('prev');
    const prevIndex = (currentSlide - 1 + len) % len;
    goToSlide(prevIndex);
  }, [currentSlide, goToSlide, slidesList]);

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
        if (slidesList.length > 0) goToSlide(slidesList.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, goToSlide, showDetailsPage, slidesList]);

  if (!activeSlideData) return null;

  return (
    <div className="w-full flex flex-col">
      {/* Standalone Smooth Loader Overlay */}
      {loaderState !== 'completed' && (
        <Loader
          key={loaderKey}
          isModelLoaded={isModelLoaded}
          onStartExit={onLoaderStartExit}
          onComplete={onLoaderComplete}
        />
      )}

      {/* Hero Showcase Section */}
      <section
        id="hero"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[100dvh] md:min-h-screen flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 touch-pan-y"
        style={{ backgroundColor: activeSlideData.bg || '#FFFFFF', color: activeSlideData.text || '#111111' }}
        aria-label="Lune Interactive Fragrance Showcase"
      >
        {/* Large Background Watermark Text — Dynamically proportioned based on word length */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center md:justify-end md:pr-6 lg:pr-10 overflow-hidden select-none px-4 pt-20 sm:pt-28 md:pt-32 lg:pt-36 translate-y-8 sm:translate-y-12 md:translate-y-14">
          <h1
            ref={watermarkRef}
            style={getWatermarkFontSize(activeSlideData.shortTitle || activeSlideData.title)}
            className="font-serif font-black leading-none text-[#D8D8DC] tracking-tighter uppercase whitespace-nowrap will-change-transform select-none text-center md:text-right"
          >
            {activeSlideData.shortTitle || activeSlideData.title}
          </h1>
        </div>

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
              slidesList={slidesList}
            />
          </div>

          {/* Editorial Content Panel (order-last on mobile centered under 3D model, order-first on desktop/iPad) */}
          <div className="w-full md:w-[54%] lg:w-[46%] flex flex-col items-center md:items-start text-center md:text-left justify-center gap-3 sm:gap-5 md:gap-6 pointer-events-auto order-last md:order-first px-1 md:px-0">

            <div ref={textGroupRef} className="flex flex-col items-center md:items-start gap-1.5 sm:gap-2.5">
              {/* Main Display Heading */}
              <h1
                ref={titleRef}
                className="font-serif font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.02] text-[#111111] uppercase"
              >
                {activeSlideData.title}
              </h1>

              {/* Subtitle / Note Theme */}
              <h2
                ref={subtitleRef}
                className="font-sans font-extrabold text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase text-[#555555]"
              >
                {activeSlideData.subtitle}
              </h2>

              {/* High-Fashion Editorial 1-Liner Quote */}
              <p
                ref={descriptionRef}
                className="font-serif italic font-normal text-xs sm:text-sm md:text-base text-[#444444] leading-relaxed max-w-xs sm:max-w-sm md:max-w-md pt-1"
              >
                “{activeSlideData.oneLiner}”
              </p>
            </div>

            {/* Action CTA Buttons */}
            <div ref={actionBtnRef} className="flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-3 pt-2">
              <button
                onClick={handleNext}
                className="px-5 sm:px-6.5 py-2.5 sm:py-3 text-[10.5px] sm:text-xs font-sans font-extrabold tracking-[0.2em] uppercase text-white bg-[#111111] hover:bg-black rounded-full transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2 shadow-xs min-h-[40px] sm:min-h-[44px]"
              >
                <span>{currentSlide === slidesList.length - 1 ? 'REPLAY STORY' : 'NEXT NOTE'}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Separate Page Details CTA Button (Black & White Hover) */}
              <button
                onClick={() => {
                  const targetId = activeSlideData?.productId || activeSlideData?.id || 'p1';
                  navigate(`/product/${targetId}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 text-[10.5px] sm:text-xs font-sans font-extrabold tracking-[0.2em] uppercase text-[#111111] hover:bg-[#111111] hover:text-white bg-white border border-black/20 rounded-full transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2 shadow-2xs group min-h-[40px] sm:min-h-[44px]"
              >
                <span>EXPLORE DETAILS</span>
                <svg className="w-3.5 h-3.5 text-[#111111] group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {activeSlideData.id} / {String(slidesList.length || 1).padStart(2, '0')}
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

      {/* Haute Parfumerie Boutique (Featured Products, Testimonials, Map & Footer) */}
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