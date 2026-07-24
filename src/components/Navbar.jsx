import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ cartCount = 0, onOpenCart, onOpenAccount }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Homepage', targetId: 'hero' },
    { id: 'about', label: 'About', targetId: 'about' },
    { id: 'products', label: 'Services/Products', targetId: 'products' },
    { id: 'contact', label: 'Contact', targetId: 'contact' },
    { id: 'gallery', label: 'Gallery/FAQ', targetId: 'gallery' },
  ];

  // Scroll listener for morphing pill & progress bar & active section observer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      // Total page scroll progress percentage
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);

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
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-300">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto transition-all duration-500 relative flex items-center justify-between ${
          isScrolled
            ? 'mt-3 sm:mt-4 w-[94%] sm:w-[90%] max-w-6xl px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-black/10 hover:border-[#C08A3E]/40'
            : 'w-full max-w-7xl px-5 sm:px-10 py-4 sm:py-6 bg-gradient-to-b from-white/90 via-white/40 to-transparent border-b border-transparent'
        }`}
      >
        {/* Scroll Progress Gold Line (Scrolled Pill Mode) */}
        {isScrolled && (
          <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-black/5 rounded-full overflow-hidden pointer-events-none">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C08A3E] via-[#F3E5AB] to-[#C08A3E]"
              style={{ width: `${scrollProgress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
        )}

        {/* LEFT SECTION: Section Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
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

        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-black/5 hover:bg-black/10 text-[#1A1A1A] transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* MIDDLE SECTION: Brand Logo & Title */}
        <div
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none px-2"
        >
          {/* PERFUME Brand Monogram Emblem */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A1A1A] text-[#C08A3E] flex items-center justify-center font-serif text-sm font-bold shadow-sm group-hover:scale-105 group-hover:bg-black transition-all duration-300 border border-[#C08A3E]/40">
            P
          </div>

          <div className="flex flex-col items-start leading-none">
            <span className="font-serif font-light text-base sm:text-lg md:text-xl tracking-[0.25em] uppercase text-[#1A1A1A] group-hover:text-[#C08A3E] transition-colors duration-300 font-medium">
              PERFUME
            </span>
            <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#737373] font-semibold -mt-0.5">
              HAUTE PARFUMERIE
            </span>
          </div>
        </div>

        {/* RIGHT SECTION: E-Commerce Functionality (Account & Cart Bag) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Account Button */}
          <button
            onClick={onOpenAccount}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.18em] uppercase text-[#1A1A1A] bg-black/5 hover:bg-black hover:text-white rounded-full border border-black/15 transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            aria-label="User Account"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden xs:inline">ACCOUNT</span>
          </button>

          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 relative"
            aria-label="Open Shopping Cart Bag"
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
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C08A3E] rounded-full animate-ping" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE / TABLET FULL MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto fixed inset-x-4 top-20 z-50 bg-white/95 backdrop-blur-2xl border border-black/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 lg:hidden max-w-md mx-auto"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="font-serif text-sm tracking-widest text-[#1A1A1A]">NAVIGATION</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-[#737373] hover:text-[#1A1A1A]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.targetId)}
                  className={`text-left px-4 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase rounded-xl transition-all ${
                    activeSection === link.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#1A1A1A] hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAccount) onOpenAccount();
                }}
                className="flex-1 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-black/5 text-[#1A1A1A] rounded-xl border border-black/10"
              >
                MY ACCOUNT
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCart) onOpenCart();
                }}
                className="flex-1 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1A1A] text-white rounded-xl"
              >
                BAG ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
