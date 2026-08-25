import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder, validateDiscountCode, fetchUserProfile } from '../services/api';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

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
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [orderNotes, setOrderNotes] = useState('');
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Real-time Field Validation State
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Customization & Shipping State
  const [deliveryOption, setDeliveryOption] = useState('express');
  const [giftBox, setGiftBox] = useState(true);
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // Mobile Order Summary Accordion State
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Discount & Summary State
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Robust Field Validator
  const validateField = (name, value, allValues = {}) => {
    const currentEmail = allValues.email !== undefined ? allValues.email : email;
    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Full name must be at least 3 characters';
        if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return 'Full name should only contain letters';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address (e.g. name@domain.com)';
        return '';
      case 'confirmEmail':
        if (!value || !value.trim()) return 'Please confirm your email address';
        if (value.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) return 'Email addresses do not match';
        return '';
      case 'phone': {
        if (!value || !value.trim()) return 'Phone number is required for delivery updates';
        const cleanDigits = value.replace(/\D/g, '');
        if (cleanDigits.length === 10) {
          if (!/^[6-9]\d{9}$/.test(cleanDigits)) return 'Please enter a 10-digit mobile number starting with 6, 7, 8, or 9';
        } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
          if (!/^91[6-9]\d{9}$/.test(cleanDigits)) return 'Please enter a valid Indian mobile number';
        } else {
          return 'Please enter a valid 10-digit Indian phone number (e.g. 9876543210)';
        }
        return '';
      }
      case 'street':
        if (!value || !value.trim()) return 'Street address is required';
        if (value.trim().length < 5) return 'Please enter complete address (flat/house no., building, street)';
        return '';
      case 'city':
        if (!value || !value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City name must be at least 2 characters';
        if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return 'City name should only contain letters';
        return '';
      case 'state':
        if (!value || !value.trim()) return 'Please select your State / UT';
        return '';
      case 'postalCode': {
        if (!value || !value.trim()) return 'Postal PIN code is required';
        const cleanPin = value.trim();
        if (!/^\d{6}$/.test(cleanPin)) return 'PIN code must be exactly 6 numeric digits (e.g. 110001)';
        if (/^0/.test(cleanPin)) return 'Indian PIN code cannot start with 0';
        return '';
      }
      case 'country':
        if (!value || !value.trim()) return 'Country is required';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const valMap = { fullName, email, confirmEmail, phone, street, city, state, postalCode, country };
    const err = validateField(fieldName, valMap[fieldName], valMap);
    setFieldErrors(prev => ({ ...prev, [fieldName]: err }));
  };

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
          setCountry('India');
        } else if (user) {
          setFullName(user.user_metadata?.full_name || '');
          setEmail(user.email || '');
          setPhone(user.user_metadata?.phone || '');
          setCountry('India');
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
  const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);

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

  // Handle order submission — works for both logged-in users and guests
  const handleSubmitOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Your bag is currently empty. Please add items before placing an order.');
      return;
    }

    // Run strict field validations across all address and contact fields
    const allValues = { fullName, email, confirmEmail, phone, street, city, state, postalCode, country };
    const fieldsToValidate = [
      'fullName',
      'email',
      ...(!isLoggedIn ? ['confirmEmail'] : []),
      'phone',
      'street',
      'city',
      'state',
      'postalCode',
      'country'
    ];

    const errors = {};
    fieldsToValidate.forEach((field) => {
      const err = validateField(field, allValues[field], allValues);
      if (err) errors[field] = err;
    });

    // Mark all fields as touched to display validation indicators
    const allTouched = {};
    fieldsToValidate.forEach((f) => { allTouched[f] = true; });
    setTouched(allTouched);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setFormError(`Please correct the highlighted fields: ${firstError}`);
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
        // Authenticated user fields
        ...(isLoggedIn ? { saveToProfile } : {}),
        // Guest checkout fields
        ...(!isLoggedIn ? {
          guestEmail: email.trim(),
          guestName: fullName.trim(),
          guestPhone: phone.trim()
        } : {}),
        // Optional order notes
        ...(orderNotes.trim() ? { orderNotes: orderNotes.trim() } : {})
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
      <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-black/10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.3em] text-[#C08A3E] uppercase block mb-1">
              MAISON LUNE HAUTE PARFUMERIE
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] font-medium mt-2 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-[#111111]">{fullName}</span>. Your bespoke fragrance creation is being hand-crafted and prepared in our Grasse Atelier.
            </p>
          </div>

          <div className="bg-[#F8F8FA] border border-black/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-black/10">
              <span className="font-bold uppercase tracking-wider text-[#555555]">ORDER REFERENCE</span>
              <span className="font-mono font-bold text-[#111111] text-sm">#{completedOrder.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#555555]">ESTIMATED DELIVERY</span>
              <span className="font-bold text-[#059669] text-right">2-3 Days (Complimentary Express)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#555555]">DELIVERY ADDRESS</span>
              <span className="font-bold text-[#111111] text-right truncate max-w-[180px] sm:max-w-[240px]">
                {street}, {city}, {postalCode}, {country}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#555555]">CONTACT PHONE</span>
              <span className="font-bold text-[#111111]">{phone}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-black/10">
              <span className="font-extrabold uppercase text-[#111111]">TOTAL PAID</span>
              <span className="font-serif text-base sm:text-lg font-extrabold text-[#111111]">${completedOrder.total.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/collection')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#111111] hover:bg-black text-white text-xs font-sans font-extrabold tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer shadow-md active:scale-95 min-h-[46px] flex items-center justify-center"
            >
              CONTINUE SHOPPING
            </button>
            {isLoggedIn ? (
              <button
                onClick={onOpenAccount}
                className="w-full sm:w-auto px-8 py-3.5 border border-black/20 text-[#111111] hover:bg-black hover:text-white text-xs font-sans font-extrabold tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer active:scale-95 min-h-[46px] flex items-center justify-center"
              >
                VIEW IN MY PROFILE
              </button>
            ) : (
              <p className="text-xs text-[#555555] font-medium text-center max-w-sm leading-relaxed">
                A confirmation email has been sent to <span className="font-bold text-[#111111]">{email}</span>. You can track your order using the reference number above.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111111] pt-16 sm:pt-24 pb-28 sm:pb-20 px-3 sm:px-6 lg:px-12 font-sans select-none sm:select-auto">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto mb-5 sm:mb-8 border-b border-black/10 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-sans font-bold tracking-widest text-[#737373] hover:text-[#111111] uppercase transition-colors mb-1.5 cursor-pointer py-1"
            >
              <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>RETURN TO CREATIONS</span>
            </button>
            <h1 className="font-serif text-xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              HAUTE CHECKOUT
            </h1>
          </div>

          {/* Step Progress Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-sans font-bold tracking-wider uppercase text-[#737373] bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-black/5 shadow-2xs sm:shadow-none">
            <span className="px-2 py-0.5 bg-[#C08A3E]/10 text-[#C08A3E] rounded-md border border-[#C08A3E]/20">
              1. BAG ({totalQuantity})
            </span>
            <span className="text-[#C08A3E]">→</span>
            <span className="px-2 py-0.5 bg-[#111111] text-white rounded-md font-extrabold shadow-2xs">
              2. SHIPPING & PAYMENT
            </span>
            <span className="hidden sm:inline text-black/30">→</span>
            <span className="hidden sm:inline text-black/40">3. CONFIRMATION</span>
          </div>
        </div>
      </div>

      {/* MOBILE ACCORDION: ORDER SUMMARY TOGGLE (Visible on small screens only) */}
      <div className="lg:hidden max-w-7xl mx-auto mb-5">
        <div className="bg-white border border-black/10 rounded-2xl shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full px-4 py-3.5 bg-[#F8F8FA] flex items-center justify-between text-left transition-colors cursor-pointer border-b border-black/5"
          >
            <div className="flex items-center gap-2 text-xs font-sans font-extrabold text-[#111111]">
              <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
              </svg>
              <span>{showMobileSummary ? 'HIDE ORDER SUMMARY' : 'SHOW ORDER SUMMARY'} ({totalQuantity} ITEMS)</span>
              <svg
                className={`w-4 h-4 text-[#737373] transition-transform duration-300 ${showMobileSummary ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="font-serif text-sm font-extrabold text-[#111111]">${total.toFixed(2)} USD</span>
          </button>

          <AnimatePresence>
            {showMobileSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-4 space-y-4 bg-white"
              >
                {/* Mobile Item List */}
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-2.5 bg-[#F8F8FA] rounded-xl border border-black/5 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-16 object-contain bg-white rounded-lg p-1 border border-black/5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-bold uppercase text-[#111111] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] font-sans text-[#737373] uppercase tracking-wider">
                          SIZE: {item.size?.size || '50 ml'} • QTY: {item.quantity}
                        </p>
                        {item.engraving && (
                          <p className="text-[9px] font-sans text-[#C08A3E] uppercase font-semibold truncate">
                            ENGRAVING: "{item.engraving}"
                          </p>
                        )}
                      </div>
                      <span className="font-serif text-xs font-bold text-[#111111]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mobile Promo Code Input */}
                <form onSubmit={handleApplyDiscount} className="space-y-2 pt-3 border-t border-black/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="PROMO CODE (e.g. LUNE10)"
                      className="flex-1 px-3 py-2.5 bg-[#F4F4F6] border border-black/10 rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      disabled={discountLoading}
                      className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-[10px] font-extrabold tracking-widest uppercase rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50 min-h-[42px]"
                    >
                      APPLY
                    </button>
                  </div>

                  {appliedDiscount && (
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                      <span>PROMO "{appliedDiscount.code}" ({appliedDiscount.percentage}% OFF)</span>
                      <button type="button" onClick={() => setAppliedDiscount(null)} className="text-red-500 hover:underline text-[10px]">REMOVE</button>
                    </div>
                  )}

                  {discountError && (
                    <p className="text-[11px] text-red-500 font-semibold">{discountError}</p>
                  )}
                </form>

                {/* Mobile Breakdown */}
                <div className="space-y-2 pt-3 border-t border-black/10 text-xs font-sans text-[#555555]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#111111]">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedDiscount.percentage}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-[#111111]">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#059669] font-bold">
                    <span>Express Shipping</span>
                    <span>COMPLIMENTARY</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {!isLoggedIn && (
            <div className="bg-white border border-black/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C08A3E]/10 flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm sm:text-base font-extrabold text-[#111111] uppercase">GUEST CHECKOUT</h4>
                    <p className="text-[11px] text-[#737373] font-medium mt-0.5 leading-relaxed">
                      No account needed — simply fill in your details below. Already have an account?
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="w-full sm:w-auto px-5 py-2.5 border border-[#C08A3E]/30 text-[#C08A3E] hover:bg-[#C08A3E] hover:text-white rounded-full font-bold text-[10px] tracking-widest uppercase transition-all cursor-pointer shrink-0 text-center"
                >
                  SIGN IN FOR FASTER CHECKOUT
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#F8F8FA] rounded-xl border border-black/5">
                <svg className="w-3.5 h-3.5 text-[#059669] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[10px] font-semibold text-[#555555]">Your information is protected with 256-bit encryption. We never share your data.</span>
              </div>
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

          <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8">
            {/* 1. Contact Details */}
            <div className="bg-white border border-black/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between border-b border-black/10 pb-3.5 sm:pb-4">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase block">
                    STEP 1
                  </span>
                  <h3 className="font-serif text-base sm:text-xl font-extrabold uppercase text-[#111111]">
                    CONTACT INFORMATION
                  </h3>
                </div>
                <span className="text-[10px] sm:text-xs text-[#737373] font-semibold">* REQUIRED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    value={fullName}
                    onBlur={() => handleBlur('fullName')}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (touched.fullName) {
                        setFieldErrors(prev => ({ ...prev, fullName: validateField('fullName', e.target.value) }));
                      }
                    }}
                    placeholder="e.g. Rohan Sharma"
                    className={`w-full px-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:bg-white transition-colors min-h-[46px] ${
                      touched.fullName && fieldErrors.fullName
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : touched.fullName && !fieldErrors.fullName && fullName
                        ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                        : 'border-black/10 focus:border-black'
                    }`}
                  />
                  {touched.fullName && fieldErrors.fullName && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{fieldErrors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    value={email}
                    onBlur={() => handleBlur('email')}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) {
                        setFieldErrors(prev => ({ ...prev, email: validateField('email', e.target.value) }));
                      }
                    }}
                    placeholder="rohan@example.com"
                    className={`w-full px-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:bg-white transition-colors min-h-[46px] ${
                      touched.email && fieldErrors.email
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : touched.email && !fieldErrors.email && email
                        ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                        : 'border-black/10 focus:border-black'
                    }`}
                  />
                  {touched.email && fieldErrors.email && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Email — Guest Only */}
              {!isLoggedIn && (
                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                    CONFIRM EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    value={confirmEmail}
                    onBlur={() => handleBlur('confirmEmail')}
                    onChange={(e) => {
                      setConfirmEmail(e.target.value);
                      if (touched.confirmEmail) {
                        setFieldErrors(prev => ({ ...prev, confirmEmail: validateField('confirmEmail', e.target.value, { email }) }));
                      }
                    }}
                    placeholder="Re-enter your email address"
                    className={`w-full px-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:bg-white transition-colors min-h-[46px] ${
                      touched.confirmEmail && fieldErrors.confirmEmail
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : touched.confirmEmail && !fieldErrors.confirmEmail && confirmEmail
                        ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                        : 'border-black/10 focus:border-black'
                    }`}
                  />
                  {touched.confirmEmail && fieldErrors.confirmEmail && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{fieldErrors.confirmEmail}</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                  PHONE NUMBER * (FOR COURIER UPDATES)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[#737373]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    value={phone}
                    onBlur={() => handleBlur('phone')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d+ ]/g, '').slice(0, 15);
                      setPhone(val);
                      if (touched.phone) {
                        setFieldErrors(prev => ({ ...prev, phone: validateField('phone', val) }));
                      }
                    }}
                    placeholder="+91 98765 43210 or 9876543210"
                    className={`w-full pl-11 pr-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:bg-white transition-colors min-h-[46px] ${
                      touched.phone && fieldErrors.phone
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : touched.phone && !fieldErrors.phone && phone
                        ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                        : 'border-black/10 focus:border-black'
                    }`}
                  />
                </div>
                {touched.phone && fieldErrors.phone && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white border border-black/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs space-y-4 sm:space-y-5">
              <div className="border-b border-black/10 pb-3.5 sm:pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase block">
                    STEP 2
                  </span>
                  <h3 className="font-serif text-base sm:text-xl font-extrabold uppercase text-[#111111]">
                    SHIPPING ADDRESS
                  </h3>
                </div>
                <span className="text-[9.5px] font-extrabold tracking-widest uppercase px-2.5 py-1 bg-amber-500/10 text-amber-800 border border-amber-500/20 rounded-full">
                  🇮🇳 INDIA ONLY
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                  STREET ADDRESS *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="address-line1"
                  enterKeyHint="next"
                  value={street}
                  onBlur={() => handleBlur('street')}
                  onChange={(e) => {
                    setStreet(e.target.value);
                    if (touched.street) {
                      setFieldErrors(prev => ({ ...prev, street: validateField('street', e.target.value) }));
                    }
                  }}
                  placeholder="Flat/House No., Building Name, Street & Landmark"
                  className={`w-full px-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:bg-white transition-colors min-h-[46px] ${
                    touched.street && fieldErrors.street
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : touched.street && !fieldErrors.street && street
                      ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                      : 'border-black/10 focus:border-black'
                  }`}
                />
                {touched.street && fieldErrors.street && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{fieldErrors.street}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                    CITY *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    value={city}
                    onBlur={() => handleBlur('city')}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (touched.city) {
                        setFieldErrors(prev => ({ ...prev, city: validateField('city', e.target.value) }));
                      }
                    }}
                    placeholder="e.g. Mumbai / Delhi"
                    className={`w-full px-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:bg-white transition-colors min-h-[46px] ${
                      touched.city && fieldErrors.city
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : touched.city && !fieldErrors.city && city
                        ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                        : 'border-black/10 focus:border-black'
                    }`}
                  />
                  {touched.city && fieldErrors.city && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{fieldErrors.city}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                    STATE / UT *
                  </label>
                  <select
                    required
                    value={state}
                    onBlur={() => handleBlur('state')}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (touched.state) {
                        setFieldErrors(prev => ({ ...prev, state: validateField('state', e.target.value) }));
                      }
                    }}
                    className={`w-full px-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:bg-white transition-colors min-h-[46px] cursor-pointer ${
                      touched.state && fieldErrors.state
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : touched.state && !fieldErrors.state && state
                        ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                        : 'border-black/10 focus:border-black'
                    }`}
                  >
                    <option value="">Select State / UT</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {touched.state && fieldErrors.state && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{fieldErrors.state}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                    POSTAL PIN CODE * (6 DIGITS)
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    enterKeyHint="done"
                    maxLength={6}
                    value={postalCode}
                    onBlur={() => handleBlur('postalCode')}
                    onChange={(e) => {
                      const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPostalCode(cleanDigits);
                      if (touched.postalCode) {
                        setFieldErrors(prev => ({ ...prev, postalCode: validateField('postalCode', cleanDigits) }));
                      }
                    }}
                    placeholder="e.g. 110001"
                    className={`w-full px-4 py-3 bg-[#F4F4F6] border rounded-xl text-base sm:text-xs font-mono font-bold text-[#111111] tracking-wider focus:outline-none focus:bg-white transition-colors min-h-[46px] ${
                      touched.postalCode && fieldErrors.postalCode
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : touched.postalCode && !fieldErrors.postalCode && postalCode
                        ? 'border-emerald-500/50 bg-emerald-50/10 focus:border-black'
                        : 'border-black/10 focus:border-black'
                    }`}
                  />
                  {touched.postalCode && fieldErrors.postalCode && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-500 flex items-center gap-1.5 font-sans">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{fieldErrors.postalCode}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                  DELIVERY COUNTRY *
                </label>
                <div className="relative">
                  <div className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-base sm:text-xs font-sans font-bold text-[#111111] flex items-center justify-between min-h-[46px] select-none">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇮🇳</span>
                      <span>India</span>
                    </div>
                    <span className="text-[9.5px] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-[#C08A3E]/10 text-[#C08A3E] border border-[#C08A3E]/20 rounded-md">
                      EXCLUSIVE DOMESTIC REGION
                    </span>
                  </div>
                </div>
              </div>

              {/* Save to profile — only for authenticated users */}
              {isLoggedIn && (
                <div className="pt-2 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="saveProfileCheck"
                    checked={saveToProfile}
                    onChange={(e) => setSaveToProfile(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-black/20 text-[#111111] focus:ring-black cursor-pointer shrink-0"
                  />
                  <label htmlFor="saveProfileCheck" className="text-xs text-[#111111] font-semibold cursor-pointer select-none leading-tight">
                    Save shipping details to my profile for future creations
                  </label>
                </div>
              )}
            </div>

            {/* Order Notes / Special Instructions */}
            <div className="bg-white border border-black/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs space-y-4 sm:space-y-5">
              <div className="border-b border-black/10 pb-3.5 sm:pb-4">
                <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase block">
                  OPTIONAL
                </span>
                <h3 className="font-serif text-base sm:text-xl font-extrabold uppercase text-[#111111]">
                  ORDER NOTES
                </h3>
              </div>
              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-[0.18em] text-[#111111] uppercase mb-1.5">
                  SPECIAL INSTRUCTIONS OR DELIVERY NOTES
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please leave at the reception desk, Ring doorbell twice, Gift wrap with gold ribbon..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-base sm:text-xs font-sans text-[#111111] focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
                />
                <p className="mt-1 text-[9px] text-[#999999] font-medium text-right">{orderNotes.length}/500</p>
              </div>
            </div>

            {/* 3. Payment Options (Razorpay Gateway Integration) */}
            <div className="bg-white border border-black/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs space-y-4 sm:space-y-5">
              <div className="border-b border-black/10 pb-3.5 sm:pb-4 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase block">
                    STEP 3
                  </span>
                  <h3 className="font-serif text-base sm:text-xl font-extrabold uppercase text-[#111111]">
                    PAYMENT METHOD
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#072654]/10 text-[#072654] border border-[#072654]/20 rounded-full text-[8.5px] sm:text-[9px] font-extrabold tracking-wider uppercase shrink-0">
                  <svg className="w-3 h-3 text-[#0284C7]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
                  </svg>
                  RAZORPAY SECURE
                </span>
              </div>

              {/* Razorpay Gateway Card Container */}
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
                            RAZORPAY EXPRESS GATEWAY
                          </span>
                          <span className="px-2 py-0.5 bg-[#C08A3E]/15 text-[#9A6B29] font-sans text-[9px] font-black tracking-wider uppercase rounded">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#555555] font-medium mt-1 leading-relaxed">
                          Pay securely via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking & Wallets.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Icons Grid */}
                  <div className="mt-4 pt-3 border-t border-black/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
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

                <div className="p-3 bg-[#F4F4F6] rounded-xl text-center text-[10.5px] text-[#666666] font-medium leading-relaxed border border-black/5 flex items-center justify-center gap-2">
                  <span>🔒</span>
                  <span>Encrypted with 256-bit SSL security via Razorpay Gateway. Zero banking data is stored.</span>
                </div>
              </div>
            </div>

            {/* Desktop Place Order Button (Hidden on Mobile, replaced by sticky bar) */}
            <div className="hidden sm:block">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-full transition-all cursor-pointer shadow-xl active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3 min-h-[52px]"
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
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary (Desktop Sticky Sidebar) */}
        <div className="hidden lg:block lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-black/10 pb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-extrabold uppercase text-[#111111]">
                ORDER SUMMARY ({totalQuantity})
              </h3>
              <span className="text-[10px] font-sans font-extrabold tracking-widest uppercase text-[#C08A3E]">
                HAUTE PARFUMERIE
              </span>
            </div>

            {/* Desktop Item List */}
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

            {/* Desktop Promo Code Input */}
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
                  className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-[10px] font-extrabold tracking-widest uppercase rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50 min-h-[42px]"
                >
                  APPLY
                </button>
              </div>

              {appliedDiscount && (
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                  <span>PROMO CODE "{appliedDiscount.code}" APPLIED ({appliedDiscount.percentage}% OFF)</span>
                  <button type="button" onClick={() => setAppliedDiscount(null)} className="text-red-500 hover:underline text-[10px]">REMOVE</button>
                </div>
              )}

              {discountError && (
                <p className="text-[11px] text-red-500 font-semibold">{discountError}</p>
              )}
            </form>

            {/* Desktop Cost Breakdown */}
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

      {/* MOBILE STICKY FLOATING BOTTOM ACTION BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-xl border-t border-black/10 shadow-[0_-10px_30px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#111111] active:bg-black text-white font-sans font-extrabold text-xs tracking-wider uppercase rounded-full shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
        >
          {isSubmitting ? (
            <span>CONNECTING TO RAZORPAY...</span>
          ) : (
            <>
              <span>PAY NOW • ${total.toFixed(2)} USD</span>
              <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
