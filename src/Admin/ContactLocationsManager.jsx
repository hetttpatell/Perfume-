import { useState } from 'react';

export default function ContactLocationsManager() {
  const [locations] = useState([
    { name: 'FLAGSHIP BOUTIQUE PARIS', address: '18 Rue de la Paix, 75002 Paris, France', phone: '+33 1 42 68 55 00', hours: '10:00 AM - 7:30 PM' },
    { name: 'MAISON LUNE LE MARAIS', address: '42 Rue des Francs-Bourgeois, 75004 Paris', phone: '+33 1 44 59 88 12', hours: '10:30 AM - 8:00 PM' }
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <span className="text-[10px] font-sans font-extrabold tracking-[0.3em] uppercase text-[#C08A3E] block mb-1">
          STORE LOCATIONS & INQUIRIES
        </span>
        <h2 className="font-serif font-black text-2xl text-[#111111] uppercase tracking-tight">
          BOUTIQUE LOCATIONS & CONTACT
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {locations.map((loc, idx) => (
          <div key={idx} className="bg-[#F4F4F6] border border-black/10 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif font-extrabold text-base text-[#111111] uppercase tracking-wide">
              {loc.name}
            </h3>
            <p className="text-xs font-sans text-[#555555] font-semibold">{loc.address}</p>
            <div className="pt-2 border-t border-black/10 text-[11px] font-sans text-[#111111] flex justify-between">
              <span>{loc.phone}</span>
              <span>{loc.hours}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
