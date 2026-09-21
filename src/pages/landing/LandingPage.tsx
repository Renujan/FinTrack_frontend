import React from 'react';
import LandingHeader from './LandingHeader';
import LandingHero from './LandingHero';
import LandingFeatures from './LandingFeatures';
import LandingCalculator from './LandingCalculator';
import LandingPricing from './LandingPricing';
import LandingTestimonials from './LandingTestimonials';
import LandingFAQ from './LandingFAQ';
import LandingFooter from './LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCalculator />
        <LandingPricing />
        <LandingTestimonials />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
