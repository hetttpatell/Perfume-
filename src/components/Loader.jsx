import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const BRAND = ['P', 'E', 'R', 'F', 'U', 'M', 'E'];

const Loader = ({ onStartExit, onComplete }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const letterRefs = useRef([]);

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
        z: 0.01,
        yPercent: 0,
        willChange: 'transform',
      });
    }

    const progressObj = { value: 0 };
    let lastValue = -1;

    const mainTl = gsap.timeline();

    // 1. Counter fade in gracefully
    mainTl.to(
      counterRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        force3D: true,
      },
      0
    );

    // 2. Staggered reveal of letter typography
    mainTl.to(
      letterRefs.current,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.04,
        ease: 'power3.out',
        force3D: true,
      },
      0.08
    );

    // 3. Smooth numerical progression (0% to 100%) over 1.8 seconds
    mainTl.to(
      progressObj,
      {
        value: 100,
        duration: 1.8,
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

    // 4. Counter gentle fade out at 100%
    mainTl.to(
      counterRef.current,
      {
        opacity: 0,
        y: -15,
        duration: 0.35,
        ease: 'power2.out',
        force3D: true,
      },
      1.80
    );

    // 5. Typography brand letters float upward gracefully
    mainTl.to(
      letterRefs.current,
      {
        yPercent: -35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.02,
        ease: 'power2.inOut',
        force3D: true,
      },
      1.80
    );

    // 6. Frame-locked Handshake callback to initialize hero entrance & 3D scene
    mainTl.call(
      () => {
        if (onStartExitRef.current) onStartExitRef.current();
      },
      [],
      1.80
    );

    // 7. Curtain lifts UP with a luxurious, silky-smooth 1.2s ease
    mainTl.to(
      containerRef.current,
      {
        yPercent: -100,
        duration: 1.2,
        ease: 'power3.inOut',
        force3D: true,
        onComplete: () => {
          document.body.style.overflow = '';
          gsap.set(containerRef.current, { clearProps: 'willChange' });
          if (onCompleteRef.current) onCompleteRef.current();
        },
      },
      1.80
    );

    return () => {
      mainTl.kill();
      document.body.style.overflow = '';
    };
  }, []);

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