import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, ChevronRight, ChevronDown, Trash2, Circle, 
  Filter, Search, AlertCircle, Info, AlertTriangle,
  Database, Cookie, HardDrive, Wifi, WifiOff, Copy
} from 'lucide-react';

type DevToolsTab = 'elements' | 'console' | 'network' | 'sources' | 'application';

export interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: Date;
  stack?: string;
}

export interface NetworkRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
  url: string;
  status: number;
  statusText: string;
  type: 'document' | 'script' | 'stylesheet' | 'xhr' | 'fetch' | 'image' | 'font' | 'other';
  size: string;
  time: string;
  timestamp: Date;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  response?: string;
}

interface DOMNode {
  id: string;
  tag: string;
  attributes: Record<string, string>;
  children?: DOMNode[];
  textContent?: string;
  isExpanded?: boolean;
}

interface StorageItem {
  key: string;
  value: string;
}

interface DevToolsProps {
  onClose: () => void;
  logs: ConsoleLog[];
  onClearLogs: () => void;
  onAddLog: (type: ConsoleLog['type'], message: string) => void;
  url: string;
}

// Mock DOM structure
const mockDOM: DOMNode = {
  id: '1',
  tag: 'html',
  attributes: { lang: 'en' },
  isExpanded: true,
  children: [
    {
      id: '2',
      tag: 'head',
      attributes: {},
      children: [
        { id: '3', tag: 'meta', attributes: { charset: 'UTF-8' } },
        { id: '4', tag: 'title', attributes: {}, textContent: 'Document' },
        { id: '5', tag: 'link', attributes: { rel: 'stylesheet', href: 'styles.css' } },
      ]
    },
    {
      id: '6',
      tag: 'body',
      attributes: { class: 'min-h-screen bg-background' },
      isExpanded: true,
      children: [
        {
          id: '7',
          tag: 'div',
          attributes: { id: 'root', class: 'container mx-auto' },
          isExpanded: true,
          children: [
            {
              id: '8',
              tag: 'header',
              attributes: { class: 'flex items-center p-4' },
              children: [
                { id: '9', tag: 'h1', attributes: { class: 'text-2xl font-bold' }, textContent: 'Welcome' },
              ]
            },
            {
              id: '10',
              tag: 'main',
              attributes: { class: 'flex-1 p-4' },
              children: [
                { id: '11', tag: 'p', attributes: {}, textContent: 'Hello, World!' },
                { id: '12', tag: 'button', attributes: { class: 'btn btn-primary', onclick: 'handleClick()' }, textContent: 'Click me' },
              ]
            },
          ]
        },
        { id: '13', tag: 'script', attributes: { src: 'app.js', type: 'module' } },
      ]
    }
  ]
};

// Mock network requests
const mockNetworkRequests: NetworkRequest[] = [
  { id: '1', method: 'GET', url: 'https://example.com/', status: 200, statusText: 'OK', type: 'document', size: '4.2 KB', time: '245ms', timestamp: new Date(Date.now() - 5000) },
  { id: '2', method: 'GET', url: 'https://example.com/styles.css', status: 200, statusText: 'OK', type: 'stylesheet', size: '12.8 KB', time: '89ms', timestamp: new Date(Date.now() - 4500) },
  { id: '3', method: 'GET', url: 'https://example.com/app.js', status: 200, statusText: 'OK', type: 'script', size: '156 KB', time: '312ms', timestamp: new Date(Date.now() - 4000) },
  { id: '4', method: 'GET', url: 'https://api.example.com/data', status: 200, statusText: 'OK', type: 'fetch', size: '2.1 KB', time: '423ms', timestamp: new Date(Date.now() - 3000) },
  { id: '5', method: 'POST', url: 'https://api.example.com/analytics', status: 204, statusText: 'No Content', type: 'xhr', size: '0 B', time: '156ms', timestamp: new Date(Date.now() - 2000) },
  { id: '6', method: 'GET', url: 'https://example.com/logo.png', status: 200, statusText: 'OK', type: 'image', size: '24.5 KB', time: '178ms', timestamp: new Date(Date.now() - 1500) },
];

// Mock source files
const mockSources = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="app.js" type="module"></script>
</body>
</html>`,
  'styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  background: #0a0a0a;
  color: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}`,
  'app.js': `import { createApp } from './framework.js';

const app = createApp({
  data() {
    return {
      message: 'Hello, World!',
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count++;
      console.log('Clicked!', this.count);
    }
  }
});

app.mount('#root');`,
};

// Mock storage data
const mockLocalStorage: StorageItem[] = [
  { key: 'theme', value: 'dark' },
  { key: 'user_preferences', value: '{"fontSize":14,"tabSize":2}' },
  { key: 'auth_token', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
];

const mockSessionStorage: StorageItem[] = [
  { key: 'current_page', value: '/dashboard' },
  { key: 'temp_data', value: '{"id":123}' },
];

const mockCookies: StorageItem[] = [
  { key: 'session_id', value: 'abc123def456' },
  { key: '_ga', value: 'GA1.2.1234567890.1234567890' },
];

export function DevTools({ onClose, logs, onClearLogs, onAddLog, url }: DevToolsProps) {
  const [activeTab, setActiveTab] = useState<DevToolsTab>('console');
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleFilter, setConsoleFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('');
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>(mockNetworkRequests);
  const [selectedRequest, setSelectedRequest] = useState<NetworkRequest | null>(null);
  const [domTree, setDomTree] = useState<DOMNode>(mockDOM);
  const [selectedNode, setSelectedNode] = useState<DOMNode | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>('index.html');
  const [storageTab, setStorageTab] = useState<'local' | 'session' | 'cookies'>('local');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const tabs: { id: DevToolsTab; label: string }[] = [
    { id: 'elements', label: 'Elements' },
    { id: 'console', label: 'Console' },
    { id: 'network', label: 'Network' },
    { id: 'sources', label: 'Sources' },
    { id: 'application', label: 'Application' },
  ];

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    
    onAddLog('log', `> ${consoleInput}`);
    
    // Simulate evaluation
    try {
      if (consoleInput === 'clear()') {
        onClearLogs();
      } else if (consoleInput.startsWith('console.')) {
        const match = consoleInput.match(/console\.(log|warn|error|info)\((.*)\)/);
        if (match) {
          onAddLog(match[1] as ConsoleLog['type'], match[2].replace(/['"]/g, ''));
        }
      } else {
        onAddLog('log', `← ${eval(consoleInput)}`);
      }
    } catch (err) {
      onAddLog('error', `${err}`);
    }
    
    setConsoleInput('');
  };

  const getLogIcon = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      case 'warn': return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
      case 'info': return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      default: return <Circle className="w-2 h-2 text-muted-foreground shrink-0" />;
    }
  };

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-500/10';
      case 'warn': return 'text-yellow-400 bg-yellow-500/10';
      case 'info': return 'text-blue-400';
      default: return 'text-foreground';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-blue-400';
    if (status >= 400 && status < 500) return 'text-yellow-400';
    if (status >= 500) return 'text-red-400';
    return 'text-muted-foreground';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-yellow-400';
      case 'DELETE': return 'text-red-400';
      case 'PATCH': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  const toggleNode = (nodeId: string) => {
    const toggle = (node: DOMNode): DOMNode => {
      if (node.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return { ...node, children: node.children.map(toggle) };
      }
      return node;
    };
    setDomTree(toggle(domTree));
  };

  const renderDOMNode = (node: DOMNode, depth: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    
    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-1 py-0.5 px-1 cursor-pointer hover:bg-secondary/50 font-mono text-xs",
            isSelected && "bg-primary/20"
          )}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }} className="p-0.5">
              {node.isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span className="text-purple-400">&lt;{node.tag}</span>
          {Object.entries(node.attributes).map(([key, value]) => (
            <span key={key}>
              <span className="text-yellow-400"> {key}</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-green-400">"{value}"</span>
            </span>
          ))}
          {hasChildren || node.textContent ? (
            <span className="text-purple-400">&gt;</span>
          ) : (
            <span className="text-purple-400"> /&gt;</span>
          )}
          {node.textContent && (
            <span className="text-foreground ml-1">{node.textContent}</span>
          )}
          {!hasChildren && node.textContent && (
            <span className="text-purple-400">&lt;/{node.tag}&gt;</span>
          )}
        </div>
        {node.isExpanded && node.children?.map(child => renderDOMNode(child, depth + 1))}
        {node.isExpanded && hasChildren && (
          <div
            className="text-purple-400 font-mono text-xs py-0.5 px-1"
            style={{ paddingLeft: `${depth * 12 + 20}px` }}
          >
            &lt;/{node.tag}&gt;
          </div>
        )}
      </div>
    );
  };

  const filteredLogs = logs.filter(log => 
    !consoleFilter || log.message.toLowerCase().includes(consoleFilter.toLowerCase())
  );

  const filteredRequests = networkRequests.filter(req =>
    !networkFilter || req.url.toLowerCase().includes(networkFilter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-ide-bg border-t border-border">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border px-1">
        <div className="flex items-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {/* Elements Tab */}
        {activeTab === 'elements' && (
          <div className="h-full flex">
            <div className="flex-1 overflow-auto p-2">
              {renderDOMNode(domTree)}
            </div>
            {selectedNode && (
              <div className="w-64 border-l border-border p-2 overflow-auto">
                <div className="text-xs font-medium text-muted-foreground mb-2">Styles</div>
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-purple-400">element.style {'{'}</div>
                  <div className="pl-4 text-muted-foreground">/* no inline styles */</div>
                  <div className="text-purple-400">{'}'}</div>
                  {selectedNode.attributes.class && (
                    <>
                      <div className="mt-2 text-purple-400">.{selectedNode.attributes.class.split(' ')[0]} {'{'}</div>
                      <div className="pl-4">
                        <span className="text-blue-400">display</span>
                        <span className="text-muted-foreground">: </span>
                        <span className="text-green-400">flex</span>
                        <span className="text-muted-foreground">;</span>
                      </div>
                      <div className="text-purple-400">{'}'}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Console Tab */}
        {activeTab === 'console' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-2 py-1 border-b border-border">
              <div className="flex items-center gap-1 flex-1 bg-secondary rounded px-2">
                <Filter className="w-3 h-3 text-muted-foreground" />
                <input
                  type="text"
                  value={consoleFilter}
                  onChange={(e) => setConsoleFilter(e.target.value)}
                  placeholder="Filter..."
                  className="flex-1 bg-transparent text-xs py-1 focus:outline-none"
                />
              </div>
              <button onClick={onClearLogs} className="p-1 hover:bg-secondary rounded" title="Clear console">
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start gap-2 px-2 py-1 font-mono text-xs border-b border-border/50",
                    getLogColor(log.type)
                  )}
                >
                  {getLogIcon(log.type)}
                  <span className="flex-1 break-all whitespace-pre-wrap">{log.message}</span>
                  <span className="text-muted-foreground text-[10px] shrink-0">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
            <form onSubmit={handleConsoleSubmit} className="border-t border-border">
              <div className="flex items-center gap-2 px-2 py-1">
                <span className="text-blue-400 font-mono text-xs">&gt;</span>
                <input
                  type="text"
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  placeholder="Enter expression..."
                  className="flex-1 bg-transparent font-mono text-xs focus:outline-none"
                />
              </div>
            </form>
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 px-2 py-1 border-b border-border">
              <button
                onClick={() => setNetworkRequests([])}
                className="p-1 hover:bg-secondary rounded"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-1 flex-1 bg-secondary rounded px-2">
                <Search className="w-3 h-3 text-muted-foreground" />
                <input
                  type="text"
                  value={networkFilter}
                  onChange={(e) => setNetworkFilter(e.target.value)}
                  placeholder="Filter..."
                  className="flex-1 bg-transparent text-xs py-1 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wifi className="w-3.5 h-3.5 text-green-400" />
                <span>{filteredRequests.length} requests</span>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr className="text-left text-muted-foreground">
                      <th className="px-2 py-1 font-medium">Name</th>
                      <th className="px-2 py-1 font-medium w-16">Method</th>
                      <th className="px-2 py-1 font-medium w-16">Status</th>
                      <th className="px-2 py-1 font-medium w-20">Type</th>
                      <th className="px-2 py-1 font-medium w-16">Size</th>
                      <th className="px-2 py-1 font-medium w-16">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map(req => (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={cn(
                          "cursor-pointer hover:bg-secondary/50 border-b border-border/30",
                          selectedRequest?.id === req.id && "bg-primary/20"
                        )}
                      >
                        <td className="px-2 py-1 truncate max-w-[200px]" title={req.url}>
                          {req.url.split('/').pop() || req.url}
                        </td>
                        <td className={cn("px-2 py-1 font-mono", getMethodColor(req.method))}>
                          {req.method}
                        </td>
                        <td className={cn("px-2 py-1 font-mono", getStatusColor(req.status))}>
                          {req.status}
                        </td>
                        <td className="px-2 py-1 text-muted-foreground">{req.type}</td>
                        <td className="px-2 py-1 text-muted-foreground">{req.size}</td>
                        <td className="px-2 py-1 text-muted-foreground">{req.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedRequest && (
                <div className="w-72 border-l border-border overflow-auto">
                  <div className="p-2 border-b border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Request Details</span>
                      <button onClick={() => setSelectedRequest(null)} className="p-0.5 hover:bg-secondary rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2 space-y-2 text-xs">
                    <div>
                      <div className="text-muted-foreground mb-1">General</div>
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <div><span className="text-muted-foreground">URL: </span>{selectedRequest.url}</div>
                        <div><span className="text-muted-foreground">Method: </span><span className={getMethodColor(selectedRequest.method)}>{selectedRequest.method}</span></div>
                        <div><span className="text-muted-foreground">Status: </span><span className={getStatusColor(selectedRequest.status)}>{selectedRequest.status} {selectedRequest.statusText}</span></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Response Headers</div>
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <div><span className="text-blue-400">content-type: </span>text/html; charset=utf-8</div>
                        <div><span className="text-blue-400">cache-control: </span>max-age=3600</div>
                        <div><span className="text-blue-400">x-powered-by: </span>Express</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div className="h-full flex">
            <div className="w-48 border-r border-border overflow-auto p-2">
              <div className="text-xs text-muted-foreground mb-2">Files</div>
              {Object.keys(mockSources).map(file => (
                <button
                  key={file}
                  onClick={() => setSelectedSource(file)}
                  className={cn(
                    "w-full text-left px-2 py-1 text-xs rounded hover:bg-secondary",
                    selectedSource === file && "bg-primary/20 text-primary"
                  )}
                >
                  {file}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto">
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/30 border-b border-border">
                <span className="text-xs font-medium">{selectedSource}</span>
                <button className="p-1 hover:bg-secondary rounded" title="Copy">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <pre className="p-2 text-xs font-mono overflow-auto">
                {mockSources[selectedSource as keyof typeof mockSources]?.split('\n').map((line, i) => (
                  <div key={i} className="flex hover:bg-secondary/30">
                    <span className="w-8 text-right pr-3 text-muted-foreground select-none">{i + 1}</span>
                    <code className="flex-1">{line || ' '}</code>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}

        {/* Application Tab */}
        {activeTab === 'application' && (
          <div className="h-full flex">
            <div className="w-48 border-r border-border overflow-auto p-2">
              <div className="text-xs text-muted-foreground mb-2">Storage</div>
              <button
                onClick={() => setStorageTab('local')}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-secondary",
                  storageTab === 'local' && "bg-primary/20 text-primary"
                )}
              >
                <HardDrive className="w-3.5 h-3.5" />
                Local Storage
              </button>
              <button
                onClick={() => setStorageTab('session')}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-secondary",
                  storageTab === 'session' && "bg-primary/20 text-primary"
                )}
              >
                <Database className="w-3.5 h-3.5" />
                Session Storage
              </button>
              <button
                onClick={() => setStorageTab('cookies')}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-secondary",
                  storageTab === 'cookies' && "bg-primary/20 text-primary"
                )}
              >
                <Cookie className="w-3.5 h-3.5" />
                Cookies
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/30 border-b border-border">
                <span className="text-xs font-medium capitalize">{storageTab} Storage</span>
                <button className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-secondary">
                  Clear All
                </button>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-secondary/30">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-1.5 font-medium">Key</th>
                    <th className="px-3 py-1.5 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {(storageTab === 'local' ? mockLocalStorage : storageTab === 'session' ? mockSessionStorage : mockCookies).map(item => (
                    <tr key={item.key} className="border-b border-border/30 hover:bg-secondary/30">
                      <td className="px-3 py-1.5 font-mono text-blue-400">{item.key}</td>
                      <td className="px-3 py-1.5 font-mono truncate max-w-[300px]" title={item.value}>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
