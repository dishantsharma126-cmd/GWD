import { useEffect, useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { logsAPI, routinesAPI } from '../services/api';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import CircularProgress from '../components/CircularProgress';
import { Flame, Trophy, Zap, Target, TrendingUp, Calendar } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-3 text-xs font-mono">
        <p className="text-[#FF5C1A] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ goal }) {
  const [stats, setStats] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [routines, setRoutines] = useState([]);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, todayRes, routinesRes] = await Promise.all([
          logsAPI.getGrowthStats(goal?.durationDays || 90, goal?._id),
          logsAPI.getByDate(today),
          routinesAPI.getAll(goal?._id),
        ]);
        setStats(statsRes.data);
        setTodayLog(todayRes.data);
        setRoutines(routinesRes.data);
      } catch (e) {
        // Use mock data if backend not connected
        setStats({
          totalDays: 0, avgCompletion: 0,
          perfectDays: 0, currentStreak: 0, chartData: []
        });
      }
    };
    load();
  }, [goal]);

  const completedToday = todayLog?.completionPercent || 0;
  const goalProgress = goal
    ? Math.round((differenceInDays(new Date(), new Date(goal.startDate)) / goal.durationDays) * 100)
    : 0;

  const chartData = stats?.chartData?.slice(-14) || [];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar subtitle={`${format(new Date(), 'EEEE, dd MMMM yyyy')} • Keep grinding!`} />

      <div className="p-6 space-y-6 max-w-7xl">

        {/* Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Big progress ring */}
          <div className="card p-6 flex flex-col items-center justify-center col-span-1 neon-border">
            <div className="text-xs font-mono text-[#FF5C1A] tracking-widest mb-4 uppercase">Today's Completion</div>
            <CircularProgress value={completedToday} size={140} stroke={10} />
            <p className="text-xs text-[#555] mt-4 font-mono">
              {todayLog?.totalPoints || 0} / {todayLog?.maxPoints || routines.reduce((s, r) => s + r.points, 0)} pts
            </p>
          </div>

          {/* Stats grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard icon="🔥" label="Day Streak" value={`${stats?.currentStreak || 0}d`} color="#FF5C1A" />
            <StatCard icon="🏆" label="Perfect Days" value={stats?.perfectDays || 0} color="#FFB300" />
            <StatCard icon="⚡" label="Avg Score" value={`${stats?.avgCompletion || 0}%`} color="#3B82F6" />
            <StatCard icon="📅" label="Days Logged" value={stats?.totalDays || 0} color="#10B981" />
            <StatCard icon="🎯" label="Goal Progress" value={`${goalProgress}%`} color="#8B5CF6" />
            <StatCard icon="💪" label="Routines" value={routines.length} color="#EC4899" />
          </div>
        </div>

        {/* Goal Progress Bar */}
        {goal && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{goal.icon || '🔥'}</span>
                <div>
                  <div className="font-semibold text-white">{goal.title}</div>
                  <div className="text-xs text-[#666] font-mono">
                    {differenceInDays(new Date(goal.endDate), new Date())} days remaining • {goal.durationDays}-day challenge
                  </div>
                </div>
              </div>
              <div className="font-display text-3xl text-[#FF5C1A]">{goalProgress}%</div>
            </div>
            <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                style={{
                  width: `${goalProgress}%`,
                  background: 'linear-gradient(90deg, #FF5C1A, #FFB300)'
                }}
              >
                <div className="absolute inset-0 bg-shimmer opacity-30" />
              </div>
            </div>
          </div>
        )}

        {/* Area Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">14-Day Performance</h3>
            <span className="text-xs font-mono text-[#555]">Completion %</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5C1A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF5C1A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                <XAxis dataKey="date" stroke="#333" tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={d => format(new Date(d), 'MMM dd')} />
                <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completion" name="completion"
                  stroke="#FF5C1A" strokeWidth={2} fill="url(#grad1)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-[#555] text-sm">Start logging daily to see your growth graph</p>
              </div>
            </div>
          )}
        </div>

        {/* Today's Routines Preview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Today's Schedule</h3>
            <a href="/today" className="text-xs text-[#FF5C1A] font-mono hover:underline">View All →</a>
          </div>
          {routines.length > 0 ? (
            <div className="space-y-2">
              {routines.slice(0, 5).map((r) => {
                const entry = todayLog?.entries?.find(e => e.routine?.toString() === r._id);
                return (
                  <div key={r._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      entry?.completed
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-[#111] border-[#1E1E1E]'
                    }`}>
                    <span>{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.name}</div>
                      <div className="text-xs text-[#666] font-mono">{r.startTime} – {r.endTime}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#FF5C1A]">+{r.points}pts</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        entry?.completed ? 'bg-green-500 border-green-500' : 'border-[#333]'
                      }`}>
                        {entry?.completed && <span className="text-[10px] text-white">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {routines.length > 5 && (
                <p className="text-xs text-[#555] text-center pt-1">+{routines.length - 5} more routines</p>
              )}
            </div>
          ) : (
            <p className="text-[#555] text-sm text-center py-6">No routines yet. <a href="/routines" className="text-[#FF5C1A] hover:underline">Add your first routine →</a></p>
          )}
        </div>
      </div>
    </div>
  );
}
