import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/Logo.png';
import brandStoryImg from '../assets/brand_heritage_story.png';

export default function DiscountOfferModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      // 1. Clean up legacy dismissed flag if present
      localStorage.removeItem('perfume_discount_dismissed');

      // 2. Check if user already submitted email permanently in past
      const hasClaimed = localStorage.getItem('perfume_discount_claimed');
      if (hasClaimed) return;

      // 3. Check if user dismissed it in current active session
      const dismissedThisSession = sessionStorage.getItem('perfume_discount_dismissed_session');
      if (dismissedThisSession) return;
    } catch {
      // Ignore storage errors
    }

    // Set 10-second timer: only show if user stays > 10 seconds and hasn't given email
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      // Dismiss for current active session only if closed without submitting email
      sessionStorage.setItem('perfume_discount_dismissed_session', 'true');
    } catch {
      // Ignore storage errors
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Save submitted email to localStorage permanently so modal never shows again
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      try {
        localStorage.setItem('perfume_discount_claimed', 'true');
        localStorage.setItem('perfume_discount_email', email);
      } catch {
        // Ignore storage errors
      }
    }, 700);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('LUNE-PRIVILEGE10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Light Glassmorphic Backdrop Overlay (Not Heavy Blackish) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-md"
          />

          {/* High-Fashion Dual-Column Luxury Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative z-10 w-full max-w-sm sm:max-w-xl md:max-w-3xl max-h-[92vh] bg-[#FAF8F5] text-[#111111] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.25)] flex flex-col md:flex-row font-sans border border-black/15 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Column (Top on Mobile, Left on Desktop) */}
            <div className="relative w-full md:w-5/12 h-40 sm:h-52 md:h-auto min-h-[160px] md:min-h-[440px] overflow-hidden bg-[#111111] shrink-0">
              <img
                src={brandStoryImg}
                alt="Lune Heritage"
                className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
              />

              {/* Floating Gold Discount Badge */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/85 backdrop-blur-md border border-amber-400/40 rounded-full shadow-md">
                <span className="font-sans font-extrabold text-[9px] tracking-[0.2em] text-amber-300 uppercase">
                  10% OFF PRIVILEGE
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                <span className="font-sans font-bold text-[8.5px] sm:text-[9px] tracking-[0.3em] uppercase text-white/70 mb-0.5">
                  PARIS • 31 RUE CAMBON
                </span>
                <p className="font-serif font-light text-base sm:text-xl md:text-2xl tracking-tight uppercase text-white leading-tight">
                  LE RITUEL DE PARFUM
                </p>
              </div>
            </div>

            {/* Content & Form Column */}
            <div className="relative w-full md:w-7/12 p-5 sm:p-7 md:p-9 flex flex-col justify-between bg-[#FAF8F5] overflow-y-auto">
              {/* Header: Clean Brand Logo + Close Button */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/10 mb-4">
                <div className="flex items-center gap-3.5 sm:gap-4 overflow-visible">
                  {/* Prominent large brand logo matching Navbar scale */}
                  <img
                    src={logoImg}
                    alt="LUNE Fragrance Logo"
                    className="h-12 sm:h-16 md:h-18 max-h-[75px] w-auto object-contain mix-blend-multiply scale-125 sm:scale-135 origin-left"
                  />
                  <div className="h-6 w-[1px] bg-black/20" />
                  <span className="font-sans font-extrabold text-[9.5px] sm:text-[10.5px] tracking-[0.25em] uppercase text-[#111111]">
                    OFFICIAL PRIVILEGE
                  </span>
                </div>

                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-[#111111] text-[#111111] hover:text-white border border-black/15 transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95 shadow-2xs"
                  aria-label="Close offer modal"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!isSubmitted ? (
                /* State 1: Purpose & Email Form */
                <div className="flex-1 flex flex-col justify-center space-y-4 py-1">
                  {/* Purpose Badge & Main Offer Title */}
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700/10 text-emerald-800 border border-emerald-700/25 font-sans font-extrabold text-[8.5px] uppercase tracking-[0.25em] rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      SPECIAL WELCOME OFFER
                    </span>

                    {/* Clear Main Headline highlighting 10% OFF */}
                    <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] uppercase tracking-tight leading-[1.08]">
                      GET 10% OFF YOUR FIRST ORDER
                    </h2>

                    {/* Clear Purpose Description */}
                    <p className="font-sans text-xs sm:text-sm text-[#444444] font-semibold leading-relaxed">
                      Enter your email address below to receive your single-use <strong className="text-[#111111] font-black">10% discount promo code</strong> sent directly to your inbox.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-1.5">
                        ENTER YOUR EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3.5 bg-white border-2 border-black/15 focus:border-black rounded-xl text-xs font-sans font-semibold text-[#111111] placeholder:text-[#888888] focus:outline-none shadow-xs transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 sm:py-4 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl transition-all duration-200 cursor-pointer active:scale-98 shadow-md flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>CLAIM MY 10% DISCOUNT CODE</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="font-sans text-[9.5px] text-[#666666] hover:text-[#111111] transition-colors uppercase font-bold tracking-widest cursor-pointer"
                    >
                      No thanks, I'll pay full price
                    </button>
                  </div>
                </div>
              ) : (
                /* State 2: Success Confirmation & Code */
                <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-emerald-700/10 text-emerald-800 border border-emerald-700/25 font-sans font-extrabold text-[8.5px] uppercase tracking-[0.25em] rounded-full">
                      DISPATCHED TO INBOX ✓
                    </span>
                    <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] uppercase tracking-tight">
                      YOUR 10% DISCOUNT IS READY
                    </h2>
                    <p className="font-sans text-xs text-[#444444] font-semibold leading-relaxed">
                      We sent your single-use 10% off code to <span className="text-[#111111] font-black">{email}</span>. You can copy it directly below:
                    </p>
                  </div>

                  {/* Code Box */}
                  <div className="bg-white border-2 border-black/15 rounded-xl sm:rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="text-left">
                      <span className="block font-sans text-[8.5px] text-[#666666] font-bold uppercase tracking-widest">
                        SINGLE-USE PROMO CODE
                      </span>
                      <span className="font-mono font-black text-base sm:text-lg md:text-xl text-[#111111] tracking-wider">
                        LUNE-PRIVILEGE10
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-[10px] tracking-[0.18em] uppercase rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 shadow-xs"
                    >
                      {copied ? 'COPIED ✓' : 'COPY CODE'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3.5 bg-black/5 hover:bg-black/10 text-[#111111] font-sans font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer active:scale-98 border border-black/15"
                  >
                    START SHOPPING WITH 10% OFF
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
