import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountModal({ isOpen, onClose, onOpenCart }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'ÉLÉONORE SAINT-GERMAIN',
    email: 'eleonore@maison-perfume.com',
    initial: 'E',
  });

  const savedItems = [
    {
      id: 'p1',
      name: 'N°19 EXTRAIT DE PARFUM',
      subtitle: 'FLACON DE PRÉCISION • 15 ML',
      price: '$380.00',
      badge: 'BAUDRUCHAGE SEALED',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p2',
      name: 'N°19 EAU DE PARFUM SPRAY',
      subtitle: 'VAPORISATEUR HAUTE COUTURE • 100 ML',
      price: '$185.00',
      badge: 'ICONIC GREEN IRIS',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const recentOrders = [
    {
      orderId: 'ORD-2026-9812',
      date: 'JULY 18, 2026',
      items: 'N°19 EXTRAIT DE PARFUM (15 ML) • CUSTOM ENGRAVED',
      total: '$380.00',
      status: 'DELIVERED',
    },
    {
      orderId: 'ORD-2026-4410',
      date: 'MAY 02, 2026',
      items: 'N°19 RITUEL BODY CREAM & SOAP SET',
      total: '$210.00',
      status: 'DELIVERED',
    },
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const nameStr = email.split('@')[0].toUpperCase();
      setUserProfile({
        name: nameStr,
        email: email,
        initial: nameStr.charAt(0) || 'E',
      });
      setIsLoggedIn(true);
      setActiveTab('orders');
    }
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

          {/* Right-Side Luxury Slide-Over Account Drawer (Standard Customer Account) */}
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
                onClick={onClose}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-black/10 transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95 shadow-2xs"
                aria-label="Close Account Panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <span className="inline-block px-3.5 py-1 bg-white border border-black/10 rounded-full text-[9.5px] font-sans font-bold tracking-[0.25em] text-[#555555] uppercase mb-4">
                MY ACCOUNT
              </span>

              {/* User Profile Info with Simple Letter Icon */}
              <div className="flex items-center gap-3.5">
                {/* Simple Letter Initial Avatar Badge */}
                <div className="w-12 h-12 rounded-full bg-[#111111] text-white font-serif font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm border border-black/10">
                  {userProfile.initial}
                </div>

                <div>
                  <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#111111] tracking-tight uppercase leading-snug">
                    {userProfile.name}
                  </h3>
                  <p className="font-sans text-[11px] text-[#555555] font-semibold">
                    {userProfile.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Standard E-Commerce Account) */}
            <div className="flex border-b border-black/10 bg-white px-4 sm:px-6 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-4 text-[10.5px] font-sans font-extrabold tracking-[0.18em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                  activeTab === 'orders' ? 'text-[#111111]' : 'text-[#737373] hover:text-[#111111]'
                }`}
              >
                ORDERS ({recentOrders.length})
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
                WISHLIST ({savedItems.length})
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
                {isLoggedIn ? 'PROFILE' : 'SIGN IN'}
                {activeTab === 'profile' && (
                  <motion.span layoutId="accountDrawerTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111111]" />
                )}
              </button>
            </div>

            {/* Scrollable Main Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
              {/* Tab 1: Orders */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between pb-3.5 border-b border-black/10 mb-3.5">
                        <div>
                          <span className="font-sans font-extrabold text-xs text-[#111111] tracking-wider block">
                            ORDER {order.orderId}
                          </span>
                          <span className="text-[10px] text-[#555555] font-semibold tracking-wide">
                            {order.date}
                          </span>
                        </div>
                        <span className="px-3 py-1 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-sans font-extrabold text-[9px] tracking-widest uppercase rounded-full">
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-12 h-12 bg-white rounded-xl border border-black/10 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                          <img
                            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=300&q=80"
                            alt="Fragrance item"
                            className="h-full w-auto object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-xs text-[#111111] uppercase leading-snug">
                            {order.items}
                          </p>
                          <span className="text-[9.5px] font-sans font-semibold text-[#555555]">
                            Standard Express Delivery
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-black/10">
                        <span className="font-sans text-[10px] text-[#555555] uppercase tracking-wider font-bold">
                          TOTAL PAID
                        </span>
                        <span className="font-sans font-extrabold text-base text-[#111111]">{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Saved Wishlist */}
              {activeTab === 'saved' && (
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Studio Viewport Container */}
                        <div className="w-20 h-20 sm:w-22 sm:h-22 bg-white border border-black/10 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-black/20 transition-colors">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div>
                          <span className="px-2 py-0.5 bg-black/85 text-white font-sans font-bold text-[8px] tracking-[0.2em] uppercase rounded-full inline-block mb-1.5">
                            {item.badge}
                          </span>
                          <h5 className="font-serif font-extrabold text-xs sm:text-sm text-[#111111] uppercase tracking-wide leading-snug group-hover:text-[#C08A3E] transition-colors">
                            {item.name}
                          </h5>
                          <p className="font-sans text-[10px] text-[#555555] font-semibold mt-0.5">
                            {item.subtitle}
                          </p>
                          <p className="font-sans font-black text-sm text-[#111111] mt-1.5">{item.price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenCart) onOpenCart();
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>ADD TO BAG</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Sign In / Profile */}
              {activeTab === 'profile' && (
                <div>
                  {!isLoggedIn ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-sans font-bold tracking-[0.2em] text-[#111111] uppercase mb-1.5">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="eleonore@example.com"
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
                        className="w-full py-3 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-xs tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer active:scale-98"
                      >
                        SIGN IN
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      {/* Customer Header Summary Tile */}
                      <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-13 h-13 rounded-full bg-[#111111] text-white font-serif font-black text-xl flex items-center justify-center shadow-sm border border-black/10 shrink-0">
                            {userProfile.initial}
                          </div>
                          <div>
                            <h4 className="font-serif font-extrabold text-base text-[#111111] uppercase leading-tight">
                              {userProfile.name}
                            </h4>
                            <p className="font-sans text-[11px] text-[#555555] font-semibold">{userProfile.email}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-sans font-extrabold text-[8.5px] tracking-widest uppercase rounded-full">
                              VERIFIED ACCOUNT
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsLoggedIn(false)}
                          className="px-3.5 py-1.5 border border-black/20 text-[#111111] hover:bg-black hover:text-white font-sans font-extrabold text-[9.5px] tracking-[0.18em] uppercase rounded-full transition-all cursor-pointer shrink-0 active:scale-95"
                        >
                          SIGN OUT
                        </button>
                      </div>

                      {/* Section 1: Personal Details */}
                      <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-black/10">
                          <h5 className="font-sans font-extrabold text-xs text-[#111111] uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            PERSONAL INFORMATION
                          </h5>
                          <span className="text-[9px] font-sans font-bold text-[#C08A3E] tracking-widest uppercase">
                            EDITABLE
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-[#555555] uppercase mb-1">
                              FULL NAME
                            </label>
                            <input
                              type="text"
                              defaultValue={userProfile.name}
                              className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-sans text-[#111111] font-semibold focus:outline-none focus:border-black transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-[#555555] uppercase mb-1">
                              PHONE NUMBER
                            </label>
                            <input
                              type="tel"
                              defaultValue="+33 1 42 68 55 00"
                              className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-sans text-[#111111] font-semibold focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-[#555555] uppercase mb-1">
                            ACCOUNT EMAIL
                          </label>
                          <input
                            type="email"
                            defaultValue={userProfile.email}
                            className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-sans text-[#111111] font-semibold focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>

                      {/* Section 2: Default Delivery & Shipping Address */}
                      <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-black/10">
                          <h5 className="font-sans font-extrabold text-xs text-[#111111] uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            SHIPPING & DELIVERY ADDRESS
                          </h5>
                          <span className="px-2.5 py-0.5 bg-black/85 text-white font-sans font-bold text-[8px] tracking-[0.2em] uppercase rounded-full">
                            DEFAULT
                          </span>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-[#555555] uppercase mb-1">
                            STREET ADDRESS
                          </label>
                          <input
                            type="text"
                            defaultValue="31 Rue Cambon, Floor 4"
                            className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-sans text-[#111111] font-semibold focus:outline-none focus:border-black transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-[#555555] uppercase mb-1">
                              CITY / REGION
                            </label>
                            <input
                              type="text"
                              defaultValue="Paris"
                              className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-sans text-[#111111] font-semibold focus:outline-none focus:border-black transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-[#555555] uppercase mb-1">
                              POSTAL CODE
                            </label>
                            <input
                              type="text"
                              defaultValue="75001"
                              className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-sans text-[#111111] font-semibold focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-sans font-extrabold tracking-[0.18em] text-[#555555] uppercase mb-1">
                            COUNTRY
                          </label>
                          <input
                            type="text"
                            defaultValue="France"
                            className="w-full px-3.5 py-2.5 bg-white border border-black/10 rounded-xl text-xs font-sans text-[#111111] font-semibold focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>

                      {/* Save Profile Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileSaved(true);
                          setTimeout(() => setIsProfileSaved(false), 3000);
                        }}
                        className="w-full py-3 bg-[#111111] hover:bg-black text-white font-sans font-extrabold text-xs tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer active:scale-98 shadow-xs"
                      >
                        {isProfileSaved ? 'PROFILE & ADDRESS SAVED ✓' : 'SAVE PROFILE & ADDRESS'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Drawer Footer */}
            <div className="p-5 border-t border-black/10 bg-[#F4F4F6] shrink-0 flex items-center justify-between">
              <span className="font-sans text-[10px] text-[#737373] tracking-widest uppercase font-semibold">
                LUNE FRAGRANCE
              </span>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenCart) onOpenCart();
                }}
                className="px-4 py-2 bg-[#111111] text-white font-sans font-extrabold text-[10px] tracking-[0.18em] uppercase rounded-full hover:bg-black transition-all cursor-pointer active:scale-95"
              >
                VIEW BAG
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
