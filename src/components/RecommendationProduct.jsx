import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BOUTIQUE_PRODUCTS } from '../data/boutiqueProducts';

/**
 * RecommendationProduct — shows related products based on the currently
 * viewed product. Matches by shared category first, then fills with other
 * products so the user always sees recommendations. Excludes the current product.
 */
export default function RecommendationProduct({ currentProductId }) {
  const navigate = useNavigate();

  const recommendations = useMemo(() => {
    const current = BOUTIQUE_PRODUCTS.find((p) => p.id === currentProductId);
    if (!current) return BOUTIQUE_PRODUCTS.filter((p) => p.id !== currentProductId).slice(0, 3);

    const others = BOUTIQUE_PRODUCTS.filter((p) => p.id !== currentProductId);

    // 1. Same category products first (strongest relevance)
    const sameCategory = others.filter((p) => p.category === current.category);

    // 2. Products that share at least one fragrance note keyword
    const currentNoteWords = [
      ...(current.notes?.top || '').toLowerCase().split(/[\s,&]+/),
      ...(current.notes?.heart || '').toLowerCase().split(/[\s,&]+/),
      ...(current.notes?.base || '').toLowerCase().split(/[\s,&]+/),
    ].filter((w) => w.length > 3);

    const noteMatches = others.filter((p) => {
      if (sameCategory.includes(p)) return false; // already counted
      const pNotes = [
        ...(p.notes?.top || '').toLowerCase().split(/[\s,&]+/),
        ...(p.notes?.heart || '').toLowerCase().split(/[\s,&]+/),
        ...(p.notes?.base || '').toLowerCase().split(/[\s,&]+/),
      ].filter((w) => w.length > 3);
      return currentNoteWords.some((word) => pNotes.includes(word));
    });

    // 3. Remaining products as fallback
    const rest = others.filter((p) => !sameCategory.includes(p) && !noteMatches.includes(p));

    // Merge in priority order, cap at 3
    return [...sameCategory, ...noteMatches, ...rest].slice(0, 3);
  }, [currentProductId]);

  if (recommendations.length === 0) return null;

  return (
    <section className="w-full bg-white text-[#1A1A1A] py-14 sm:py-20 border-t border-black/10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Section Header — full-width partition line with centered text */}
        <div className="text-center mb-10 sm:mb-14 relative">
          {/* Full-width line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-screen h-[1px] bg-black/30" />

          {/* Text block over line */}
          <div className="relative inline-block bg-white px-6 sm:px-10">
            <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-[#737373] font-bold block mb-2">
              CURATED FOR YOU
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-tight text-[#111111]">
              You May Also Love
            </h2>
          </div>
        </div>

        {/* Product Cards Grid — Mobile-Optimized 1:1 Match */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-6 md:gap-6 lg:gap-8 pt-2">
          {recommendations.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                navigate(`/product/${product.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col bg-[#F4F4F6] border border-black/5 rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group cursor-pointer"
            >
              {/* Top Badge */}
              <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10">
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-black/85 backdrop-blur-md text-[7px] xs:text-[8px] sm:text-[9.5px] font-sans tracking-[0.15em] sm:tracking-[0.18em] text-white uppercase rounded-none font-bold">
                  {product.badge}
                </span>
              </div>

              {/* Studio Product Image Viewport — Full Edge-to-Edge with Hover Sub-Image */}
              <div className="w-full h-44 xs:h-52 sm:h-64 md:h-72 bg-[#F5F5F7] relative overflow-hidden border-b border-black/5">
                {/* Primary Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                />

                {/* Hover Sub-Image (Secondary Gallery View) */}
                <img
                  src={product.galleryImages?.[1] || product.galleryImages?.[0] || product.image}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Bottom Content Area */}
              <div className="p-2.5 xs:p-3 sm:p-5 flex flex-col justify-between flex-1 bg-[#F4F4F6] gap-2 sm:gap-3">
                <div>
                  <p className="font-sans text-[8px] xs:text-[8.5px] sm:text-[10px] text-[#555555] font-bold tracking-wider uppercase mb-0.5 sm:mb-1 line-clamp-1">
                    {product.subtitle}
                  </p>
                  <h3 className="font-sans font-extrabold text-[11px] xs:text-xs sm:text-sm md:text-base text-[#111111] uppercase tracking-wide leading-tight sm:leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                    {product.name}
                  </h3>
                </div>

                {/* Price & Full Width SHOP CTA Button */}
                <div className="flex flex-col gap-2 pt-2 border-t border-black/10 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-extrabold text-xs sm:text-sm md:text-base text-[#111111]">
                      {product.priceFormatted}
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] font-sans font-semibold tracking-widest text-[#555555] uppercase">
                      {product.sizes ? product.sizes[0].size : '100ML'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs font-sans font-extrabold tracking-[0.2em] uppercase text-white bg-[#111111] hover:bg-black transition-all duration-200 shadow-sm cursor-pointer active:scale-[0.98] text-center"
                  >
                    EXPLORE CREATION
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
