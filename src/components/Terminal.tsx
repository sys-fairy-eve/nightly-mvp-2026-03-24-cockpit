import { useState, useRef, useEffect, useCallback } from 'react';
import { terminalCommands } from '../data/mockData';

interface TermLine {
  id: number;
  type: 'input' | 'output';
  content: string;
}

function colorizePrompt(): React.ReactElement {
  return (
    <span>
      <span className="text-emerald-400 font-bold">root@srv-prod-01</span>
      <span className="text-white">:</span>
      <span className="text-blue-400 font-bold">~</span>
      <span className="text-white"># </span>
    </span>
  );
}

let lineIdCounter = 0;

export default function Terminal() {
  const [lines, setLines] = useState<TermLine[]>([
    { id: lineIdCounter++, type: 'output', content: 'Welcome to srv-prod-01 (Ubuntu 24.04.2 LTS)' },
    { id: lineIdCounter++, type: 'output', content: 'Last login: Mon Mar 24 22:45:12 2026 from 10.0.0.5' },
    { id: lineIdCounter++, type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const newLines: TermLine[] = [
      ...lines,
      { id: lineIdCounter++, type: 'input', content: trimmed },
    ];

    if (trimmed === '') {
      setLines(newLines);
      return;
    }

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    // Handle echo
    if (trimmed.startsWith('echo ')) {
      const arg = trimmed.slice(5).replace(/^["']|["']$/g, '');
      newLines.push({ id: lineIdCounter++, type: 'output', content: arg });
      setLines(newLines);
      return;
    }

    // Handle date (dynamic)
    if (trimmed === 'date') {
      newLines.push({ id: lineIdCounter++, type: 'output', content: new Date().toString() });
      setLines(newLines);
      return;
    }

    const response = terminalCommands[trimmed];
    if (response) {
      response.split('\n').forEach(line => {
        newLines.push({ id: lineIdCounter++, type: 'output', content: line });
      });
    } else {
      newLines.push({ id: lineIdCounter++, type: 'output', content: `bash: ${trimmed.split(' ')[0]}: command not found` });
    }

    setLines(newLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      if (currentInput.trim()) {
        setHistory(prev => [...prev, currentInput.trim()]);
      }
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setCurrentInput(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setCurrentInput('');
      } else {
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Terminal</h1>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="ml-2 font-mono">bash — 80×24</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        onClick={focusInput}
        className="flex-1 min-h-0 bg-gray-950 rounded-xl border border-slate-700/50 p-4 font-mono text-sm overflow-auto cursor-text"
        style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '400px' }}
      >
        {lines.map(line => (
          <div key={line.id} className="leading-6">
            {line.type === 'input' ? (
              <span>{colorizePrompt()}<span className="text-white">{line.content}</span></span>
            ) : (
              <span className="text-slate-300 whitespace-pre">{line.content}</span>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div className="leading-6 flex items-center">
          {colorizePrompt()}
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-white outline-none flex-1 font-mono caret-emerald-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>

      <div className="text-xs text-slate-600 flex gap-4">
        <span>Type <code className="text-slate-400">help</code> for available commands</span>
        <span>↑↓ Command history</span>
        <span>Ctrl+L Clear</span>
      </div>
    </div>
  );
}
