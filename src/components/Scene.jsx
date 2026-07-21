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
    // Mobile: model positioned higher up (y = 1.05) so it floats above text
    return { x: 0, y: 1.05, scale: 9.5, isMobile: true };
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

// 3D Perfume Bottle Mesh Component
function BottleMesh({ scene }) {
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (!child.isMesh) return;
      if (child.material) {
        if (child.material.map) child.material.map.colorSpace = THREE.SRGBColorSpace;
        if (child.material.envMapIntensity !== undefined) {
          child.material.envMapIntensity = Math.max(child.material.envMapIntensity, 1.2);
        }
        child.material.needsUpdate = true;
      }
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [scene]);

  return <primitive object={scene} />;
}

// 3D Perfume Carousel — Responsive Dual Group Motion with Group-Bound Shadows (No Center Ghost Shadow Artifacts)
function BottleCarousel({ currentSlide, slideData, prevSlideRef }) {
  const groupARef = useRef(null);
  const groupBRef = useRef(null);
  const activeGroupRef = useRef('A'); // Tracks which group is currently active at center

  const { scene: sceneA } = useGLTF(MODEL_PATH);
  const { scene: sceneB } = useGLTF(MODEL_PATH);

  // Clone scene for groupB so both instances render independently
  const sceneBCloned = useMemo(() => sceneB.clone(true), [sceneB]);

  const initialCoords = getResponsiveCoords();

  // Position & rotation state for Group A & Group B (unscaled raw units)
  const posA = useRef({
    x: initialCoords.x,
    y: initialCoords.y,
    z: 0,
    scale: initialCoords.scale,
    rotY: 0,
    rotZ: 0,
    rotX: 0,
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

  // Update base coordinates on window resize
  useEffect(() => {
    const handleResize = () => {
      const coords = getResponsiveCoords();
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
      <group ref={groupARef} position={[initialCoords.x, initialCoords.y, 0]}>
        <Center>
          <BottleMesh scene={sceneA} />
        </Center>
        <ContactShadows
          position={[0, -0.11, 0]}
          opacity={0.14}
          scale={0.3}
          blur={2.0}
          far={2}
          color="#1A1A1A"
        />
      </group>

      {/* Group B (Simultaneous Entry/Exit Model Instance) */}
      <group ref={groupBRef} position={[initialCoords.x + 5.5, initialCoords.y - 4.5, -3]}>
        <Center>
          <BottleMesh scene={sceneBCloned} />
        </Center>
        <ContactShadows
          position={[0, -0.11, 0]}
          opacity={0.14}
          scale={0.3}
          blur={2.0}
          far={2}
          color="#1A1A1A"
        />
      </group>
    </>
  );
}

export default function Scene({ currentSlide, slideData }) {
  const prevSlideRef = useRef(currentSlide);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}
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

        <BottleCarousel currentSlide={currentSlide} slideData={slideData} prevSlideRef={prevSlideRef} />
      </Canvas>
    </div>
  );
}
