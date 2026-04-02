import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { logsAPI, routinesAPI } from '../services/api';
import TopBar from '../components/TopBar';
import CircularProgress from '../components/CircularProgress';
import { CheckCircle2, Circle, Save, Smile } from 'lucide-react';

const MOODS = ['😩', '😕', '😐', '😊', '🤩'];
const CATEGORIES = { fitness: '#FF5C1A', study: '#3B82F6', mindset: '#8B5CF6', nutrition: '#10B981', skill: '#FFB300', other: '#888' };

export default function TodayPage({ goal }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [routines, setRoutines] = useState([]);
  const [entries, setEntries] = useState({});
  const [mood, setMood] = useState(null);
  const [journal, setJournal] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, logRes] = await Promise.all([
          routinesAPI.getAll(goal?._id),
          logsAPI.getByDate(today),
        ]);
        setRoutines(rRes.data);
        if (logRes.data) {
          const map = {};
          logRes.data.entries?.forEach(e => { map[e.routine] = e; });
          setEntries(map);
          setMood(logRes.data.mood);
          setJournal(logRes.data.journal || '');
        }
      } catch (e) { console.error(e); }
    };
    load();
  }, [goal]);

  const toggleRoutine = (r) => {
    setEntries(prev => {
      const cur = prev[r._id];
      if (cur?.completed) {
        return { ...prev, [r._id]: { ...cur, completed: false, pointsEarned: 0 } };
      }
      return {
        ...prev,
        [r._id]: {
          routine: r._id,
          routineName: r.name,
          completed: true,
          pointsEarned: r.points,
          completedAt: new Date(),
        }
      };
    });
    setSaved(false);
  };

  const totalPts = routines.reduce((s, r) => s + (entries[r._id]?.completed ? r.points : 0), 0);
  const maxPts = routines.reduce((s, r) => s + r.points, 0);
  const pct = maxPts > 0 ? Math.round((totalPts / maxPts) * 100) : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const entryArr = routines.map(r => ({
        routine: r._id,
        routineName: r.name,
        completed: !!entries[r._id]?.completed,
        pointsEarned: entries[r._id]?.pointsEarned || 0,
        completedAt: entries[r._id]?.completedAt,
      }));
      await logsAPI.save(today, { entries: entryArr, mood, journal, goal: goal?._id });
      setSaved(true);
    } catch (e) { alert('Save failed. Check backend connection.'); }
    setSaving(false);
  };

  const grouped = routines.reduce((acc, r) => {
    const cat = r.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar title="Today's Grind" subtitle={format(new Date(), 'EEEE, dd MMMM yyyy')} />

      <div className="p-6 max-w-4xl space-y-6">

        {/* Progress Header */}
        <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
          <CircularProgress value={pct} size={120} stroke={10} />
          <div className="flex-1 text-center sm:text-left">
            <div className="font-display text-4xl text-white mb-1">{totalPts} <span className="text-[#555] text-2xl">/ {maxPts} pts</span></div>
            <div className="text-[#888] text-sm mb-3">
              {pct >= 100 ? '🎉 PERFECT DAY! You crushed it!' :
               pct >= 80 ? '💪 Almost there! Finish strong!' :
               pct >= 50 ? '🔥 Good progress. Keep going!' :
               pct > 0 ? '⚡ Started well. Push harder!' :
               '🎯 Start your grind for today!'}
            </div>
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #FF5C1A, #FFB300)' }}
              />
            </div>
          </div>
        </div>

        {/* Routines by category */}
        {Object.entries(grouped).map(([cat, rlist]) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: CATEGORIES[cat] }} />
              <h3 className="text-xs font-mono tracking-widest uppercase text-[#888]">{cat}</h3>
              <div className="flex-1 h-px bg-[#1A1A1A]" />
              <span className="text-xs text-[#555]">{rlist.filter(r => entries[r._id]?.completed).length}/{rlist.length}</span>
            </div>
            <div className="space-y-2">
              {rlist.map((r) => {
                const done = !!entries[r._id]?.completed;
                return (
                  <button
                    key={r._id}
                    onClick={() => toggleRoutine(r)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left group ${
                      done
                        ? 'bg-green-500/8 border-green-500/30 hover:border-green-500/50'
                        : 'bg-[#111] border-[#1E1E1E] hover:border-[#FF5C1A]/30'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${done ? 'text-green-400' : 'text-[#444] group-hover:text-[#FF5C1A]'} transition-colors`}>
                      {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </div>
                    <span className="text-xl">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${done ? 'line-through text-[#555]' : 'text-white'} truncate`}>{r.name}</div>
                      {(r.startTime || r.durationMin) && (
                        <div className="text-xs text-[#666] font-mono mt-0.5">
                          {r.startTime && r.endTime ? `${r.startTime} – ${r.endTime}` : `${r.durationMin} min`}
                        </div>
                      )}
                    </div>
                    <div className={`font-mono text-sm font-bold ${done ? 'text-green-400' : 'text-[#FF5C1A]'}`}>
                      +{r.points}pts
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {routines.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <p className="text-[#888] mb-2">No routines set up yet</p>
            <a href="/routines" className="btn-primary inline-block mt-2">Add Routines →</a>
          </div>
        )}

        {/* Mood Tracker */}
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Smile size={16} className="text-[#FFB300]" /> Today's Mood
          </h3>
          <div className="flex gap-3 justify-center">
            {MOODS.map((m, i) => (
              <button
                key={i}
                onClick={() => setMood(i + 1)}
                className={`text-3xl p-3 rounded-xl transition-all duration-200 ${
                  mood === i + 1 ? 'bg-[#FF5C1A]/20 scale-125 border border-[#FF5C1A]/40' : 'hover:scale-110 opacity-60 hover:opacity-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Journal */}
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-3">Daily Reflection</h3>
          <textarea
            className="input w-full h-28 resize-none text-sm"
            placeholder="What did you accomplish today? What can be better tomorrow? Any wins or struggles..."
            value={journal}
            onChange={e => { setJournal(e.target.value); setSaved(false); }}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn-primary w-full flex items-center justify-center gap-2 py-4 text-base ${saved ? 'opacity-70' : ''}`}
        >
          <Save size={18} />
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Today\'s Progress'}
        </button>
      </div>
    </div>
  );
}
