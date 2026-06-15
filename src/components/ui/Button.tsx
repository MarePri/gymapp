import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: 'bg-neon-cyan text-cyber-900 font-semibold hover:bg-cyan-300 neon-glow',
  secondary: 'glass border border-cyber-500 hover:border-neon-cyan/50 text-gray-200',
  ghost: 'text-gray-400 hover:text-white hover:bg-cyber-700/50',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', fullWidth, icon }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.button>
  );
}
