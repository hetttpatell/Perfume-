import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

// Luxury High-Res Assets
import contactHeroBg from '../assets/phlur_contact_hero.png';
import parisBoutiqueImg from '../assets/phlur_paris_boutique.png';
import nyBoutiqueImg from '../assets/brand_heritage_story.png';

export default function Contact({ cartItems, setCartItems, isCartOpen, setIsCartOpen, onOpenAccount }) {
  const navigate = useNavigate();

  // Contact Form State
  const [selectedTopic, setSelectedTopic] = useState('Private Consultation');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeBoutiqueTab, setActiveBoutiqueTab] = useState('paris');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const topicOptions = [
    { id: 'Private Consultation', label: '✨ Private Consultation', desc: 'Bespoke scent pairing with a Nose Specialist' },
    { id: 'Order & Delivery', label: '📦 Order & White-Glove Shipping', desc: 'Tracking, express shipping & order support' },
    { id: 'Boutique Appointment', label: '🏛️ Flagship Appointment', desc: 'Paris or New York salon reservations' },
    { id: 'Press & Wholesale', label: '🤝 Press & Wholesale', desc: 'Media inquiries & haute retailer partnerships' },
  ];

  const services = [
    {
      title: 'Private Salon Consultations',
      desc: '30-minute bespoke 1-on-1 scent pairing with our Master Nose Specialists in Paris, NY, or via virtual live concierge.',
      icon: (
        <svg className="w-6 h-6 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Bespoke Gold Engraving',
      desc: 'Complimentary diamond-tip monogramming and gold-thread baudruchage sealing on all Extrait de Parfum flacons.',
      icon: (
        <svg className="w-6 h-6 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: 'Discovery Sample Trios',
      desc: 'Complimentary 2ml luxury discovery vials included with every full-size bottle order to test on skin first.',
      icon: (
        <svg className="w-6 h-6 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.08 1.08a2 2 0 00-.585 1.414V19a2 2 0 002 2h14a2 2 0 002-2v-.939a2 2 0 00-.585-1.414l-1.08-1.08z" />
        </svg>
      ),
    },
    {
      title: 'Carbon-Neutral Express Shipping',
      desc: '100% climate-neutral express dispatch via specialized temperature-controlled courier worldwide.',
      icon: (
        <svg className="w-6 h-6 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7.414a2.5 2.5 0 00-.732-1.768l-2.464-2.464A2.5 2.5 0 0016.036 2.5H12A4 4 0 008 3.935z" />
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I request complimentary fragrance discovery samples?',
      answer: 'Every full-size 50ml or 100ml flacon order automatically includes two complimentary 2ml luxury discovery samples of your choice at checkout so you can experience new scents before opening your main bottle.',
    },
    {
      id: 'faq-2',
      question: 'Is custom bottle engraving available for all flacons?',
      answer: 'Yes! Custom diamond-tip monogramming (up to 3 initials or a special date) is available for all Extrait de Parfum and Eau de Parfum bottles upon request during checkout or at our Paris & New York boutiques.',
    },
    {
      id: 'faq-3',
      question: 'What is your return policy for unopened fragrances?',
      answer: 'We offer complimentary 30-day returns on all unopened items in their original FSC-certified packaging. Use the included 2ml sample to test the scent on your skin first.',
    },
    {
      id: 'faq-4',
      question: 'How can I schedule a 1-on-1 scent layering consultation?',
      answer: 'You can book a complimentary 30-minute private consultation with one of our Haute Nose Specialists either in person at our Paris flagship boutique or virtually via live video concierge.',
    },
    {
      id: 'faq-5',
      question: 'What are your carbon-neutral shipping timelines?',
      answer: 'Orders are dispatched within 24 hours. Express European delivery arrives in 1-2 business days, and International Express arrives within 2-4 business days via carbon-neutral courier.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.message) {
      setIsSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-0 sm:pt-24 md:pt-28 pb-12 overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* ── 1. ULTRA-LUXURY HERO BANNER ── */}
      <section className="relative w-full overflow-hidden bg-[#0A0D10] text-white min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center border-b border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        {/* Background Image */}
        <img
          src={contactHeroBg}
          alt="LUNE Haute Concierge Luxury Ambient Background"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-80"
        />
        
        {/* Rich Ambient Gradient & Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-[#C08A3E]/20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C08A3E]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-24 sm:pt-32 md:pt-36 pb-12 sm:pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full md:w-9/12 lg:w-7/12 flex flex-col items-start gap-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#C08A3E] animate-pulse" />
              <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#F3E5AB]">
                HAUTE CONCIERGE & PRIVATE SALONS
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] drop-shadow-md">
              At Your Service. <br />
              <span className="italic font-normal text-[#F3E5AB]">In Person or Confidential.</span>
            </h1>

            <p className="font-sans text-xs sm:text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-xl drop-shadow-sm mt-1">
              Private olfactory consultations, bespoke flacon monogramming, and white-glove courier assistance worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. HAUTE SERVICES HIGHLIGHTS GRID ── */}
      <section className="w-full bg-[#FDFBF7] border-b border-gray-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex flex-col gap-3 group hover:border-[#C08A3E]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-[#FBF9F5] border border-gray-200/60 w-fit group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-sans font-bold text-sm text-[#111111] tracking-wide mt-1">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-[#666666] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FLAGSHIP BOUTIQUES SHOWCASE ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-24 border-b border-gray-100">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#C08A3E] bg-[#C08A3E]/10 px-4 py-1.5 rounded-full border border-[#C08A3E]/20 mb-3">
            WORLDWIDE BOUTIQUES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#111111]">
            Visit Our Flagship Salons
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#666666] mt-3 max-w-xl leading-relaxed">
            Experience our haute perfumerie collection in person. Private consultations and hand-sealed baudruchage flacon workshops available.
          </p>
        </div>

        {/* 2 Column Boutique Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          
          {/* Paris Flagship Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src={parisBoutiqueImg}
                alt="Paris Flagship Boutique Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-[#111111]">
                PARIS FLAGSHIP
              </span>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="font-serif text-xl font-bold block">31 Rue Cambon</span>
                <span className="font-sans text-xs text-gray-200">Paris 75001, France</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-6">
              <div className="flex flex-col gap-3 text-xs text-[#555555]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-[#111111]">Concierge Telephone</span>
                  <span>+33 (0)1 44 50 70 00</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-[#111111]">Direct Email</span>
                  <span>paris@perfume.com</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-[#111111]">Operating Hours</span>
                  <span>Mon – Sat: 10:00 – 19:00 CET</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#111111]">Specialties</span>
                  <span className="text-[#C08A3E] font-medium">Baudruchage Gold Threading</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAccount) onOpenAccount();
                }}
                className="w-full py-3.5 px-4 bg-[#111111] hover:bg-[#C08A3E] text-white font-sans text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-colors duration-300 cursor-pointer active:scale-95 text-center"
              >
                RESERVE PARIS SALON APPOINTMENT
              </button>
            </div>
          </motion.div>

          {/* New York Boutique Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src={nyBoutiqueImg}
                alt="New York Boutique Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-[#111111]">
                NEW YORK SALON
              </span>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="font-serif text-xl font-bold block">767 Fifth Avenue</span>
                <span className="font-sans text-xs text-gray-200">New York, NY 10153</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-6">
              <div className="flex flex-col gap-3 text-xs text-[#555555]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-[#111111]">Concierge Telephone</span>
                  <span>+1 (212) 555-0199</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-[#111111]">Direct Email</span>
                  <span>ny@perfume.com</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-[#111111]">Operating Hours</span>
                  <span>Mon – Sat: 10:00 – 19:00 EST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#111111]">Specialties</span>
                  <span className="text-[#C08A3E] font-medium">Diamond Monogram Engraving</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAccount) onOpenAccount();
                }}
                className="w-full py-3.5 px-4 bg-[#111111] hover:bg-[#C08A3E] text-white font-sans text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-colors duration-300 cursor-pointer active:scale-95 text-center"
              >
                RESERVE NY SALON APPOINTMENT
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 4. MODERN LUXURY CONCIERGE CONTACT FORM SECTION ── */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 md:px-12 py-16 sm:py-24 border-b border-gray-100">
        <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-12 border border-[#C08A3E]/30 shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C08A3E]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Form Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#C08A3E] mb-2">
              CONFIDENTIAL INQUIRY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
              Send a Message to Concierge
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
              Our Haute Parfumerie concierge team responds to all inquiries within 24 business hours.
            </p>
          </div>

          {/* Interactive Topic Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {topicOptions.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-[#111111] text-white border-black shadow-md scale-[1.02]'
                      : 'bg-white text-[#444444] border-gray-200/80 hover:border-black/30'
                  }`}
                >
                  <span className="font-sans text-xs font-bold tracking-wider">
                    {topic.label}
                  </span>
                  <span className={`font-sans text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-gray-300' : 'text-[#777777]'}`}>
                    {topic.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Success Toast */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-5 bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 shadow-lg border border-emerald-700"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <span className="font-bold block">Inquiry Logged Successfully!</span>
                  <span className="text-emerald-200 text-xs">
                    Your confidential request regarding "{selectedTopic}" has been transmitted to our Paris Concierge Desk.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#222222]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C08A3E] focus:ring-1 focus:ring-[#C08A3E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#222222]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="concierge@example.com"
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C08A3E] focus:ring-1 focus:ring-[#C08A3E] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#222222]">
                  Telephone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 (0)6 12 34 56 78"
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C08A3E] focus:ring-1 focus:ring-[#C08A3E] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#222222]">
                  Order Number / Subject (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Order #LUNE-9842 or Custom Flacon"
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C08A3E] focus:ring-1 focus:ring-[#C08A3E] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#222222]">
                Confidential Inquiry Message *
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe how our Haute Parfumerie concierge team can assist you..."
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C08A3E] focus:ring-1 focus:ring-[#C08A3E] transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#111111] hover:bg-[#C08A3E] text-white font-sans text-xs font-bold tracking-[0.25em] uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer active:scale-[0.99] text-center"
              >
                TRANSMIT CONCIERGE REQUEST
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── 5. FAQ ACCORDION SECTION ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-24 border-b border-gray-100">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#C08A3E] bg-[#C08A3E]/10 px-4 py-1.5 rounded-full border border-[#C08A3E]/20 mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#111111]">
            Concierge Assistance FAQ
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#666666] mt-3">
            Quick answers regarding sample orders, engraving, returns, and private salon consultations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden transition-all shadow-2xs hover:border-[#C08A3E]/40"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-sans font-bold text-sm sm:text-base text-[#111111] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className={`w-8 h-8 rounded-full bg-[#FBF9F5] border border-gray-200 flex items-center justify-center text-xs transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-[#111111] text-white border-black' : ''}`}>
                    ↓
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-gray-100 font-sans text-xs sm:text-sm text-[#555555] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. GLOBAL FOOTER ── */}
      <Footer />

    </div>
  );
}
