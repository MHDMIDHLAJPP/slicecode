import { Play, AlertTriangle, AlertCircle } from 'lucide-react';
import { useIDEStore } from '@/store/ideStore';

const languages = [
  { id: 'c', name: 'C (GCC)' },
  { id: 'cpp', name: 'C++ (G++)' },
  { id: 'javascript', name: 'JavaScript (Node.js)' },
  { id: 'python', name: 'Python 3' },
  { id: 'java', name: 'Java' },
  { id: 'rust', name: 'Rust' },
];

export function RunPanel() {
  const { 
    selectedLanguage, 
    setSelectedLanguage, 
    stdinInput, 
    setStdinInput, 
    runOutput, 
    isRunning, 
    runCode,
    openTabs,
    activeTabId
  } = useIDEStore();

  const activeTab = openTabs.find(t => t.id === activeTabId);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Warnings */}
      <div className="flex flex-col gap-1 px-4 py-2 bg-ide-bg">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-status-warning/20 rounded text-status-warning text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Warning: Running code on the server can be dangerous. Do not use this in production without sandboxing!</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-status-error/20 rounded text-status-error text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Error running code: editor is undefined</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto ide-scrollbar p-4">
        {/* Language selector and Run button */}
        <div className="flex items-end gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-w-48"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>

        {/* Standard Input */}
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-1.5">Standard Input (stdin)</label>
          <textarea
            value={stdinInput}
            onChange={(e) => setStdinInput(e.target.value)}
            placeholder="Optional input for your program..."
            className="w-full h-24 bg-secondary border border-border rounded p-3 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Result */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <label className="text-sm text-muted-foreground">Result</label>
            {activeTab && (
              <span className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground">
                {activeTab.name}
              </span>
            )}
            <span className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground uppercase">
              {selectedLanguage}
            </span>
          </div>
          <div className="bg-secondary border border-border rounded p-3 min-h-32 font-mono text-sm whitespace-pre-wrap">
            {runOutput}
          </div>
        </div>
      </div>
    </div>
  );
}
