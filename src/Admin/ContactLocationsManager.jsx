import { useState, useEffect } from 'react';
import { fetchContactMessages, updateContactStatus, deleteContactMsg } from '../services/api';

const STATUS_CONFIG = {
  new: { label: 'NEW', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', border: 'border-[#EF4444]/20' },
  read: { label: 'READ', bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]', border: 'border-[#3B82F6]/20' },
  replied: { label: 'REPLIED', bg: 'bg-[#059669]/10', text: 'text-[#059669]', border: 'border-[#059669]/20' },
  archived: { label: 'ARCHIVED', bg: 'bg-[#9CA3AF]/10', text: 'text-[#9CA3AF]', border: 'border-[#9CA3AF]/20' }
};

export default function ContactLocationsManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    const data = await fetchContactMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateContactStatus(id, newStatus);
    if (result.success) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this message?')) return;
    const result = await deleteContactMsg(id);
    if (result.success) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredMessages = filter === 'all' ? messages : messages.filter(m => m.status === filter);

  // Stats
  const newCount = messages.filter(m => m.status === 'new').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusBadge = (status) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
    return (
      <span className={`px-2.5 py-0.5 ${cfg.bg} ${cfg.text} border ${cfg.border} font-extrabold text-[8px] tracking-widest uppercase rounded-full`}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
          CUSTOMER SUPPORT
        </span>
        <h2 className="font-serif font-black text-2xl text-[#111111] uppercase tracking-tight">
          INQUIRIES & MESSAGES
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#111]">{messages.length}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">TOTAL</div>
        </div>
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#EF4444]">{newCount}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">NEW</div>
        </div>
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#3B82F6]">{readCount}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">READ</div>
        </div>
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#059669]">{repliedCount}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">REPLIED</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'read', 'replied', 'archived'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-[9px] font-extrabold tracking-widest uppercase rounded-full border transition-all cursor-pointer ${
              filter === f
                ? 'bg-[#111] text-white border-[#111]'
                : 'bg-transparent text-[#888] border-black/10 hover:border-[#C08A3E] hover:text-[#C08A3E]'
            }`}
          >
            {f} {f !== 'all' ? `(${messages.filter(m => f === 'all' || m.status === f).length})` : `(${messages.length})`}
          </button>
        ))}
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-[#C08A3E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#999]">LOADING MESSAGES...</p>
          </div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#999]">
            {filter === 'all' ? 'NO MESSAGES YET' : `NO ${filter.toUpperCase()} MESSAGES`}
          </p>
          <p className="text-xs text-[#999] mt-1 font-serif italic">
            Customer inquiries submitted via the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-[#F4F4F6] border rounded-2xl overflow-hidden transition-all ${
                msg.status === 'new' ? 'border-[#EF4444]/30' : 'border-black/10'
              } hover:border-[#C08A3E]/30`}
            >
              {/* Header Row — always visible */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-[#111] uppercase tracking-wider">
                        {msg.full_name}
                      </span>
                      {statusBadge(msg.status)}
                    </div>
                    <p className="text-[10px] font-bold text-[#C08A3E] tracking-wider uppercase mt-1">
                      {msg.email}
                    </p>
                    {msg.subject && (
                      <p className="text-xs font-bold text-[#333] mt-1.5">{msg.subject}</p>
                    )}
                    <p className="text-xs text-[#666] mt-1 line-clamp-1 font-serif italic">
                      "{msg.message}"
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] font-bold text-[#AAA] tracking-wider uppercase block">
                      {formatDate(msg.created_at)}
                    </span>
                    <span className="text-[10px] text-[#CCC] mt-1 block">
                      {expandedId === msg.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedId === msg.id && (
                <div className="px-5 pb-5 border-t border-black/5 pt-4 space-y-4">
                  {/* Full Message */}
                  <div>
                    <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mb-1.5">FULL MESSAGE</div>
                    <p className="text-xs text-[#333] leading-relaxed font-serif whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-black/5">
                    <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mr-2">SET STATUS:</span>
                    {['new', 'read', 'replied', 'archived'].map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(msg.id, s)}
                        disabled={msg.status === s}
                        className={`px-3 py-1 text-[9px] font-extrabold tracking-widest uppercase rounded-full border transition-all cursor-pointer ${
                          msg.status === s
                            ? 'bg-[#111] text-white border-[#111]'
                            : 'border-black/15 text-[#666] hover:border-[#C08A3E] hover:text-[#C08A3E]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <div className="flex-1" />
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="px-3 py-1 text-[9px] font-extrabold tracking-widest uppercase rounded-full border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
