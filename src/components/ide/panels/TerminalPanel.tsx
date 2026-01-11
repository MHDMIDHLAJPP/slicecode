import { useState, useRef, useEffect } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';

export function TerminalPanel() {
  const { terminalLines, terminalConnection, addTerminalLine, clearTerminal, setTerminalConnection } = useIDEStore();
  const [inputValue, setInputValue] = useState('');
  const [url, setUrl] = useState(terminalConnection.url || '');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleCommand = (command: string) => {
    addTerminalLine({ type: 'input', content: `733b065b> ${command}` });
    
    if (command === 'clear') {
      clearTerminal();
    } else if (command === 'ls') {
      addTerminalLine({ type: 'output', content: 'src\ninput.txt\nmain.c\noutput.txt' });
    } else if (command.startsWith('npm ')) {
      addTerminalLine({ type: 'output', content: 'up to date, audited 464 packages in 3s\n\n84 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities' });
    } else {
      addTerminalLine({ type: 'error', content: `Command not found: ${command}` });
    }

    setInputValue('');
  };

  const handleConnect = () => {
    if (terminalConnection.status === 'connected') {
      setTerminalConnection({ status: 'disconnected' });
    } else {
      setTerminalConnection({ status: 'connecting', url });
      setTimeout(() => {
        setTerminalConnection({ status: 'connected', url });
        addTerminalLine({ type: 'system', content: 'Session initialized.' });
      }, 1000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Connection bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-ide-bg border-b border-border">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter terminal URL"
          className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleConnect}
          className={cn(
            'px-4 py-1.5 rounded text-sm font-medium transition-colors',
            terminalConnection.status === 'connected'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {terminalConnection.status === 'connected' ? 'Disconnect' : 'Connect'}
        </button>
        <button className="p-1.5 hover:bg-secondary rounded" title="Copy">
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              terminalConnection.status === 'connected' ? 'bg-status-success' : 'bg-status-error'
            )}
          />
          <span className="text-sm text-muted-foreground capitalize">
            {terminalConnection.status}
          </span>
        </div>
      </div>

      {/* Terminal output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto ide-scrollbar p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalLines.map((line) => (
          <div
            key={line.id}
            className={cn(
              'terminal-text',
              line.type === 'input' && 'text-status-success',
              line.type === 'output' && 'text-foreground',
              line.type === 'error' && 'text-status-error',
              line.type === 'system' && 'text-muted-foreground'
            )}
          >
            {line.content.split('\n').map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        ))}

        {/* Input line */}
        {terminalConnection.status === 'connected' && (
          <div className="flex items-center terminal-text text-status-success">
            <span>733b065b&gt;&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  handleCommand(inputValue.trim());
                }
              }}
              className="flex-1 bg-transparent outline-none text-foreground caret-foreground"
              autoFocus
            />
            <span className="w-2 h-4 bg-foreground animate-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
