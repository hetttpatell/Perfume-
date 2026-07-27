import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/Logo.png';

export default function Navbar({ loaderState = 'completed', cartCount = 0, onOpenCart, onOpenAccount }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { id: 'hero', label: 'Homepage', targetId: 'hero', path: '/' },
    { id: 'products', label: 'Collection', targetId: 'products', path: '/collection' },
    { id: 'about', label: 'About', targetId: 'about', path: '/about' },
    { id: 'gallery', label: 'Gallery', targetId: 'gallery', path: '/#gallery' },
    { id: 'contact', label: 'Contact', targetId: 'contact', path: '/contact' },
  ];

  // Lock background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (location.pathname === '/collection') {
      setActiveSection('products');
    } else if (location.pathname === '/about') {
      setActiveSection('about');
    } else if (location.pathname === '/contact') {
      setActiveSection('contact');
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 40);

          if (location.pathname === '/') {
            // Section tracking for active highlighting on Homepage
            const sections = navLinks
              .filter(link => link.id !== 'products' && link.id !== 'about' && link.id !== 'contact')
              .map((link) => document.getElementById(link.targetId))
              .filter(Boolean);
            let currentActive = 'hero';

            sections.forEach((sec) => {
              const rect = sec.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= 100) {
                currentActive = sec.id;
              }
            });

            setActiveSection(currentActive);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (targetId) => {
    setMobileMenuOpen(false);

    if (targetId === 'products') {
      navigate('/collection');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'about') {
      navigate('/about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'contact') {
      navigate('/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (targetId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const elem = document.getElementById(targetId);
          if (elem) {
            const yOffset = -90;
            const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 100);
      return;
    }

    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(targetId);
    if (elem) {
      const yOffset = -90;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isVisible = loaderState === 'completed';

  return (
    <>
      {/* ── 1. TOP FLOATING RESPONSIVE LUXURY NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        <nav
          className={`pointer-events-auto transition-all duration-300 ease-out relative flex items-center justify-between select-none transform-gpu ${
            isScrolled
              ? 'mt-1.5 sm:mt-2.5 w-[92%] sm:w-[86%] max-w-5xl px-3 sm:px-5 py-1.5 rounded-full bg-white/90 sm:bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-black/10 sm:border-white/50 scale-[0.98]'
              : 'mt-1.5 sm:mt-3.5 w-[94%] sm:w-[93%] max-w-7xl px-3 sm:px-8 py-1.5 sm:py-3.5 rounded-full bg-white/85 sm:bg-white/45 backdrop-blur-xl shadow-[0_6px_25px_rgba(0,0,0,0.08)] border border-black/10 sm:border-white/40 scale-100'
          }`}
        >
          {/* LEFT SECTION: Desktop Links & Mobile Hamburger */}
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

            {/* Mobile Hamburger Toggle Button */}
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

          {/* CENTER SECTION: Official Brand Logo Image */}
          <div
            onClick={() => scrollToSection('hero')}
            className="flex items-center justify-center cursor-pointer group select-none px-3.5 sm:px-5 shrink-0 overflow-visible py-1"
          >
            <img
              src={logoImg}
              alt="LUNE Fragrance Logo"
              className="h-9 sm:h-12 md:h-14 max-h-[60px] w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[2.75] scale-[1.95] sm:scale-[2.35] md:scale-[2.65] origin-center"
            />
          </div>

          {/* RIGHT SECTION: Minimal Luxury Bag & Desktop Account */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={onOpenAccount}
              className="hidden xl:flex items-center gap-2 text-[11px] xl:text-[12px] font-sans font-medium tracking-[0.14em] uppercase text-[#1A1A1A] hover:text-[#C08A3E] transition-colors duration-300 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Account</span>
            </button>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#C08A3E] text-white transition-all duration-300 cursor-pointer shadow-sm group active:scale-95"
              aria-label="View Shopping Bag"
            >
              <svg className="w-3.5 h-3.5 text-[#F3E5AB] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-[11px] font-sans font-bold tracking-widest">{cartCount}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ── 2. INDEPENDENT MOBILE & TABLET NAVIGATION DRAWER MODAL ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="pointer-events-auto fixed inset-0 z-50 overflow-hidden xl:hidden">
            {/* Full-Screen Dark Dim Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Right-Side Solid White Luxury Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-[360px] sm:w-[380px] h-full bg-white border-l border-black/10 shadow-[-20px_0_60px_rgba(0,0,0,0.25)] flex flex-col justify-between p-6 sm:p-8 will-change-transform z-10"
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
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + idx * 0.04, duration: 0.25, ease: 'easeOut' }}
                        onClick={() => scrollToSection(link.targetId)}
                        className={`group relative text-left px-4 py-3.5 rounded-2xl transition-colors duration-200 flex items-center justify-between cursor-pointer ${
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
                      </motion.button>
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
                  LUNE · HAUTE PARFUMERIE
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
