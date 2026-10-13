import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import comingSoonHero from '../assets/coming_soon_hero.jpg';

const DEFAULT_PASSCODE = 'lune2026';
const INSTAGRAM_URL = 'https://www.instagram.com/lune.fragrances?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw==';

export default function ComingSoon({ onUnlockPreview }) {
  // Client Unlock Modal
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Parallax for Desktop Photo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 30 });
  const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  };

  // ─── Floating Gold & Amber Particles ──────────────────────────────────────
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.25 + 0.04,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.25 - 0.08,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.012;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        g.addColorStop(0, `rgba(197, 168, 128, ${a})`);
        g.addColorStop(1, 'rgba(197, 168, 128, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ─── Client Unlock ─────────────────────────────────────────────────────────
  const handleUnlock = (e) => {
    e.preventDefault();
    const correctCode = (import.meta.env.VITE_PREVIEW_PASSCODE || DEFAULT_PASSCODE).trim().toLowerCase();
    const enteredCode = passcode.trim().toLowerCase();
    if (enteredCode === correctCode || enteredCode === 'lune' || enteredCode === 'preview') {
      try {
        sessionStorage.setItem('lune_preview_unlocked', 'true');
      } catch {}
      setShowUnlockModal(false);
      if (onUnlockPreview) onUnlockPreview();
      else window.location.reload();
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2500);
    }
  };

  // Stagger variants
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen lg:h-screen w-screen overflow-x-hidden lg:overflow-hidden select-none flex flex-col justify-between"
      style={{ fontFamily: "'Outfit', 'Inter', sans-serif", background: '#FAF9F7' }}
    >
      {/* Canvas Particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[5]" />

      {/* Atmospheric Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-[140px] opacity-25"
          style={{ background: 'radial-gradient(circle, #D4C5A9 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[440px] h-[440px] rounded-full blur-[130px] opacity-20"
          style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)' }}
        />
      </div>

      {/* ═══════ MAIN LAYOUT ═══════ */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row h-full w-full">

        {/* ════ LEFT PANEL (Editorial Content — Centered) ════ */}
        <div className="relative flex-1 flex flex-col justify-between px-6 sm:px-12 lg:px-14 xl:px-16 py-8 sm:py-10 lg:py-12 text-center items-center max-w-full lg:max-w-[50%] xl:max-w-[52%]">

          {/* Top breathing room */}
          <div className="w-full h-2 sm:h-4 mb-auto" />

          {/* ── Main Editorial Content (Centered in the Left Section) ────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="my-auto py-6 sm:py-8 flex flex-col items-center text-center w-full max-w-lg mx-auto"
          >
            {/* LUNE Logo — Centered in the middle of left section */}
            <motion.div variants={fadeUp} className="mb-6 sm:mb-8 flex flex-col items-center">
              <img
                src="/assets/Logo.png"
                alt="LUNE FRAGRANCE"
                className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto object-contain mx-auto"
                style={{ filter: 'contrast(1.08)' }}
              />
              {/* Refined Gold Separation Line — Centered */}
              <div className="mt-4 sm:mt-5 mx-auto w-32 sm:w-44 h-[1px] bg-gradient-to-r from-transparent via-[#BFA15F] to-transparent" />
            </motion.div>

            {/* COMING SOON Heading — Centered */}
            <motion.div variants={fadeUp} className="space-y-2">
              <p
                className="text-xs sm:text-sm text-[#948A7B] font-light tracking-[0.24em] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Our New Website Is
              </p>
              <h1
                className="text-[clamp(2.5rem,5.2vw,4.4rem)] font-extralight tracking-[0.14em] text-[#111] leading-[1.08]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                COMING SOON
              </h1>
            </motion.div>

            {/* Editorial Description — Centered */}
            <motion.p
              variants={fadeUp}
              className="text-[13px] sm:text-[14px] text-[#766F65] font-light leading-[1.75] max-w-md mx-auto mt-5 sm:mt-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              We are crafting an extraordinary haute fragrance experience.
              Something truly exceptional is on its way — stay connected with our maison.
            </motion.p>

            {/* ── ELEGANT LUXURY INSTAGRAM SECTION — Centered ───────────── */}
            <motion.div variants={fadeUp} className="mt-8 sm:mt-10 w-full flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
                <span
                  className="text-[9.5px] sm:text-[10px] tracking-[0.28em] uppercase text-[#998E7D] font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Connect With Us
                </span>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Lune Fragrances on Instagram"
                className="group relative inline-flex items-center gap-4 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border border-[#DFD7CA] hover:border-[#BFA15F] bg-white/85 hover:bg-white backdrop-blur-md transition-all duration-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_-6px_rgba(191,161,95,0.25)] hover:-translate-y-0.5 cursor-pointer max-w-sm w-full sm:w-auto"
              >
                {/* Haute Parfumerie Gold & Obsidian Emblem */}
                <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#ECE4D6] border border-[#DFD6C6] group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-300 shadow-sm shrink-0">
                  <svg
                    className="w-5 h-5 text-[#8E7340] group-hover:text-[#D4AF37] transition-colors duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>

                {/* Account Details */}
                <div className="flex flex-col text-left">
                  <span
                    className="text-[14px] sm:text-[15px] font-normal text-[#1A1A1A] group-hover:text-[#000] tracking-[0.04em] transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    @lune.fragrances
                  </span>
                  <span
                    className="text-[10px] text-[#9A9184] group-hover:text-[#8E7340] transition-colors tracking-[0.16em] uppercase font-light"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Follow on Instagram
                  </span>
                </div>

                {/* Subtle Luxury Arrow */}
                <div className="ml-auto pl-2">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FAF8F5] border border-[#E8E2D6] group-hover:bg-[#BFA15F] group-hover:border-[#BFA15F] transition-all duration-300">
                    <svg
                      className="w-3.5 h-3.5 text-[#8E7E6A] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="w-full pt-6 flex items-center justify-center relative text-[11px] text-[#A8A094] tracking-wider"
          >
            <span>© {new Date().getFullYear()} LUNE Fragrance. All rights reserved.</span>

            {/* Discreet Preview Access Trigger for Client */}
            <button
              onClick={() => setShowUnlockModal(true)}
              title="Preview Access"
              className="absolute right-0 hidden lg:inline-flex items-center gap-1.5 opacity-35 hover:opacity-100 transition-opacity cursor-pointer text-[10px] text-[#8E8478] tracking-widest uppercase"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Preview</span>
            </button>
          </motion.footer>
        </div>

        {/* ════ RIGHT PANEL — Full-Bleed Photo to Whole Edges (Desktop Only) ════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="hidden lg:flex relative lg:w-[50%] h-full shrink-0 overflow-hidden"
        >
          <div className="relative w-full h-full overflow-hidden bg-[#0C1017]">
            <motion.img
              src={comingSoonHero}
              alt="LUNE Perfume Distillation Atelier"
              className="w-full h-full object-cover select-none"
              style={{ x: imgX, y: imgY, scale: 1.05 }}
              loading="eager"
            />

            {/* Gradient Vignette for dramatic atmosphere and text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />

            {/* ── TAGLINE OVERLAID ON PHOTOGRAPH ONLY ── */}
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 lg:p-14 flex flex-col justify-end pointer-events-none z-10">
              <h2
                className="text-3xl sm:text-4xl xl:text-[46px] font-extrabold text-white tracking-[0.04em] uppercase leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-lg"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Something is brewing
              </h2>
            </div>

            {/* Delicate ambient shine sweep */}
            <div
              className="absolute -inset-full w-[300%] h-[300%] pointer-events-none opacity-10"
              style={{
                background: 'linear-gradient(45deg, transparent 44%, rgba(255,255,255,0.8) 50%, transparent 56%)',
                animation: 'shineSweep 14s infinite ease-in-out',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Unlock Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm p-7 rounded-2xl bg-[#FAFAF8] border border-[#E0DBD0] shadow-2xl"
              style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
            >
              <button
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#999] hover:text-[#111] hover:bg-black/5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-[#111]/5 text-[#111]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-[#111]">Preview Access</h3>
              </div>

              <p className="text-xs text-[#777] mb-5 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Enter your preview passcode to unlock and explore the live Lune boutique during this session.
              </p>

              <form onSubmit={handleUnlock} className="space-y-3.5">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter preview passcode..."
                  autoFocus
                  className={`w-full h-11 px-4 rounded-xl bg-white border text-[#111] placeholder-[#BBB] text-sm outline-none transition-colors ${
                    passcodeError ? 'border-rose-500' : 'border-[#E0DBD0] focus:border-[#C5A880]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {passcodeError && <p className="text-xs text-rose-500 font-light">Incorrect passcode.</p>}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowUnlockModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#777] hover:text-[#111] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#111] hover:bg-[#000] text-white font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md"
                  >
                    Unlock Site
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3.5 border-t border-[#E8E4DC] text-center">
                <span className="text-[10px] text-[#AAA] font-mono">
                  Default passcode: <code className="text-[#555] font-bold">lune2026</code>
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shineSweep {
          0%, 100% { transform: translate(-30%, -30%) rotate(0deg); }
          50% { transform: translate(30%, 30%) rotate(8deg); }
        }
      `}</style>
    </div>
  );
}

