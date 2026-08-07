import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import Footer from './Footer';


import luminousHeroBg from '../assets/lune_luminous_hero_bg.png';
import mobileHeroBg from '../assets/lune_hero_mobile.png';

// ──────────────────────────────────────────────────────────────────────────────
// Custom Luxury Sort Dropdown Component
// ──────────────────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'recommended', label: 'RECOMMENDED' },
  { value: 'price-low', label: 'PRICE: LOW TO HIGH' },
  { value: 'price-high', label: 'PRICE: HIGH TO LOW' },
  { value: 'rating', label: 'HIGHEST RATED' },
];

function CustomSortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative shrink-0 select-none">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-[#F9F9FB] hover:bg-white border border-black/15 hover:border-black/40 text-[10px] sm:text-xs font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase flex items-center justify-between gap-3 min-w-[160px] sm:min-w-[190px] transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
      >
        <span className="truncate">{selectedOption.label}</span>
        <svg
          className={`w-3.5 h-3.5 text-[#555555] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#111111]' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Menu Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1.5 w-full min-w-[200px] bg-white border border-black/15 shadow-xl z-50 overflow-hidden py-1"
          >
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[10px] sm:text-xs font-sans font-extrabold tracking-[0.15em] uppercase flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'text-[#333333] hover:bg-[#F4F4F6] hover:text-[#111111]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-[#C08A3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Collectionproducts({
  cartItems: parentCartItems,
  setCartItems: parentSetCartItems,
  isCartOpen: parentIsCartOpen,
  setIsCartOpen: parentSetIsCartOpen,
}) {
  const navigate = useNavigate();
  const { cartItems: contextCartItems, setCartItems: contextSetCartItems, isCartOpen: contextIsCartOpen, setIsCartOpen: contextSetIsCartOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [productsList, setProductsList] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartItems = parentCartItems !== undefined ? parentCartItems : contextCartItems;
  const setCartItems = parentSetCartItems || contextSetCartItems;
  const isCartOpen = parentIsCartOpen !== undefined ? parentIsCartOpen : contextIsCartOpen;
  const setIsCartOpen = parentSetIsCartOpen || contextSetIsCartOpen;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([fetchProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        if (isMounted) {
          if (Array.isArray(prods)) {
            setProductsList(prods);
          }
          if (Array.isArray(cats)) {
            setDbCategories(cats);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching collection products:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  // Category items count map
  const categoryCounts = useMemo(() => {
    const counts = {};
    const activeProds = productsList.filter(p => p.inStock !== false && p.in_stock !== false);
    counts['ALL'] = activeProds.length;
    activeProds.forEach(p => {
      if (p.category) {
        const catKey = p.category.toUpperCase();
        counts[catKey] = (counts[catKey] || 0) + 1;
      }
    });
    return counts;
  }, [productsList]);

  // Dynamic Categories Tabs from Database
  const categoriesTabs = useMemo(() => {
    const defaultTabs = [
      { id: 'ALL', label: 'ALL CREATIONS', count: categoryCounts['ALL'] || 0 }
    ];
    const fetchedTabs = dbCategories.map(c => {
      const count = categoryCounts[c.name.toUpperCase()] || 0;
      return {
        id: c.name,
        label: c.name,
        count
      };
    });
    return [...defaultTabs, ...fetchedTabs];
  }, [dbCategories, categoryCounts]);

  // Dynamic Filtering & Sorting based on live database records
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Filter only ACTIVE in-stock items for consumer boutique
    result = result.filter(p => p.inStock !== false && p.in_stock !== false);

    if (activeCategory !== 'ALL') {
      result = result.filter(
        p => p.category?.toUpperCase() === activeCategory.toUpperCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name?.toLowerCase().includes(q) ||
          p.frenchName?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          Object.values(p.notes || {}).some(n => String(n).toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating || 5) - parseFloat(a.rating || 5));
    }

    return result;
  }, [productsList, activeCategory, searchQuery, sortBy]);

  const tabsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categoriesTabs]);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-0 sm:pt-24 md:pt-28 pb-12 overflow-x-hidden selection:bg-[#111111] selection:text-white">
      {/* ── 1. DEDICATED RESPONSIVE HERO BANNER ── */}
      <section className="relative w-full overflow-hidden bg-[#0F2230] text-white min-h-[310px] sm:min-h-[380px] lg:min-h-[440px] sm:aspect-[16/9] lg:aspect-[10/3] flex items-center border-b border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
        {/* Background Images */}
        <picture className="absolute inset-0 w-full h-full">
          <source media="(max-width: 639px)" srcSet={mobileHeroBg} />
          <img
            src={luminousHeroBg}
            alt="Lune Haute Parfumerie Collection"
            className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
          />
        </picture>

        {/* Dark Luxury Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2230]/95 via-[#0F2230]/65 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-12 lg:px-16 py-8">
          <div className="max-w-xl space-y-3">
            <span className="text-[9px] sm:text-[10px] md:text-xs font-sans font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block">
              MAISON HAUTE PARFUMERIE
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.05]">
              LA COLLECTION
            </h1>
            <p className="font-sans text-xs sm:text-sm text-gray-200 font-light leading-relaxed tracking-wide max-w-md">
              Discover ethereal fragrance extraits, botanical body oils, and hand-blended perfume elixirs.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Dynamic Category Navigation Bar (Scrollable for Infinite Future Categories) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-black/10 pb-4 gap-4 sm:gap-6">
          
          {/* Category Tabs Wrapper with Left/Right Overflow Scroll Controls */}
          <div className="relative flex-1 min-w-0 flex items-center">
            {/* Scroll Left Button */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                className="absolute left-0 z-20 p-1.5 bg-white/95 backdrop-blur-sm border border-black/15 shadow-md text-[#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer rounded-full -translate-x-2"
                aria-label="Scroll categories left"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Dynamic Category Tabs Container */}
            <div
              ref={tabsContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0 scroll-smooth w-full select-none"
            >
              {categoriesTabs.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={(e) => {
                      setActiveCategory(cat.id);
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }}
                    className={`relative pb-3 text-[10.5px] sm:text-xs font-sans font-extrabold tracking-[0.22em] uppercase transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 ${
                      isActive ? 'text-[#111111]' : 'text-[#777777] hover:text-[#111111]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {cat.count > 0 && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                        isActive ? 'bg-[#111111] text-white' : 'bg-[#EAEAEA] text-[#666666]'
                      }`}>
                        {cat.count}
                      </span>
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="collectionTabLine"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111111]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollTabs('right')}
                className="absolute right-0 z-20 p-1.5 bg-white/95 backdrop-blur-sm border border-black/15 shadow-md text-[#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer rounded-full translate-x-2"
                aria-label="Scroll categories right"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Box & Custom Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            {/* Luxury Search Input */}
            <div className="relative flex-1 md:w-56 lg:w-64">
              <input
                type="text"
                placeholder="SEARCH CREATIONS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2.5 bg-[#F9F9FB] border border-black/15 text-[10px] sm:text-xs font-sans text-[#111111] tracking-wider uppercase focus:outline-none focus:border-black transition-all placeholder:text-[#999999] shadow-2xs"
              />
              <svg className="w-3.5 h-3.5 text-[#737373] absolute left-2.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-[#737373] hover:text-[#111111]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Custom Luxury Sort Select Dropdown */}
            <CustomSortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </section>

      {/* ── 3. Main Studio Products Grid (Live Data from Supabase) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
        {loading ? (
          <div className="py-24 text-center text-sm font-sans text-[#555555]">
            Loading Maison Lune live collection...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="w-full py-16 text-center bg-[#F4F4F6] border border-black/10">
            <p className="font-serif text-lg text-[#555555] uppercase">No Creations Found</p>
            <p className="font-sans text-xs text-[#777777] mt-1">Try resetting your search query or category filters.</p>
            <button
              onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); }}
              className="mt-4 px-6 py-2.5 bg-[#111111] text-white text-[10px] font-sans font-extrabold tracking-[0.2em] uppercase hover:bg-black transition-colors cursor-pointer"
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
                className="group cursor-pointer bg-[#F4F4F6] border border-black/10 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg rounded-none"
              >
                <div>
                  {/* Image Container — 100% Full Edge-to-Edge Image with Sub-Image Hover */}
                  <div className="relative w-full aspect-square bg-[#F5F5F7] overflow-hidden rounded-none border-b border-black/5">
                    {/* Primary Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />

                    {/* Secondary Hover Sub-Image */}
                    <img
                      src={product.galleryImages?.[1] || product.galleryImages?.[0] || product.image}
                      alt={`${product.name} alternate view`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-[#111111]/85 backdrop-blur-md text-white text-[8px] font-sans font-extrabold tracking-wider uppercase rounded-none shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle Info */}
                  <div className="p-3 sm:p-4 pb-0">
                    <span className="text-[9px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase block mb-0.5">
                      {product.category}
                    </span>
                    <h3 className="font-serif font-black text-sm sm:text-base text-[#111111] tracking-tight uppercase line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[11px] font-sans text-gray-500 font-medium line-clamp-1">
                      {product.frenchName || product.subtitle || 'Extrait de Parfum'}
                    </p>
                  </div>
                </div>

                {/* Price & Action Footer */}
                <div className="p-3 sm:p-4 pt-3 border-t border-black/10 flex items-center justify-between mt-2">
                  <span className="font-serif font-black text-sm text-[#111111]">
                    $ {product.price}
                  </span>
                  <span className="text-[9px] font-sans font-extrabold tracking-widest uppercase text-gray-900 group-hover:text-[#C08A3E] transition-colors">
                    DISCOVER &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Global Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setCartItems([])}
      />

      <Footer />
    </div>
  );
}
