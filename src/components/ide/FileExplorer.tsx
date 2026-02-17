import { useState, useRef, useEffect, DragEvent } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Plus, FolderPlus, RefreshCw, Trash2, Pencil, Check, X, FilePlus, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import { getFileIcon, getFileColor } from '@/lib/fileIcons';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { FileNode } from '@/types/ide';

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedId: string | null;
  onStartRename: (nodeId: string) => void;
  renamingId: string | null;
  onRename: (nodeId: string, newName: string) => void;
  onCancelRename: () => void;
  creatingIn: string | null;
  creatingType: 'file' | 'folder' | null;
  onCreateSubmit: (name: string) => void;
  onCancelCreate: () => void;
  draggedId: string | null;
  onDragStart: (nodeId: string) => void;
  onDragEnd: () => void;
  dropTargetId: string | null;
  onDragOver: (nodeId: string | null) => void;
  onDropOnFolder: (folderId: string) => void;
}

function FileTreeItem({
  node,
  depth,
  selectedId,
  onStartRename,
  renamingId,
  onRename,
  onCancelRename,
  creatingIn,
  creatingType,
  onCreateSubmit,
  onCancelCreate,
  draggedId,
  onDragStart,
  onDragEnd,
  dropTargetId,
  onDragOver,
  onDropOnFolder,
}: FileTreeItemProps) {
  const { expandedFolders, selectFile, toggleFolder, activeTabId, deleteNode } = useIDEStore();
  const [isHovered, setIsHovered] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const [createValue, setCreateValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);

  const isExpanded = expandedFolders.has(node.id);
  const isSelected = activeTabId === node.id;
  const isRenaming = renamingId === node.id;
  const isCreatingHere = creatingIn === node.id;
  const isDragging = draggedId === node.id;
  const isDropTarget = dropTargetId === node.id && node.type === 'folder' && draggedId !== node.id;

  const Icon = node.type === 'folder'
    ? isExpanded ? FolderOpen : Folder
    : getFileIcon(node.name);

  const iconColor = node.type === 'folder'
    ? 'text-status-warning'
    : getFileColor(node.name);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (isCreatingHere && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreatingHere]);

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== node.name) {
      onRename(node.id, renameValue.trim());
    } else {
      onCancelRename();
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setRenameValue(node.name);
      onCancelRename();
    }
  };

  const handleCreateSubmit = () => {
    if (createValue.trim()) {
      onCreateSubmit(createValue.trim());
      setCreateValue('');
    } else {
      onCancelCreate();
    }
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateSubmit();
    } else if (e.key === 'Escape') {
      setCreateValue('');
      onCancelCreate();
    }
  };

  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(node.id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.type === 'folder' && draggedId !== node.id) {
      onDragOver(node.id);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.type === 'folder' && draggedId && draggedId !== node.id) {
      onDropOnFolder(node.id);
    }
    onDragOver(null);
  };

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/50 transition-colors relative group',
          isSelected && 'bg-secondary',
          isDragging && 'opacity-50',
          isDropTarget && 'bg-primary/20 border border-primary/50 border-dashed'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => !isRenaming && selectFile(node)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        draggable={!isRenaming}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
        
        {isRenaming ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              onBlur={handleRenameSubmit}
              className="flex-1 bg-background border border-primary rounded px-1 py-0.5 text-sm outline-none"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="p-0.5 hover:bg-primary/20 rounded text-primary"
              onClick={(e) => { e.stopPropagation(); handleRenameSubmit(); }}
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              className="p-0.5 hover:bg-destructive/20 rounded text-muted-foreground"
              onClick={(e) => { e.stopPropagation(); setRenameValue(node.name); onCancelRename(); }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <>
            <span className="text-sm truncate flex-1">{node.name}</span>
            
            {isHovered && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Desktop: inline buttons */}
                <div className="hidden sm:flex items-center gap-0.5">
                  {node.type === 'folder' && (
                    <>
                      <button
                        className="p-0.5 hover:bg-secondary rounded"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (!expandedFolders.has(node.id)) toggleFolder(node.id);
                          const store = useIDEStore.getState();
                          store.createFile(node.id, 'untitled');
                        }}
                        title="New File in Folder"
                      >
                        <FilePlus className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button
                        className="p-0.5 hover:bg-secondary rounded"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (!expandedFolders.has(node.id)) toggleFolder(node.id);
                          const store = useIDEStore.getState();
                          store.createFolder(node.id, 'new-folder');
                        }}
                        title="New Folder in Folder"
                      >
                        <FolderPlus className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </>
                  )}
                  <button
                    className="p-0.5 hover:bg-secondary rounded"
                    onClick={(e) => { e.stopPropagation(); setRenameValue(node.name); onStartRename(node.id); }}
                    title="Rename"
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    className="p-0.5 hover:bg-destructive/20 rounded"
                    onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>

                {/* Mobile: dropdown menu */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-0.5 hover:bg-secondary rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="z-50 bg-popover border border-border shadow-lg min-w-[140px]">
                      {node.type === 'folder' && (
                        <>
                          <DropdownMenuItem onClick={() => {
                            if (!expandedFolders.has(node.id)) toggleFolder(node.id);
                            const store = useIDEStore.getState();
                            store.createFile(node.id, 'untitled');
                          }}>
                            <FilePlus className="w-3.5 h-3.5 mr-2" /> New File
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            if (!expandedFolders.has(node.id)) toggleFolder(node.id);
                            const store = useIDEStore.getState();
                            store.createFolder(node.id, 'new-folder');
                          }}>
                            <FolderPlus className="w-3.5 h-3.5 mr-2" /> New Folder
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => { setRenameValue(node.name); onStartRename(node.id); }}>
                        <Pencil className="w-3.5 h-3.5 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteNode(node.id)}>
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {node.type === 'folder' && isExpanded && (
        <div>
          {/* Show create input at top of folder contents */}
          {isCreatingHere && (
            <div
              className="flex items-center gap-1 px-2 py-1"
              style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
            >
              <span className="w-4" />
              {creatingType === 'folder' ? (
                <Folder className="w-4 h-4 shrink-0 text-status-warning" strokeWidth={1.5} />
              ) : (
                <Plus className="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              )}
              <input
                ref={createInputRef}
                type="text"
                value={createValue}
                onChange={(e) => setCreateValue(e.target.value)}
                onKeyDown={handleCreateKeyDown}
                onBlur={handleCreateSubmit}
                placeholder={creatingType === 'folder' ? 'folder name' : 'file name'}
                className="flex-1 bg-background border border-primary rounded px-1 py-0.5 text-sm outline-none"
              />
              <button
                className="p-0.5 hover:bg-primary/20 rounded text-primary"
                onClick={handleCreateSubmit}
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                className="p-0.5 hover:bg-destructive/20 rounded text-muted-foreground"
                onClick={() => { setCreateValue(''); onCancelCreate(); }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {node.children?.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onStartRename={onStartRename}
              renamingId={renamingId}
              onRename={onRename}
              onCancelRename={onCancelRename}
              creatingIn={creatingIn}
              creatingType={creatingType}
              onCreateSubmit={onCreateSubmit}
              onCancelCreate={onCancelCreate}
              draggedId={draggedId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              dropTargetId={dropTargetId}
              onDragOver={onDragOver}
              onDropOnFolder={onDropOnFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer() {
  const { files, sidebarWidth, activeTabId, createFile, createFolder, renameNode, moveNode } = useIDEStore();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [creatingIn, setCreatingIn] = useState<string | null>(null);
  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [rootCreateType, setRootCreateType] = useState<'file' | 'folder' | null>(null);
  const [rootCreateValue, setRootCreateValue] = useState('');
  const rootCreateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (rootCreateType && rootCreateRef.current) {
      rootCreateRef.current.focus();
    }
  }, [rootCreateType]);

  const handleRootDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedId) {
      setDropTargetId('root');
    }
  };

  const handleRootDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedId) {
      moveNode(draggedId, null);
      setDraggedId(null);
      setDropTargetId(null);
    }
  };

  const handleDropOnFolder = (folderId: string) => {
    if (draggedId && folderId) {
      moveNode(draggedId, folderId);
      setDraggedId(null);
      setDropTargetId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleRename = (nodeId: string, newName: string) => {
    renameNode(nodeId, newName);
    setRenamingId(null);
  };

  const handleCreateSubmit = (name: string) => {
    if (creatingIn && creatingType) {
      if (creatingType === 'file') {
        createFile(creatingIn, name);
      } else {
        createFolder(creatingIn, name);
      }
    }
    setCreatingIn(null);
    setCreatingType(null);
  };

  const handleRootCreate = () => {
    if (rootCreateValue.trim() && rootCreateType) {
      if (rootCreateType === 'file') {
        createFile(null, rootCreateValue.trim());
      } else {
        createFolder(null, rootCreateValue.trim());
      }
      setRootCreateValue('');
      setRootCreateType(null);
    }
  };

  const handleRootCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRootCreate();
    } else if (e.key === 'Escape') {
      setRootCreateValue('');
      setRootCreateType(null);
    }
  };

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Explorer</span>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded" 
            title="New File"
            onClick={() => setRootCreateType('file')}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-secondary rounded" 
            title="New Folder"
            onClick={() => setRootCreateType('folder')}
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div 
        className={cn(
          "flex-1 overflow-y-auto ide-scrollbar py-1",
          dropTargetId === 'root' && 'bg-primary/10'
        )}
        onDragOver={handleRootDragOver}
        onDrop={handleRootDrop}
        onDragLeave={() => setDropTargetId(null)}
      >
        {/* Root level create input */}
        {rootCreateType && (
          <div className="flex items-center gap-1 px-2 py-1" style={{ paddingLeft: '8px' }}>
            {rootCreateType === 'folder' ? (
              <Folder className="w-4 h-4 shrink-0 text-status-warning" strokeWidth={1.5} />
            ) : (
              <Plus className="w-4 h-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            )}
            <input
              ref={rootCreateRef}
              type="text"
              value={rootCreateValue}
              onChange={(e) => setRootCreateValue(e.target.value)}
              onKeyDown={handleRootCreateKeyDown}
              onBlur={handleRootCreate}
              placeholder={rootCreateType === 'folder' ? 'folder name' : 'file name'}
              className="flex-1 bg-background border border-primary rounded px-1 py-0.5 text-sm outline-none"
            />
            <button
              className="p-0.5 hover:bg-primary/20 rounded text-primary"
              onClick={handleRootCreate}
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              className="p-0.5 hover:bg-destructive/20 rounded text-muted-foreground"
              onClick={() => { setRootCreateValue(''); setRootCreateType(null); }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {files.map((file) => (
          <FileTreeItem
            key={file.id}
            node={file}
            depth={0}
            selectedId={activeTabId}
            onStartRename={setRenamingId}
            renamingId={renamingId}
            onRename={handleRename}
            onCancelRename={() => setRenamingId(null)}
            creatingIn={creatingIn}
            creatingType={creatingType}
            onCreateSubmit={handleCreateSubmit}
            onCancelCreate={() => { setCreatingIn(null); setCreatingType(null); }}
            draggedId={draggedId}
            onDragStart={setDraggedId}
            onDragEnd={handleDragEnd}
            dropTargetId={dropTargetId}
            onDragOver={setDropTargetId}
            onDropOnFolder={handleDropOnFolder}
          />
        ))}
      </div>
    </div>
  );
}
