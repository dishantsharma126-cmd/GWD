import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, ListChecks, TrendingUp,
  Target, Settings, Flame, ChevronRight, Zap
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/today', icon: Zap, label: "Today's Grind" },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/routines', icon: ListChecks, label: 'Routines' },
  { to: '/growth', icon: TrendingUp, label: 'Growth Graph' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ goal, streak }) {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0D0D0D] border-r border-[#1A1A1A] flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5C1A] to-[#FFB300] flex items-center justify-center shadow-[0_0_15px_rgba(255,92,26,0.4)]">
            <span className="font-display text-black text-base">GWD</span>
          </div>
          <div>
            <div className="font-display text-xl text-white tracking-wider">GWD</div>
            <div className="text-[9px] text-[#555] font-mono tracking-wider">(grind_with_dishant)</div>
          </div>
        </div>
      </div>

      {/* Active Goal Banner */}
      {goal && (
        <div className="mx-4 mt-4 p-3 rounded-xl border border-[#FF5C1A]/20 bg-[#FF5C1A]/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-[#FF5C1A] tracking-wider uppercase">Active Goal</span>
            <span className="text-sm">{goal.icon || '🔥'}</span>
          </div>
          <div className="text-sm font-semibold text-white truncate">{goal.title}</div>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-[#666] mb-1">
              <span>Progress</span>
              <span>{goal.daysLeft}d left</span>
            </div>
            <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${goal.progressPct}%`,
                  background: 'linear-gradient(90deg, #FF5C1A, #FFB300)'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Streak Badge */}
      {streak > 0 && (
        <div className="mx-4 mt-3 flex items-center gap-2 p-2 rounded-lg bg-[#1A1A1A]">
          <span className="text-xl streak-fire">🔥</span>
          <div>
            <div className="text-xs text-[#888]">Current Streak</div>
            <div className="font-display text-lg text-[#FFB300]">{streak} DAYS</div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#FF5C1A]/10 text-[#FF5C1A] border border-[#FF5C1A]/20'
                  : 'text-[#666] hover:text-[#E8E8E8] hover:bg-[#1A1A1A]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-[#FF5C1A]' : 'group-hover:text-[#E8E8E8]'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="text-[#FF5C1A]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom quote */}
      <div className="p-4 border-t border-[#1A1A1A]">
        <p className="text-[10px] font-mono text-[#333] leading-relaxed italic">
          "Discipline is choosing between what you want now and what you want most."
        </p>
      </div>
    </aside>
  );
}
