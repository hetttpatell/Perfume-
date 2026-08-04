import { useState, useEffect } from 'react';
import { useConfirm } from '../components/ConfirmModal';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export default function UsersManager() {
  const { confirm } = useConfirm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: '', type: 'info' }), 4000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('lune_token');
      const response = await axios.post(`${API_BASE_URL}/admin/users/list`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      showToast('Failed to load users list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    const ok = await confirm(`Are you sure you want to change ${user.full_name || user.email}'s role to ${newRole.toUpperCase()}?`, {
      title: 'Change User Role',
      confirmLabel: 'CHANGE ROLE'
    });
    if (!ok) return;

    try {
      const token = localStorage.getItem('lune_token');
      const response = await axios.post(`${API_BASE_URL}/admin/users/update-role`, {
        userId: user.id,
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        showToast(`Role for ${user.email} updated to ${newRole.toUpperCase()}`);
      }
    } catch (err) {
      showToast('Failed to update user role: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.email?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 font-sans relative text-gray-900">
      {/* Toast Notification */}
      {toast.open && (
        <div className="fixed top-6 right-6 z-50 animate-bounce-in max-w-md w-full">
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
            MAISON LUNE • USER MANAGEMENT
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-gray-900 uppercase tracking-tight">
            REGISTERED WEBSITE CLIENTS & USERS
          </h1>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <svg className="w-4 h-4 absolute left-4 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-full text-xs text-gray-900 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-gray-500 uppercase mr-1">ROLE:</span>
          {['ALL', 'admin', 'customer'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                roleFilter === r ? 'bg-[#111111] text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-24 text-center text-sm text-gray-500 font-medium">Loading website users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <h4 className="font-serif font-extrabold text-base uppercase text-gray-900">NO USERS FOUND</h4>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-extrabold text-gray-500 tracking-[0.2em] uppercase">
                  <th className="py-4 px-5">USER PROFILE</th>
                  <th className="py-4 px-5">EMAIL ADDRESS</th>
                  <th className="py-4 px-5 text-center">ROLE</th>
                  <th className="py-4 px-5 text-center">REGISTERED DATE</th>
                  <th className="py-4 px-5 text-right">ROLE ACTION</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs uppercase shadow-xs">
                            {(u.full_name || u.email || 'U').charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-900 block">
                              {u.full_name || 'Maison Lune Client'}
                            </span>
                            <span className="font-mono text-[9px] text-[#C08A3E]">
                              #{u.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-medium text-gray-800">
                        {u.email}
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className={`px-3 py-1 text-[9px] font-black tracking-wider uppercase rounded-full border ${
                          isAdmin
                            ? 'bg-[#C08A3E]/15 text-[#C08A3E] border-[#C08A3E]/30'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-center text-gray-500 font-mono text-[10px]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          className={`px-4 py-1.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
                            isAdmin
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                              : 'bg-gray-900 hover:bg-black text-white shadow-xs'
                          }`}
                        >
                          {isAdmin ? 'REVOKE ADMIN' : 'MAKE ADMIN ★'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
