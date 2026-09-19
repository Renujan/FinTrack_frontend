import React, { useState } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { Calendar, Filter } from 'lucide-react';

export type PresetRange = 'THIS_MONTH' | 'LAST_MONTH' | 'LAST_3_MONTHS' | 'THIS_YEAR' | 'CUSTOM';

interface DateRangeSelectorProps {
  onRangeChange: (startDate?: string, endDate?: string, preset?: PresetRange) => void;
  initialPreset?: PresetRange;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onRangeChange,
  initialPreset = 'THIS_MONTH',
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetRange>(initialPreset);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const calculateDatesForPreset = (preset: PresetRange): { start?: string; end?: string } => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'THIS_MONTH') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: firstDay.toISOString().split('T')[0], end: todayStr };
    }

    if (preset === 'LAST_MONTH') {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        start: firstDayLastMonth.toISOString().split('T')[0],
        end: lastDayLastMonth.toISOString().split('T')[0],
      };
    }

    if (preset === 'LAST_3_MONTHS') {
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      return { start: threeMonthsAgo.toISOString().split('T')[0], end: todayStr };
    }

    if (preset === 'THIS_YEAR') {
      const janFirst = new Date(today.getFullYear(), 0, 1);
      return { start: janFirst.toISOString().split('T')[0], end: todayStr };
    }

    return {};
  };

  const handlePresetSelect = (preset: PresetRange) => {
    setSelectedPreset(preset);
    if (preset !== 'CUSTOM') {
      const dates = calculateDatesForPreset(preset);
      setStartDate(dates.start || '');
      setEndDate(dates.end || '');
      onRangeChange(dates.start, dates.end, preset);
    }
  };

  const handleCustomApply = () => {
    onRangeChange(startDate || undefined, endDate || undefined, 'CUSTOM');
  };

  return (
    <Card className="!p-4 bg-slate-900 border-slate-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Preset Radio / Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Period:
          </span>

          <button
            onClick={() => handlePresetSelect('THIS_MONTH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedPreset === 'THIS_MONTH'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            This Month
          </button>

          <button
            onClick={() => handlePresetSelect('LAST_MONTH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedPreset === 'LAST_MONTH'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Last Month
          </button>

          <button
            onClick={() => handlePresetSelect('LAST_3_MONTHS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedPreset === 'LAST_3_MONTHS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Last 3 Months
          </button>

          <button
            onClick={() => handlePresetSelect('THIS_YEAR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedPreset === 'THIS_YEAR'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            This Year
          </button>

          <button
            onClick={() => handlePresetSelect('CUSTOM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedPreset === 'CUSTOM'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Custom Start / End Inputs */}
        {selectedPreset === 'CUSTOM' && (
          <div className="flex items-center gap-2">
            <div className="w-36">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs !py-1.5"
              />
            </div>
            <span className="text-xs text-slate-500">to</span>
            <div className="w-36">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs !py-1.5"
              />
            </div>
            <button
              onClick={handleCustomApply}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DateRangeSelector;
