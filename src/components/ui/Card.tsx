import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ children, className = '', glow, onClick, hover, padding = 'md' }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={`
        rounded-2xl bg-card-bg border border-white/5
        ${glow ? 'neon-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
