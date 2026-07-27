import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BOUTIQUE_PRODUCTS } from '../data/boutiqueProducts';
import CartDrawer from './CartDrawer';
import Footer from './Footer';

import luminousHeroBg from '../assets/lune_luminous_hero_bg.png';
import mobileHeroBg from '../assets/lune_hero_mobile.png';

export default function Collectionproducts({
  cartItems: parentCartItems,
  setCartItems: parentSetCartItems,
  isCartOpen: parentIsCartOpen,
  setIsCartOpen: parentSetIsCartOpen,
}) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // Fallbacks if props aren't provided directly
  const [localCartItems, setLocalCartItems] = useState([]);
  const [localIsCartOpen, setLocalIsCartOpen] = useState(false);

  const cartItems = parentCartItems !== undefined ? parentCartItems : localCartItems;
  const setCartItems = parentSetCartItems || setLocalCartItems;
  const isCartOpen = parentIsCartOpen !== undefined ? parentIsCartOpen : localIsCartOpen;
  const setIsCartOpen = parentSetIsCartOpen || setLocalIsCartOpen;

  const categories = [
    { id: 'ALL', label: 'ALL CREATIONS', sub: 'Tous les produits' },
    { id: 'PERFUME', label: 'PERFUME', sub: 'Extraits & Eau de Parfum' },
    { id: 'BODY_ROLLON', label: 'BODY ROLL-ON', sub: 'Huiles & Élixirs' },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...BOUTIQUE_PRODUCTS];

    if (activeCategory === 'PERFUME') {
      result = result.filter((p) => p.category === 'EXTRAIT' || p.category === 'EAU DE PARFUM');
    } else if (activeCategory === 'BODY_ROLLON') {
      result = result.filter((p) => p.category === 'BODY & RITUALS');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          Object.values(p.notes || {}).some((n) => n.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-14 sm:pt-24 md:pt-28 pb-12 overflow-x-hidden selection:bg-[#111111] selection:text-white">
      {/* ── 1. DEDICATED RESPONSIVE HERO BANNER (MOBILE PORTRAIT vs DESKTOP 10:3) ── */}
      <section className="relative w-full overflow-hidden bg-[#0F2230] text-white min-h-[310px] sm:min-h-[380px] lg:min-h-[440px] sm:aspect-[16/9] lg:aspect-[10/3] flex items-center border-b border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
        {/* Dedicated Mobile Image (< sm screens) */}
        <img
          src={mobileHeroBg}
          alt="Maison Lune Mobile Editorial Backdrop"
          className="absolute inset-0 w-full h-full object-cover object-center block sm:hidden pointer-events-none"
        />

        {/* Dedicated Desktop/iPad Image (sm: and larger screens) */}
        <img
          src={luminousHeroBg}
          alt="Maison Lune Radiant Editorial Backdrop"
          className="absolute inset-0 w-full h-full object-cover object-center hidden sm:block pointer-events-none"
        />

        {/* Soft Contrast Gradient Layer (Ensures Text Legibility) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-transparent sm:bg-gradient-to-r sm:from-black/75 sm:via-black/35 sm:to-transparent pointer-events-none" />

        {/* Max-Width Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-14 md:py-16 relative z-10">
          <div className="w-full md:w-8/12 lg:w-6/12">
            {/* Main Headline */}
            <h1 className="font-serif font-light text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-3 sm:mb-5 drop-shadow-md">
              Lune Bestsellers & <br className="hidden sm:block" />
              <span className="font-serif font-normal italic text-[#F3E0A7]">Fan Favorites</span>
            </h1>

            {/* Sub-headline / Copy */}
            <p className="font-sans text-[11px] sm:text-sm md:text-base text-white/90 font-light leading-relaxed max-w-xl drop-shadow-sm">
              Thousands of five-star reviews. From hand-crafted Iris Pallida extraits to luminous Eau de Parfums and satin body elixirs—these are the "holy grail" formulas our community buys on repeat.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Refined Toolbar & Navigation Bar (On White Background) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-black/10 pb-4 gap-4">
          {/* Category Tabs with Animated Dark Underline */}
          <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative pb-2 text-[10px] sm:text-[11px] md:text-xs font-sans font-bold tracking-[0.2em] uppercase transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-[#111111]' : 'text-[#737373] hover:text-[#111111]'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <motion.span
                      layoutId="collectionTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box & Sort Selector */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56 lg:w-64">
              <input
                type="text"
                placeholder="SEARCH CREATIONS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-[#F9F9FB] border border-black/15 text-[10px] sm:text-xs font-sans text-[#111111] tracking-wider uppercase focus:outline-none focus:border-black transition-all placeholder:text-[#999999]"
              />
              <svg className="w-3.5 h-3.5 text-[#737373] absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-[#737373] hover:text-[#111111]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 bg-[#F9F9FB] border border-black/15 text-[10px] sm:text-xs font-sans font-bold tracking-widest text-[#111111] uppercase focus:outline-none cursor-pointer shrink-0"
            >
              <option value="recommended">RECOMMENDED</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="rating">HIGHEST RATED</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── 3. Main Studio Products Grid (4 Columns) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
        {filteredProducts.length === 0 ? (
          <div className="w-full py-16 text-center bg-[#F4F4F6] border border-black/10">
            <p className="font-serif text-lg text-[#555555] uppercase">No Creations Found</p>
            <p className="font-sans text-xs text-[#777777] mt-1">Try resetting your search query or category filters.</p>
            <button
              onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); }}
              className="mt-4 px-6 py-2.5 bg-[#111111] text-white text-[10px] font-sans font-extrabold tracking-[0.2em] uppercase hover:bg-black transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 md:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex flex-col bg-[#F4F4F6] border border-black/5 rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group cursor-pointer"
              >
                {/* Top Badge */}
                <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10">
                  <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-black/85 backdrop-blur-md text-[7px] xs:text-[8px] sm:text-[9.5px] font-sans tracking-[0.15em] sm:tracking-[0.18em] text-white uppercase rounded-none font-bold">
                    {product.badge}
                  </span>
                </div>

                {/* Studio Product Image Viewport — Full Edge-to-Edge with Hover Sub-Image */}
                <div className="w-full h-44 xs:h-52 sm:h-64 md:h-72 bg-[#F5F5F7] relative overflow-hidden border-b border-black/5">
                  {/* Primary Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                  />

                  {/* Hover Sub-Image (Secondary Gallery View) */}
                  <img
                    src={product.galleryImages?.[1] || product.galleryImages?.[0] || product.image}
                    alt={`${product.name} alternate view`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>

                {/* Bottom Content Area */}
                <div className="p-2.5 xs:p-3 sm:p-5 flex flex-col justify-between flex-1 bg-[#F4F4F6] gap-2 sm:gap-3">
                  <div>
                    <p className="font-sans text-[8px] xs:text-[8.5px] sm:text-[10px] text-[#555555] font-bold tracking-wider uppercase mb-0.5 sm:mb-1 line-clamp-1">
                      {product.subtitle}
                    </p>
                    <h3 className="font-sans font-extrabold text-[11px] xs:text-xs sm:text-sm md:text-base text-[#111111] uppercase tracking-wide leading-tight sm:leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Full Width SHOP CTA Button */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-black/10 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-extrabold text-xs sm:text-sm md:text-base text-[#111111]">
                        {product.priceFormatted}
                      </span>
                      <span className="text-[8.5px] sm:text-[10px] font-sans font-semibold tracking-widest text-[#555555] uppercase">
                        {product.sizes ? product.sizes[0].size : '100ML'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="w-full py-2 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs font-sans font-extrabold tracking-[0.2em] uppercase text-white bg-[#111111] hover:bg-black transition-all duration-200 shadow-sm cursor-pointer active:scale-[0.98] text-center"
                    >
                      EXPLORE CREATION
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Bespoke Guarantee Banner ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 mt-4">
        <div className="w-full pt-4 sm:pt-6 border-t border-black/10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left text-[10px] sm:text-[11px] font-sans tracking-widest text-[#737373] uppercase">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <svg className="w-4 h-4 text-[#C08A3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>EXPRESS DELIVERY & RETURNS</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <svg className="w-4 h-4 text-[#C08A3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>SIGNATURE LUNE GIFT BOX</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <svg className="w-4 h-4 text-[#C08A3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>COMPLIMENTARY FLACON ENGRAVING</span>
          </div>
        </div>
      </section>

      {/* ── 5. Luxury Footer ── */}
      <Footer onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setCartItems([])}
      />
    </div>
  );
}
