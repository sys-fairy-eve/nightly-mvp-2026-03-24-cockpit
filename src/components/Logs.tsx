import { useState, useEffect, useRef } from 'react';
import { type LogEntry, generateLogEntry, generateInitialLogs } from '../data/mockData';

const tabs = ['System', 'Auth', 'Nginx', 'Syslog'];

const severityColor: Record<string, string> = {
  INFO: 'text-slate-400',
  WARN: 'text-amber-400',
  ERROR: 'text-red-400',
  DEBUG: 'text-slate-600',
};

const severityBg: Record<string, string> = {
  INFO: 'bg-slate-700/50',
  WARN: 'bg-amber-900/20',
  ERROR: 'bg-red-900/20',
  DEBUG: 'bg-slate-800/50',
};

export default function Logs() {
  const [activeTab, setActiveTab] = useState('System');
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>(() => {
    const initial: Record<string, LogEntry[]> = {};
    tabs.forEach(tab => { initial[tab] = generateInitialLogs(tab); });
    return initial;
  });
  const [streaming, setStreaming] = useState(true);
  const [filter, setFilter] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!streaming) return;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = { ...prev };
        const entry = generateLogEntry(activeTab);
        newLogs[activeTab] = [...prev[activeTab], entry].slice(-200);
        return newLogs;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [streaming, activeTab]);

  useEffect(() => {
    if (scrollRef.current && streaming) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, streaming]);

  const currentLogs = (logs[activeTab] || []).filter(
    log => !filter || log.message.toLowerCase().includes(filter.toLowerCase()) || log.severity.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-white">Logs</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
          <button
            onClick={() => setStreaming(!streaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              streaming
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-700 text-slate-400 border border-slate-600'
            }`}
          >
            {streaming ? '⏸ Pause' : '▶ Resume'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Log Lines */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto bg-slate-900 rounded-xl border border-slate-700/50 p-1 font-mono text-xs" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {currentLogs.map(log => (
          <div key={log.id} className={`flex gap-2 px-3 py-1 ${severityBg[log.severity]} rounded mb-0.5`}>
            <span className="text-slate-600 shrink-0">{log.timestamp}</span>
            <span className={`shrink-0 w-12 text-right ${severityColor[log.severity]}`}>{log.severity}</span>
            <span className={`${severityColor[log.severity]} break-all`}>{log.message}</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-600">
        {currentLogs.length} entries · {streaming ? 'Streaming live' : 'Paused'}
      </div>
    </div>
  );
}
