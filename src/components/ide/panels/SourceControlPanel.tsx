import { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, Plus, Minus, RotateCcw, Check, MoreHorizontal, ChevronDown, ChevronRight, RefreshCw, Upload, Download, FileCode, FileDiff, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import { getFileIcon, getFileColor } from '@/lib/fileIcons';

interface GitChange {
  id: string;
  fileName: string;
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
  staged: boolean;
}

const mockChanges: GitChange[] = [
  { id: '1', fileName: 'main.c', path: 'main.c', status: 'modified', staged: false },
  { id: '2', fileName: 'App.tsx', path: 'src/App.tsx', status: 'modified', staged: true },
  { id: '3', fileName: 'newfile.ts', path: 'src/newfile.ts', status: 'added', staged: false },
];

const statusColors: Record<string, string> = {
  modified: 'text-status-warning',
  added: 'text-status-success',
  deleted: 'text-status-error',
  renamed: 'text-primary',
  untracked: 'text-muted-foreground',
};

const statusLabels: Record<string, string> = {
  modified: 'M',
  added: 'A',
  deleted: 'D',
  renamed: 'R',
  untracked: 'U',
};

export function SourceControlPanel() {
  const { sidebarWidth } = useIDEStore();
  const [commitMessage, setCommitMessage] = useState('');
  const [changes, setChanges] = useState<GitChange[]>(mockChanges);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['staged', 'changes']));
  const [currentBranch] = useState('main');

  const stagedChanges = changes.filter(c => c.staged);
  const unstagedChanges = changes.filter(c => !c.staged);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const stageFile = (id: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, staged: true } : c));
  };

  const unstageFile = (id: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, staged: false } : c));
  };

  const stageAll = () => {
    setChanges(prev => prev.map(c => ({ ...c, staged: true })));
  };

  const unstageAll = () => {
    setChanges(prev => prev.map(c => ({ ...c, staged: false })));
  };

  const discardChange = (id: string) => {
    setChanges(prev => prev.filter(c => c.id !== id));
  };

  const handleCommit = () => {
    if (commitMessage.trim() && stagedChanges.length > 0) {
      setChanges(prev => prev.filter(c => !c.staged));
      setCommitMessage('');
    }
  };

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Source Control</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="More Actions">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Branch info */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/30">
        <GitBranch className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{currentBranch}</span>
        <div className="flex-1" />
        <button className="p-1 hover:bg-secondary rounded" title="Pull">
          <Download className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1 hover:bg-secondary rounded" title="Push">
          <Upload className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Commit message input */}
      <div className="p-2 border-b border-border">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Message (press Ctrl+Enter to commit)"
          className="w-full bg-background border border-border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          rows={3}
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-sm transition-colors',
              commitMessage.trim() && stagedChanges.length > 0
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            )}
            onClick={handleCommit}
            disabled={!commitMessage.trim() || stagedChanges.length === 0}
          >
            <Check className="w-4 h-4" />
            Commit
          </button>
          <button className="p-1.5 hover:bg-secondary rounded" title="More Actions">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Changes list */}
      <div className="flex-1 overflow-y-auto ide-scrollbar">
        {/* Staged Changes */}
        <div>
          <button
            className="flex items-center gap-1 px-2 py-1.5 w-full hover:bg-secondary/50 text-left"
            onClick={() => toggleSection('staged')}
          >
            {expandedSections.has('staged') ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider flex-1">
              Staged Changes
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-1.5 rounded">
              {stagedChanges.length}
            </span>
            {stagedChanges.length > 0 && (
              <button
                className="p-0.5 hover:bg-secondary rounded ml-1"
                onClick={(e) => { e.stopPropagation(); unstageAll(); }}
                title="Unstage All"
              >
                <Minus className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </button>
          
          {expandedSections.has('staged') && stagedChanges.length > 0 && (
            <div>
              {stagedChanges.map((change) => {
                const Icon = getFileIcon(change.fileName);
                const iconColor = getFileColor(change.fileName);
                
                return (
                  <div
                    key={change.id}
                    className="flex items-center gap-1 px-2 py-1 pl-6 hover:bg-secondary/50 group"
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', iconColor)} />
                    <span className="text-sm truncate flex-1">{change.fileName}</span>
                    <span className={cn('text-xs font-medium', statusColors[change.status])}>
                      {statusLabels[change.status]}
                    </span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        className="p-0.5 hover:bg-secondary rounded"
                        onClick={() => unstageFile(change.id)}
                        title="Unstage"
                      >
                        <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Unstaged Changes */}
        <div>
          <button
            className="flex items-center gap-1 px-2 py-1.5 w-full hover:bg-secondary/50 text-left"
            onClick={() => toggleSection('changes')}
          >
            {expandedSections.has('changes') ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider flex-1">
              Changes
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-1.5 rounded">
              {unstagedChanges.length}
            </span>
            {unstagedChanges.length > 0 && (
              <>
                <button
                  className="p-0.5 hover:bg-secondary rounded ml-1"
                  onClick={(e) => { e.stopPropagation(); setChanges(prev => prev.filter(c => c.staged)); }}
                  title="Discard All Changes"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  className="p-0.5 hover:bg-secondary rounded"
                  onClick={(e) => { e.stopPropagation(); stageAll(); }}
                  title="Stage All"
                >
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </>
            )}
          </button>
          
          {expandedSections.has('changes') && unstagedChanges.length > 0 && (
            <div>
              {unstagedChanges.map((change) => {
                const Icon = getFileIcon(change.fileName);
                const iconColor = getFileColor(change.fileName);
                
                return (
                  <div
                    key={change.id}
                    className="flex items-center gap-1 px-2 py-1 pl-6 hover:bg-secondary/50 group"
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', iconColor)} />
                    <span className="text-sm truncate flex-1">{change.fileName}</span>
                    <span className={cn('text-xs font-medium', statusColors[change.status])}>
                      {statusLabels[change.status]}
                    </span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        className="p-0.5 hover:bg-secondary rounded"
                        onClick={() => discardChange(change.id)}
                        title="Discard Changes"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        className="p-0.5 hover:bg-secondary rounded"
                        onClick={() => stageFile(change.id)}
                        title="Stage"
                      >
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {stagedChanges.length === 0 && unstagedChanges.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            <GitCommit className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No changes</p>
            <p className="text-xs mt-1 opacity-70">Your working tree is clean</p>
          </div>
        )}
      </div>
    </div>
  );
}
