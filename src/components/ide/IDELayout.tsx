import { useState } from 'react';
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

export function IDELayout() {
  const { sidebarVisible, activeActivity } = useIDEStore();
  const { compactMode, animationsEnabled } = useSettingsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const renderSidePanel = () => {
    if (!sidebarVisible) return null;
    
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
