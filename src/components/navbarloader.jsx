import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/Logo.png';

const BRAND = ['L', 'U', 'N', 'E'];

const navLinks = [
  { id: 'hero', label: 'Homepage', targetId: 'hero' },
  { id: 'about', label: 'About', targetId: 'about' },
  { id: 'products', label: 'Services/Products', targetId: 'products' },
  { id: 'contact', label: 'Contact', targetId: 'contact' },
  { id: 'gallery', label: 'Gallery/FAQ', targetId: 'gallery' },
];

export default function NavbarLoader({
  loaderState = 'loading',
  isModelLoaded = false,
  onStartExit,
  onComplete,
  cartCount = 0,
  onOpenCart,
  onOpenAccount,
  onReplayLoader,
}) {
  // Active Scroll & Navigation States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Completed status flag with session memory check
  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      return loaderState === 'completed' || !!sessionStorage.getItem('perfume_has_visited');
    } catch {
      return loaderState === 'completed';
    }
  });

  // Element Refs
  const loaderOverlayRef = useRef(null);
  const loaderCounterRef = useRef(null);
  const loaderBrandGroupRef = useRef(null);
  const subTitleRef = useRef(null);
  const navContentRef = useRef(null);

  const onStartExitRef = useRef(onStartExit);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onStartExitRef.current = onStartExit;
    onCompleteRef.current = onComplete;
  }, [onStartExit, onComplete]);

  // -------------------------------------------------------------
  // 1. SCROLL LISTENER & ACTIVE SECTION OBSERVER (Active when completed)
  // -------------------------------------------------------------
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!isCompleted) return;

      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      // Smart header hide on scroll down, reveal on scroll up
      if (currentScrollY <= 20) {
        setIsNavHidden(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsNavHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setIsNavHidden(false);
      }
      lastScrollY = currentScrollY;

      // Scroll progress percentage
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);

      // Section tracking for active highlights
      const sections = navLinks.map((link) => document.getElementById(link.targetId)).filter(Boolean);
      let currentActive = 'hero';

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= 100) {
          currentActive = sec.id;
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCompleted]);

  // -------------------------------------------------------------
  // 2. SEAMLESS & LUXURIOUS MORPHING ANIMATION
  // -------------------------------------------------------------
  useEffect(() => {
    if (isCompleted) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const letterEls = loaderBrandGroupRef.current
        ? loaderBrandGroupRef.current.querySelectorAll('.loader-char')
        : [];

      // Initial GSAP setup
      if (letterEls.length > 0) {
        gsap.set(letterEls, {
          yPercent: 105,
          opacity: 0,
          force3D: true,
          willChange: 'transform, opacity',
        });
      }

      if (loaderCounterRef.current) {
        gsap.set(loaderCounterRef.current, {
          opacity: 0,
          y: 10,
          force3D: true,
        });
      }

      if (navContentRef.current) {
        gsap.set(navContentRef.current, { opacity: 0, y: -10 });
      }

      if (subTitleRef.current) {
        gsap.set(subTitleRef.current, { opacity: 0, y: 6 });
      }

      const progressObj = { value: 0 };
      let lastValue = -1;

      const mainTl = gsap.timeline();

      // 1. Counter fade in at bottom center
      if (loaderCounterRef.current) {
        mainTl.to(
          loaderCounterRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          0
        );
      }

      // 2. Grand staggered reveal of "P E R F U M E" at screen center
      if (letterEls.length > 0) {
        mainTl.to(
          letterEls,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.07,
            ease: 'power4.out',
          },
          0.1
        );
      }

      // 3. Smooth numerical progress 0% -> 100% over 2.0s
      mainTl.to(
        progressObj,
        {
          value: 100,
          duration: 2.0,
          ease: 'power1.out',
          onUpdate: () => {
            const currentVal = Math.round(progressObj.value);
            if (currentVal !== lastValue) {
              lastValue = currentVal;
              if (loaderCounterRef.current) {
                loaderCounterRef.current.textContent = `${currentVal}%`;
              }
            }
          },
        },
        0
      );

      // 4. Subtitle fade in under PERFUME
      if (subTitleRef.current) {
        mainTl.to(
          subTitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.8
        );
      }

      // 5. Counter gentle fade out at 100%
      if (loaderCounterRef.current) {
        mainTl.to(
          loaderCounterRef.current,
          {
            opacity: 0,
            y: -12,
            duration: 0.3,
            ease: 'power2.out',
          },
          2.0
        );
      }

      // 6. Start exit handshake to trigger 3D hero entrance
      mainTl.call(
        () => {
          if (onStartExitRef.current) onStartExitRef.current();
        },
        [],
        2.1
      );

      // 7. Full-screen loader background overlay smoothly fades out
      if (loaderOverlayRef.current) {
        mainTl.to(
          loaderOverlayRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          2.1
        );
      }

      // 8. Centered brand typography moves and scales into top navbar position
      if (loaderBrandGroupRef.current) {
        const isMobile = window.innerWidth < 640;
        const targetTop = isMobile ? 24 : 32;
        const centerY = window.innerHeight / 2;
        const deltaY = targetTop - centerY;
        const targetScale = isMobile ? 0.35 : 0.28;

        mainTl.to(
          loaderBrandGroupRef.current,
          {
            y: deltaY,
            scale: targetScale,
            duration: 0.8,
            ease: 'power3.inOut',
          },
          2.1
        );
      }

      // 9. Top navbar header items fade in smoothly
      if (navContentRef.current) {
        mainTl.to(
          navContentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              document.body.style.overflow = '';
              setIsCompleted(true);
              try {
                sessionStorage.setItem('perfume_has_visited', 'true');
              } catch (e) {
                // ignore storage errors
              }
              if (onCompleteRef.current) onCompleteRef.current();
            },
          },
          2.5
        );
      }
    });

    // Failsafe safety timeout (3.5s) to guarantee screen unlock
    const safetyTimeout = setTimeout(() => {
      document.body.style.overflow = '';
      setIsCompleted(true);
      if (onStartExitRef.current) onStartExitRef.current();
      if (onCompleteRef.current) onCompleteRef.current();
    }, 3500);

    return () => {
      ctx.revert();
      clearTimeout(safetyTimeout);
      document.body.style.overflow = '';
    };
  }, [isCompleted]);

  const scrollToSection = (targetId) => {
    setMobileMenuOpen(false);
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(targetId);
    if (elem) {
      const yOffset = -90;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* FULL-SCREEN LUXURY SMOOTH LOADER OVERLAY */}
      {!isCompleted && (
        <div
          ref={loaderOverlayRef}
          className="fixed inset-0 z-50 bg-[#FAFAFA] w-screen h-screen flex flex-col justify-between items-center select-none pointer-events-auto"
        >
          {/* CENTERED BRAND TYPOGRAPHY - DEAD CENTER OF VIEWPORT */}
          <div
            ref={loaderBrandGroupRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none transform-gpu will-change-transform"
          >
            <div className="flex items-center justify-center gap-[0.4vw] sm:gap-[0.6vw] md:gap-[0.8vw]">
              {BRAND.map((char, i) => (
                <div
                  key={i}
                  className="overflow-hidden leading-none py-1 transform-gpu flex items-center justify-center"
                  style={{ contain: 'paint' }}
                >
                  <span className="loader-char inline-block font-serif font-light text-[#1A1A1A] leading-[0.85] select-none text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] tracking-wider transform-gpu">
                    {char}
                  </span>
                </div>
              ))}
            </div>

            <span
              ref={subTitleRef}
              className="font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.45em] text-[#737373] font-bold mt-3 block"
            >
              FRAGRANCE
            </span>
          </div>

          {/* NUMERICAL PROGRESS COUNTER - BOTTOM CENTER OF VIEWPORT */}
          <div
            ref={loaderCounterRef}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 font-sans font-light text-[#737373] tracking-[0.25em] pointer-events-none tabular-nums text-xs sm:text-sm md:text-base transform-gpu"
          >
            0%
          </div>
        </div>
      )}

      {/* TOP FLOATING RESPONSIVE LUXURY NAVBAR HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-500 ease-in-out ${
          isNavHidden && !mobileMenuOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <nav
          ref={navContentRef}
          className={`pointer-events-auto transition-all duration-500 flex items-center justify-between select-none ${
            isScrolled
              ? 'mt-2 sm:mt-3.5 w-[94%] sm:w-[90%] max-w-6xl px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/10'
              : 'w-full max-w-7xl px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 bg-gradient-to-b from-white/95 via-white/60 to-transparent border-b border-transparent'
          }`}
        >
          {/* Scroll Progress Gold Line (Scrolled Pill Mode) */}
          {isScrolled && (
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-black/5 rounded-full overflow-hidden pointer-events-none">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C08A3E] via-[#F3E5AB] to-[#C08A3E]"
                style={{ width: `${scrollProgress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>
          )}

          {/* LEFT SECTION: Section Links & Mobile Hamburger */}
          <div className="flex items-center shrink-0">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.targetId)}
                    className={`relative px-3 py-1.5 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer ${
                      isActive ? 'text-[#1A1A1A] font-bold' : 'text-[#555555] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbarActivePill"
                        className="absolute inset-0 bg-black/5 rounded-full border border-black/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-full text-[#111111] hover:bg-black/5 transition-colors cursor-pointer shrink-0 flex items-center justify-center border border-black/10"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* CENTER SECTION: Official Brand Logo Image (Perfectly Balanced) */}
          <div
            onClick={() => scrollToSection('hero')}
            className="flex items-center justify-center cursor-pointer group select-none px-3.5 sm:px-5 shrink-0 overflow-visible py-1"
          >
            <img
              src={logoImg}
              alt="LUNE Fragrance Logo"
              className="h-10 sm:h-12 md:h-14 max-h-[60px] w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[2.75] scale-[2.05] sm:scale-[2.35] md:scale-[2.65] origin-center"
            />
          </div>

          {/* RIGHT SECTION: Minimal Luxury Bag & Desktop Account */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Account Button — Desktop Only (Hover turns button black and text white) */}
            <button
              onClick={onOpenAccount}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-200 cursor-pointer active:scale-95 group"
              aria-label="User Account"
            >
              <div className="w-5 h-5 rounded-full bg-[#111111] group-hover:bg-white text-white group-hover:text-[#111111] font-serif font-extrabold text-[10px] flex items-center justify-center transition-colors duration-200 shadow-xs">
                E
              </div>
              <span className="font-sans font-extrabold text-xs tracking-[0.18em] uppercase">ACCOUNT</span>
            </button>

            {/* Bag Icon + Number — Hover turns button black and text white */}
            <button
              onClick={onOpenCart}
              className="px-2.5 sm:px-3 py-1.5 rounded-full text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 relative group"
              aria-label="Open Shopping Cart Bag"
            >
              <svg className="w-4.5 h-4.5 text-[#111111] group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="font-sans font-extrabold text-xs sm:text-sm text-[#111111] group-hover:text-white transition-colors duration-200">
                {cartCount}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto fixed inset-x-4 top-20 z-50 bg-white/95 backdrop-blur-2xl border border-black/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 lg:hidden max-w-md mx-auto"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="font-serif text-sm tracking-widest text-[#1A1A1A]">NAVIGATION</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-[#737373] hover:text-[#1A1A1A]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.targetId)}
                  className={`text-left px-4 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase rounded-xl transition-all ${
                    activeSection === link.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#1A1A1A] hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAccount) onOpenAccount();
                }}
                className="flex-1 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-black/5 text-[#1A1A1A] rounded-xl border border-black/10"
              >
                MY ACCOUNT
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCart) onOpenCart();
                }}
                className="flex-1 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1A1A] text-white rounded-xl"
              >
                BAG ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
