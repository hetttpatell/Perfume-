import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// ──────────────────────────────────────────────────────────────────────────────
// 4 Normal Showcase Videos — Clean presentation with zero text on the video
// ──────────────────────────────────────────────────────────────────────────────
const SHOWCASE_VIDEOS = [
  {
    id: 'video-1',
    title: 'Lune Extrait Flacon',
    caption: 'Hand-Sealed Baudruchage Ritual',
    category: 'EXTRAIT DE PARFUM',
    price: '$340',
    duration: '0:28',
    productId: 'n19-extrait',
    videoSrc: '/Video/8447665-uhd_2160_4096_25fps.mp4#t=0.1',
    author: 'Camille Dupont',
    location: 'Paris, France',
    rating: 5,
    quote: 'The Florentine Iris Pallida butter notes linger effortlessly for 14+ hours. An unrivaled signature of distinction.',
    notes: 'Florentine Iris • Grasse Jasmine • Haitian Vetiver'
  },
  {
    id: 'video-2',
    title: 'Rich Blossom Extrait',
    caption: 'Smoked Cambodian Timber Impression',
    category: 'HAUTE PARFUMERIE',
    price: '$280',
    duration: '0:34',
    productId: 'p1',
    videoSrc: '/Video/Generate_a_video_that_will_pla.mp4#t=0.1',
    author: 'Marcus Vance',
    location: 'London, UK',
    rating: 5,
    quote: 'An intoxicating warmth of wild Cambodian oud and roasted cocoa that draws compliments everywhere I go.',
    notes: 'Cambodian Oud • Roasted Cocoa • Bourbon Vanilla'
  },
  {
    id: 'video-3',
    title: 'Atelier Pocket Set',
    caption: 'Travel Flacon & Artisan Case',
    category: 'TRAVEL EXTRAIT',
    price: '$195',
    duration: '0:24',
    productId: 'n19-extrait',
    videoSrc: '/Video/8447665-uhd_2160_4096_25fps.mp4#t=4',
    author: 'Elena Rostova',
    location: 'Milan, Italy',
    rating: 5,
    quote: 'Opening the silk-wrapped box felt like receiving high jewelry. Pure olfactory luxury crafted for effortless motion.',
    notes: 'Florentine Iris • Mysore Sandalwood • White Musk'
  },
  {
    id: 'video-4',
    title: 'Citrus & Galbanum',
    caption: 'The Botanical Drydown Impression',
    category: 'EXTRAIT DE PARFUM',
    price: '$260',
    duration: '0:30',
    productId: 'p1',
    videoSrc: '/Video/Generate_a_video_that_will_pla.mp4#t=3.5',
    author: 'Julian Saint-Germain',
    location: 'Zurich, Switzerland',
    rating: 5,
    quote: 'Crisp resinous galbanum transitioning into velvety white florals is sheer artisan perfumery mastery.',
    notes: 'Calabrian Bergamot • Neroli • Smoked Woods'
  }
];

export default function BrandVideoFeedback() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [isPlayingModal, setIsPlayingModal] = useState(true);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);

  const videoRefs = useRef([]);
  const modalVideoRef = useRef(null);

  // IntersectionObserver: halts decoding/play when offscreen for zero-lag performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          videoRefs.current.forEach((v) => {
            if (v && !v.paused) v.pause();
          });
          setHoveredIndex(null);
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Play video only when card is hovered (desktop)
  const handleMouseEnter = (index) => {
    if (!isInView) return;
    setHoveredIndex(index);
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === index) {
        vid.play().catch(() => {});
      } else {
        if (!vid.paused) vid.pause();
      }
    });
  };

  const handleMouseLeave = (index) => {
    const vid = videoRefs.current[index];
    if (vid && !vid.paused) {
      vid.pause();
    }
    if (hoveredIndex === index) {
      setHoveredIndex(null);
    }
  };

  // Open full modal player
  const handleOpenModal = (item) => {
    videoRefs.current.forEach((v) => {
      if (v && !v.paused) v.pause();
    });
    setModalItem(item);
    setIsPlayingModal(true);
    setIsModalMuted(false);
    setModalProgress(0);
  };

  const handleCloseModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setModalItem(null);
  };

  const toggleModalPlay = () => {
    if (!modalVideoRef.current) return;
    if (isPlayingModal) {
      modalVideoRef.current.pause();
      setIsPlayingModal(false);
    } else {
      modalVideoRef.current.play();
      setIsPlayingModal(true);
    }
  };

  const toggleModalMute = () => {
    if (!modalVideoRef.current) return;
    const nextMuted = !isModalMuted;
    modalVideoRef.current.muted = nextMuted;
    setIsModalMuted(nextMuted);
  };

  const handleModalTimeUpdate = () => {
    if (!modalVideoRef.current) return;
    const current = modalVideoRef.current.currentTime;
    const duration = modalVideoRef.current.duration || 1;
    setModalProgress((current / duration) * 100);
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="w-full bg-white text-[#111111] pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 border-t border-black/[0.06] relative select-none scroll-mt-28"
      aria-label="Fragrance in Motion Video Showcase"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* ── Clean Showcase Header ── */}
        <div className="relative w-full max-w-3xl mx-auto mb-10 sm:mb-14 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C08A3E] font-semibold block mb-2">
            ATELIER & COMMUNITY
          </span>

          <h2 className="font-serif font-black text-2xl sm:text-4xl md:text-5xl text-[#111111] uppercase tracking-tight leading-[1.08] mb-3">
            FRAGRANCE IN MOTION
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#666666] font-light max-w-md mx-auto leading-relaxed tracking-wide">
            Real moments, rituals, and sensory reflections from patrons of the Maison worldwide.
          </p>
        </div>

        {/* ── Clean Video Showcase Grid: 2 by 2 on Mobile, 4 Columns on Desktop ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {SHOWCASE_VIDEOS.map((item, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.id}
                onClick={() => handleOpenModal(item)}
                className="group flex flex-col cursor-pointer"
              >
                {/* 100% Clean Video Frame — ZERO text written on the video */}
                <div
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  className="relative w-full aspect-[9/14] sm:aspect-[9/14] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-black/8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 will-change-transform"
                >
                  {/* Clean Video Layer */}
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={item.videoSrc}
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    className="w-full h-full object-cover scale-[1.01] group-hover:scale-100 transition-transform duration-700 ease-out"
                  />

                  {/* Minimal Frosted Play Icon (subtly fades when playing on hover) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                      isHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 group-hover:bg-white text-white group-hover:text-black backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
                      <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 ml-0.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* Immersive Video Modal when user clicks to watch                         */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-4xl bg-[#111111] text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              aria-label="Close video player"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player Column */}
            <div className="relative w-full md:w-[55%] bg-black flex items-center justify-center min-h-[280px] sm:min-h-[380px] md:min-h-[500px]">
              <video
                ref={modalVideoRef}
                src={modalItem.videoSrc}
                playsInline
                autoPlay
                loop
                muted={isModalMuted}
                onTimeUpdate={handleModalTimeUpdate}
                onClick={toggleModalPlay}
                className="w-full h-full object-contain max-h-[50vh] md:max-h-[75vh] cursor-pointer"
              />

              {/* Progress Scrubber */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-[#E6B86A] transition-all duration-100"
                  style={{ width: `${modalProgress}%` }}
                />
              </div>

              {/* Floating Bottom Video Controls */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                <button
                  onClick={toggleModalPlay}
                  aria-label={isPlayingModal ? 'Pause' : 'Play'}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer"
                >
                  {isPlayingModal ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={toggleModalMute}
                  aria-label={isModalMuted ? 'Unmute' : 'Mute'}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-sans font-medium"
                >
                  {isModalMuted ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                      <span>UNMUTE</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <span>AUDIO ON</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Testimonial Editorial Details Column */}
            <div className="w-full md:w-[45%] p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-none">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C08A3E]/20 text-[#E6B86A] text-[9.5px] font-sans tracking-[0.2em] font-semibold uppercase">
                    {modalItem.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/50">{modalItem.location}</span>
                </div>

                <h3 className="font-serif font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                  {modalItem.title}
                </h3>
                <p className="font-sans text-xs text-[#E6B86A] tracking-wider mt-0.5">
                  {modalItem.caption} • <span className="font-semibold text-white">{modalItem.price}</span>
                </p>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#E6B86A] my-3">
                  {[...Array(modalItem.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="font-sans text-xs text-white/60 ml-1.5">5.0 / 5.0 Rating</span>
                </div>

                <blockquote className="font-serif italic text-sm sm:text-base text-white/90 leading-relaxed my-4 border-l-2 border-[#C08A3E] pl-3.5">
                  "{modalItem.quote}"
                </blockquote>

                {/* Scent Accord Notes */}
                <div className="my-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 block mb-1 font-semibold">
                    OLFACTORY NOTES
                  </span>
                  <span className="text-xs text-white/90 font-medium">
                    {modalItem.notes}
                  </span>
                </div>
              </div>

              {/* Direct Shop CTA */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    handleCloseModal();
                    navigate(`/product/${modalItem.productId}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 bg-[#C08A3E] hover:bg-[#A9742B] text-white font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-200 cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>SHOP THIS FRAGRANCE ({modalItem.price})</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
