import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders, fetchUserWishlist, toggleWishlistItem, fetchUserProfile } from '../services/api';

export default function AccountModal({ isOpen, onClose, onOpenCart, onOpenAdmin }) {
  const { isLoggedIn, user, login, register, logout, authRequiredNotice, setAuthRequiredNotice } = useAuth();
  const navigate = useNavigate();
  const [dbProfile, setDbProfile] = useState(null);

  const isAdmin = user?.role === 'admin' || user?.profile?.role === 'admin' || dbProfile?.role === 'admin';

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState(isLoggedIn ? 'orders' : 'auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Live Customer Data from Database
  const [liveOrders, setLiveOrders] = useState([]);
  const [liveWishlist, setLiveWishlist] = useState([]);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchUserOrders().then(setLiveOrders);
      fetchUserWishlist().then(setLiveWishlist);
      fetchUserProfile().then(p => {
        if (p) setDbProfile(p);
      });
    }
  }, [isOpen, isLoggedIn]);

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
                            className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 hover:shadow-md transition-all duration-300 group"
                          >
                            <div className="flex items-center justify-between pb-3.5 border-b border-black/10 mb-3.5">
                              <div>
                                <span className="font-sans font-extrabold text-xs text-[#111111] tracking-wider block uppercase">
                                  ORDER #{order.id.slice(0, 8)}
                                </span>
                                <span className="text-[10px] text-[#555555] font-semibold tracking-wide">
                                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <span className="px-3 py-1 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-sans font-extrabold text-[9px] tracking-widest uppercase rounded-full">
                                {order.status}
                              </span>
                            </div>
                            <p className="font-sans text-xs text-[#111111] font-semibold mb-2">
                              {order.items?.map(i => `${i.product?.name || 'Parfum'} (${i.quantity}x)`).join(', ') || 'Lune Fragrance Item'}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs font-sans text-[#555555] font-medium">TOTAL AMOUNT</span>
                              <span className="font-serif font-extrabold text-sm text-[#111111]">$ {order.total}</span>
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
                                onClick={() => {
                                  onClose();
                                  if (onOpenCart) onOpenCart();
                                }}
                                className="px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-[9px] tracking-[0.18em] uppercase rounded-full transition-all cursor-pointer active:scale-95"
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
