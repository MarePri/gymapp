import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  color?: 'cyan' | 'pink' | 'green' | 'amber' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap = {
  cyan: 'bg-neon-cyan neon-glow',
  pink: 'bg-neon-pink neon-glow-pink',
  green: 'bg-neon-green neon-glow-green',
  amber: 'bg-neon-amber',
  purple: 'bg-neon-purple',
};

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({ value, max, label, showValue, color = 'cyan', size = 'md', className = '' }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-gray-400 font-mono">{label}</span>}
          {showValue && <span className="text-xs text-gray-500 font-mono">{value}/{max}</span>}
        </div>
      )}
      <div className={`w-full bg-cyber-700/50 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`${sizeMap[size]} rounded-full ${colorMap[color]}`}
        />
      </div>
    </div>
  );
}
