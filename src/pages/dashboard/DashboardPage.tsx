import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart, Plus, TrendingUp, Calendar } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="Financial Overview"
        subtitle={`Welcome back, ${user?.first_name || user?.username || 'User'}. Here is your financial summary.`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
              This Month
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Transaction
            </Button>
          </div>
        }
      />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Balance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-outfit mt-2">$24,850.00</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs last month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Monthly Income</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-outfit mt-2">$8,450.00</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+5.2% target met</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Monthly Expense</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-outfit mt-2">$3,120.50</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>68% of budget limit</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Savings Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-outfit mt-2">63.1%</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <Badge variant="success" size="sm">Optimal</Badge>
          </div>
        </Card>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table Placeholder */}
        <Card className="lg:col-span-2" title="Recent Transactions" subtitle="Your latest financial entries">
          <div className="space-y-3">
            {[
              { title: 'Tech Corp Salary', type: 'INCOME', amount: '+$5,200.00', category: 'Salary', date: 'Today, 2:30 PM' },
              { title: 'Whole Foods Market', type: 'EXPENSE', amount: '-$142.80', category: 'Groceries', date: 'Yesterday' },
              { title: 'Cloud Infrastructure Subscription', type: 'EXPENSE', amount: '-$49.00', category: 'Software', date: 'Sep 08, 2026' },
              { title: 'Freelance Design Contract', type: 'INCOME', amount: '+$1,250.00', category: 'Side Hustle', date: 'Sep 06, 2026' },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{tx.title}</p>
                    <p className="text-[11px] text-slate-400">{tx.category} &bull; {tx.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Goal & Budget Widget Placeholder */}
        <div className="space-y-6">
          <Card title="Budget Health" subtitle="Current month utilization">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Housing & Rent</span>
                  <span className="text-slate-400">$1,500 / $1,500</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Food & Dining</span>
                  <span className="text-slate-400">$450 / $600</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-teal-400 w-[75%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Entertainment</span>
                  <span className="text-slate-400">$210 / $200</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 w-full" />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Goal Progress" subtitle="Emergency Fund Goal">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Target: $10,000.00</p>
                <p className="text-lg font-bold text-slate-100">$7,500.00 (75%)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
