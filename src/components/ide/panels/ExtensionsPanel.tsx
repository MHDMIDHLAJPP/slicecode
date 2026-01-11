import { useState } from 'react';
import { Puzzle, Search, Download, Check, Star, Settings, RefreshCw, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';

interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  version: string;
  downloads: number;
  rating: number;
  installed: boolean;
  enabled: boolean;
  icon?: string;
  category: string;
}

const mockExtensions: Extension[] = [
  {
    id: '1',
    name: 'C/C++',
    publisher: 'Microsoft',
    description: 'C/C++ IntelliSense, debugging, and code browsing.',
    version: '1.18.5',
    downloads: 45000000,
    rating: 4.5,
    installed: true,
    enabled: true,
    category: 'Programming Languages',
  },
  {
    id: '2',
    name: 'Python',
    publisher: 'Microsoft',
    description: 'IntelliSense, linting, debugging, formatting, and more.',
    version: '2024.0.1',
    downloads: 98000000,
    rating: 4.7,
    installed: true,
    enabled: true,
    category: 'Programming Languages',
  },
  {
    id: '3',
    name: 'ESLint',
    publisher: 'Microsoft',
    description: 'Integrates ESLint JavaScript into VS Code.',
    version: '2.4.4',
    downloads: 32000000,
    rating: 4.4,
    installed: false,
    enabled: false,
    category: 'Linters',
  },
  {
    id: '4',
    name: 'Prettier',
    publisher: 'Prettier',
    description: 'Code formatter using prettier',
    version: '10.1.0',
    downloads: 41000000,
    rating: 4.3,
    installed: true,
    enabled: false,
    category: 'Formatters',
  },
  {
    id: '5',
    name: 'GitLens',
    publisher: 'GitKraken',
    description: 'Supercharge Git within VS Code',
    version: '14.8.0',
    downloads: 28000000,
    rating: 4.6,
    installed: false,
    enabled: false,
    category: 'Source Control',
  },
];

const formatDownloads = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

export function ExtensionsPanel() {
  const { sidebarWidth } = useIDEStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [extensions, setExtensions] = useState<Extension[]>(mockExtensions);
  const [filter, setFilter] = useState<'all' | 'installed' | 'enabled'>('all');

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'installed') return ext.installed;
    if (filter === 'enabled') return ext.enabled;
    return true;
  });

  const installedCount = extensions.filter(e => e.installed).length;
  const enabledCount = extensions.filter(e => e.enabled).length;

  const toggleInstall = (id: string) => {
    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, installed: !ext.installed, enabled: !ext.installed } : ext
    ));
  };

  const toggleEnable = (id: string) => {
    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
    ));
  };

  return (
    <div 
      className="h-full bg-ide-sidebar border-r border-border flex flex-col shrink-0 overflow-hidden"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
        <span className="font-semibold">Extensions</span>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded" title="More Actions">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Extensions in Marketplace"
            className="w-full bg-background border border-border rounded pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border text-xs">
        <button
          className={cn(
            'px-2 py-1 rounded transition-colors',
            filter === 'all' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('all')}
        >
          All ({extensions.length})
        </button>
        <button
          className={cn(
            'px-2 py-1 rounded transition-colors',
            filter === 'installed' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('installed')}
        >
          Installed ({installedCount})
        </button>
        <button
          className={cn(
            'px-2 py-1 rounded transition-colors',
            filter === 'enabled' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('enabled')}
        >
          Enabled ({enabledCount})
        </button>
      </div>

      {/* Extensions list */}
      <div className="flex-1 overflow-y-auto ide-scrollbar">
        {filteredExtensions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            <Puzzle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No extensions found</p>
            <p className="text-xs mt-1 opacity-70">Try a different search term</p>
          </div>
        ) : (
          filteredExtensions.map((ext) => (
            <div
              key={ext.id}
              className="flex gap-3 p-3 hover:bg-secondary/50 border-b border-border/50 group"
            >
              {/* Extension icon */}
              <div className={cn(
                "w-12 h-12 rounded flex items-center justify-center shrink-0",
                ext.installed ? "bg-primary/20" : "bg-secondary"
              )}>
                <Puzzle className={cn(
                  "w-6 h-6",
                  ext.installed ? "text-primary" : "text-muted-foreground"
                )} />
              </div>

              {/* Extension info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{ext.name}</span>
                  <span className="text-xs text-muted-foreground">{ext.version}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {ext.publisher}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {ext.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {formatDownloads(ext.downloads)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-status-warning" fill="currentColor" />
                    {ext.rating}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {ext.installed ? (
                  <>
                    <button
                      className={cn(
                        'px-2 py-1 rounded text-xs transition-colors',
                        ext.enabled 
                          ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                      onClick={() => toggleEnable(ext.id)}
                    >
                      {ext.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="p-1 hover:bg-destructive/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toggleInstall(ext.id)}
                      title="Uninstall"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </>
                ) : (
                  <button
                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors flex items-center gap-1"
                    onClick={() => toggleInstall(ext.id)}
                  >
                    <Download className="w-3 h-3" />
                    Install
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
