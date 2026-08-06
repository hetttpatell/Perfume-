import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchUserOrders, fetchUserWishlist, toggleWishlistItem, fetchUserProfile, updateUserProfile } from '../services/api';

function OrderStageTracker({ currentStatus }) {
  const normalized = (currentStatus || 'ordered').toLowerCase();
  
  let currentStageIndex = 0; // default 0: Ordered
  if (normalized === 'dispatched' || normalized === 'shipped') currentStageIndex = 1;
  else if (normalized === 'out_for_delivery' || normalized === 'out of delivery') currentStageIndex = 2;
  else if (normalized === 'delivered' || normalized === 'received' || normalized === 'completed') currentStageIndex = 3;

  const stages = [
    { key: 'ordered', title: 'Ordered', stepNum: '01', subtitle: 'Order Placed' },
    { key: 'dispatched', title: 'Dispatched', stepNum: '02', subtitle: 'In Transit' },
    { key: 'out_for_delivery', title: 'Out of Delivery', stepNum: '03', subtitle: 'With Courier' },
    { key: 'received', title: 'Delivered', stepNum: '04', subtitle: 'Hand-Delivered' }
  ];

  return (
    <div className="pt-3 pb-2 border-t border-b border-black/10 my-3.5 space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-sans font-extrabold uppercase tracking-widest text-[#555555]">
          LIVE ORDER STAGE
        </span>
        <span className="px-3 py-1 bg-[#111111] text-white font-sans font-extrabold text-[9px] tracking-[0.2em] uppercase rounded-full shadow-2xs inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          STAGE: {stages[currentStageIndex].title.toUpperCase()}
        </span>
      </div>

      {/* Stepper Timeline Bar */}
      <div className="relative flex items-center justify-between px-1">
        {/* Connecting Background Line */}
        <div className="absolute left-[12%] right-[12%] top-[14px] h-[2.5px] bg-black/10 z-0" />
        {/* Connecting Active Line */}
        <div 
          className="absolute left-[12%] top-[14px] h-[2.5px] bg-[#111111] transition-all duration-500 z-0"
          style={{ width: `${(currentStageIndex / 3) * 76}%` }}
        />

        {stages.map((stg, idx) => {
          const isDone = idx <= currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div key={stg.key} className="flex flex-col items-center z-10 text-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[9.5px] font-sans font-black tracking-tight transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#111111] text-white ring-4 ring-[#111111]/20 scale-110 shadow-md'
                    : isDone
                    ? 'bg-[#111111] text-white'
                    : 'bg-white border-2 border-black/20 text-black/30'
                }`}
              >
                {stg.stepNum}
              </div>
              <span className={`text-[8.5px] font-sans font-extrabold uppercase tracking-wider mt-2 ${isDone ? 'text-[#111111]' : 'text-black/30'}`}>
                {stg.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AccountModal({ isOpen, onClose, onOpenCart, onOpenAdmin, initialTab = 'orders' }) {
  const { isLoggedIn, user, login, register, logout, authRequiredNotice, setAuthRequiredNotice } = useAuth();
  const { addItemToCart } = useCart();
  const navigate = useNavigate();
  const [dbProfile, setDbProfile] = useState(null);

  const isAdmin = 
    user?.role === 'admin' || 
    user?.profile?.role === 'admin' || 
    dbProfile?.role === 'admin' || 
    user?.user_metadata?.role === 'admin' || 
    user?.email?.toLowerCase().includes('admin') ||
    user?.email === 'hetpatel140505@gmail.com';

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState(isLoggedIn ? initialTab : 'auth');

  useEffect(() => {
    if (isOpen && isLoggedIn && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, isLoggedIn, initialTab]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPostalCode, setEditPostalCode] = useState('');
  const [editCountry, setEditCountry] = useState('France');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Live Customer Data from Database
  const [liveOrders, setLiveOrders] = useState([]);
  const [liveWishlist, setLiveWishlist] = useState([]);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchUserOrders().then(setLiveOrders);
      fetchUserWishlist().then(setLiveWishlist);
      fetchUserProfile().then(p => {
        if (p) {
          setDbProfile(p);
          setEditFullName(p.full_name || user?.user_metadata?.full_name || '');
          setEditPhone(p.phone || user?.user_metadata?.phone || '');
          setEditStreet(p.street_address || user?.user_metadata?.street_address || '');
          setEditCity(p.city || user?.user_metadata?.city || '');
          setEditState(p.state || user?.user_metadata?.state || '');
          setEditPostalCode(p.postal_code || user?.user_metadata?.postal_code || '');
          setEditCountry(p.country || user?.user_metadata?.country || 'France');
        }
      });
    }
  }, [isOpen, isLoggedIn, user]);

  const handleSaveProfileDetails = async (e) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');
    setProfileSaving(true);

    try {
      const res = await updateUserProfile({
        fullName: editFullName,
        phone: editPhone,
        streetAddress: editStreet,
        city: editCity,
        state: editState,
        postalCode: editPostalCode,
        country: editCountry
      });

      if (res.success && res.profile) {
        setDbProfile(res.profile);
        setProfileSuccessMsg('Profile & delivery details updated successfully!');
        setIsEditingProfile(false);
      } else {
        setProfileErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileErrorMsg(err.message || 'Error updating profile.');
    } finally {
      setProfileSaving(false);
    }
  };


  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0].toUpperCase() || 'MAISON GUEST';
  const displayInitial = displayName.charAt(0) || 'L';

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setVerificationMessage('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await login({ email, password });
        if (!res.success) {
          setErrorMessage(res.error || 'Invalid credentials');
        } else {
          setActiveTab('orders');
        }
      } else {
        const res = await register({ email, password, fullName });
        if (!res.success) {
          setErrorMessage(res.error || 'Registration failed');
        } else {
          setVerificationMessage(res.message || 'Registration successful! Please check your email inbox to verify your account.');
          setAuthMode('login');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    await toggleWishlistItem(productId, true);
    setLiveWishlist(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Glassmorphic Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
          />

          {/* Right-Side Luxury Slide-Over Account Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[450px] md:w-[470px] h-full bg-white text-[#111111] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-black/10 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bright Clean Light Header */}
            <div className="bg-[#F4F4F6] border-b border-black/10 p-6 sm:p-7 relative shrink-0">
              {/* Close Button */}
              <button
                onClick={() => {
                  setAuthRequiredNotice('');
                  onClose();
                }}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-black/10 transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95 shadow-2xs"
                aria-label="Close Account Panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span className="inline-block px-3.5 py-1 bg-white border border-black/10 rounded-full text-[9.5px] font-sans font-bold tracking-[0.25em] text-[#555555] uppercase mb-4">
                {isLoggedIn ? 'MY ACCOUNT' : 'AUTHENTICATION REQUIRED'}
              </span>

              {/* User Profile Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#111111] text-white font-serif font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm border border-black/10">
                  {displayInitial}
                </div>

                <div>
                  <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#111111] tracking-tight uppercase leading-snug">
                    {isLoggedIn ? displayName : 'WELCOME TO LUNE'}
                  </h3>
                  <p className="font-sans text-[11px] text-[#555555] font-semibold">
                    {isLoggedIn ? user?.email : 'Sign in or register to manage your bag & wishlist'}
                  </p>
                </div>
              </div>
            </div>

            {/* Auth Required Interception Notice Banner */}
            {authRequiredNotice && !isLoggedIn && (
              <div className="bg-[#FEF3C7] border-b border-[#F59E0B]/30 px-6 py-3 text-xs font-sans text-[#92400E] font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D97706] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{authRequiredNotice}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            {isLoggedIn ? (
              <div className="flex border-b border-black/10 bg-white px-4 sm:px-6 overflow-x-auto scrollbar-none shrink-0">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-3.5 px-4 text-[10.5px] font-sans font-extrabold tracking-[0.18em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                    activeTab === 'orders' ? 'text-[#111111]' : 'text-[#737373] hover:text-[#111111]'
                  }`}
                >
                  ORDERS ({liveOrders.length})
                  {activeTab === 'orders' && (
                    <motion.span layoutId="accountDrawerTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111111]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`py-3.5 px-4 text-[10.5px] font-sans font-extrabold tracking-[0.18em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                    activeTab === 'saved' ? 'text-[#111111]' : 'text-[#737373] hover:text-[#111111]'
                  }`}
                >
                  WISHLIST ({liveWishlist.length})
                  {activeTab === 'saved' && (
                    <motion.span layoutId="accountDrawerTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111111]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-3.5 px-4 text-[10.5px] font-sans font-extrabold tracking-[0.18em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                    activeTab === 'profile' ? 'text-[#111111]' : 'text-[#737373] hover:text-[#111111]'
                  }`}
                >
                  PROFILE
                  {activeTab === 'profile' && (
                    <motion.span layoutId="accountDrawerTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111111]" />
                  )}
                </button>
              </div>
            ) : (
              <div className="flex border-b border-black/10 bg-[#F4F4F6] shrink-0">
                <button
                  onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                  className={`flex-1 py-3.5 text-center text-xs font-sans font-extrabold tracking-[0.2em] uppercase transition-all ${
                    authMode === 'login' ? 'bg-white text-[#111111] border-b-2 border-[#111111]' : 'text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                  className={`flex-1 py-3.5 text-center text-xs font-sans font-extrabold tracking-[0.2em] uppercase transition-all ${
                    authMode === 'register' ? 'bg-white text-[#111111] border-b-2 border-[#111111]' : 'text-[#555555] hover:text-[#111111]'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
              {!isLoggedIn ? (
                <div>
                  {verificationMessage && (
                    <div className="mb-5 p-4 bg-[#ECFDF5] border border-[#10B981]/30 rounded-2xl text-xs text-[#065F46] font-medium flex items-start gap-3 shadow-2xs">
                      <svg className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="font-extrabold block text-xs tracking-wider uppercase text-[#047857] mb-1">CHECK YOUR EMAIL FOR VERIFICATION</span>
                        <span className="leading-relaxed font-sans">{verificationMessage}</span>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === 'register' && (
                      <div>
                        <label className="block text-[10px] font-sans font-bold tracking-[0.2em] text-[#111111] uppercase mb-1.5">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Éléonore Saint-Germain"
                          className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-sans font-bold tracking-[0.2em] text-[#111111] uppercase mb-1.5">
                        EMAIL ADDRESS
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

                    <div>
                      <label className="block text-[10px] font-sans font-bold tracking-[0.2em] text-[#111111] uppercase mb-1.5">
                        PASSWORD
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 bg-[#F4F4F6] border border-black/10 rounded-xl text-xs font-sans text-[#111111] focus:outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-xs tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      {loading ? 'PROCESSING...' : authMode === 'login' ? 'SIGN IN' : 'REGISTER ACCOUNT'}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {activeTab === 'orders' && (
                    <div className="space-y-4">
                      {liveOrders.length === 0 ? (
                        <div className="p-8 text-center bg-[#F4F4F6] border border-black/10 rounded-2xl">
                          <svg className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111]">NO ORDERS YET</h4>
                          <p className="font-sans text-[11px] text-[#64748B] mt-1">Your order history for {user?.email} will appear here.</p>
                        </div>
                      ) : (
                        liveOrders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 hover:shadow-md transition-all duration-300 group space-y-2"
                          >
                            <div className="flex items-center justify-between pb-3 border-b border-black/10">
                              <div>
                                <span className="font-mono font-extrabold text-xs text-[#111111] tracking-wider block uppercase">
                                  ORDER #{order.id.slice(0, 8).toUpperCase()}
                                </span>
                                <span className="text-[10px] text-[#555555] font-semibold tracking-wide">
                                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <span className="font-serif font-extrabold text-sm text-[#111111]">${Number(order.total || 0).toFixed(2)} USD</span>
                            </div>

                            {/* 4-Stage Stepper Tracker */}
                            <OrderStageTracker currentStatus={order.status} />

                            <div className="pt-2 space-y-2">
                              <span className="text-[9.5px] font-sans font-extrabold text-[#737373] uppercase tracking-wider block">
                                CREATIONS INCLUDED ({order.items?.length || 0})
                              </span>
                              <div className="space-y-2">
                                {order.items && order.items.length > 0 ? (
                                  order.items.map((it, idx) => {
                                    const prodImg = it.product?.image_url || it.product?.image || '/SVGs/Perfume-SVG.png';
                                    const prodName = it.product?.name || 'Maison Lune Fragrance';
                                    const frenchName = it.product?.french_name || '';

                                    return (
                                      <div key={idx} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-black/5">
                                        <img
                                          src={prodImg}
                                          alt={prodName}
                                          className="w-12 h-12 object-contain bg-[#F8F8FA] rounded-lg p-1 border border-black/5 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-serif text-xs font-bold text-[#111111] uppercase truncate">
                                            {prodName}
                                          </h5>
                                          {frenchName && (
                                            <p className="text-[9.5px] font-sans text-[#737373] italic truncate">{frenchName}</p>
                                          )}
                                          <div className="flex items-center gap-2 text-[10px] text-[#555555] mt-0.5">
                                            <span>SIZE: <strong className="text-[#111111]">{it.size || '50 ml'}</strong></span>
                                            <span>•</span>
                                            <span>QTY: <strong className="text-[#111111]">{it.quantity}</strong></span>
                                          </div>
                                          {it.engraving_text && (
                                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#C08A3E]/10 text-[#9A6B29] border border-[#C08A3E]/20 text-[8.5px] font-bold rounded-full uppercase tracking-wider">
                                              ✨ ENGRAVING: "{it.engraving_text}"
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="font-serif font-extrabold text-xs text-[#111111]">
                                            ${((Number(it.unit_price) || 0) * (it.quantity || 1)).toFixed(2)} USD
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-xs text-[#737373] italic">Haute Fragrance Creation</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'saved' && (
                    <div className="space-y-4">
                      {liveWishlist.length === 0 ? (
                        <div className="p-8 text-center bg-[#F4F4F6] border border-black/10 rounded-2xl">
                          <svg className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111]">WISHLIST IS EMPTY</h4>
                          <p className="font-sans text-[11px] text-[#64748B] mt-1">Explore our Haute collection to save your favorite creations.</p>
                        </div>
                      ) : (
                        liveWishlist.map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl border border-black/10 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[8.5px] font-sans font-extrabold tracking-widest text-[#C08A3E] uppercase block mb-0.5">
                                {item.badge}
                              </span>
                              <h4 className="font-sans font-extrabold text-xs text-[#111111] uppercase truncate">
                                {item.name}
                              </h4>
                              <p className="text-[10px] font-sans text-[#555555] font-medium truncate">{item.subtitle}</p>
                              <span className="font-sans font-extrabold text-xs text-[#111111] block mt-1">
                                {item.priceFormatted}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                onClick={async () => {
                                  const sizeObj = (item.sizes && item.sizes[0]) || { size: '50 ml', price: item.price || 0 };
                                  await addItemToCart(item, sizeObj, 1, '');
                                  onClose();
                                  if (onOpenCart) onOpenCart();
                                }}
                                className="px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-[9px] tracking-[0.18em] uppercase rounded-full transition-all cursor-pointer active:scale-95 shadow-2xs"
                              >
                                ADD TO BAG
                              </button>
                              <button
                                onClick={() => handleRemoveWishlist(item.id)}
                                className="text-[8.5px] font-sans text-red-500 hover:underline uppercase tracking-wider text-center"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div className="space-y-5">
                      {/* User Badge & Avatar Card */}
                      <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-13 h-13 rounded-full bg-[#111111] text-white font-serif font-black text-xl flex items-center justify-center shadow-sm border border-black/10 shrink-0">
                            {displayInitial}
                          </div>
                          <div>
                            <h4 className="font-serif font-extrabold text-base text-[#111111] uppercase leading-tight">
                              {displayName}
                            </h4>
                            <p className="font-sans text-[11px] text-[#555555] font-semibold">{user?.email}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-sans font-extrabold text-[8.5px] tracking-widest uppercase rounded-full">
                              {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED ACCOUNT'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={logout}
                          className="px-3.5 py-1.5 border border-black/20 text-[#111111] hover:bg-black hover:text-white font-sans font-extrabold text-[9.5px] tracking-[0.18em] uppercase rounded-full transition-all cursor-pointer shrink-0 active:scale-95"
                        >
                          SIGN OUT
                        </button>
                      </div>



                      {/* Success / Error Banners */}
                      {profileSuccessMsg && (
                        <div className="p-3 bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl text-xs text-[#065F46] font-medium flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#10B981] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{profileSuccessMsg}</span>
                        </div>
                      )}

                      {profileErrorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                          {profileErrorMsg}
                        </div>
                      )}

                      {/* Saved Address & Phone Details Card */}
                      <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-black/10 pb-3">
                          <div>
                            <span className="text-[8.5px] font-sans font-extrabold tracking-[0.25em] text-[#C08A3E] uppercase block">
                              DATABASE PROFILE
                            </span>
                            <h4 className="font-serif font-extrabold text-sm text-[#111111] uppercase tracking-tight">
                              DELIVERY & CONTACT DETAILS
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              setIsEditingProfile(!isEditingProfile);
                              setProfileSuccessMsg('');
                              setProfileErrorMsg('');
                            }}
                            className="px-3 py-1 bg-white border border-black/20 text-[#111111] hover:bg-[#111111] hover:text-white font-sans font-extrabold text-[9px] tracking-widest uppercase rounded-full transition-all cursor-pointer shadow-2xs"
                          >
                            {isEditingProfile ? 'CANCEL' : 'EDIT DETAILS'}
                          </button>
                        </div>

                        {!isEditingProfile ? (
                          <div className="space-y-3 font-sans text-xs">
                            <div className="flex items-start gap-2.5">
                              <svg className="w-4 h-4 text-[#C08A3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <div>
                                <span className="text-[10px] text-[#737373] uppercase font-bold block">FULL NAME</span>
                                <span className="font-semibold text-[#111111]">{dbProfile?.full_name || editFullName || 'Not provided'}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <svg className="w-4 h-4 text-[#C08A3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <div>
                                <span className="text-[10px] text-[#737373] uppercase font-bold block">PHONE NUMBER</span>
                                <span className="font-semibold text-[#111111]">{dbProfile?.phone || editPhone || 'Not provided'}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <svg className="w-4 h-4 text-[#C08A3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                <span className="text-[10px] text-[#737373] uppercase font-bold block">SAVED SHIPPING ADDRESS</span>
                                {editStreet || dbProfile?.street_address ? (
                                  <span className="font-semibold text-[#111111] leading-relaxed block">
                                    {editStreet || dbProfile?.street_address}<br />
                                    {editCity || dbProfile?.city}, {editState || dbProfile?.state} {editPostalCode || dbProfile?.postal_code}<br />
                                    {editCountry || dbProfile?.country}
                                  </span>
                                ) : (
                                  <span className="text-[#737373] italic">No saved address yet. Add during checkout or edit details above.</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSaveProfileDetails} className="space-y-3 pt-1">
                            <div>
                              <label className="block text-[9.5px] font-sans font-bold tracking-wider text-[#111111] uppercase mb-1">
                                FULL NAME
                              </label>
                              <input
                                type="text"
                                required
                                value={editFullName}
                                onChange={(e) => setEditFullName(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-sans text-[#111111] focus:outline-none focus:border-black"
                              />
                            </div>

                            <div>
                              <label className="block text-[9.5px] font-sans font-bold tracking-wider text-[#111111] uppercase mb-1">
                                PHONE NUMBER
                              </label>
                              <input
                                type="tel"
                                required
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                placeholder="+33 1 42 86 28 00"
                                className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-sans text-[#111111] focus:outline-none focus:border-black"
                              />
                            </div>

                            <div>
                              <label className="block text-[9.5px] font-sans font-bold tracking-wider text-[#111111] uppercase mb-1">
                                STREET ADDRESS
                              </label>
                              <input
                                type="text"
                                required
                                value={editStreet}
                                onChange={(e) => setEditStreet(e.target.value)}
                                placeholder="31 Rue Cambon"
                                className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-sans text-[#111111] focus:outline-none focus:border-black"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9.5px] font-sans font-bold tracking-wider text-[#111111] uppercase mb-1">
                                  CITY
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={editCity}
                                  onChange={(e) => setEditCity(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-sans text-[#111111] focus:outline-none focus:border-black"
                                />
                              </div>

                              <div>
                                <label className="block text-[9.5px] font-sans font-bold tracking-wider text-[#111111] uppercase mb-1">
                                  STATE / REGION
                                </label>
                                <input
                                  type="text"
                                  value={editState}
                                  onChange={(e) => setEditState(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-sans text-[#111111] focus:outline-none focus:border-black"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9.5px] font-sans font-bold tracking-wider text-[#111111] uppercase mb-1">
                                  POSTAL CODE
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={editPostalCode}
                                  onChange={(e) => setEditPostalCode(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-sans text-[#111111] focus:outline-none focus:border-black"
                                />
                              </div>

                              <div>
                                <label className="block text-[9.5px] font-sans font-bold tracking-wider text-[#111111] uppercase mb-1">
                                  COUNTRY
                                </label>
                                <select
                                  value={editCountry}
                                  onChange={(e) => setEditCountry(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-sans text-[#111111] focus:outline-none focus:border-black"
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
                            </div>

                            <button
                              type="submit"
                              disabled={profileSaving}
                              className="w-full py-2.5 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer disabled:opacity-50 mt-2"
                            >
                              {profileSaving ? 'SAVING DETAILS...' : 'SAVE DETAILS TO DATABASE'}
                            </button>
                          </form>
                        )}
                      </div>

                      {isAdmin && (
                        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-3.5">
                            <div>
                              <span className="font-sans font-extrabold text-[9px] text-[#C08A3E] tracking-[0.25em] uppercase block">
                                MAISON CONTROL
                              </span>
                              <h4 className="font-serif font-extrabold text-sm text-[#111111] uppercase tracking-tight mt-0.5">
                                ADMINISTRATION PANEL
                              </h4>
                            </div>
                            <span className="px-2.5 py-0.5 bg-[#C08A3E]/10 text-[#C08A3E] border border-[#C08A3E]/30 font-sans font-extrabold text-[8.5px] tracking-widest uppercase rounded-full">
                              ADMIN
                            </span>
                          </div>

                          <p className="font-sans text-[11px] text-[#555555] font-medium leading-relaxed mb-4">
                            Manage showcase products for Hero Slider, Featured Olfactory Section, and WebP catalog images.
                          </p>

                          <button
                            onClick={() => {
                              onClose();
                              navigate('/admin');
                            }}
                            className="w-full py-3 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2 active:scale-98"
                          >
                            <svg className="w-3.5 h-3.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>ENTER ADMIN PANEL</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
