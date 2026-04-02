export default function CircularProgress({ value = 0, size = 120, stroke = 8, label, sublabel, color = '#FF5C1A' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow */}
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ background: color }} />

        <svg width={size} height={size} className="relative z-10">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="#1A1A1A" strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            className="progress-ring-circle"
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="url(#grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5C1A" />
              <stop offset="100%" stopColor="#FFB300" />
            </linearGradient>
          </defs>
          {/* Center text */}
          <text
            x="50%" y="50%"
            textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize={size / 5}
            fontFamily="'Bebas Neue', cursive"
            fontWeight="bold"
          >
            {Math.round(value)}%
          </text>
        </svg>
      </div>
      {label && <div className="font-semibold text-sm text-white text-center">{label}</div>}
      {sublabel && <div className="text-xs text-[#666] text-center">{sublabel}</div>}
    </div>
  );
}
