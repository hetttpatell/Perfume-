import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const BRAND = ['P', 'E', 'R', 'F', 'U', 'M', 'E'];

const Loader = ({ onStartExit, onComplete, isModelLoaded = false }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const brandGroupRef = useRef(null);
  const leftNavRef = useRef(null);
  const rightNavRef = useRef(null);
  const letterRefs = useRef([]);
  const mainTlRef = useRef(null);

  const onStartExitRef = useRef(onStartExit);
  const onCompleteRef = useRef(onComplete);
  const isModelLoadedRef = useRef(isModelLoaded);

  useEffect(() => {
    onStartExitRef.current = onStartExit;
    onCompleteRef.current = onComplete;
  }, [onStartExit, onComplete]);

  useEffect(() => {
    isModelLoadedRef.current = isModelLoaded;
    if (isModelLoaded && mainTlRef.current && mainTlRef.current.paused()) {
      mainTlRef.current.play();
    }
  }, [isModelLoaded]);

  const setLetterRef = useCallback((el, i) => {
    letterRefs.current[i] = el;
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Force GPU acceleration layer promotion
    letterRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, {
          yPercent: 105,
          opacity: 0,
          force3D: true,
          willChange: 'transform, opacity',
        });
      }
    });

    if (counterRef.current) {
      gsap.set(counterRef.current, {
        opacity: 0,
        y: 10,
        force3D: true,
        willChange: 'transform, opacity',
      });
    }

    if (leftNavRef.current) {
      gsap.set(leftNavRef.current, { opacity: 0, x: -20 });
    }

    if (rightNavRef.current) {
      gsap.set(rightNavRef.current, { opacity: 0, x: 20 });
    }

    if (containerRef.current) {
      gsap.set(containerRef.current, {
        force3D: true,
        position: 'fixed',
        top: 0,
        left: '50%',
        xPercent: -50,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        borderRadius: '0px',
        backgroundColor: '#FAFAFA',
        border: '0px solid transparent',
        boxShadow: 'none',
        margin: 0,
        padding: '1.25rem 2.5rem',
        willChange: 'transform, width, height, border-radius, top, margin, background-color',
      });
    }

    const progressObj = { value: 0 };
    let lastValue = -1;

    const mainTl = gsap.timeline();
    mainTlRef.current = mainTl;

    // 1. Counter fade in gracefully
    mainTl.to(
      counterRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        force3D: true,
      },
      0
    );

    // 2. Grand staggered reveal of letter typography ("P E R F U M E")
    mainTl.to(
      letterRefs.current,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.08,
        ease: 'power4.out',
        force3D: true,
      },
      0.1
    );

    // 3. Smooth numerical progression (0% to 100%) over 2.5 seconds
    mainTl.to(
      progressObj,
      {
        value: 100,
        duration: 2.5,
        ease: 'power1.out',
        onUpdate: () => {
          const currentVal = Math.round(progressObj.value);
          if (currentVal !== lastValue) {
            lastValue = currentVal;
            if (counterRef.current) {
              counterRef.current.textContent = `${currentVal}%`;
            }
          }
        },
      },
      0
    );

    // 4. Handshake Pause Check: hold at 2.5s if 3D model is not ready yet
    mainTl.call(
      () => {
        if (!isModelLoadedRef.current) {
          mainTl.pause();
        }
      },
      [],
      2.5
    );

    // 5. Counter gentle fade out at 100%
    mainTl.to(
      counterRef.current,
      {
        opacity: 0,
        y: -15,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
      },
      2.5
    );

    // 6. Frame-locked Handshake callback to initialize hero entrance & 3D scene
    mainTl.call(
      () => {
        if (onStartExitRef.current) onStartExitRef.current();
      },
      [],
      2.6
    );

    // 7. Morphing Transformation: Full screen loader physically contracts into top navbar pill!
    const isMobile = window.innerWidth < 640;
    const targetWidth = isMobile ? '94vw' : '90vw';
    const targetMaxWidth = '1152px'; // max-w-6xl
    const targetHeight = isMobile ? '52px' : '62px';
    const targetTop = isMobile ? '12px' : '16px';
    const targetScale = Math.max(0.14, 22 / (window.innerWidth * 0.11));

    // Shrink full-screen container into floating glass pill header
    mainTl.to(
      containerRef.current,
      {
        top: targetTop,
        height: targetHeight,
        width: targetWidth,
        maxWidth: targetMaxWidth,
        borderRadius: '9999px',
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
        padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
        duration: 1.5,
        ease: 'power3.inOut',
        force3D: true,
      },
      2.6
    );

    // Scale PERFUME letters smoothly down to title size while flexbox centers it inside shrinking pill
    if (brandGroupRef.current) {
      mainTl.to(
        brandGroupRef.current,
        {
          scale: targetScale,
          gap: '0.12vw',
          duration: 1.5,
          ease: 'power3.inOut',
          force3D: true,
        },
        2.6
      );
    }

    // Fade in Left links and Right e-commerce controls right inside the morphing container
    if (leftNavRef.current) {
      mainTl.to(
        leftNavRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        3.0
      );
    }

    if (rightNavRef.current) {
      mainTl.to(
        rightNavRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            document.body.style.overflow = '';
            if (onCompleteRef.current) onCompleteRef.current();
          },
        },
        3.0
      );
    }

    // Safety fallback (10s max) to guarantee exit if model fails to load
    const safetyTimeout = setTimeout(() => {
      if (mainTlRef.current && mainTlRef.current.paused()) {
        mainTlRef.current.play();
      }
    }, 10000);

    return () => {
      mainTl.kill();
      clearTimeout(safetyTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed z-50 flex items-center justify-between transform-gpu pointer-events-none select-none"
      style={{
        willChange: 'transform, width, height, border-radius, top, background-color',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Left Navigation Placeholder */}
      <div ref={leftNavRef} className="hidden lg:flex items-center gap-1 xl:gap-2">
        <span className="px-3 py-1.5 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.12em] uppercase text-[#555555]">
          Homepage
        </span>
        <span className="px-3 py-1.5 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.12em] uppercase text-[#555555]">
          About
        </span>
        <span className="px-3 py-1.5 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.12em] uppercase text-[#555555]">
          Services/Products
        </span>
        <span className="px-3 py-1.5 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.12em] uppercase text-[#555555]">
          Contact
        </span>
        <span className="px-3 py-1.5 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.12em] uppercase text-[#555555]">
          Gallery/FAQ
        </span>
      </div>

      {/* Center PERFUME Brand Group */}
      <div
        ref={brandGroupRef}
        className="flex items-center justify-center gap-[0.4vw] sm:gap-[0.6vw] md:gap-[0.8vw] transform-gpu will-change-transform mx-auto"
      >
        {BRAND.map((char, i) => (
          <div
            key={i}
            className="overflow-hidden leading-none py-1 transform-gpu flex items-center justify-center"
            style={{ contain: 'paint' }}
          >
            <span
              ref={(el) => setLetterRef(el, i)}
              className="block font-serif font-light text-[#1A1A1A] leading-[0.85] select-none text-[13vw] sm:text-[11vw] md:text-[12vw] tracking-wider transform-gpu"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {char}
            </span>
          </div>
        ))}
      </div>

      {/* Right E-Commerce Controls Placeholder */}
      <div ref={rightNavRef} className="flex items-center gap-2 sm:gap-3">
        <div className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.18em] uppercase text-[#1A1A1A] bg-black/5 rounded-full border border-black/15 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="hidden xs:inline">ACCOUNT</span>
        </div>
        <div className="px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] rounded-full flex items-center gap-2 shadow-md">
          <svg className="w-3.5 h-3.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span>BAG (0)</span>
        </div>
      </div>

      {/* Numerical Counter */}
      <div
        ref={counterRef}
        className="absolute font-sans font-light text-[#737373] tracking-[0.25em] pointer-events-none tabular-nums text-xs bottom-8 sm:text-sm sm:bottom-10 md:text-base md:bottom-12 transform-gpu left-1/2 -translate-x-1/2"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        0%
      </div>
    </div>
  );
};

export default Loader;