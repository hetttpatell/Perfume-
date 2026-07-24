import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const BRAND = ['P', 'E', 'R', 'F', 'U', 'M', 'E'];

const Loader = ({ onStartExit, onComplete, isModelLoaded = false }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
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
        duration: 0.5,
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
      2.7
    );

    // 7. Grand Curtain lifts UP with a luxurious, silky-smooth 2.0s ease (keeping text intact)
    mainTl.to(
      containerRef.current,
      {
        yPercent: -100,
        duration: 2.0,
        ease: 'power3.inOut',
        force3D: true,
        onComplete: () => {
          document.body.style.overflow = '';
          if (containerRef.current) {
            gsap.set(containerRef.current, { clearProps: 'willChange' });
          }
          if (onCompleteRef.current) onCompleteRef.current();
        },
      },
      2.7
    );

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