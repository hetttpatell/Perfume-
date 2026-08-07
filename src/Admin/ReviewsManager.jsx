import { useState, useEffect } from 'react';
import { fetchAllReviews, deleteReviewById } from '../services/api';
import { useConfirm } from '../components/ConfirmModal';

export default function ReviewsManager() {
  const { confirm } = useConfirm();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    const data = await fetchAllReviews();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    const ok = await confirm('Are you sure you want to delete this customer review? This action cannot be undone.', {
      title: 'Delete Review',
      confirmLabel: 'DELETE',
      danger: true
    });
    if (!ok) return;
    setDeleting(id);
    const result = await deleteReviewById(id);
    if (result.success) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
    setDeleting(null);
  };

  // Stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
    : '0.0';
  const verifiedCount = reviews.filter(r => r.verified).length;
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#C08A3E' : '#D1D5DB', fontSize: '13px' }}>★</span>
    ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
          CUSTOMER SENTIMENT
        </span>
        <h2 className="font-serif font-black text-2xl text-[#111111] uppercase tracking-tight">
          REVIEWS & RATINGS MODERATION
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#111]">{totalReviews}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">TOTAL REVIEWS</div>
        </div>
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#C08A3E]">{avgRating}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">AVG RATING</div>
        </div>
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#059669]">{verifiedCount}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">VERIFIED</div>
        </div>
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#6366F1]">{totalReviews - verifiedCount}</div>
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mt-1">UNVERIFIED</div>
        </div>
      </div>

      {/* Rating Breakdown */}
      {totalReviews > 0 && (
        <div className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5">
          <div className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#888] mb-3">RATING DISTRIBUTION</div>
          <div className="space-y-1.5">
            {ratingBreakdown.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-[#111] w-6 text-right">{star}★</span>
                <div className="flex-1 h-2.5 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%',
                      backgroundColor: star >= 4 ? '#C08A3E' : star === 3 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-[#888] w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-[#C08A3E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#999]">LOADING REVIEWS...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#999]">NO REVIEWS YET</p>
          <p className="text-xs text-[#999] mt-1 font-serif italic">Customer reviews will appear here once submitted.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 space-y-3 hover:border-[#C08A3E]/30 transition-colors">
              {/* Top Row: Author, Rating, Product */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#111] uppercase tracking-wider">
                      {r.author || 'Anonymous'}
                    </span>
                    <span className="flex items-center gap-0.5">{renderStars(r.rating)}</span>
                    <span className="text-[10px] font-bold text-[#888]">({r.rating}.0)</span>
                  </div>
                  {r.product?.name && (
                    <p className="text-[10px] font-bold tracking-wider uppercase text-[#C08A3E] mt-1">
                      {r.product.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.verified ? (
                    <span className="px-2.5 py-0.5 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-extrabold text-[8px] tracking-widest uppercase rounded-full">
                      VERIFIED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 font-extrabold text-[8px] tracking-widest uppercase rounded-full">
                      UNVERIFIED
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              {r.title && (
                <p className="font-bold text-xs text-[#222]">{r.title}</p>
              )}

              {/* Comment */}
              <p className="font-serif italic text-xs text-[#444] leading-relaxed">
                "{r.comment}"
              </p>

              {/* Bottom Row: Date, Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-black/5">
                <span className="text-[10px] font-bold text-[#AAA] tracking-wider uppercase">
                  {formatDate(r.created_at)}
                </span>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="px-4 py-2 text-[10px] font-extrabold tracking-widest uppercase rounded-full border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {deleting === r.id ? 'DELETING...' : 'DELETE'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
