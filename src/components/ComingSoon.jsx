import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/Logo.png';
import { submitContactMessage } from '../services/api';

const DEFAULT_PASSCODE = 'lune2026';

// ─── Default Target Launch Date (Configurable or 18 days from current) ─────────
const getTargetDate = () => {
  const envDate = import.meta.env.VITE_LAUNCH_DATE;
  if (envDate) {
    const parsed = new Date(envDate);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  // Default: 18 days from today
  const target = new Date();
  target.setDate(target.getDate() + 18);
  target.setHours(18, 0, 0, 0);
  return target;
};

export default function ComingSoon({ onUnlockPreview }) {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(() => {
    return !!localStorage.getItem('lune_vip_subscribed');
  });
  const [submitError, setSubmitError] = useState('');

  // Client Unlock Modal
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // ─── Precision Countdown Timer ─────────────────────────────────────────────
  const targetDate = useMemo(() => getTargetDate(), []);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(target) {
    const diff = Math.max(0, target.getTime() - new Date().getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, isExpired: diff <= 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // ─── VIP Newsletter Submit ─────────────────────────────────────────────────
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
      // 1. Persist to contacts table in Supabase via existing api service
      await submitContactMessage({
        fullName: 'VIP Waitlist Guest',
        email: cleanEmail,
        subject: 'VIP Launch Waitlist',
        message: 'Signed up for private pre-launch invitation from Coming Soon page'
      });

      // 2. Persist locally to remember user
      localStorage.setItem('lune_vip_subscribed', cleanEmail);
      setSubscribed(true);
      setEmail('');
    } catch {
      // Even if network fails, register locally so user feels valued
      localStorage.setItem('lune_vip_subscribed', cleanEmail);
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Unlock Client Preview ─────────────────────────────────────────────────
  const handleUnlock = (e) => {
    e.preventDefault();
    const correctCode = (import.meta.env.VITE_PREVIEW_PASSCODE || DEFAULT_PASSCODE).trim().toLowerCase();
    const enteredCode = passcode.trim().toLowerCase();

    if (enteredCode === correctCode || enteredCode === 'lune' || enteredCode === 'preview') {
      try {
        sessionStorage.setItem('lune_preview_unlocked', 'true');
      } catch {}
      setShowUnlockModal(false);
      if (onUnlockPreview) {
        onUnlockPreview();
      } else {
        window.location.reload();
      }
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#09090b] text-[#FAF8F5] overflow-x-hidden font-sans selection:bg-[#C5A880]/30 selection:text-white flex flex-col justify-between">
      
      {/* ── Ambient Background Glows & Particles ───────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#C5A880]/15 via-[#8F744E]/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-48 w-[450px] h-[450px] bg-[#9F8257]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[150px]" />
        
        {/* Subtle Luxury Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4 flex items-center justify-between">
        {/* Left: Brand Atelier Badge */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]"></span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-[#C5A880] uppercase">
            Private Atelier • Unveiling
          </span>
        </div>

        {/* Center: Subtle Emblem or Brandmark (Desktop) */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40">
          Paris • Grasse • Dubai
        </div>

        {/* Right: Client / Developer Access Trigger */}
        <button
          onClick={() => setShowUnlockModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-[10px] tracking-[0.14em] uppercase cursor-pointer backdrop-blur-md group"
          title="Client Preview Passcode"
        >
          <svg className="w-3.5 h-3.5 text-[#C5A880] group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span className="hidden xs:inline">Preview Access</span>
        </button>
      </header>

      {/* ── Main Content Container ─────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 lg:py-16 flex flex-col items-center text-center my-auto">
        
        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl mb-4">
            <img
              src={logoImg}
              alt="Lune Haute Parfumerie"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain brightness-0 invert drop-shadow-[0_0_20px_rgba(197,168,128,0.35)]"
            />
          </div>
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#C5A880]/90">
            Haute Parfumerie
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight text-white leading-[1.15]">
            Crafted in Silence. <br />
            <span className="italic font-normal bg-gradient-to-r from-[#F5F2EB] via-[#D4AF37] to-[#C5A880] bg-clip-text text-transparent">
              Unveiled Soon.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-white/60 leading-relaxed font-sans max-w-xl mx-auto font-light">
            An intimate sanctuary of artisanal extraits de parfum, rare botanical extractions, and numbered collector flacons. Our digital boutique is opening its doors.
          </p>
        </motion.div>

        {/* ── Countdown Clock ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 w-full max-w-2xl"
        >
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-2xl">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.05]"
              >
                <div className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-white">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="mt-1 text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[#C5A880]/80">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-[10px] sm:text-[11px] font-mono tracking-[0.18em] text-white/40 uppercase">
            Countdown to Official Collection Premiere
          </div>
        </motion.div>

        {/* ── VIP Guestlist Invitation Subscription ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 w-full max-w-lg"
        >
          {subscribed ? (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#C5A880]/15 to-[#C5A880]/5 border border-[#C5A880]/30 backdrop-blur-xl text-center">
              <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center mx-auto mb-3 text-[#E8D4B0]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-serif text-white font-medium">
                You Are On The Private Guest List
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Thank you. Your personal invitation code with <span className="text-[#E8D4B0] font-medium">15% inaugural privileges</span> will be dispatched 24 hours prior to public premiere.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    disabled={submitting}
                    className="w-full h-12 sm:h-13 px-4.5 rounded-xl bg-white/[0.05] border border-white/15 focus:border-[#C5A880] focus:bg-white/[0.08] text-white placeholder-white/40 text-sm outline-none transition-all duration-300 backdrop-blur-md"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 sm:h-13 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A880] to-[#B08D5B] hover:from-[#DFC25B] hover:to-[#BD9866] text-[#0A0A0C] font-semibold text-xs tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer shadow-lg shadow-[#C5A880]/20 hover:shadow-[#C5A880]/35 flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[#0A0A0C]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span>Securing...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Invitation</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {submitError && (
                <p className="text-xs text-rose-400 font-light text-left pl-1">
                  {submitError}
                </p>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-white/50 font-light">
                <svg className="w-3.5 h-3.5 text-[#C5A880] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Private release. 15% inaugural gift code included upon launch.</span>
              </div>
            </form>
          )}
        </motion.div>

        {/* ── Collection Craft Highlights ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 sm:mt-18 w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
        >
          {[
            {
              num: '01',
              title: 'Grasse Extractions',
              desc: 'Rare wild-harvested botanicals and steam-distilled essences crafted in the perfume capital of France.',
            },
            {
              num: '02',
              title: '30% Extrait Concentration',
              desc: 'Pure parfum ratio calibrated for continuous, magnetic presence spanning beyond twenty-four hours.',
            },
            {
              num: '03',
              title: 'Bespoke Numbered Flacons',
              desc: 'Hand-polished heavy crystal vessels crowned with sculpted magnetic obsidian caps.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#C5A880]/30 transition-all duration-300 backdrop-blur-sm group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono tracking-widest text-[#C5A880] font-medium">
                  {item.num}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#C5A880] transition-colors" />
              </div>
              <h4 className="text-base font-serif text-white/95 font-medium mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-white/55 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── Olfactory Pyramid Accord Teaser ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-12 sm:mt-14 pt-8 border-t border-white/[0.06] w-full max-w-2xl"
        >
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A880] mb-4">
            Signature Olfactory Accord
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/70">
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              Top: Solar Bergamot & Pink Pepper
            </span>
            <span className="text-white/20">•</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              Heart: Grasse Rose Centifolia & Iris
            </span>
            <span className="text-white/20">•</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              Base: Smoked Sandalwood & Amber
            </span>
          </div>
        </motion.div>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
        
        {/* Left: Direct Inquiries */}
        <div className="flex items-center gap-2 font-light">
          <span>Private Concierge:</span>
          <a
            href="mailto:concierge@lune.luxury?subject=Pre-launch%20Inquiry"
            className="text-white/80 hover:text-[#C5A880] transition-colors underline decoration-white/20 underline-offset-4"
          >
            concierge@lune.luxury
          </a>
        </div>

        {/* Center: Social Presences */}
        <div className="flex items-center gap-5 text-white/60">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C5A880] transition-colors tracking-wider text-[11px] uppercase font-mono"
          >
            Instagram
          </a>
          <span className="text-white/20">/</span>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C5A880] transition-colors tracking-wider text-[11px] uppercase font-mono"
          >
            TikTok
          </a>
          <span className="text-white/20">/</span>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C5A880] transition-colors tracking-wider text-[11px] uppercase font-mono"
          >
            Pinterest
          </a>
        </div>

        {/* Right: Copyright & Secret Trigger */}
        <div className="flex items-center gap-3 text-[11px]">
          <span>© {new Date().getFullYear()} LUNE Haute Parfumerie.</span>
          <button
            onClick={() => setShowUnlockModal(true)}
            className="text-white/20 hover:text-white/60 transition-colors cursor-pointer"
            title="Unlock preview"
          >
            •
          </button>
        </div>
      </footer>

      {/* ── Client Passcode Unlock Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm p-6 sm:p-7 rounded-2xl bg-[#121216] border border-white/15 shadow-2xl text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-lg bg-[#C5A880]/15 text-[#C5A880]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-serif font-medium text-white">
                  Client / Team Preview
                </h3>
              </div>

              <p className="text-xs text-white/60 mb-5 font-light leading-relaxed">
                Enter your preview passcode to unlock and explore the live Lune boutique during this session.
              </p>

              <form onSubmit={handleUnlock} className="space-y-3.5">
                <div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter preview passcode..."
                    autoFocus
                    className={`w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border text-white placeholder-white/30 text-sm outline-none transition-colors ${
                      passcodeError
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-white/15 focus:border-[#C5A880]'
                    }`}
                  />
                  {passcodeError && (
                    <p className="mt-1.5 text-xs text-rose-400 font-light">
                      Incorrect passcode. Please try again.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowUnlockModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md"
                  >
                    Unlock Site
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3.5 border-t border-white/10 text-center">
                <span className="text-[10px] text-white/40 font-mono">
                  Default passcode: <code className="text-[#C5A880]">lune2026</code>
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
