import { useEffect } from 'react';

export default function FragranceDetails({ slideData, onClose, onReplayLoader }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!slideData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-xl overflow-y-auto animate-fade-in flex flex-col justify-between text-[#1A1A1A]">
      {/* Top Details Bar */}
      <header className="sticky top-0 z-20 w-full px-6 md:px-12 py-6 flex items-center justify-between bg-[#FAFAFA]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
          <span className="font-serif text-lg md:text-xl font-medium tracking-[0.2em] uppercase text-[#1A1A1A]">
            CHANEL N°19 // DETAILS
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onReplayLoader && (
            <button
              onClick={onReplayLoader}
              className="px-4 py-1.5 text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-[#1A1A1A] border border-black/20 rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-xs hidden sm:inline-block"
            >
              REPLAY LOADER
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-sans font-semibold tracking-[0.25em] uppercase text-white bg-[#1A1A1A] rounded-full hover:bg-black hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>BACK TO SHOWCASE</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Separate Page Content Grid */}
      <main className="w-full max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col gap-12 flex-1">
        {/* Editorial Heading Header */}
        <div className="flex flex-col gap-4 border-b border-black/10 pb-8">
          <span
            className="text-xs md:text-sm font-sans font-semibold tracking-[0.3em] uppercase"
            style={{ color: slideData.accent }}
          >
            {slideData.stepLabel}
          </span>

          <h1 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#1A1A1A]">
            {slideData.title}
          </h1>

          <p className="font-sans font-medium text-xs sm:text-sm tracking-[0.25em] uppercase text-[#737373] max-w-2xl">
            {slideData.subtitle} — {slideData.tagline}
          </p>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Narrative & Olfactory Breakdown */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-xl md:text-2xl font-light text-[#1A1A1A]">
                The Botanical Olfactory Story
              </h3>
              <p className="font-sans text-sm md:text-base font-light leading-relaxed text-[#4A4A4A]">
                {slideData.description}
              </p>
            </div>

            {/* Key Notes Accordion / Pill Badges */}
            <div className="flex flex-col gap-4">
              <h4 className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
                KEY BOTANICAL ESSENCES
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {slideData.keyNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 text-xs font-sans font-medium tracking-wider uppercase bg-white text-[#1A1A1A] rounded-full border border-black/10 shadow-xs flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Olfactory Pyramid Breakdown Card */}
            <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col gap-4">
              <h4 className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-[#1A1A1A]">
                OLFACTORY HARMONY ARCHITECTURE
              </h4>
              <div className="flex flex-col gap-3 text-xs font-sans text-[#4A4A4A]">
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                  <span className="font-medium text-[#1A1A1A]">TOP NOTES</span>
                  <span>Calabrian Bergamot, Grasse Neroli, Iranian Galbanum</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-black/5">
                  <span className="font-medium text-[#1A1A1A]">HEART NOTES</span>
                  <span>Florentine Iris Pallida, May Rose Absolute, Grasse Jasmine</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#1A1A1A]">BASE NOTES</span>
                  <span>Haitian Vetiver, Virginia Cedarwood, Creamed Sandalwood</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Specification Cards & Heritage */}
          <div className="flex flex-col gap-8">
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col gap-6">
              <h3 className="font-serif text-2xl font-light text-[#1A1A1A]">
                Flacon & Craft Specifications
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5 flex flex-col gap-1">
                  <span className="text-[#737373] tracking-widest uppercase text-[10px]">VOLUME</span>
                  <span className="font-medium text-sm text-[#1A1A1A]">100 ML / 3.4 FL. OZ.</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5 flex flex-col gap-1">
                  <span className="text-[#737373] tracking-widest uppercase text-[10px]">CONCENTRATION</span>
                  <span className="font-medium text-sm text-[#1A1A1A]">EAU DE PARFUM</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5 flex flex-col gap-1">
                  <span className="text-[#737373] tracking-widest uppercase text-[10px]">ORIGIN</span>
                  <span className="font-medium text-sm text-[#1A1A1A]">GRASSE, FRANCE</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5 flex flex-col gap-1">
                  <span className="text-[#737373] tracking-widest uppercase text-[10px]">FLACON DESIGN</span>
                  <span className="font-medium text-sm text-[#1A1A1A]">FACETED MONOLITH</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1A1A] text-white flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#A3A3A3]">ARTISANAL SEAL</span>
                <p className="text-xs font-light leading-relaxed">
                  Hand-sealed with traditional Baudruchage wax thread and stamped with the iconic Chanel double-C wax seal in Grasse, France.
                </p>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => alert('Boutique availability request initiated.')}
                className="flex-1 py-4 px-6 text-xs font-sans font-semibold tracking-[0.25em] uppercase text-white bg-[#1A1A1A] rounded-full hover:bg-black transition-all duration-300 cursor-pointer active:scale-95 shadow-md text-center"
              >
                REQUEST BOUTIQUE SAMPLE
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-4 px-6 text-xs font-sans font-semibold tracking-[0.25em] uppercase text-[#1A1A1A] bg-white border border-black/20 rounded-full hover:bg-black/5 transition-all duration-300 cursor-pointer active:scale-95 text-center"
              >
                RETURN TO SHOWCASE
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 py-6 border-t border-black/5 flex items-center justify-between text-xs font-sans text-[#737373]">
        <span>CHANEL N°19 HAUTE PARFUMERIE</span>
        <span>GRASSE & PARIS</span>
      </footer>
    </div>
  );
}
