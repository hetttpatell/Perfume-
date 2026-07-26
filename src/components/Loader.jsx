import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const BRAND = ['L', 'U', 'N', 'E'];

export default function Loader({ onStartExit, onComplete, isModelLoaded = false }) {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const brandGroupRef = useRef(null);
  const subTitleRef = useRef(null);
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
      });
    }

    if (subTitleRef.current) {
      gsap.set(subTitleRef.current, {
        opacity: 0,
        y: 8,
      });
    }

    const progressObj = { value: 0 };
    let lastValue = -1;

    const mainTl = gsap.timeline();
    mainTlRef.current = mainTl;

    // 1. Counter fade in at bottom center
    if (counterRef.current) {
      mainTl.to(
        counterRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0
      );
    }

    // 2. Staggered reveal of letter typography ("P E R F U M E")
    mainTl.to(
      letterRefs.current,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.07,
        ease: 'power4.out',
      },
      0.1
    );

    // 3. Subtitle fade in ("HAUTE PARFUMERIE")
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

    // 4. Smooth numerical progression 0% -> 100% over 2.0s
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
            if (counterRef.current) {
              counterRef.current.textContent = `${currentVal}%`;
            }
          }
        },
      },
      0
    );

    // 5. Handshake Pause Check: pause if 3D model not ready yet at 2.0s
    mainTl.call(
      () => {
        if (!isModelLoadedRef.current) {
          mainTl.pause();
        }
      },
      [],
      2.0
    );

    // 6. Fade counter out gently
    if (counterRef.current) {
      mainTl.to(
        counterRef.current,
        {
          opacity: 0,
          y: -12,
          duration: 0.3,
          ease: 'power2.out',
        },
        2.0
      );
    }

    // 7. Trigger start exit callback right as curtain starts lifting
    mainTl.call(
      () => {
        if (onStartExitRef.current) onStartExitRef.current();
      },
      [],
      2.1
    );

    // 8. Multi-layered silk curtain exit: brand text floats up faster while container slides up smoothly
    if (brandGroupRef.current) {
      mainTl.to(
        brandGroupRef.current,
        {
          y: -80,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.in',
        },
        2.1
      );
    }

    if (containerRef.current) {
      mainTl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: () => {
            document.body.style.overflow = '';
            if (onCompleteRef.current) onCompleteRef.current();
          },
        },
        2.1
      );
    }

    // Safety fallback timeout (5s max)
    const safetyTimeout = setTimeout(() => {
      if (mainTlRef.current && mainTlRef.current.paused()) {
        mainTlRef.current.play();
      }
    }, 5000);

    return () => {
      mainTl.kill();
      clearTimeout(safetyTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    /* Previous theme: bg-[#FAFAFA] */
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-white w-screen h-screen flex flex-col justify-between items-center select-none pointer-events-auto overflow-hidden transform-gpu"
    >
      {/* CENTERED BRAND TYPOGRAPHY */}
      <div
        ref={brandGroupRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none transform-gpu"
      >
        <div className="flex items-center justify-center gap-[0.4vw] sm:gap-[0.6vw] md:gap-[0.8vw]">
          {BRAND.map((char, i) => (
            <div
              key={i}
              className="overflow-hidden leading-none py-1 transform-gpu flex items-center justify-center"
              style={{ contain: 'paint' }}
            >
              <span
                ref={(el) => setLetterRef(el, i)}
                style={{ fontFamily: "'Cinzel', 'Cormorant Garamond', serif" }}
                className="inline-block font-bold text-[#111111] leading-[0.85] select-none text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] tracking-wider transform-gpu"
              >
                {char}
              </span>
            </div>
          ))}
        </div>

        <span
          ref={subTitleRef}
          className="font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.45em] text-[#555555] font-bold mt-3 block"
        >
          FRAGRANCE
        </span>
      </div>

      {/* NUMERICAL PROGRESS COUNTER */}
      <div
        ref={counterRef}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 font-sans font-light text-[#737373] tracking-[0.25em] pointer-events-none tabular-nums text-xs sm:text-sm md:text-base transform-gpu"
      >
        0%
      </div>
    </div>
  );
}