import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, fetchCategories } from '../services/api';
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
  const [productsList, setProductsList] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallbacks if props aren't provided directly
  const [localCartItems, setLocalCartItems] = useState([]);
  const [localIsCartOpen, setLocalIsCartOpen] = useState(false);

  const cartItems = parentCartItems !== undefined ? parentCartItems : localCartItems;
  const setCartItems = parentSetCartItems || setLocalCartItems;
  const isCartOpen = parentIsCartOpen !== undefined ? parentIsCartOpen : localIsCartOpen;
  const setIsCartOpen = parentSetIsCartOpen || setLocalIsCartOpen;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([fetchProducts(), fetchCategories()]).then(([prods, cats]) => {
      if (isMounted) {
        if (prods && prods.length > 0) {
          setProductsList(prods);
        }
        if (cats && cats.length > 0) {
          setDbCategories(cats);
        }
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Dynamic Categories Tabs from Database
  const categoriesTabs = useMemo(() => {
    const defaultTabs = [{ id: 'ALL', label: 'ALL CREATIONS' }];
    const fetchedTabs = dbCategories.map(c => ({
      id: c.name,
      label: c.name
    }));
    return [...defaultTabs, ...fetchedTabs];
  }, [dbCategories]);

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

      {/* ── 2. Dynamic Category Navigation Bar ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-black/10 pb-4 gap-4">
          {/* Dynamic Category Tabs */}
          <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categoriesTabs.map((cat) => {
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
                className="group cursor-pointer bg-white border border-black/10 hover:border-black/30 rounded-2xl p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-[#F9F9FB] rounded-xl overflow-hidden mb-3 p-3 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain object-center transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#111111] text-white text-[8px] font-sans font-extrabold tracking-wider uppercase rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <span className="text-[9px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase block mb-0.5">
                    {product.category}
                  </span>
                  <h3 className="font-serif font-black text-sm sm:text-base text-[#111111] tracking-tight uppercase line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] font-sans text-gray-500 font-medium line-clamp-1 mb-2">
                    {product.frenchName || product.subtitle || 'Extrait de Parfum'}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-black/10 flex items-center justify-between mt-2">
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
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <Footer />
    </div>
  );
}
