import { X, FileCode, FileText, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'c':
    case 'h':
    case 'cpp':
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return FileCode;
    case 'txt':
    case 'md':
      return FileText;
    default:
      return File;
  }
};

const getFileColor = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'c':
      return 'text-syntax-keyword';
    case 'h':
      return 'text-syntax-preprocessor';
    case 'js':
      return 'text-status-warning';
    case 'ts':
    case 'tsx':
      return 'text-syntax-keyword';
    default:
      return 'text-muted-foreground';
  }
};

export function EditorTabs() {
  const { openTabs, activeTabId, setActiveTab, closeTab } = useIDEStore();

  if (openTabs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center bg-ide-bg border-b border-border overflow-x-auto ide-scrollbar">
      {openTabs.map((tab) => {
        const Icon = getFileIcon(tab.name);
        const iconColor = getFileColor(tab.name);
        const isActive = tab.id === activeTabId;

        return (
          <div
            key={tab.id}
            className={cn(
              'flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-border min-w-0 group transition-colors',
              isActive 
                ? 'bg-ide-tabActive text-foreground' 
                : 'bg-ide-tabInactive text-muted-foreground hover:bg-secondary/30'
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon className={cn('w-4 h-4 shrink-0', iconColor)} strokeWidth={1.5} />
            <span className="text-sm truncate max-w-32">{tab.name}</span>
            {tab.isDirty && (
              <span className="w-2 h-2 rounded-full bg-foreground shrink-0" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="p-0.5 rounded hover:bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
