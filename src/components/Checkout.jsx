import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder, validateDiscountCode, fetchUserProfile } from '../services/api';

export default function Checkout({ cartItems: propsCartItems, setCartItems, onOpenAccount }) {
  const navigate = useNavigate();
  const { isLoggedIn, user, promptLoginRequired } = useAuth();
  const { cartItems: contextCartItems, clearCart } = useCart();
  const cartItems = (propsCartItems && propsCartItems.length > 0) ? propsCartItems : contextCartItems;


  // Profile data pre-fill state
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('France');
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Customization & Shipping State
  const [deliveryOption, setDeliveryOption] = useState('express');
  const [giftBox, setGiftBox] = useState(true);
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Discount & Summary State
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Load user profile on mount to prefill form
  useEffect(() => {
    let isMounted = true;
    if (isLoggedIn) {
      fetchUserProfile().then((p) => {
        if (!isMounted) return;
        if (p) {
          setProfile(p);
          setFullName(p.full_name || user?.user_metadata?.full_name || '');
          setEmail(p.email || user?.email || '');
          setPhone(p.phone || user?.phone || '');
          setStreet(p.street_address || '');
          setCity(p.city || '');
          setState(p.state || '');
          setPostalCode(p.postal_code || '');
          setCountry(p.country || 'France');
        } else if (user) {
          setFullName(user.user_metadata?.full_name || '');
          setEmail(user.email || '');
          setPhone(user.user_metadata?.phone || '');
        }
        setLoadingProfile(false);
      });
    } else {
      setLoadingProfile(false);
    }
    return () => { isMounted = false; };
  }, [isLoggedIn, user]);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0;
  const shippingCost = 0; // Complimentary Express Shipping
  const estimatedTax = (subtotal - discountAmount) * 0.08; // 8% estimated tax
  const total = Math.max(0, subtotal - discountAmount + estimatedTax);

  // Handle promo validation
  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    const cleanCode = discountCode.trim().toUpperCase();
    if (!cleanCode) return;
    setDiscountError('');
    setDiscountLoading(true);
    try {
      const res = await validateDiscountCode(cleanCode);
      if (res.success && (res.discount || res.valid)) {
        const discountObj = res.discount || {
          code: res.code || cleanCode,
          percentage: Number(res.percentage || 15)
        };
        setAppliedDiscount(discountObj);
        setDiscountError('');
      } else {
        setDiscountError(res.message || res.error || 'Invalid discount code');
      }
    } catch (err) {
      setDiscountError('Unable to validate promo code');
    } finally {
      setDiscountLoading(false);
    }
  };


  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isLoggedIn) {
      promptLoginRequired('Please sign in or create an account to complete your secure checkout.');
      onOpenAccount();
      return;
    }

    if (cartItems.length === 0) {
      setFormError('Your bag is currently empty. Please add items before placing an order.');
      return;
    }

    // Validation check
    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      setFormError('Please fill in all required shipping and contact details marked with *');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: String(item.product.id),
          size: item.size?.size || '50 ml',
          quantity: item.quantity,
          unitPrice: item.price,
          engravingText: item.engraving || undefined
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          state: state.trim() || undefined,
          postalCode: postalCode.trim(),
          country: country.trim()
        },
        discountCode: appliedDiscount ? appliedDiscount.code : undefined,
        saveToProfile
      };

      const res = await placeOrder(orderPayload);

      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
      } else {

        setFormError(res.error || 'Failed to process order. Please try again.');
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Order Confirmation View
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-black/10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#C08A3E] uppercase block mb-1">
              MAISON LUNE HAUTE PARFUMERIE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] font-medium mt-2 max-w-md mx-auto">
              Thank you, <span className="font-bold text-[#111111]">{fullName}</span>. Your bespoke fragrance creation is being hand-crafted and prepared in our Grasse Atelier.
            </p>
          </div>

          <div className="bg-[#F8F8FA] border border-black/5 rounded-2xl p-5 text-left space-y-3 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-black/10 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#555555]">ORDER REFERENCE</span>
              <span className="font-mono font-bold text-[#111111] text-sm">#{completedOrder.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#555555]">ESTIMATED DELIVERY</span>
              <span className="font-bold text-[#059669]">2-3 Business Days (Complimentary Express)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#555555]">DELIVERY ADDRESS</span>
              <span className="font-bold text-[#111111] text-right truncate max-w-[220px]">
                {street}, {city}, {postalCode}, {country}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#555555]">CONTACT PHONE</span>
              <span className="font-bold text-[#111111]">{phone}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-black/10">
              <span className="font-extrabold uppercase text-[#111111]">TOTAL PAID</span>
              <span className="font-serif text-lg font-extrabold text-[#111111]">${completedOrder.total.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/collection')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#111111] hover:bg-black text-white text-xs font-sans font-extrabold tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer shadow-md active:scale-95"
            >
              CONTINUE SHOPPING
            </button>
            <button
              onClick={onOpenAccount}
              className="w-full sm:w-auto px-8 py-3.5 border border-black/20 text-[#111111] hover:bg-black hover:text-white text-xs font-sans font-extrabold tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer active:scale-95"
            >
              VIEW IN MY PROFILE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111111] pt-24 pb-20 px-4 sm:px-6 lg:px-12 font-sans">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-6 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-widest text-[#737373] hover:text-[#111111] uppercase transition-colors mb-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>RETURN TO CREATIONS</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
            HAUTE CHECKOUT
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#737373]">
          <span className="text-[#C08A3E]">1. BAG</span>
          <span>→</span>
          <span className="text-[#111111] underline underline-offset-4 decoration-[#C08A3E] decoration-2">2. DELIVERY & DETAILS</span>
          <span>→</span>
          <span>3. CONFIRMATION</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-8">
          {!isLoggedIn && (
            <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-2xl p-5 text-xs text-[#92400E] font-medium flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#D97706] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Already have a Maison Lune account? Sign in for instant autofill.</span>
              </div>
              <button
                onClick={onOpenAccount}
                className="px-4 py-2 bg-[#111111] hover:bg-black text-white rounded-full font-bold text-[10px] tracking-widest uppercase transition-all cursor-pointer shrink-0"
              >
                SIGN IN
              </button>
            </div>
          )}

          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs font-semibold text-red-600 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* 1. Contact Details */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase block">
                    STEP 1
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-extrabold uppercase text-[#111111]">
                    CONTACT INFORMATION
                  </h3>
                </div>
                <span className="text-xs text-[#737373] font-semibold">* REQUIRED FIELDS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Éléonore Saint-Germain"
                    className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleonore@maison-lune.com"
                    className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                  PHONE NUMBER * (FOR DELIVERY UPDATES)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-xs text-[#737373]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 1 42 86 28 00 or +1 212 535 5500"
                    className="w-full pl-11 pr-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-black/10 pb-4">
                <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase block">
                  STEP 2
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-extrabold uppercase text-[#111111]">
                  SHIPPING ADDRESS
                </h3>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                  STREET ADDRESS *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="31 Rue Cambon, Apt 4B"
                  className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                    CITY *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Paris"
                    className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                    STATE / PROVINCE
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Île-de-France / NY"
                    className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                    POSTAL CODE *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="75001"
                    className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#111111] uppercase mb-2">
                  COUNTRY *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                >
                  <option value="France">France</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="saveProfileCheck"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="w-4 h-4 rounded border-black/20 text-[#111111] focus:ring-black cursor-pointer"
                />
                <label htmlFor="saveProfileCheck" className="text-xs text-[#111111] font-semibold cursor-pointer select-none">
                  Save address & phone number to my profile for future purchases
                </label>
              </div>
            </div>

            {/* 3. Payment Options (Razorpay Gateway Integration) */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-black/10 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase block">
                    STEP 3
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-extrabold uppercase text-[#111111]">
                    PAYMENT METHOD
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#072654]/10 text-[#072654] border border-[#072654]/20 rounded-full text-[9px] font-extrabold tracking-widest uppercase">
                  <svg className="w-3 h-3 text-[#0284C7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
                  </svg>
                  RAZORPAY SECURE
                </span>
              </div>

              {/* Razorpay Gateway Option */}
              <div className="space-y-4">
                <div className="p-4 sm:p-5 border-2 border-[#111111] bg-[#F8F9FC] rounded-2xl transition-all relative shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#111111] bg-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[#111111]">
                            RAZORPAY PAYMENTS
                          </span>
                          <span className="px-2 py-0.5 bg-[#C08A3E]/15 text-[#9A6B29] font-sans text-[9px] font-black tracking-wider uppercase rounded">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#555555] font-medium mt-1 leading-relaxed">
                          Pay securely via UPI (Google Pay, PhonePe, Paytm), Credit / Debit Cards, NetBanking & Wallets.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Icons Grid / Badges */}
                  <div className="mt-4 pt-3.5 border-t border-black/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-xl border border-black/5 text-[10px] font-extrabold text-[#111111]">
                      <span className="text-[#0284C7]">⚡</span> UPI / QR
                    </div>
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-xl border border-black/5 text-[10px] font-extrabold text-[#111111]">
                      <span>💳</span> CARDS
                    </div>
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-xl border border-black/5 text-[10px] font-extrabold text-[#111111]">
                      <span>🏛</span> NETBANKING
                    </div>
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-xl border border-black/5 text-[10px] font-extrabold text-[#111111]">
                      <span>👛</span> WALLETS
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F4F4F6] rounded-xl text-center text-[10.5px] text-[#666666] font-medium leading-relaxed border border-black/5">
                  🔒 Encrypted with 256-bit SSL security via Razorpay Gateway. No banking data is stored on our servers.
                </div>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.25em] uppercase rounded-full transition-all cursor-pointer shadow-xl active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <span>CONNECTING TO RAZORPAY GATEWAY...</span>
              ) : (
                <>
                  <span>PROCEED TO PAY VIA RAZORPAY (${total.toFixed(2)} USD)</span>
                  <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-black/10 pb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-extrabold uppercase text-[#111111]">
                ORDER SUMMARY ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
              <span className="text-[10px] font-sans font-extrabold tracking-widest uppercase text-[#C08A3E]">
                HAUTE PARFUMERIE
              </span>
            </div>

            {/* Item List */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="text-xs text-[#737373] text-center py-6">Your bag is empty.</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-[#F8F8FA] rounded-2xl border border-black/5 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-18 object-contain bg-white rounded-xl p-1 border border-black/5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs font-bold uppercase text-[#111111] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] font-sans text-[#737373] uppercase tracking-wider">
                        SIZE: {item.size?.size || '50 ml'} • QTY: {item.quantity}
                      </p>
                      {item.engraving && (
                        <p className="text-[9.5px] font-sans text-[#C08A3E] uppercase font-semibold truncate">
                          ENGRAVING: "{item.engraving}"
                        </p>
                      )}
                    </div>
                    <span className="font-serif text-xs font-bold text-[#111111]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyDiscount} className="space-y-2 pt-2 border-t border-black/10">
              <label className="block text-[10px] font-sans font-bold tracking-[0.2em] text-[#111111] uppercase">
                PROMO / PRIVILEGE CODE
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="e.g. LUNE10 or HAUTE20"
                  className="flex-1 px-3.5 py-2.5 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  disabled={discountLoading}
                  className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-[10px] font-extrabold tracking-widest uppercase rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  APPLY
                </button>
              </div>

              {appliedDiscount && (
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                  <span>PROMO CODE "{appliedDiscount.code}" APPLIED ({appliedDiscount.percentage}% OFF)</span>
                  <button onClick={() => setAppliedDiscount(null)} className="text-red-500 hover:underline text-[10px]">REMOVE</button>
                </div>
              )}

              {discountError && (
                <p className="text-[11px] text-red-500 font-semibold">{discountError}</p>
              )}
            </form>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-black/10 text-xs font-sans text-[#555555]">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-semibold text-[#111111]">${subtotal.toFixed(2)}</span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>DISCOUNT ({appliedDiscount.percentage}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>ESTIMATED TAX (8%)</span>
                <span className="font-semibold text-[#111111]">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#059669] font-bold">
                <span>MAISON EXPRESS SHIPPING</span>
                <span>COMPLIMENTARY</span>
              </div>

              <div className="flex justify-between items-center text-base font-bold text-[#111111] pt-3 border-t border-black/10 font-serif">
                <span>TOTAL DUE</span>
                <span className="text-xl">${total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
