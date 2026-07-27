import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import sensoryBgImg from '../assets/sensory_ritual_bg.png';
import luminousBgImg from '../assets/lune_luminous_hero_bg.png';

export default function Contact({ cartItems, setCartItems, isCartOpen, setIsCartOpen, onOpenAccount }) {
  const navigate = useNavigate();

  // Contact Form State
  const [selectedTopic, setSelectedTopic] = useState('Personal Consultation');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const topicOptions = [
    'Personal Consultation',
    'Order Inquiry',
    'Boutique Appointment',
    'Press & Wholesale',
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
      setFormData({ fullName: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-0 sm:pt-24 md:pt-28 pb-12 overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* ── 1. DEDICATED HERO BANNER (Matched Spacing) ── */}
      <section className="relative w-full overflow-hidden bg-[#0F2230] text-white min-h-[310px] sm:min-h-[380px] lg:min-h-[440px] flex items-center border-b border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
        {/* Background Image */}
        <img
          src={sensoryBgImg}
          alt="LUNE Concierge Background"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent pointer-events-none" />

        {/* Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:py-14 md:py-16 pb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full md:w-9/12 lg:w-7/12 flex flex-col items-start gap-4"
          >
            <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#C08A3E] bg-[#C08A3E]/10 px-3.5 py-1.5 rounded-full border border-[#C08A3E]/20">
              HAUTE CONCIERGE & BOUTIQUES
            </span>

            <h1 className="font-sans font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.1] drop-shadow-md">
              AT YOUR SERVICE
            </h1>

            <p className="font-sans text-[11px] sm:text-sm md:text-base text-white/90 font-light leading-relaxed max-w-xl drop-shadow-sm">
              Whether seeking a bespoke fragrance consultation, order assistance, or private flagship boutique appointments, our Haute Parfumerie concierge is available to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. MAIN CONTACT SECTION (Form Left / Flagships Right) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div>
              <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
                Send a Message to Concierge
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#666666] mt-1.5 leading-relaxed">
                Select your topic inquiry below and our concierge team will respond within 24 hours.
              </p>
            </div>

            {/* Topic Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {topicOptions.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedTopic === topic
                      ? 'bg-[#111111] text-white shadow-md'
                      : 'bg-[#F4F4F4] text-[#555555] hover:bg-gray-200'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Success Toast */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Thank you! Your message regarding "{selectedTopic}" has been logged with our Concierge. We will get back to you shortly.</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#333333]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#333333]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="concierge@example.com"
                    className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#333333]">
                  Subject / Order Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Order #LUNE-9842 or Custom Monogramming"
                  className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#333333]">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our Haute Parfumerie concierge assist you today?"
                  className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full sm:w-auto px-8 py-4 bg-[#111111] hover:bg-[#333333] text-white font-sans text-xs font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-md cursor-pointer active:scale-95 text-center"
              >
                SUBMIT CONCIERGE INQUIRY
              </button>
            </form>
          </motion.div>

          {/* Right Column: Flagship Boutiques & Direct Channels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Flagship Boutiques Card */}
            <div className="bg-[#F8F6F0] p-6 sm:p-8 rounded-3xl border border-gray-200 flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-gray-200/80 pb-4">
                <span className="w-2 h-2 rounded-full bg-[#C08A3E]" />
                <h3 className="font-sans font-bold text-sm text-[#111111] uppercase tracking-wider">
                  FLAGSHIP BOUTIQUES
                </h3>
              </div>

              {/* Paris Flagship */}
              <div className="flex flex-col gap-1 text-left">
                <span className="font-serif text-lg font-bold text-[#111111]">
                  Paris Flagship Boutique
                </span>
                <span className="font-sans text-xs text-[#555555]">
                  31 Rue Cambon, 75001 Paris, France
                </span>
                <span className="font-sans text-[11px] text-[#777777] mt-1">
                  Private Salon & Baudruchage Seal Workshop
                </span>
              </div>

              {/* New York Flagship */}
              <div className="flex flex-col gap-1 text-left pt-3 border-t border-gray-200/60">
                <span className="font-serif text-lg font-bold text-[#111111]">
                  New York Boutique
                </span>
                <span className="font-sans text-xs text-[#555555]">
                  767 Fifth Avenue, New York, NY 10153
                </span>
                <span className="font-sans text-[11px] text-[#777777] mt-1">
                  Haute Scent Bar & Monogram Atelier
                </span>
              </div>

              {/* Direct Concierge Contact Details */}
              <div className="flex flex-col gap-3 pt-3 border-t border-gray-200/60">
                <div className="flex items-center gap-3 text-xs text-[#444444]">
                  <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email: concierge@perfume.com</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#444444]">
                  <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1.01 1.01 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Phone: +33 (0)1 44 50 70 00</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#444444]">
                  <svg className="w-4 h-4 text-[#C08A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hours: Mon – Sat 10:00 AM – 7:00 PM CET</span>
                </div>
              </div>

              {/* Book Appointment CTA */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenAccount) onOpenAccount();
                }}
                className="mt-2 w-full py-3.5 px-4 bg-transparent border border-black hover:bg-black hover:text-white font-sans text-xs font-bold uppercase tracking-[0.15em] rounded-xl transition-all duration-300 cursor-pointer active:scale-95"
              >
                BOOK PRIVATE BOUTIQUE APPOINTMENT
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. FAQ ACCORDION SECTION ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 border-b border-gray-100">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#C08A3E] bg-[#C08A3E]/10 px-4 py-1.5 rounded-full border border-[#C08A3E]/20 mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-sans font-bold text-2xl sm:text-4xl text-[#111111] tracking-tight">
            Concierge Assistance FAQ
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#666666] mt-2">
            Quick answers regarding sample orders, engraving, returns, and scent consultations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#FBF9F5] border border-gray-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-sans font-bold text-sm sm:text-base text-[#111111] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className={`w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-black text-white' : ''}`}>
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
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-gray-200/60 font-sans text-xs sm:text-sm text-[#555555] leading-relaxed">
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

      {/* ── 4. GLOBAL FOOTER ── */}
      <Footer />

    </div>
  );
}
