import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder, validateDiscountCode, fetchUserProfile } from '../services/api';

// 50 US States + DC + Territories
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
  { code: 'GU', name: 'Guam' }
];

// US Phone Number Formatter: (XXX) XXX-XXXX
export const formatUSPhoneNumber = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export default function Checkout({ cartItems: propsCartItems, setCartItems, onOpenAccount }) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cartItems: contextCartItems, clearCart } = useCart();
  const cartItems = (propsCartItems && propsCartItems.length > 0) ? propsCartItems : contextCartItems;

  // Profile data pre-fill
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Customer Contact State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping Address State (USA)
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Payment Gateways (Only Verified Electronic Gateways - No Cash On Delivery)
  // Options: 'paypal', 'card_gateway', 'apple_pay', 'google_pay'
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  // Real-time Field Errors
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Mobile Order Summary Accordion
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Discount / Promo Code State
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Financial Calculations (USD)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0;
  const shippingCost = 0; // Complimentary Luxury Shipping
  const estimatedTax = (subtotal - discountAmount) * 0.0825; // 8.25% estimated US tax
  const total = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);
  const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Field Validator specifically for USA
  const validateField = (name, value, allValues = {}) => {
    const currentEmail = allValues.email !== undefined ? allValues.email : email;
    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Full name must be at least 3 characters';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
        return '';
      case 'confirmEmail':
        if (!value || !value.trim()) return 'Please confirm your email address';
        if (value.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) return 'Email addresses do not match';
        return '';
      case 'phone': {
        if (!value || !value.trim()) return 'US phone number is required';
        const cleanDigits = value.replace(/\D/g, '');
        if (cleanDigits.length !== 10) {
          return 'Please enter a valid 10-digit US phone number';
        }
        return '';
      }
      case 'street':
        if (!value || !value.trim()) return 'Street address is required';
        if (value.trim().length < 4) return 'Please enter a valid street address';
        return '';
      case 'city':
        if (!value || !value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City must be at least 2 characters';
        return '';
      case 'state':
        if (!value || !value.trim()) return 'State is required';
        if (value.trim().length < 2) return 'State must be at least 2 characters';
        return '';
      case 'postalCode': {
        if (!value || !value.trim()) return 'US ZIP code is required';
        const cleanZip = value.trim();
        if (!/^\d{5}(-\d{4})?$/.test(cleanZip)) {
          return 'Enter a valid 5-digit US ZIP code (e.g. 90210)';
        }
        return '';
      }
      default:
        return '';
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const valMap = { fullName, email, confirmEmail, phone, street, city, state, postalCode };
    const err = validateField(fieldName, valMap[fieldName], valMap);
    setFieldErrors(prev => ({ ...prev, [fieldName]: err }));
  };

  // Pre-load User Profile if Logged In
  useEffect(() => {
    let isMounted = true;
    if (isLoggedIn) {
      fetchUserProfile().then((p) => {
        if (!isMounted) return;
        if (p) {
          setProfile(p);
          setFullName(p.full_name || user?.user_metadata?.full_name || '');
          setEmail(p.email || user?.email || '');
          if (p.phone) setPhone(formatUSPhoneNumber(p.phone));
          setStreet(p.street_address || '');
          setCity(p.city || '');
          setState(p.state || '');
          setPostalCode(p.postal_code || '');
          setCountry('United States');
        } else if (user) {
          setFullName(user.user_metadata?.full_name || '');
          setEmail(user.email || '');
          if (user.user_metadata?.phone) setPhone(formatUSPhoneNumber(user.user_metadata?.phone));
          setCountry('United States');
        }
        setLoadingProfile(false);
      });
    } else {
      setLoadingProfile(false);
    }
    return () => { isMounted = false; };
  }, [isLoggedIn, user]);

  // Apply Discount Voucher
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
        setDiscountError(res.message || res.error || 'Invalid privilege code.');
      }
    } catch (err) {
      setDiscountError('Unable to validate promo code.');
    } finally {
      setDiscountLoading(false);
    }
  };

  // Submit Order via Selected Gateway
  const handleSubmitOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Your shopping bag is empty.');
      return;
    }

    const allValues = { fullName, email, confirmEmail, phone, street, city, state, postalCode };
    const fieldsToValidate = [
      'fullName',
      'email',
      ...(!isLoggedIn ? ['confirmEmail'] : []),
      'phone',
      'street',
      'city',
      'state',
      'postalCode'
    ];

    const errors = {};
    fieldsToValidate.forEach((field) => {
      const err = validateField(field, allValues[field], allValues);
      if (err) errors[field] = err;
    });

    const allTouched = {};
    fieldsToValidate.forEach((f) => { allTouched[f] = true; });
    setTouched(allTouched);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setFormError(`Please complete required fields: ${firstError}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const fullStreet = apartment.trim() ? `${street.trim()}, ${apartment.trim()}` : street.trim();
      
      const gatewayLabel = 
        paymentMethod === 'paypal' 
          ? 'PayPal Gateway'
          : paymentMethod === 'card_gateway' 
          ? 'Credit / Debit Card (Secure Payment Gateway)'
          : paymentMethod === 'apple_pay' 
          ? 'Apple Pay' 
          : 'Google Pay';

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: String(item.product?.id || item.productId || 'custom'),
          size: item.size?.size || '50 ml',
          quantity: item.quantity,
          unitPrice: item.price,
          engravingText: item.engraving || undefined
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          street: fullStreet,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: 'United States'
        },
        discountCode: appliedDiscount ? appliedDiscount.code : undefined,
        totalAmount: Number(total.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        paymentMethod: gatewayLabel,
        ...(isLoggedIn ? { saveToProfile } : {}),
        ...(!isLoggedIn ? {
          guestEmail: email.trim(),
          guestName: fullName.trim(),
          guestPhone: phone.trim()
        } : {})
      };

      const res = await placeOrder(orderPayload);

      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
      } else {
        setFormError(res.error || 'Payment gateway connection was unsuccessful. Please try again.');
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmation View
  if (completedOrder) {
    const formattedOrderId = completedOrder.id ? String(completedOrder.id).slice(0, 8).toUpperCase() : 'LUNE-US';
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#111111] pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-sm text-center space-y-6"
        >
          <div className="w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <span className="text-[11px] font-sans font-medium tracking-[0.25em] text-neutral-500 uppercase block mb-1">
              MAISON LUNE • ORDER CONFIRMATION
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 tracking-tight">
              Thank You For Your Order
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your payment via <span className="font-semibold text-neutral-900">{completedOrder.payment_method || 'Payment Gateway'}</span> has been confirmed. A receipt has been sent to <span className="font-semibold text-neutral-900">{email}</span>.
            </p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-5 text-left space-y-3 text-xs border border-neutral-200/70">
            <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">Order Number</span>
              <span className="font-mono font-semibold text-neutral-900">#{formattedOrderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Payment Gateway</span>
              <span className="font-semibold text-neutral-900">{completedOrder.payment_method || 'Online Payment Gateway'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-neutral-500 font-medium shrink-0 pt-0.5">Shipping Destination</span>
              <span className="text-neutral-900 font-medium text-right leading-relaxed">
                {fullName}<br />
                {street}{apartment ? `, ${apartment}` : ''}<br />
                {city}, {state} {postalCode}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Contact Phone</span>
              <span className="text-neutral-900 font-medium">{phone}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-neutral-200">
              <span className="text-neutral-900 font-semibold">Total Paid</span>
              <span className="font-serif text-base font-semibold text-neutral-900">
                ${completedOrder.total ? Number(completedOrder.total).toFixed(2) : total.toFixed(2)} USD
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/collection')}
              className="w-full sm:w-auto px-7 py-3 bg-neutral-900 hover:bg-black text-white text-xs font-semibold tracking-wider uppercase rounded-full transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
            {isLoggedIn && (
              <button
                onClick={onOpenAccount}
                className="w-full sm:w-auto px-7 py-3 border border-neutral-300 hover:border-neutral-900 text-neutral-900 text-xs font-semibold tracking-wider uppercase rounded-full transition-all cursor-pointer"
              >
                View Account Orders
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 pt-20 sm:pt-28 pb-28 px-4 sm:px-6 lg:px-12 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 pb-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Shopping</span>
            </button>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-neutral-900">
              Checkout
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>Bag</span>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">Information & Payment</span>
            <span>/</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden max-w-6xl mx-auto mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setShowMobileSummary(!showMobileSummary)}
            className="w-full px-4 py-3 bg-neutral-50 flex items-center justify-between text-left transition-colors cursor-pointer border-b border-neutral-200"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-800">
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
              </svg>
              <span>{showMobileSummary ? 'Hide Order Summary' : 'Show Order Summary'} ({totalQuantity})</span>
              <svg
                className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${showMobileSummary ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="font-serif text-sm font-semibold text-neutral-900">${total.toFixed(2)} USD</span>
          </button>

          <AnimatePresence>
            {showMobileSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-4 bg-white"
              >
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-2 rounded-lg bg-neutral-50 border border-neutral-200/60 items-center">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-12 h-14 object-contain bg-white rounded p-1 border border-neutral-200/80 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-medium text-neutral-900 truncate">
                          {item.product?.name}
                        </h4>
                        <p className="text-[10px] text-neutral-500">
                          {item.size?.size || '50 ml'} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-serif text-xs font-semibold text-neutral-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleApplyDiscount} className="space-y-2 pt-2 border-t border-neutral-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Discount Code"
                      className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs uppercase focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="submit"
                      disabled={discountLoading}
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                <div className="space-y-1.5 pt-2 border-t border-neutral-200 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-neutral-900 font-medium">
                      <span>Discount ({appliedDiscount.percentage}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-neutral-900">Complimentary</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8.25%)</span>
                    <span className="font-medium text-neutral-900">${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-700 flex items-center gap-2.5">
              <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* SECTION 1: CONTACT INFORMATION */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-7 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
                  1. Contact Information
                </h2>
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={onOpenAccount}
                    className="text-xs text-neutral-600 hover:text-neutral-900 underline underline-offset-2 cursor-pointer"
                  >
                    Already have an account? Sign In
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Full Name <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onBlur={() => handleBlur('fullName')}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (touched.fullName) {
                        setFieldErrors(prev => ({ ...prev, fullName: validateField('fullName', e.target.value) }));
                      }
                    }}
                    placeholder="e.g. Jane Doe"
                    className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                      touched.fullName && fieldErrors.fullName
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {touched.fullName && fieldErrors.fullName && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Email Address <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onBlur={() => handleBlur('email')}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) {
                        setFieldErrors(prev => ({ ...prev, email: validateField('email', e.target.value) }));
                      }
                    }}
                    placeholder="jane@example.com"
                    className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                      touched.email && fieldErrors.email
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {touched.email && fieldErrors.email && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {!isLoggedIn && (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Confirm Email Address <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={confirmEmail}
                    onBlur={() => handleBlur('confirmEmail')}
                    onChange={(e) => {
                      setConfirmEmail(e.target.value);
                      if (touched.confirmEmail) {
                        setFieldErrors(prev => ({ ...prev, confirmEmail: validateField('confirmEmail', e.target.value, { email }) }));
                      }
                    }}
                    placeholder="Confirm your email for order updates"
                    className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                      touched.confirmEmail && fieldErrors.confirmEmail
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {touched.confirmEmail && fieldErrors.confirmEmail && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.confirmEmail}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Phone Number <span className="text-neutral-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onBlur={() => handleBlur('phone')}
                  onChange={(e) => {
                    const formatted = formatUSPhoneNumber(e.target.value);
                    setPhone(formatted);
                    if (touched.phone) {
                      setFieldErrors(prev => ({ ...prev, phone: validateField('phone', formatted) }));
                    }
                  }}
                  placeholder="(555) 000-0000"
                  maxLength={14}
                  className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                    touched.phone && fieldErrors.phone
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                />
                {touched.phone && fieldErrors.phone && (
                  <p className="mt-1 text-[11px] text-red-600">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            {/* SECTION 2: SHIPPING ADDRESS */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-7 space-y-4 shadow-2xs">
              <div className="pb-3 border-b border-neutral-200">
                <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
                  2. Shipping Address
                </h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Street Address <span className="text-neutral-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoComplete="address-line1"
                  value={street}
                  onBlur={() => handleBlur('street')}
                  onChange={(e) => {
                    setStreet(e.target.value);
                    if (touched.street) {
                      setFieldErrors(prev => ({ ...prev, street: validateField('street', e.target.value) }));
                    }
                  }}
                  placeholder="e.g. 123 Main Street"
                  className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                    touched.street && fieldErrors.street
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-neutral-300 focus:border-neutral-900'
                  }`}
                />
                {touched.street && fieldErrors.street && (
                  <p className="mt-1 text-[11px] text-red-600">{fieldErrors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Apartment, Suite, Unit, etc. <span className="text-neutral-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  autoComplete="address-line2"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="e.g. Apt 4B, Suite 200"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    City <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-level2"
                    value={city}
                    onBlur={() => handleBlur('city')}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (touched.city) {
                        setFieldErrors(prev => ({ ...prev, city: validateField('city', e.target.value) }));
                      }
                    }}
                    placeholder="City"
                    className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                      touched.city && fieldErrors.city
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {touched.city && fieldErrors.city && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    State <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="address-level1"
                    value={state}
                    onBlur={() => handleBlur('state')}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (touched.state) {
                        setFieldErrors(prev => ({ ...prev, state: validateField('state', e.target.value) }));
                      }
                    }}
                    placeholder="e.g. California or CA"
                    className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                      touched.state && fieldErrors.state
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {touched.state && fieldErrors.state && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    ZIP Code <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={10}
                    value={postalCode}
                    onBlur={() => handleBlur('postalCode')}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d-]/g, '').slice(0, 10);
                      setPostalCode(clean);
                      if (touched.postalCode) {
                        setFieldErrors(prev => ({ ...prev, postalCode: validateField('postalCode', clean) }));
                      }
                    }}
                    placeholder="90210"
                    className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-lg text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:bg-white transition-colors ${
                      touched.postalCode && fieldErrors.postalCode
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {touched.postalCode && fieldErrors.postalCode && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.postalCode}</p>
                  )}
                </div>
              </div>

              {isLoggedIn && (
                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveAddressCheck"
                    checked={saveToProfile}
                    onChange={(e) => setSaveToProfile(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <label htmlFor="saveAddressCheck" className="text-xs text-neutral-600 cursor-pointer select-none">
                    Save this address to your account profile
                  </label>
                </div>
              )}
            </div>

            {/* SECTION 3: PAYMENT GATEWAY (ONLINE PAYMENT GATEWAYS ONLY - NO COD) */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-7 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
                    3. Payment Method
                  </h2>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Select your preferred electronic payment gateway. All transactions are securely encrypted.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                  <span>🔒 256-Bit SSL</span>
                </div>
              </div>

              {/* Gateway Selection Options */}
              <div className="space-y-3">
                {/* 1. PayPal Gateway */}
                <div
                  className={`border rounded-xl transition-all overflow-hidden ${
                    paymentMethod === 'paypal'
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('paypal')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_gateway"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-semibold text-neutral-900 block">
                          PayPal Gateway
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Pay with PayPal balance, Pay in 4, or your linked cards
                        </span>
                      </div>
                    </div>
                    <span className="text-base font-black italic tracking-tight text-[#003087]">
                      PayPal
                    </span>
                  </label>

                  {paymentMethod === 'paypal' && (
                    <div className="p-4 pt-0 border-t border-neutral-100 bg-white space-y-3">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        You will be securely redirected to the official PayPal gateway to authorize your payment.
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span className="font-black italic text-sm">PayPal</span>
                        <span>Pay Now (${total.toFixed(2)} USD)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Credit or Debit Card via Secure Gateway */}
                <div
                  className={`border rounded-xl transition-all overflow-hidden ${
                    paymentMethod === 'card_gateway'
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('card_gateway')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_gateway"
                        checked={paymentMethod === 'card_gateway'}
                        onChange={() => setPaymentMethod('card_gateway')}
                        className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-semibold text-neutral-900 block">
                          Credit / Debit Card Gateway
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Encrypted card processing via verified payment gateway
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">VISA</span>
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">MC</span>
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">AMEX</span>
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded">DISC</span>
                    </div>
                  </label>

                  {paymentMethod === 'card_gateway' && (
                    <div className="p-4 pt-0 border-t border-neutral-100 bg-white space-y-3">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        After clicking below, our secure PCI-DSS certified gateway will handle your card payment safely without exposing card details.
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <span>🔒 Pay with Card via Gateway (${total.toFixed(2)} USD)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Apple Pay Gateway */}
                <div
                  className={`border rounded-xl transition-all overflow-hidden ${
                    paymentMethod === 'apple_pay'
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('apple_pay')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_gateway"
                        checked={paymentMethod === 'apple_pay'}
                        onChange={() => setPaymentMethod('apple_pay')}
                        className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-semibold text-neutral-900 block">
                          Apple Pay
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          One-touch biometric authorization with Touch ID / Face ID
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-black text-white px-2.5 py-1 rounded-md text-xs">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.19-9.35-11.05-20.12-14.59-32.3-3.53-12.18-5.3-23.71-5.3-34.58 0-14.13 3.48-26.04 10.45-35.73 6.96-9.69 15.89-14.65 26.79-14.88 4.89 0 10.4 1.34 16.53 4.02 6.13 2.68 10.14 4.08 12.04 4.2 1.68-.22 5.86-1.68 12.54-4.38 6.68-2.7 12.07-3.9 16.16-3.62 12.55.78 22.42 5.63 29.62 14.55-10.96 6.64-16.33 15.65-16.11 27.04.22 8.94 3.73 16.54 10.53 22.81 6.8 6.27 15.03 9.87 24.69 10.81-2.02 6.04-4.48 12.1-7.39 18.18zm-29.43-108.38c0 7.42-2.74 14.28-8.22 20.58-5.48 6.3-12.1 10.14-19.86 11.52-.22-1.34-.34-2.57-.34-3.69 0-7.31 2.91-14.35 8.73-21.12 5.82-6.77 12.44-10.66 19.86-11.67.11 1.45.17 2.9.17 4.38z"/>
                      </svg>
                      <span className="font-semibold text-[11px]">Pay</span>
                    </div>
                  </label>

                  {paymentMethod === 'apple_pay' && (
                    <div className="p-4 pt-0 border-t border-neutral-100 bg-white space-y-3">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Authorize instantly with your Apple device.
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4 fill-current mb-0.5" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.19-9.35-11.05-20.12-14.59-32.3-3.53-12.18-5.3-23.71-5.3-34.58 0-14.13 3.48-26.04 10.45-35.73 6.96-9.69 15.89-14.65 26.79-14.88 4.89 0 10.4 1.34 16.53 4.02 6.13 2.68 10.14 4.08 12.04 4.2 1.68-.22 5.86-1.68 12.54-4.38 6.68-2.7 12.07-3.9 16.16-3.62 12.55.78 22.42 5.63 29.62 14.55-10.96 6.64-16.33 15.65-16.11 27.04.22 8.94 3.73 16.54 10.53 22.81 6.8 6.27 15.03 9.87 24.69 10.81-2.02 6.04-4.48 12.1-7.39 18.18zm-29.43-108.38c0 7.42-2.74 14.28-8.22 20.58-5.48 6.3-12.1 10.14-19.86 11.52-.22-1.34-.34-2.57-.34-3.69 0-7.31 2.91-14.35 8.73-21.12 5.82-6.77 12.44-10.66 19.86-11.67.11 1.45.17 2.9.17 4.38z"/>
                        </svg>
                        <span>Pay with Apple Pay (${total.toFixed(2)} USD)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Google Pay Gateway */}
                <div
                  className={`border rounded-xl transition-all overflow-hidden ${
                    paymentMethod === 'google_pay'
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('google_pay')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_gateway"
                        checked={paymentMethod === 'google_pay'}
                        onChange={() => setPaymentMethod('google_pay')}
                        className="w-4 h-4 text-neutral-900 border-neutral-300 focus:ring-neutral-900 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-semibold text-neutral-900 block">
                          Google Pay
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Fast, simple checkout with your Google account
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 border border-neutral-200 px-2.5 py-1 rounded-md text-xs bg-white">
                      <span className="font-bold text-[#4285F4]">G</span>
                      <span className="font-semibold text-neutral-900 text-[11px]">Pay</span>
                    </div>
                  </label>

                  {paymentMethod === 'google_pay' && (
                    <div className="p-4 pt-0 border-t border-neutral-100 bg-white space-y-3">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Pay with your saved cards in your Google Account.
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="font-bold text-[#4285F4]">G</span>
                        <span>Pay with Google Pay (${total.toFixed(2)} USD)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Order Action Button */}
            <div className="hidden sm:block pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neutral-900 hover:bg-black text-white text-xs font-semibold tracking-wider uppercase rounded-full transition-all cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Connecting to Gateway...</span>
                ) : paymentMethod === 'paypal' ? (
                  <span>Proceed to PayPal (${total.toFixed(2)} USD)</span>
                ) : paymentMethod === 'card_gateway' ? (
                  <span>Proceed to Card Gateway (${total.toFixed(2)} USD)</span>
                ) : paymentMethod === 'apple_pay' ? (
                  <span>Authorize with Apple Pay (${total.toFixed(2)} USD)</span>
                ) : (
                  <span>Authorize with Google Pay (${total.toFixed(2)} USD)</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Desktop Sticky Order Summary */}
        <div className="hidden lg:block lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="pb-3.5 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-serif text-base font-normal tracking-tight text-neutral-900">
                Order Summary
              </h3>
              <span className="text-xs text-neutral-500 font-medium">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Cart Line Items */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">Your bag is empty.</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 p-2.5 rounded-xl bg-neutral-50/70 border border-neutral-200/60 items-center">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-12 h-14 object-contain bg-white rounded-lg p-1 border border-neutral-200/80 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs font-medium text-neutral-900 truncate">
                        {item.product?.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        {item.size?.size || '50 ml'} • Qty: {item.quantity}
                      </p>
                      {item.engraving && (
                        <p className="text-[10px] text-[#C08A3E] font-medium truncate mt-0.5">
                          Engraved: "{item.engraving}"
                        </p>
                      )}
                    </div>
                    <span className="font-serif text-xs font-semibold text-neutral-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Voucher / Promo Code Form */}
            <form onSubmit={handleApplyDiscount} className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Discount Code"
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs uppercase focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  disabled={discountLoading}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  Apply
                </button>
              </div>

              {appliedDiscount && (
                <div className="p-2 bg-neutral-100 rounded-lg text-xs text-neutral-800 flex items-center justify-between">
                  <span>Code "{appliedDiscount.code}" Applied ({appliedDiscount.percentage}% off)</span>
                  <button type="button" onClick={() => setAppliedDiscount(null)} className="text-neutral-500 hover:text-black font-semibold text-[11px] cursor-pointer">Remove</button>
                </div>
              )}

              {discountError && (
                <p className="text-[11px] text-red-600">{discountError}</p>
              )}
            </form>

            {/* Financial Summary */}
            <div className="space-y-2 pt-3 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-neutral-900 font-medium">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-neutral-900">Complimentary</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated US Sales Tax (8.25%)</span>
                <span className="font-medium text-neutral-900">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total Due</span>
                <span className="font-serif text-lg">${total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="pt-3 border-t border-neutral-200 space-y-1.5 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Complimentary 2ml sample included with every flacon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Insured US domestic delivery with tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-lg">
        <button
          type="button"
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-neutral-900 active:bg-black text-white text-xs font-semibold tracking-wider uppercase rounded-full shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : paymentMethod === 'paypal' ? (
            <span>PayPal Checkout • ${total.toFixed(2)} USD</span>
          ) : paymentMethod === 'card_gateway' ? (
            <span>Card Gateway • ${total.toFixed(2)} USD</span>
          ) : (
            <span>Authorize Payment • ${total.toFixed(2)} USD</span>
          )}
        </button>
      </div>
    </div>
  );
}
