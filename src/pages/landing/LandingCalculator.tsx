import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, Percent, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingCalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState<number>(5000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(500);
  const [years, setYears] = useState<number>(10);
  const [annualRate, setAnnualRate] = useState<number>(7);

  const calculation = useMemo(() => {
    const months = years * 12;
    const monthlyRate = annualRate / 100 / 12;

    let totalSaved = initialAmount + monthlyDeposit * months;
    let balance = initialAmount;

    for (let i = 0; i < months; i++) {
      balance = (balance + monthlyDeposit) * (1 + monthlyRate);
    }

    const totalInterest = Math.max(0, balance - totalSaved);

    return {
      futureValue: Math.round(balance),
      totalContributions: Math.round(totalSaved),
      totalInterest: Math.round(totalInterest),
    };
  }, [initialAmount, monthlyDeposit, years, annualRate]);

  return (
    <section id="calculator" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Growth Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            See How Fast Your <span className="gradient-text">Savings Can Multiply</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Use our interactive compound wealth calculator to project your financial future with consistent budgeting.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Initial Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Initial Savings
                  </span>
                  <span className="text-white font-bold font-heading text-base">${initialAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Monthly Deposit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-teal-400" /> Monthly Contribution
                  </span>
                  <span className="text-white font-bold font-heading text-base">${monthlyDeposit.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>

              {/* Time Horizon */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Time Horizon
                  </span>
                  <span className="text-white font-bold font-heading text-base">{years} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Annual Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-amber-400" /> Estimated Annual Return
                  </span>
                  <span className="text-white font-bold font-heading text-base">{annualRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="0.5"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* Output Display Right Column */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Projected Wealth
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-2">
                  ${calculation.futureValue.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Estimated balance after {years} years</p>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="text-emerald-400">Contributions (${calculation.totalContributions.toLocaleString()})</span>
                  <span className="text-cyan-400">Interest (${calculation.totalInterest.toLocaleString()})</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(calculation.totalContributions / calculation.futureValue) * 100}%`,
                    }}
                    className="bg-emerald-400 h-full transition-all duration-300"
                  />
                  <div
                    style={{
                      width: `${(calculation.totalInterest / calculation.futureValue) * 100}%`,
                    }}
                    className="bg-cyan-400 h-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Start Saving Button */}
              <Link
                to="/register"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Automate This Goal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCalculator;
