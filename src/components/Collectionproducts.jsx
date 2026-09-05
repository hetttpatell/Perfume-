import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchCategories, getCachedProducts } from '../services/api';
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

// ──────────────────────────────────────────────────────────────────────────────
// Collapsible Filter Section Component
// ──────────────────────────────────────────────────────────────────────────────
function FilterSection({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-0 text-left cursor-pointer group"
      >
        <span className="font-serif font-bold text-[13px] tracking-wide text-[#111111] uppercase">
          {title}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-[#888888] group-hover:text-[#111111] transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Mobile Filter Drawer Toggle
// ──────────────────────────────────────────────────────────────────────────────
function MobileFilterButton({ isOpen, onClick, activeFiltersCount }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-3 bg-[#111111] text-white text-[11px] font-sans font-extrabold tracking-[0.2em] uppercase shadow-2xl hover:bg-black transition-all cursor-pointer rounded-full"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span>{isOpen ? 'CLOSE FILTERS' : 'FILTERS'}</span>
      {activeFiltersCount > 0 && (
        <span className="w-5 h-5 flex items-center justify-center bg-[#C08A3E] text-white text-[9px] font-bold rounded-full">
          {activeFiltersCount}
        </span>
      )}
    </button>
  );
}

export default function Collectionproducts({
  cartItems: parentCartItems,
  setCartItems: parentSetCartItems,
  isCartOpen: parentIsCartOpen,
  setIsCartOpen: parentSetIsCartOpen,
}) {
  const navigate = useNavigate();
  const { cartItems: contextCartItems, setCartItems: contextSetCartItems, isCartOpen: contextIsCartOpen, setIsCartOpen: contextSetIsCartOpen, addItemToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [productsList, setProductsList] = useState(() => getCachedProducts());
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(() => getCachedProducts().length === 0);

  // Price range filter state
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [appliedPriceMin, setAppliedPriceMin] = useState('');
  const [appliedPriceMax, setAppliedPriceMax] = useState('');

  // Add to bag confirmation state
  const [addedProductId, setAddedProductId] = useState(null);

  // Mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const cartItems = parentCartItems !== undefined ? parentCartItems : contextCartItems;
  const setCartItems = parentSetCartItems || contextSetCartItems;
  const isCartOpen = parentIsCartOpen !== undefined ? parentIsCartOpen : contextIsCartOpen;
  const setIsCartOpen = parentSetIsCartOpen || contextSetIsCartOpen;

  useEffect(() => {
    let isMounted = true;
    if (productsList.length === 0) {
      setLoading(true);
    }

    Promise.all([fetchProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        if (isMounted) {
          if (Array.isArray(prods) && prods.length > 0) {
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

  // Dynamic Categories from Database
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

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'ALL') count++;
    if (appliedPriceMin || appliedPriceMax) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [activeCategory, appliedPriceMin, appliedPriceMax, searchQuery]);

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

    // Price range filter
    if (appliedPriceMin) {
      result = result.filter(p => Number(p.price) >= Number(appliedPriceMin));
    }
    if (appliedPriceMax) {
      result = result.filter(p => Number(p.price) <= Number(appliedPriceMax));
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating || 5) - parseFloat(a.rating || 5));
    }

    return result;
  }, [productsList, activeCategory, searchQuery, sortBy, appliedPriceMin, appliedPriceMax]);

  const handleApplyPrice = () => {
    setAppliedPriceMin(priceMin);
    setAppliedPriceMax(priceMax);
  };

  const handleClearAllFilters = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setSortBy('recommended');
    setPriceMin('');
    setPriceMax('');
    setAppliedPriceMin('');
    setAppliedPriceMax('');
  };

  const handleAddToBag = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    const defaultSize = product.sizes?.[0] || { size: 'Full Size', price: product.price };
    addItemToCart(product, defaultSize, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1600);
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

  // ────────────────────────────────────────────────────────────────────────────
  // SIDEBAR FILTER PANEL CONTENT (shared between desktop & mobile)
  // ────────────────────────────────────────────────────────────────────────────
  const FilterPanelContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="mb-2">
        <h2 className="font-serif font-black text-[22px] tracking-tight text-[#111111] uppercase leading-tight">
          LA COLLECTION
        </h2>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-sans font-medium text-[#999999] tracking-wider uppercase">
            Refine by
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAllFilters}
              className="text-[10px] font-sans font-bold text-[#C08A3E] hover:text-[#111111] tracking-wider uppercase transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Active filters tags */}
        {activeFiltersCount > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {activeCategory !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F4F6] text-[9px] font-sans font-bold text-[#333333] tracking-wider uppercase">
                {activeCategory}
                <button onClick={() => setActiveCategory('ALL')} className="ml-0.5 text-[#999999] hover:text-[#111111] cursor-pointer">✕</button>
              </span>
            )}
            {(appliedPriceMin || appliedPriceMax) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F4F6] text-[9px] font-sans font-bold text-[#333333] tracking-wider uppercase">
                ₹{appliedPriceMin || '0'} – ₹{appliedPriceMax || '∞'}
                <button onClick={() => { setPriceMin(''); setPriceMax(''); setAppliedPriceMin(''); setAppliedPriceMax(''); }} className="ml-0.5 text-[#999999] hover:text-[#111111] cursor-pointer">✕</button>
              </span>
            )}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F4F6] text-[9px] font-sans font-bold text-[#333333] tracking-wider uppercase">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-0.5 text-[#999999] hover:text-[#111111] cursor-pointer">✕</button>
              </span>
            )}
          </div>
        ) : (
          <p className="mt-2 text-[10px] font-sans text-[#BBBBBB] tracking-wide">
            No filters applied
          </p>
        )}
      </div>

      {/* ── Search ── */}
      <FilterSection title="Search" defaultOpen={true}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search creations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2.5 bg-[#FAFAFA] border border-black/10 text-[11px] font-sans text-[#111111] tracking-wide focus:outline-none focus:border-black/30 transition-all placeholder:text-[#AAAAAA]"
          />
          <svg className="w-3.5 h-3.5 text-[#AAAAAA] absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#999999] hover:text-[#111111] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </FilterSection>

      {/* ── Category ── */}
      <FilterSection title="Category" defaultOpen={true}>
        <div className="flex flex-col gap-0.5">
          {categoriesTabs.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setIsMobileFilterOpen(false);
                }}
                className={`group flex items-center justify-between px-2.5 py-2 text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'text-[#444444] hover:bg-[#F6F6F8] hover:text-[#111111]'
                }`}
              >
                <span className="text-[11px] font-sans font-semibold tracking-wide uppercase">
                  {cat.label}
                </span>
                {cat.count > 0 && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                    isActive ? 'bg-white/20 text-white/80' : 'bg-[#EAEAEA] text-[#888888]'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Price Range ── */}
      <FilterSection title="Price" defaultOpen={true}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Min."
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAFAFA] border border-black/10 text-[11px] font-sans text-[#111111] focus:outline-none focus:border-black/30 transition-all placeholder:text-[#BBBBBB]"
            />
          </div>
          <span className="text-[#CCCCCC] text-xs font-light">–</span>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Max."
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAFAFA] border border-black/10 text-[11px] font-sans text-[#111111] focus:outline-none focus:border-black/30 transition-all placeholder:text-[#BBBBBB]"
            />
          </div>
        </div>
        <button
          onClick={handleApplyPrice}
          className="mt-3 w-full py-2.5 bg-[#111111] text-white text-[10px] font-sans font-extrabold tracking-[0.2em] uppercase hover:bg-black transition-colors cursor-pointer"
        >
          UPDATE
        </button>
      </FilterSection>

      {/* ── Sort By ── */}
      <FilterSection title="Sort By" defaultOpen={false}>
        <div className="flex flex-col gap-0.5">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = opt.value === sortBy;
            return (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`flex items-center justify-between px-2.5 py-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-white'
                    : 'text-[#444444] hover:bg-[#F6F6F8] hover:text-[#111111]'
                }`}
              >
                <span className="text-[11px] font-sans font-semibold tracking-wide uppercase">
                  {opt.label}
                </span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-[#C08A3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-0 sm:pt-24 md:pt-28 pb-0 overflow-x-hidden selection:bg-[#111111] selection:text-white">
      {/* ── 1. DEDICATED RESPONSIVE HERO BANNER ── */}
      <section className="relative w-full overflow-hidden bg-[#0F2230] text-white min-h-[310px] sm:min-h-[380px] lg:min-h-[440px] sm:aspect-[16/9] lg:aspect-[10/3] flex items-center border-b border-black/10">
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

      {/* ── 2. SIDEBAR + PRODUCTS LAYOUT ── */}
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="flex relative">

          {/* ── LEFT SIDEBAR (Desktop — fixed position, non-scrollable) ── */}
          <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 sticky top-28 self-start h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden border-r border-black/8 bg-white">
            <div className="px-6 xl:px-7 py-7">
              <FilterPanelContent />
            </div>
          </aside>

          {/* ── MOBILE FILTER DRAWER OVERLAY ── */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={() => setIsMobileFilterOpen(false)}
                />
                {/* Drawer */}
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="fixed left-0 top-0 h-full w-[300px] max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
                >
                  <div className="px-6 py-6">
                    {/* Close button */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-sans font-extrabold tracking-[0.25em] uppercase text-[#999999]">
                        FILTERS
                      </span>
                      <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="w-8 h-8 flex items-center justify-center text-[#777777] hover:text-[#111111] hover:bg-[#F4F4F6] transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <FilterPanelContent />
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ── RIGHT CONTENT AREA (scrollable products grid) ── */}
          <main className="flex-1 min-w-0">
            {/* Top bar with result count and sort (small inline sort for desktop) */}
            <div className="flex items-center justify-between px-5 sm:px-6 lg:px-8 py-4 border-b border-black/6 bg-[#FCFCFD]">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-black/12 text-[10px] font-sans font-extrabold tracking-[0.15em] uppercase text-[#333333] hover:bg-[#F4F4F6] transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  FILTERS
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 flex items-center justify-center bg-[#111111] text-white text-[8px] font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <span className="text-[11px] font-sans text-[#999999] tracking-wide">
                  <span className="font-bold text-[#555555]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
              </div>
            </div>

            {/* ── 3. Main Studio Products Grid ── */}
            <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {loading ? (
                <div className="py-24 text-center text-sm font-sans text-[#555555]">
                  Loading Maison Lune live collection...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="w-full py-16 text-center bg-[#F4F4F6] border border-black/10">
                  <p className="font-serif text-lg text-[#555555] uppercase">No Creations Found</p>
                  <p className="font-sans text-xs text-[#777777] mt-1">Try resetting your search query or category filters.</p>
                  <button
                    onClick={handleClearAllFilters}
                    className="mt-4 px-6 py-2.5 bg-[#111111] text-white text-[10px] font-sans font-extrabold tracking-[0.2em] uppercase hover:bg-black transition-colors cursor-pointer"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-5 md:gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group cursor-pointer bg-[#F4F4F6] border border-black/10 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg rounded-none"
                    >
                    <div>
                      {/* Image Container */}
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

                    {/* Price & Add to Bag Footer */}
                    <div className="p-3 sm:p-4 pt-3 border-t border-black/10 flex items-center justify-between mt-2 gap-2">
                      <span className="font-serif font-black text-sm text-[#111111] shrink-0">
                        $ {product.price}
                      </span>
                      <button
                        onClick={(e) => handleAddToBag(e, product)}
                        className={`relative flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-sans font-extrabold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer overflow-hidden ${
                          addedProductId === product.id
                            ? 'bg-[#1a7a3a] text-white'
                            : 'bg-[#111111] text-white hover:bg-[#C08A3E]'
                        }`}
                      >
                        {addedProductId === product.id ? (
                          <>
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                              />
                            </svg>
                            <span className="hidden sm:inline">ADDED</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="hidden sm:inline">ADD TO BAG</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </section>

            {/* Footer inside scrollable area */}
            <Footer />
          </main>
        </div>
      </div>

      {/* Global Shopping Cart Drawer */}
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
