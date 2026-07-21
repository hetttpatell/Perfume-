import { useState, useEffect } from 'react';

const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    category: 'PRESS',
    categoryLabel: 'PRESS & CRITIQUES',
    author: 'VOGUE HAUTE PARFUMERIE',
    role: 'Editorial Fragrance Review',
    location: 'PARIS, FRANCE',
    product: 'N°19 EXTRAIT DE PARFUM',
    rating: 5,
    verified: true,
    badgeText: 'PRESS CRITIC',
    quote:
      'N°19 is not merely a fragrance; it is an audacious statement of independence. The green iris opening resolves into a velvet embrace that lingers with unmatched Parisian elegance.',
    helpfulCount: 48,
    date: 'OCTOBER 2025',
  },
  {
    id: 2,
    category: 'CONNOISSEUR',
    categoryLabel: 'CONNOISSEURS',
    author: 'ELEANOR DE SAINT-GERMAIN',
    role: 'Fragrance Historian & Collector',
    location: 'LONDON, UK',
    product: 'EAU DE PARFUM SPRAY',
    rating: 5,
    verified: true,
    badgeText: 'VERIFIED COLLECTOR',
    quote:
      'The crisp galbanum contrasted against Iris Pallida leaves an unforgettable signature. It has been my signature scent for over twenty years—impeccable, daring, and timeless.',
    helpfulCount: 36,
    date: 'JANUARY 2026',
  },
  {
    id: 3,
    category: 'PRESS',
    categoryLabel: 'PRESS & CRITIQUES',
    author: "HARPER'S BAZAAR",
    role: 'Luxury Beauty Gazette',
    location: 'NEW YORK, USA',
    product: 'LES ATELIERS CHANEL',
    rating: 5,
    verified: true,
    badgeText: 'PRESS FEATURE',
    quote:
      'The perfect balance between crisp Galbanum and velvety Iris Pallida. Chanel N°19 remains the ultimate olfactory signature of modern haute couture sophistication.',
    helpfulCount: 52,
    date: 'DECEMBER 2025',
  },
  {
    id: 4,
    category: 'BUYER',
    categoryLabel: 'VERIFIED BUYERS',
    author: 'CAMILLE VALENTINE',
    role: 'Fashion Stylist',
    location: 'MILAN, ITALY',
    product: 'EAU DE TOILETTE SPRAY',
    rating: 5,
    verified: true,
    badgeText: 'VERIFIED PURCHASER',
    quote:
      'Wearing Chanel N°19 feels like wearing an invisible haute couture gown. The sillage is sophisticated, magnetic, and supremely refined without ever feeling overpowering.',
    helpfulCount: 29,
    date: 'FEBRUARY 2026',
  },
  {
    id: 5,
    category: 'CONNOISSEUR',
    categoryLabel: 'CONNOISSEURS',
    author: 'JEAN-LUC MOREAU',
    role: 'Master Fragrance Critic',
    location: 'GRASSE, FRANCE',
    product: 'RITUELS DE SOIN BODY OIL',
    rating: 5,
    verified: true,
    badgeText: 'MASTER CRITIC',
    quote:
      'An ethereal composition where botanical boldness meets velvety softness. The artisanal flacon engraving service is divine, rendering each bottle an heirloom piece of art.',
    helpfulCount: 41,
    date: 'MARCH 2026',
  },
  {
    id: 6,
    category: 'BUYER',
    categoryLabel: 'VERIFIED BUYERS',
    author: 'SOPHIE VAN DER BERG',
    role: 'Art Director',
    location: 'AMSTERDAM, NETHERLANDS',
    product: 'N°19 EXTRAIT DE PARFUM',
    rating: 5,
    verified: true,
    badgeText: 'VERIFIED PURCHASER',
    quote:
      'Ordered the Extrait flacon with custom engraving for a milestone birthday. Unboxing it was a sensory ritual in itself. The fragrance lasts beautifully from morning until evening.',
    helpfulCount: 24,
    date: 'APRIL 2026',
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(INITIAL_TESTIMONIALS);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Touch Swipe Gesture Handling for Mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 40;

  // New review submission form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newProduct, setNewProduct] = useState('N°19 EXTRAIT DE PARFUM');
  const [newRating, setNewRating] = useState(5);
  const [newQuote, setNewQuote] = useState('');

  const categories = [
    { id: 'ALL', label: 'TOUT', fullLabel: 'TOUT (ALL REVIEWS)' },
    { id: 'PRESS', label: 'PRESSE', fullLabel: 'PRESSE & CRITIQUES' },
    { id: 'CONNOISSEUR', label: 'CONNOISSEURS', fullLabel: 'CONNOISSEURS' },
    { id: 'BUYER', label: 'CLIENTS', fullLabel: 'CLIENTS VÉRIFIÉS' },
  ];

  const filteredTestimonials =
    activeCategory === 'ALL'
      ? testimonials
      : testimonials.filter((item) => item.category === activeCategory);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length
    );
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const handleHelpfulClick = (id) => {
    if (helpfulVotes[id]) return;
    setHelpfulVotes((prev) => ({ ...prev, [id]: true }));
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, helpfulCount: t.helpfulCount + 1 } : t))
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newQuote.trim()) return;

    const created = {
      id: Date.now(),
      category: 'BUYER',
      categoryLabel: 'VERIFIED BUYERS',
      author: newAuthor.toUpperCase(),
      role: newRole || 'Fragrance Enthusiast',
      location: newLocation ? newLocation.toUpperCase() : 'PARIS, FRANCE',
      product: newProduct,
      rating: Number(newRating),
      verified: true,
      badgeText: 'VERIFIED PURCHASER',
      quote: newQuote,
      helpfulCount: 1,
      date: 'JUST NOW',
    };

    setTestimonials([created, ...testimonials]);
    setIsModalOpen(false);
    setNewAuthor('');
    setNewRole('');
    setNewLocation('');
    setNewQuote('');
    setActiveCategory('ALL');
    setCurrentIndex(0);
  };

  const activeTestimonial = filteredTestimonials[currentIndex] || filteredTestimonials[0];
  const nextTestimonialIndex = (currentIndex + 1) % filteredTestimonials.length;
  const nextTestimonial = filteredTestimonials[nextTestimonialIndex] || activeTestimonial;

  return (
    <section className="w-full max-w-7xl mx-auto pt-8 sm:pt-12 md:pt-14 pb-8 border-t border-black/10 text-[#1A1A1A] bg-[#FAFAFA] font-sans">
      {/* Header Block: Responsive for Mobile, iPad (md), Desktop (lg) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6">
        <div>
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#737373] font-semibold block mb-1">
            06 // LES TESTIMONIELS DE PRESTIGE
          </span>
          <h2 className="font-serif font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight uppercase">
            VOICES OF ELEGANCE
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#555555] font-light mt-1 max-w-2xl leading-relaxed">
            Discover how master perfumers, fashion critics, and verified collectors describe the iconic aura of Chanel N°19.
          </p>
        </div>

        {/* Action Button & Rating Overview: Responsive Row on Mobile/iPad */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto">
          {/* Rating Summary Badge */}
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-white border border-black/10 rounded-full shadow-2xs text-[11px] sm:text-xs font-sans shrink-0">
            <div className="flex text-[#C08A3E]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-bold text-[#1A1A1A]">4.9 / 5.0</span>
            <span className="hidden sm:inline text-[#737373] border-l border-black/10 pl-2 text-[10px] uppercase tracking-wider font-semibold">
              1,280+ REVIEWS
            </span>
          </div>

          {/* Share Review Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-sans font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-full transition-all duration-300 shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>SHARE RITUAL</span>
          </button>
        </div>
      </div>

      {/* Category Filter Navigation Bar (Horizontally scrollable on Mobile with sleek pill styling) */}
      <div className="w-full pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-black/10 mb-6 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-sans font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
              activeCategory === cat.id
                ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                : 'bg-white text-[#737373] hover:text-[#1A1A1A] border border-black/10'
            }`}
          >
            <span className="sm:hidden">{cat.label}</span>
            <span className="hidden sm:inline">{cat.fullLabel}</span>
          </button>
        ))}
      </div>

      {/* Main Responsive Layout Grid */}
      {filteredTestimonials.length > 0 && activeTestimonial && (
        <div className="w-full">
          {/* Mobile & iPad (md) Adaptive Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch mb-6">
            
            {/* Main Featured Hero Testimonial Card (Full width on Mobile, 1-col on iPad, 8-cols on Desktop) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="md:col-span-1 lg:col-span-8 bg-white border border-black/10 rounded-xl sm:rounded-2xl p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden shadow-xs select-none"
            >
              {/* Elegant Background Watermark Quote Symbol */}
              <span className="absolute -top-3 right-3 sm:-top-4 sm:right-4 text-[90px] sm:text-[120px] font-serif leading-none text-black/4 pointer-events-none">
                “
              </span>

              {/* Top Card Badges & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6 relative z-10">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#1A1A1A] text-white text-[8px] sm:text-[9px] font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-full font-semibold">
                    {activeTestimonial.badgeText}
                  </span>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-black/5 text-[#737373] text-[8px] sm:text-[9px] font-sans tracking-[0.12em] sm:tracking-[0.15em] uppercase rounded-full font-medium truncate max-w-[170px] sm:max-w-none">
                    {activeTestimonial.product}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex text-[#C08A3E] shrink-0">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Main Garamond Testimonial Quote */}
              <div className="relative z-10 mb-6 sm:mb-8">
                <blockquote className="font-serif font-light italic text-base sm:text-xl md:text-2xl lg:text-3xl text-[#1A1A1A] leading-relaxed tracking-tight">
                  "{activeTestimonial.quote}"
                </blockquote>
              </div>

              {/* Author & Footer Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-black/10 pt-4 sm:pt-5 gap-3.5 sm:gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Monogram Circle Avatar */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1A1A1A] text-[#C08A3E] flex items-center justify-center font-serif font-bold text-sm sm:text-base shadow-xs shrink-0">
                    {activeTestimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-[#1A1A1A] tracking-wider uppercase">
                      {activeTestimonial.author}
                    </h4>
                    <p className="font-sans text-[10px] sm:text-[11px] text-[#737373] font-medium">
                      {activeTestimonial.role} • <span className="text-[#C08A3E]">{activeTestimonial.location}</span>
                    </p>
                  </div>
                </div>

                {/* Helpful Vote & Date */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs font-sans">
                  <span className="text-[#737373] text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold">
                    {activeTestimonial.date}
                  </span>
                  <button
                    onClick={() => handleHelpfulClick(activeTestimonial.id)}
                    className={`px-3 py-1.5 rounded-full border text-[9px] sm:text-[10px] font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      helpfulVotes[activeTestimonial.id]
                        ? 'bg-[#C08A3E]/10 border-[#C08A3E] text-[#C08A3E]'
                        : 'bg-[#FAFAFA] border-black/15 text-[#555555] hover:border-black/50 hover:text-[#1A1A1A]'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                    </svg>
                    <span>HELPFUL ({activeTestimonial.helpfulCount})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Second Spotlight Preview Card on iPad (md) & Desktop (lg) */}
            <div className="hidden md:flex lg:col-span-4 bg-white border border-black/10 rounded-xl sm:rounded-2xl p-6 sm:p-7 flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#C08A3E] uppercase">
                    NEXT IN QUEUE ({nextTestimonialIndex + 1} / {filteredTestimonials.length})
                  </span>
                  <span className="text-[10px] font-sans text-[#737373] tracking-wider truncate max-w-[120px]">
                    {nextTestimonial.categoryLabel}
                  </span>
                </div>

                <blockquote className="font-serif italic text-xs sm:text-sm text-[#4A4A4A] line-clamp-4 sm:line-clamp-5 leading-relaxed mb-4">
                  "{nextTestimonial.quote}"
                </blockquote>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                <div>
                  <h5 className="font-sans font-bold text-xs text-[#1A1A1A] uppercase tracking-wider">
                    {nextTestimonial.author}
                  </h5>
                  <p className="font-sans text-[10px] text-[#737373]">
                    {nextTestimonial.location}
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer text-[#1A1A1A]"
                  aria-label="Next Testimonial"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Unified Controls & Slide Dash Indicators Bar (Optimized for Mobile & Tablet) */}
          <div className="bg-white border border-black/10 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 sm:p-2.5 rounded-full border border-black/20 hover:border-black hover:bg-black/5 active:scale-95 transition-all duration-300 cursor-pointer text-[#1A1A1A]"
                aria-label="Previous Testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="p-2 sm:p-2.5 rounded-full border border-black/20 hover:border-black hover:bg-black/5 active:scale-95 transition-all duration-300 cursor-pointer text-[#1A1A1A]"
                aria-label="Next Testimonial"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <span className="font-sans text-[11px] sm:text-xs font-medium tracking-widest text-[#737373] ml-1">
                {currentIndex + 1} / {filteredTestimonials.length}
              </span>
            </div>

            {/* Slide Dash Indicators */}
            <div className="flex items-center gap-1.5">
              {filteredTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? 'w-5 sm:w-6 bg-[#C08A3E]' : 'w-2 bg-black/20 hover:bg-black/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-black/10 rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#1A1A1A] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C08A3E] font-semibold block mb-1">
              HAUTE PARFUMERIE FEEDBACK
            </span>
            <h3 className="font-serif font-light text-xl sm:text-2xl text-[#1A1A1A] uppercase tracking-tight mb-4">
              SHARE YOUR RITUAL EXPERIENCE
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-3.5 font-sans text-xs">
              <div>
                <label className="block text-[10px] tracking-wider uppercase font-semibold text-[#737373] mb-1">
                  FULL NAME / INITIALS *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marie-Claire Dupont"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#C08A3E] bg-[#FAFAFA]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-semibold text-[#737373] mb-1">
                    TITLE / PROFESSION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fragrance Enthusiast"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#C08A3E] bg-[#FAFAFA]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-semibold text-[#737373] mb-1">
                    CITY & COUNTRY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paris, France"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#C08A3E] bg-[#FAFAFA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-semibold text-[#737373] mb-1">
                    FRAGRANCE SELECTION
                  </label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#C08A3E] bg-[#FAFAFA]"
                  >
                    <option value="N°19 EXTRAIT DE PARFUM">N°19 EXTRAIT DE PARFUM</option>
                    <option value="EAU DE PARFUM SPRAY">EAU DE PARFUM SPRAY</option>
                    <option value="EAU DE TOILETTE SPRAY">EAU DE TOILETTE SPRAY</option>
                    <option value="RITUELS DE SOIN BODY OIL">RITUELS DE SOIN BODY OIL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-semibold text-[#737373] mb-1">
                    RATING (STARS)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#C08A3E] bg-[#FAFAFA]"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-semibold text-[#737373] mb-1">
                  YOUR OLFACTORY CRITIQUE & RITUAL REVIEW *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the notes, longevity, and emotion of your Chanel N°19 experience..."
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-black/15 rounded-lg focus:outline-none focus:border-[#C08A3E] bg-[#FAFAFA]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-[10px] tracking-wider uppercase font-semibold text-[#737373] hover:text-[#1A1A1A]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-[10px] tracking-wider uppercase font-semibold text-white bg-[#1A1A1A] hover:bg-black rounded-full shadow-xs cursor-pointer"
                >
                  SUBMIT REVIEW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
