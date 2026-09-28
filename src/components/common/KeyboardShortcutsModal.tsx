import React from 'react';
import Modal from '../ui/Modal';
import { Keyboard, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  category: string;
  items: { keys: string[]; description: string }[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcutGroups: ShortcutGroup[] = [
    {
      category: 'Global Navigation',
      items: [
        { keys: ['Ctrl / ⌘', 'K'], description: 'Open Command Palette & Global Search' },
        { keys: ['?'], description: 'Toggle Keyboard Shortcuts Modal' },
        { keys: ['Esc'], description: 'Close active modal or dropdown' },
      ],
    },
    {
      category: 'Quick Navigation Shortcuts',
      items: [
        { keys: ['G', 'D'], description: 'Jump to Dashboard' },
        { keys: ['G', 'T'], description: 'Jump to Transactions' },
        { keys: ['G', 'B'], description: 'Jump to Budgets' },
        { keys: ['G', 'G'], description: 'Jump to Goals' },
        { keys: ['G', 'A'], description: 'Jump to Analytics' },
        { keys: ['G', 'S'], description: 'Jump to Settings' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { keys: ['N'], description: 'Quick Add New Transaction' },
      ],
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts Cheat Sheet"
      maxWidth="md"
    >
      <div className="space-y-6 py-2">
        {shortcutGroups.map((group) => (
          <div key={group.category} className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
              {group.category}
            </h4>
            <div className="space-y-2">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <span className="text-slate-300 font-medium">{item.description}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-slate-200 shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> FinTrack Power User Mode
          </span>
          <span className="text-[11px] text-slate-500">Press ? anytime to open</span>
        </div>
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsModal;
