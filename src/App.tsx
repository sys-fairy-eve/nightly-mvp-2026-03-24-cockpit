import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Overview from './components/Overview';
import Services from './components/Services';
import Logs from './components/Logs';
import Terminal from './components/Terminal';

type Page = 'overview' | 'services' | 'logs' | 'terminal';

export default function App() {
  const [page, setPage] = useState<Page>('overview');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar activePage={page} onNavigate={setPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {page === 'overview' && <Overview />}
          {page === 'services' && <Services />}
          {page === 'logs' && <Logs />}
          {page === 'terminal' && <Terminal />}
        </main>
      </div>
    </div>
  );
}
