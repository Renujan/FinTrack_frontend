import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { UserPreference } from '../../types/settings';
import { DollarSign, Globe, Calendar, Layers } from 'lucide-react';

interface FinancialPreferencesFormProps {
  preferences: UserPreference | null;
  onSave: (data: Partial<UserPreference>) => Promise<void>;
}

export const FinancialPreferencesForm: React.FC<FinancialPreferencesFormProps> = ({
  preferences,
  onSave,
}) => {
  const [currency, setCurrency] = useState(preferences?.currency || 'USD');
  const [dateFormat, setDateFormat] = useState(preferences?.date_format || 'YYYY-MM-DD');
  const [timezone, setTimezone] = useState(preferences?.timezone || 'UTC');
  const [defaultTxType, setDefaultTxType] = useState<'EXPENSE' | 'INCOME'>(
    preferences?.default_transaction_type || 'EXPENSE'
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await onSave({
        currency,
        date_format: dateFormat,
        timezone,
        default_transaction_type: defaultTxType,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Regional & Financial Defaults" subtitle="Customize default currency, date formatting, and transaction behavior">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl">
            Financial preferences updated successfully!
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Primary Base Currency</span>
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="USD">USD — United States Dollar ($)</option>
            <option value="EUR">EUR — Euro (€)</option>
            <option value="GBP">GBP — British Pound (£)</option>
            <option value="INR">INR — Indian Rupee (₹)</option>
            <option value="LKR">LKR — Sri Lankan Rupee (Rs)</option>
            <option value="AUD">AUD — Australian Dollar ($)</option>
            <option value="CAD">CAD — Canadian Dollar ($)</option>
            <option value="JPY">JPY — Japanese Yen (¥)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Date Display Format</span>
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Timezone</span>
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="Asia/Colombo">Asia/Colombo (IST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Default New Transaction Type</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDefaultTxType('EXPENSE')}
              className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                defaultTxType === 'EXPENSE'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Expense Default
            </button>
            <button
              type="button"
              onClick={() => setDefaultTxType('INCOME')}
              className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                defaultTxType === 'INCOME'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Income Default
            </button>
          </div>
        </div>

        <Button variant="primary" size="sm" type="submit" isLoading={loading}>
          Save Financial Preferences
        </Button>
      </form>
    </Card>
  );
};

export default FinancialPreferencesForm;
