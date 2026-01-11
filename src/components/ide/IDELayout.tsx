import { useState } from 'react';
import { useIDEStore } from '@/store/ideStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ActivityBar } from './ActivityBar';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { CodeEditor } from './CodeEditor';
import { BottomPanel } from './BottomPanel';
import { SettingsPage } from './SettingsPage';
import { cn } from '@/lib/utils';

export function IDELayout() {
  const { sidebarVisible } = useIDEStore();
  const { compactMode, animationsEnabled } = useSettingsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

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

        {/* Sidebar (File Explorer) */}
        {sidebarVisible && <FileExplorer />}

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
