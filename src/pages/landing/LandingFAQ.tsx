import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Is FinTrack free to use?",
    answer: "Yes! Our Starter plan is completely free forever with no credit card required. You can track transactions, create budgets, and manage savings goals right away.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. FinTrack uses bank-grade 256-bit AES encryption for all stored data and SSL/TLS in transit. We never sell or share your financial records.",
  },
  {
    question: "Can I export my data for tax season or accounting?",
    answer: "Yes, you can export your financial transactions and monthly reports into clean CSV and formatted PDF documents anytime from the Reports section.",
  },
  {
    question: "How does recurring subscription tracking work?",
    answer: "FinTrack lets you log recurring subscriptions (like Netflix, Spotify, AWS, or Gym), specify renewal cycles, and receive automated reminders before payments are due.",
  },
  {
    question: "Can I upgrade or cancel my Pro plan subscription anytime?",
    answer: "Yes! There are no lock-in contracts. You can upgrade, downgrade, or cancel your subscription at any time with one click from your Account Settings.",
  },
];

export const LandingFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative z-10 bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white font-heading">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl bg-slate-800 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
