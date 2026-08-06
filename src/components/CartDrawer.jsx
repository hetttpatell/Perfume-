import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function CartDrawer({ isOpen, onClose, onCheckout }) {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleUpdateQty = (idx, newQty) => {
    const item = cartItems[idx];
    if (item) {
      updateQuantity(item.dbId || item.id || idx, newQty);
    }
  };

  const handleRemove = (idx) => {
    const item = cartItems[idx];
    if (item) {
      removeItem(item.dbId || item.id || idx);
    }
  };

  const handleCompleteCheckout = () => {
    onClose();
    if (onCheckout) onCheckout();
    navigate('/checkout');
  };


  return (


    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-full sm:max-w-md bg-white h-[100dvh] sm:h-full shadow-2xl flex flex-col justify-between p-4 sm:p-7 text-[#1A1A1A] border-l border-black/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag/Pull Indicator Bar */}
        <div className="w-12 h-1.5 bg-black/15 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

        {/* Top Navigation & Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4 shrink-0">
          {/* Dedicated Mobile & Desktop Go Back / Return to Store button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 py-2 px-3 bg-[#F4F4F6] hover:bg-black/10 rounded-full text-xs font-sans font-bold tracking-wider text-[#1A1A1A] transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="Go back to store"
          >
            <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="uppercase text-[10.5px] tracking-widest font-extrabold">BACK TO STORE</span>
          </button>

          <div className="text-right">
            <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#737373] font-semibold block">
              MAISON LUNE
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide uppercase text-[#1A1A1A]">
              HAUTE BAG ({totalCount})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close cart drawer"
          >
            <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Contents Container */}
        <div className="flex-1 my-4 overflow-y-auto overscroll-contain pr-1 space-y-4">
          {checkoutSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-serif text-2xl font-light uppercase tracking-wide mb-2 text-[#1A1A1A]">
                ORDER CONFIRMED
              </h4>
              <p className="font-sans text-xs text-[#555555] max-w-xs leading-relaxed mb-3">
                Thank you for your order. Your Lune creation is being hand-prepared in our Grasse Atelier.
              </p>
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#C08A3E] uppercase font-semibold">
                CONFIRMATION #LN-928401
              </span>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 text-[#737373]">
              <div className="w-20 h-20 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4 border border-black/5 shadow-inner">
                <svg className="w-10 h-10 stroke-1 text-[#1A1A1A] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] font-bold mb-1.5 text-[#1A1A1A]">
                YOUR BAG IS EMPTY
              </p>
              <p className="font-sans text-[11px] text-[#888888] max-w-xs leading-relaxed font-light mb-6">
                Discover the Maison Lune Haute Parfumerie collection and select your signature creation.
              </p>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 text-xs font-sans font-extrabold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>← EXPLORE CREATIONS</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.size?.size || idx}-${idx}`}
                  className="flex gap-3.5 p-3.5 bg-[#F8F8F8] border border-black/5 rounded-xl items-center shadow-xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-20 sm:w-18 sm:h-22 object-contain mix-blend-multiply bg-white p-1 rounded-lg border border-black/5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold uppercase text-[#1A1A1A] truncate">
                      {item.product.name}
                    </h4>
                    <p className="font-sans text-[10px] text-[#737373] uppercase tracking-wider mb-1">
                      SIZE: {item.size?.size || '30 ml / 1.0 FL. OZ.'}
                    </p>
                    {item.engraving && (
                      <p className="text-[10px] font-sans text-[#C08A3E] uppercase tracking-wider font-semibold mb-1 truncate">
                        ENGRAVING: "{item.engraving}"
                      </p>
                    )}
                    <p className="font-sans text-xs font-bold text-[#1A1A1A]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Touch-optimized quantity controls */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center border border-black/20 rounded-lg bg-white text-xs overflow-hidden shadow-xs">
                        <button
                          onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                          className="w-8 h-8 font-bold hover:bg-black/10 cursor-pointer flex items-center justify-center text-sm text-[#1A1A1A] active:bg-black/20 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 font-semibold text-xs text-[#1A1A1A]">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                          className="w-8 h-8 font-bold hover:bg-black/10 cursor-pointer flex items-center justify-center text-sm text-[#1A1A1A] active:bg-black/20 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(idx)}
                        className="text-[10px] font-sans font-bold text-red-600 hover:text-red-800 uppercase tracking-wider cursor-pointer ml-auto transition-colors py-1 px-2 hover:bg-red-50 rounded"
                      >
                        REMOVE
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary & Mobile Back Navigation */}
        {cartItems.length > 0 && !checkoutSuccess && (
          <div className="border-t border-black/10 pt-4 space-y-3 bg-white shrink-0">
            <div className="flex items-center justify-between text-xs font-sans text-[#737373]">
              <span className="uppercase tracking-widest text-[10px]">COMPLIMENTARY EXPRESS DELIVERY</span>
              <span className="font-semibold text-emerald-700 text-[10px] uppercase">INCLUDED</span>
            </div>
            <div className="flex items-center justify-between text-xs font-sans text-[#737373]">
              <span className="uppercase tracking-widest text-[10px]">SIGNATURE GIFT PACKAGING</span>
              <span className="font-semibold text-[#1A1A1A] text-[10px] uppercase">INCLUDED</span>
            </div>
            <div className="flex items-center justify-between text-base font-sans font-bold text-[#1A1A1A] pt-2 border-t border-black/10">
              <span className="uppercase tracking-widest text-xs font-semibold">SUBTOTAL</span>
              <span className="text-lg">${subtotal.toFixed(2)} USD</span>
            </div>

            <button
              onClick={handleCompleteCheckout}
              className="w-full py-4 text-xs font-sans font-extrabold tracking-[0.25em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-xl transition-all duration-300 cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Mobile Footer Secondary "Continue Shopping / Back" Action */}
            <button
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-sans font-bold text-[#737373] hover:text-[#1A1A1A] uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-1"
            >
              <span>← CONTINUE SHOPPING</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
