import { useState } from 'react';
import { Terminal, Plus, X, ChevronDown, Trash2, MoreHorizontal, Split } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';

interface TerminalInstance {
  id: string;
  name: string;
  type: 'bash' | 'powershell' | 'zsh' | 'cmd';
  active: boolean;
}

const mockTerminals: TerminalInstance[] = [
  { id: '1', name: 'bash', type: 'bash', active: true },
  { id: '2', name: 'node', type: 'bash', active: false },
];

export function TerminalSidePanel() {
  const { sidebarWidth, setBottomPanelVisible, setActiveBottomPanel } = useIDEStore();
  const [terminals, setTerminals] = useState<TerminalInstance[]>(mockTerminals);
  const [activeTerminal, setActiveTerminal] = useState<string>('1');

  const createTerminal = () => {
    const newId = Date.now().toString();
    const newTerminal: TerminalInstance = {
      id: newId,
      name: `bash-${terminals.length + 1}`,
      type: 'bash',
      active: false,
    };
    setTerminals(prev => [...prev, newTerminal]);
    setActiveTerminal(newId);
    // Open bottom panel with terminal tab
    setBottomPanelVisible(true);
    setActiveBottomPanel('terminal');
  };

  const closeTerminal = (id: string) => {
    setTerminals(prev => prev.filter(t => t.id !== id));
    if (activeTerminal === id && terminals.length > 1) {
      setActiveTerminal(terminals.find(t => t.id !== id)?.id || '');
    }
  };

  const selectTerminal = (id: string) => {
    setActiveTerminal(id);
    setBottomPanelVisible(true);
    setActiveBottomPanel('terminal');
  };

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Terminal</span>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded" 
            title="New Terminal"
            onClick={createTerminal}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Split Terminal">
            <Split className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="More Actions">
            <MoreHorizontal className="w-4 h-4" />
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
              onClick={createTerminal}
            >
              Create Terminal
            </button>
          </div>
        ) : (
          terminals.map((terminal) => (
            <div
              key={terminal.id}
              className={cn(
                'flex items-center gap-2 px-3 py-2 cursor-pointer group hover:bg-secondary/50',
                activeTerminal === terminal.id && 'bg-secondary'
              )}
              onClick={() => selectTerminal(terminal.id)}
            >
              <Terminal className={cn(
                'w-4 h-4 shrink-0',
                activeTerminal === terminal.id ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className="text-sm flex-1 truncate">{terminal.name}</span>
              <span className="text-xs text-muted-foreground">{terminal.type}</span>
              <button
                className="p-0.5 hover:bg-destructive/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); closeTerminal(terminal.id); }}
                title="Close Terminal"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Quick actions */}
      <div className="p-2 border-t border-border space-y-1">
        <button 
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          onClick={createTerminal}
        >
          <Plus className="w-4 h-4" />
          New Terminal
        </button>
        <button 
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          onClick={() => { setBottomPanelVisible(true); setActiveBottomPanel('terminal'); }}
        >
          <Terminal className="w-4 h-4" />
          Show Terminal Panel
        </button>
      </div>
    </div>
  );
}
