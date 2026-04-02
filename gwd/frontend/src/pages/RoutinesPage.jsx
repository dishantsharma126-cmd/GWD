import { useEffect, useState } from 'react';
import { routinesAPI } from '../services/api';
import TopBar from '../components/TopBar';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const CATEGORIES = ['fitness', 'study', 'mindset', 'nutrition', 'skill', 'other'];
const CAT_ICONS = { fitness: '💪', study: '📚', mindset: '🧠', nutrition: '🥗', skill: '⚡', other: '🎯' };
const CAT_COLORS = { fitness: '#FF5C1A', study: '#3B82F6', mindset: '#8B5CF6', nutrition: '#10B981', skill: '#FFB300', other: '#888' };

const defaultForm = { name: '', category: 'fitness', startTime: '06:00', endTime: '07:00', durationMin: 60, points: 10, icon: '⚡', isActive: true };

export default function RoutinesPage({ goal }) {
  const [routines, setRoutines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try {
      const res = await routinesAPI.getAll(goal?._id);
      setRoutines(res.data);
    } catch (e) {}
  };

  useEffect(() => { load(); }, [goal]);

  const openAdd = () => { setForm({ ...defaultForm, goal: goal?._id }); setEditing(null); setShowModal(true); };
  const openEdit = (r) => { setForm({ ...r }); setEditing(r._id); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editing) await routinesAPI.update(editing, form);
      else await routinesAPI.create({ ...form, goal: goal?._id });
      setShowModal(false);
      load();
    } catch (e) { alert('Error saving routine'); }
  };

  const handleDelete = async (id) => {
    try {
      await routinesAPI.delete(id);
      setDeleting(null);
      load();
    } catch (e) {}
  };

  const grouped = routines.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar title="Routines" subtitle="Build your daily system" />

      <div className="p-6 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#888] text-sm">{routines.length} routines configured</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Routine
          </button>
        </div>

        {/* Grouped routines */}
        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{CAT_ICONS[cat]}</span>
              <h3 className="font-semibold text-white capitalize">{cat}</h3>
              <span className="text-xs font-mono text-[#555] px-2 py-0.5 rounded-full bg-[#1A1A1A]">{list.length}</span>
              <div className="flex-1 h-px bg-[#1E1E1E]" />
            </div>
            <div className="grid gap-2">
              {list.map((r) => (
                <div key={r._id}
                  className="card p-4 flex items-center gap-4 hover:border-[#2A2A2A] transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${CAT_COLORS[r.category]}20`, border: `1px solid ${CAT_COLORS[r.category]}40` }}>
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{r.name}</div>
                    <div className="flex gap-3 mt-0.5">
                      {r.startTime && (
                        <span className="text-xs font-mono text-[#666]">{r.startTime} – {r.endTime}</span>
                      )}
                      {r.durationMin && (
                        <span className="text-xs font-mono text-[#555]">{r.durationMin}min</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-display text-lg text-[#FF5C1A]">{r.points}</div>
                      <div className="text-[10px] text-[#555] font-mono">pts</div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(r)}
                        className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#888] hover:text-[#FFB300] transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleting(r._id)}
                        className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#888] hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {routines.length === 0 && (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="font-display text-2xl text-white mb-2">NO ROUTINES YET</h3>
            <p className="text-[#666] mb-6">Build your daily system. Every great achiever has a routine.</p>
            <button onClick={openAdd} className="btn-primary">Add Your First Routine</button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md"
            style={{ animation: 'slideUp 0.3s ease forwards' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl text-white">{editing ? 'EDIT ROUTINE' : 'NEW ROUTINE'}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#666] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-16">
                  <label className="text-xs text-[#666] mb-1 block">Icon</label>
                  <input className="input w-full text-center text-xl" value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })} maxLength={2} />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-[#666] mb-1 block">Routine Name *</label>
                  <input className="input w-full" placeholder="e.g. Morning Run"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#666] mb-1 block">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c}
                      onClick={() => setForm({ ...form, category: c })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium capitalize transition-all ${
                        form.category === c
                          ? 'text-black font-bold'
                          : 'bg-[#1A1A1A] text-[#888] hover:text-white'
                      }`}
                      style={form.category === c ? { background: CAT_COLORS[c] } : {}}>
                      {CAT_ICONS[c]} {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#666] mb-1 block">Start Time</label>
                  <input type="time" className="input w-full"
                    value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-[#666] mb-1 block">End Time</label>
                  <input type="time" className="input w-full"
                    value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#666] mb-1 block">Points (how important is this?)</label>
                <div className="flex items-center gap-3">
                  <input type="range" min="1" max="50" className="flex-1 accent-[#FF5C1A]"
                    value={form.points} onChange={e => setForm({ ...form, points: parseInt(e.target.value) })} />
                  <div className="w-12 text-center font-display text-xl text-[#FF5C1A]">{form.points}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save size={15} /> {editing ? 'Update' : 'Add Routine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-semibold text-white mb-2">Delete this routine?</h3>
            <p className="text-[#666] text-sm mb-5">This will remove it from all future tracking.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleting)}
                className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
