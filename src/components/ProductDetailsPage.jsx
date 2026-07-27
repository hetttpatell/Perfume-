import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BOUTIQUE_PRODUCTS } from '../data/boutiqueProducts';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import RecommendationProduct from './RecommendationProduct';

export default function ProductDetailsPage({
  cartItems,
  setCartItems,
  isCartOpen,
  setIsCartOpen,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find product by URL param id, or default to the first product (n19-extrait)
  const product = useMemo(() => {
    if (!id) return BOUTIQUE_PRODUCTS[0];
    const found = BOUTIQUE_PRODUCTS.find((p) => p.id === id);
    return found || BOUTIQUE_PRODUCTS[0];
  }, [id]);

  // Product Selection States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Lightbox Zoom state
  const [zoomImage, setZoomImage] = useState(null);

  // Reviews Drawer / Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, author: '', title: '', comment: '' });
  const [localReviews, setLocalReviews] = useState(product.reviews || []);

  const gallery = product.galleryImages || [product.image];

  // Fixed unit price
  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          size: { size: '30 ml / 1.0 FL. OZ.', price: unitPrice },
          quantity,
          price: unitPrice,
          totalPrice,
        },
      ];
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      setIsCartOpen(true);
    }, 800);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.author || !newReview.title || !newReview.comment) return;

    const created = {
      id: `rev-${Date.now()}`,
      author: newReview.author,
      rating: Number(newReview.rating),
      date: 'Just now',
      title: newReview.title,
      comment: newReview.comment,
      verified: true,
      helpfulCount: 0,
    };

    setLocalReviews((prev) => [created, ...prev]);
    setNewReview({ rating: 5, author: '', title: '', comment: '' });
    setIsReviewModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#1A1A1A] font-sans pt-28 sm:pt-36 lg:pt-40 pb-12 overflow-x-hidden">
      {/* Breadcrumb Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3 border-b border-black/10 text-[10px] sm:text-[11px] font-sans tracking-[0.2em] text-[#737373] uppercase flex items-center gap-2">
        <Link to="/" className="hover:text-[#1A1A1A] transition-colors">HOME</Link>
        <span>/</span>
        <Link to="/collection" className="hover:text-[#1A1A1A] transition-colors">COLLECTION</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-bold">{product.name}</span>
      </div>

      {/* Main Top Grid: Sticky Photos Gallery (Left) + Complete Luxury Details & Pricing Panel (Right) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
          
          {/* LEFT SECTION: STICKY GALLERY WITH WISHLIST & SHARE AT TOP */}
          <div className="w-full lg:w-7/12 lg:sticky lg:top-32 self-start">
            
            {/* ── MOBILE GALLERY (< sm screens): 1 Active Image + Horizontal Scroll ── */}
            <div className="block sm:hidden w-full space-y-2.5">
              {/* Main Image Container */}
              <div
                onClick={() => setZoomImage(gallery[selectedImageIndex] || product.image)}
                className="relative w-full h-[360px] xs:h-[420px] bg-[#F5F5F7] overflow-hidden flex items-center justify-center cursor-pointer select-none"
              >
                {/* Badge Tag */}
                <span className="absolute top-3 left-3 text-[9px] font-sans tracking-[0.2em] uppercase bg-black/85 text-white px-3 py-1 font-bold z-10">
                  {product.badge}
                </span>

                {/* Professional Top Overlay Actions: Wishlist & Share */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWishlisted(!isWishlisted);
                    }}
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center shadow-xs hover:bg-white transition-all cursor-pointer"
                    title="Add to Wishlist"
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isWishlisted ? 'text-red-600 fill-red-600' : 'text-[#1A1A1A]'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center shadow-xs hover:bg-white transition-all cursor-pointer"
                    title="Share Product"
                  >
                    <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9.316a3 3 0 100-2.684 3 3 0 000 2.684z" />
                    </svg>
                  </button>
                </div>

                <img
                  src={gallery[selectedImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-3 right-3 text-[10px] font-sans tracking-widest text-[#737373] uppercase bg-white/90 backdrop-blur-md px-3 py-1 font-bold rounded-full border border-black/10">
                  {selectedImageIndex + 1} / {gallery.length} IMAGES
                </div>
              </div>

              {/* Horizontal Scroll Strip */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 bg-[#F5F5F7] border p-0.5 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-black ring-2 ring-black/20 opacity-100'
                        : 'border-black/10 opacity-60'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── DESKTOP GALLERY (sm: and larger screens): 2-Column Borderless Grid ── */}
            <div className="hidden sm:block relative">
              {/* Professional Overlay Top Actions: Wishlist & Share Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/10">
                <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#737373] font-bold">
                  FLACON GALLERY • {gallery.length} EDITORIAL VIEWS
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] text-xs font-sans font-semibold text-[#1A1A1A] transition-all cursor-pointer border border-black/5"
                  >
                    <svg
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? 'text-red-600 fill-red-600' : 'text-[#1A1A1A]'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{isWishlisted ? 'WISHLISTED' : 'WISHLIST'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] text-xs font-sans font-semibold text-[#1A1A1A] transition-all cursor-pointer border border-black/5"
                  >
                    <svg className="w-3.5 h-3.5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9.316a3 3 0 100-2.684 3 3 0 000 2.684z" />
                    </svg>
                    <span>{copiedShare ? 'COPIED!' : 'SHARE'}</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Borderless Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                {gallery.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setZoomImage(img)}
                    className="relative overflow-hidden bg-[#F5F5F7] aspect-square sm:aspect-[4/5] flex items-center justify-center cursor-pointer select-none"
                  >
                    {idx === 0 && (
                      <span className="absolute top-3 left-3 text-[9px] font-sans tracking-[0.2em] uppercase bg-black/85 text-white px-3 py-1 font-bold z-10">
                        {product.badge}
                      </span>
                    )}

                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SECTION: COMPLETE PRODUCT DETAILS, NOTES, PRICING, HOW TO USE & WHY YOU'LL LOVE IT */}
          <div className="w-full lg:w-5/12 flex flex-col justify-start">
            
            {/* Header: Title & Category */}
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#737373] font-bold block mb-1">
              {product.category} • {product.frenchName}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1A1A] tracking-tight uppercase mb-2">
              {product.name}
            </h1>

            {/* Star Rating & Review Count */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex text-[#C08A3E] text-sm">
                {'★'.repeat(5)}
              </div>
              <a href="#reviews" className="text-xs font-sans text-[#555555] font-medium tracking-wide hover:underline">
                {product.rating} ({localReviews.length} verified reviews)
              </a>
            </div>

            {/* 1. PRODUCT DETAILS SECTION */}
            <div className="mb-6 pb-6 border-b border-black/10">
              <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-2.5">
                PRODUCT DETAILS
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#555555] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* 2. FRAGRANCE NOTES SECTION */}
            <div className="mb-6 pb-6 border-b border-black/10">
              <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-3">
                FRAGRANCE NOTES
              </h3>
              <div className="space-y-3 bg-[#F9F9FB] p-3.5 sm:p-4 rounded-xl border border-black/10">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 text-xs font-sans">
                  <span className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[10px] sm:text-xs shrink-0">
                    TOP NOTES:
                  </span>
                  <span className="text-[#555555] font-medium text-left sm:text-right text-[11px] sm:text-xs">
                    {product.notes?.top || 'Iranian Galbanum, Neroli de Grasse'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 text-xs font-sans pt-2.5 border-t border-black/5">
                  <span className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[10px] sm:text-xs shrink-0">
                    HEART NOTES:
                  </span>
                  <span className="text-[#555555] font-medium text-left sm:text-right text-[11px] sm:text-xs">
                    {product.notes?.heart || 'Florentine Iris Pallida, May Rose'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 text-xs font-sans pt-2.5 border-t border-black/5">
                  <span className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[10px] sm:text-xs shrink-0">
                    BASE NOTES:
                  </span>
                  <span className="text-[#555555] font-medium text-left sm:text-right text-[11px] sm:text-xs">
                    {product.notes?.base || 'Haitian Vetiver, Cedarwood, Oakmoss'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. PRICING & PURCHASE ACTIONS */}
            <div className="mb-6 pb-6 border-b border-black/10">
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#737373] font-bold block mb-1">
                PRICE (30 ML / 1.0 FL. OZ.)
              </span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-sans font-extrabold text-[#1A1A1A]">
                  ${unitPrice.toFixed(2)}
                </span>
                <span className="text-xs font-sans text-[#737373] font-medium uppercase tracking-wider">
                  USD | Inclusive of all taxes
                </span>
              </div>

              {/* QUANTITY & ADD TO CART CTA */}
              <div className="flex items-center gap-3 mb-4">
                {/* Quantity Selector Box */}
                <div className="flex items-center border border-black/20 rounded-xl overflow-hidden bg-[#F9F9F9] h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 text-base font-bold text-[#1A1A1A] hover:bg-black/10 transition-colors cursor-pointer h-full"
                  >
                    -
                  </button>
                  <span className="px-3 font-sans text-sm font-extrabold text-[#1A1A1A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 text-base font-bold text-[#1A1A1A] hover:bg-black/10 transition-colors cursor-pointer h-full"
                  >
                    +
                  </button>
                </div>

                {/* ADD TO BAG Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addedToast}
                  className={`flex-1 h-12 text-xs font-sans font-extrabold tracking-[0.25em] uppercase rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                    addedToast
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#1A1A1A] text-white hover:bg-black active:scale-[0.98]'
                  }`}
                >
                  {addedToast ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>ADDED TO HAUTE BAG</span>
                    </>
                  ) : (
                    <>
                      <span>ADD TO CART • ${totalPrice.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* TRUST BADGES ROW */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#F9F9FB] rounded-xl border border-black/10 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-sans font-bold text-[#1A1A1A] uppercase tracking-wider">
                    100% AUTHENTIC
                  </span>
                  <span className="text-[9px] font-sans text-[#737373]">Grasse Atelier</span>
                </div>
                <div className="flex flex-col items-center border-x border-black/10">
                  <span className="text-[10px] font-sans font-bold text-[#1A1A1A] uppercase tracking-wider">
                    COMPLIMENTARY
                  </span>
                  <span className="text-[9px] font-sans text-[#737373]">Luxury Packaging</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-sans font-bold text-[#1A1A1A] uppercase tracking-wider">
                    EXPRESS SHIPPING
                  </span>
                  <span className="text-[9px] font-sans text-[#737373]">Insured Delivery</span>
                </div>
              </div>
            </div>

            {/* 4. HOW TO USE — INVERTED DARK EDITORIAL PANEL */}
            <div className="mb-6 -mx-1 rounded-2xl bg-[#111111] text-white p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-[1px] bg-white/30" />
                <h3 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.3em] text-white/90">
                  How to Use
                </h3>
              </div>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <span className="text-[28px] font-serif font-light text-white/20 leading-none select-none shrink-0 -mt-1">
                    01
                  </span>
                  <div>
                    <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-white mb-1">
                      Target Pulse Points
                    </h4>
                    <p className="text-[11px] font-sans text-white/60 leading-relaxed font-light">
                      Apply 1–2 sprays directly onto wrists, inner elbows, base of neck, and behind earlobes—where warmth amplifies projection.
                    </p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/10" />

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <span className="text-[28px] font-serif font-light text-white/20 leading-none select-none shrink-0 -mt-1">
                    02
                  </span>
                  <div>
                    <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-white mb-1">
                      Let It Breathe
                    </h4>
                    <p className="text-[11px] font-sans text-white/60 leading-relaxed font-light">
                      Allow the extrait to warm naturally on skin. Never rub—friction breaks top Galbanum accords and shortens the dry-down.
                    </p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/10" />

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <span className="text-[28px] font-serif font-light text-white/20 leading-none select-none shrink-0 -mt-1">
                    03
                  </span>
                  <div>
                    <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-white mb-1">
                      Layer for Evening
                    </h4>
                    <p className="text-[11px] font-sans text-white/60 leading-relaxed font-light">
                      For evening occasions, mist lightly over hair tips or dark garments for a lingering, sophisticated aura.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. WHY YOU'LL LOVE IT — CLEAN EDITORIAL CARDS */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-black/20" />
                <h3 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.3em] text-[#1A1A1A]">
                  Why You'll Love It
                </h3>
              </div>

              <div className="space-y-0 border border-black/10 rounded-xl overflow-hidden">
                {/* Row 1 */}
                <div className="flex border-b border-black/10">
                  <div className="flex-1 p-4 border-r border-black/10">
                    <span className="text-[22px] font-serif font-light text-[#111111]/15 block leading-none mb-1.5 select-none">12h+</span>
                    <h4 className="text-[10px] font-sans font-extrabold uppercase tracking-[0.15em] text-[#111111] mb-1">
                      Long Wear
                    </h4>
                    <p className="text-[11px] font-sans text-[#555555] leading-snug font-light">
                      32% pure Extrait concentration stays radiant from morning till midnight.
                    </p>
                  </div>
                  <div className="flex-1 p-4">
                    <span className="text-[22px] font-serif font-light text-[#111111]/15 block leading-none mb-1.5 select-none">6yr</span>
                    <h4 className="text-[10px] font-sans font-extrabold uppercase tracking-[0.15em] text-[#111111] mb-1">
                      Florentine Iris
                    </h4>
                    <p className="text-[11px] font-sans text-[#555555] leading-snug font-light">
                      Rare Iris Pallida butter aged over six full years in Tuscany.
                    </p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex">
                  <div className="flex-1 p-4 border-r border-black/10">
                    <span className="text-[22px] font-serif font-light text-[#111111]/15 block leading-none mb-1.5 select-none">№1</span>
                    <h4 className="text-[10px] font-sans font-extrabold uppercase tracking-[0.15em] text-[#111111] mb-1">
                      Hand Baudruchage
                    </h4>
                    <p className="text-[11px] font-sans text-[#555555] leading-snug font-light">
                      Gold-thread hand-sealed membrane flacon crafted in Grasse.
                    </p>
                  </div>
                  <div className="flex-1 p-4">
                    <span className="text-[22px] font-serif font-light text-[#111111]/15 block leading-none mb-1.5 select-none">∞</span>
                    <h4 className="text-[10px] font-sans font-extrabold uppercase tracking-[0.15em] text-[#111111] mb-1">
                      Signature Aura
                    </h4>
                    <p className="text-[11px] font-sans text-[#555555] leading-snug font-light">
                      Crisp green Galbanum & velvety iris suede that garners compliments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── FULL-WIDTH REVIEWS DEPARTMENT SECTION ── */}
      <section id="reviews" className="w-full bg-[#F6F6F8] text-[#1A1A1A] py-16 border-t border-b border-black/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          
          {/* Department Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-black/10 pb-6 mb-10 gap-4">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#C08A3E] font-bold block mb-1">
                VERIFIED COMMUNITY FEEDBACK
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light uppercase tracking-tight">
                Customer Reviews Department ({localReviews.length})
              </h2>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-6 py-3.5 bg-[#1A1A1A] text-white text-xs font-sans font-extrabold tracking-[0.2em] uppercase rounded-xl hover:bg-black transition-colors cursor-pointer shadow-md"
            >
              WRITE A REVIEW
            </button>
          </div>

          {/* Rating Breakdown Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-center bg-white p-6 sm:p-8 rounded-2xl border border-black/10 shadow-xs">
            <div className="md:col-span-4 text-center md:border-r md:border-black/10 pr-0 md:pr-6">
              <div className="text-5xl font-serif text-[#1A1A1A] font-light mb-1">
                {product.rating}
              </div>
              <div className="flex justify-center text-[#C08A3E] text-base mb-1">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs font-sans text-[#737373] uppercase tracking-wider font-semibold">
                Based on {localReviews.length} verified reviews
              </p>
            </div>

            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = localReviews.filter((r) => Math.round(r.rating) === stars).length;
                const percentage = localReviews.length ? (count / localReviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs font-sans">
                    <span className="w-12 text-right font-semibold text-[#1A1A1A]">{stars} ★</span>
                    <div className="flex-1 bg-black/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C08A3E] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-[#737373] font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List Grid */}
          <div className="space-y-6">
            {localReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-white border border-black/10 rounded-2xl shadow-xs transition-all hover:border-black/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex text-[#C08A3E] text-sm">
                      {'★'.repeat(rev.rating)}
                      {'☆'.repeat(5 - rev.rating)}
                    </div>
                    <span className="font-sans font-extrabold text-sm text-[#1A1A1A]">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        VERIFIED BUYER
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-sans text-[#888888]">{rev.date}</span>
                </div>

                <h4 className="font-serif text-base text-[#1A1A1A] font-semibold mb-2 uppercase">
                  {rev.title}
                </h4>

                <p className="text-xs font-sans text-[#555555] leading-relaxed font-light mb-4">
                  {rev.comment}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-sans text-[#888888]">
                  <span>Was this review helpful?</span>
                  <button className="hover:text-[#1A1A1A] underline cursor-pointer">
                    Yes ({rev.helpfulCount || 0})
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── RECOMMENDED PRODUCTS SECTION ── */}
      <RecommendationProduct currentProductId={product.id} />

      {/* ── HIGH-RES IMAGE ZOOM LIGHTBOX MODAL ── */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-fadeIn cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-6 right-6 text-white text-2xl font-bold bg-white/10 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
          <img
            src={zoomImage}
            alt={product.name}
            className="max-h-[88vh] max-w-[90vw] object-contain drop-shadow-2xl"
          />
        </div>
      )}

      {/* ── WRITE A REVIEW MODAL ── */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-black/10 text-[#1A1A1A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
              <h3 className="font-serif text-xl uppercase tracking-tight text-[#1A1A1A]">
                Write a Customer Review
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 text-[#737373] hover:text-[#1A1A1A] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Overall Rating:
                </label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#F9F9FB] border border-black/20 rounded-xl text-xs font-sans text-[#1A1A1A] focus:outline-none"
                >
                  <option value={5}>★★★★★ (5/5 Excellent)</option>
                  <option value={4}>★★★★☆ (4/5 Very Good)</option>
                  <option value={3}>★★★☆☆ (3/5 Average)</option>
                  <option value={2}>★★☆☆☆ (2/5 Below Average)</option>
                  <option value={1}>★☆☆☆☆ (1/5 Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Your Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vivienne Westwood"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  className="w-full p-2.5 bg-[#F9F9FB] border border-black/20 rounded-xl text-xs font-sans text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Review Headline:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exquisite fragrance with unparalleled elegance"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full p-2.5 bg-[#F9F9FB] border border-black/20 rounded-xl text-xs font-sans text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Review Details:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your experience regarding scent longevity, packaging, and notes..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full p-2.5 bg-[#F9F9FB] border border-black/20 rounded-xl text-xs font-sans text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A1A1A] text-white text-xs font-sans font-extrabold tracking-[0.25em] uppercase rounded-xl hover:bg-black transition-colors cursor-pointer shadow-lg"
              >
                SUBMIT REVIEW
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Drawer Component Integration */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(idx, newQty) => {
          if (newQty <= 0) {
            setCartItems((prev) => prev.filter((_, i) => i !== idx));
          } else {
            setCartItems((prev) => {
              const updated = [...prev];
              updated[idx].quantity = newQty;
              return updated;
            });
          }
        }}
        onRemoveItem={(idx) => setCartItems((prev) => prev.filter((_, i) => i !== idx))}
        onCheckout={() => setCartItems([])}
      />

      {/* Luxury Footer */}
      <Footer onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}
