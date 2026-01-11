import { useState, useCallback } from 'react';
import { Search, Replace, ChevronDown, ChevronRight, File, X, RefreshCw, MoreHorizontal, CaseSensitive, Regex, WholeWord } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import { getFileIcon, getFileColor } from '@/lib/fileIcons';
import type { FileNode } from '@/types/ide';

interface SearchResult {
  fileId: string;
  fileName: string;
  line: number;
  column: number;
  preview: string;
  matchStart: number;
  matchEnd: number;
}

function searchInFiles(files: FileNode[], query: string, options: { caseSensitive: boolean; wholeWord: boolean; regex: boolean }): SearchResult[] {
  const results: SearchResult[] = [];
  
  const searchNode = (node: FileNode) => {
    if (node.type === 'file' && node.content) {
      const lines = node.content.split('\n');
      let searchQuery = query;
      
      lines.forEach((line, index) => {
        let searchLine = line;
        let searchTerm = searchQuery;
        
        if (!options.caseSensitive) {
          searchLine = line.toLowerCase();
          searchTerm = query.toLowerCase();
        }
        
        if (options.regex) {
          try {
            const regex = new RegExp(searchQuery, options.caseSensitive ? 'g' : 'gi');
            let match;
            while ((match = regex.exec(line)) !== null) {
              results.push({
                fileId: node.id,
                fileName: node.name,
                line: index + 1,
                column: match.index + 1,
                preview: line.trim(),
                matchStart: match.index,
                matchEnd: match.index + match[0].length,
              });
            }
          } catch {
            // Invalid regex
          }
        } else if (options.wholeWord) {
          const wordRegex = new RegExp(`\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, options.caseSensitive ? 'g' : 'gi');
          let match;
          while ((match = wordRegex.exec(line)) !== null) {
            results.push({
              fileId: node.id,
              fileName: node.name,
              line: index + 1,
              column: match.index + 1,
              preview: line.trim(),
              matchStart: match.index,
              matchEnd: match.index + match[0].length,
            });
          }
        } else {
          let idx = searchLine.indexOf(searchTerm);
          while (idx !== -1) {
            results.push({
              fileId: node.id,
              fileName: node.name,
              line: index + 1,
              column: idx + 1,
              preview: line.trim(),
              matchStart: idx,
              matchEnd: idx + query.length,
            });
            idx = searchLine.indexOf(searchTerm, idx + 1);
          }
        }
      });
    }
    
    if (node.children) {
      node.children.forEach(searchNode);
    }
  };
  
  files.forEach(searchNode);
  return results;
}

export function SearchPanel() {
  const { files, selectFile, sidebarWidth } = useIDEStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regex, setRegex] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    const searchResults = searchInFiles(files, searchQuery, { caseSensitive, wholeWord, regex });
    setResults(searchResults);
    
    // Auto-expand files with results
    const filesWithResults = new Set(searchResults.map(r => r.fileId));
    setExpandedFiles(filesWithResults);
    setIsSearching(false);
  }, [files, searchQuery, caseSensitive, wholeWord, regex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.fileId]) {
      acc[result.fileId] = { fileName: result.fileName, results: [] };
    }
    acc[result.fileId].results.push(result);
    return acc;
  }, {} as Record<string, { fileName: string; results: SearchResult[] }>);

  const toggleFileExpand = (fileId: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const handleResultClick = (result: SearchResult) => {
    // Find the file node and select it
    const findNode = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === result.fileId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const fileNode = findNode(files);
    if (fileNode) {
      selectFile(fileNode);
    }
  };

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Search</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded" title="Refresh" onClick={handleSearch}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="Clear" onClick={() => { setSearchQuery(''); setResults([]); }}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search inputs */}
      <div className="p-2 space-y-2 border-b border-border">
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-secondary rounded shrink-0"
            onClick={() => setShowReplace(!showReplace)}
          >
            {showReplace ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="w-full bg-background border border-border rounded pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-0.5">
            <button
              className={cn(
                'p-1 rounded hover:bg-secondary',
                caseSensitive && 'bg-secondary text-primary'
              )}
              onClick={() => setCaseSensitive(!caseSensitive)}
              title="Match Case"
            >
              <CaseSensitive className="w-4 h-4" />
            </button>
            <button
              className={cn(
                'p-1 rounded hover:bg-secondary',
                wholeWord && 'bg-secondary text-primary'
              )}
              onClick={() => setWholeWord(!wholeWord)}
              title="Match Whole Word"
            >
              <WholeWord className="w-4 h-4" />
            </button>
            <button
              className={cn(
                'p-1 rounded hover:bg-secondary',
                regex && 'bg-secondary text-primary'
              )}
              onClick={() => setRegex(!regex)}
              title="Use Regular Expression"
            >
              <Regex className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showReplace && (
          <div className="flex items-center gap-1 pl-6">
            <div className="flex-1 relative">
              <Replace className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Replace"
                className="w-full bg-background border border-border rounded pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="p-1 hover:bg-secondary rounded text-muted-foreground" title="Replace">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto ide-scrollbar">
        {isSearching && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Searching...
          </div>
        )}

        {!isSearching && searchQuery && results.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No results found
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div className="py-1">
            <div className="px-3 py-1 text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? 's' : ''} in {Object.keys(groupedResults).length} file{Object.keys(groupedResults).length !== 1 ? 's' : ''}
            </div>
            
            {Object.entries(groupedResults).map(([fileId, { fileName, results: fileResults }]) => {
              const Icon = getFileIcon(fileName);
              const iconColor = getFileColor(fileName);
              const isExpanded = expandedFiles.has(fileId);
              
              return (
                <div key={fileId}>
                  <button
                    className="flex items-center gap-1 px-2 py-1 w-full hover:bg-secondary/50 text-left"
                    onClick={() => toggleFileExpand(fileId)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <Icon className={cn('w-4 h-4 shrink-0', iconColor)} />
                    <span className="text-sm truncate flex-1">{fileName}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-1.5 rounded">
                      {fileResults.length}
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="pl-6">
                      {fileResults.map((result, idx) => (
                        <button
                          key={`${result.line}-${result.column}-${idx}`}
                          className="flex items-center gap-2 px-2 py-1 w-full hover:bg-secondary/50 text-left"
                          onClick={() => handleResultClick(result)}
                        >
                          <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
                            {result.line}
                          </span>
                          <span className="text-sm truncate">
                            {result.preview}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!searchQuery && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Search across files</p>
            <p className="text-xs mt-1 opacity-70">Enter a search term and press Enter</p>
          </div>
        )}
      </div>
    </div>
  );
}
