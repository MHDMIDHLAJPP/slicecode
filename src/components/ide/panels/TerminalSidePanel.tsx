import { useState } from 'react';
import { 
  Terminal, Plus, X, Trash2, MoreHorizontal, Split, 
  Power, PowerOff, RefreshCw, Settings, ChevronRight,
  Maximize2, Minimize2, Copy, FileCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TerminalInstance {
  id: string;
  name: string;
  type: 'bash' | 'powershell' | 'zsh' | 'cmd' | 'node' | 'python';
  status: 'running' | 'stopped' | 'error';
  pid?: number;
}

const shellTypes = [
  { id: 'bash', name: 'Bash', icon: '🐚' },
  { id: 'zsh', name: 'Zsh', icon: '⚡' },
  { id: 'powershell', name: 'PowerShell', icon: '💠' },
  { id: 'cmd', name: 'CMD', icon: '📟' },
  { id: 'node', name: 'Node.js', icon: '🟢' },
  { id: 'python', name: 'Python', icon: '🐍' },
] as const;

const initialTerminals: TerminalInstance[] = [
  { id: '1', name: 'bash', type: 'bash', status: 'running', pid: 12345 },
];

export function TerminalSidePanel() {
  const { 
    sidebarWidth, 
    setBottomPanelVisible, 
    setActiveBottomPanel, 
    terminalConnection,
    setTerminalConnection,
    clearTerminal,
    addTerminalLine
  } = useIDEStore();
  
  const [terminals, setTerminals] = useState<TerminalInstance[]>(initialTerminals);
  const [activeTerminal, setActiveTerminal] = useState<string>('1');
  const [isExpanded, setIsExpanded] = useState(true);

  const createTerminal = (type: typeof shellTypes[number]['id'] = 'bash') => {
    const newId = Date.now().toString();
    const shellInfo = shellTypes.find(s => s.id === type) || shellTypes[0];
    const newTerminal: TerminalInstance = {
      id: newId,
      name: `${shellInfo.name.toLowerCase()}-${terminals.length + 1}`,
      type: type as TerminalInstance['type'],
      status: 'running',
      pid: Math.floor(Math.random() * 50000) + 10000,
    };
    setTerminals(prev => [...prev, newTerminal]);
    setActiveTerminal(newId);
    setBottomPanelVisible(true);
    setActiveBottomPanel('terminal');
    
    // Simulate connection
    if (terminalConnection.status !== 'connected') {
      setTerminalConnection({ status: 'connecting', url: 'ws://10.147.82.1:4545' });
      setTimeout(() => {
        setTerminalConnection({ status: 'connected', url: 'ws://10.147.82.1:4545' });
        addTerminalLine({ type: 'system', content: `New ${shellInfo.name} session started (PID: ${newTerminal.pid})` });
      }, 500);
    } else {
      addTerminalLine({ type: 'system', content: `Switched to ${shellInfo.name} session (PID: ${newTerminal.pid})` });
    }
  };

  const closeTerminal = (id: string) => {
    const terminal = terminals.find(t => t.id === id);
    setTerminals(prev => prev.filter(t => t.id !== id));
    
    if (terminal) {
      addTerminalLine({ type: 'system', content: `Session ${terminal.name} (PID: ${terminal.pid}) terminated.` });
    }
    
    if (activeTerminal === id && terminals.length > 1) {
      const remaining = terminals.filter(t => t.id !== id);
      setActiveTerminal(remaining[0]?.id || '');
    }
    
    if (terminals.length === 1) {
      setTerminalConnection({ status: 'disconnected' });
    }
  };

  const killTerminal = (id: string) => {
    setTerminals(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'stopped' as const } : t
    ));
    const terminal = terminals.find(t => t.id === id);
    if (terminal) {
      addTerminalLine({ type: 'error', content: `Process ${terminal.pid} killed.` });
    }
  };

  const restartTerminal = (id: string) => {
    const terminal = terminals.find(t => t.id === id);
    if (terminal) {
      const newPid = Math.floor(Math.random() * 50000) + 10000;
      setTerminals(prev => prev.map(t => 
        t.id === id ? { ...t, status: 'running', pid: newPid } : t
      ));
      addTerminalLine({ type: 'system', content: `Session ${terminal.name} restarted (New PID: ${newPid})` });
    }
  };

  const selectTerminal = (id: string) => {
    const terminal = terminals.find(t => t.id === id);
    setActiveTerminal(id);
    setBottomPanelVisible(true);
    setActiveBottomPanel('terminal');
    
    if (terminal && terminalConnection.status !== 'connected') {
      setTerminalConnection({ status: 'connected', url: 'ws://10.147.82.1:4545' });
    }
    
    if (terminal) {
      addTerminalLine({ type: 'system', content: `Switched to ${terminal.name} (PID: ${terminal.pid})` });
    }
  };

  const duplicateTerminal = (id: string) => {
    const terminal = terminals.find(t => t.id === id);
    if (terminal) {
      createTerminal(terminal.type);
    }
  };

  const renameTerminal = (id: string) => {
    const newName = prompt('Enter new terminal name:');
    if (newName) {
      setTerminals(prev => prev.map(t => 
        t.id === id ? { ...t, name: newName } : t
      ));
    }
  };

  const getStatusColor = (status: TerminalInstance['status']) => {
    switch (status) {
      case 'running': return 'bg-status-success';
      case 'stopped': return 'bg-status-error';
      case 'error': return 'bg-status-warning';
    }
  };

  const getShellIcon = (type: TerminalInstance['type']) => {
    return shellTypes.find(s => s.id === type)?.icon || '🐚';
  };

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Terminal</span>
        <div className="flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-secondary rounded" title="New Terminal">
                <Plus className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {shellTypes.map(shell => (
                <DropdownMenuItem 
                  key={shell.id}
                  onClick={() => createTerminal(shell.id)}
                  className="gap-2"
                >
                  <span>{shell.icon}</span>
                  <span>{shell.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button 
            className="p-1 hover:bg-secondary rounded" 
            title="Split Terminal"
            onClick={() => createTerminal()}
          >
            <Split className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-secondary rounded" 
            title="Clear All"
            onClick={clearTerminal}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal instances */}
      <div className="flex-1 overflow-y-auto ide-scrollbar py-1">
        {terminals.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No terminals</p>
            <button
              className="mt-2 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
              onClick={() => createTerminal()}
            >
              Create Terminal
            </button>
          </div>
        ) : (
          terminals.map((terminal) => (
            <div
              key={terminal.id}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 cursor-pointer group hover:bg-secondary/50 mx-1 rounded',
                activeTerminal === terminal.id && 'bg-secondary'
              )}
              onClick={() => selectTerminal(terminal.id)}
            >
              <span className="text-sm shrink-0">{getShellIcon(terminal.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm truncate">{terminal.name}</span>
                  <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', getStatusColor(terminal.status))} />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  PID: {terminal.pid}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 hover:bg-secondary rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => selectTerminal(terminal.id)}>
                    <Maximize2 className="w-3.5 h-3.5 mr-2" />
                    Open Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateTerminal(terminal.id)}>
                    <Copy className="w-3.5 h-3.5 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => renameTerminal(terminal.id)}>
                    <FileCode className="w-3.5 h-3.5 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {terminal.status === 'running' ? (
                    <DropdownMenuItem onClick={() => killTerminal(terminal.id)} className="text-destructive">
                      <PowerOff className="w-3.5 h-3.5 mr-2" />
                      Kill Process
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => restartTerminal(terminal.id)}>
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      Restart
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => closeTerminal(terminal.id)} className="text-destructive">
                    <X className="w-3.5 h-3.5 mr-2" />
                    Close Terminal
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      {/* Connection status & quick actions */}
      <div className="p-2 border-t border-border space-y-1">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
          <span className={cn(
            'w-2 h-2 rounded-full',
            terminalConnection.status === 'connected' ? 'bg-status-success animate-pulse' : 'bg-status-error'
          )} />
          <span className="capitalize">{terminalConnection.status}</span>
          {terminalConnection.status === 'connected' && (
            <span className="text-[10px] truncate flex-1">{terminalConnection.url}</span>
          )}
        </div>
        
        <button 
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          onClick={() => createTerminal()}
        >
          <Plus className="w-3.5 h-3.5" />
          New Terminal
        </button>
        <button 
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          onClick={() => { setBottomPanelVisible(true); setActiveBottomPanel('terminal'); }}
        >
          <Terminal className="w-3.5 h-3.5" />
          Show Panel
        </button>
        {terminalConnection.status === 'connected' ? (
          <button 
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
            onClick={() => {
              setTerminalConnection({ status: 'disconnected' });
              addTerminalLine({ type: 'system', content: 'All sessions disconnected.' });
            }}
          >
            <PowerOff className="w-3.5 h-3.5" />
            Disconnect All
          </button>
        ) : (
          <button 
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-primary hover:bg-primary/10 rounded transition-colors"
            onClick={() => createTerminal()}
          >
            <Power className="w-3.5 h-3.5" />
            Start Session
          </button>
        )}
      </div>
    </div>
  );
}
