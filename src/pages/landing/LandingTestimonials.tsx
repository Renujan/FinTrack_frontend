import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';

const testimonials = [
  {
    quote: "FinTrack completely changed how I manage my monthly salary. The automated budget alerts saved me over $400 last month alone by identifying unused subscriptions!",
    author: "Sarah Jenkins",
    role: "Senior Product Designer at Figma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    metric: "Saved $400/mo",
  },
  {
    quote: "The interactive analytics and PDF report generation make tax season so easy. It takes less than 30 seconds to export all my annual spending data.",
    author: "Marcus Chen",
    role: "Software Architect & Freelancer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    metric: "Saved 12 hrs/yr",
  },
  {
    quote: "Clean, dark mode UI, zero lag, and bank-level privacy. FinTrack is by far the best personal finance tracker on the market today.",
    author: "Elena Rostova",
    role: "Financial Analyst",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    metric: "5 Stars",
  },
];

export const LandingTestimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const prevTestimonial = () => {
    setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[activeIdx];

  return (
    <section id="testimonials" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
            <span>Loved by 50,000+ Users</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            What Our Users <span className="gradient-text">Have to Say</span>
          </h2>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto relative">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <Quote className="absolute top-6 right-6 w-24 h-24 text-slate-800/40 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Rating Stars */}
              <div className="flex items-center gap-1">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-3 text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {active.metric}
                </span>
              </div>

              {/* Quote Text */}
              <p className="text-lg sm:text-2xl text-slate-100 font-medium leading-relaxed font-sans">
                "{active.quote}"
              </p>

              {/* Author Details */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={active.avatar}
                    alt={active.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shadow-md"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white font-heading">{active.author}</h4>
                    <p className="text-xs text-slate-400">{active.role}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
