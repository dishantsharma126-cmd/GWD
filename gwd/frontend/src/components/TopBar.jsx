import { format } from 'date-fns';
import { Bell, Search } from 'lucide-react';

export default function TopBar({ title, subtitle }) {
  const now = new Date();

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="h-16 border-b border-[#1A1A1A] flex items-center justify-between px-6 bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-30">
      <div>
        <h2 className="font-semibold text-white text-lg leading-tight">
          {title || `${greeting()}, Dishant 👊`}
        </h2>
        {subtitle && (
          <p className="text-xs text-[#555] font-mono">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Date */}
        <div className="hidden md:block text-right">
          <div className="font-mono text-xs text-[#FF5C1A]">
            {format(now, 'EEEE').toUpperCase()}
          </div>
          <div className="font-mono text-xs text-[#555]">
            {format(now, 'dd MMM yyyy')}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#1A1A1A]" />

        {/* Notif */}
        <button className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#666] hover:text-[#FF5C1A] hover:border-[#FF5C1A]/30 transition-all">
          <Bell size={15} />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5C1A] to-[#FFB300] flex items-center justify-center font-display text-black text-sm">
          D
        </div>
      </div>
    </header>
  );
}
