import { useState, useEffect } from 'react';
import { useIDEStore } from '@/store/ideStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ActivityBar } from './ActivityBar';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { CodeEditor } from './CodeEditor';
import { BottomPanel } from './BottomPanel';
import { SettingsPage } from './SettingsPage';
import { SearchPanel } from './panels/SearchPanel';
import { SourceControlPanel } from './panels/SourceControlPanel';
import { RunDebugPanel } from './panels/RunDebugPanel';
import { ExtensionsPanel } from './panels/ExtensionsPanel';
import { TerminalSidePanel } from './panels/TerminalSidePanel';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function IDELayout() {
  const { sidebarVisible, activeActivity, toggleSidebar } = useIDEStore();
  const { compactMode, animationsEnabled } = useSettingsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderSidePanel = () => {
    if (!sidebarVisible) return null;
    
    const panelContent = (() => {
      switch (activeActivity) {
        case 'explorer':
          return <FileExplorer />;
        case 'search':
          return <SearchPanel />;
        case 'source-control':
          return <SourceControlPanel />;
        case 'run':
          return <RunDebugPanel />;
        case 'terminal':
          return <TerminalSidePanel />;
        case 'extensions':
          return <ExtensionsPanel />;
        default:
          return <FileExplorer />;
      }
    })();

    // Mobile: overlay panel
    if (isMobile) {
      return (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          />
          {/* Overlay sidebar */}
          <div className="fixed left-12 top-0 bottom-0 w-64 bg-ide-sidebar z-50 border-r border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {activeActivity}
              </span>
              <button 
                onClick={toggleSidebar}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {panelContent}
            </div>
          </div>
        </>
      );
    }

    return panelContent;
  };

  return (
    <div className="h-screen w-full flex flex-col bg-ide-bg overflow-hidden relative">
      {settingsOpen && (
        <SettingsPage onClose={() => setSettingsOpen(false)} />
      )}
      
      <div className={cn(
        'flex-1 flex overflow-hidden',
        animationsEnabled && 'transition-all duration-200'
      )}>
        {/* Activity Bar */}
        <ActivityBar onOpenSettings={() => setSettingsOpen(true)} />

        {/* Sidebar - Dynamic based on activity */}
        {renderSidePanel()}

        {/* Main Editor Area */}
        <div className={cn(
          'flex-1 flex flex-col overflow-hidden',
          compactMode && 'gap-0'
        )}>
          {/* Editor Tabs */}
          <EditorTabs />

          {/* Code Editor */}
          <CodeEditor />
        </div>
      </div>

      {/* Bottom Panel */}
      <BottomPanel />
    </div>
  );
}