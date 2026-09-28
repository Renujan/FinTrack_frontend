export interface CategoryStyle {
  bg: string;
  text: string;
  border: string;
  iconName: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  housing: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', iconName: 'Home' },
  rent: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', iconName: 'Home' },
  food: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', iconName: 'Utensils' },
  groceries: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', iconName: 'ShoppingCart' },
  dining: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', iconName: 'Utensils' },
  transport: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', iconName: 'Car' },
  travel: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', iconName: 'Plane' },
  utilities: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', iconName: 'Zap' },
  salary: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', iconName: 'Briefcase' },
  income: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', iconName: 'TrendingUp' },
  investment: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', iconName: 'LineChart' },
  tech: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', iconName: 'Laptop' },
  entertainment: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', iconName: 'Film' },
  shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', iconName: 'ShoppingBag' },
  health: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', iconName: 'HeartPulse' },
  subscriptions: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', iconName: 'Repeat' },
};

const DEFAULT_STYLE: CategoryStyle = {
  bg: 'bg-slate-800/60',
  text: 'text-slate-300',
  border: 'border-slate-700/60',
  iconName: 'Tag',
};

export function getCategoryStyle(categoryName?: string): CategoryStyle {
  if (!categoryName) return DEFAULT_STYLE;
  const key = categoryName.toLowerCase().trim();
  for (const [pattern, style] of Object.entries(CATEGORY_STYLES)) {
    if (key.includes(pattern)) return style;
  }
  return DEFAULT_STYLE;
}
