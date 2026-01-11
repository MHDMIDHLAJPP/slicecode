import { useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, FileCode, FileText, Plus, FolderPlus, RefreshCw, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import type { FileNode } from '@/types/ide';

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
    case 'css':
      return 'text-syntax-function';
    default:
      return 'text-muted-foreground';
  }
};

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedId: string | null;
}

function FileTreeItem({ node, depth, selectedId }: FileTreeItemProps) {
  const { expandedFolders, selectFile, toggleFolder, activeTabId } = useIDEStore();
  const [isHovered, setIsHovered] = useState(false);
  
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = activeTabId === node.id;

  const Icon = node.type === 'folder'
    ? isExpanded ? FolderOpen : Folder
    : getFileIcon(node.name);

  const iconColor = node.type === 'folder'
    ? 'text-status-warning'
    : getFileColor(node.name);

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/50 transition-colors relative group',
          isSelected && 'bg-secondary'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => selectFile(node)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {node.type === 'folder' && (
          <span className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}
        <Icon className={cn('w-4 h-4 shrink-0', iconColor)} strokeWidth={1.5} />
        <span className="text-sm truncate flex-1">{node.name}</span>
        
        {isHovered && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-0.5 hover:bg-secondary rounded"
              onClick={(e) => { e.stopPropagation(); }}
              title="Rename"
            >
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
            <button
              className="p-0.5 hover:bg-destructive/20 rounded"
              onClick={(e) => { e.stopPropagation(); }}
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          </div>
        )}
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer() {
  const { files, sidebarWidth, activeTabId } = useIDEStore();

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Explorer</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded" title="New File">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="New Folder">
            <FolderPlus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto ide-scrollbar py-1">
        {files.map((file) => (
          <FileTreeItem key={file.id} node={file} depth={0} selectedId={activeTabId} />
        ))}
      </div>
    </div>
  );
}
