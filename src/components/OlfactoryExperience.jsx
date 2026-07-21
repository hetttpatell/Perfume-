import { useState } from 'react';

export default function OlfactoryExperience({ onSelectNote, onOpenDetails }) {
  const [selectedTab, setSelectedTab] = useState('all');

  const notesList = [
    {
      id: 'top',
      title: 'TOP NOTES // VIBRANT OVERTURE',
      sub: 'Calabrian Bergamot & Iranian Galbanum',
      desc: 'An invigorating, sun-drenched opening that instantly captivates with sharp botanical freshness.',
      icon: '✨',
      accent: '#C08A3E',
      slideIndex: 1,
    },
    {
      id: 'heart',
      title: 'HEART NOTES // FLORAL NOBILITY',
      sub: 'Florentine Iris Pallida & May Rose',
      desc: 'The precious powdery iris butter core seamlessly woven with silk jasmine and opulent May Rose absolute.',
      icon: '🌸',
      accent: '#B5838D',
      slideIndex: 2,
    },
    {
      id: 'base',
      title: 'BASE NOTES // SMOKY WOODS',
      sub: 'Haitian Vetiver & Virginia Cedarwood',
      desc: 'Deep earthy smoked woods and creamed sandalwood grounding the fragrance in timeless warmth.',
      icon: '🌿',
      accent: '#5E7465',
      slideIndex: 3,
    },
  ];

  return (
    <section className="relative w-full bg-[#111111] text-[#FAFAFA] py-20 px-6 md:px-12 z-20 overflow-hidden">
      {/* Decorative luxury ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8A9A86]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C08A3E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-[#A3A3A3]">
              HAUTE PARFUMERIE CRAFTSMANSHIP
            </span>
            <h2 className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white">
              The Olfactory Spectrum
            </h2>
          </div>
          <p className="font-sans font-light text-sm text-[#A3A3A3] max-w-md leading-relaxed">
            Distilled in limited annual harvests in Grasse, France. Every accord represents an unyielding harmony between raw botanical power and Parisian elegance.
          </p>
        </div>

        {/* 3-Card Olfactory Accord Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {notesList.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectNote(item.slideIndex)}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between gap-8"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase px-3 py-1 rounded-full bg-white/10"
                    style={{ color: item.accent }}
                  >
                    SELECT ACCORD
                  </span>
                </div>

                <h3 className="font-serif font-light text-2xl text-white group-hover:text-[#F0E8B0] transition-colors">
                  {item.title}
                </h3>
                <h4 className="font-sans font-medium text-xs tracking-widest text-[#A3A3A3] uppercase">
                  {item.sub}
                </h4>
                <p className="font-sans font-light text-xs sm:text-sm text-[#D4D4D4] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-sans font-medium tracking-wider text-white group-hover:translate-x-1 transition-transform">
                <span>VIEW 3D MODEL ACCORD</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Heritage Feature Banner */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/15 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-xl">
            <span className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-[#C08A3E]">
              GRASSE HERITAGE & BAUDROUCHAGE
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-white">
              Hand-Sealed Baudruchage Monolith
            </h3>
            <p className="font-sans text-sm font-light text-[#D4D4D4] leading-relaxed">
              Each flacon is sealed by hand using traditional natural membrane, wound with fine cotton thread, and stamped with the iconic Chanel double-C black wax seal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenDetails}
              className="px-8 py-4 text-xs font-sans font-semibold tracking-[0.25em] uppercase text-black bg-white rounded-full hover:bg-[#F0E8B0] transition-all duration-300 active:scale-95 cursor-pointer text-center"
            >
              EXPLORE FULL SPECS
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs font-sans text-[#737373]">
          <span>© CHANEL N°19 HAUTE PARFUMERIE</span>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">GRASSE HARVEST</span>
            <span className="hover:text-white cursor-pointer transition-colors">BOUTIQUE FINDER</span>
            <span className="hover:text-white cursor-pointer transition-colors">PRIVACY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
