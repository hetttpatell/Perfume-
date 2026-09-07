import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import logoImg from '../assets/Logo.png';
import { useAuth } from '../context/AuthContext';

// ─── Client-finalized product categories (scalable — add/remove here) ────────
const PRODUCT_CATEGORIES = [
  { id: 'body-rollon',      label: 'Body Rollon',      categoryKey: 'Body Rollon' },
  { id: 'air-freshner',     label: 'Air Freshner',     categoryKey: 'Air Freshner' },
  { id: 'luxurious-combo',  label: 'Luxurious Combo',  categoryKey: 'Luxurious Combo' },
];

// All Navigation Links: Home + Categories + Contact
const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  ...PRODUCT_CATEGORIES,
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ loaderState = 'completed', cartCount = 0, onOpenCart, onOpenAccount }) {
  const { isLoggedIn, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // ─── Determine which nav item is currently active ──────────────────────────
  const activeNavId = useMemo(() => {
    if (location.pathname === '/collection') {
      const cat = searchParams.get('category');
      if (cat) {
        const match = PRODUCT_CATEGORIES.find(
          c => c.categoryKey.toLowerCase() === cat.toLowerCase()
        );
        if (match) return match.id;
      }
      return 'collection';
    }
    if (location.pathname === '/contact') return 'contact';
    if (location.pathname === '/') return 'home';
    return '';
  }, [location.pathname, searchParams]);

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

  // ─── Scroll tracking for frosted-glass effect ──────────────────────────────
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Navigation handler ────────────────────────────────────────────────────
  const handleNavClick = (link) => {
    setMobileMenuOpen(false);

    if (link.id === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (link.id === 'contact') {
      navigate('/contact');
      return;
    }

    // Category link → navigate to /collection?category=CategoryKey
    if (link.categoryKey) {
      navigate(`/collection?category=${encodeURIComponent(link.categoryKey)}`);
      return;
    }
  };

  const isVisible = location.pathname !== '/' || loaderState === 'completed' || loaderState === 'exiting';

  return (
    <>
      {/* ── 1. TOP FLOATING RESPONSIVE LUXURY NAVBAR ─────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        <nav
          className={`pointer-events-auto transition-all duration-300 ease-out relative flex items-center justify-between select-none transform-gpu rounded-full ${
            isScrolled
              ? 'mt-2.5 sm:mt-3 py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 w-[96%] sm:w-[94%] md:w-[92%] lg:w-[90%] max-w-7xl bg-white/95 backdrop-blur-2xl shadow-[0_6px_28px_rgba(0,0,0,0.08)] border border-black/8'
              : 'mt-3 sm:mt-3.5 md:mt-4 py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 md:px-7 w-[96%] sm:w-[94%] md:w-[92%] lg:w-[90%] max-w-7xl bg-white/90 backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-black/8'
          }`}
        >
          {/* 1. LEFT ZONE: All Primary Navigation Links (Home + Categories + Contact) + Mobile Hamburger */}
          <div className="flex items-center justify-start min-w-0">
            {/* Desktop Navigation Links (md screens 768px+) */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive = activeNavId === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link)}
                    className={`relative px-1.5 md:px-1.5 lg:px-2.5 xl:px-3 py-1 lg:py-1.5 text-[8.5px] md:text-[9px] lg:text-[10px] xl:text-[11px] font-sans font-semibold tracking-[0.04em] lg:tracking-[0.07em] xl:tracking-[0.09em] uppercase transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'
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
                    <span className="relative z-10">
                      {link.id === 'luxurious-combo' ? (
                        <>
                          <span className="inline xl:hidden">Combos</span>
                          <span className="hidden xl:inline">{link.label}</span>
                        </>
                      ) : (
                        link.label
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile / Small Tablet Hamburger Toggle Button (< 768px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#111111] hover:bg-black/5 transition-colors cursor-pointer shrink-0 flex items-center justify-center border border-black/10"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* 2. SHIFTED-RIGHT LOGO ZONE: Shifted to the right of Contact */}
          <div className="flex items-center justify-center px-2 sm:px-3 lg:px-4 shrink-0">
            <button
              onClick={() => handleNavClick({ id: 'home' })}
              className="flex items-center justify-center cursor-pointer group select-none transition-transform duration-300 hover:scale-105 active:scale-95 bg-transparent border-0 p-0"
              title="Maison Lune Home"
              aria-label="Lune Fragrance Home"
            >
              <img
                src={logoImg}
                alt="LUNE Fragrance Logo"
                className="h-7 sm:h-7.5 md:h-8 lg:h-9.5 xl:h-10 w-auto object-contain"
              />
            </button>
          </div>

          {/* 3. RIGHT ZONE: Account & Shopping Bag */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
            {!isLoggedIn ? (
              <button
                onClick={onOpenAccount}
                className="hidden md:flex items-center gap-1.5 px-2 md:px-2.5 lg:px-3.5 py-1 lg:py-1.5 rounded-full border border-black/12 bg-white/70 hover:bg-[#111111] text-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300 cursor-pointer text-[9px] md:text-[9.5px] lg:text-[11px] font-sans font-bold tracking-[0.1em] uppercase active:scale-95 shadow-2xs group whitespace-nowrap"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#C08A3E] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={onOpenAccount}
                className="hidden md:flex items-center gap-1.5 lg:gap-2 text-[9px] md:text-[9.5px] lg:text-[11px] xl:text-[11.5px] font-sans font-medium tracking-[0.1em] uppercase text-[#1A1A1A] hover:text-[#C08A3E] transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                <div className="w-4.5 h-4.5 lg:w-5 lg:h-5 rounded-full bg-[#111111] text-white text-[9px] lg:text-[9.5px] font-serif font-black flex items-center justify-center shadow-xs" style={{ width: 20, height: 20 }}>
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'L'}
                </div>
                <span>Account</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-3.5 py-1 lg:py-1.5 rounded-full bg-[#111111] hover:bg-black/80 text-white transition-all duration-300 cursor-pointer shadow-xs group active:scale-95 shrink-0"
              aria-label="View Shopping Bag"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F3E5AB] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-[10px] sm:text-[11px] lg:text-xs font-sans font-bold tracking-widest">{cartCount}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ── 2. MOBILE & TABLET NAVIGATION DRAWER ─────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="pointer-events-auto fixed inset-0 z-50 overflow-hidden md:hidden">
            {/* Full-Screen Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Right-Side Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-[82vw] max-w-[340px] sm:w-[360px] h-full bg-white border-l border-black/10 shadow-[-20px_0_60px_rgba(0,0,0,0.25)] flex flex-col justify-between p-5 sm:p-7 will-change-transform z-10"
            >
              {/* Drawer Header */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-black/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={logoImg}
                      alt="LUNE Logo"
                      className="h-6 w-auto object-contain"
                    />
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-[#1A1A1A] hover:bg-black/5 hover:rotate-90 transition-all duration-300 cursor-pointer border border-black/10"
                    aria-label="Close Navigation"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1.5 pt-1">
                  {NAV_LINKS.map((link, idx) => {
                    const isActive = activeNavId === link.id;
                    const numStr = `0${idx + 1}`;
                    return (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + idx * 0.04, duration: 0.25, ease: 'easeOut' }}
                        onClick={() => handleNavClick(link)}
                        className={`group relative text-left px-3.5 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-[#1A1A1A] text-white shadow-md'
                            : 'text-[#1A1A1A] hover:bg-black/5 hover:translate-x-1.5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`font-sans text-[9px] font-bold tracking-widest ${
                              isActive ? 'text-[#C08A3E]' : 'text-[#8A8A8A] group-hover:text-[#C08A3E]'
                            }`}
                          >
                            {numStr}
                          </span>
                          <span className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase">
                            {link.label}
                          </span>
                        </div>

                        {isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C08A3E] animate-pulse" />
                        ) : (
                          <svg
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#C08A3E]"
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

              {/* Bottom Action Footer */}
              <div className="flex flex-col gap-3 pt-4 border-t border-black/10">
                {/* Orders & Wishlist */}
                <div className="flex flex-col gap-1">
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.25, ease: 'easeOut' }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAccount) onOpenAccount('orders');
                    }}
                    className="group relative text-left px-3.5 py-2 rounded-xl transition-colors duration-200 flex items-center justify-between cursor-pointer text-[#1A1A1A] hover:bg-black/5 hover:translate-x-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-sans text-[9px] font-bold tracking-widest text-[#8A8A8A] group-hover:text-[#C08A3E]">
                        06
                      </span>
                      <span className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase">
                        Orders
                      </span>
                    </div>
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#C08A3E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.24, duration: 0.25, ease: 'easeOut' }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAccount) onOpenAccount('saved');
                    }}
                    className="group relative text-left px-3.5 py-2 rounded-xl transition-colors duration-200 flex items-center justify-between cursor-pointer text-[#1A1A1A] hover:bg-black/5 hover:translate-x-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-sans text-[9px] font-bold tracking-widest text-[#8A8A8A] group-hover:text-[#C08A3E]">
                        07
                      </span>
                      <span className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase">
                        Wishlist
                      </span>
                    </div>
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#C08A3E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>

                {/* Account & Bag Buttons */}
                <div className="flex items-center justify-between gap-2.5 pt-1 border-t border-black/5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAccount) onOpenAccount('profile');
                    }}
                    className="flex-1 py-2.5 text-[10px] font-sans font-bold tracking-widest uppercase bg-black/5 hover:bg-black hover:text-white text-[#1A1A1A] rounded-xl border border-black/10 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <svg className="w-3 h-3 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{isLoggedIn ? 'Account' : 'Sign In'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenCart) onOpenCart();
                    }}
                    className="flex-1 py-2.5 text-[10px] font-sans font-bold tracking-widest uppercase bg-gradient-to-r from-[#1A1A1A] via-[#2A241D] to-[#1A1A1A] hover:from-[#C08A3E] hover:to-[#966624] text-white rounded-xl border border-[#C08A3E]/40 shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <svg className="w-3 h-3 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>Bag ({cartCount})</span>
                  </button>
                </div>

                <p className="font-serif text-[9px] tracking-[0.25em] uppercase text-center text-[#8A8A8A] pt-1">
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
