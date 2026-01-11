import { useState, useRef, useEffect } from 'react';
import { Play, Pause, StepForward, ArrowDownToLine, ArrowUpFromLine, Square, HelpCircle, Copy, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';

const debugButtons = [
  { id: 'start', icon: Play, label: 'Start', color: 'bg-status-info' },
  { id: 'pause', icon: Pause, label: 'Pause', color: 'bg-status-error' },
  { id: 'continue', icon: Play, label: 'Continue', color: 'bg-status-success' },
  { id: 'stepOver', icon: StepForward, label: 'Step Over', color: 'bg-secondary' },
  { id: 'stepInto', icon: ArrowDownToLine, label: 'Step Into', color: 'bg-secondary' },
  { id: 'stepOut', icon: ArrowUpFromLine, label: 'Step Out', color: 'bg-secondary' },
  { id: 'stop', icon: Square, label: 'Stop', color: 'bg-status-error' },
  { id: 'help', icon: HelpCircle, label: 'Help', color: 'bg-status-info' },
];

export function DebugPanel() {
  const { debugState, startDebug, pauseDebug, continueDebug, stopDebug } = useIDEStore();
  const [inputValue, setInputValue] = useState('');
  const [debugOutput, setDebugOutput] = useState<string[]>([
    '[12:12:33 PM] =thread-group-added,id="i1"',
    '1&"./main: No such file or directory.\\n"',
    '(gdb)',
    '',
    '[12:12:33 PM] 9-gdb-set target-async on',
    '-break-insert main',
    '-exec-run',
    '@~"Warning: \'set target-async\', an alias for the command \'set mi-async\', is deprecated.\\n"',
    '~"Use \'set mi-async\'.\\n\\n"',
    '^done',
    '(gdb)',
    '',
    '[12:12:33 PM] @^error,msg="No symbol table is loaded.  Use the \\"file\\" command."',
    '(gdb)',
    '&"warning: Error disabling address space randomization: Operation not permitted\\n"',
    '[12:12:33 PM] `^error,msg="No executable file specified.\\nUse the \\"file\\" or \\"exec-file\\" command."',
    '(gdb)',
  ]);

  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [debugOutput]);

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'start':
        startDebug();
        break;
      case 'pause':
        pauseDebug();
        break;
      case 'continue':
        continueDebug();
        break;
      case 'stop':
        stopDebug();
        break;
    }
  };

  const handleSendCommand = () => {
    if (inputValue.trim()) {
      setDebugOutput([...debugOutput, `> ${inputValue}`, '(gdb)']);
      setInputValue('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Debug toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-ide-bg border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">Debug Console</span>
          <span className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground">
            {debugState.isRunning ? (debugState.isPaused ? 'PAUSED' : 'RUNNING') : 'IDLE'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {debugButtons.map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => handleAction(id)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors',
                color,
                'text-white hover:opacity-90'
              )}
              title={label}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{label.toLowerCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Debug output */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          ref={outputRef}
          className="flex-1 overflow-y-auto ide-scrollbar p-4 font-mono text-sm relative"
        >
          {debugOutput.map((line, i) => (
            <div
              key={i}
              className={cn(
                'terminal-text',
                line.startsWith('[') && 'text-muted-foreground',
                line.startsWith('@') && 'text-status-warning',
                line.startsWith('&') && 'text-status-warning',
                line.startsWith('`') && 'text-status-error',
                line.startsWith('^error') && 'text-status-error',
                line.startsWith('^done') && 'text-status-success',
                line.startsWith('~') && 'text-foreground',
                line.startsWith('(gdb)') && 'text-syntax-keyword',
                line.startsWith('>') && 'text-status-success',
                line.startsWith('-') && 'text-syntax-function',
              )}
            >
              {line}
            </div>
          ))}

          {/* Copy button */}
          <button
            className="absolute top-2 right-2 p-1.5 bg-secondary hover:bg-secondary/80 rounded flex items-center gap-1 text-xs text-muted-foreground"
            title="Copy output"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        </div>

        {/* Debug input */}
        <div className="flex items-center gap-2 px-4 py-2 bg-ide-bg border-t border-border">
          <span className="text-syntax-keyword font-mono text-sm">(gdb)</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
            placeholder="Enter GDB command..."
            className="flex-1 bg-transparent outline-none text-sm font-mono"
          />
          <button
            onClick={handleSendCommand}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
