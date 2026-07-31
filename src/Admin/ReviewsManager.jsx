import { useState } from 'react';

export default function ReviewsManager() {
  const [reviews] = useState([
    { id: 1, author: 'Éléonore R.', rating: 5, comment: 'An ethereal creation with Iris Pallida and Galbanum. Unmatched longevity.', verified: true },
    { id: 2, author: 'Marc V.', rating: 5, comment: 'The extrait de parfum concentration is deeply hypnotic.', verified: true },
    { id: 3, author: 'Sophie D.', rating: 4, comment: 'Fast delivery from Paris boutique. Beautiful custom engraving.', verified: true }
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <span className="text-[10px] font-sans font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
          CUSTOMER SENTIMENT
        </span>
        <h2 className="font-serif font-black text-2xl text-[#111111] uppercase tracking-tight">
          REVIEWS & RATINGS MODERATION
        </h2>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-xs text-[#111111] uppercase tracking-wider">
                {r.author} • ★★★★★ ({r.rating}.0)
              </span>
              <span className="px-2.5 py-0.5 bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-sans font-extrabold text-[8.5px] tracking-widest uppercase rounded-full">
                VERIFIED PURCHASER
              </span>
            </div>
            <p className="font-serif italic text-xs text-[#444444] leading-relaxed">
              “{r.comment}”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
