import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { value: 'ordered', label: '1. ORDERED', dotColor: 'bg-amber-400' },
  { value: 'dispatched', label: '2. DISPATCHED', dotColor: 'bg-blue-400' },
  { value: 'out_for_delivery', label: '3. OUT FOR DELIVERY', dotColor: 'bg-purple-400' },
  { value: 'delivered', label: '4. DELIVERED', dotColor: 'bg-emerald-400' }
];

export default function CustomStageSelect({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const normalizedValue = (value || 'ordered').toLowerCase();
  const activeValue = normalizedValue === 'pending' ? 'ordered' : normalizedValue === 'received' ? 'delivered' : normalizedValue;
  const currentStage = STAGES.find(s => s.value === activeValue) || STAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left font-sans">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white border border-[#C08A3E]/40 hover:border-[#C08A3E] rounded-xl text-xs font-sans font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md flex items-center gap-3 disabled:opacity-50 select-none"
      >
        <span className={`w-2 h-2 rounded-full ${currentStage.dotColor} animate-pulse`} />
        <span>{currentStage.label}</span>
        <svg
          className={`w-3.5 h-3.5 text-[#C08A3E] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-1 w-56 bg-[#111111] border border-[#C08A3E]/30 rounded-2xl shadow-2xl p-1.5 backdrop-blur-md font-sans text-xs overflow-hidden"
          >
            <div className="px-3 py-1.5 text-[9px] font-sans font-bold tracking-[0.25em] text-[#C08A3E] uppercase border-b border-white/10 mb-1">
              SELECT STAGE STATUS
            </div>

            <div className="space-y-0.5">
              {STAGES.map((stg) => {
                const isSelected = stg.value === activeValue;

                return (
                  <button
                    key={stg.value}
                    type="button"
                    onClick={() => {
                      onChange(stg.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-sans font-extrabold text-[11px] tracking-wider uppercase transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#C08A3E] text-white shadow-sm'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${stg.dotColor}`} />
                      <span>{stg.label}</span>
                    </div>

                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
