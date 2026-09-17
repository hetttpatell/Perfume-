import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import OurStory from './OurStory';
import BrandVideoFeedback from './BrandVideoFeedback';
import Footer from './Footer';

// ──────────────────────────────────────────────────────────────────────────────
// OlfactoryExperience — Bottom-of-homepage wrapper containing OurStory,
// BrandVideoFeedback, Footer, and the global CartDrawer.
// Product showcase has been extracted to FeaturedProducts.jsx for reusability.
// ──────────────────────────────────────────────────────────────────────────────

export default function OlfactoryExperience({
  onScrollToTop,
  cartItems: parentCartItems,
  setCartItems: parentSetCartItems,
  isCartOpen: parentIsCartOpen,
  setIsCartOpen: parentSetIsCartOpen,
}) {
  const { cartItems: contextCartItems, isCartOpen: contextIsCartOpen, setIsCartOpen: contextSetIsCartOpen } = useCart();

  const cartItems = (parentCartItems && parentCartItems.length > 0) ? parentCartItems : contextCartItems;
  const isCartOpen = parentIsCartOpen !== undefined ? parentIsCartOpen : contextIsCartOpen;
  const setIsCartOpen = parentSetIsCartOpen || contextSetIsCartOpen;
  const setCartItems = parentSetCartItems || (() => {});

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
    <section className="w-full bg-white text-[#111111] font-sans">
      {/* Our Story — Pre-Launch Brand Journey */}
      <div id="gallery" className="w-full scroll-mt-24">
        <OurStory />
      </div>

      {/* Brand Video Client Testimonials & Social Proof */}
      <div id="testimonials" className="w-full scroll-mt-24">
        <BrandVideoFeedback />
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
