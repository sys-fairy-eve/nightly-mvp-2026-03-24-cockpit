import { useState } from 'react';
import { services, type Service } from '../data/mockData';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
      <span className="text-amber-400">⚠️</span>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">✕</button>
    </div>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const statusColor = {
    running: 'bg-emerald-500',
    stopped: 'bg-red-500',
    failed: 'bg-red-500',
  }[service.status];

  const statusText = {
    running: 'text-emerald-400',
    stopped: 'text-red-400',
    failed: 'text-red-400',
  }[service.status];

  const showToast = (action: string) => {
    setToast(`${action} ${service.name}: Action not available in demo`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <div
        className="bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColor} ${service.status === 'running' ? 'animate-pulse' : ''}`} />
            <div>
              <div className="text-white font-mono text-sm">{service.name}</div>
              <div className="text-slate-500 text-xs mt-0.5 hidden sm:block">{service.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className={`${statusText} capitalize`}>{service.status}</span>
            {service.pid && (
              <span className="text-slate-500 font-mono text-xs hidden sm:inline">PID {service.pid}</span>
            )}
            <span className="text-slate-500 text-xs">{service.memory}</span>
            <span className={`text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>▾</span>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-slate-700/50 p-4" onClick={e => e.stopPropagation()}>
            <p className="text-slate-400 text-sm mb-3">{service.description}</p>
            <div className="flex gap-2">
              {service.status !== 'running' && (
                <button onClick={() => showToast('Start')} className="px-3 py-1.5 text-xs rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors">
                  ▶ Start
                </button>
              )}
              {service.status === 'running' && (
                <button onClick={() => showToast('Stop')} className="px-3 py-1.5 text-xs rounded bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-colors">
                  ■ Stop
                </button>
              )}
              <button onClick={() => showToast('Restart')} className="px-3 py-1.5 text-xs rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
                ↻ Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

export default function Services() {
  const running = services.filter(s => s.status === 'running').length;
  const stopped = services.filter(s => s.status === 'stopped').length;
  const failed = services.filter(s => s.status === 'failed').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Services</h1>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-400">{running} running</span>
          <span className="text-red-400">{stopped} stopped</span>
          <span className="text-red-400">{failed} failed</span>
        </div>
      </div>

      <div className="space-y-2">
        {services.map(service => (
          <ServiceRow key={service.name} service={service} />
        ))}
      </div>
    </div>
  );
}
