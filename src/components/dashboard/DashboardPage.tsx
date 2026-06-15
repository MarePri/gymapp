import { useProgressStore } from '../../stores/progressStore';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { GlassHeader } from '../ui/GlassHeader';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export function DashboardPage() {
  const { progressHistory } = useProgressStore();

  const chartData = progressHistory.map((entry) => ({
    ...entry,
    dateLabel: new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }),
    bench1RM: entry.strengthRecords.find((r) => r.exercise === 'Bench Press')?.estimated1RM ?? 0,
    squat1RM: entry.strengthRecords.find((r) => r.exercise === 'Squat')?.estimated1RM ?? 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-6"
    >
      <GlassHeader
        title="Progress Dashboard"
        action={<BarChart3 className="w-5 h-5 text-neon-cyan" />}
      />

      {/* Body Weight Chart */}
      <Card glow padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-neon-cyan" />
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Body Weight
          </h2>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line
                type="monotone"
                dataKey="bodyWeight"
                stroke="#00f0ff"
                strokeWidth={2}
                dot={{ fill: '#00f0ff', r: 3 }}
                activeDot={{ r: 5, fill: '#00f0ff' }}
                filter="url(#cyanGlow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Weekly Volume Chart */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-neon-purple" />
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Weekly Volume
          </h2>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar dataKey="weeklyVolume" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recovery Chart */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-neon-green" />
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Recovery
          </h2>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22ff88" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22ff88" stopOpacity={0} />
                </linearGradient>
                <filter id="cyanGlow">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00f0ff" floodOpacity="0.4" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area
                type="monotone"
                dataKey="recovery"
                stroke="#22ff88"
                strokeWidth={2}
                fill="url(#recoveryGradient)"
                dot={{ fill: '#22ff88', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Strength Growth Chart */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-neon-cyan" />
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Strength Growth
          </h2>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line
                type="monotone"
                dataKey="bench1RM"
                stroke="#00f0ff"
                strokeWidth={2}
                name="Bench Press"
                dot={{ r: 3, fill: '#00f0ff' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="squat1RM"
                stroke="#22ff88"
                strokeWidth={2}
                name="Squat"
                dot={{ r: 3, fill: '#22ff88' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
