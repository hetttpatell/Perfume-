import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, toggleProductFlags, fetchAllOrdersAdmin, updateOrderStatusAdmin } from '../services/api';
import { useConfirm } from './ConfirmModal';
import CustomStageSelect from './CustomStageSelect';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const ORDER_STAGES = [
  { value: 'ordered', label: '1. ORDERED', badgeBg: 'bg-amber-500/10 text-amber-800 border-amber-500/25' },
  { value: 'dispatched', label: '2. DISPATCHED', badgeBg: 'bg-blue-500/10 text-blue-800 border-blue-500/25' },
  { value: 'out_for_delivery', label: '3. OUT FOR DELIVERY', badgeBg: 'bg-purple-500/10 text-purple-800 border-purple-500/25' },
  { value: 'delivered', label: '4. DELIVERED', badgeBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25' }
];

export default function AdminPanelModal({ isOpen, onClose }) {
  const { alert: showAlertModal } = useConfirm();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsData, ordersData] = await Promise.all([
        fetchProducts(),
        fetchAllOrdersAdmin()
      ]);
      setProducts(prodsData || []);
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Error loading admin panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await updateOrderStatusAdmin(orderId, newStatus);
      if (res.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        const stageObj = ORDER_STAGES.find(s => s.value === newStatus) || { label: newStatus };
        setStatusMessage(`Order #${orderId.slice(0, 8).toUpperCase()} updated to "${stageObj.label}". Saved to database.`);
        setTimeout(() => setStatusMessage(''), 4000);
      } else {
        showAlertModal(res.error || 'Failed to update order status');
      }
    } catch (err) {
      showAlertModal('Failed to update status: ' + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleToggle = async (product, flagType) => {
    setTogglingId(product.id);
    const updatedHero = flagType === 'hero' ? !product.isHero : product.isHero;
    const updatedFeatured = flagType === 'featured' ? !product.isFeatured : product.isFeatured;

    try {
      await toggleProductFlags(product.id, { isHero: updatedHero, isFeatured: updatedFeatured });
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id
            ? { ...p, isHero: updatedHero, isFeatured: updatedFeatured }
            : p
        )
      );
      setStatusMessage(`Updated ${product.name} showcase flags.`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      showAlertModal('Failed to update showcase flags');
    } finally {
      setTogglingId(null);
    }
  };

  const handleImageUpload = async (productId, file) => {
    if (!file) return;
    setUploadingId(productId);
    setStatusMessage('Converting image to .webp and uploading to Supabase...');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('productId', productId);

      const token = localStorage.getItem('lune_token');
      const response = await axios.post(`${API_BASE_URL}/admin/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setStatusMessage('Image converted to WebP & uploaded successfully!');
        loadData();
      }
    } catch (err) {
      showAlertModal('Image upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingId(null);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-4 sm:inset-10 z-50 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans border border-black/10 max-w-5xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#111111] text-white p-6 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-[#C08A3E]">
                  LUNE • ADMIN CONTROL CENTER
                </span>
                <h2 className="font-serif font-black text-xl sm:text-2xl uppercase tracking-tight">
                  LIVE ORDER STAGES & CATALOG MANAGEMENT
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex border-b border-black/10 bg-[#F4F4F6] px-6 shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-5 text-xs font-sans font-extrabold tracking-[0.2em] uppercase transition-all cursor-pointer border-b-2 ${
                  activeTab === 'orders' ? 'border-[#111111] text-[#111111] bg-white' : 'border-transparent text-[#737373] hover:text-[#111111]'
                }`}
              >
                📦 ORDER STAGE MANAGER ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 px-5 text-xs font-sans font-extrabold tracking-[0.2em] uppercase transition-all cursor-pointer border-b-2 ${
                  activeTab === 'products' ? 'border-[#111111] text-[#111111] bg-white' : 'border-transparent text-[#737373] hover:text-[#111111]'
                }`}
              >
                🖼 CATALOG & WEBP SHOWCASE ({products.length})
              </button>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
              <div className="bg-[#ECFDF5] border-b border-[#10B981]/30 px-6 py-2.5 text-xs text-[#065F46] font-medium flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Scrollable Main Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F8FA]">
              {loading ? (
                <div className="py-20 text-center text-sm font-sans text-[#555555]">
                  Loading admin dashboard data...
                </div>
              ) : activeTab === 'orders' ? (
                /* TAB 1: ORDER STAGE MANAGER */
                orders.length === 0 ? (
                  <div className="py-16 text-center text-sm font-sans text-[#737373] bg-white rounded-2xl border border-black/10">
                    No customer orders found in database.
                  </div>
                ) : (
                  orders.map((order) => {
                    const currentStatus = (order.status || 'ordered').toLowerCase();

                    return (
                      <div
                        key={order.id}
                        className="bg-white border border-black/10 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                      >
                        {/* Top Row: Order Details & Stage Select */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-black/10">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-extrabold text-sm text-[#111111] tracking-wider">
                                ORDER #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className="text-[11px] text-[#737373] font-semibold">
                                • {new Date(order.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <label className="text-[10px] font-sans font-extrabold tracking-widest text-[#111111] uppercase">
                              STAGE STATUS:
                            </label>
                            <CustomStageSelect
                              value={currentStatus === 'pending' ? 'ordered' : currentStatus === 'received' ? 'delivered' : currentStatus}
                              disabled={updatingOrderId === order.id}
                              onChange={(newStatus) => handleUpdateOrderStatus(order.id, newStatus)}
                            />
                          </div>
                        </div>

                        {/* Customer Address Details Card */}
                        {order.shipping_address && (
                          <div className="bg-[#F8F8FA] border border-black/5 rounded-2xl p-4 text-xs font-sans grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="text-[9.5px] font-bold text-[#C08A3E] uppercase tracking-wider block">CLIENT CONTACT</span>
                              <p className="font-extrabold text-[#111111] text-xs">{order.shipping_address.fullName || 'Valued Client'}</p>
                              <p className="text-[#555555] font-semibold text-[11px]">{order.shipping_address.phone || 'No phone'}</p>
                            </div>
                            <div>
                              <span className="text-[9.5px] font-bold text-[#C08A3E] uppercase tracking-wider block">SHIPPING ADDRESS</span>
                              <p className="font-medium text-[#111111] text-[11px] leading-relaxed">
                                {order.shipping_address.street || ''}, {order.shipping_address.city || ''}, {order.shipping_address.country || ''}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Product Items Breakdown with Photos */}
                        <div className="space-y-2.5 pt-1">
                          <span className="text-[10px] font-sans font-bold text-[#C08A3E] uppercase tracking-wider block">
                            CREATIONS INCLUDED ({order.items?.length || 0})
                          </span>

                          <div className="space-y-2">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((it, idx) => {
                                const prodImg = it.product?.image_url || it.product?.image || '/SVGs/Perfume-SVG.png';
                                const prodName = it.product?.name || 'Lune Fragrance';
                                const frenchName = it.product?.french_name || '';

                                return (
                                  <div key={idx} className="flex items-center gap-3.5 p-3 bg-[#F9F9FB] rounded-2xl border border-black/5">
                                    <img
                                      src={prodImg}
                                      alt={prodName}
                                      className="w-14 h-14 object-contain bg-white rounded-xl p-1 border border-black/10 shrink-0 shadow-2xs"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-serif text-xs font-extrabold text-[#111111] uppercase truncate">
                                        {prodName}
                                      </h4>
                                      {frenchName && <p className="text-[10px] text-[#737373] italic truncate">{frenchName}</p>}
                                      <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-[#555555]">
                                        <span className="font-semibold">SIZE: <strong className="text-[#111111]">{it.size || '50 ml'}</strong></span>
                                        <span>•</span>
                                        <span className="font-semibold">QTY: <strong className="text-[#111111]">{it.quantity}</strong></span>
                                      </div>
                                      {it.engraving_text && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#C08A3E]/10 text-[#9A6B29] border border-[#C08A3E]/20 text-[9px] font-bold rounded-full uppercase tracking-wider">
                                          ✨ ENGRAVING: "{it.engraving_text}"
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="font-serif font-black text-xs text-[#111111]">
                                        ${((Number(it.unit_price) || 0) * (it.quantity || 1)).toFixed(2)} USD
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-xs text-[#737373] italic">No item details available.</p>
                            )}
                          </div>
                        </div>

                        {/* Financial Breakdown: Actual Amount, Coupon Discount, Final Amount Paid */}
                        {(() => {
                          const items = order.items || order.order_items || [];
                          let subtotal = Number(order.subtotal || 0);
                          if (subtotal === 0 && Array.isArray(items) && items.length > 0) {
                            subtotal = items.reduce((sum, it) => {
                              const price = Number(it.unit_price || it.price || it.product?.price || 0);
                              const qty = Number(it.quantity || it.qty || 1);
                              return sum + (price * qty);
                            }, 0);
                          }
                          let discount = Number(order.discount_amount || order.discountAmount || order.discount || 0);
                          let finalTotal = Number(order.total || order.total_amount || order.totalAmount || 0);
                          if (finalTotal === 0) {
                            finalTotal = Math.max(0, subtotal - discount);
                          }
                          if (discount === 0 && subtotal > finalTotal && finalTotal > 0) {
                            discount = subtotal - finalTotal;
                          }
                          const pct = subtotal > 0 && discount > 0 ? Math.round((discount / subtotal) * 100) : 0;

                          return (
                            <div className="mt-3 pt-3 border-t border-black/10 font-sans space-y-2 bg-[#F8F8FA] p-3.5 rounded-2xl border border-gray-200/80">
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span className="font-extrabold uppercase tracking-wider">1. ACTUAL AMOUNT (SUBTOTAL)</span>
                                <span className="font-mono font-bold text-gray-900">${subtotal.toFixed(2)} USD</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-[#C08A3E]">
                                <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                  <span>2. COUPON DISCOUNT</span>
                                  {pct > 0 && (
                                    <span className="text-[9px] bg-[#C08A3E]/15 text-[#C08A3E] px-2 py-0.5 rounded-full border border-[#C08A3E]/30 font-black">
                                      -{pct}% OFF
                                    </span>
                                  )}
                                </span>
                                <span className="font-mono font-bold">{discount > 0 ? `-$${discount.toFixed(2)} USD` : '$0.00 USD'}</span>
                              </div>
                              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                                <span className="text-xs font-black text-[#111111] uppercase tracking-wider">3. FINAL AMOUNT PAID</span>
                                <span className="font-serif font-black text-lg text-[#111111]">${finalTotal.toFixed(2)} USD</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })
                )
              ) : (
                /* TAB 2: PRODUCT CATALOG & WEBP MANAGER */
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-black/10 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 hover:shadow-md transition-shadow"
                  >
                    {/* Left: Product Info */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-black/10 shrink-0"
                      />
                      <div>
                        <span className="text-[9px] font-sans font-extrabold tracking-widest text-[#C08A3E] uppercase block">
                          ID: {product.id}
                        </span>
                        <h4 className="font-serif font-extrabold text-base text-[#111111] uppercase">
                          {product.name}
                        </h4>
                        <p className="text-xs font-sans text-[#555555] font-semibold">
                          {product.frenchName || product.category} • $ {product.price}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Hero & Featured Toggles */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                      <button
                        disabled={togglingId === product.id}
                        onClick={() => handleToggle(product, 'hero')}
                        className={`px-4 py-2 rounded-full text-[10px] font-sans font-extrabold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                          product.isHero
                            ? 'bg-[#111111] text-white shadow-xs'
                            : 'bg-[#F4F4F6] text-[#737373] hover:text-[#111111] border border-black/10'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.isHero ? 'bg-[#10B981]' : 'bg-gray-400'}`} />
                        <span>HERO SHOWCASE {product.isHero ? '(ACTIVE)' : ''}</span>
                      </button>

                      <button
                        disabled={togglingId === product.id}
                        onClick={() => handleToggle(product, 'featured')}
                        className={`px-4 py-2 rounded-full text-[10px] font-sans font-extrabold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                          product.isFeatured
                            ? 'bg-[#C08A3E] text-white shadow-xs'
                            : 'bg-[#F4F4F6] text-[#737373] hover:text-[#111111] border border-black/10'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.isFeatured ? 'bg-white' : 'bg-gray-400'}`} />
                        <span>FEATURED {product.isFeatured ? '(ACTIVE)' : ''}</span>
                      </button>
                    </div>

                    {/* Right: WebP Image Upload Button */}
                    <div className="shrink-0 w-full md:w-auto">
                      <label className="px-4 py-2 bg-white border border-black/20 hover:border-black text-[#111111] hover:bg-black hover:text-white font-sans font-extrabold text-[10px] tracking-widest uppercase rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{uploadingId === product.id ? 'UPLOADING WEBP...' : 'UPLOAD WEBP IMAGE'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
