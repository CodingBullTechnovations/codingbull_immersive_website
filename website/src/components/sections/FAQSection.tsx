'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { FAQItem } from '@/types/content';

interface FAQSectionProps {
  items: FAQItem[];
}

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const buttonId = `faq-trigger-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-white/[0.04] last:border-b-0">
      <button
        id={buttonId}
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className={`text-[15px] font-medium pr-6 transition-colors duration-300 ${isOpen ? 'text-teal' : 'text-white/70 group-hover:text-white/90'}`}>
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen ? 'border-teal/50 bg-teal/20 text-teal shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'border-white/[0.1] bg-white/[0.03] text-white/60 group-hover:bg-white/[0.06]'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm text-white/70 leading-[1.8] font-light pr-12">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-36 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-[var(--max-w-narrow)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal/60 block mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-5">
            <span className="text-white">Common </span>
            <span className="bg-gradient-to-r from-teal to-[#5aeacc] bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-white/70 text-base max-w-lg mx-auto leading-relaxed font-light">
            Straightforward answers about how we work, what we charge, and what to expect.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-3xl border border-white/[0.05] bg-black/40 backdrop-blur-2xl px-8 lg:px-12 shadow-[0_0_40px_-15px_rgba(20,184,166,0.1)]"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
