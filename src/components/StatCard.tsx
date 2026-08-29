import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'indigo' | 'amber' | 'slate' | 'emerald';
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  onClick,
  isActive = false,
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'amber':
        return {
          iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
          border: isActive ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200/80 dark:border-slate-800',
          hover: 'hover:border-amber-400/60',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          border: isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80 dark:border-slate-800',
          hover: 'hover:border-emerald-400/60',
        };
      case 'slate':
        return {
          iconBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
          border: isActive ? 'border-slate-500 ring-2 ring-slate-500/20' : 'border-slate-200/80 dark:border-slate-800',
          hover: 'hover:border-slate-400/60',
        };
      default:
        return {
          iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
          border: isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80 dark:border-slate-800',
          hover: 'hover:border-indigo-400/60',
        };
    }
  };

  const styles = getColorStyles();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border ${styles.border} ${styles.hover} shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 w-full cursor-pointer`}
    >
      <div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {value}
        </div>
      </div>
      <div className={`p-3 rounded-xl ${styles.iconBg} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
    </button>
  );
};
