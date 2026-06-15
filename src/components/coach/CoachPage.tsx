import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { GlassHeader } from '../ui/GlassHeader';
import { Brain, AlertTriangle, Target, Dumbbell } from 'lucide-react';
import { MOCK_AI_ADVICE } from '../../data/mockData';

function probabilityColor(pct: number): 'green' | 'amber' | 'pink' {
  if (pct >= 80) return 'green';
  if (pct >= 70) return 'amber';
  return 'pink';
}

export function CoachPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-6 relative"
    >
      {/* Scan-line overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 opacity-[0.04]">
        <div className="w-full h-px bg-white animate-[scan-line_4s_linear_infinite]" />
      </div>

      <GlassHeader
        title="AI Coach"
        action={<Brain className="w-5 h-5 text-neon-purple" />}
      />

      {/* Welcome card */}
      <Card glow padding="lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-neon-purple" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Welcome back, Prixi</h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              I&apos;ve analyzed your recent training data. You&apos;re making solid progress
              on your upper body lifts. Let&apos;s focus on bringing up your squat and
              addressing some form concerns on deadlifts.
            </p>
          </div>
        </div>
      </Card>

      {/* AI Advice cards */}
      {MOCK_AI_ADVICE.map((advice, index) => (
        <motion.div
          key={advice.exercise}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card padding="lg" className="relative overflow-hidden">
            {/* Plateau detection badge */}
            {advice.plateauDetected && (
              <div className="absolute top-0 right-0">
                <div className="bg-neon-amber/10 text-neon-amber text-[10px] font-mono px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Plateau Detected
                </div>
              </div>
            )}

            {/* Exercise header */}
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-4 h-4 text-neon-cyan" />
              <h3 className="text-white font-bold text-sm">{advice.exercise}</h3>
            </div>

            {/* Suggested weight & reps */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="glass rounded-xl p-3 text-center">
                <span className="text-xs text-gray-500 font-mono uppercase block mb-1">
                  Weight
                </span>
                <span className="text-2xl font-bold text-neon-cyan">
                  {advice.suggestedWeight}kg
                </span>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <span className="text-xs text-gray-500 font-mono uppercase block mb-1">
                  Reps
                </span>
                <span className="text-2xl font-bold text-neon-purple">
                  x{advice.suggestedReps}
                </span>
              </div>
            </div>

            {/* Success probability */}
            <div className="mb-3">
              <ProgressBar
                value={advice.successProbability}
                max={100}
                label="Success Probability"
                showValue
                color={probabilityColor(advice.successProbability)}
                size="md"
              />
            </div>

            {/* Reasoning */}
            <p className="text-gray-500 text-xs italic leading-relaxed mb-3">
              &ldquo;{advice.reasoning}&rdquo;
            </p>

            {/* Next milestone */}
            <div className="flex items-center gap-2 text-neon-green/80 text-xs font-mono">
              <Target className="w-3.5 h-3.5" />
              <span>{advice.nextMilestone}</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
