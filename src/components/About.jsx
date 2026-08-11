import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

// Distinct High-Res Assets & Local Images
import brandHeritageStory from '../assets/brand_heritage_story.png';
import brandHeritageCraft from '../assets/brand_heritage_craft.png';
import sensoryRitualBg from '../assets/sensory_ritual_bg.png';
import phlurAboutHero from '../assets/phlur_about_hero.png';

export default function About({ cartItems, setCartItems, isCartOpen, setIsCartOpen, onOpenAccount }) {
  const navigate = useNavigate();

  // Fresh Master Perfumers Portraits
  const masterPerfumers = [
    {
      name: 'FRANK VOELKL',
      role: 'PRINCIPAL PERFUMER',
      portrait: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      bio: 'A sought-after perfumer instrumental in creating iconic trend-setting fragrances, Frank merges emotional intuition with French perfume tradition.',
      creations: 'Maison Lune creations: L’Éclat de Jour, Velvet Amber',
    },
    {
      name: 'JÉRÔME EPINETTE',
      role: 'SENIOR PERFUMERY DIRECTOR',
      portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
      bio: 'A supreme perfumer synonymous with intoxicating fine fragrance, Jérôme has had a long career at Robertet crafting critically acclaimed scents.',
      creations: 'Maison Lune creations: Rich Blossom, Santal Luminous',
    },
    {
      name: 'GIL CLAVIEN',
      role: 'MASTER FORMULATION SCIENTIST',
      portrait: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
      bio: 'Principal perfumer renowned for her breadth of work, Gil balances rare botanical absolutes with 32% high-concentration Extrait endurance.',
      creations: 'Maison Lune creations: Noir Solstice, Fleur de Soie',
    },
  ];

  // Core Brand Pillars & Values
  const coreValues = [
    {
      number: '01',
      title: 'CLIENT INTIMACY',
      tag: 'PERSONAL BESPOKE CARE',
      desc: 'We know our patrons by name. From personalized bottle engravings to bespoke scent consultations, every creation is tailored with dedicated atelier attention.',
    },
    {
      number: '02',
      title: 'ARTISTRY & SCIENCE',
      tag: 'MOLECULAR EXCELLENCE',
      desc: 'Merging 50 years of Grasse botanical heritage with 32% Extrait de Parfum concentration, ensuring unmatched sillage and longevity without compromise.',
    },
    {
      number: '03',
      title: 'SUSTAINABLE BOTANICALS',
      tag: 'ECO-RESPONSIBLE HARVESTING',
      desc: '100% FSC-certified recyclable boxes, bio-degradable flacons, and responsibly sourced Iris, Rose, and Neroli harvests directly from Grasse farms.',
    },
    {
      number: '04',
      title: 'UNCOMPROMISING PURITY',
      tag: 'ZERO SYNTHETIC DILUENTS',
      desc: 'Formulated without parabens, phthalates, or unnecessary fillers. Transparency at every step gives you the confidence to wear scent as second skin.',
    }
  ];

  return (
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-0 sm:pt-24 md:pt-28 pb-12 overflow-x-hidden selection:bg-black selection:text-white">

      {/* ── 1. FULL WIDTH HERO BANNER (Background Video Integration) ── */}
      <section className="relative w-full overflow-hidden bg-[#0F2230] text-white min-h-[340px] sm:min-h-[420px] lg:min-h-[480px] flex items-center border-b border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        >
          <source src="/Video/Generate_a_video_that_will_pla.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Gradient Overlay for Maximum Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 pointer-events-none" />

        {/* Hero Content Container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:py-14 md:py-16 pb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full md:w-9/12 lg:w-7/12 flex flex-col items-start gap-4 sm:gap-5"
          >
            <h1 className="font-sans font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.1] drop-shadow-md">
              ARTISTRY. BACKED BY SCIENCE.
            </h1>

            <p className="font-sans text-[11px] sm:text-sm md:text-base text-white/90 font-light leading-relaxed max-w-xl drop-shadow-sm">
              Maison Lune creates scents for the present tense. Modern fragrances mindfully formulated, responsibly sourced, and meticulously crafted by world-class perfumers in Grasse and Paris.
            </p>

            <button
              onClick={() => navigate('/collection')}
              className="mt-2 px-7 py-3 border border-white text-white hover:bg-white hover:text-black font-sans font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
            >
              EXPLORE CREATIONS
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 2. STATS STRIP (Website Standard Light Grey Palette) ── */}
      <section className="w-full bg-[#F9F9FB] border-b border-gray-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="font-sans font-extrabold text-3xl sm:text-5xl text-[#111111]">
              50+
            </span>
            <p className="text-[11px] sm:text-xs font-sans font-bold tracking-widest text-[#666666] uppercase mt-1">
              YEARS OF HERITAGE
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-sans font-extrabold text-3xl sm:text-5xl text-[#111111]">
              32%
            </span>
            <p className="text-[11px] sm:text-xs font-sans font-bold tracking-widest text-[#666666] uppercase mt-1">
              EXTRAIT CONCENTRATION
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-sans font-extrabold text-3xl sm:text-5xl text-[#111111]">
              100%
            </span>
            <p className="text-[11px] sm:text-xs font-sans font-bold tracking-widest text-[#666666] uppercase mt-1">
              GRASSE BOTANICALS
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-sans font-extrabold text-3xl sm:text-5xl text-[#111111]">
              0%
            </span>
            <p className="text-[11px] sm:text-xs font-sans font-bold tracking-widest text-[#666666] uppercase mt-1">
              SYNTHETIC DILUENTS
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. SECTION 1: Fragrance to elevate your everyday (New Artisanal Crafting Image) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Column Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="w-full aspect-square bg-[#F5F5F5] overflow-hidden shadow-xs"
          >
            <img
              src={brandHeritageCraft}
              alt="Maison Lune Artisanal Crafting Laboratory"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right Column Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4 text-left"
          >
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
              Fragrance to elevate your everyday
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Our idea of a signature scent is one that matches your mood and leaves room for you. Because we know that being human is inherently complex and change is the only constant. Maison Lune fragrances evolve with you — for today's desires and tomorrow's realities.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Maison Lune is a modern fine fragrance brand that extends into your daily life. Scent to enhance, but never define, your every mood and moment.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Strong. Vulnerable. Authentic. Maison Lune encourages you to curate a wardrobe that celebrates the complexities of you.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── 4. SECTION 2: A note from Chriselle Lim (New Portrait Image) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4 text-left order-2 md:order-1"
          >
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
              A note from Chriselle Lim
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Hi, My name is Chriselle, the Creative Director at Maison Lune.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              I joined Maison Lune during a time of transformation both for the brand and for me personally. Maison Lune had launched as a pioneer in fine fragrance and was looking to refine its position in the market. I had seen how meaningful and evocative fragrance could be in my life and wanted to share that experience with a bigger audience.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Fashion may have provided fragrance in my career, but to me, scent has always been personal. I view fragrance as an extension of personal style. Switching a scent each day allows us to define a mood, elevate a feeling, and express who we are — or who we want to be. Fragrance helps us to communicate. It tells stories.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Thank you for joining Maison Lune on this exciting journey. I appreciate your love and support, and I can't wait to continue to grow together.
            </p>
          </motion.div>

          {/* Right Column Image (Fresh Creative Director Editorial Image) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="w-full aspect-[4/5] bg-[#F5F5F5] overflow-hidden shadow-xs order-1 md:order-2"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
              alt="Chriselle Lim - Creative Director at Maison Lune"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </section>

      {/* ── 5. CORE VALUES & BRAND PILLARS (2x2 Grid on Mobile, 4-Cols on Desktop) ── */}
      <section className="w-full bg-[#F9F9FB] border-b border-gray-200 py-10 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-8 md:px-12 lg:px-16">
          <div className="w-full text-left mb-6 sm:mb-8">
            <h2 className="font-sans font-extrabold text-base sm:text-xl md:text-2xl text-[#111111] uppercase tracking-wider">
              OUR GUIDING VALUES
            </h2>
          </div>

          {/* 2x2 Grid on Mobile, 4 Columns on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {coreValues.map((val, idx) => (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 p-3.5 sm:p-7 shadow-xs flex flex-col justify-between space-y-2 sm:space-y-4"
              >
                <div>
                  <span className="font-sans font-extrabold text-xl sm:text-2xl text-[#111111] block mb-1 sm:mb-2">
                    {val.number}
                  </span>
                  <span className="text-[8.5px] sm:text-[10px] font-sans font-bold tracking-widest text-[#666666] uppercase block mb-0.5 sm:mb-1">
                    {val.tag}
                  </span>
                  <h3 className="font-sans font-bold text-xs sm:text-sm text-[#111111] uppercase tracking-wider leading-snug">
                    {val.title}
                  </h3>
                  <p className="text-[10.5px] sm:text-xs text-[#555555] font-normal leading-relaxed mt-1 sm:mt-2">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. INGREDIENT & SUSTAINABILITY PHILOSOPHY (2-Column Grid on Mobile) ── */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3 sm:gap-10 lg:gap-16">
          
          {/* Card 1: Ingredient Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-2 sm:gap-4 text-left"
          >
            <div className="w-full aspect-square bg-[#F5F5F5] overflow-hidden shadow-xs mb-1 sm:mb-2 rounded-xl sm:rounded-none">
              <img
                src="https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=1000&auto=format&fit=crop"
                alt="Fresh Grasse Floral Extracts & Dew Drops"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-sans font-bold text-sm sm:text-2xl md:text-3xl text-[#111111] tracking-tight leading-tight">
              Ingredient philosophy
            </h2>
            <p className="font-sans text-[10.5px] sm:text-xs md:text-sm text-[#444444] leading-relaxed">
              At Maison Lune, we use both natural and nature-identical synthetic ingredients. We love botanical ingredients for the character they add, however natural doesn't always equal safer or more sustainable.
            </p>
            <p className="font-sans text-[10.5px] sm:text-xs md:text-sm text-[#444444] leading-relaxed hidden sm:block">
              Harvesting natural ingredients can require tons of botanicals for a very small amount of material. We partner with leading fragrance suppliers to utilize sustainable natural materials and respect the environment.
            </p>
          </motion.div>

          {/* Card 2: Packaging Sustainability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-2 sm:gap-4 text-left"
          >
            <div className="w-full aspect-square bg-[#F5F5F5] overflow-hidden shadow-xs mb-1 sm:mb-2 rounded-xl sm:rounded-none">
              <img
                src={sensoryRitualBg}
                alt="Sustainable Maison Lune Recyclable Flacons"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-sans font-bold text-sm sm:text-2xl md:text-3xl text-[#111111] tracking-tight leading-tight">
              Packaging sustainability
            </h2>
            <p className="font-sans text-[10.5px] sm:text-xs md:text-sm text-[#444444] leading-relaxed">
              Sustainability has always been a priority at Maison Lune. We make thoughtful choices along the way that reduce our impact on the planet while still being functional and beautiful.
            </p>
            <p className="font-sans text-[10.5px] sm:text-xs md:text-sm text-[#444444] leading-relaxed hidden sm:block">
              All of our cartons are printed on FSC-certified paper, meaning they are sourced from responsibly managed forests. Our heavy glass bottles are designed for endless recycling.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── 7. MASTER PERFUMERS (2-Column Grid on Mobile) ── */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-16 md:py-20">
        
        {/* Section Heading */}
        <div className="w-full text-left mb-6 sm:mb-8">
          <h2 className="font-sans font-extrabold text-base sm:text-xl md:text-2xl text-[#111111] uppercase tracking-wider">
            MAISON LUNE'S MASTER PERFUMERS
          </h2>
        </div>

        {/* 2-Column Grid on Mobile, 3 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {masterPerfumers.map((perfumer, idx) => (
            <motion.div
              key={perfumer.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`flex flex-col bg-[#F4F4F4] overflow-hidden text-left rounded-xl sm:rounded-none ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              {/* Grayscale Portrait Image */}
              <div className="w-full aspect-[4/5] bg-gray-200 overflow-hidden">
                <img
                  src={perfumer.portrait}
                  alt={perfumer.name}
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>

              {/* Info Box */}
              <div className="p-3.5 sm:p-6 flex flex-col justify-between flex-1 gap-2 sm:gap-4">
                <div>
                  <h3 className="font-sans font-bold text-xs sm:text-sm text-[#111111] uppercase tracking-wider mb-1 sm:mb-2">
                    {perfumer.name}
                  </h3>
                  <p className="font-sans text-[10.5px] sm:text-xs text-[#555555] leading-relaxed">
                    {perfumer.bio}
                  </p>
                </div>

                <p className="font-sans text-[9.5px] sm:text-[11px] font-medium text-[#777777] border-t border-gray-300/60 pt-2 sm:pt-3">
                  {perfumer.creations}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Centered Shop All Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/collection')}
            className="bg-black text-white hover:bg-[#333333] font-sans font-bold text-xs tracking-[0.25em] uppercase px-10 py-3.5 transition-colors cursor-pointer active:scale-95"
          >
            SHOP ALL CREATIONS
          </button>
        </div>

      </section>

      {/* ── 8. GLOBAL FOOTER ── */}
      <Footer />

    </div>
  );
}
