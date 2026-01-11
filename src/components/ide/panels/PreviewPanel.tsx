import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type DeviceView = 'desktop' | 'tablet' | 'mobile';

export function PreviewPanel() {
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [url, setUrl] = useState('http://localhost:3000');

  const deviceWidths: Record<DeviceView, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-ide-bg border-b border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-secondary border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-w-64"
          />
          <button className="p-1.5 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-secondary rounded" title="Open in new tab">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded p-1">
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
      <div className="flex-1 flex items-start justify-center p-4 bg-muted/30 overflow-auto">
        <div 
          className="bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all"
          style={{ width: deviceWidths[deviceView], maxWidth: '100%', height: '100%' }}
        >
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Preview will appear here</p>
              <p className="text-xs mt-1 opacity-70">Run your code to see the output</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
