import { useState, useEffect } from 'react';
import { systemInfo } from '../data/mockData';

function GaugeRing({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{value}%</span>
        </div>
      </div>
      <span className="text-slate-400 text-xs mt-2">{label}</span>
    </div>
  );
}

function BarStat({ label, used, total, unit, color }: { label: string; used: number; total: number; unit: string; color: string }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300">{used} / {total} {unit} <span className="text-slate-500">({pct}%)</span></span>
      </div>
      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
  return bytes + ' B';
}

export default function Overview() {
  const [cpu, setCpu] = useState(systemInfo.cpu);
  const [ram, setRam] = useState(systemInfo.ram.used);
  const [netIn, setNetIn] = useState(systemInfo.networkIn);
  const [netOut, setNetOut] = useState(systemInfo.networkOut);
  const [load, setLoad] = useState<[number, number, number]>(systemInfo.loadAvg);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 10)));
      setRam(prev => Math.max(3, Math.min(14, prev + (Math.random() - 0.5) * 0.5)));
      setNetIn(prev => prev + Math.floor(Math.random() * 50000));
      setNetOut(prev => prev + Math.floor(Math.random() * 30000));
      setLoad(prev => [
        Math.max(0.1, +(prev[0] + (Math.random() - 0.5) * 0.3).toFixed(2)),
        Math.max(0.1, +(prev[1] + (Math.random() - 0.5) * 0.15).toFixed(2)),
        Math.max(0.1, +(prev[2] + (Math.random() - 0.5) * 0.08).toFixed(2)),
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cpuRounded = Math.round(cpu);
  const ramRounded = +ram.toFixed(1);
  const ramPct = Math.round((ramRounded / systemInfo.ram.total) * 100);
  const diskPct = Math.round((systemInfo.disk.used / systemInfo.disk.total) * 100);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">System Overview</h1>

      {/* System Info Card */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-slate-500 text-xs mb-1">Hostname</div>
            <div className="text-white font-mono">{systemInfo.hostname}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-1">Operating System</div>
            <div className="text-white">{systemInfo.os}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-1">Kernel</div>
            <div className="text-white font-mono text-xs">{systemInfo.kernel}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-1">Uptime</div>
            <div className="text-emerald-400">{systemInfo.uptime}</div>
          </div>
        </div>
      </div>

      {/* Gauges Row */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
        <h2 className="text-sm font-medium text-slate-400 mb-4">Resource Usage</h2>
        <div className="flex flex-wrap justify-around gap-6">
          <GaugeRing value={cpuRounded} label="CPU" color={cpuRounded > 80 ? '#ef4444' : cpuRounded > 60 ? '#f59e0b' : '#22c55e'} />
          <GaugeRing value={ramPct} label="RAM" color={ramPct > 80 ? '#ef4444' : ramPct > 60 ? '#f59e0b' : '#3b82f6'} />
          <GaugeRing value={diskPct} label="Disk" color={diskPct > 80 ? '#ef4444' : diskPct > 60 ? '#f59e0b' : '#8b5cf6'} />
        </div>
      </div>

      {/* Bars */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 space-y-4">
        <BarStat label="Memory" used={ramRounded} total={systemInfo.ram.total} unit="GB" color="#3b82f6" />
        <BarStat label="Disk" used={systemInfo.disk.used} total={systemInfo.disk.total} unit="GB" color="#8b5cf6" />
      </div>

      {/* Network & Load */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-3">Network I/O</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400">↓ Received</span>
              <span className="text-white font-mono">{formatBytes(netIn)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">↑ Transmitted</span>
              <span className="text-white font-mono">{formatBytes(netOut)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-3">Load Average</h2>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-white font-mono text-lg">{load[0]}</div>
              <div className="text-slate-500 text-xs">1 min</div>
            </div>
            <div className="text-center">
              <div className="text-white font-mono text-lg">{load[1]}</div>
              <div className="text-slate-500 text-xs">5 min</div>
            </div>
            <div className="text-center">
              <div className="text-white font-mono text-lg">{load[2]}</div>
              <div className="text-slate-500 text-xs">15 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
