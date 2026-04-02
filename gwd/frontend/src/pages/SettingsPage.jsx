import { useState } from 'react';
import TopBar from '../components/TopBar';
import { Save, Globe, Database, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('gwd_api') || 'http://localhost:5000');
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem('gwd_api', apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar title="Settings" subtitle="Configure your GWD system" />
      <div className="p-6 max-w-2xl space-y-6">

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-[#FF5C1A]" />
            <h3 className="font-semibold text-white">Backend Connection</h3>
          </div>
          <label className="text-xs text-[#666] mb-2 block">API Base URL</label>
          <input className="input w-full font-mono text-sm mb-2" value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            placeholder="http://localhost:5000" />
          <p className="text-xs text-[#555]">Point this to your deployed backend URL when hosting live.</p>
          <button onClick={save} className="btn-primary mt-4 flex items-center gap-2">
            <Save size={14} /> {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-[#FFB300]" />
            <h3 className="font-semibold text-white">About GWD</h3>
          </div>
          <div className="space-y-2 text-sm text-[#666]">
            <p>Version: <span className="text-[#FF5C1A] font-mono">2.0.0</span></p>
            <p>Stack: <span className="text-white font-mono">React + Tailwind + Node.js + MongoDB</span></p>
            <p>Brand: <span className="text-[#FF5C1A] font-display text-lg">GWD</span> <span className="text-[#444] text-xs">(grind_with_dishant)</span></p>
          </div>
        </div>

        <div className="card p-6 border-dashed border-[#333]">
          <p className="text-sm text-[#555] text-center">
            Built for Dishant. Grind hard. Stay consistent. 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
