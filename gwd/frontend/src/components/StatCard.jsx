export default function StatCard({ icon, label, value, sub, color = '#FF5C1A', trend }) {
  return (
    <div className="card p-5 hover:border-[#2A2A2A] hover:neon-border transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-mono px-2 py-1 rounded-full ${
            trend >= 0
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-display text-3xl text-white group-hover:text-[#FF5C1A] transition-colors">
        {value}
      </div>
      <div className="text-sm text-[#888] mt-0.5">{label}</div>
      {sub && <div className="text-xs text-[#555] mt-1 font-mono">{sub}</div>}
    </div>
  );
}
