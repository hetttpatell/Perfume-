import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/Logo.png';

export default function Navbar({ cartCount = 0, onOpenCart, onOpenAccount }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Homepage', targetId: 'hero' },
    { id: 'about', label: 'About', targetId: 'about' },
    { id: 'products', label: 'Services/Products', targetId: 'products' },
    { id: 'contact', label: 'Contact', targetId: 'contact' },
    { id: 'gallery', label: 'Gallery/FAQ', targetId: 'gallery' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      // Section tracking for active highlighting
      const sections = navLinks.map((link) => document.getElementById(link.targetId)).filter(Boolean);
      let currentActive = 'hero';

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= 100) {
          currentActive = sec.id;
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (targetId) => {
    setMobileMenuOpen(false);
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(targetId);
    if (elem) {
      const yOffset = -90; // header height offset
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-500 ease-in-out">
      <nav
        className={`pointer-events-auto transition-all duration-500 relative flex items-center justify-between select-none ${
          isScrolled
            ? 'mt-2 sm:mt-3.5 w-[94%] sm:w-[90%] max-w-6xl px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/10'
            : 'w-full max-w-7xl px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 bg-gradient-to-b from-white/95 via-white/60 to-transparent border-b border-transparent'
        }`}
      >
        {/* LEFT SECTION: Desktop Links & Tablet/Mobile Hamburger */}
        <div className="flex items-center shrink-0">
          {/* Desktop Navigation Links (XL screens 1280px+) */}
          <div className="hidden xl:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.targetId)}
                  className={`relative px-3 py-1.5 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer ${
                    isActive ? 'text-[#1A1A1A] font-bold' : 'text-[#555555] hover:text-[#1A1A1A]'
                  }`}
                >
                  {/* Active Indicator Background Pill */}
                  {isActive && (
                    <motion.span
                      layoutId="navbarActivePill"
                      className="absolute inset-0 bg-black/5 rounded-full border border-black/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* iPad / Tablet & Mobile Hamburger Menu Button (< 1280px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-full text-[#111111] hover:bg-black/5 transition-colors cursor-pointer shrink-0 flex items-center justify-center border border-black/10"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* MIDDLE SECTION: Official Brand Logo Image (Perfectly Balanced) */}
        <div
          id="navbar-brand-title"
          onClick={() => scrollToSection('hero')}
          className="flex items-center justify-center cursor-pointer group select-none px-3.5 sm:px-5 shrink-0 overflow-visible py-1"
        >
          <img
            src={logoImg}
            alt="LUNE Fragrance Logo"
            className="h-10 sm:h-12 md:h-14 max-h-[60px] w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[2.75] scale-[2.05] sm:scale-[2.35] md:scale-[2.65] origin-center"
          />
        </div>

        {/* RIGHT SECTION: Minimal Luxury Bag & Desktop Account */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Account Button — Desktop Only (Hover turns button black and text white) */}
          <button
            onClick={onOpenAccount}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-200 cursor-pointer active:scale-95 group"
            aria-label="User Account"
          >
            <div className="w-5 h-5 rounded-full bg-[#111111] group-hover:bg-white text-white group-hover:text-[#111111] font-serif font-extrabold text-[10px] flex items-center justify-center transition-colors duration-200 shadow-xs">
              E
            </div>
            <span className="font-sans font-extrabold text-xs tracking-[0.18em] uppercase">ACCOUNT</span>
          </button>

          {/* Bag Icon + Number — Hover turns button black and text white */}
          <button
            onClick={onOpenCart}
            className="px-2.5 sm:px-3 py-1.5 rounded-full text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 relative group"
            aria-label="Open Shopping Cart Bag"
          >
            <svg className="w-4.5 h-4.5 text-[#111111] group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="font-sans font-extrabold text-xs sm:text-sm text-[#111111] group-hover:text-white transition-colors duration-200">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {/* UNIQUE RIGHT-SIDE LUXURY NAVIGATION DRAWER (iPad & Mobile View) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Frosted Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="pointer-events-auto fixed inset-0 z-50 bg-black/40 backdrop-blur-sm xl:hidden"
            />

            {/* Right-Side Luxury Floating Slide Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="pointer-events-auto fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-[360px] sm:w-[380px] h-full bg-[#FAFAFA]/95 backdrop-blur-3xl border-l border-black/10 shadow-[-20px_0_50px_rgba(0,0,0,0.18)] flex flex-col justify-between p-6 sm:p-8 xl:hidden"
            >
              {/* Top Drawer Header */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div className="flex flex-col">
                    <span className="font-serif text-sm font-medium tracking-[0.25em] uppercase text-[#1A1A1A]">
                      NAVIGATION
                    </span>
                    <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-[#C08A3E] font-bold mt-0.5">
                      HAUTE PARFUMERIE
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full text-[#1A1A1A] hover:bg-black/5 hover:rotate-90 transition-all duration-300 cursor-pointer border border-black/10"
                    aria-label="Close Navigation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Staggered Luxury Section Navigation Links */}
                <div className="flex flex-col gap-2 pt-2">
                  {navLinks.map((link, idx) => {
                    const isActive = activeSection === link.id;
                    const numStr = `0${idx + 1}`;
                    return (
                      <button
                        key={link.id}
                        onClick={() => scrollToSection(link.targetId)}
                        className={`group relative text-left px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-[#1A1A1A] text-white shadow-md'
                            : 'text-[#1A1A1A] hover:bg-black/5 hover:translate-x-1.5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-sans text-[10px] font-bold tracking-widest ${
                              isActive ? 'text-[#C08A3E]' : 'text-[#8A8A8A] group-hover:text-[#C08A3E]'
                            }`}
                          >
                            {numStr}
                          </span>
                          <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase">
                            {link.label}
                          </span>
                        </div>

                        {isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C08A3E] animate-pulse" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#C08A3E]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Luxury Action Footer */}
              <div className="flex flex-col gap-4 pt-6 border-t border-black/10">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAccount) onOpenAccount();
                    }}
                    className="flex-1 py-3 text-xs font-sans font-bold tracking-widest uppercase bg-black/5 hover:bg-black hover:text-white text-[#1A1A1A] rounded-xl border border-black/10 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>ACCOUNT</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenCart) onOpenCart();
                    }}
                    className="flex-1 py-3 text-xs font-sans font-bold tracking-widest uppercase bg-gradient-to-r from-[#1A1A1A] via-[#2A241D] to-[#1A1A1A] hover:from-[#C08A3E] hover:to-[#966624] text-white rounded-xl border border-[#C08A3E]/40 shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>BAG ({cartCount})</span>
                  </button>
                </div>

                <p className="font-serif text-[10px] tracking-[0.25em] uppercase text-center text-[#8A8A8A] pt-2">
                  CHANEL N°19 · HAUTE PARFUMERIE
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
