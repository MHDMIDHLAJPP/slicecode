import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, FolderPlus, RefreshCw, Trash2, Pencil, Check, X, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import { getVSCodeFileIcon, getVSCodeFolderIcon } from './icons/FileIcons';
import type { FileNode } from '@/types/ide';

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
}

function FileTreeItem({ node, depth }: FileTreeItemProps) {
  const { 
    expandedFolders, 
    selectFile, 
    activeTabId,
    renamingItemId,
    startRenaming,
    cancelRenaming,
    confirmRename,
    deleteItem,
    startCreatingFile,
    startCreatingFolder,
    creatingItem,
    cancelCreating,
    confirmCreate,
    moveItem
  } = useIDEStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const renameInputRef = useRef<HTMLInputElement>(null);
  
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = activeTabId === node.id;
  const isRenaming = renamingItemId === node.id;

  // Get VS Code style icon
  const IconComponent = node.type === 'folder'
    ? getVSCodeFolderIcon(node.name, isExpanded)
    : getVSCodeFileIcon(node.name);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (node.type === 'folder') {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== node.id && node.type === 'folder') {
      moveItem(draggedId, node.id);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      confirmRename(renameValue);
    } else if (e.key === 'Escape') {
      cancelRenaming();
      setRenameValue(node.name);
    }
  };

  // Check if we need to show the create input after this item
  const showCreateInputHere = creatingItem && creatingItem.parentId === node.id && node.type === 'folder' && isExpanded;

  return (
    <div>
      <div
        draggable={!isRenaming}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/50 transition-colors relative group',
          isSelected && 'bg-secondary',
          dragOver && 'bg-primary/20 ring-1 ring-primary'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => !isRenaming && selectFile(node)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {node.type === 'folder' && (
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}
        
        <span className="shrink-0">
          <IconComponent />
        </span>
        
        {isRenaming ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              onBlur={() => confirmRename(renameValue)}
              className="flex-1 bg-secondary border border-primary rounded px-1 py-0.5 text-sm outline-none min-w-0"
            />
            <button
              onClick={(e) => { e.stopPropagation(); confirmRename(renameValue); }}
              className="p-0.5 hover:bg-primary/20 rounded text-primary"
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-sm truncate flex-1">{node.name}</span>
        )}
        
        {isHovered && !isRenaming && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.type === 'folder' && (
              <>
                <button
                  className="p-0.5 hover:bg-secondary rounded"
                  onClick={(e) => { e.stopPropagation(); startCreatingFile(node.id); }}
                  title="New File in Folder"
                >
                  <FilePlus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  className="p-0.5 hover:bg-secondary rounded"
                  onClick={(e) => { e.stopPropagation(); startCreatingFolder(node.id); }}
                  title="New Folder"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </>
            )}
            <button
              className="p-0.5 hover:bg-secondary rounded"
              onClick={(e) => { e.stopPropagation(); setRenameValue(node.name); startRenaming(node.id); }}
              title="Rename"
            >
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </button>
            <button
              className="p-0.5 hover:bg-destructive/20 rounded"
              onClick={(e) => { e.stopPropagation(); deleteItem(node.id); }}
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          </div>
        )}
      </div>
      
      {/* Show create input inside folder */}
      {showCreateInputHere && (
        <CreateItemInput 
          depth={depth + 1} 
          type={creatingItem.type}
          onConfirm={confirmCreate}
          onCancel={cancelCreating}
        />
      )}
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CreateItemInputProps {
  depth: number;
  type: 'file' | 'folder';
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function CreateItemInput({ depth, type, onConfirm, onCancel }: CreateItemInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onConfirm(value);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const IconComponent = type === 'folder' 
    ? getVSCodeFolderIcon('new', false)
    : getVSCodeFileIcon(value || 'untitled');

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 bg-secondary/30"
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      {type === 'folder' ? (
        <span className="w-4 h-4 flex items-center justify-center">
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </span>
      ) : (
        <span className="w-4" />
      )}
      <span className="shrink-0">
        <IconComponent />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => value.trim() ? onConfirm(value) : onCancel()}
        placeholder={type === 'folder' ? 'Folder name' : 'File name'}
        className="flex-1 bg-secondary border border-primary rounded px-1 py-0.5 text-sm outline-none min-w-0"
      />
      <button
        onClick={() => value.trim() && onConfirm(value)}
        className="p-0.5 hover:bg-primary/20 rounded text-primary"
      >
        <Check className="w-3 h-3" />
      </button>
    </div>
  );
}

export function FileExplorer() {
  const { 
    files, 
    sidebarWidth, 
    startCreatingFile, 
    startCreatingFolder,
    creatingItem,
    confirmCreate,
    cancelCreating,
    moveItem
  } = useIDEStore();

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId) {
      moveItem(draggedId, null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Show create input at root level
  const showRootCreateInput = creatingItem && creatingItem.parentId === null;

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
      onDrop={handleRootDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Explorer</span>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded" 
            title="New File"
            onClick={() => startCreatingFile(null)}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-secondary rounded" 
            title="New Folder"
            onClick={() => startCreatingFolder(null)}
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto ide-scrollbar py-1">
        {showRootCreateInput && (
          <CreateItemInput 
            depth={0} 
            type={creatingItem.type}
            onConfirm={confirmCreate}
            onCancel={cancelCreating}
          />
        )}
        {files.map((file) => (
          <FileTreeItem key={file.id} node={file} depth={0} />
        ))}
      </div>
    </div>
  );
}
