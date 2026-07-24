import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountModal({ isOpen, onClose, onOpenCart }) {
  const [activeTab, setActiveTab] = useState('membership');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Madame Éléonore',
    tier: 'HAUTE PARFUMERIE VIP MEMBER',
    memberId: 'CHANEL-N19-8921',
    points: '2,450 PRIVILEGE POINTS',
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
      orderId: 'CN-2026-9812',
      date: 'JULY 18, 2026',
      items: 'N°19 EXTRAIT DE PARFUM (15 ML) • CUSTOM ENGRAVED',
      total: '$380.00',
      status: 'DELIVERED • PARIS FLAGSHIP',
    },
    {
      orderId: 'CN-2026-4410',
      date: 'MAY 02, 2026',
      items: 'N°19 RITUEL BODY CREAM & SOAP SET',
      total: '$210.00',
      status: 'DELIVERED',
    },
  ];

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setUserProfile((prev) => ({ ...prev, name: email.split('@')[0].toUpperCase() }));
      setIsLoggedIn(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white border border-black/15 rounded-2xl shadow-2xl overflow-hidden text-[#1A1A1A] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner & Close Button */}
          <div className="relative bg-[#111111] text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-radial from-[#C08A3E]/20 via-transparent to-transparent pointer-events-none" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Account Modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#C08A3E] font-semibold block mb-1">
              MAISON PERFUME HAUTE PARFUMERIE
            </span>
            <h2 className="font-serif font-light text-2xl sm:text-3xl text-white tracking-tight uppercase">
              LE CERCLE VIP N°19
            </h2>
            <p className="font-sans text-xs text-white/70 font-light mt-1 max-w-md">
              Exclusive concierge access, hand-sealed baudruchage flacons, and private invitations.
            </p>

            {isLoggedIn && (
              <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-serif text-sm font-medium tracking-wide text-white">{userProfile.name}</p>
                  <p className="font-sans text-[10px] text-[#C08A3E] tracking-widest uppercase">{userProfile.tier}</p>
                </div>
                <span className="px-3 py-1 bg-white/10 border border-white/20 text-[9px] font-sans tracking-[0.2em] text-white uppercase rounded-full">
                  {userProfile.points}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-black/10 bg-[#F7F7F7] px-4 sm:px-6 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('membership')}
              className={`py-3 sm:py-4 px-3 sm:px-4 text-[10px] sm:text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                activeTab === 'membership' ? 'text-[#1A1A1A]' : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              PRIVILEGES
              {activeTab === 'membership' && (
                <motion.span layoutId="accountTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C08A3E]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 sm:py-4 px-3 sm:px-4 text-[10px] sm:text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                activeTab === 'saved' ? 'text-[#1A1A1A]' : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              WISHLIST ({savedItems.length})
              {activeTab === 'saved' && (
                <motion.span layoutId="accountTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C08A3E]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 sm:py-4 px-3 sm:px-4 text-[10px] sm:text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                activeTab === 'orders' ? 'text-[#1A1A1A]' : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              ORDERS
              {activeTab === 'orders' && (
                <motion.span layoutId="accountTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C08A3E]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('signin')}
              className={`py-3 sm:py-4 px-3 sm:px-4 text-[10px] sm:text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 cursor-pointer relative ${
                activeTab === 'signin' ? 'text-[#1A1A1A]' : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              {isLoggedIn ? 'ACCOUNT SETTINGS' : 'SIGN IN'}
              {activeTab === 'signin' && (
                <motion.span layoutId="accountTab" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C08A3E]" />
              )}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
            {activeTab === 'membership' && (
              <div className="space-y-6">
                <div className="bg-[#FAF8F5] border border-[#C08A3E]/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase">
                      HAUTE CLUB CARD
                    </span>
                    <span className="text-[10px] font-sans text-[#737373] tracking-widest">
                      {userProfile.memberId}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#1A1A1A] font-normal uppercase">
                    COMPLIMENTARY VIP PRIVILEGES
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs font-sans text-[#555555]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C08A3E]" />
                      Bespoke Hand-Engraving on all N°19 Flacons
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C08A3E]" />
                      Complimentary Trio Samples with Every Boutique Order
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C08A3E]" />
                      Private Consultation at 31 Rue Cambon, Paris
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C08A3E]" />
                      Express Insured International Shipping
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-[#F9F9F9] rounded-xl border border-black/5">
                    <p className="text-[10px] font-sans tracking-[0.2em] text-[#737373] uppercase">CONCIERGE HOTLINE</p>
                    <p className="font-serif text-sm text-[#1A1A1A] font-semibold mt-1">+33 (0)1 44 50 70 00</p>
                  </div>
                  <div className="p-4 bg-[#F9F9F9] rounded-xl border border-black/5">
                    <p className="text-[10px] font-sans tracking-[0.2em] text-[#737373] uppercase">PARIS ATELIER</p>
                    <p className="font-serif text-sm text-[#1A1A1A] font-semibold mt-1">31 RUE CAMBON, 75001 PARIS</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-4">
                <p className="text-xs font-sans text-[#737373] uppercase tracking-wider">
                  YOUR SAVED HAUTE PARFUMERIE PIECES
                </p>
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white border border-black/10 rounded-xl hover:border-[#C08A3E]/40 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-lg bg-[#F6F6F6] p-1" />
                        <div>
                          <span className="text-[9px] font-sans tracking-widest text-[#C08A3E] uppercase font-bold block">
                            {item.badge}
                          </span>
                          <h4 className="font-sans text-xs font-bold text-[#1A1A1A] uppercase">{item.name}</h4>
                          <p className="text-[10px] font-sans text-[#737373]">{item.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-xs font-bold text-[#1A1A1A] mb-1.5">{item.price}</p>
                        <button
                          onClick={() => {
                            if (onOpenCart) onOpenCart();
                            onClose();
                          }}
                          className="px-3 py-1.5 text-[9.5px] font-sans font-bold tracking-widest text-white bg-[#1A1A1A] hover:bg-black rounded-full uppercase cursor-pointer"
                        >
                          VIEW IN BAG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <p className="text-xs font-sans text-[#737373] uppercase tracking-wider">RECENT N°19 PURCHASES</p>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.orderId} className="p-4 bg-white border border-black/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="font-bold tracking-wider text-[#1A1A1A]">{order.orderId}</span>
                        <span className="text-[10px] text-[#737373]">{order.date}</span>
                      </div>
                      <p className="text-xs font-serif text-[#555555]">{order.items}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[10px] font-sans">
                        <span className="font-semibold text-[#C08A3E] uppercase">{order.status}</span>
                        <span className="font-bold text-[#1A1A1A]">{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'signin' && (
              <div>
                {isLoggedIn ? (
                  <div className="text-center py-6 space-y-4">
                    <p className="font-serif text-lg text-[#1A1A1A]">Welcome back, {userProfile.name}</p>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="px-6 py-2.5 text-xs font-sans font-bold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-full cursor-pointer"
                    >
                      SIGN OUT
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto">
                    <div>
                      <label className="block text-[10px] font-sans tracking-[0.2em] text-[#737373] uppercase mb-1">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="eleonore@chanel-haute.com"
                        className="w-full px-4 py-2.5 text-xs font-sans border border-black/20 rounded-lg focus:outline-none focus:border-[#C08A3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans tracking-[0.2em] text-[#737373] uppercase mb-1">
                        PASSWORD
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 text-xs font-sans border border-black/20 rounded-lg focus:outline-none focus:border-[#C08A3E]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 text-xs font-sans font-bold tracking-[0.25em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-full shadow-md transition-all cursor-pointer"
                    >
                      ENTER LE CERCLE VIP
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
