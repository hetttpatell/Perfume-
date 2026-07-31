import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('lune_token');
        const res = await axios.post(`${API_BASE_URL}/orders/list`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <span className="text-[10px] font-sans font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
          FULFILLMENT & TRANSACTIONS
        </span>
        <h2 className="font-serif font-black text-2xl text-[#111111] uppercase tracking-tight">
          CUSTOMER ORDERS MANAGER
        </h2>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[#555555]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-10 text-center bg-[#F4F4F6] border border-black/10 rounded-2xl">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111]">NO ORDERS PLACED YET</h4>
          <p className="font-sans text-xs text-[#555555] mt-1">Live customer orders will be listed here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div>
                  <span className="font-sans font-extrabold text-xs text-[#111111] uppercase tracking-wider block">
                    ORDER #{order.id}
                  </span>
                  <span className="text-[10px] text-[#555555] font-semibold">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>
                <span className="px-3 py-1 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-sans font-extrabold text-[9.5px] tracking-widest uppercase rounded-full">
                  {order.status || 'PAID'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#555555] uppercase block">TOTAL AMOUNT</span>
                  <span className="font-serif font-extrabold text-lg text-[#111111]">$ {order.total}</span>
                </div>
                <span className="text-xs font-sans text-[#555555] font-semibold">
                  Customer ID: {order.user_id?.slice(0, 8)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
