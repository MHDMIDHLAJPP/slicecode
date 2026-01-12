import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet, ArrowLeft, ArrowRight, Home, Wrench } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { DevTools, ConsoleLog } from './DevTools';

type DeviceView = 'desktop' | 'tablet' | 'mobile';

export function PreviewPanel() {
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [url, setUrl] = useState('https://example.com');
  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [showDevTools, setShowDevTools] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { id: '1', type: 'info', message: 'DevTools initialized. Logs from the preview will appear here.', timestamp: new Date() },
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

  const addLog = useCallback((type: ConsoleLog['type'], message: string) => {
    setConsoleLogs(prev => [...prev, { 
      id: Date.now().toString(), 
      type, 
      message, 
      timestamp: new Date() 
    }]);
  }, []);

  const clearLogs = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  const navigateTo = useCallback((newUrl: string) => {
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    setIsLoading(true);
    setUrl(formattedUrl);
    setInputUrl(formattedUrl);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(formattedUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    addLog('info', `Navigating to: ${formattedUrl}`);
  }, [history, historyIndex, addLog]);

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

  const handleIframeLoad = () => {
    setIsLoading(false);
    addLog('log', `Page loaded: ${url}`);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    addLog('error', `Failed to load: ${url}`);
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
            onClick={() => setShowDevTools(!showDevTools)} 
            className={cn(
              "p-1.5 rounded transition-colors",
              showDevTools ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
            )}
            title="Toggle DevTools (F12)"
          >
            <Wrench className="w-4 h-4" />
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

      {/* Preview area with optional DevTools */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview iframe container */}
        <div className={cn("flex-1 flex items-start justify-center p-4 bg-muted/30 overflow-auto", showDevTools && "h-1/2")}>
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

        {/* DevTools panel */}
        {showDevTools && (
          <div className="h-1/2 min-h-[200px]">
            <DevTools
              onClose={() => setShowDevTools(false)}
              logs={consoleLogs}
              onClearLogs={clearLogs}
              onAddLog={addLog}
              url={url}
            />
          </div>
        )}
      </div>
    </div>
  );
}
