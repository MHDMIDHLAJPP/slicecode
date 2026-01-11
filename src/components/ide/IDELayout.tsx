import { useIDEStore } from '@/store/ideStore';
import { ActivityBar } from './ActivityBar';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { CodeEditor } from './CodeEditor';
import { BottomPanel } from './BottomPanel';

export function IDELayout() {
  const { sidebarVisible } = useIDEStore();

  return (
    <div className="h-screen w-full flex flex-col bg-ide-bg overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <ActivityBar />

        {/* Sidebar (File Explorer) */}
        {sidebarVisible && <FileExplorer />}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
