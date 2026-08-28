import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

// ── Image Assets from /aboutus ──────────────────────────
const IMAGES = {
  kannaujDistillery: '/aboutus/kannuj.jpg',
  kannaujRoses: '/aboutus/kannuj 2.jpg',
  kannaujWaterTanks: '/aboutus/kannuj 3.jpg',
  kannaujCraftsman: '/aboutus/kannuj 4.jpg',
  saffronHarvest: '/aboutus/mustafa-jUUNUFN5Pxo-unsplash.jpg',
  driedRosebuds: '/aboutus/aurelie-sgnl-V8IiD0GVb3o-unsplash.jpg',
  rawResins: '/aboutus/dianne-NbFO1LocHUI-unsplash.jpg',
  spiceMarketBazaar: '/aboutus/jon-villanueva-dLyt-mceALY-unsplash.jpg',
  artisanHands: '/aboutus/frederick-shaw-U93sPwZaiWY-unsplash.jpg',
};

// ── Curated Visual Archive / Gallery ─────────────────────
const GALLERY_ITEMS = [
  {
    id: 1,
    src: IMAGES.kannaujDistillery,
    title: 'The Sacred Stills of Kannauj',
    category: 'TRADITION',
    location: 'Kannauj, Uttar Pradesh',
    desc: 'Sunbeams cutting through steam across rows of hand-beaten copper Degs, where hydro-distillation has been practiced uninterrupted for over a millennium.',
  },
  {
    id: 2,
    src: IMAGES.kannaujCraftsman,
    title: 'The Clay & Jute Seal',
    category: 'CRAFT',
    location: 'Heritage Atelier',
    desc: 'A master craftsman seals a steaming copper Deg with wet river clay (mitti) and cotton twine, locking in fragile volatile essences without synthetic gaskets.',
  },
  {
    id: 3,
    src: IMAGES.kannaujRoses,
    title: 'Ruh Gulab — Damask Rose Influx',
    category: 'HARVEST',
    location: 'Rose Valley Fields',
    desc: 'Freshly harvested Damask roses poured by the sack into boiling copper stills within hours of dawn picking to capture pure dew-kissed floral notes.',
  },
  {
    id: 4,
    src: IMAGES.saffronHarvest,
    title: 'Red Gold — Saffron Blossoms',
    category: 'RARE BOTANICALS',
    location: 'Pampore, Kashmir',
    desc: 'Artisans delicately sorting purple Crocus sativus petals to harvest the prized crimson saffron stigmas that give our base accords their warm, golden glow.',
  },
  {
    id: 5,
    src: IMAGES.rawResins,
    title: 'Raw Frankincense & Barks',
    category: 'RESINS & SPICES',
    location: 'Apothecary Vault',
    desc: 'Natural frankincense resin tears, crushed rose petals, and aged cinnamon barks resting in cedar chests before slow maceration.',
  },
  {
    id: 6,
    src: IMAGES.artisanHands,
    title: 'The Master Artisan’s Touch',
    category: 'CURATION',
    location: 'Sorting Table',
    desc: 'Every blossom, leaf, and botanical filament is hand-inspected and graded for olfactory purity before entering our formulation laboratory.',
  },
  {
    id: 7,
    src: IMAGES.kannaujWaterTanks,
    title: 'Subterranean Cooling & Bhapka',
    category: 'DISTILLATION',
    location: 'Condensation Vaults',
    desc: 'Long bamboo pipes (Chonga) channeling fragrant vapors into copper receiver flasks (Bhapka) submerged in cold water tanks for gradual condensation.',
  },
  {
    id: 8,
    src: IMAGES.driedRosebuds,
    title: 'Sun-Cured Rosebuds & Aged Woods',
    category: 'EXTRACTION',
    location: 'Botanical Reserve',
    desc: 'Whole dried rosebuds and aromatic wood shavings prepared for multi-stage tincture infusions and concentrated absolute extracts.',
  },
  {
    id: 9,
    src: IMAGES.spiceMarketBazaar,
    title: 'The Grand Olfactory Palette',
    category: 'INGREDIENTS',
    location: 'Global Spice Markets',
    desc: 'Barrels of vibrant lavender, blue cornflowers, chamomile, hibiscus, and crushed pink peppercorns curated from ancient spice and floral routes.',
  },
];

// ── Guiding Atelier Pillars ──────────────────────────────
const CORE_VALUES = [
  {
    number: '01',
    title: 'ANCIENT HYDRO-DISTILLATION',
    tag: 'DEG-BHAPKA ALCHEMY',
    desc: 'We uphold the sacred 1,000-year-old hydro-distillation method in pure copper vessels over wood embers, preserving the fragile soul of every botanical without harsh chemical solvents.',
  },
  {
    number: '02',
    title: '32% EXTRAIT CONCENTRATION',
    tag: 'OPULENT SILLAGE & ENDURANCE',
    desc: 'Every Maison Lune creation is blended at an exceptional 32% Extrait de Parfum concentration, ensuring multidimensional projection and lasting intimate longevity on skin.',
  },
  {
    number: '03',
    title: 'ETHICAL GENERATIONAL SOURCING',
    tag: 'FAIR HARVEST PARTNERSHIPS',
    desc: 'Direct partnerships with generational rose harvesters in Kannauj, saffron growers in Kashmir, and iris farmers in Grasse ensure fair wages and regenerative agricultural stewardship.',
  },
  {
    number: '04',
    title: 'ZERO SYNTHETIC FILLERS',
    tag: 'UNCOMPROMISED PURITY',
    desc: 'Formulated strictly without phthalates, parabens, or synthetic diluents. Every drop is pure, skin-safe, and cruelty-free—crafted to wear like an intimate second skin.',
  },
];

export default function About() {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredGallery =
    activeTab === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-0 sm:pt-24 md:pt-28 pb-0 overflow-x-hidden selection:bg-[#111111] selection:text-white">

      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section className="relative w-full overflow-hidden bg-[#0A1118] text-white min-h-[420px] sm:min-h-[520px] lg:min-h-[580px] flex items-center border-b border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-60 scale-105"
        >
          <source src="/Video/Generate_a_video_that_will_pla.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90 pointer-events-none" />

        {/* Hero Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-24 sm:py-16 md:py-20 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full md:w-10/12 lg:w-8/12 flex flex-col items-start gap-4 sm:gap-6"
          >
            {/* Subtle Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#C08A3E] animate-pulse" />
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/90 font-medium">
                THE ATELIER HERITAGE • EST. KANNAUJ & PARIS
              </span>
            </div>

            <h1 className="font-sans font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.08] drop-shadow-lg">
              WHERE TIMELESS ALCHEMY MEETS HAUTE PARFUMERIE.
            </h1>

            <p className="font-sans text-xs sm:text-sm md:text-base text-white/85 font-light leading-relaxed max-w-2xl drop-shadow-sm">
              Maison Lune revives the sacred 1,000-year-old art of <strong className="text-white font-medium">Deg-Bhapka hydro-distillation</strong> from the historic perfume capital of Kannauj. We harmonize rare natural florals, hand-sorted saffron, and precious resins with contemporary French olfactory mastery.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
              <button
                onClick={() => navigate('/collection')}
                className="px-8 py-3.5 bg-white text-black hover:bg-[#E5E5E5] font-sans font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-md"
              >
                EXPLORE CREATIONS
              </button>
              <a
                href="#kannauj-heritage"
                className="px-7 py-3.5 border border-white/40 text-white hover:bg-white/10 font-sans font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 backdrop-blur-xs"
              >
                THE DISTILLATION STORY
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. STATS STRIP ── */}
      <section className="w-full bg-[#FAF8F5] border-b border-gray-200/80 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-gray-200/60">
          <div className="space-y-1 px-2">
            <span className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-[#111111]">
              1,000+
            </span>
            <p className="text-[10px] sm:text-xs font-sans font-bold tracking-widest text-[#777777] uppercase mt-1">
              YEARS OF KANNAUJ CRAFT
            </p>
          </div>
          <div className="space-y-1 px-2">
            <span className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-[#111111]">
              32%
            </span>
            <p className="text-[10px] sm:text-xs font-sans font-bold tracking-widest text-[#777777] uppercase mt-1">
              EXTRAIT DE PARFUM
            </p>
          </div>
          <div className="space-y-1 px-2">
            <span className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-[#111111]">
              100%
            </span>
            <p className="text-[10px] sm:text-xs font-sans font-bold tracking-widest text-[#777777] uppercase mt-1">
              PURE BOTANICAL OILS
            </p>
          </div>
          <div className="space-y-1 px-2">
            <span className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-[#111111]">
              0%
            </span>
            <p className="text-[10px] sm:text-xs font-sans font-bold tracking-widest text-[#777777] uppercase mt-1">
              PETROCHEMICAL SOLVENTS
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. CHAPTER I: THE SACRED ART OF DEG-BHAPKA (Split Editorial) ── */}
      <section id="kannauj-heritage" className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14 sm:py-20 md:py-24 border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Two Juxtaposed Photos (Distillery Stills + Craftsman Sealing) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[3/4] bg-gray-100 overflow-hidden shadow-md group cursor-pointer"
              onClick={() => setSelectedPhoto(GALLERY_ITEMS[0])}
            >
              <img
                src={IMAGES.kannaujDistillery}
                alt="Sunbeams streaming into historic Kannauj Deg-Bhapka distillery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#C08A3E] font-bold block">
                  KANNAUJ • THE STILLS
                </span>
                <p className="text-[11px] sm:text-xs font-medium leading-tight line-clamp-1">
                  1,000-Year Copper Stills
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-[3/4] bg-gray-100 overflow-hidden shadow-md group mt-6 sm:mt-8 cursor-pointer"
              onClick={() => setSelectedPhoto(GALLERY_ITEMS[1])}
            >
              <img
                src={IMAGES.kannaujCraftsman}
                alt="Master artisan sealing steaming copper still with sacred clay and rope"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#C08A3E] font-bold block">
                  SACRED CLAY SEAL
                </span>
                <p className="text-[11px] sm:text-xs font-medium leading-tight line-clamp-1">
                  Master Artisanal Intuition
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Narrative Copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col gap-4 sm:gap-5 text-left"
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-bold">
              CHAPTER I • THE ROOTS OF PERFUME
            </span>

            <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] tracking-tight leading-tight uppercase">
              THE SACRED DEGS OF KANNAUJ: DISTILLING SOUL FROM FLAME.
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Nestled along the sacred banks of the Ganges, <strong>Kannauj</strong> has stood as the perfume capital of the East for over a millennium. Long before modern industrial factories turned to chemical solvents and artificial fixatives, the masters of Kannauj perfected <em>Deg-Bhapka</em>—a slow, sacred hydro-distillation method passed down across ten generations.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Each hammered copper pot (<em>Deg</em>) is filled with wild botanicals and pure water, sealed hermetically with wet river clay (<em>mitti</em>) and bound with cotton rope. As wood and cow dung fires simmer below, precious aromatic vapors travel through angled bamboo tubes (<em>Chonga</em>) directly into copper receiver flasks (<em>Bhapka</em>) resting submerged in cool subterranean water tanks.
            </p>

            <div className="p-4 bg-[#FAF8F5] border-l-2 border-[#C08A3E] mt-2">
              <p className="font-sans text-xs italic text-[#333333] leading-relaxed">
                “There are no digital gauges or chemical additives here. The distiller listens to the bubbling still, touches the copper neck to measure heat, and relies entirely on generational instinct to know the exact moment the essence yields.”
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 4. CHAPTER II: DAWN HARVEST — RUH GULAB & RED SAFFRON ── */}
      <section className="w-full bg-[#FAF8F5] border-b border-gray-200/70 py-14 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-bold block mb-2">
              CHAPTER II • THE BOTANICAL HARVEST
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] uppercase tracking-tight">
              HARVESTED AT DAWN. CAPTURED BEFORE SUNRISE.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#666666] leading-relaxed mt-3">
              The volatile essence of a blossom is most potent in the cool stillness of early dawn, just as the morning dew clings to opening petals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Card 1: Damask Roses */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-gray-200/80 overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div
                className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => setSelectedPhoto(GALLERY_ITEMS[2])}
              >
                <img
                  src={IMAGES.kannaujRoses}
                  alt="Fresh Damask rose petals being loaded into traditional copper deg still"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1">
                  RUH GULAB
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col gap-3 text-left">
                <h3 className="font-sans font-extrabold text-lg sm:text-xl text-[#111111] uppercase tracking-wide">
                  DAMASK ROSE (ROSA DAMASCENA)
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed">
                  Every spring, thousands of farmers gather in Kannauj and Grasse at 4:00 AM to hand-pick newly bloomed Damask roses. Within two hours, entire cartloads of dewy pink petals are rushed to the stills and immersed directly into copper pots. It takes over <strong>4,000 kilograms of freshly plucked blossoms</strong> to yield a single kilogram of pure, uncut Rose Absolute.
                </p>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#777777] font-medium">
                  <span>Harvest Window: April – May</span>
                  <span className="text-[#C08A3E] font-bold">100% Single-Origin</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Saffron Blossom Stigmas */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white border border-gray-200/80 overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div
                className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => setSelectedPhoto(GALLERY_ITEMS[3])}
              >
                <img
                  src={IMAGES.saffronHarvest}
                  alt="Delicate hand-sorting of Crocus sativus purple saffron petals and red stigmas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1">
                  RED GOLD (ZAFRAN)
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col gap-3 text-left">
                <h3 className="font-sans font-extrabold text-lg sm:text-xl text-[#111111] uppercase tracking-wide">
                  KASHMIRI SAFFRON (CROCUS SATIVUS)
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed">
                  Renowned as “Red Gold,” the vibrant purple blossoms of saffron bloom for only two fleeting weeks each autumn. Artisans gently separate the three crimson stigmas by hand. When infused into our amber bases, saffron imparts an intoxicating warmth, honeyed spice, and unmistakable leather-velvet depth.
                </p>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#777777] font-medium">
                  <span>Pampore Valley Harvest</span>
                  <span className="text-[#C08A3E] font-bold">Hand-Sorted Stigmas</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 5. CHAPTER III: THE APOTHECARY VAULT & RARE RESINS ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14 sm:py-20 md:py-24 border-b border-gray-100">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          <div className="lg:col-span-7 text-left space-y-3">
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-bold">
              CHAPTER III • THE RAW PALETTE
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] uppercase tracking-tight">
              FROM SOMALIAN RESIN TEARS TO SUN-CURED BOTANICAL BUDS.
            </h2>
          </div>
          <div className="lg:col-span-5 text-left">
            <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed">
              True fine perfumery requires harmony between fleeting floral top notes and enduring, resinous base fixatives. We source raw aromatics across historic spice routes to compose scents that evolve intimately across hours.
            </p>
          </div>
        </div>

        {/* 3-Column Botanical Triptych */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Resin Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col bg-[#FAF8F5] border border-gray-200/80 overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPhoto(GALLERY_ITEMS[4])}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
              <img
                src={IMAGES.rawResins}
                alt="Apothecary box with raw frankincense tears, rose petals, and cinnamon bark"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[9px] font-sans font-bold uppercase tracking-wider">
                RAW RESINS & BARKS
              </span>
            </div>
            <div className="p-5 text-left space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-[#111111] uppercase tracking-wide">
                  FRANKINCENSE & MYRRH
                </h4>
                <p className="font-sans text-xs text-[#555555] leading-relaxed mt-1">
                  Sun-hardened resin tears collected from wild Boswellia trees, yielding mystical balsamic, citrus-pine undertones that fix scent deeply to skin.
                </p>
              </div>
              <span className="text-[10px] text-[#C08A3E] font-bold tracking-widest uppercase pt-2 border-t border-gray-200 block">
                AGE: 2+ YEARS CURED
              </span>
            </div>
          </motion.div>

          {/* Dried Rosebuds & Woods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col bg-[#FAF8F5] border border-gray-200/80 overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPhoto(GALLERY_ITEMS[7])}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
              <img
                src={IMAGES.driedRosebuds}
                alt="Scoop of fragrant dried rosebuds and aromatic wood shavings"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[9px] font-sans font-bold uppercase tracking-wider">
                SUN-CURED BOTANICALS
              </span>
            </div>
            <div className="p-5 text-left space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-[#111111] uppercase tracking-wide">
                  ROSEBUDS & CEDARWOOD
                </h4>
                <p className="font-sans text-xs text-[#555555] leading-relaxed mt-1">
                  Naturally shade-dried flower buds and sustainably harvested cedarwood shavings used in delicate tincture infusions and artisanal maceration.
                </p>
              </div>
              <span className="text-[10px] text-[#C08A3E] font-bold tracking-widest uppercase pt-2 border-t border-gray-200 block">
                100% SOLAR SHADE DRIED
              </span>
            </div>
          </motion.div>

          {/* Spice Bazaar Barrels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col bg-[#FAF8F5] border border-gray-200/80 overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPhoto(GALLERY_ITEMS[8])}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
              <img
                src={IMAGES.spiceMarketBazaar}
                alt="Vibrant apothecary barrels of lavender, blue cornflower, chamomile, and pink peppercorn"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[9px] font-sans font-bold uppercase tracking-wider">
                GLOBAL SPICE BAZAAR
              </span>
            </div>
            <div className="p-5 text-left space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-[#111111] uppercase tracking-wide">
                  FLORALS & EXOTIC SPICES
                </h4>
                <p className="font-sans text-xs text-[#555555] leading-relaxed mt-1">
                  High-altitude French lavender, Roman chamomile, blue cornflowers, and crushed Madagascar pink peppercorns creating kaleidoscopic olfactory nuances.
                </p>
              </div>
              <span className="text-[10px] text-[#C08A3E] font-bold tracking-widest uppercase pt-2 border-t border-gray-200 block">
                ETHICALLY TRADED
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 6. CHAPTER IV: THE RITUAL OF PATIENCE & SUBTERRANEAN COOLING ── */}
      <section className="w-full bg-[#111111] text-white py-14 sm:py-20 md:py-24 border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Atmospheric Water Tank Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] bg-[#1C1C1C] overflow-hidden shadow-2xl group cursor-pointer"
              onClick={() => setSelectedPhoto(GALLERY_ITEMS[6])}
            >
              <img
                src={IMAGES.kannaujWaterTanks}
                alt="Long bamboo pipes leading into copper receiver flasks in Kannauj condensation water tanks"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white pointer-events-none">
                <span className="inline-block px-3 py-1 mb-2 bg-[#C08A3E]/30 backdrop-blur-md border border-[#C08A3E]/40 font-sans text-[9px] uppercase tracking-[0.3em] text-[#E0A958] font-bold">
                  THE CONDENSATION VAULT
                </span>
                <p className="font-sans text-sm sm:text-base font-light text-white/95 leading-snug">
                  Bamboo Chonga Pipes & Subterranean Cooling Tanks
                </p>
              </div>
            </motion.div>

            {/* Right: Narrative on Maturation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 text-left"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-bold">
                CHAPTER IV • THE UNHURRIED PROCESS
              </span>

              <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight leading-tight">
                THE RITUAL OF STILLNESS & CELLAR MATURATION.
              </h2>

              <p className="font-sans text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                In an era dominated by instant chemical synthesis, Maison Lune embraces the luxury of time. As fragrant vapors condense in the subterranean water tanks, the essential oils gently infuse into base botanical carriers drop by drop.
              </p>

              <p className="font-sans text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                A single distillation cycle takes 15 consecutive days of fire and water. Once extracted, our Extrait formulations rest for a minimum of <strong>six months in temperature-controlled dark cellars</strong>, allowing the molecular bonds between saffron, damask rose, and woody resins to marry into seamless harmony.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">
                    DISTILLATION TIME
                  </span>
                  <span className="font-sans font-bold text-base sm:text-lg text-[#C08A3E]">
                    15 DAYS
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">
                    CELLAR MACERATION
                  </span>
                  <span className="font-sans font-bold text-base sm:text-lg text-[#C08A3E]">
                    180+ DAYS
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 7. INTERACTIVE VISUAL ARCHIVE & GALLERY (ALL 9 IMAGES) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14 sm:py-20 md:py-24 border-b border-gray-100">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="text-left">
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-bold block mb-2">
              THE VISUAL ARCHIVE
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] uppercase tracking-tight">
              JOURNEY THROUGH OUR ATELIER & STILLS.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#666666] mt-2">
              Click on any photograph to explore the craft, origin, and extraction story.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['all', 'tradition', 'harvest', 'resins', 'distillation'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#111111] text-white'
                    : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 9-Image Editorial Mosaic Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <AnimatePresence>
            {filteredGallery.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setSelectedPhoto(item)}
                className="group relative aspect-[4/3] bg-gray-100 overflow-hidden shadow-xs cursor-pointer border border-gray-200/60"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 sm:p-5 text-left" />

                {/* Badge Always Visible */}
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5">
                  {item.category}
                </div>

                {/* Hover Content Details */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="text-[9px] text-[#C08A3E] uppercase tracking-wider font-bold block mb-0.5">
                    {item.location}
                  </span>
                  <h4 className="font-sans font-bold text-xs sm:text-sm text-white leading-tight">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </section>

      {/* ── 8. THE MAISON LUNE MANIFESTO / 4 GUIDING PILLARS ── */}
      <section className="w-full bg-[#FAF8F5] border-b border-gray-200/80 py-14 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="w-full text-left mb-8 sm:mb-12">
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-bold block mb-2">
              OUR PROMISE
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] uppercase tracking-tight">
              FOUR PILLARS OF OUR ATELIER.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CORE_VALUES.map((val, idx) => (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-gray-200/90 p-5 sm:p-7 shadow-xs flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sans font-black text-2xl sm:text-3xl text-[#111111]">
                      {val.number}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#C08A3E]" />
                  </div>
                  <span className="text-[9px] font-sans font-bold tracking-widest text-[#C08A3E] uppercase block mb-1">
                    {val.tag}
                  </span>
                  <h3 className="font-sans font-extrabold text-sm sm:text-base text-[#111111] uppercase tracking-wider leading-snug mb-3">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#555555] font-normal leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FOUNDER & MASTER DISTILLER’S NOTE ── */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-20 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-5 sm:gap-6"
        >
          <div className="w-12 h-[2px] bg-[#C08A3E]" />
          
          <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#C08A3E] font-bold">
            A NOTE FROM OUR ATELIER
          </span>

          <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-[#111111] uppercase tracking-tight max-w-2xl leading-tight">
            “SCENT IS NOT A MASK. IT IS AN EMOTIVE ARCHIVE OF MEMORY.”
          </h2>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#444444] font-light leading-relaxed max-w-2xl">
            We founded Maison Lune with a single driving conviction: that the world had grown too accustomed to fleeting, chemical-heavy perfumes that disappear within an hour. By returning to the sacred Deg-Bhapka heritage of Kannauj and marrying it with the elegance of contemporary formulation, we invite you to wear scent as an authentic second skin—bold, vulnerable, and unforgettable.
          </p>

          <div className="mt-4 flex flex-col items-center">
            <span className="font-serif italic text-lg sm:text-xl text-[#111111]">
              Maison Lune Atelier
            </span>
            <span className="font-sans text-[10px] text-[#777777] uppercase tracking-widest mt-1">
              Kannauj & Paris
            </span>
          </div>

          <button
            onClick={() => navigate('/collection')}
            className="mt-6 px-10 py-4 bg-[#111111] text-white hover:bg-black font-sans font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-md"
          >
            DISCOVER THE FULL COLLECTION
          </button>
        </motion.div>
      </section>

      {/* ── 10. LIGHTBOX PHOTO MODAL ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#111111] text-white rounded-none overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row cursor-default"
            >
              {/* Image Preview */}
              <div className="w-full md:w-7/12 aspect-[4/3] md:aspect-auto max-h-[70vh] bg-black">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>

              {/* Story Sidebar in Modal */}
              <div className="w-full md:w-5/12 p-6 sm:p-8 flex flex-col justify-between text-left gap-4 bg-[#181818]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#C08A3E]/20 border border-[#C08A3E]/40 text-[#E0A958] text-[9px] font-sans font-bold uppercase tracking-widest">
                      {selectedPhoto.category}
                    </span>
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="text-white/60 hover:text-white text-xl p-1 cursor-pointer"
                      aria-label="Close modal"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="font-sans font-extrabold text-lg sm:text-xl text-white uppercase tracking-tight leading-snug">
                    {selectedPhoto.title}
                  </h3>

                  <p className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">
                    📍 {selectedPhoto.location}
                  </p>

                  <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed pt-2 border-t border-white/10">
                    {selectedPhoto.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                    MAISON LUNE ARCHIVE
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPhoto(null);
                      navigate('/collection');
                    }}
                    className="text-[10px] font-sans font-bold text-[#E0A958] hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    VIEW FRAGRANCES →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 11. GLOBAL FOOTER ── */}
      <Footer />

    </div>
  );
}
