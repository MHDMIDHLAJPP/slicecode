import { Terminal as TerminalIcon, Play, Eye, Bug, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import { TerminalPanel } from './panels/TerminalPanel';
import { RunPanel } from './panels/RunPanel';
import { PreviewPanel } from './panels/PreviewPanel';
import { DebugPanel } from './panels/DebugPanel';
import type { BottomPanelTab } from '@/types/ide';

const tabs: { id: BottomPanelTab; icon: React.ElementType; label: string }[] = [
  { id: 'terminal', icon: TerminalIcon, label: 'TERMINAL' },
  { id: 'run', icon: Play, label: 'RUN' },
  { id: 'preview', icon: Eye, label: 'PREVIEW' },
  { id: 'debug', icon: Bug, label: 'DEBUG' },
];

export function BottomPanel() {
  const {
    bottomPanelVisible,
    bottomPanelHeight,
    activeBottomPanel,
    setActiveBottomPanel,
    setBottomPanelVisible,
  } = useIDEStore();

  if (!bottomPanelVisible) {
    return (
      <div className="flex items-center justify-center bg-ide-panel border-t border-border h-8">
        <button
          onClick={() => setBottomPanelVisible(true)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
          Show Panel
        </button>
      </div>
    );
  }

  const handleResizeStart = (clientY: number) => {
    const startY = clientY;
    const startHeight = bottomPanelHeight;

    const onMove = (y: number) => {
      const delta = startY - y;
      const newHeight = Math.max(100, Math.min(600, startHeight + delta));
      useIDEStore.setState({ bottomPanelHeight: newHeight });
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      onMove(e.touches[0].clientY);
    };

    const onEnd = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  };

  return (
    <div 
      className="flex flex-col bg-ide-panel border-t border-border shrink-0"
      style={{ height: bottomPanelHeight }}
    >
      {/* Resize handle */}
      <div 
        className="h-3 cursor-ns-resize hover:bg-primary/50 active:bg-primary/50 transition-colors flex items-center justify-center touch-none select-none"
        onMouseDown={(e) => handleResizeStart(e.clientY)}
        onTouchStart={(e) => {
          e.preventDefault();
          handleResizeStart(e.touches[0].clientY);
        }}
      >
        <div className="w-10 h-1 bg-border rounded-full" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border px-2">
        <div className="flex items-center">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveBottomPanel(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
                activeBottomPanel === id
                  ? 'text-foreground border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setBottomPanelVisible(false)}
          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {activeBottomPanel === 'terminal' && <TerminalPanel />}
        {activeBottomPanel === 'run' && <RunPanel />}
        {activeBottomPanel === 'preview' && <PreviewPanel />}
        {activeBottomPanel === 'debug' && <DebugPanel />}
      </div>
    </div>
  );
}
