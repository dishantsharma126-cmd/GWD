import { useEffect, useState, useRef } from 'react';

const PARTICLE_COUNT = 30;

function Particle({ id }) {
  const style = {
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    background: Math.random() > 0.5 ? '#FF5C1A' : '#FFB300',
    animationDuration: `${Math.random() * 8 + 5}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.6 + 0.2,
  };
  return <div className="particle" style={style} />;
}

export default function SplashScreen({ onEnter }) {
  const [phase, setPhase] = useState('logo'); // logo → tagline → button
  const [btnHover, setBtnHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 1800);
    const t2 = setTimeout(() => setPhase('button'), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleEnter = () => {
    setLoading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(onEnter, 400); }
      setProgress(Math.min(p, 100));
    }, 80);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] grid-overlay overflow-hidden flex flex-col items-center justify-center z-50">
      {/* Particles */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => <Particle key={i} id={i} />)}

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,92,26,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Logo Block */}
      <div className={`text-center transition-all duration-1000 ${phase === 'logo' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        style={{ animation: phase !== 'logo' ? 'slideUp 0.8s ease forwards' : '' }}>

        {/* Logo Icon */}
        <div className="relative mx-auto mb-6 w-32 h-32">
          <div className="absolute inset-0 rounded-2xl border-2 border-[#FF5C1A] animate-spin-slow opacity-30" />
          <div className="absolute inset-2 rounded-xl border border-[#FFB300] animate-spin-slow opacity-20"
            style={{ animationDirection: 'reverse', animationDuration: '5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#FF5C1A] to-[#FFB300] flex items-center justify-center shadow-[0_0_40px_rgba(255,92,26,0.5)]">
              <span className="font-display text-black text-3xl tracking-wider">GWD</span>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1
          className="glitch font-display text-[clamp(60px,12vw,120px)] leading-none text-white mb-2"
          data-text="GRIND WITH"
          style={{ letterSpacing: '0.05em' }}>
          GRIND WITH
        </h1>
        <h1 className="font-display text-[clamp(60px,12vw,120px)] leading-none mb-1 animate-glow"
          style={{
            background: 'linear-gradient(135deg, #FF5C1A 0%, #FFB300 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em'
          }}>
          DISHANT
        </h1>
        <p className="font-mono text-[#555] text-sm tracking-[0.3em] uppercase mt-2">
          Your 90-Day Transformation System
        </p>
      </div>

      {/* Tagline */}
      {(phase === 'tagline' || phase === 'button') && (
        <div className="mt-10 text-center"
          style={{ animation: 'slideUp 0.6s ease forwards' }}>
          <div className="flex gap-6 justify-center mb-2">
            {['DISCIPLINE', 'FOCUS', 'GROWTH'].map((word, i) => (
              <div key={word} className="flex items-center gap-2">
                {i > 0 && <span className="text-[#333]">•</span>}
                <span className="font-mono text-xs tracking-[0.25em] text-[#888]">{word}</span>
              </div>
            ))}
          </div>
          <div className="w-48 h-px mx-auto mt-4"
            style={{ background: 'linear-gradient(90deg, transparent, #FF5C1A, transparent)' }} />
        </div>
      )}

      {/* CTA Button */}
      {phase === 'button' && (
        <div className="mt-12" style={{ animation: 'slideUp 0.6s 0.2s ease both' }}>
          {!loading ? (
            <button
              onClick={handleEnter}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              className="relative group overflow-hidden font-display text-2xl tracking-widest px-12 py-5 rounded-2xl border border-[#FF5C1A] transition-all duration-300"
              style={{
                background: btnHover
                  ? 'linear-gradient(135deg, #FF5C1A, #FFB300)'
                  : 'transparent',
                color: btnHover ? '#000' : '#FF5C1A',
                boxShadow: btnHover ? '0 0 40px rgba(255,92,26,0.5)' : '0 0 0px rgba(255,92,26,0)',
                transform: btnHover ? 'scale(1.05)' : 'scale(1)',
              }}>
              <span className="relative z-10">LET'S DIVE INTO THE GRIND MODE, SIR</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-noise transition-opacity" />
            </button>
          ) : (
            <div className="w-72 text-center">
              <p className="font-mono text-[#FF5C1A] text-sm mb-3 tracking-widest">INITIALIZING GRIND MODE...</p>
              <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #FF5C1A, #FFB300)'
                  }} />
              </div>
              <p className="font-mono text-[#555] text-xs mt-2">{Math.round(progress)}%</p>
            </div>
          )}
        </div>
      )}

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 font-mono text-[#222] text-xs">v2.0.0</div>
      <div className="absolute top-8 right-8 font-mono text-[#222] text-xs">GWD_SYS</div>
      <div className="absolute bottom-8 left-8 font-mono text-[#333] text-xs">
        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
      </div>
      <div className="absolute bottom-8 right-8">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 rounded-full animate-pulse-slow"
              style={{
                height: `${8 + i * 4}px`,
                background: '#FF5C1A',
                opacity: 0.3 + i * 0.15,
                animationDelay: `${i * 0.2}s`
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}
