import { useState } from 'react';
import { Play, Bug, ChevronDown, ChevronRight, Plus, Settings, StopCircle, RotateCcw, ArrowRight, ArrowDown, ArrowUp, Variable, Layers, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';

interface DebugConfiguration {
  id: string;
  name: string;
  type: 'launch' | 'attach';
  program?: string;
}

interface Variable {
  name: string;
  value: string;
  type: string;
}

interface CallStackFrame {
  id: string;
  name: string;
  file: string;
  line: number;
}

interface Breakpoint {
  id: string;
  file: string;
  line: number;
  enabled: boolean;
}

const mockConfigurations: DebugConfiguration[] = [
  { id: '1', name: 'Run main.c', type: 'launch', program: 'main.c' },
  { id: '2', name: 'Debug Current File', type: 'launch' },
  { id: '3', name: 'Attach to Process', type: 'attach' },
];

const mockVariables: Variable[] = [
  { name: 'x', value: '42', type: 'int' },
  { name: 'str', value: '"Hello World"', type: 'char*' },
  { name: 'arr', value: '{1, 2, 3, 4, 5}', type: 'int[]' },
];

const mockCallStack: CallStackFrame[] = [
  { id: '1', name: 'main', file: 'main.c', line: 15 },
  { id: '2', name: '__libc_start_main', file: 'libc-start.c', line: 308 },
];

const mockBreakpoints: Breakpoint[] = [
  { id: '1', file: 'main.c', line: 10, enabled: true },
  { id: '2', file: 'main.c', line: 25, enabled: true },
  { id: '3', file: 'utils.c', line: 5, enabled: false },
];

export function RunDebugPanel() {
  const { sidebarWidth, debugState, startDebug, pauseDebug, continueDebug, stopDebug } = useIDEStore();
  const [selectedConfig, setSelectedConfig] = useState<string>(mockConfigurations[0].id);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['variables', 'callstack', 'breakpoints']));
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>(mockBreakpoints);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const toggleBreakpoint = (id: string) => {
    setBreakpoints(prev => prev.map(bp => 
      bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
    ));
  };

  const removeBreakpoint = (id: string) => {
    setBreakpoints(prev => prev.filter(bp => bp.id !== id));
  };

  const currentConfig = mockConfigurations.find(c => c.id === selectedConfig);

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Run and Debug</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded" title="Add Configuration">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Configuration selector and run button */}
      <div className="p-2 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={selectedConfig}
            onChange={(e) => setSelectedConfig(e.target.value)}
            className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {mockConfigurations.map(config => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>
          <button
            className={cn(
              'p-2 rounded transition-colors',
              debugState.isRunning
                ? 'bg-status-error text-white hover:bg-status-error/80'
                : 'bg-status-success text-white hover:bg-status-success/80'
            )}
            onClick={() => debugState.isRunning ? stopDebug() : startDebug()}
            title={debugState.isRunning ? 'Stop' : 'Start Debugging'}
          >
            {debugState.isRunning ? (
              <StopCircle className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Debug controls */}
        {debugState.isRunning && (
          <div className="flex items-center justify-center gap-1 py-1">
            <button
              className="p-1.5 hover:bg-secondary rounded"
              onClick={continueDebug}
              title="Continue (F5)"
              disabled={!debugState.isPaused}
            >
              <Play className="w-4 h-4 text-status-success" />
            </button>
            <button
              className="p-1.5 hover:bg-secondary rounded"
              onClick={() => {}}
              title="Step Over (F10)"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-secondary rounded"
              onClick={() => {}}
              title="Step Into (F11)"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-secondary rounded"
              onClick={() => {}}
              title="Step Out (Shift+F11)"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-secondary rounded"
              onClick={() => {}}
              title="Restart (Ctrl+Shift+F5)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-secondary rounded"
              onClick={stopDebug}
              title="Stop (Shift+F5)"
            >
              <StopCircle className="w-4 h-4 text-status-error" />
            </button>
          </div>
        )}
      </div>

      {/* Debug panels */}
      <div className="flex-1 overflow-y-auto ide-scrollbar">
        {!debugState.isRunning ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            <Bug className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Run and Debug</p>
            <p className="text-xs mt-1 opacity-70">Select a configuration and press play to start debugging</p>
            
            <button
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
              onClick={startDebug}
            >
              <Play className="w-4 h-4 inline mr-2" />
              Start Debugging
            </button>
          </div>
        ) : (
          <>
            {/* Variables */}
            <div>
              <button
                className="flex items-center gap-1 px-2 py-1.5 w-full hover:bg-secondary/50 text-left"
                onClick={() => toggleSection('variables')}
              >
                {expandedSections.has('variables') ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Variable className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider flex-1">
                  Variables
                </span>
              </button>
              
              {expandedSections.has('variables') && (
                <div className="pl-6">
                  {mockVariables.map((variable, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-2 py-1 hover:bg-secondary/50">
                      <span className="text-sm text-primary">{variable.name}</span>
                      <span className="text-sm text-muted-foreground">=</span>
                      <span className="text-sm text-syntax-string truncate">{variable.value}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{variable.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Call Stack */}
            <div>
              <button
                className="flex items-center gap-1 px-2 py-1.5 w-full hover:bg-secondary/50 text-left"
                onClick={() => toggleSection('callstack')}
              >
                {expandedSections.has('callstack') ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider flex-1">
                  Call Stack
                </span>
              </button>
              
              {expandedSections.has('callstack') && (
                <div className="pl-6">
                  {mockCallStack.map((frame, idx) => (
                    <div key={frame.id} className={cn(
                      "flex items-center gap-2 px-2 py-1 hover:bg-secondary/50 cursor-pointer",
                      idx === 0 && "bg-secondary/50"
                    )}>
                      <span className="text-sm text-syntax-function">{frame.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {frame.file}:{frame.line}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Breakpoints */}
            <div>
              <button
                className="flex items-center gap-1 px-2 py-1.5 w-full hover:bg-secondary/50 text-left"
                onClick={() => toggleSection('breakpoints')}
              >
                {expandedSections.has('breakpoints') ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Circle className="w-4 h-4 text-status-error" fill="currentColor" />
                <span className="text-xs font-semibold uppercase tracking-wider flex-1">
                  Breakpoints
                </span>
                <span className="text-xs text-muted-foreground bg-secondary px-1.5 rounded">
                  {breakpoints.length}
                </span>
              </button>
              
              {expandedSections.has('breakpoints') && (
                <div className="pl-6">
                  {breakpoints.map((bp) => (
                    <div key={bp.id} className="flex items-center gap-2 px-2 py-1 hover:bg-secondary/50 group">
                      <input
                        type="checkbox"
                        checked={bp.enabled}
                        onChange={() => toggleBreakpoint(bp.id)}
                        className="w-3 h-3"
                      />
                      <Circle 
                        className={cn(
                          "w-3 h-3 shrink-0",
                          bp.enabled ? "text-status-error" : "text-muted-foreground"
                        )}
                        fill="currentColor"
                      />
                      <span className="text-sm truncate flex-1">{bp.file}</span>
                      <span className="text-xs text-muted-foreground">:{bp.line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
