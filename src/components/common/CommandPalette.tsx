import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PieChart,
  Repeat,
  Target,
  BarChart3,
  FileText,
  Bell,
  Settings,
  PlusCircle,
  X,
  Sparkles
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Settings';
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenQuickAdd
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'dash',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => { navigate('/dashboard'); onClose(); }
    },
    {
      id: 'tx',
      title: 'Go to Transactions',
      category: 'Navigation',
      icon: ArrowLeftRight,
      shortcut: 'G T',
      action: () => { navigate('/transactions'); onClose(); }
    },
    {
      id: 'new-tx',
      title: 'Quick Add New Transaction',
      category: 'Actions',
      icon: PlusCircle,
      shortcut: 'N',
      action: () => {
        onClose();
        if (onOpenQuickAdd) onOpenQuickAdd();
        else navigate('/transactions?action=new');
      }
    },
    {
      id: 'budgets',
      title: 'Go to Budgets & Spending Limits',
      category: 'Navigation',
      icon: PieChart,
      shortcut: 'G B',
      action: () => { navigate('/budgets'); onClose(); }
    },
    {
      id: 'goals',
      title: 'Go to Financial Goals',
      category: 'Navigation',
      icon: Target,
      shortcut: 'G G',
      action: () => { navigate('/goals'); onClose(); }
    },
    {
      id: 'recurring',
      title: 'Go to Recurring Subscriptions',
      category: 'Navigation',
      icon: Repeat,
      shortcut: 'G R',
      action: () => { navigate('/recurring'); onClose(); }
    },
    {
      id: 'categories',
      title: 'Manage Categories',
      category: 'Navigation',
      icon: Tags,
      action: () => { navigate('/categories'); onClose(); }
    },
    {
      id: 'analytics',
      title: 'View Analytics & Breakdown',
      category: 'Navigation',
      icon: BarChart3,
      shortcut: 'G A',
      action: () => { navigate('/analytics'); onClose(); }
    },
    {
      id: 'reports',
      title: 'Generate Reports & Statement Export',
      category: 'Navigation',
      icon: FileText,
      action: () => { navigate('/reports'); onClose(); }
    },
    {
      id: 'notifications',
      title: 'View Alerts & Notifications',
      category: 'Navigation',
      icon: Bell,
      action: () => { navigate('/notifications'); onClose(); }
    },
    {
      id: 'settings',
      title: 'Account & Security Settings',
      category: 'Settings',
      icon: Settings,
      shortcut: 'G S',
      action: () => { navigate('/settings'); onClose(); }
    }
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search page (e.g. Transactions, Budgets)..."
            className="w-full py-4 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between text-sm transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </div>
                  </div>

                  {item.shortcut && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">ESC</kbd> close
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400/90 font-medium">
            <Sparkles className="w-3 h-3 text-amber-400" /> FinTrack Quick Search
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
