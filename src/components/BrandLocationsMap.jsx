export default function BrandLocationsMap() {
  const primaryLocation = {
    name: '31 RUE CAMBON • PARIS FLAGSHIP',
    frenchTitle: 'Maison Haute Parfumerie Chanel',
    city: 'PARIS, FRANCE',
    address: '31 Rue Cambon, 75001 Paris, France',
    hours: 'MON - SAT: 10:00 AM - 7:00 PM',
    phone: '+33 1 44 50 70 00',
    description: 'The historic heart of Chanel. Experience bespoke fragrance consultations, private olfactory rituals, and hand-sealed baudruchage flacon sealing.',
    mapUrl: 'https://maps.google.com/maps?q=31%20Rue%20Cambon%2075001%20Paris%20France&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=31+Rue+Cambon+75001+Paris+France',
    coordinates: '48.8681° N, 2.3259° E'
  };

  return (
    <section className="w-full max-w-7xl mx-auto pt-10 sm:pt-14 pb-6 border-t border-black/10 text-[#1A1A1A] bg-[#FAFAFA]">
      {/* Section Title matching website design theme */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#737373] font-semibold block mb-1">
          06 // HAUTE BOUTIQUE LOCATION
        </span>
        <h2 className="font-serif font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight uppercase">
          VISIT OUR PARISIAN ATELIER
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#555555] font-light mt-1 max-w-2xl leading-relaxed">
          The historic home of Chanel Haute Parfumerie. Discover our full N°19 collection, private fragrance rituals, and artisanal baudruchage flacons.
        </p>
      </div>

      {/* Single Location Card & Map - Exact Website Theme */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch bg-white border border-black/10 rounded-xl overflow-hidden shadow-xs">
        {/* Left Info Column */}
        <div className="md:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white text-[#1A1A1A]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-sans tracking-[0.3em] text-[#C08A3E] font-semibold uppercase">
                {primaryLocation.city}
              </span>
              <span className="px-3 py-1 bg-black/5 text-[#1A1A1A] border border-black/10 text-[9px] font-sans tracking-[0.2em] uppercase rounded-full font-medium">
                FLAGSHIP SANCTUARY
              </span>
            </div>

            <p className="font-serif italic text-xs text-[#737373] mb-1">
              {primaryLocation.frenchTitle}
            </p>

            <h3 className="font-serif font-light text-2xl sm:text-3xl text-[#1A1A1A] uppercase tracking-tight mb-4">
              {primaryLocation.name}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#555555] font-light leading-relaxed mb-6">
              {primaryLocation.description}
            </p>

            {/* Address & Contact Info Block */}
            <div className="space-y-3 p-4 bg-[#FAFAFA] border border-black/10 rounded-lg text-xs font-sans">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#C08A3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <strong className="text-[#1A1A1A] block font-semibold uppercase text-[10px] tracking-widest">ADDRESS</strong>
                  <span className="text-[#555555] leading-relaxed">{primaryLocation.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-black/10">
                <svg className="w-4 h-4 text-[#C08A3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong className="text-[#1A1A1A] block font-semibold uppercase text-[10px] tracking-widest">BOUTIQUE HOURS</strong>
                  <span className="text-[#555555]">{primaryLocation.hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-black/10">
                <svg className="w-4 h-4 text-[#C08A3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <strong className="text-[#1A1A1A] block font-semibold uppercase text-[10px] tracking-widest">CONCIERGE TELEPHONE</strong>
                  <span className="text-[#555555]">{primaryLocation.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 mt-6 border-t border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-[10px] font-sans text-[#737373] tracking-widest font-mono text-center sm:text-left">
              GPS: {primaryLocation.coordinates}
            </span>

            <a
              href={primaryLocation.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-full transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <span>GET DIRECTIONS</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Themed Google Map Column */}
        <div className="md:col-span-7 bg-[#F6F6F6] min-h-[340px] sm:min-h-[420px] md:min-h-full relative flex flex-col border-t md:border-t-0 md:border-l border-black/10">
          {/* Header Bar Overlay matching dark theme accents */}
          <div className="bg-[#1A1A1A] text-white px-5 py-3.5 flex items-center justify-between text-xs font-sans tracking-[0.2em] uppercase z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">31 RUE CAMBON • PARIS</span>
            </div>
            <a
              href={primaryLocation.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#C08A3E] hover:underline font-semibold tracking-widest"
            >
              OPEN GOOGLE MAPS →
            </a>
          </div>

          {/* Embedded Google Map iframe styled with website grayscale filter */}
          <div className="flex-1 w-full h-full min-h-[300px] relative">
            <iframe
              title="Google Map of Chanel Paris Flagship Boutique"
              src={primaryLocation.mapUrl}
              className="w-full h-full min-h-[300px] border-0 filter grayscale contrast-[1.1] brightness-[0.96]"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
