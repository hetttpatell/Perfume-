import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, fetchCategories, getCachedProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import OurStory from './OurStory';
import BrandLocationsMap from './BrandLocationsMap';
import Footer from './Footer';

export default function OlfactoryExperience({
  onScrollToTop,
  cartItems: parentCartItems,
  setCartItems: parentSetCartItems,
  isCartOpen: parentIsCartOpen,
  setIsCartOpen: parentSetIsCartOpen,
}) {
  const navigate = useNavigate();
  const { cartItems: contextCartItems, isCartOpen: contextIsCartOpen, setIsCartOpen: contextSetIsCartOpen, addItemToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [productsList, setProductsList] = useState(() => getCachedProducts());
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(() => getCachedProducts().length === 0);
  const [addedProductId, setAddedProductId] = useState(null);

  // Fetch live products and categories from database on mount
  useEffect(() => {
    let isMounted = true;
    if (productsList.length === 0) {
      setLoading(true);
    }

    Promise.all([fetchProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        if (isMounted) {
          if (Array.isArray(prods) && prods.length > 0) setProductsList(prods);
          if (Array.isArray(cats)) setDbCategories(cats);
        }
      })
      .catch((err) => {
        console.error('Error fetching olfactory experience data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const cartItems = (parentCartItems && parentCartItems.length > 0) ? parentCartItems : contextCartItems;
  const isCartOpen = parentIsCartOpen !== undefined ? parentIsCartOpen : contextIsCartOpen;
  const setIsCartOpen = parentSetIsCartOpen || contextSetIsCartOpen;


  // Dynamic category tabs from live database + a fixed "ALL" and "FEATURED" tab
  const categories = [
    { id: 'ALL', label: 'ALL CREATIONS' },
    { id: 'FEATURED', label: 'FEATURED' },
    ...dbCategories.map(c => ({ id: c.name, label: c.name })),
  ];

  const filteredProducts = (() => {
    // Only show active in-stock products
    const active = productsList.filter(p => p.inStock !== false && p.in_stock !== false);

    if (activeCategory === 'ALL') return active;
    if (activeCategory === 'FEATURED') return active.filter(p => p.isFeatured || p.is_featured);
    return active.filter(p => p.category?.toUpperCase() === activeCategory.toUpperCase());
  })();

  const getCategoryCount = (catId) => {
    const active = productsList.filter(p => p.inStock !== false && p.in_stock !== false);
    if (catId === 'ALL') return active.length;
    if (catId === 'FEATURED') return active.filter(p => p.isFeatured || p.is_featured).length;
    return active.filter(p => p.category?.toUpperCase() === catId.toUpperCase()).length;
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

  return (
    <section className="w-full min-h-screen bg-white text-[#111111] font-sans pt-28 sm:pt-36 lg:pt-40 pb-16 px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Category Header */}
      <div className="w-full max-w-7xl mx-auto mb-6 sm:mb-8">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#111111] uppercase tracking-tight mb-2">
          The Atelier Collection
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#555555] font-light max-w-xl">
          Explore our handcrafted Haute Parfumerie creations and nourishing satin body roll-ons.
        </p>
      </div>

      {/* Category Filter Navigation Bar — Dynamic Live Tabs */}
      <div className="w-full max-w-7xl mx-auto pt-2 pb-6 flex flex-wrap items-center justify-start gap-2.5 sm:gap-4 border-b border-black/10 mb-6">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-sans font-extrabold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 border ${isSelected
                ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                : 'bg-[#F4F4F6] text-[#555555] border-black/5 hover:border-black/20 hover:text-[#111111]'
                }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-black/10 text-[#555555]'
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Products Grid — Live Data from Supabase */}
      {loading ? (
        <div className="w-full max-w-7xl mx-auto py-24 text-center">
          <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-[#737373] font-bold">Loading Live Collection...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="w-full max-w-7xl mx-auto py-16 text-center bg-[#F4F4F6] border border-black/10">
          <p className="font-serif text-lg text-[#555555] uppercase">No Creations Found</p>
          <p className="font-sans text-xs text-[#777777] mt-1">Try selecting a different category.</p>
          <button
            onClick={() => setActiveCategory('ALL')}
            className="mt-4 px-6 py-2.5 bg-[#111111] text-white text-[10px] font-sans font-extrabold tracking-[0.2em] uppercase hover:bg-black transition-colors cursor-pointer"
          >
            VIEW ALL CREATIONS
          </button>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 md:gap-6 lg:gap-8 pt-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex flex-col bg-[#F4F4F6] border border-black/5 rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group cursor-pointer"
            >
              {/* Top Badge */}
              <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10 flex gap-1">
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-black/85 backdrop-blur-md text-[7px] xs:text-[8px] sm:text-[9.5px] font-sans tracking-[0.15em] sm:tracking-[0.18em] text-white uppercase rounded-none font-bold">
                  {product.badge}
                </span>
                {(product.isFeatured || product.is_featured) && (
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#C08A3E] text-[7px] xs:text-[8px] sm:text-[9px] font-sans tracking-widest text-white uppercase font-bold">
                    FEATURED
                  </span>
                )}
              </div>

              {/* Studio Product Image Viewport */}
              <div className="w-full h-44 xs:h-52 sm:h-64 md:h-72 bg-[#F5F5F7] relative overflow-hidden border-b border-black/5">
                {/* Primary Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0"
                />

                {/* Hover Sub-Image */}
                <img
                  src={product.galleryImages?.[1] || product.galleryImages?.[0] || product.image}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              {/* Bottom Content Area */}
              <div className="p-2.5 xs:p-3 sm:p-4 flex flex-col justify-between flex-1 bg-white gap-1.5 sm:gap-2">
                <div>
                  <span className="text-[8px] xs:text-[9px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase block mb-0.5">
                    {product.category}
                  </span>
                  <h3 className="font-serif font-black text-[11px] xs:text-xs sm:text-sm md:text-base text-[#111111] uppercase tracking-tight leading-tight sm:leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-sans text-gray-500 font-medium line-clamp-1 mt-0.5">
                    {product.frenchName || product.subtitle || 'Extrait de Parfum'}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-1 gap-2">
                  <span className="font-serif font-black text-xs sm:text-sm text-[#111111] shrink-0">
                    $ {product.price}
                  </span>
                  <button
                    onClick={(e) => handleAddToBag(e, product)}
                    className={`relative flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[8px] sm:text-[10px] font-sans font-extrabold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer overflow-hidden ${
                      addedProductId === product.id
                        ? 'bg-[#1a7a3a] text-white'
                        : 'bg-[#111111] text-white hover:bg-[#C08A3E]'
                    }`}
                  >
                    {addedProductId === product.id ? (
                      <>
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="hidden sm:inline">ADD TO BAG</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Website Theme Guarantee Banner */}
      <div className="w-full max-w-7xl mx-auto pt-4 sm:pt-6 border-t border-black/10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left text-[10px] sm:text-[11px] font-sans tracking-widest text-[#737373] uppercase mt-auto">
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

      {/* Our Story — Pre-Launch Brand Journey */}
      <div id="gallery" className="w-full scroll-mt-24">
        <OurStory />
      </div>

      {/* Brand Locations & Interactive Google Maps Section */}
      <div id="contact" className="w-full scroll-mt-24">
        <BrandLocationsMap />
      </div>

      {/* Luxury Haute Footer Section */}
      <Footer onScrollToTop={onScrollToTop} />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setCartItems([])}
      />
    </section>
  );
}
