import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BOUTIQUE_PRODUCTS } from '../data/boutiqueProducts';
import CartDrawer from './CartDrawer';
import Testimonials from './Testimonials';
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
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Local fallbacks if parent state is not supplied
  const [localCartItems, setLocalCartItems] = useState([]);
  const [localIsCartOpen, setLocalIsCartOpen] = useState(false);

  const cartItems = parentCartItems !== undefined ? parentCartItems : localCartItems;
  const setCartItems = parentSetCartItems || setLocalCartItems;
  const isCartOpen = parentIsCartOpen !== undefined ? parentIsCartOpen : localIsCartOpen;
  const setIsCartOpen = parentSetIsCartOpen || setLocalIsCartOpen;

  const categories = [
    { id: 'ALL', label: 'ALL CREATIONS' },
    { id: 'PERFUME', label: 'PERFUME' },
    { id: 'BODY_ROLLON', label: 'BODY ROLL-ON' },
  ];

  const filteredProducts = activeCategory === 'ALL'
    ? BOUTIQUE_PRODUCTS
    : activeCategory === 'PERFUME'
      ? BOUTIQUE_PRODUCTS.filter(p => p.category === 'EXTRAIT' || p.category === 'EAU DE PARFUM')
      : BOUTIQUE_PRODUCTS.filter(p => p.category === 'BODY & RITUALS');

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

      {/* Category Filter Navigation Bar — Unique Luxury Pill Tabs */}
      <div className="w-full max-w-7xl mx-auto pt-2 pb-6 flex flex-wrap items-center justify-start gap-2.5 sm:gap-4 border-b border-black/10 mb-6">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = cat.id === 'ALL'
            ? BOUTIQUE_PRODUCTS.length
            : cat.id === 'PERFUME'
              ? BOUTIQUE_PRODUCTS.filter(p => p.category === 'EXTRAIT' || p.category === 'EAU DE PARFUM').length
              : BOUTIQUE_PRODUCTS.filter(p => p.category === 'BODY & RITUALS').length;

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

      {/* Products Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 md:gap-6 lg:gap-8 pt-2">
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

      {/* Haute Testimonials & Critiques Section */}
      <div id="gallery" className="w-full scroll-mt-24">
        <Testimonials />
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
