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
        <div className="absolute top-[18%] -left-2 sm:-left-4 md:left-0 lg:left-4 z-20 animate-float-slow pointer-events-auto">
          <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-xl border border-black/10 rounded-full shadow-lg shadow-black/5 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-bold text-[9px] sm:text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-[#111111] whitespace-nowrap">
              {notes[0]}
            </span>
          </div>
        </div>
      )}

      {/* Floating Note 2 - Middle Right */}
      {notes[1] && (
        <div className="absolute top-[42%] -right-2 sm:-right-4 md:right-0 lg:right-4 z-20 animate-float-reverse pointer-events-auto">
          <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-xl border border-black/10 rounded-full shadow-lg shadow-black/5 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <span className="font-sans font-bold text-[9px] sm:text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-[#111111] whitespace-nowrap">
              {notes[1]}
            </span>
          </div>
        </div>
      )}

      {/* Floating Note 3 - Bottom Left */}
      {notes[2] && (
        <div className="absolute bottom-[10%] -left-1 sm:-left-3 md:left-2 lg:left-6 z-20 animate-float-delayed pointer-events-auto">
          <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-xl border border-black/10 rounded-full shadow-lg shadow-black/5 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
      {/* Subtle Transparent Ambient Glow */}
      <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[520px] lg:h-[520px] bg-radial from-black/5 to-transparent rounded-full blur-3xl opacity-25 pointer-events-none" />

      {/* Active Product Flacon */}
      <div
        ref={currentBottleRef}
        className="absolute inset-0 flex flex-col items-center justify-center max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[540px] w-full mx-auto will-change-transform"
      >
        {/* <FloatingNotes slideData={currentData} /> */}
        <img
          src={currentData?.image || HERO_SVG}
          alt={currentData?.title || "Lune Perfume Flacon"}
          className="w-auto min-h-[280px] h-[50vh] sm:h-[52vh] md:h-[60vh] lg:h-[66vh] xl:h-[72vh] max-h-[780px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.14)] select-none pointer-events-none"
          draggable={false}
        />
        {/* Contact Shadow */}
        <div className="w-2/5 h-3 sm:h-4 bg-black/15 rounded-[100%] blur-md -mt-1 sm:-mt-2 pointer-events-none select-none opacity-30" />
      </div>

      {/* Incoming Product Flacon */}
      <div
        ref={incomingBottleRef}
        style={{ display: 'none' }}
        className="absolute inset-0 flex flex-col items-center justify-center max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[540px] w-full mx-auto will-change-transform"
      >
        {/* <FloatingNotes slideData={incomingData} /> */}
        <img
          src={incomingData?.image || HERO_SVG}
          alt={incomingData?.title || "Lune Perfume Flacon"}
          className="w-auto min-h-[280px] h-[50vh] sm:h-[52vh] md:h-[60vh] lg:h-[66vh] xl:h-[72vh] max-h-[780px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.14)] select-none pointer-events-none"
          draggable={false}
        />
        {/* Contact Shadow */}
        <div className="w-2/5 h-3 sm:h-4 bg-black/15 rounded-[100%] blur-md -mt-1 sm:-mt-2 pointer-events-none select-none opacity-30" />
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

    // Always force refresh from API to guarantee fresh live data from database
    fetchHeroProducts(true).then((heroProds) => {
      if (!isMounted) return;

      let slidesToSet = SLIDES;
      if (heroProds && heroProds.length > 0) {
        slidesToSet = heroProds.map((prod, index) => ({
          id: String(index + 1).padStart(2, '0'),
          productId: prod.id,
          shortTitle: prod.name,
          stepLabel: prod.heroSubtitle || prod.subtitle || prod.category,
          title: prod.name,
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
      }

      setSlidesList(slidesToSet);

      // Preload primary hero bottle image before telling loader we're ready
      const mainHeroImg = slidesToSet[0]?.image;
      if (mainHeroImg) {
        const img = new Image();
        img.src = mainHeroImg;
        img.onload = () => { if (isMounted && onModelLoaded) onModelLoaded(); };
        img.onerror = () => { if (isMounted && onModelLoaded) onModelLoaded(); };
      } else {
        if (onModelLoaded) onModelLoaded();
      }
    }).catch(err => {
      console.error('Error loading live hero products:', err);
      if (isMounted && onModelLoaded) onModelLoaded();
    });

    return () => { isMounted = false; };
  }, [onModelLoaded]);

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
      gsap.set(allElements, { opacity: 0, y: 60, clearProps: 'scale,filter,letterSpacing' });
      if (watermarkRef.current) {
        gsap.set(watermarkRef.current, { opacity: 0, scale: 0.88, y: 50 });
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

      // 1. Whole Hero Section container rises smoothly from below
      if (containerRef.current) {
        tl.to(
          containerRef.current,
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
          0
        );
      }

      // 2. Bottom Navigation Dots
      if (stepperBarRef.current) {
        tl.fromTo(
          stepperBarRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
          0.08
        );
      }

      // 3. Background Watermark Text — scale + fade in
      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { opacity: 0, scale: 0.90, y: 50 },
          { opacity: 0.35, scale: 1, y: 0, duration: 1.4, ease: 'power2.out' },
          0.05
        );
      }

      // 4. Main Title — dramatic rise with slight scale
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 55, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' },
          0.12
        );
      }

      // 5. Subtitle — elegant fade-up
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30, letterSpacing: '0.15em' },
          { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 1.0, ease: 'power2.out' },
          0.28
        );
      }

      // 6. Description (hidden but animate for consistency)
      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          0.32
        );
      }

      // 7. Action CTA Buttons — staggered pop-in
      if (actionBtnRef.current) {
        // Reset parent container visibility first (it was set to opacity:0 in the initial state)
        tl.set(actionBtnRef.current, { opacity: 1, y: 0 }, 0.38);
        const buttons = actionBtnRef.current.querySelectorAll('button');
        if (buttons.length > 0) {
          tl.fromTo(
            buttons,
            { opacity: 0, y: 30, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.1, ease: 'back.out(1.4)' },
            0.38
          );
        } else {
          tl.fromTo(
            actionBtnRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
            0.38
          );
        }
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
            duration: 0.4,
            ease: 'power2.in',
          })
          .set(watermarkRef.current, { x: entryX, opacity: 0 })
          .to(watermarkRef.current, {
            x: 0,
            opacity: 0.35,
            duration: 0.55,
            ease: 'power2.out',
          });
      }

      // 3. Editorial Content — Staggered exit then rich staggered entrance
      const outTl = gsap.timeline({
        onComplete: () => {
          setDisplayedSlideIndex(targetIndex);

          // Staggered entrance — each element animates individually
          requestAnimationFrame(() => {
            const inTl = gsap.timeline({
              onComplete: () => setIsTransitioning(false),
            });

            // Title sweeps up with scale
            if (titleRef.current) {
              inTl.fromTo(
                titleRef.current,
                { opacity: 0, y: 40, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'expo.out' },
                0
              );
            }

            // Subtitle fades up with letter-spacing bloom
            if (subtitleRef.current) {
              inTl.fromTo(
                subtitleRef.current,
                { opacity: 0, y: 22, letterSpacing: '0.12em' },
                { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 0.65, ease: 'power3.out' },
                0.1
              );
            }

            // Description (hidden ref)
            if (descriptionRef.current) {
              inTl.fromTo(
                descriptionRef.current,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                0.16
              );
            }

            // Buttons pop in with bounce
            if (actionBtnRef.current) {
              // Reset parent container visibility (exit animation hides it)
              inTl.set(actionBtnRef.current, { opacity: 1, y: 0 }, 0.2);
              const buttons = actionBtnRef.current.querySelectorAll('button');
              if (buttons.length > 0) {
                inTl.fromTo(
                  buttons,
                  { opacity: 0, y: 20, scale: 0.9 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: 'back.out(1.6)' },
                  0.2
                );
              } else {
                inTl.fromTo(
                  actionBtnRef.current,
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                  0.2
                );
              }
            }
          });
        },
      });

      // Staggered exit — title first, then subtitle, then buttons
      if (titleRef.current) {
        outTl.to(titleRef.current, {
          opacity: 0, y: -18, duration: 0.28, ease: 'power2.in',
        }, 0);
      }

      if (subtitleRef.current) {
        outTl.to(subtitleRef.current, {
          opacity: 0, y: -12, duration: 0.25, ease: 'power2.in',
        }, 0.04);
      }

      if (descriptionRef.current) {
        outTl.to(descriptionRef.current, {
          opacity: 0, y: -8, duration: 0.22, ease: 'power2.in',
        }, 0.06);
      }

      if (actionBtnRef.current) {
        outTl.to(actionBtnRef.current, {
          opacity: 0, y: -8, duration: 0.22, ease: 'power2.in',
        }, 0.08);
      }
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
        {/* Large Background Watermark Text — Seamless centered luxury backdrop across entire Hero */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden select-none px-4 pt-16 sm:pt-20 md:pt-12">
          <h1
            ref={watermarkRef}
            style={getWatermarkFontSize(activeSlideData.shortTitle || activeSlideData.title)}
            className="font-serif font-black leading-none text-[#E5E5E8] tracking-tighter uppercase whitespace-nowrap will-change-transform select-none text-center"
          >
            {activeSlideData.shortTitle || activeSlideData.title}
          </h1>
        </div>

        {/* Main Split Screen Content Area */}
        <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-5 sm:px-8 md:px-10 lg:px-14 flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 pt-16 sm:pt-20 md:pt-24 lg:pt-16 pb-4 sm:pb-6 md:pb-8 pointer-events-none">

          {/* Right Product Showcase Panel */}
          <div className="relative w-full md:w-[50%] lg:w-[55%] h-[46vh] min-h-[300px] sm:h-[50vh] sm:min-h-[340px] md:h-[68vh] md:min-h-[420px] flex items-center justify-center pointer-events-auto order-first md:order-last shrink-0 overflow-visible">
            <HeroProductImage
              loaderState={loaderState}
              onModelLoaded={onModelLoaded}
              currentSlide={currentSlide}
              isTransitioning={isTransitioning}
              slideDirection={slideDirection}
              slidesList={slidesList}
            />
          </div>

          {/* Editorial Content Panel — Name + Subtitle + CTAs */}
          <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col items-center md:items-start text-center md:text-left justify-center gap-5 sm:gap-6 md:gap-8 pointer-events-auto order-last md:order-first px-2 sm:px-4 md:px-0">

            <div ref={textGroupRef} className="flex flex-col items-center md:items-start gap-2.5 sm:gap-3">
              {/* Main Display Heading — uses shortTitle for consistency */}
              <h1
                ref={titleRef}
                className="font-serif font-black text-[2.2rem] sm:text-5xl md:text-[3.5rem] lg:text-6xl xl:text-7xl tracking-tight leading-[1.05] text-[#111111] uppercase"
              >
                {activeSlideData.shortTitle || activeSlideData.title}
              </h1>

              {/* Elegant Subtitle Tagline */}
              <h2
                ref={subtitleRef}
                className="font-sans font-medium text-[10px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-[#888888]"
              >
                {activeSlideData.subtitle}
              </h2>

              {/* Hidden ref to prevent GSAP null errors */}
              <span ref={descriptionRef} className="hidden" />
            </div>

            {/* Action CTA Buttons */}
            <div ref={actionBtnRef} className="flex flex-row items-center gap-3 sm:gap-3.5">
              <button
                onClick={handleNext}
                className="px-5 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-white bg-[#111111] hover:bg-black rounded-full transition-all duration-200 cursor-pointer active:scale-[0.97] flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-h-[40px] sm:min-h-[44px]"
              >
                <span>{currentSlide === slidesList.length - 1 ? 'REPLAY' : 'NEXT NOTE'}</span>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={() => {
                  const targetId = activeSlideData?.productId || activeSlideData?.id || 'p1';
                  navigate(`/product/${targetId}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#111111] hover:bg-[#111111] hover:text-white bg-white border border-black/12 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm hover:shadow-md group min-h-[40px] sm:min-h-[44px]"
              >
                <span>SHOP NOW</span>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Navigation — Dot Indicators + Arrows */}
        <footer
          ref={stepperBarRef}
          className="relative z-20 w-full px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex items-center justify-center md:justify-end"
        >
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              aria-label="Previous Fragrance"
              className="p-2 sm:p-2.5 rounded-full border border-black/15 hover:border-black/50 hover:bg-black/5 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {slidesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${idx === displayedSlideIndex
                      ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-[#111111]'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-black/20 hover:bg-black/40'
                    }`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next Fragrance"
              className="p-2 sm:p-2.5 rounded-full border border-black/15 hover:border-black/50 hover:bg-black/5 transition-all duration-300 cursor-pointer active:scale-95 text-[#1A1A1A] min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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