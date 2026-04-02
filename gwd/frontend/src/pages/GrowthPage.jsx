import { useEffect, useState } from 'react';
import { logsAPI } from '../services/api';
import TopBar from '../components/TopBar';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-3 text-xs font-mono">
      <p className="text-[#FF5C1A] mb-2 font-bold">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="mb-0.5">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function GrowthPage({ goal }) {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState(30);
  const [allLogs, setAllLogs] = useState([]);

  useEffect(() => {
    logsAPI.getGrowthStats(range, goal?._id)
      .then(res => setStats(res.data))
      .catch(() => {});
    // Also fetch all logs for export
    const end = format(new Date(), 'yyyy-MM-dd');
    const start = new Date(); start.setDate(start.getDate() - range);
    logsAPI.getRange(format(start, 'yyyy-MM-dd'), end, goal?._id)
      .then(res => setAllLogs(res.data))
      .catch(() => {});
  }, [range, goal]);

  const chartData = stats?.chartData || [];

  // Weekly averages for bar chart
  const weeklyData = chartData.reduce((acc, d, i) => {
    const wk = Math.floor(i / 7);
    if (!acc[wk]) acc[wk] = { week: `Wk ${wk + 1}`, total: 0, count: 0 };
    acc[wk].total += d.completion;
    acc[wk].count++;
    return acc;
  }, []).map(w => ({ ...w, avg: Math.round(w.total / w.count) }));

  // Radar data by day of week
  const dayAvgs = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, di) => {
    const dayLogs = chartData.filter((_, i) => {
      const d = new Date(chartData[i]?.date);
      return d.getDay() === (di + 1) % 7;
    });
    return {
      day,
      avg: dayLogs.length ? Math.round(dayLogs.reduce((s, l) => s + l.completion, 0) / dayLogs.length) : 0,
      fullMark: 100
    };
  });

  const exportExcel = () => {
    const data = allLogs.map(l => ({
      Date: l.date,
      'Completion %': l.completionPercent,
      'Points Earned': l.totalPoints,
      'Max Points': l.maxPoints,
      Mood: l.mood ? ['😩', '😕', '😐', '😊', '🤩'][l.mood - 1] : '',
      'Journal': l.journal || '',
      'Completed Tasks': l.entries?.filter(e => e.completed).map(e => e.routineName).join(', ') || '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GWD Progress');
    // Style header row
    ws['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 14 }, { wch: 12 }, { wch: 8 }, { wch: 40 }, { wch: 50 }];
    XLSX.writeFile(wb, `GWD_Progress_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar title="Growth Graph" subtitle="Track your transformation journey" />

      <div className="p-6 max-w-6xl space-y-6">

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {[7, 14, 30, 60, 90].map(d => (
              <button key={d}
                onClick={() => setRange(d)}
                className={`px-4 py-2 rounded-xl text-sm font-mono transition-all ${
                  range === d ? 'bg-[#FF5C1A] text-black font-bold' : 'btn-ghost'
                }`}>
                {d}d
              </button>
            ))}
          </div>
          <button onClick={exportExcel}
            className="btn-primary flex items-center gap-2 text-sm">
            📊 Export to Excel
          </button>
        </div>

        {/* KPI Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Days Logged', val: stats.totalDays, icon: '📅', color: '#3B82F6' },
              { label: 'Avg Score', val: `${stats.avgCompletion}%`, icon: '⚡', color: '#FFB300' },
              { label: 'Perfect Days', val: stats.perfectDays, icon: '🏆', color: '#22c55e' },
              { label: 'Streak', val: `${stats.currentStreak}d`, icon: '🔥', color: '#FF5C1A' },
            ].map(({ label, val, icon, color }) => (
              <div key={label} className="card p-4 text-center hover:neon-border transition-all">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-display text-3xl" style={{ color }}>{val}</div>
                <div className="text-xs text-[#666] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Main Area Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-5">Daily Completion Rate</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5C1A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF5C1A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB300" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FFB300" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                <XAxis dataKey="date" stroke="#333"
                  tick={{ fill: '#555', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={d => format(new Date(d), 'MMM d')} />
                <YAxis stroke="#333" tick={{ fill: '#555', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#888', fontSize: 12 }} />
                <Area type="monotone" dataKey="completion" name="Completion %"
                  stroke="#FF5C1A" strokeWidth={2} fill="url(#compGrad)" dot={{ fill: '#FF5C1A', r: 3 }} />
                <Area type="monotone" dataKey="mood" name="Mood (×20)"
                  stroke="#FFB300" strokeWidth={1.5} fill="url(#moodGrad)"
                  dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-[#555]">
              <div className="text-5xl mb-4">📈</div>
              <p>No data yet. Start logging daily to see your growth!</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Bars */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-5">Weekly Average</h3>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                  <XAxis dataKey="week" stroke="#333" tick={{ fill: '#555', fontSize: 11 }} />
                  <YAxis stroke="#333" tick={{ fill: '#555', fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" name="Avg %" fill="url(#barGrad)" radius={[6, 6, 0, 0]}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFB300" />
                        <stop offset="100%" stopColor="#FF5C1A" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#555] text-sm">Log 7+ days to see weekly trends</div>
            )}
          </div>

          {/* Radar */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-5">Day-of-Week Patterns</h3>
            {dayAvgs.some(d => d.avg > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={dayAvgs}>
                  <PolarGrid stroke="#1A1A1A" />
                  <PolarAngleAxis dataKey="day" tick={{ fill: '#666', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#333', fontSize: 8 }} />
                  <Radar name="Avg %" dataKey="avg" stroke="#FF5C1A" fill="#FF5C1A" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#555] text-sm">Need more data to show patterns</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
