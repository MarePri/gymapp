import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { StatDisplay } from '../ui/StatDisplay';
import { GlassHeader } from '../ui/GlassHeader';
import { ChevronDown, ChevronUp, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { MOCK_WEEKLY_REPORTS } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

const muscleColors: Record<string, string> = {
  Chest: 'bg-neon-cyan',
  Back: 'bg-neon-purple',
  Legs: 'bg-neon-green',
  Shoulders: 'bg-neon-amber',
  Arms: 'bg-neon-pink',
};

export function AnalyticsPage() {
  const [expandedReport, setExpandedReport] = useState<string | null>(
    MOCK_WEEKLY_REPORTS.length > 0 ? MOCK_WEEKLY_REPORTS[0].weekOf : null
  );

  if (MOCK_WEEKLY_REPORTS.length === 0) {
    return (
      <div className="space-y-4">
        <GlassHeader title="Analytics" subtitle="Weekly training reports" />
        <Card padding="lg" className="text-center">
          <p className="text-sm text-gray-500 font-mono">No reports available yet.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GlassHeader title="Analytics" subtitle="Weekly training reports" />

      <div className="space-y-3">
        {MOCK_WEEKLY_REPORTS.map((report, index) => {
          const isExpanded = expandedReport === report.weekOf;

          return (
            <motion.div
              key={report.weekOf}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Card padding="none" className="overflow-hidden">
                <button
                  onClick={() => setExpandedReport(isExpanded ? null : report.weekOf)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-neon-cyan shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Week of {formatDate(report.weekOf)}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        {report.totalWorkouts} workouts &middot;{' '}
                        {report.totalVolume.toLocaleString()} kg volume
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <StatDisplay
                            label="Workouts"
                            value={report.totalWorkouts}
                            color="text-neon-cyan"
                            size="sm"
                          />
                          <StatDisplay
                            label="Volume"
                            value={`${(report.totalVolume / 1000).toFixed(1)}k`}
                            color="text-neon-purple"
                            size="sm"
                            suffix="kg"
                          />
                          <StatDisplay
                            label="XP Gained"
                            value={report.xpGained}
                            color="text-neon-amber"
                            size="sm"
                          />
                          <StatDisplay
                            label="PRs Set"
                            value={report.prsSet}
                            color="text-gold"
                            size="sm"
                          />
                        </div>

                        {/* Muscle Balance */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-300 mb-2.5 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-neon-cyan" />
                            Muscle Balance
                          </h4>
                          <div className="space-y-1.5">
                            {report.muscleBalance.map((mb) => (
                              <div key={mb.group} className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 w-14 font-mono shrink-0">
                                  {mb.group}
                                </span>
                                <div className="flex-1 h-2 bg-cyber-700/50 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mb.percentage}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${
                                      muscleColors[mb.group] || 'bg-gray-500'
                                    }`}
                                  />
                                </div>
                                <span className="text-[10px] text-gray-500 w-8 text-right font-mono shrink-0">
                                  {mb.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strength Growth */}
                        {report.strengthGrowth.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-300 mb-2.5 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-neon-green" />
                              Strength Growth
                            </h4>
                            <div className="space-y-1.5">
                              {report.strengthGrowth.map((sg) => {
                                const diff = sg.end - sg.start;
                                const pctChange =
                                  sg.start > 0
                                    ? ((diff / sg.start) * 100).toFixed(1)
                                    : '+0';
                                return (
                                  <div
                                    key={sg.exercise}
                                    className="flex items-center justify-between glass rounded-xl px-3 py-2"
                                  >
                                    <span className="text-xs text-gray-300 font-mono">
                                      {sg.exercise}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs font-mono">
                                      <span className="text-gray-500">{sg.start}kg</span>
                                      <span className="text-neon-cyan">&rarr;</span>
                                      <span className="text-neon-green font-semibold">
                                        {sg.end}kg
                                      </span>
                                      <span className="text-[10px] text-neon-cyan">
                                        +{pctChange}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Coach Notes */}
                        {report.notes && (
                          <div className="glass rounded-xl p-3">
                            <p className="text-xs text-gray-400 italic leading-relaxed">
                              &ldquo;{report.notes}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
