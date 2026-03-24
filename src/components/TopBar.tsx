import { useState, useEffect } from 'react';

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3 ml-10 md:ml-0">
        <span className="text-slate-400 text-sm font-mono">srv-prod-01</span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="hidden sm:inline text-slate-500 text-sm">Ubuntu 24.04 LTS</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm font-mono">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">A</div>
          <span className="hidden sm:inline text-slate-400 text-sm">admin</span>
        </div>
      </div>
    </header>
  );
}
