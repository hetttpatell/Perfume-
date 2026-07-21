import { useState } from 'react';
import { COMPLIMENTARY_SAMPLES } from '../data/boutiqueProducts';

export function QuickBuyModal({ product, onClose, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState('');
  const [enableEngraving, setEnableEngraving] = useState(false);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  const currentPrice = selectedSize.price * quantity;

  const handleAdd = () => {
    onAddToCart({
      product,
      size: selectedSize,
      quantity,
      price: selectedSize.price,
      totalPrice: currentPrice,
      engraving: enableEngraving ? engravingText : null,
      giftWrap: includeGiftWrap,
    });
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-black/10 flex flex-col md:flex-row max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Image Section (Website Theme Matching) */}
        <div className="w-full md:w-1/2 bg-[#F6F6F6] p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[260px] md:min-h-[440px] border-b md:border-b-0 md:border-r border-black/10">
          <span className="absolute top-4 left-4 text-[10px] font-sans tracking-[0.2em] uppercase bg-black/80 text-white px-3 py-1 rounded-full font-medium">
            {product.badge}
          </span>
          <img
            src={product.image}
            alt={product.name}
            className="w-auto h-56 md:h-80 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Details & Luxury Customization Panel */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-between bg-white text-[#1A1A1A]">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#737373] font-semibold">
                {product.category}
              </span>
              <span className="text-xs font-sans text-[#C08A3E] font-medium">
                ★ {product.rating} RATING
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A1A] tracking-tight uppercase mb-1">
              {product.name}
            </h2>

            <p className="text-[11px] font-sans text-[#737373] tracking-wider uppercase mb-4 font-medium">
              {product.subtitle}
            </p>

            <div className="text-2xl font-sans font-extrabold text-[#1A1A1A] mb-4 pb-3 border-b border-black/10">
              ${currentPrice.toFixed(2)}{' '}
              <span className="text-xs font-sans font-normal text-[#737373] uppercase ml-1">USD</span>
            </div>

            <p className="text-xs font-sans text-[#555555] leading-relaxed mb-5 font-light">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-5">
              <label className="block text-[10px] font-sans tracking-[0.2em] uppercase text-[#1A1A1A] font-semibold mb-2">
                SELECT FLACON SIZE:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-2.5 text-xs font-sans font-medium rounded-lg border transition-all cursor-pointer text-center ${
                      selectedSize.size === s.size
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                        : 'bg-[#F9F9F9] text-[#1A1A1A] border-black/15 hover:border-black/50'
                    }`}
                  >
                    <div className="font-bold">{s.size}</div>
                    <div className="text-[10px] opacity-80">${s.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Complimentary Engraving Option */}
            {product.engravingAvailable && (
              <div className="mb-5 p-3 bg-[#F9F9F9] border border-black/10 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer mb-1.5">
                  <input
                    type="checkbox"
                    checked={enableEngraving}
                    onChange={(e) => setEnableEngraving(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-[#1A1A1A]">
                    COMPLIMENTARY BOTTLE ENGRAVING
                  </span>
                </label>
                {enableEngraving && (
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="ENTER INITIALS (UP TO 3 CHARS, e.g. C.C.)"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 text-xs font-sans border border-black/20 focus:border-black focus:outline-none uppercase tracking-widest bg-white text-[#1A1A1A] rounded-md mt-1"
                  />
                )}
              </div>
            )}

            {/* Signature Gift Packaging Option */}
            <div className="mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftWrap}
                  onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                  className="accent-black w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-sans text-[#555555] font-light">
                  Include Signature Chanel Gift Box & Ribbon (Complimentary)
                </span>
              </label>
            </div>

            {/* Quantity Selector */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#1A1A1A] font-semibold">
                QUANTITY:
              </span>
              <div className="flex items-center border border-black/20 rounded-lg overflow-hidden bg-[#F9F9F9]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-[#1A1A1A] hover:bg-black/10 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 font-sans text-xs font-bold text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-[#1A1A1A] hover:bg-black/10 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-3 border-t border-black/10">
            <button
              onClick={handleAdd}
              disabled={addedToast}
              className={`w-full py-3.5 text-xs font-sans font-semibold tracking-[0.25em] uppercase rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                addedToast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1A1A1A] text-white hover:bg-black hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {addedToast ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ADDED TO HAUTE BAG</span>
                </>
              ) : (
                <>
                  <span>ADD TO BAG • ${(selectedSize.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const toggleSample = (sampleId) => {
    if (selectedSamples.includes(sampleId)) {
      setSelectedSamples(prev => prev.filter(id => id !== sampleId));
    } else {
      if (selectedSamples.length < 2) {
        setSelectedSamples(prev => [...prev, sampleId]);
      }
    }
  };

  const handleCompleteCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      onCheckout();
      setCheckoutSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-[#1A1A1A] overflow-y-auto border-l border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Cart Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#737373] font-semibold block">
              CHANEL BOUTIQUE
            </span>
            <h3 className="font-serif text-xl font-light tracking-wide uppercase text-[#1A1A1A]">
              YOUR HAUTE BAG ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Contents */}
        <div className="flex-1 my-6 overflow-y-auto pr-1">
          {checkoutSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-serif text-2xl font-light uppercase tracking-wide mb-2 text-[#1A1A1A]">
                ORDER CONFIRMED
              </h4>
              <p className="font-sans text-xs text-[#555555] max-w-xs leading-relaxed mb-3">
                Thank you for your order. Your Chanel N°19 is being prepared in our Grasse Atelier.
              </p>
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#C08A3E] uppercase font-semibold">
                CONFIRMATION #CH-928401
              </span>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#737373]">
              <svg className="w-12 h-12 stroke-1 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-sans text-xs uppercase tracking-[0.2em] font-semibold mb-1 text-[#1A1A1A]">
                YOUR BAG IS EMPTY
              </p>
              <p className="font-sans text-[11px] text-[#888888] max-w-xs font-light">
                Discover the N°19 Haute Parfumerie collection and select your signature bottle.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product items */}
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.size.size}-${idx}`}
                    className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-black/5 rounded-xl items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-20 object-contain mix-blend-multiply bg-white p-1 rounded-lg border border-black/5"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif text-sm font-medium uppercase text-[#1A1A1A]">
                        {item.product.name}
                      </h4>
                      <p className="font-sans text-[10px] text-[#737373] uppercase tracking-wider mb-1">
                        SIZE: {item.size.size}
                      </p>
                      {item.engraving && (
                        <p className="text-[10px] font-sans text-[#C08A3E] uppercase tracking-wider font-semibold mb-1">
                          ENGRAVING: "{item.engraving}"
                        </p>
                      )}
                      <p className="font-sans text-xs font-bold text-[#1A1A1A]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-black/20 rounded bg-white text-xs">
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="px-2 py-0.5 font-bold hover:bg-black/10 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-semibold text-[11px]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="px-2 py-0.5 font-bold hover:bg-black/10 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-[10px] text-red-600 hover:underline uppercase tracking-wider cursor-pointer ml-auto transition-colors"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complimentary Samples Selection */}
              <div className="p-3.5 bg-[#F8F8F8] border border-black/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#1A1A1A] font-semibold">
                    SELECT 2 COMPLIMENTARY SAMPLES:
                  </span>
                  <span className="text-[10px] font-sans text-[#737373]">
                    ({selectedSamples.length}/2)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {COMPLIMENTARY_SAMPLES.map((sample) => {
                    const isSelected = selectedSamples.includes(sample.id);
                    return (
                      <button
                        key={sample.id}
                        onClick={() => toggleSample(sample.id)}
                        className={`w-full p-2 text-[11px] font-sans text-left transition-all rounded-md border flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            : 'bg-white text-[#1A1A1A] border-black/15 hover:border-black/40'
                        }`}
                      >
                        <span>{sample.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && !checkoutSuccess && (
          <div className="border-t border-black/10 pt-4 space-y-3 bg-white">
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
              <span>${subtotal.toFixed(2)} USD</span>
            </div>

            <button
              onClick={handleCompleteCheckout}
              className="w-full py-4 text-xs font-sans font-semibold tracking-[0.25em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-xl transition-all duration-300 cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
