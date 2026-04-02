import { useEffect, useState } from 'react';
import { goalsAPI } from '../services/api';
import TopBar from '../components/TopBar';
import { Plus, Target, X, Pencil, CheckCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const PRESET_GOALS = [
  { title: '90-Day Body Transformation', durationDays: 90, icon: '💪', color: '#FF5C1A' },
  { title: '30-Day Study Sprint', durationDays: 30, icon: '📚', color: '#3B82F6' },
  { title: '60-Day Skill Mastery', durationDays: 60, icon: '⚡', color: '#FFB300' },
  { title: '90-Day Mental Reset', durationDays: 90, icon: '🧠', color: '#8B5CF6' },
];

const defaultForm = { title: '', description: '', durationDays: 90, icon: '🔥', color: '#FF5C1A' };

export default function GoalsPage({ activeGoal, onGoalChange }) {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try { const res = await goalsAPI.getAll(); setGoals(res.data); } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title) return;
    try {
      if (editing) await goalsAPI.update(editing, form);
      else await goalsAPI.create(form);
      setShowModal(false); setForm(defaultForm); setEditing(null);
      load();
      onGoalChange?.();
    } catch (e) { alert('Error saving goal'); }
  };

  const setActive = async (g) => {
    try {
      // Deactivate all, activate selected
      await Promise.all(goals.map(gl => goalsAPI.update(gl._id, { isActive: gl._id === g._id })));
      load(); onGoalChange?.();
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return;
    try { await goalsAPI.delete(id); load(); onGoalChange?.(); } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar title="Goals" subtitle="Set your mission. Commit to the grind." />
      <div className="p-6 max-w-4xl space-y-6">

        <div className="flex justify-between items-center">
          <p className="text-[#888] text-sm">{goals.length} goals created</p>
          <button onClick={() => { setForm(defaultForm); setEditing(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Goal
          </button>
        </div>

        {/* Quick presets */}
        {goals.length === 0 && (
          <div>
            <p className="text-xs text-[#666] font-mono mb-3 tracking-wider uppercase">Quick Start Presets</p>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_GOALS.map(p => (
                <button key={p.title}
                  onClick={() => { setForm({ ...p }); setEditing(null); setShowModal(true); }}
                  className="card p-4 text-left hover:neon-border transition-all group">
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className="font-medium text-white text-sm">{p.title}</div>
                  <div className="text-xs text-[#666] mt-1 font-mono">{p.durationDays} days</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((g) => {
            const daysLeft = differenceInDays(new Date(g.endDate), new Date());
            const pct = Math.min(100, Math.round(((g.durationDays - daysLeft) / g.durationDays) * 100));
            const isActive = g.isActive;
            return (
              <div key={g._id}
                className={`card p-5 transition-all ${isActive ? 'neon-border' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${g.color || '#FF5C1A'}20`, border: `1px solid ${g.color || '#FF5C1A'}40` }}>
                      {g.icon || '🔥'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{g.title}</h3>
                        {isActive && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF5C1A]/15 text-[#FF5C1A] border border-[#FF5C1A]/30">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      {g.description && <p className="text-xs text-[#666] mt-0.5">{g.description}</p>}
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs font-mono text-[#555]">{g.durationDays} days</span>
                        <span className="text-xs font-mono text-[#555]">
                          {daysLeft > 0 ? `${daysLeft}d left` : 'Completed'}
                        </span>
                        <span className="text-xs font-mono text-[#555]">
                          Started {format(new Date(g.startDate), 'dd MMM')}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${g.color || '#FF5C1A'}, #FFB300)` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {!isActive && (
                      <button onClick={() => setActive(g)} title="Set Active"
                        className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#666] hover:text-green-400 transition-colors">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button onClick={() => { setForm({ ...g }); setEditing(g._id); setShowModal(true); }}
                      className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#666] hover:text-[#FFB300] transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(g._id)}
                      className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#666] hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="card p-16 text-center">
            <Target size={48} className="mx-auto text-[#333] mb-4" />
            <h3 className="font-display text-2xl text-white mb-2">NO GOALS SET</h3>
            <p className="text-[#666] mb-6">A goal without a plan is just a wish. Set your mission.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md"
            style={{ animation: 'slideUp 0.3s ease forwards' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl text-white">{editing ? 'EDIT GOAL' : 'NEW GOAL'}</h3>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-[#666]" /></button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-16">
                  <label className="text-xs text-[#666] mb-1 block">Icon</label>
                  <input className="input w-full text-center text-xl" value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })} maxLength={2} />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-[#666] mb-1 block">Goal Title *</label>
                  <input className="input w-full" placeholder="e.g. 90-Day Body Transformation"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#666] mb-1 block">Description (optional)</label>
                <textarea className="input w-full h-20 resize-none text-sm" placeholder="What do you want to achieve?"
                  value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <label className="text-xs text-[#666] mb-1 block">Duration: <span className="text-[#FF5C1A] font-bold">{form.durationDays} days</span></label>
                <input type="range" min="7" max="365" step="1"
                  className="w-full accent-[#FF5C1A]"
                  value={form.durationDays} onChange={e => setForm({ ...form, durationDays: parseInt(e.target.value) })} />
                <div className="flex justify-between text-[10px] text-[#555] font-mono mt-1">
                  <span>7d</span><span>30d</span><span>90d</span><span>180d</span><span>365d</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#666] mb-2 block">Accent Color</label>
                <div className="flex gap-2">
                  {['#FF5C1A', '#FFB300', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'scale-125 ring-2 ring-white/30' : ''}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1">{editing ? 'Update Goal' : 'Create Goal'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
