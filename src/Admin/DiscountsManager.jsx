import { useState, useEffect } from 'react';
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../services/api';
import { useConfirm } from '../components/ConfirmModal';

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#10B981]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function DiscountsManager() {
  const { confirm } = useConfirm();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    percentage: 15,
    maxUses: 100,
    isActive: true,
    validUntil: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: '', type: 'info' }), 4000);
  };

  const loadCoupons = async () => {
    setLoading(true);
    const data = await fetchDiscounts();
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      id: '',
      code: '',
      percentage: 15,
      maxUses: 100,
      isActive: true,
      validUntil: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      id: coupon.id,
      code: coupon.code || '',
      percentage: coupon.percentage || 15,
      maxUses: coupon.max_uses || 100,
      isActive: coupon.is_active !== false,
      validUntil: coupon.valid_until ? coupon.valid_until.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || formData.percentage === '') {
      showToast('Coupon code and percentage are required', 'error');
      return;
    }

    if (editingCoupon) {
      const res = await updateDiscount(formData);
      if (res.success) {
        showToast(`Coupon "${formData.code}" updated successfully!`);
        setIsModalOpen(false);
        loadCoupons();
      } else {
        showToast(res.error || 'Failed to update coupon', 'error');
      }
    } else {
      const res = await createDiscount(formData);
      if (res.success) {
        showToast(`New coupon "${formData.code}" created successfully!`);
        setIsModalOpen(false);
        loadCoupons();
      } else {
        showToast(res.error || 'Failed to create coupon', 'error');
      }
    }
  };

  const handleToggleActive = async (coupon) => {
    const updatedStatus = !coupon.is_active;
    const res = await updateDiscount({ id: coupon.id, isActive: updatedStatus });
    if (res.success) {
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: updatedStatus } : c));
      showToast(`Coupon "${coupon.code}" status updated.`);
    } else {
      showToast(res.error || 'Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (coupon) => {
    const ok = await confirm(`Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`, {
      title: 'Delete Coupon',
      confirmLabel: 'DELETE',
      danger: true
    });
    if (!ok) return;

    const res = await deleteDiscount(coupon.id);
    if (res.success) {
      showToast(`Coupon "${coupon.code}" deleted.`);
      loadCoupons();
    } else {
      showToast(res.error || 'Failed to delete coupon', 'error');
    }
  };

  const filteredCoupons = coupons.filter(c =>
    c.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans relative text-gray-900">
      {/* Toast Notification */}
      {toast.open && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-50 animate-bounce-in max-w-md w-auto">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-4 backdrop-blur-md ${
            toast.type === 'error' ? 'bg-red-900/95 text-white border-red-500/50' : 'bg-[#111111]/95 text-white border-[#C08A3E]/40'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${toast.type === 'error' ? 'bg-red-400' : 'bg-[#C08A3E]'} animate-ping`} />
              <p className="text-xs font-sans font-medium tracking-wide">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ open: false, message: '', type: 'info' })} className="text-gray-400 hover:text-white text-sm font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
            LUNE • PROMOTIONAL SUITE
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 uppercase tracking-tight">
            COUPONS & PROMOTIONAL DISCOUNTS
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3.5 bg-[#111111] hover:bg-black text-white font-extrabold text-xs tracking-[0.2em] uppercase rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-2.5 active:scale-95 border border-black/20 self-start sm:self-auto"
        >
          <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>CREATE NEW COUPON</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <svg className="w-4 h-4 absolute left-4 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-xs text-gray-900 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
          TOTAL COUPONS: <span className="text-gray-900 font-serif font-black">{filteredCoupons.length}</span>
        </div>
      </div>

      {/* Coupons Table & Mobile Cards */}
      {loading ? (
        <div className="py-24 text-center text-sm text-gray-500 font-medium">Loading promotional coupons...</div>
      ) : filteredCoupons.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <h4 className="font-serif font-extrabold text-base uppercase text-gray-900">NO COUPONS FOUND</h4>
        </div>
      ) : (
        <div className="space-y-4">
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-extrabold text-gray-500 tracking-[0.2em] uppercase">
                    <th className="py-4 px-5">COUPON CODE</th>
                    <th className="py-4 px-5 text-center">DISCOUNT %</th>
                    <th className="py-4 px-5 text-center">USAGE PROGRESS</th>
                    <th className="py-4 px-5 text-center">ACTIVE STATUS</th>
                    <th className="py-4 px-5 text-right">ACTIONS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredCoupons.map((coupon) => {
                    const used = coupon.used_count || 0;
                    const max = coupon.max_uses || 100;
                    const pct = Math.min(100, Math.round((used / max) * 100));

                    return (
                      <tr key={coupon.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-mono text-sm font-black text-gray-900 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 inline-block">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-serif font-black text-base text-[#C08A3E]">
                          {coupon.percentage}% OFF
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex flex-col items-center gap-1 max-w-[140px] mx-auto">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-[#111111] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[9px] font-extrabold text-gray-500 uppercase">
                              {used} / {max} USES ({pct}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <ToggleSwitch
                              checked={coupon.is_active !== false}
                              onChange={() => handleToggleActive(coupon)}
                            />
                            <span className={`text-[9px] font-extrabold uppercase ${coupon.is_active !== false ? 'text-[#10B981]' : 'text-gray-400'}`}>
                              {coupon.is_active !== false ? 'ACTIVE' : 'EXPIRED'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(coupon)}
                              className="p-2 bg-gray-100 hover:bg-gray-900 hover:text-white border border-gray-300 rounded-xl transition-all cursor-pointer"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(coupon)}
                              className="p-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-500 rounded-xl transition-all cursor-pointer"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARD ROW VIEW */}
          <div className="block md:hidden space-y-3.5">
            {filteredCoupons.map((coupon) => {
              const used = coupon.used_count || 0;
              const max = coupon.max_uses || 100;
              const pct = Math.min(100, Math.round((used / max) * 100));
              const isActive = coupon.is_active !== false;

              return (
                <div key={coupon.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-base font-black text-gray-900 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-xl border border-gray-200">
                      {coupon.code}
                    </span>
                    <span className="font-serif font-black text-lg text-[#C08A3E]">
                      {coupon.percentage}% OFF
                    </span>
                  </div>

                  <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex justify-between text-[10px] font-extrabold text-gray-600 uppercase">
                      <span>USAGE PROGRESS</span>
                      <span>{used} / {max} USES ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#111111] h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={isActive}
                        onChange={() => handleToggleActive(coupon)}
                      />
                      <span className={`text-[9px] font-extrabold uppercase ${isActive ? 'text-[#10B981]' : 'text-gray-400'}`}>
                        {isActive ? 'ACTIVE' : 'EXPIRED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-900 hover:text-white border border-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        ✏️ EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        🗑️ DELETE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="font-serif font-black text-xl text-gray-900 uppercase">
                {editingCoupon ? `EDIT COUPON: ${editingCoupon.code}` : 'CREATE NEW COUPON'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1">
                  COUPON CODE (UPPERCASE) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. LUNE20"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono font-bold text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1">
                    DISCOUNT PERCENTAGE (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-black text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase text-gray-900 mb-1">
                    MAXIMUM USAGE LIMIT
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-800 font-extrabold text-xs tracking-wider uppercase rounded-xl"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] hover:bg-black text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md"
                >
                  {editingCoupon ? 'SAVE CHANGES' : 'CREATE COUPON'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
