import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet, ArrowLeft, ArrowRight, Terminal, X, Home } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

type DeviceView = 'desktop' | 'tablet' | 'mobile';

interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export function PreviewPanel() {
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [url, setUrl] = useState('https://example.com');
  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { type: 'info', message: 'Console ready. Logs from the preview will appear here.', timestamp: new Date() },
  ]);
  const [history, setHistory] = useState<string[]>(['https://example.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const deviceWidths: Record<DeviceView, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const navigateTo = useCallback((newUrl: string) => {
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    setIsLoading(true);
    setUrl(formattedUrl);
    setInputUrl(formattedUrl);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(formattedUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    addLog('info', `Navigating to: ${formattedUrl}`);
  }, [history, historyIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = url;
      addLog('info', 'Page refreshed');
    }
  };

  const goHome = () => {
    navigateTo('https://example.com');
  };

  const openExternal = () => {
    window.open(url, '_blank');
  };

  const addLog = (type: ConsoleLog['type'], message: string) => {
    setConsoleLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const clearConsole = () => {
    setConsoleLogs([]);
    addLog('info', 'Console cleared');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    addLog('log', `Page loaded: ${url}`);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    addLog('error', `Failed to load: ${url}`);
  };

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-ide-bg border-b border-border">
        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5">
          <button 
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-1.5 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed" 
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button 
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed" 
            title="Go forward"
          >
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={refresh} className="p-1.5 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className={cn("w-4 h-4 text-muted-foreground", isLoading && "animate-spin")} />
          </button>
          <button onClick={goHome} className="p-1.5 hover:bg-secondary rounded" title="Home">
            <Home className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* URL bar */}
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-secondary border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter URL..."
          />
        </form>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5">
          <button onClick={openExternal} className="p-1.5 hover:bg-secondary rounded" title="Open in new tab">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </button>
          <button 
            onClick={() => setShowConsole(!showConsole)} 
            className={cn(
              "p-1.5 rounded transition-colors",
              showConsole ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
            )}
            title="Toggle console"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        {/* Device toggle */}
        <div className="flex items-center gap-0.5 bg-secondary rounded p-0.5 ml-1">
          <button
            onClick={() => setDeviceView('desktop')}
            className={cn(
              'p-1.5 rounded transition-colors',
              deviceView === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={cn(
              'p-1.5 rounded transition-colors',
              deviceView === 'tablet' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            title="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={cn(
              'p-1.5 rounded transition-colors',
              deviceView === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview iframe container */}
      <div className={cn("flex-1 flex flex-col", showConsole && "pb-0")}>
        <div className="flex-1 flex items-start justify-center p-4 bg-muted/30 overflow-auto">
          <div 
            className="bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all"
            style={{ width: deviceWidths[deviceView], maxWidth: '100%', height: '100%' }}
          >
            <iframe
              ref={iframeRef}
              src={url}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="Preview"
            />
          </div>
        </div>

        {/* Console panel */}
        {showConsole && (
          <div className="h-40 border-t border-border bg-ide-bg flex flex-col">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">Console</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearConsole}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-secondary"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setShowConsole(false)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2 font-mono text-xs space-y-0.5">
              {consoleLogs.map((log, index) => (
                <div key={index} className={cn("flex gap-2", getLogColor(log.type))}>
                  <span className="text-muted-foreground opacity-50">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="opacity-70">[{log.type.toUpperCase()}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
