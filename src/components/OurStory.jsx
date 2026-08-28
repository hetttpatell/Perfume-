import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ourStoryImg from '../assets/our_story_atelier.jpg';

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHTS = [
  {
    title: 'In-House Atelier Production',
    desc: 'Complete in-house production ensuring strong control on quality & natural extractions.',
    align: 'left',
  },
  {
    title: '100% Unique Blends',
    desc: '100% unique, in-house crafted blends — no mass-produced formulas.',
    align: 'right',
  },
  {
    title: 'Free from Harmful Chemicals',
    desc: 'Free from harmful chemicals & phthalates — safe for you and your space.',
    align: 'left',
  },
  {
    title: 'Pure Natural Extracts',
    desc: 'Derived from pure, naturally sourced extracts — nothing synthetic.',
    align: 'right',
  },
  {
    title: 'IFRA Safety Standards',
    desc: 'Strictly follows international IFRA safety standards for peace of mind.',
    align: 'left',
  },
  {
    title: 'Handcrafted in Batches',
    desc: 'Handcrafted in limited batches for superior freshness and precision.',
    align: 'right',
  },
];

export default function OurStory() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const highlightRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: imageRef.current, start: 'top 85%' },
          }
        );
      }

      highlightRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 0.999,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-white text-[#111111] overflow-hidden border-t border-black/5 selection:bg-[#111111] selection:text-white"
    >
      {/* Section Header — Centered */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-7 sm:pt-8 pb-4 sm:pb-5 text-center">
        <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#555555] mb-2 block font-semibold">
          OUR STORY
        </span>
        <h2 className="font-serif font-light text-xl sm:text-2xl lg:text-[28px] tracking-tight leading-[1.08] text-[#111111] mb-1.5 uppercase">
          WHAT MAKES MAISON LUNE DIFFERENT?
        </h2>
        <p className="font-sans font-light text-[11px] sm:text-xs text-[#555555] max-w-md mx-auto">
          Crafted with integrity, rooted in nature — discover the Maison Lune difference.
        </p>
      </div>

      {/* 2-Column Grid: Full-bleed Image | Staggered Highlights */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">

        {/* LEFT — Full-bleed image with floating badge */}
        <div
          ref={imageRef}
          className="relative min-h-[240px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px] overflow-hidden bg-white group border-b md:border-r md:border-b-0 border-black/5"
        >
          <img
            src={ourStoryImg}
            alt="Maison Lune Atelier — Grasse, France"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Floating badge */}
          <div className="absolute bottom-4 left-4 md:bottom-7 md:left-7 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-sm">
              <svg className="w-4 h-4 text-[#C08A3E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <span className="block font-sans font-extrabold text-[10px] text-[#C08A3E] tracking-[0.2em] uppercase leading-none">
                  Pure & Natural
                </span>
                <span className="block font-sans text-[9px] text-white/60 tracking-[0.15em] uppercase mt-0.5">
                  CRAFTED WITH CARE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Staggered zigzag highlights + centered CTA */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-center bg-white">

          {/* Boxy staggered highlights */}
          <div className="flex flex-col gap-3">
            {HIGHLIGHTS.map((item, i) => {
              const isRight = item.align === 'right';
              return (
                <div
                  key={i}
                  ref={(el) => (highlightRefs.current[i] = el)}
                  className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`w-[78%] sm:w-[72%] bg-[#faf8f4] p-4 lg:p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${isRight ? 'text-right border-r-2 border-r-[#C08A3E]' : 'text-left border-l-2 border-l-[#C08A3E]'}`}
                  >
                    <h4 className="font-sans font-extrabold text-[13px] sm:text-sm text-[#111111] uppercase tracking-wide mb-1.5 leading-snug">
                      {item.title}
                    </h4>
                    <p className="font-sans font-normal text-[11px] sm:text-xs text-[#555555] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered CTA */}
          <div className="mt-3 pt-4 border-t border-black/5 flex flex-col items-center text-center">
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#555555] mb-3 font-semibold">
              DISCOVER THE FULL HERITAGE
            </span>
            <button
              onClick={() => {
                navigate('/about');
              }}
              className="px-8 py-3 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-sans font-bold text-[11px] tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer active:scale-95"
            >
              KNOW ABOUT US
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
