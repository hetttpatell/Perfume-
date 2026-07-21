import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const BRAND = ['P', 'E', 'R', 'F', 'U', 'M', 'E'];

const Loader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const letterRefs = useRef([]);

  const setLetterRef = useCallback((el, i) => {
    letterRefs.current[i] = el;
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Force GPU hardware acceleration layer promotion
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

    if (containerRef.current) {
      gsap.set(containerRef.current, {
        force3D: true,
        willChange: 'transform',
      });
    }

    const progressObj = { value: 0 };
    let lastValue = -1;

    const mainTl = gsap.timeline({
      onComplete: () => {
        // Luxurious, ultra-smooth curtain exit phase
        const exitTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          },
        });

        exitTl.to(counterRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.35,
          ease: 'power2.in',
          force3D: true,
        });

        exitTl.to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 1.2,
            ease: 'power3.inOut',
            force3D: true,
            onComplete: () => {
              if (containerRef.current) {
                containerRef.current.style.pointerEvents = 'none';
              }
            },
          },
          '-=0.2'
        );
      },
    });

    // 1. Counter fade in gracefully
    mainTl.to(
      counterRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        force3D: true,
      },
      0
    );

    // 2. Smooth, unhurried numerical progression (0% to 100%)
    mainTl.to(
      progressObj,
      {
        value: 100,
        duration: 2.6,
        ease: 'power1.inOut',
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

    // 3. Staggered reveal of letter typography with hardware acceleration
    mainTl.to(
      letterRefs.current,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power3.out',
        force3D: true,
      },
      0.2
    );

    // 4. Elegant pause at 100% so user can absorb the complete brand typography
    mainTl.to({}, { duration: 0.4 });

    return () => {
      mainTl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-base transform-gpu"
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div className="flex items-end gap-[0.4vw] sm:gap-[0.6vw] md:gap-[0.8vw]">
        {BRAND.map((char, i) => (
          <div
            key={i}
            className="overflow-hidden leading-none py-1 transform-gpu"
            style={{
              contain: 'paint',
            }}
          >
            <span
              ref={(el) => setLetterRef(el, i)}
              className="block font-serif font-light text-text-primary leading-[0.85] select-none text-[13vw] sm:text-[11vw] md:text-[12vw] transform-gpu"
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

      <div
        ref={counterRef}
        className="absolute font-sans font-light text-text-secondary tracking-[0.25em] pointer-events-none tabular-nums text-xs bottom-8 sm:text-sm sm:bottom-10 md:text-base md:bottom-12 transform-gpu"
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



