import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const MODEL_PATH = '/models/n22879414a_-_perfume.glb';

useGLTF.preload(MODEL_PATH);

// Helper function to get responsive 3D coordinates & scale based on viewport width
function getResponsiveCoords() {
  if (typeof window === 'undefined') return { x: 1.2, y: 0, scale: 15.0, isMobile: false };
  const w = window.innerWidth;
  if (w < 768) {
    // Mobile: model positioned slightly lower (y = 0.65) and larger (scale = 11.8)
    return { x: 0, y: 0.65, scale: 11.8, isMobile: true };
  } else if (w < 1024) {
    // iPad / Tablet (768px - 1024px): x = 0.35, scale = 11.5 for 100% full visibility without clipping
    return { x: 0.35, y: 0, scale: 11.5, isMobile: false };
  } else if (w < 1280) {
    // Small Desktop / Laptop (1024px - 1280px): x = 0.85, scale = 13.5
    return { x: 0.85, y: 0, scale: 13.5, isMobile: false };
  } else {
    // Large Desktop (>= 1280px): x = 1.2, scale = 15.0
    return { x: 1.2, y: 0, scale: 15.0, isMobile: false };
  }
}

// Helper to calculate South-East starting coordinates for smooth entrance across all viewports
function getSouthEastCoords(coords) {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  if (w < 768) {
    // Mobile View: start slightly south-east relative to mobile center (x: 0, y: 0.65)
    return {
      x: coords.x + 0.9,
      y: coords.y - 0.65,
      z: -0.8,
      scale: coords.scale * 0.7,
      rotY: -Math.PI * 0.35,
      rotZ: -0.15,
      rotX: 0.08,
    };
  } else if (w < 1024) {
    // iPad / Tablet View: start south-east relative to tablet center (x: 0.35, y: 0)
    return {
      x: coords.x + 1.2,
      y: coords.y - 0.9,
      z: -0.9,
      scale: coords.scale * 0.7,
      rotY: -Math.PI * 0.35,
      rotZ: -0.15,
      rotX: 0.08,
    };
  } else {
    // Desktop View: start south-east relative to desktop center
    return {
      x: coords.x + 1.8,
      y: coords.y - 1.2,
      z: -1.0,
      scale: coords.scale * 0.7,
      rotY: -Math.PI * 0.35,
      rotZ: -0.18,
      rotX: 0.1,
    };
  }
}

// Helper to hide and purge unwanted GLTF nodes (like the internal straw line)
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

// 3D Perfume Carousel — Responsive Dual Group Motion with Group-Bound Shadows (No Center Ghost Shadow Artifacts)
function BottleCarousel({ currentSlide, slideData, prevSlideRef, loaderState }) {
  const groupARef = useRef(null);
  const groupBRef = useRef(null);
  const activeGroupRef = useRef('A'); // Tracks which group is currently active at center
  const hasEnteredRef = useRef(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  const { scene: sceneA } = useGLTF(MODEL_PATH);
  const { scene: sceneB } = useGLTF(MODEL_PATH);

  // Clone scene for groupB so both instances render independently
  const sceneBCloned = useMemo(() => sceneB.clone(true), [sceneB]);

  const initialCoords = getResponsiveCoords();
  const initialSECoords = getSouthEastCoords(initialCoords);
  const isAlreadyCompleted = loaderState === 'completed';

  // Position & rotation state for Group A & Group B (unscaled raw units)
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

  // Handle Loader Exit -> Hero Handshake Entrance Animation from South-East
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

      // Animate Group A model gracefully from South-East into home center position
      gsap.killTweensOf(posA.current);
      gsap.to(posA.current, {
        x: coords.x,
        y: coords.y,
        z: 0,
        scale: coords.scale,
        rotY: Math.PI * 2,
        rotZ: 0,
        rotX: 0,
        duration: 1.25,
        ease: 'power3.out',
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
      // ─── MOBILE VIEW: Simple Smooth Left & Right Motion ───
      if (isNext) {
        // NEXT: Exits to LEFT (-3.2); Enters from RIGHT (+3.2)
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
        // PREV: Exits to RIGHT (+3.2); Enters from LEFT (-3.2)
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
      // ─── DESKTOP & IPAD VIEW: Full Luxury Orbital Arc Motion (NE / SE) ───
      if (isNext) {
        // NEXT: Exits North-East (Up+Right); Enters from South-East (Bottom+Right)
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
        // PREV: Exits South-East (Down+Right); Enters from North-East (Top+Right)
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

    // Toggle active group reference
    activeGroupRef.current = activeGroupRef.current === 'A' ? 'B' : 'A';
  }, [currentSlide]);

  // Frame Loop: Update 3D transforms & layer subtle float breathing
  useFrame(() => {
    const t = performance.now() * 0.001;
    const floatY = Math.sin(t * 1.2) * 0.015;
    const swayZ = Math.cos(t * 0.8) * 0.003;

    // Apply Group A Transform
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

    // Apply Group B Transform
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
        {!isMobile && (
          <ContactShadows
            position={[0, -0.06, 0]}
            opacity={0.10}
            scale={0.12}
            blur={1.2}
            far={0.4}
            color="#1A1A1A"
          />
        )}
      </group>

      {/* Group B (Simultaneous Entry/Exit Model Instance) */}
      <group ref={groupBRef} position={[initialCoords.x + 5.5, initialCoords.y - 4.5, -3]}>
        <Center>
          <BottleMesh scene={sceneBCloned} />
        </Center>
        {!isMobile && (
          <ContactShadows
            position={[0, -0.06, 0]}
            opacity={0.10}
            scale={0.12}
            blur={1.2}
            far={0.4}
            color="#1A1A1A"
          />
        )}
      </group>
    </>
  );
}

export default function Scene({ currentSlide, slideData, loaderState }) {
  const prevSlideRef = useRef(currentSlide);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
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
        {/* ── Studio Lighting Rig ── */}
        <ambientLight intensity={0.6} color="#FFF8E8" />
        <directionalLight position={[5, 8, 5]} intensity={3.5} color="#FFFAF0" castShadow />
        <directionalLight position={[-5, 3, 4]} intensity={2.0} color="#F0F0FF" />
        <directionalLight position={[0, 4, -6]} intensity={2.5} color="#FFFFFF" />
        <directionalLight position={[0, 2, 8]} intensity={1.5} color="#FFFFFF" />
        <spotLight position={[1.4, 10, 3]} intensity={3.0} angle={0.3} penumbra={0.5} color="#FFFFFF" castShadow />
        <pointLight position={[1.4, -4, 2]} intensity={0.8} color="#FFF0C0" />
        <pointLight position={[4, 0, 0]} intensity={0.6} color="#FFE8B0" />

        <Environment preset="studio" />

        <BottleCarousel currentSlide={currentSlide} slideData={slideData} prevSlideRef={prevSlideRef} loaderState={loaderState} />
      </Canvas>
    </div>
  );
}

