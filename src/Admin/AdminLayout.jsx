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
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Protect route - Redirect unauthenticated users
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

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
    <div className="min-h-screen w-full bg-[#F8F8FA] text-[#111111] font-sans flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#111111] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Lune Logo" className="h-8 w-auto invert" />
          <span className="font-serif font-black text-sm tracking-wider uppercase">MAISON LUNE ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 bg-[#C08A3E] text-white text-[9px] font-extrabold uppercase rounded-full"
          >
            ← WEBSITE
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-white hover:text-[#C08A3E] font-bold text-lg"
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Left Sidebar Navigation Panel */}
      <aside className={`w-full md:w-72 bg-[#111111] text-white shrink-0 flex flex-col justify-between border-r border-black/10 transition-all ${
        mobileNavOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div>
          {/* Top Logo & Title */}
          <div className="p-6 border-b border-white/10 hidden md:flex items-center gap-3">
            <img src={logoImg} alt="Lune Logo" className="h-10 w-auto invert" />
            <div>
              <h2 className="font-serif font-black text-lg tracking-tight uppercase">MAISON LUNE</h2>
              <span className="text-[8.5px] font-sans font-extrabold tracking-[0.25em] text-[#C08A3E] uppercase block">
                ADMINISTRATION
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-3 cursor-pointer ${
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
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-[#C08A3E] hover:bg-[#a67431] text-white border border-[#C08A3E] font-sans font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer text-center active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <span>← RETURN TO BOUTIQUE</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full text-center text-[10px] font-sans font-bold text-red-400 hover:underline tracking-widest uppercase cursor-pointer"
          >
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Viewport Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-black/10 px-6 sm:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-900 hover:bg-[#C08A3E] text-white font-extrabold text-[10px] tracking-[0.15em] uppercase rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-95 border border-black/10"
              title="Return to Website Main Store"
            >
              <svg className="w-3.5 h-3.5 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>← BACK TO WEBSITE</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 border-l border-gray-200 pl-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-sans font-extrabold tracking-wider uppercase text-[#111111]">
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
                ADMIN ROLE
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#111111] text-white font-serif font-black text-sm flex items-center justify-center border border-black/10">
              {user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Section Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10">
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
