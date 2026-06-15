import { motion } from 'framer-motion';

interface StatDisplayProps {
  label: string;
  value: number | string;
  icon?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
}

export function StatDisplay({ label, value, icon, color = 'text-neon-cyan', size = 'md', suffix, trend }: StatDisplayProps) {
  const sizeStyles = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-0.5">{label}</span>
      <div className="flex items-baseline gap-1.5">
        {icon && <span className="text-sm">{icon}</span>}
        <motion.span
          key={String(value)}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-bold ${sizeStyles} ${color}`}
        >
          {value}
        </motion.span>
        {suffix && <span className="text-xs text-gray-500 font-mono">{suffix}</span>}
        {trend === 'up' && <span className="text-xs text-neon-green">↑</span>}
        {trend === 'down' && <span className="text-xs text-neon-pink">↓</span>}
      </div>
    </div>
  );
}
