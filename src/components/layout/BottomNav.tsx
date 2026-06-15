import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Swords, Dumbbell, ChartNoAxesCombined, User } from 'lucide-react';
import type { TabId } from '../../types';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/' },
  { id: 'missions', label: 'Missions', icon: <Swords size={20} />, path: '/missions' },
  { id: 'workout', label: 'Workout', icon: <Dumbbell size={20} />, path: '/workout' },
  { id: 'strength', label: 'Strength', icon: <ChartNoAxesCombined size={20} />, path: '/strength' },
  { id: 'dashboard', label: 'Progress', icon: <Home size={20} />, path: '/dashboard' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
                isActive ? 'text-neon-cyan' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-0.5 bg-neon-cyan rounded-full neon-glow"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{item.icon}</span>
              <span className="text-[10px] font-mono font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
