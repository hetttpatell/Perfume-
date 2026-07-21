import { useState } from 'react';
import { BOUTIQUE_PRODUCTS } from '../data/boutiqueProducts';
import { QuickBuyModal, CartDrawer } from './ShopCartModal';
import Testimonials from './Testimonials';
import BrandLocationsMap from './BrandLocationsMap';
import Footer from './Footer';

export default function OlfactoryExperience({ onScrollToTop }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = [
    { id: 'ALL', label: 'TOUT' },
    { id: 'EXTRAIT', label: 'LES EXTRAITS' },
    { id: 'EAU DE PARFUM', label: 'EAU DE PARFUM' },
    { id: 'BODY & RITUALS', label: 'RITUELS DE SOIN' },
  ];

  const filteredProducts = activeCategory === 'ALL'
    ? BOUTIQUE_PRODUCTS
    : BOUTIQUE_PRODUCTS.filter(p => p.category === activeCategory);

  const handleAddToCart = (newItem) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === newItem.product.id && i.size.size === newItem.size.size && i.engraving === newItem.engraving
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full min-h-full bg-[#FAFAFA] text-[#1A1A1A] flex flex-col justify-start gap-4 sm:gap-6 md:gap-8 p-4 sm:p-8 md:p-10 lg:p-12 overflow-y-auto font-sans">
      {/* Header Bar */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-black/10 pb-4 sm:pb-6 gap-4">
        <div>
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#737373] font-semibold block mb-1">
            05 // HAUTE PARFUMERIE BOUTIQUE
          </span>
          <h2 className="font-serif font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight uppercase">
            CHANEL N°19 EXCLUSIVE COLLECTION
          </h2>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 self-end sm:self-auto shrink-0">
          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>BAG ({totalCartCount})</span>
          </button>

          {onScrollToTop && (
            <button
              onClick={onScrollToTop}
              className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#1A1A1A] bg-black/5 hover:bg-black hover:text-white rounded-full border border-black/15 transition-all duration-300 cursor-pointer shrink-0"
            >
              TOP OF PAGE
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto pt-1 sm:pt-2 pb-2 flex flex-wrap items-center justify-start gap-3 sm:gap-6 border-b border-black/10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`pb-2 text-[10px] sm:text-[11px] md:text-xs font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer relative ${
              activeCategory === cat.id
                ? 'text-[#1A1A1A] font-bold'
                : 'text-[#737373] hover:text-[#1A1A1A]'
            }`}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C08A3E] animate-fadeIn" />
            )}
          </button>
        ))}
      </div>

      {/* Responsive Grid: 1 column on Mobile (grid-cols-1), 2 on Tablet (sm), 4 on Desktop (lg) */}
      <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-6 lg:gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-white border border-black/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative"
          >
            {/* Top Badge */}
            <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10">
              <span className="px-2.5 py-1 sm:px-3 sm:py-1 bg-black/80 backdrop-blur-md text-[9px] sm:text-[9px] font-sans tracking-[0.18em] text-white uppercase rounded-full font-semibold">
                {product.badge}
              </span>
            </div>

            {/* Studio Product Image Viewport */}
            <div className="w-full h-56 sm:h-60 md:h-64 lg:h-72 bg-[#F6F6F6] relative overflow-hidden flex items-center justify-center p-6 border-b border-black/5">
              <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-transparent pointer-events-none" />
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom Content Area */}
            <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white gap-3">
              <div>
                <p className="font-sans text-[10px] sm:text-[10px] text-[#737373] font-semibold tracking-wider uppercase mb-1">
                  {product.subtitle}
                </p>
                <h3 className="font-sans font-bold text-sm sm:text-base text-[#1A1A1A] uppercase tracking-wide leading-snug">
                  {product.name}
                </h3>
              </div>

              {/* Bottom Row: Price & Shop CTA Button */}
              <div className="flex items-center justify-between pt-3 border-t border-black/10 mt-1">
                <span className="font-sans font-extrabold text-base sm:text-lg text-[#1A1A1A]">
                  {product.priceFormatted}
                </span>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-5 sm:px-5 py-2 sm:py-2.5 text-xs font-sans font-bold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-md transition-all duration-200 shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  SHOP
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
          <span>SIGNATURE CHANEL GIFT BOX</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <svg className="w-4 h-4 text-[#C08A3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>COMPLIMENTARY FLACON ENGRAVING</span>
        </div>
      </div>

      {/* Haute Testimonials & Critiques Section */}
      <Testimonials />

      {/* Brand Locations & Interactive Google Maps Section */}
      <BrandLocationsMap />

      {/* Luxury Haute Footer Section */}
      <Footer onScrollToTop={onScrollToTop} />

      {/* Interactive Quick-Buy Modal */}
      {selectedProduct && (
        <QuickBuyModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

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
