import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, getCachedProducts } from '../services/api';
import { useCart } from '../context/CartContext';

// ──────────────────────────────────────────────────────────────────────────────
// FeaturedProducts — Standalone, reusable product showcase for the homepage.
// Shows all active in-stock products with category badges. No filtering here;
// filtering lives on the /collection page.
// ──────────────────────────────────────────────────────────────────────────────

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { addItemToCart } = useCart();

  const [productsList, setProductsList] = useState(() => getCachedProducts());
  const [loading, setLoading] = useState(() => getCachedProducts().length === 0);
  const [addedProductId, setAddedProductId] = useState(null);

  // Fetch live products from database on mount
  useEffect(() => {
    let isMounted = true;
    if (productsList.length === 0) setLoading(true);

    fetchProducts()
      .then((prods) => {
        if (isMounted && Array.isArray(prods) && prods.length > 0) {
          setProductsList(prods);
        }
      })
      .catch((err) => {
        console.error('Error fetching featured products:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Show all active in-stock products
  const allProducts = productsList.filter(
    (p) => p.inStock !== false && p.in_stock !== false
  );

  const handleAddToBag = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    const defaultSize = product.sizes?.[0] || { size: 'Full Size', price: product.price };
    addItemToCart(product, defaultSize, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1600);
  };

  return (
    <section id="collection" className="w-full bg-white text-[#111111] font-sans pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 px-4 sm:px-6 md:px-8 lg:px-12 scroll-mt-24">
      {/* ── Standout Haute Parfumerie Collection Header ── */}
      <div className="relative w-full max-w-7xl mx-auto mb-10 sm:mb-14 text-center overflow-hidden py-4 sm:py-6">
        {/* Ghost typography watermark for high-fashion editorial depth matching hero */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black text-[14vw] sm:text-[12vw] lg:text-[130px] tracking-tighter text-black/[0.035] uppercase whitespace-nowrap pointer-events-none select-none z-0"
        >
          COLLECTION
        </div>

        {/* Main Bold Monochromatic Headline matching website theme */}
        <h2 className="relative z-10 font-serif font-black text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] text-[#111111] uppercase tracking-tight leading-[1.05] mb-3 sm:mb-4">
          OUR CURATED COLLECTION
        </h2>

        {/* Editorial Subtitle */}
        <p className="relative z-10 font-sans text-xs sm:text-sm md:text-base text-[#555555] font-light max-w-xl mx-auto leading-relaxed tracking-wide px-4">
          Discover handcrafted fragrance creations, botanical body elixirs, and luxurious gift ensembles formulated in Grasse & Paris.
        </p>

        {/* Clean Minimalist Monochrome Divider */}
        <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
          <span className="block w-12 sm:w-16 h-px bg-black/15" />
          <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
          <span className="block w-12 sm:w-16 h-px bg-black/15" />
        </div>
      </div>

      {/* ── Products Grid ── */}
      {loading ? (
        <div className="w-full max-w-7xl mx-auto py-24 text-center">
          <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-[#737373] font-bold">
            Loading Live Collection...
          </p>
        </div>
      ) : allProducts.length === 0 ? (
        <div className="w-full max-w-7xl mx-auto py-16 text-center bg-[#F4F4F6] border border-black/10">
          <p className="font-serif text-lg text-[#555555] uppercase">No Creations Available</p>
          <p className="font-sans text-xs text-[#777777] mt-1">
            Our collection is being curated. Check back soon.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 md:gap-6 lg:gap-8 pt-2">
          {allProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex flex-col bg-[#F4F4F6] border border-black/5 rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group cursor-pointer"
            >
              {/* Category Tag Badge */}
              <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10 flex gap-1">
                {product.category && (
                  <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-black/80 backdrop-blur-md text-[7px] xs:text-[8px] sm:text-[9.5px] font-sans tracking-[0.15em] sm:tracking-[0.18em] text-white uppercase rounded-none font-bold">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Product Image with hover swap */}
              <div className="w-full h-44 xs:h-52 sm:h-64 md:h-72 bg-[#F5F5F7] relative overflow-hidden border-b border-black/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0"
                />
                <img
                  src={product.galleryImages?.[1] || product.galleryImages?.[0] || product.image}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-2.5 xs:p-3 sm:p-4 flex flex-col justify-between flex-1 bg-white gap-1.5 sm:gap-2">
                <div>
                  <span className="text-[8px] xs:text-[9px] font-sans font-extrabold text-[#777777] tracking-widest uppercase block mb-0.5">
                    {product.category}
                  </span>
                  <h3 className="font-serif font-black text-[11px] xs:text-xs sm:text-sm md:text-base text-[#111111] uppercase tracking-tight leading-tight sm:leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-sans text-gray-500 font-medium line-clamp-1 mt-0.5">
                    {product.frenchName || product.subtitle || 'Extrait de Parfum'}
                  </p>
                </div>

                {/* Price & Add to Bag */}
                <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-1 gap-2">
                  <span className="font-serif font-black text-xs sm:text-sm text-[#111111] shrink-0">
                    $ {product.price}
                  </span>
                  <button
                    onClick={(e) => handleAddToBag(e, product)}
                    className={`relative flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[8px] sm:text-[10px] font-sans font-extrabold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer overflow-hidden ${
                      addedProductId === product.id
                        ? 'bg-[#1a7a3a] text-white'
                        : 'bg-[#111111] text-white hover:bg-black/80'
                    }`}
                  >
                    {addedProductId === product.id ? (
                      <>
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                          />
                        </svg>
                        <span className="hidden sm:inline">ADDED</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="hidden sm:inline">ADD TO BAG</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
