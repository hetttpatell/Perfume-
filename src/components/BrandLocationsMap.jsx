import { useState } from 'react';

const BOUTIQUE_LOCATIONS = [
  {
    id: 'paris-cambon',
    name: '31 RUE CAMBON • PARIS FLAGSHIP',
    city: 'PARIS, FRANCE',
    address: '31 Rue Cambon, 75001 Paris, France',
    hours: 'MON - SAT: 10:00 AM - 7:00 PM',
    phone: '+33 1 44 50 70 00',
    description: 'The historic heart of Chanel. Experience bespoke fragrance consultations and baudruchage flacon sealing.',
    mapUrl: 'https://maps.google.com/maps?q=31%20Rue%20Cambon%2075001%20Paris%20France&t=&z=15&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=31+Rue+Cambon+75001+Paris+France',
    coordinates: '48.8681° N, 2.3259° E'
  },
  {
    id: 'grasse-atelier',
    name: 'GRASSE HARVEST ATELIER',
    city: 'GRASSE, CÔTE D\'AZUR',
    address: 'Domaine de Manon, Chemin des Horts, 06130 Grasse, France',
    hours: 'BY PRIVATE INVITATION ONLY',
    phone: '+33 4 93 36 00 00',
    description: 'The sanctuary where Florentine Iris Pallida and Grasse May Rose are cultivated for Chanel N°19.',
    mapUrl: 'https://maps.google.com/maps?q=Grasse%20France%20Domaine%20de%20Manon&t=&z=13&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Domaine+de+Manon+Grasse+France',
    coordinates: '43.6589° N, 6.9242° E'
  },
  {
    id: 'ny-fifth-ave',
    name: '5TH AVENUE HAUTE BOUTIQUE',
    city: 'NEW YORK, USA',
    address: '730 5th Ave, New York, NY 10019, United States',
    hours: 'MON - SAT: 10:00 AM - 6:00 PM',
    phone: '+1 212 535 5500',
    description: 'Exclusive North American boutique featuring the complete Chanel Les Exclusifs and N°19 Extrait collection.',
    mapUrl: 'https://maps.google.com/maps?q=730%205th%20Ave%20New%20York%20NY%2010019&t=&z=15&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=730+5th+Ave+New+York+NY+10019',
    coordinates: '40.7624° N, 73.9740° W'
  }
];

export default function BrandLocationsMap() {
  const [selectedLocation, setSelectedLocation] = useState(BOUTIQUE_LOCATIONS[0]);

  return (
    <div className="w-full max-w-7xl mx-auto pt-10 sm:pt-14 pb-8 border-t border-black/10 text-[#1A1A1A]">
      {/* Section Title */}
      <div className="mb-6 sm:mb-8">
        <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#737373] font-semibold block mb-1">
          06 // HAUTE BOUTIQUE LOCATIONS
        </span>
        <h2 className="font-serif font-light text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] tracking-tight uppercase">
          VISIT OUR FLAGSHIP ATELIERS
        </h2>
        <p className="font-sans text-xs text-[#555555] font-light mt-1 max-w-xl">
          Discover the world of Chanel Haute Parfumerie. Book private fragrance rituals or request directions to our historic sanctuaries.
        </p>
      </div>

      {/* Interactive Map & Locations Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Boutique Location Cards List (5 Cols on Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {BOUTIQUE_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#1A1A1A] shadow-md'
                    : 'bg-[#F6F6F6] border-black/5 hover:border-black/30 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-sans tracking-[0.25em] text-[#C08A3E] font-semibold uppercase">
                      {loc.city}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[8px] font-sans tracking-widest uppercase rounded-full">
                        ACTIVE MAP
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-light text-base sm:text-lg text-[#1A1A1A] uppercase tracking-wide mb-1">
                    {loc.name}
                  </h3>

                  <p className="font-sans text-xs text-[#555555] leading-relaxed mb-3">
                    {loc.address}
                  </p>

                  <div className="text-[10px] font-sans text-[#737373] space-y-0.5 border-t border-black/5 pt-2">
                    <div><strong className="text-[#1A1A1A]">HOURS:</strong> {loc.hours}</div>
                    <div><strong className="text-[#1A1A1A]">PHONE:</strong> {loc.phone}</div>
                  </div>
                </div>

                {/* Get Directions CTA */}
                <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] font-sans text-[#737373] tracking-widest font-mono">
                    {loc.coordinates}
                  </span>

                  <a
                    href={loc.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-1.5 text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>DIRECTIONS</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Embedded Google Map Component (7 Cols on Desktop) */}
        <div className="lg:col-span-7 bg-[#F0F0F0] rounded-xl overflow-hidden border border-black/10 min-h-[360px] sm:min-h-[440px] relative shadow-inner flex flex-col">
          {/* Map Header Overlay */}
          <div className="bg-[#1A1A1A] text-white px-4 sm:px-6 py-3 flex items-center justify-between text-xs font-sans tracking-widest uppercase z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">{selectedLocation.name}</span>
            </div>
            <a
              href={selectedLocation.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#C08A3E] hover:underline font-semibold tracking-widest"
            >
              OPEN FULL GOOGLE MAPS →
            </a>
          </div>

          {/* Embedded Google Map iframe with Monochrome Theme Styling */}
          <div className="flex-1 w-full relative">
            <iframe
              title={`Map of ${selectedLocation.name}`}
              src={selectedLocation.mapUrl}
              className="w-full h-full min-h-[320px] border-0 filter grayscale contrast-125 brightness-95"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
