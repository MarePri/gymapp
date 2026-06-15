import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cyber-900 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
