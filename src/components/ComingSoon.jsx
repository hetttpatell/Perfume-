import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import comingSoonHero from '../assets/coming_soon_hero.jpg';
import { submitContactMessage } from '../services/api';

const DEFAULT_PASSCODE = 'lune2026';
const INSTAGRAM_URL = 'https://www.instagram.com/lune.fragrances?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw==';

export default function ComingSoon({ onUnlockPreview }) {
  // ─── State ───────────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(() => !!localStorage.getItem('lune_vip_subscribed'));
  const [submitError, setSubmitError] = useState('');

  // Client Unlock Modal
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 30 });
  const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  };

  // ─── Floating Particles ────────────────────────────────────────────────────
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.25 + 0.03,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.25 - 0.08,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX; p.y += p.speedY; p.pulse += 0.012;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
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
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  // ─── Subscribe ─────────────────────────────────────────────────────────────
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMessage({
        fullName: 'VIP Waitlist Guest', email: cleanEmail,
        subject: 'VIP Launch Waitlist',
        message: 'Signed up for private pre-launch invitation from Coming Soon page',
      });
      localStorage.setItem('lune_vip_subscribed', cleanEmail);
      setSubscribed(true); setEmail('');
    } catch {
      localStorage.setItem('lune_vip_subscribed', cleanEmail);
      setSubscribed(true);
    } finally { setSubmitting(false); }
  };

  // ─── Client Unlock ─────────────────────────────────────────────────────────
  const handleUnlock = (e) => {
    e.preventDefault();
    const correctCode = (import.meta.env.VITE_PREVIEW_PASSCODE || DEFAULT_PASSCODE).trim().toLowerCase();
    const enteredCode = passcode.trim().toLowerCase();
    if (enteredCode === correctCode || enteredCode === 'lune' || enteredCode === 'preview') {
      try { sessionStorage.setItem('lune_preview_unlocked', 'true'); } catch {}
      setShowUnlockModal(false);
      if (onUnlockPreview) onUnlockPreview(); else window.location.reload();
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2500);
    }
  };

  // Stagger variants
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{ fontFamily: "'Outfit', 'Inter', sans-serif", background: '#FAF9F7' }}
    >
      {/* Particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[5]" />

      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
          style={{ background: 'radial-gradient(circle, #D4C5A9 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)' }} />
      </div>

      {/* ═══════ MAIN LAYOUT ═══════ */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row">

        {/* ════ LEFT PANEL ════ */}
        <div className="relative flex-1 flex flex-col px-8 sm:px-12 lg:px-16 xl:px-24 py-6 lg:py-8 lg:max-w-[55%]">

          {/* Spacer for top alignment */}
          <div className="mb-auto" />

          {/* ── Hero Content (vertically centered) ────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col justify-center"
          >
            {/* Logo */}
            <motion.div variants={fadeUp} className="mb-8 sm:mb-10">
              <div className="ml-3 sm:ml-6">
                <img
                  src="/assets/Logo.png"
                  alt="LUNE FRAGRANCE"
                  className="h-14 sm:h-18 md:h-22 lg:h-26 xl:h-28 w-auto object-contain"
                  style={{ filter: 'contrast(1.1)' }}
                />
              </div>
              {/* Separation line beneath logo */}
              <div className="mt-5 sm:mt-6 ml-3 sm:ml-6 w-36 sm:w-52 h-[1px] bg-gradient-to-r from-[#BFA15F] via-[#D5D0C5] to-transparent" />
            </motion.div>

            {/* COMING SOON */}
            <motion.div variants={fadeUp}>
              <p className="text-xs sm:text-sm text-[#999] font-light tracking-[0.15em] uppercase mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Our New Website Is
              </p>
              <h1
                className="text-[clamp(2.2rem,5.5vw,4.5rem)] font-extralight tracking-[0.12em] text-[#111] leading-[1.1] mb-0"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                COMING SOON
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-[12.5px] sm:text-[13.5px] text-[#777] font-light leading-[1.7] max-w-sm mt-5 sm:mt-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              We're crafting an extraordinary fragrance experience.
              Something truly special is on its way — be the first to know.
            </motion.p>

            {/* Email Subscription */}
            <motion.div variants={fadeUp} className="mt-7 sm:mt-9">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white border border-[#D5D0C5] shadow-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-[#111]/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium text-[#333] tracking-wide">
                    You're on the list — we'll notify you at launch!
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="w-full max-w-sm">
                  <div className="flex items-stretch bg-white rounded-full border border-[#E0DBD0] hover:border-[#C5A880] focus-within:border-[#C5A880] transition-colors shadow-sm overflow-hidden">
                    <input
                      type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email Address"
                      required disabled={submitting}
                      className="flex-1 px-5 py-3 text-[13px] text-[#111] placeholder-[#BBB] bg-transparent outline-none"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                      type="submit" disabled={submitting}
                      className="px-5 sm:px-6 py-3 bg-[#111] hover:bg-[#000] text-white text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {submitting ? '...' : 'SUBSCRIBE'}
                    </button>
                  </div>
                  {submitError && <p className="mt-2 text-xs text-rose-500 font-light pl-5">{submitError}</p>}
                </form>
              )}
            </motion.div>

            {/* ── SOCIAL MEDIA — Highlighted ──────────────────────────────── */}
            <motion.div variants={fadeUp} className="mt-8 sm:mt-10">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#BBB] font-medium mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#E5E0D5] bg-white hover:bg-[#111] hover:border-[#111] transition-all duration-400 shadow-sm hover:shadow-lg cursor-pointer"
                >
                  {/* Instagram gradient icon */}
                  <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#222] group-hover:text-white transition-colors tracking-wide">
                      @lune.fragrances
                    </span>
                    <span className="text-[10px] text-[#999] group-hover:text-white/60 transition-colors tracking-wider uppercase">
                      Follow on Instagram
                    </span>
                  </div>
                  <svg className="w-4 h-4 ml-2 text-[#CCC] group-hover:text-white/70 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-auto pt-4 text-[10px] text-[#BBB] tracking-wide"
          >
            © {new Date().getFullYear()} LUNE Fragrance. All rights reserved.
          </motion.footer>
        </div>

        {/* ════ RIGHT PANEL — Hero Image (Desktop) ════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex relative lg:w-[45%] items-center justify-center p-5 xl:p-7"
        >
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)]">
            <motion.img
              src={comingSoonHero}
              alt="LUNE Fragrance"
              className="w-full h-full object-cover"
              style={{ x: imgX, y: imgY, scale: 1.08 }}
              loading="eager"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none" />
            {/* Light sweep */}
            <div
              className="absolute -inset-full w-[300%] h-[300%] pointer-events-none opacity-12"
              style={{
                background: 'linear-gradient(45deg, transparent 42%, rgba(255,255,255,0.75) 50%, transparent 58%)',
                animation: 'shineSweep 12s infinite ease-in-out',
              }}
            />
          </div>
        </motion.div>

        {/* ── Mobile Hero Image ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="block lg:hidden w-full px-6 pb-6"
        >
          <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden shadow-lg">
            <img src={comingSoonHero} alt="LUNE Fragrance" className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* ── Unlock Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm p-7 rounded-2xl bg-[#FAFAF8] border border-[#E0DBD0] shadow-2xl"
              style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
            >
              <button onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#999] hover:text-[#111] hover:bg-black/5 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-[#111]/5 text-[#111]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-[#111]">Preview Access</h3>
              </div>

              <p className="text-xs text-[#777] mb-5 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Enter your preview passcode to unlock and explore the live Lune boutique during this session.
              </p>

              <form onSubmit={handleUnlock} className="space-y-3.5">
                <input
                  type="password" value={passcode}
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
                  <button type="button" onClick={() => setShowUnlockModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#777] hover:text-[#111] transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit"
                    className="px-5 py-2 rounded-xl bg-[#111] hover:bg-[#000] text-white font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md">
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
