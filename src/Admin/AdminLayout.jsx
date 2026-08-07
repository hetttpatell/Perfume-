import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/Logo.png';

import DashboardOverview from './DashboardOverview';
import ProductsManager from './ProductsManager';
import CategoriesManager from './CategoriesManager';
import OrdersManager from './OrdersManager';
import DiscountsManager from './DiscountsManager';
import ReviewsManager from './ReviewsManager';
import ContactLocationsManager from './ContactLocationsManager';
import UsersManager from './UsersManager';

export default function AdminLayout() {
  const { isLoggedIn, user, logout, promptLoginRequired } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.profile?.role === 'admin';

  // Protect route - Instantly redirect unauthenticated users and customer role accounts
  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      if (isLoggedIn && !isAdmin && promptLoginRequired) {
        promptLoginRequired('Access denied: Admin privileges required.');
      }
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, isAdmin, navigate, promptLoginRequired]);

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD SUMMARY', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'products', label: 'PRODUCTS & SHOWCASE', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'categories', label: 'CATEGORIES', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { id: 'orders', label: 'CUSTOMER ORDERS', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'discounts', label: 'PROMO DISCOUNTS', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'reviews', label: 'REVIEWS & RATINGS', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'locations', label: 'STORES & CONTACT', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'users', label: 'USERS & ROLES', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  return (
    <div className="h-screen w-full bg-[#F8F8FA] text-[#111111] font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Header (Fixed at top of screen) */}
      <div className="md:hidden bg-[#111111] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md border-b border-white/10 z-40">
        {/* Left: Hamburger Menu Button */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="p-2 text-white hover:text-[#C08A3E] font-bold text-2xl active:scale-95 transition-transform cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        {/* Center: LUNE Title & Subtitle */}
        <div className="text-center flex flex-col items-center justify-center">
          <span className="font-serif font-black text-lg tracking-[0.2em] uppercase block leading-none text-white">
            LUNE
          </span>
          <span className="text-[7.5px] font-sans font-extrabold tracking-[0.25em] text-[#C08A3E] uppercase block mt-0.5">
            ADMINISTRATION
          </span>
        </div>

        {/* Right: Live Session Pill */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[9px] font-extrabold tracking-wider uppercase text-white">LIVE</span>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay (Slide-in from Left) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex md:hidden animate-fade-in">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setMobileNavOpen(false)} />

          {/* Drawer Container Panel (Animates from Left) */}
          <aside className="relative w-[85vw] max-w-[320px] bg-[#111111] text-white h-full flex flex-col justify-between p-5 shadow-2xl overflow-y-auto border-r border-white/10 z-10 animate-slide-in-left">
            <div>
              {/* Drawer Top Header */}
              <div className="pb-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={logoImg} alt="Lune Logo" className="h-9 w-auto invert" />
                  <div>
                    <h2 className="font-serif font-black text-base tracking-tight uppercase leading-none">LUNE</h2>
                    <span className="text-[8px] font-sans font-extrabold tracking-[0.25em] text-[#C08A3E] uppercase block mt-1">
                      ADMINISTRATION
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold active:scale-95 transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="py-6 space-y-2">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-3.5 cursor-pointer text-left ${
                        isActive
                          ? 'bg-white text-[#111111] shadow-lg font-extrabold'
                          : 'text-[#A3A3A3] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C08A3E]' : 'text-[#737373]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-8 h-8 rounded-full bg-[#C08A3E] text-white font-serif font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {user?.email?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-serif font-bold text-xs uppercase block text-white truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </span>
                  <span className="text-[8.5px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase block">
                    ADMINISTRATOR
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate('/');
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10 active:scale-95 mb-2"
              >
                <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>RETURN TO WEBSITE</span>
              </button>

              <button
                onClick={() => {
                  if (logout) logout();
                  navigate('/');
                }}
                className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-center text-[10px] font-sans font-extrabold tracking-widest uppercase rounded-xl transition-all cursor-pointer active:scale-95"
              >
                SIGN OUT SESSION
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Left Sidebar Navigation Panel */}
      <aside className="hidden md:flex w-72 bg-[#111111] text-white shrink-0 flex-col justify-between border-r border-black/10">
        <div>
          {/* Top Logo & Title */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <img src={logoImg} alt="Lune Logo" className="h-10 w-auto invert" />
            <div>
              <h2 className="font-serif font-black text-lg tracking-tight uppercase">LUNE</h2>
              <span className="text-[8.5px] font-sans font-extrabold tracking-[0.25em] text-[#C08A3E] uppercase block">
                ADMINISTRATION
              </span>
            </div>
          </div>

          {/* Nav Items (Matching Screenshot 1) */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-4 py-3.5 rounded-2xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#111111] shadow-md font-extrabold'
                      : 'text-[#A3A3A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <svg className={`w-4 h-4 ${isActive ? 'text-[#C08A3E]' : 'text-[#737373]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#C08A3E] text-white font-serif font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              {user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-serif font-bold text-xs uppercase block text-white truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </span>
              <span className="text-[8.5px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase block">
                ADMIN ROLE ACTIVE
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10 active:scale-95"
          >
            <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>RETURN TO WEBSITE</span>
          </button>

          <button
            onClick={() => {
              if (logout) logout();
              navigate('/');
            }}
            className="w-full text-center py-2 text-[10px] font-sans font-bold text-red-400 hover:text-red-300 hover:underline tracking-widest uppercase cursor-pointer"
          >
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Viewport Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Header Bar (Sticky Desktop & Tablet Header) */}
        <header className="hidden md:flex bg-white/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3.5 items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white text-[10px] font-sans font-extrabold tracking-wider uppercase rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 border border-black/10"
            >
              <svg className="w-3.5 h-3.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>RETURN TO BOUTIQUE</span>
            </button>

            <div className="flex items-center gap-2 bg-[#F4F4F6] border border-black/10 px-3 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-sans font-extrabold tracking-wider uppercase text-[#111111]">
                ADMINISTRATOR SESSION ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="font-serif font-bold text-xs uppercase block text-[#111111]">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </span>
              <span className="text-[9px] font-sans font-extrabold text-[#C08A3E] tracking-widest uppercase block">
                ADMIN SUITE
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#111111] text-white font-serif font-black text-sm flex items-center justify-center border border-black/10">
              {user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Section Content View */}
        <div className="flex-1 p-3 sm:p-6 md:p-8">
          {activeTab === 'dashboard' && <DashboardOverview onNavigate={setActiveTab} />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'discounts' && <DiscountsManager />}
          {activeTab === 'reviews' && <ReviewsManager />}
          {activeTab === 'locations' && <ContactLocationsManager />}
          {activeTab === 'users' && <UsersManager />}
        </div>
      </main>
    </div>
  );
}
