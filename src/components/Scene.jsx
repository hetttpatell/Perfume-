import { useRef, useEffect, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment, ContactShadows, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const MODEL_PATH = '/models/n22879414a_-_perfume.glb';

useGLTF.preload(MODEL_PATH);

// Detect mobile at module level for Canvas config (before React renders)
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

// Helper function to get responsive 3D coordinates & scale based on viewport width
function getResponsiveCoords() {
  if (typeof window === 'undefined') return { x: 1.2, y: 0, scale: 15.0, isMobile: false };
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 768) {
    // Dynamic aspect-ratio math for mobile view: balanced middle positioning
    const aspectRatio = h / w;
    let targetY = 0.66;
    let targetScale = 10.4;

    if (w < 360) {
      // Compact phones (iPhone SE, Galaxy A series compact)
      targetY = 0.72;
      targetScale = 9.2;
    } else if (aspectRatio > 2.05) {
      // Tall modern phones (iPhone 14/15/16 Pro Max, Galaxy Ultra)
      targetY = 0.60;
      targetScale = 10.8;
    } else if (aspectRatio > 1.85) {
      // Standard mobile screens (iPhone 12/13/14, Pixel)
      targetY = 0.65;
      targetScale = 10.2;
    } else {
      // Shorter mobile viewports
      targetY = 0.70;
      targetScale = 9.6;
    }

    return { x: 0, y: targetY, scale: targetScale, isMobile: true };
  } else if (w < 900) {
    // iPad / Tablet Portrait Viewport (768px - 899px e.g. iPad Air / Mini portrait)
    return { x: 0.35, y: 0.08, scale: 10.5, isMobile: false };
  } else if (w < 1024) {
    // iPad / Tablet Landscape Viewport (900px - 1023px)
    return { x: 0.55, y: 0.04, scale: 11.8, isMobile: false };
  } else if (w < 1280) {
    // Small Desktop / Laptop
    return { x: 0.85, y: 0, scale: 13.5, isMobile: false };
  } else {
    // Large Desktop
    return { x: 1.2, y: 0, scale: 15.0, isMobile: false };
  }
}

// Helper to calculate off-screen starting coordinates for smooth entrance across all viewports
function getSouthEastCoords(coords) {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  if (w < 768) {
    return {
      x: coords.x + 2.5,
      y: coords.y - 2.5,
      z: -0.8,
      scale: coords.scale * 0.7,
      rotY: -Math.PI * 0.35,
      rotZ: -0.15,
      rotX: 0.08,
    };
  } else if (w < 1024) {
    return {
      x: coords.x + 3.0,
      y: coords.y - 2.8,
      z: -0.8,
      scale: coords.scale * 0.65,
      rotY: -Math.PI * 0.35,
      rotZ: -0.15,
      rotX: 0.08,
    };
  } else {
    return {
      x: coords.x + 3.5,
      y: coords.y - 3.2,
      z: -0.8,
      scale: coords.scale * 0.65,
      rotY: -Math.PI * 0.35,
      rotZ: -0.15,
      rotX: 0.08,
    };
  }
}

// Helper to hide and purge unwanted GLTF nodes (like internal straw line)
function sanitizeScene(scene) {
  if (!scene) return;
  const toRemove = [];
  scene.traverse((child) => {
    if (child.name && (child.name.toLowerCase().includes('straw') || child.name === 's')) {
      child.visible = false;
      toRemove.push(child);
    } else if (child.isMesh && child.material) {
      if (child.material.map) child.material.map.colorSpace = THREE.SRGBColorSpace;
      if (child.material.envMapIntensity !== undefined) {
        child.material.envMapIntensity = Math.max(child.material.envMapIntensity, 1.2);
      }
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  toRemove.forEach((node) => node.removeFromParent?.());
}

// 3D Perfume Bottle Mesh Component
function BottleMesh({ scene }) {
  useMemo(() => {
    sanitizeScene(scene);
  }, [scene]);

  return <primitive object={scene} />;
}

// ─────────────────────────────────────────────────────────────
// MOBILE: Single-instance carousel — halves vertex count
// ─────────────────────────────────────────────────────────────
function MobileBottleCarousel({ currentSlide, slideData, prevSlideRef, loaderState, onModelLoaded }) {
  const groupRef = useRef(null);
  const hasEnteredRef = useRef(false);

  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    if (scene && onModelLoaded) {
      onModelLoaded();
    }
  }, [scene, onModelLoaded]);

  const initialCoords = getResponsiveCoords();
  const initialSECoords = getSouthEastCoords(initialCoords);
  const isAlreadyCompleted = loaderState === 'completed';

  const pos = useRef({
    x: isAlreadyCompleted ? initialCoords.x : initialSECoords.x,
    y: isAlreadyCompleted ? initialCoords.y : initialSECoords.y,
    z: isAlreadyCompleted ? 0 : initialSECoords.z,
    scale: isAlreadyCompleted ? initialCoords.scale : initialSECoords.scale,
    rotY: isAlreadyCompleted ? 0 : initialSECoords.rotY,
    rotZ: isAlreadyCompleted ? 0 : initialSECoords.rotZ,
    rotX: isAlreadyCompleted ? 0 : initialSECoords.rotX,
  });

  // Handle Loader Exit -> Hero Handshake Entrance Animation
  useEffect(() => {
    const coords = getResponsiveCoords();

    if (loaderState === 'loading') {
      hasEnteredRef.current = false;
      const seCoords = getSouthEastCoords(coords);
      pos.current.x = seCoords.x;
      pos.current.y = seCoords.y;
      pos.current.z = seCoords.z;
      pos.current.scale = seCoords.scale;
      pos.current.rotY = seCoords.rotY;
      pos.current.rotZ = seCoords.rotZ;
      pos.current.rotX = seCoords.rotX;
    } else if ((loaderState === 'exiting' || loaderState === 'completed') && !hasEnteredRef.current) {
      hasEnteredRef.current = true;

      gsap.killTweensOf(pos.current);
      gsap.to(pos.current, {
        x: coords.x,
        y: coords.y,
        z: 0,
        scale: coords.scale,
        rotY: Math.PI * 2,
        rotZ: 0,
        rotX: 0,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.1,
      });
    }
  }, [loaderState]);

  // Update base coordinates on window resize
  useEffect(() => {
    const handleResize = () => {
      const coords = getResponsiveCoords();
      pos.current.x = coords.x;
      pos.current.y = coords.y;
      pos.current.scale = coords.scale;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide Change Animation — single model spin-in-place transition
  useEffect(() => {
    if (!groupRef.current) return;
    if (prevSlideRef.current === currentSlide) return;

    const isNext = currentSlide > prevSlideRef.current || (prevSlideRef.current === 5 && currentSlide === 0);
    const direction = isNext ? 1 : -1;
    prevSlideRef.current = currentSlide;

    const { x: baseCenterX, y: baseCenterY, scale: baseScale } = getResponsiveCoords();

    // Quick scale-down + spin + scale-back for a snappy single-instance transition
    gsap.timeline()
      .to(pos.current, {
        scale: baseScale * 0.7,
        rotZ: direction * 0.12,
        duration: 0.25,
        ease: 'power2.in',
      })
      .to(pos.current, {
        x: baseCenterX,
        y: baseCenterY,
        scale: baseScale,
        rotZ: 0,
        rotY: pos.current.rotY + Math.PI * 2 * direction,
        duration: 0.45,
        ease: 'power2.out',
      });
  }, [currentSlide]);

  // Frame Loop: Update 3D transforms & subtle float breathing
  useFrame(() => {
    const t = performance.now() * 0.001;
    const floatY = Math.sin(t * 1.2) * 0.015;
    const swayZ = Math.cos(t * 0.8) * 0.003;

    if (groupRef.current) {
      groupRef.current.position.set(
        pos.current.x,
        pos.current.y + floatY,
        pos.current.z
      );
      groupRef.current.scale.setScalar(pos.current.scale);
      groupRef.current.rotation.set(
        pos.current.rotX,
        pos.current.rotY,
        pos.current.rotZ + swayZ
      );
    }
  });

  return (
    <group ref={groupRef} position={[pos.current.x, pos.current.y, pos.current.z]}>
      <Center>
        <BottleMesh scene={scene} />
      </Center>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP/TABLET: Dual-instance carousel (original behavior)
// ─────────────────────────────────────────────────────────────
function DesktopBottleCarousel({ currentSlide, slideData, prevSlideRef, loaderState, onModelLoaded }) {
  const groupARef = useRef(null);
  const groupBRef = useRef(null);
  const activeGroupRef = useRef('A');
  const hasEnteredRef = useRef(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  const { scene: sceneA } = useGLTF(MODEL_PATH);
  const { scene: sceneB } = useGLTF(MODEL_PATH);

  useEffect(() => {
    if (sceneA && onModelLoaded) {
      onModelLoaded();
    }
  }, [sceneA, onModelLoaded]);

  // Clone scene for groupB so both instances render independently
  const sceneBCloned = useMemo(() => sceneB.clone(true), [sceneB]);

  const initialCoords = getResponsiveCoords();
  const initialSECoords = getSouthEastCoords(initialCoords);
  const isAlreadyCompleted = loaderState === 'completed';

  // Position & rotation state for Group A & Group B
  const posA = useRef({
    x: isAlreadyCompleted ? initialCoords.x : initialSECoords.x,
    y: isAlreadyCompleted ? initialCoords.y : initialSECoords.y,
    z: isAlreadyCompleted ? 0 : initialSECoords.z,
    scale: isAlreadyCompleted ? initialCoords.scale : initialSECoords.scale,
    rotY: isAlreadyCompleted ? 0 : initialSECoords.rotY,
    rotZ: isAlreadyCompleted ? 0 : initialSECoords.rotZ,
    rotX: isAlreadyCompleted ? 0 : initialSECoords.rotX,
  });

  const posB = useRef({
    x: initialCoords.x + 5.5,
    y: initialCoords.y - 4.5,
    z: -3,
    scale: initialCoords.scale * 0.3,
    rotY: 0,
    rotZ: 0,
    rotX: 0,
  });

  // Handle Loader Exit -> Hero Handshake Entrance Animation
  useEffect(() => {
    const coords = getResponsiveCoords();

    if (loaderState === 'loading') {
      hasEnteredRef.current = false;
      const seCoords = getSouthEastCoords(coords);
      posA.current.x = seCoords.x;
      posA.current.y = seCoords.y;
      posA.current.z = seCoords.z;
      posA.current.scale = seCoords.scale;
      posA.current.rotY = seCoords.rotY;
      posA.current.rotZ = seCoords.rotZ;
      posA.current.rotX = seCoords.rotX;
      activeGroupRef.current = 'A';
    } else if ((loaderState === 'exiting' || loaderState === 'completed') && !hasEnteredRef.current) {
      hasEnteredRef.current = true;

      gsap.killTweensOf(posA.current);
      gsap.to(posA.current, {
        x: coords.x,
        y: coords.y,
        z: 0,
        scale: coords.scale,
        rotY: Math.PI * 2,
        rotZ: 0,
        rotX: 0,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.1,
      });
    }
  }, [loaderState]);

  // Update base coordinates on window resize
  useEffect(() => {
    const handleResize = () => {
      const coords = getResponsiveCoords();
      setIsMobile(coords.isMobile);
      const activeState = activeGroupRef.current === 'A' ? posA.current : posB.current;
      activeState.x = coords.x;
      activeState.y = coords.y;
      activeState.scale = coords.scale;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide Change Animation Effect
  useEffect(() => {
    if (!groupARef.current || !groupBRef.current) return;
    if (prevSlideRef.current === currentSlide) return;

    const isNext = currentSlide > prevSlideRef.current || (prevSlideRef.current === 5 && currentSlide === 0);
    const direction = isNext ? 1 : -1;
    prevSlideRef.current = currentSlide;

    const { x: baseCenterX, y: baseCenterY, scale: baseScale, isMobile } = getResponsiveCoords();
    const tl = gsap.timeline();

    const exitingState = activeGroupRef.current === 'A' ? posA.current : posB.current;
    const enteringState = activeGroupRef.current === 'A' ? posB.current : posA.current;

    if (isMobile) {
      if (isNext) {
        enteringState.x = baseCenterX + 3.2;
        enteringState.y = baseCenterY;
        enteringState.z = 0;
        enteringState.scale = baseScale * 0.4;
        enteringState.rotZ = -0.15;
        enteringState.rotX = 0;

        tl.to(exitingState, {
          x: baseCenterX - 3.2,
          y: baseCenterY,
          scale: baseScale * 0.4,
          rotZ: 0.15,
          duration: 0.55,
          ease: 'power2.inOut',
        }, 0);

        const targetY = enteringState.rotY + Math.PI * 2 * direction;
        tl.to(enteringState, {
          x: baseCenterX,
          y: baseCenterY,
          scale: baseScale,
          rotZ: 0,
          rotY: targetY,
          duration: 0.55,
          ease: 'power2.inOut',
        }, 0);

      } else {
        enteringState.x = baseCenterX - 3.2;
        enteringState.y = baseCenterY;
        enteringState.z = 0;
        enteringState.scale = baseScale * 0.4;
        enteringState.rotZ = 0.15;
        enteringState.rotX = 0;

        tl.to(exitingState, {
          x: baseCenterX + 3.2,
          y: baseCenterY,
          scale: baseScale * 0.4,
          rotZ: -0.15,
          duration: 0.55,
          ease: 'power2.inOut',
        }, 0);

        const targetY = enteringState.rotY + Math.PI * 2 * direction;
        tl.to(enteringState, {
          x: baseCenterX,
          y: baseCenterY,
          scale: baseScale,
          rotZ: 0,
          rotY: targetY,
          duration: 0.55,
          ease: 'power2.inOut',
        }, 0);
      }

    } else {
      if (isNext) {
        enteringState.x = baseCenterX + 5.5;
        enteringState.y = baseCenterY - 4.5;
        enteringState.z = -3;
        enteringState.scale = baseScale * 0.3;
        enteringState.rotZ = 0.4;
        enteringState.rotX = -0.25;

        tl.to(exitingState, {
          x: baseCenterX + 5.5,
          y: baseCenterY + 4.5,
          z: -3,
          scale: baseScale * 0.3,
          rotZ: -0.4,
          rotX: 0.25,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0);

        const targetY = enteringState.rotY + Math.PI * 2 * direction;
        tl.to(enteringState, {
          x: baseCenterX,
          y: baseCenterY,
          z: 0,
          scale: baseScale,
          rotZ: 0,
          rotX: 0,
          rotY: targetY,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0);

      } else {
        enteringState.x = baseCenterX + 5.5;
        enteringState.y = baseCenterY + 4.5;
        enteringState.z = -3;
        enteringState.scale = baseScale * 0.3;
        enteringState.rotZ = -0.4;
        enteringState.rotX = 0.25;

        tl.to(exitingState, {
          x: baseCenterX + 5.5,
          y: baseCenterY - 4.5,
          z: -3,
          scale: baseScale * 0.3,
          rotZ: 0.4,
          rotX: -0.25,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0);

        const targetY = enteringState.rotY + Math.PI * 2 * direction;
        tl.to(enteringState, {
          x: baseCenterX,
          y: baseCenterY,
          z: 0,
          scale: baseScale,
          rotZ: 0,
          rotX: 0,
          rotY: targetY,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0);
      }
    }

    activeGroupRef.current = activeGroupRef.current === 'A' ? 'B' : 'A';
  }, [currentSlide]);

  // Frame Loop: Update 3D transforms & subtle float breathing
  useFrame(() => {
    const t = performance.now() * 0.001;
    const floatY = Math.sin(t * 1.2) * 0.015;
    const swayZ = Math.cos(t * 0.8) * 0.003;

    if (groupARef.current) {
      const isCenter = activeGroupRef.current === 'A';
      groupARef.current.position.set(
        posA.current.x,
        posA.current.y + (isCenter ? floatY : 0),
        posA.current.z
      );
      groupARef.current.scale.setScalar(posA.current.scale);
      groupARef.current.rotation.set(
        posA.current.rotX,
        posA.current.rotY,
        posA.current.rotZ + (isCenter ? swayZ : 0)
      );
    }

    if (groupBRef.current) {
      const isCenter = activeGroupRef.current === 'B';
      groupBRef.current.position.set(
        posB.current.x,
        posB.current.y + (isCenter ? floatY : 0),
        posB.current.z
      );
      groupBRef.current.scale.setScalar(posB.current.scale);
      groupBRef.current.rotation.set(
        posB.current.rotX,
        posB.current.rotY,
        posB.current.rotZ + (isCenter ? swayZ : 0)
      );
    }
  });

  return (
    <>
      {/* Group A */}
      <group ref={groupARef} position={[posA.current.x, posA.current.y, posA.current.z]}>
        <Center>
          <BottleMesh scene={sceneA} />
        </Center>
        {!isMobile && activeGroupRef.current === 'A' && (
          <ContactShadows
            position={[0, -0.06, 0]}
            opacity={0.10}
            scale={0.12}
            blur={1.0}
            far={0.4}
            resolution={256}
            color="#1A1A1A"
          />
        )}
      </group>

      {/* Group B */}
      <group ref={groupBRef} position={[initialCoords.x + 5.5, initialCoords.y - 4.5, -3]}>
        <Center>
          <BottleMesh scene={sceneBCloned} />
        </Center>
        {!isMobile && activeGroupRef.current === 'B' && (
          <ContactShadows
            position={[0, -0.06, 0]}
            opacity={0.10}
            scale={0.12}
            blur={1.0}
            far={0.4}
            resolution={256}
            color="#1A1A1A"
          />
        )}
      </group>
    </>
  );
}

function ProgressNotifier({ onModelLoaded }) {
  const { active, progress, loaded, total } = useProgress();

  useEffect(() => {
    if (!active && loaded > 0 && loaded === total) {
      if (onModelLoaded) onModelLoaded();
    }
  }, [active, progress, loaded, total, onModelLoaded]);

  return null;
}

export default function Scene({ currentSlide, slideData, loaderState, onModelLoaded }) {
  const prevSlideRef = useRef(currentSlide);
  const [modelReady, setModelReady] = useState(false);

  // Wrap the original callback to also track model readiness for poster crossfade
  const handleModelLoaded = useMemo(() => {
    return () => {
      setModelReady(true);
      if (onModelLoaded) onModelLoaded();
    };
  }, [onModelLoaded]);

  // Select the right carousel based on device
  const CarouselComponent = IS_MOBILE ? MobileBottleCarousel : DesktopBottleCarousel;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Poster fallback — shows instantly while WebGL canvas loads the 3D model */}
      {IS_MOBILE && !modelReady && (
        <img
          src="/models/perfume-poster.png"
          alt="Perfume preview"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-[1]"
          style={{
            opacity: 0.55,
            filter: 'blur(1px)',
            transition: 'opacity 0.6s ease-out',
            // Vertically offset to roughly match 3D model position
            objectPosition: 'center 30%',
          }}
        />
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={IS_MOBILE ? [1, 1.5] : [1, 1.5]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.physicallyCorrectLights = true;
        }}
      >
        <ProgressNotifier onModelLoaded={handleModelLoaded} />

        {/* Lighting Rig — stripped down on mobile for GPU savings */}
        <ambientLight intensity={0.6} color="#FFF8E8" />
        <directionalLight position={[5, 8, 5]} intensity={3.5} color="#FFFAF0" castShadow={!IS_MOBILE} />
        <directionalLight position={[-5, 3, 4]} intensity={1.6} color="#F0F0FF" />
        <directionalLight position={[0, 4, -6]} intensity={2.5} color="#FFFFFF" />

        {/* Desktop-only supplementary lights */}
        {!IS_MOBILE && (
          <>
            <directionalLight position={[-5, 3, 4]} intensity={2.0} color="#F0F0FF" />
            <directionalLight position={[0, 2, 8]} intensity={1.5} color="#FFFFFF" />
            <spotLight position={[1.4, 10, 3]} intensity={3.0} angle={0.3} penumbra={0.5} color="#FFFFFF" castShadow />
            <pointLight position={[1.4, -4, 2]} intensity={0.8} color="#FFF0C0" />
            <pointLight position={[4, 0, 0]} intensity={0.6} color="#FFE8B0" />
          </>
        )}

        <Environment preset="studio" />

        <Suspense fallback={null}>
          <CarouselComponent
            currentSlide={currentSlide}
            slideData={slideData}
            prevSlideRef={prevSlideRef}
            loaderState={loaderState}
            onModelLoaded={handleModelLoaded}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}