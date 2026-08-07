import { useState, useEffect } from 'react';
import { fetchAllOrdersAdmin, updateOrderStatusAdmin } from '../services/api';
import CustomStageSelect from '../components/CustomStageSelect';

const ORDER_STAGES = [
  { value: 'ordered', label: '1. ORDERED', badge: 'bg-amber-500/10 text-amber-800 border-amber-500/30' },
  { value: 'dispatched', label: '2. DISPATCHED', badge: 'bg-blue-500/10 text-blue-800 border-blue-500/30' },
  { value: 'out_for_delivery', label: '3. OUT FOR DELIVERY', badge: 'bg-purple-500/10 text-purple-800 border-purple-500/30' },
  { value: 'delivered', label: '4. DELIVERED', badge: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30' }
];

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrdersAdmin();
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
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
        alert(res.error || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <span className="text-[10px] font-sans font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
            FULFILLMENT CONTROL & STAGE MANAGEMENT
          </span>
          <h2 className="font-serif font-black text-2xl text-[#111111] uppercase tracking-tight">
            CLIENT ORDERS & STAGE TRACKER
          </h2>
        </div>

        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-white border border-black/20 hover:border-black text-[#111111] font-sans font-extrabold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95 flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>REFRESH ORDERS</span>
        </button>
      </div>

      {statusMessage && (
        <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-4 rounded-2xl text-xs text-[#065F46] font-medium flex items-center gap-2.5 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>{statusMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-[#555555]">Loading live customer orders from database...</div>
      ) : orders.length === 0 ? (
        <div className="p-10 text-center bg-[#F4F4F6] border border-black/10 rounded-2xl space-y-2">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111]">NO ORDERS PLACED YET</h4>
          <p className="font-sans text-xs text-[#555555]">Live customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const rawStatus = (order.status || 'ordered').toLowerCase();
            const currentStatus = rawStatus === 'pending' ? 'ordered' : rawStatus === 'received' ? 'delivered' : rawStatus;
            const currentStageObj = ORDER_STAGES.find(s => s.value === currentStatus) || ORDER_STAGES[0];
            const address = order.shipping_address || {};

            return (
              <div key={order.id} className="bg-white border border-black/10 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-5">
                {/* 1. Header Row: Order ID, Date & Interactive Stage Select Dropdown */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-black/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-extrabold text-base text-[#111111] tracking-wider">
                        ORDER #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 font-sans font-extrabold text-[9.5px] tracking-widest uppercase rounded-full border ${currentStageObj.badge}`}>
                        {currentStageObj.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#666666] font-medium">
                      Placed on <strong className="text-[#111111]">{new Date(order.created_at).toLocaleString()}</strong>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-[#F8F9FC] border border-black/10 rounded-2xl p-2.5 shrink-0 w-full lg:w-auto">
                    <label className="text-[10px] font-sans font-extrabold tracking-widest text-[#111111] uppercase pl-1 shrink-0">
                      UPDATE STAGE:
                    </label>
                    <CustomStageSelect
                      value={currentStatus}
                      disabled={updatingId === order.id}
                      onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    />
                  </div>
                </div>

                {/* 2. Customer & Shipping Details Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F8FA] border border-black/5 rounded-2xl p-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-[#C08A3E] uppercase tracking-wider block">CLIENT CONTACT</span>
                    <p className="font-extrabold text-[#111111] text-sm">{address.fullName || 'Valued Client'}</p>
                    <p className="text-[#555555] font-semibold">{address.phone || 'Phone not provided'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-[#C08A3E] uppercase tracking-wider block">DELIVERY ADDRESS</span>
                    <p className="font-medium text-[#111111] leading-relaxed">
                      {address.street || '31 Rue Cambon'}, {address.city || 'Paris'}, {address.state ? `${address.state}, ` : ''}{address.postalCode || '75001'}, {address.country || 'France'}
                    </p>
                  </div>
                </div>

                {/* 3. Products List with Images & Item Details */}
                <div className="space-y-3 pt-1">
                  <span className="text-[10px] font-sans font-bold text-[#C08A3E] uppercase tracking-wider block">
                    ORDERED CREATIONS ({order.items?.length || 0} ITEMS)
                  </span>

                  <div className="grid grid-cols-1 gap-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((it, idx) => {
                        const prodImg = it.product?.image_url || it.product?.image || '/SVGs/Perfume-SVG.png';
                        const prodName = it.product?.name || 'Lune Fragrance';
                        const frenchName = it.product?.french_name || it.product?.frenchName || '';

                        return (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-[#F9F9FB] rounded-2xl border border-black/5">
                            {/* Product Photo */}
                            <img
                              src={prodImg}
                              alt={prodName}
                              className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-black/10 shrink-0 shadow-2xs"
                            />

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-xs font-extrabold text-[#111111] uppercase truncate">
                                {prodName}
                              </h4>
                              {frenchName && (
                                <p className="text-[10px] font-sans text-[#737373] italic truncate">{frenchName}</p>
                              )}
                              <div className="flex items-center gap-3 mt-1 text-[11px] font-sans text-[#555555]">
                                <span className="font-semibold">SIZE: <strong className="text-[#111111]">{it.size || '50 ml'}</strong></span>
                                <span>•</span>
                                <span className="font-semibold">QTY: <strong className="text-[#111111]">{it.quantity}</strong></span>
                                <span>•</span>
                                <span className="font-semibold text-[#111111]">${Number(it.unit_price || 0).toFixed(2)} USD each</span>
                              </div>
                              {it.engraving_text && (
                                <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#C08A3E]/10 text-[#9A6B29] border border-[#C08A3E]/20 text-[9.5px] font-bold rounded-full uppercase tracking-wider">
                                  ✨ ENGRAVING: "{it.engraving_text}"
                                </span>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-serif font-black text-sm text-[#111111]">
                                ${((Number(it.unit_price) || 0) * (it.quantity || 1)).toFixed(2)} USD
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-[#737373] italic">No items detailed for this order.</p>
                    )}
                  </div>
                </div>

                {/* 4. Financial Breakdown: Actual Amount, Coupon Discount, Final Amount Paid */}
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
                    <div className="mt-4 pt-3.5 border-t border-black/10 font-sans space-y-2.5 bg-[#F8F8FA] p-4 rounded-2xl border border-gray-200/80">
                      {/* Amount 1: Actual Amount (Subtotal) */}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="font-extrabold uppercase tracking-wider">
                          1. ACTUAL AMOUNT (SUBTOTAL)
                        </span>
                        <span className="font-mono font-bold text-gray-900">
                          ${subtotal.toFixed(2)} USD
                        </span>
                      </div>

                      {/* Amount 2: Coupon Discounted Amount */}
                      <div className="flex items-center justify-between text-xs text-[#C08A3E]">
                        <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <span>2. COUPON DISCOUNT</span>
                          {pct > 0 && (
                            <span className="text-[9px] bg-[#C08A3E]/15 text-[#C08A3E] px-2 py-0.5 rounded-full border border-[#C08A3E]/30 font-black">
                              -{pct}% OFF
                            </span>
                          )}
                        </span>
                        <span className="font-mono font-bold">
                          {discount > 0 ? `-$${discount.toFixed(2)} USD` : '$0.00 USD'}
                        </span>
                      </div>

                      {/* Amount 3: Final Amount Paid */}
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs font-black text-[#111111] uppercase tracking-wider">
                          3. FINAL AMOUNT PAID
                        </span>
                        <span className="font-serif font-black text-xl text-[#111111]">
                          ${finalTotal.toFixed(2)} USD
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
