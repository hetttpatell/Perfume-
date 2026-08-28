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

  useEffect(() => {
    onStartExitRef.current = onStartExit;
    onCompleteRef.current = onComplete;
  }, [onStartExit, onComplete]);

  const setLetterRef = useCallback((el, i) => {
    letterRefs.current[i] = el;
  }, []);

  useEffect(() => {
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
          duration: 0.4,
          ease: 'power2.out',
        },
        0
      );
    }

    // 2. Staggered reveal of letter typography
    mainTl.to(
      letterRefs.current,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.06,
        ease: 'power4.out',
      },
      0.08
    );

    // 3. Subtitle fade in
    if (subTitleRef.current) {
      mainTl.to(
        subTitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.5
      );
    }

    // 4. Smooth numerical progression 0% -> 100% over 1.2s
    mainTl.to(
      progressObj,
      {
        value: 100,
        duration: 1.2,
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

    // 5. Fade counter out gently
    if (counterRef.current) {
      mainTl.to(
        counterRef.current,
        {
          opacity: 0,
          y: -12,
          duration: 0.3,
          ease: 'power2.out',
        },
        1.25
      );
    }

    // 6. Trigger start exit callback
    mainTl.call(
      () => {
        if (onStartExitRef.current) onStartExitRef.current();
      },
      [],
      1.3
    );

    // 7. Silk curtain exit: brand text floats up while container slides up
    if (brandGroupRef.current) {
      mainTl.to(
        brandGroupRef.current,
        {
          y: -70,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.in',
        },
        1.3
      );
    }

    if (containerRef.current) {
      mainTl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          onComplete: () => {
            if (onCompleteRef.current) onCompleteRef.current();
          },
        },
        1.3
      );
    }

    // Safety fallback timeout
    const safetyTimeout = setTimeout(() => {
      if (onCompleteRef.current) onCompleteRef.current();
    }, 2500);

    return () => {
      mainTl.kill();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
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