import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

// Generated High-Res Assets matching PHLUR Editorial Reference
import heroBg from '../assets/phlur_about_hero.png';
import colorfulBottles from '../assets/phlur_colorful_bottles.png';
import chrisellePortrait from '../assets/phlur_chriselle_portrait.png';
import skinHands from '../assets/phlur_skin_hands.png';
import flowerDroplet from '../assets/phlur_flower_droplet.png';
import bottleCaps from '../assets/phlur_bottle_caps.png';

export default function About({ cartItems, setCartItems, isCartOpen, setIsCartOpen, onOpenAccount }) {
  const navigate = useNavigate();

  // Master Perfumers exact data from PHLUR website inspiration
  const masterPerfumers = [
    {
      name: 'FRANK VOELKL',
      portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      bio: 'A sought-after perfumer, Frank Voelkl is a principal perfumer at Firmenich and has created many iconic fragrances, including his instrumental role in creating the Le Labo trend.',
      creations: 'PHLUR creations: Father Figure, Golden Rule, Missing Person',
    },
    {
      name: 'JÉRÔME EPINETTE',
      portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      bio: 'A supreme perfumer synonymous with the most intoxicating indie brands, Jérôme has had a long career at Robertet where he has been responsible for scores of bestselling and critically acclaimed fragrances.',
      creations: 'PHLUR creations: Not Your Baby, Tangerine Boy, Coconut Skin',
    },
    {
      name: 'GIL CLAVIEN',
      portrait: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      bio: 'Principal perfumer at Firmenich since 1997, Gil Clavien is known for her breadth of work that reaches mass market to fine fragrance and everything in between.',
      creations: 'PHLUR creations: Heavy Cream, Lost Cause',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-0 sm:pt-24 md:pt-28 pb-12 overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* ── 1. FULL WIDTH HERO BANNER (Matched to Collection Page Spacing) ── */}
      <section className="relative w-full overflow-hidden bg-[#0F2230] text-white min-h-[310px] sm:min-h-[380px] lg:min-h-[440px] flex items-center border-b border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
        {/* Background Image */}
        <img
          src={heroBg}
          alt="PHLUR Moody Periwinkle Fluid Background"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        
        {/* Dark Gradient Overlay for Maximum Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent pointer-events-none" />

        {/* Hero Content Container - Matching Collection Page Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:py-14 md:py-16 pb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full md:w-9/12 lg:w-7/12 flex flex-col items-start gap-4 sm:gap-5"
          >
            <h1 className="font-sans font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.1] drop-shadow-md">
              PHLUR CREATES SCENTS FOR THE PRESENT TENSE.
            </h1>

            <p className="font-sans text-[11px] sm:text-sm md:text-base text-white/90 font-light leading-relaxed max-w-xl drop-shadow-sm">
              Modern fragrances mindfully formulated, responsibly sourced, and meticulously crafted by world-class perfumers. Inspired by memories and feelings — those that are intimately personal and universally shared.
            </p>

            <button
              onClick={() => navigate('/collection')}
              className="mt-2 px-7 py-3 border border-white text-white hover:bg-white hover:text-black font-sans font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
            >
              SHOP NOW
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 2. SECTION 1: Fragrance to elevate your everyday (Image Left / Text Right) ── */}
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
              src={colorfulBottles}
              alt="PHLUR Colorful Perfume Bottles"
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
              Our idea of a signature scent is one that matches your mood and leaves room for you. Because we know that being human is inherently complex and change is the only constant. PHLUR fragrances evolve with you — for today's desires and tomorrow's realities.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              PHLUR is a modern fine fragrance brand that extends into your daily life. Scent to enhance, but never define, your every mood and moment.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Strong. Vulnerable. Authentic. PHLUR encourages you to curate a wardrobe that celebrates the complexities of you.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── 3. SECTION 2: A note from Chriselle Lim (Text Left / Image Right) ── */}
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
              Hi, My name is Chriselle, the Creative Director at PHLUR.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              I joined PHLUR in 2021 during a time of transformation both for the brand and for me personally. PHLUR had launched as a pioneer in the clean fragrance space and was looking to refine its position in the market. I was exploring what it meant to enter a new chapter after a hiatus, and was looking for a new challenge professionally. When the opportunity presented itself to lead PHLUR, a brand I'd admired so much, into its next phase, something clicked. I had seen how meaningful and evocative fragrance could be in my life and wanted to share that experience with a bigger audience.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Fashion may have provided fragrance in my career, but to me, scent has always been personal. I view fragrance as an extension of personal style. Switching a scent each day allows us to define a mood, elevate a feeling, and express who we are — or who we want to be. Fragrance helps us to communicate. It tells stories. I'm excited to continue sharing those stories with PHLUR.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              It's been a phenomenal few years for the brand. We have won awards, expanded into more product categories, and created incredible new scents. In doing so, we've been honored to learn from our fantastic community base. Your personal stories and scent interpretations drive our inspiration. Thank you for joining PHLUR and me on this exciting journey. I appreciate your love and support, and I can't wait to continue to grow together.
            </p>
          </motion.div>

          {/* Right Column Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="w-full aspect-[4/5] bg-[#F5F5F5] overflow-hidden shadow-xs order-1 md:order-2"
          >
            <img
              src={chrisellePortrait}
              alt="Chriselle Lim - Creative Director at PHLUR"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </section>

      {/* ── 4. SECTION 3: We don't use the word "clean" anymore (Image Left / Text Right) ── */}
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
              src={skinHands}
              alt="Skin and Scent Interaction"
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
              We don't use the word "clean" anymore
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              PHLUR helped pioneer the "clean" fragrance industry as one of the first clean fragrance brands, and we maintain that commitment to sustainability and transparency.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Today though, we avoid using the word "clean" because it's a word that means different things to different people. Within the beauty industry the word "clean" isn't regulated — and in some instances, "clean" language can be negative and create unnecessary or unsubstantiated concerns among consumers.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              As opposed to focusing on what ingredients are not in our formulas, we prefer to focus on the ingredients we choose to use and why. We hope this gives our customers the opportunity to decide for themselves what is important to them.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── 5. SECTION 4: Ingredient philosophy (Text Left / Image Right) ── */}
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
              Ingredient philosophy
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              At PHLUR, we use both natural and synthetic ingredients.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              We love botanical ingredients for the character they add to our fragrances, however natural doesn't always equal safer. In some cases, synthetic ingredients can be less allergenic than certain natural ingredients.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Harvesting natural ingredients for fine fragrance can require tons of botanicals for a very small amount of material. Many natural ingredients are at risk of becoming overharvested and endangered. We partner with the world's leading fragrance suppliers to ensure we are utilizing sustainable natural materials and we are being respectful of the environment.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              With all this considered, we may choose to use nature identical synthetics because it's a more sustainable or thoughtful choice while offering broader fragrance possibilities to our perfumers to develop true fine fragrance creations.
            </p>
          </motion.div>

          {/* Right Column Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="w-full aspect-square bg-[#F5F5F5] overflow-hidden shadow-xs order-1 md:order-2"
          >
            <img
              src={flowerDroplet}
              alt="White Flower Bud Droplet"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </section>

      {/* ── 6. SECTION 5: Packaging sustainability (Image Left / Text Right) ── */}
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
              src={bottleCaps}
              alt="PHLUR Sustainable Packaging Bottle Caps"
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
              Packaging sustainability
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Sustainability has always been a priority at PHLUR.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Producing and utilizing packaging materials for a product brand like ours is inevitable and necessary. We want to make thoughtful choices along the way that can reduce our impact on the planet while still being functional and beautiful.
            </p>

            <p className="font-sans text-xs sm:text-sm text-[#444444] leading-relaxed">
              Since 2021, we have reduced our plastic and paper usage and use PCR materials whenever possible. All of our cartons are printed on FSC-certified paper, meaning they are sourced from responsibly managed forests.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── 7. SECTION 6: PHLUR'S MASTER PERFUMERS (3-Column Grid) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20">
        
        {/* Section Heading */}
        <div className="w-full text-left mb-8">
          <h2 className="font-sans font-extrabold text-lg sm:text-xl md:text-2xl text-[#111111] uppercase tracking-wider">
            PHLUR'S MASTER PERFUMERS
          </h2>
        </div>

        {/* 3 Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {masterPerfumers.map((perfumer, idx) => (
            <motion.div
              key={perfumer.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col bg-[#F4F4F4] overflow-hidden text-left"
            >
              {/* Grayscale Portrait Image */}
              <div className="w-full aspect-[4/5] bg-gray-200 overflow-hidden">
                <img
                  src={perfumer.portrait}
                  alt={perfumer.name}
                  className="w-full h-full object-cover grayscale contrast-105"
                />
              </div>

              {/* Light Grey Info Box */}
              <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h3 className="font-sans font-bold text-sm text-[#111111] uppercase tracking-wider mb-2">
                    {perfumer.name}
                  </h3>
                  <p className="font-sans text-xs text-[#555555] leading-relaxed">
                    {perfumer.bio}
                  </p>
                </div>

                <p className="font-sans text-[11px] font-medium text-[#777777] border-t border-gray-300/60 pt-3">
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
            SHOP ALL
          </button>
        </div>

      </section>

      {/* ── 8. GLOBAL FOOTER ── */}
      <Footer />

    </div>
  );
}
