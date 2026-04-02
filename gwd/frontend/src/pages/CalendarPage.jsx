import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subMonths, addMonths, startOfWeek, endOfWeek } from 'date-fns';
import { logsAPI } from '../services/api';
import TopBar from '../components/TopBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getColor = (pct) => {
  if (pct === undefined || pct === null) return null;
  if (pct >= 100) return '#22c55e';
  if (pct >= 80) return '#FFB300';
  if (pct >= 50) return '#FF5C1A';
  if (pct > 0) return '#7C3AED';
  return '#1A1A1A';
};

export default function CalendarPage({ goal }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [logs, setLogs] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const start = format(startOfMonth(viewDate), 'yyyy-MM-dd');
    const end = format(endOfMonth(viewDate), 'yyyy-MM-dd');
    logsAPI.getRange(start, end, goal?._id)
      .then(res => {
        const map = {};
        res.data.forEach(l => { map[l.date] = l; });
        setLogs(map);
      })
      .catch(() => {});
  }, [viewDate, goal]);

  const monthStart = startOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedLog = selected ? logs[selected] : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar title="Calendar" subtitle="Your grind history at a glance" />
      <div className="p-6 max-w-3xl space-y-6">

        {/* Month Nav */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setViewDate(subMonths(viewDate, 1))}
              className="btn-ghost p-2"><ChevronLeft size={18} /></button>
            <h2 className="font-display text-2xl text-white tracking-wider">
              {format(viewDate, 'MMMM yyyy').toUpperCase()}
            </h2>
            <button onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="btn-ghost p-2"><ChevronRight size={18} /></button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="text-center text-[10px] font-mono text-[#555] py-1 tracking-wider">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const log = logs[key];
              const pct = log?.completionPercent;
              const inMonth = isSameMonth(day, viewDate);
              const today = isToday(day);
              const color = inMonth && pct !== undefined ? getColor(pct) : null;
              const isSelected = selected === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelected(isSelected ? null : key)}
                  className={`relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-150 group cal-cell
                    ${!inMonth ? 'opacity-20' : ''}
                    ${today ? 'ring-1 ring-[#FF5C1A]' : ''}
                    ${isSelected ? 'ring-2 ring-[#FFB300]' : ''}
                    ${inMonth ? 'hover:scale-110' : ''}
                  `}
                  style={{ background: color || '#0F0F0F', border: `1px solid ${color ? color + '40' : '#1A1A1A'}` }}
                >
                  <span className={`text-xs font-mono ${today ? 'text-[#FF5C1A] font-bold' : inMonth ? 'text-[#888]' : 'text-[#333]'}`}>
                    {format(day, 'd')}
                  </span>
                  {inMonth && pct !== undefined && pct >= 100 && (
                    <span className="text-[8px]">🔥</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 justify-end">
            {[['100%', '#22c55e'], ['80%+', '#FFB300'], ['50%+', '#FF5C1A'], ['<50%', '#7C3AED'], ['None', '#1A1A1A']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                <span className="text-[10px] text-[#555] font-mono">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Detail */}
        {selected && (
          <div className="card p-5" style={{ animation: 'slideUp 0.3s ease forwards' }}>
            <h3 className="font-semibold text-white mb-1">
              {format(new Date(selected), 'EEEE, dd MMMM yyyy')}
            </h3>
            {selectedLog ? (
              <>
                <div className="flex gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-display text-3xl" style={{ color: getColor(selectedLog.completionPercent) }}>
                      {selectedLog.completionPercent}%
                    </div>
                    <div className="text-xs text-[#555]">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-3xl text-[#FF5C1A]">{selectedLog.totalPoints}</div>
                    <div className="text-xs text-[#555]">Points</div>
                  </div>
                  {selectedLog.mood && (
                    <div className="text-center">
                      <div className="text-3xl">
                        {['😩', '😕', '😐', '😊', '🤩'][selectedLog.mood - 1]}
                      </div>
                      <div className="text-xs text-[#555]">Mood</div>
                    </div>
                  )}
                </div>
                {selectedLog.entries?.length > 0 && (
                  <div className="space-y-1.5">
                    {selectedLog.entries.map((e, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${e.completed ? 'bg-green-500/8 text-green-400' : 'bg-[#111] text-[#555]'}`}>
                        <span>{e.completed ? '✅' : '⬜'}</span>
                        <span className="flex-1 truncate">{e.routineName}</span>
                        <span className="font-mono text-xs">+{e.pointsEarned}pts</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedLog.journal && (
                  <div className="mt-3 p-3 bg-[#111] rounded-xl">
                    <p className="text-xs text-[#888] italic">"{selectedLog.journal}"</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[#555] text-sm">No data logged for this day.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
