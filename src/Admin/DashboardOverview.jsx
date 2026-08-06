import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomStageSelect from '../components/CustomStageSelect';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export default function DashboardOverview({ onNavigate }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    heroProducts: 0,
    featuredProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalDiscounts: 0,
    totalCategories: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('lune_token');
      const res = await axios.post(`${API_BASE_URL}/admin/stats`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data.stats || {});
        setRecentOrders(res.data.recentOrders || []);
        setRecentProducts(res.data.recentProducts || []);
      }
    } catch (err) {
      console.error('Failed to load live dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNavClick = (tabId) => {
    if (onNavigate) {
      onNavigate(tabId);
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  return (
    <div className="space-y-8 font-sans text-gray-900">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
            MAISON LUNE • REAL-TIME METRICS & LIVE DATA
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 uppercase tracking-tight">
            ADMINISTRATOR DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-extrabold text-[10px] uppercase tracking-widest rounded-full transition-all cursor-pointer flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>REFRESH LIVE DATA</span>
          </button>

          <span className="px-3.5 py-1.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-black uppercase rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>LIVE SUPABASE ENGINE</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-3xl border border-gray-800 shadow-xl space-y-3">
          <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#C08A3E] block">
            TOTAL STORE REVENUE
          </span>
          <h3 className="font-serif font-black text-3xl text-white">
            $ {loading ? '...' : Number(stats.totalRevenue || 0).toLocaleString()}
          </h3>
          <p className="text-[10px] text-gray-400 font-medium">Sum of all completed client orders</p>
        </div>

        {/* Card 2: Catalog Products */}
        <div
          onClick={() => handleNavClick('products')}
          className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-gray-500 block">
              TOTAL PRODUCTS
            </span>
            <span className="text-xs group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <h3 className="font-serif font-black text-3xl text-gray-900">
            {loading ? '...' : stats.totalProducts || 0}
          </h3>
          <p className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider">
            {stats.activeProducts || 0} ACTIVE PRODUCTS IN STORE
          </p>
        </div>

        {/* Card 3: Total Orders */}
        <div
          onClick={() => handleNavClick('orders')}
          className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-gray-500 block">
              CLIENT ORDERS
            </span>
            <span className="text-xs group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <h3 className="font-serif font-black text-3xl text-gray-900">
            {loading ? '...' : stats.totalOrders || 0}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            RECORDED CLIENT TRANSACTIONS
          </p>
        </div>

        {/* Card 4: Registered Users */}
        <div
          onClick={() => handleNavClick('users')}
          className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-gray-500 block">
              REGISTERED USERS
            </span>
            <span className="text-xs group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <h3 className="font-serif font-black text-3xl text-gray-900">
            {loading ? '...' : stats.totalUsers || 0}
          </h3>
          <p className="text-[10px] text-[#C08A3E] font-bold uppercase tracking-wider">
            DATABASE CLIENT PROFILES
          </p>
        </div>
      </div>

      {/* Secondary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => handleNavClick('categories')}
          className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-2 cursor-pointer hover:bg-white transition-all"
        >
          <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#C08A3E] block">
            FRAGRANCE CATEGORIES
          </span>
          <h4 className="font-serif font-black text-xl text-gray-900">
            {stats.totalCategories || 0} CATEGORIES RECORDED
          </h4>
          <p className="text-xs text-gray-600">Extrait de Parfum, Eau de Parfum, Body Care, etc.</p>
        </div>

        <div
          onClick={() => handleNavClick('discounts')}
          className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-2 cursor-pointer hover:bg-white transition-all"
        >
          <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#C08A3E] block">
            ACTIVE PROMO COUPONS
          </span>
          <h4 className="font-serif font-black text-xl text-gray-900">
            {stats.totalDiscounts || 0} COUPONS IN DATABASE
          </h4>
          <p className="text-xs text-gray-600">Live promotional discount codes</p>
        </div>

        <div
          onClick={() => handleNavClick('products')}
          className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-2 cursor-pointer hover:bg-white transition-all"
        >
          <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#C08A3E] block">
            HERO SLIDER & FEATURED
          </span>
          <h4 className="font-serif font-black text-xl text-gray-900">
            {stats.heroProducts || 0} HERO ★ / {stats.featuredProducts || 0} FEATURED
          </h4>
          <p className="text-xs text-gray-600">Showcase items assigned to homepage</p>
        </div>
      </div>

      {/* Real Live Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Live Activity */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-serif font-black text-base text-gray-900 uppercase">
              RECENT ORDERS (LIVE DATABASE)
            </h3>
            <button
              onClick={() => handleNavClick('orders')}
              className="text-[10px] font-extrabold text-[#C08A3E] uppercase hover:underline"
            >
              VIEW ALL ORDERS &rarr;
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 font-medium">
              No client orders placed yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(ord => (
                <div key={ord.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">
                      Order #{ord.id.substring(0, 8)}...
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {ord.shipping_address?.full_name || ord.user_id || 'Guest Client'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-black text-sm text-gray-900 block">
                      $ {ord.total_amount || 0}
                    </span>
                    <div className="mt-1">
                      <CustomStageSelect
                        value={(ord.status || 'ordered').toLowerCase() === 'pending' ? 'ordered' : (ord.status || 'ordered').toLowerCase()}
                        onChange={async (newStatus) => {
                          try {
                            const token = localStorage.getItem('lune_token');
                            await axios.post(`${API_BASE_URL}/admin/orders/update-status`, { orderId: ord.id, status: newStatus }, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            setRecentOrders(prev => prev.map(o => o.id === ord.id ? { ...o, status: newStatus } : o));
                          } catch (err) {
                            console.error('Error updating order status:', err);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products Live Activity */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-serif font-black text-base text-gray-900 uppercase">
              RECENT PRODUCTS IN CATALOG
            </h3>
            <button
              onClick={() => handleNavClick('products')}
              className="text-[10px] font-extrabold text-[#C08A3E] uppercase hover:underline"
            >
              MANAGE PRODUCTS &rarr;
            </button>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 font-medium">
              No products found in catalog.
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map(prod => (
                <div key={prod.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.name} className="w-9 h-9 object-contain bg-white rounded-lg p-1 border border-gray-200" />
                    ) : (
                      <div className="w-9 h-9 bg-gray-900 text-white font-serif font-bold text-xs flex items-center justify-center rounded-lg">
                        {prod.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-gray-900 block truncate max-w-[180px]">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase">
                        {prod.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-black text-sm text-gray-900 block">
                      $ {prod.price}
                    </span>
                    <span className="text-[9px] font-mono text-[#C08A3E] uppercase">
                      #{prod.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
