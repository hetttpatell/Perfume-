import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

export default function Contact({ cartItems, setCartItems, isCartOpen, setIsCartOpen, onOpenAccount }) {
  // Contact Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState('faq-1');

  const faqs = [
    {
      id: 'faq-1',
      num: '01',
      question: 'How do I request complimentary fragrance discovery samples?',
      answer: 'Every full-size 50ml or 100ml flacon order automatically includes two complimentary 2ml luxury discovery samples of your choice at checkout so you can test new scents on your skin before opening your main bottle.',
    },
    {
      id: 'faq-2',
      num: '02',
      question: 'Is custom bottle engraving available for all flacons?',
      answer: 'Yes! Custom diamond-tip monogramming (up to 3 initials or a special date) and gold-thread baudruchage hand-sealing are available upon request during checkout or in-person at our Paris & New York flagship boutiques.',
    },
    {
      id: 'faq-3',
      num: '03',
      question: 'What is your return policy for unopened fragrances?',
      answer: 'We offer complimentary 30-day returns on all unopened items in their original FSC-certified packaging. Simply test your scent using the included 2ml sample first.',
    },
    {
      id: 'faq-4',
      num: '04',
      question: 'What are your carbon-neutral shipping timelines?',
      answer: 'Orders dispatch within 24 hours via temperature-controlled courier. Express European delivery arrives in 1-2 business days, and International Express arrives in 2-4 business days.',
    },
    {
      id: 'faq-5',
      num: '05',
      question: 'How can I schedule a 1-on-1 private scent consultation?',
      answer: 'You can reserve a 30-minute private consultation with one of our Haute Nose Specialists in person at our Paris or New York boutique, or virtually via live video concierge.',
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
    <div className="w-full min-h-screen bg-white text-[#111111] font-sans pt-20 sm:pt-28 md:pt-32 pb-12 overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* ── 1. MINIMALIST EDITORIAL HEADER ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-4 pb-8 sm:pb-12 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 max-w-2xl"
        >
          <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[#C08A3E] bg-[#C08A3E]/10 px-4 py-1.5 rounded-full border border-[#C08A3E]/20">
            HAUTE PARFUMERIE CONCIERGE
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#111111] tracking-tight leading-tight">
            Concierge & Inquiries
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed max-w-lg">
            Have a question about a formulation, order, or private salon consultation? Our concierge team is at your service.
          </p>
        </motion.div>
      </section>

      {/* ── 2. SECTION 1: CONTACT FORM & DIRECT CHANNELS GRID ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Clean Luxury Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-6"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
                Send a Message
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#666666] mt-1">
                Fill out your details below and our concierge team will respond within 24 hours.
              </p>
            </div>

            {/* Success Toast Notification */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 border border-emerald-700 shadow-md"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold block">Inquiry Submitted</span>
                    <span className="text-emerald-200 text-xs">
                      Your message has been transmitted to our concierge desk. We will respond shortly.
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="concierge@example.com"
                    className="w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  Subject / Order Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Order #LUNE-9842 or Engraving Request"
                  className="w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  Your Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our Haute Parfumerie concierge team assist you today?"
                  className="w-full px-4 py-3 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-4 bg-[#111111] hover:bg-[#333333] text-white font-sans text-xs font-bold tracking-[0.25em] uppercase rounded-xl transition-all duration-300 shadow-md cursor-pointer active:scale-[0.99] text-center"
              >
                SUBMIT CONCIERGE INQUIRY
              </button>
            </form>
          </motion.div>

          {/* RIGHT COLUMN: Direct Concierge Channels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Direct Concierge Contact Box */}
            <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-3xl flex flex-col gap-6 border border-black shadow-md">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#C08A3E]">
                  DIRECT CHANNELS
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex flex-col gap-5 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Email Concierge</span>
                  <a href="mailto:concierge@perfume.com" className="font-semibold text-sm text-white hover:text-[#C08A3E] transition-colors">
                    concierge@perfume.com
                  </a>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Telephone Hotline</span>
                  <a href="tel:+33144507000" className="font-semibold text-sm text-white hover:text-[#C08A3E] transition-colors">
                    +33 (0)1 44 50 70 00
                  </a>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Paris Flagship Boutique</span>
                  <span className="text-gray-200 block text-xs font-medium">31 Rue Cambon, 75001 Paris</span>
                  <span className="text-[11px] text-[#C08A3E]">Baudruchage Sealing Workshop</span>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">New York Boutique</span>
                  <span className="text-gray-200 block text-xs font-medium">767 Fifth Avenue, New York, NY</span>
                  <span className="text-[11px] text-[#C08A3E]">Diamond Monogramming Atelier</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. SECTION 2: FREQUENTLY ASKED QUESTIONS (Positioned Below Form) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-20 border-t border-gray-200">
        
        {/* Centered FAQ Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#C08A3E] bg-[#C08A3E]/10 px-4 py-1.5 rounded-full border border-[#C08A3E]/20 mb-3">
            HELPFUL ANSWERS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#666666] mt-2">
            Quick answers regarding sample orders, custom engraving, returns, and scent consultations.
          </p>
        </div>

        {/* Centered FAQ Accordion List */}
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#FAF8F5] border-[#C08A3E]/40 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-sans text-xs font-bold tracking-widest ${isOpen ? 'text-[#C08A3E]' : 'text-gray-400'}`}>
                      {faq.num}
                    </span>
                    <span className="font-sans font-bold text-xs sm:text-sm md:text-base text-[#111111]">
                      {faq.question}
                    </span>
                  </div>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-[#111111] text-white' : 'bg-gray-100 text-[#555555]'}`}>
                    ↓
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 pl-12 text-xs sm:text-sm text-[#555555] leading-relaxed border-t border-gray-200/40">
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
