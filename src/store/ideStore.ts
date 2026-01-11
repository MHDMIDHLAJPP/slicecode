import { create } from 'zustand';
import type { FileNode, EditorTab, BottomPanelTab, ActivityItem, TerminalLine, ConnectionState, DebugState } from '@/types/ide';

interface IDEState {
  // Sidebar
  activeActivity: ActivityItem;
  sidebarVisible: boolean;
  sidebarWidth: number;

  // Files
  files: FileNode[];
  expandedFolders: Set<string>;

  // Editor
  openTabs: EditorTab[];
  activeTabId: string | null;

  // Bottom Panel
  bottomPanelVisible: boolean;
  bottomPanelHeight: number;
  activeBottomPanel: BottomPanelTab;

  // Terminal
  terminalLines: TerminalLine[];
  terminalConnection: ConnectionState;

  // Run
  selectedLanguage: string;
  stdinInput: string;
  runOutput: string;
  isRunning: boolean;

  // Debug
  debugState: DebugState;
  debugOutput: TerminalLine[];

  // File creation state
  creatingItem: { parentId: string | null; type: 'file' | 'folder' } | null;
  renamingItemId: string | null;

  // Actions
  setActiveActivity: (activity: ActivityItem) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;

  toggleFolder: (folderId: string) => void;
  selectFile: (file: FileNode) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;

  setBottomPanelVisible: (visible: boolean) => void;
  setBottomPanelHeight: (height: number) => void;
  setActiveBottomPanel: (panel: BottomPanelTab) => void;

  addTerminalLine: (line: Omit<TerminalLine, 'id'>) => void;
  clearTerminal: () => void;
  setTerminalConnection: (state: ConnectionState) => void;

  setSelectedLanguage: (lang: string) => void;
  setStdinInput: (input: string) => void;
  runCode: () => void;

  startDebug: () => void;
  pauseDebug: () => void;
  continueDebug: () => void;
  stopDebug: () => void;

  // File management
  startCreatingFile: (parentId: string | null) => void;
  startCreatingFolder: (parentId: string | null) => void;
  cancelCreating: () => void;
  confirmCreate: (name: string) => void;
  startRenaming: (itemId: string) => void;
  cancelRenaming: () => void;
  confirmRename: (newName: string) => void;
  deleteItem: (itemId: string) => void;
  moveItem: (itemId: string, newParentId: string | null) => void;
}

const initialFiles: FileNode[] = [
  {
    id: '1',
    name: 'main.c',
    type: 'file',
    language: 'c',
    content: `#include <stdio.h>
#include <stdlib.h> // for exit()

int main(int argc, char *argv[])
{
    FILE *f1, *f2;
    char ch, prev = ' ';
    int nol = 0, now = 0, noc = 0;

    if (argc < 3)
    {
        printf("Insufficient arguments.\\nUsage: program <source_file> <target_file>\\n");
        return 1;
    }

    f1 = fopen(argv[1], "r");
    if (f1 == NULL)
    {
        printf("Cannot open source file.\\n");
        return 1;
    }

    f2 = fopen(argv[2], "w");
    if (f2 == NULL)
    {
        printf("Cannot open target file.\\n");
        fclose(f1);
        return 1;
    }

    while ((ch = fgetc(f1)) != EOF)
    {
        fputc(ch, f2);
        noc++;
        if (ch == '\\n') nol++;
        if (ch == ' ' || ch == '\\n')
        {
            if (prev != ' ' && prev != '\\n') now++;
        }
        prev = ch;
    }

    printf("Lines: %d, Words: %d, Characters: %d\\n", nol, now, noc);

    fclose(f1);
    fclose(f2);
    return 0;
}`,
  },
  {
    id: '2',
    name: 'input.txt',
    type: 'file',
    language: 'plaintext',
    content: 'Hello World\nThis is a test file.\nLine 3 content here.',
  },
  {
    id: '3',
    name: 'output.txt',
    type: 'file',
    language: 'plaintext',
    content: '',
  },
  {
    id: '4',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '5',
        name: 'utils.c',
        type: 'file',
        language: 'c',
        content: '// Utility functions\n',
      },
      {
        id: '6',
        name: 'helpers.h',
        type: 'file',
        language: 'c',
        content: '#ifndef HELPERS_H\n#define HELPERS_H\n\n#endif',
      },
    ],
  },
];

const initialTab: EditorTab = {
  id: '1',
  name: 'main.c',
  language: 'c',
  content: initialFiles[0].content || '',
  isDirty: false,
};

export const useIDEStore = create<IDEState>((set, get) => ({
  // Initial state
  activeActivity: 'explorer',
  sidebarVisible: true,
  sidebarWidth: 240,

  files: initialFiles,
  expandedFolders: new Set(['4']),

  openTabs: [initialTab],
  activeTabId: '1',

  bottomPanelVisible: true,
  bottomPanelHeight: 250,
  activeBottomPanel: 'terminal',

  terminalLines: [
    { id: '1', type: 'system', content: 'Session initialized.' },
    { id: '2', type: 'input', content: '733b065b> clear' },
  ],
  terminalConnection: { status: 'connected', url: 'ws://10.147.82.1:4545' },

  selectedLanguage: 'c',
  stdinInput: '',
  runOutput: 'No result yet. Click Run to execute.',
  isRunning: false,

  debugState: { isRunning: false, isPaused: false },
  debugOutput: [],

  creatingItem: null,
  renamingItemId: null,

  // Actions
  setActiveActivity: (activity) => set({ activeActivity: activity }),
  toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),

  toggleFolder: (folderId) =>
    set((state) => {
      const newExpanded = new Set(state.expandedFolders);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return { expandedFolders: newExpanded };
    }),

  selectFile: (file) => {
    if (file.type === 'folder') {
      get().toggleFolder(file.id);
      return;
    }

    const { openTabs } = get();
    const existingTab = openTabs.find((tab) => tab.id === file.id);

    if (existingTab) {
      set({ activeTabId: file.id });
    } else {
      const newTab: EditorTab = {
        id: file.id,
        name: file.name,
        language: file.language || 'plaintext',
        content: file.content || '',
        isDirty: false,
      };
      set({
        openTabs: [...openTabs, newTab],
        activeTabId: file.id,
      });
    }
  },

  closeTab: (tabId) =>
    set((state) => {
      const newTabs = state.openTabs.filter((tab) => tab.id !== tabId);
      let newActiveId = state.activeTabId;

      if (state.activeTabId === tabId) {
        const closedIndex = state.openTabs.findIndex((tab) => tab.id === tabId);
        if (newTabs.length > 0) {
          newActiveId = newTabs[Math.min(closedIndex, newTabs.length - 1)].id;
        } else {
          newActiveId = null;
        }
      }

      return { openTabs: newTabs, activeTabId: newActiveId };
    }),

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  updateTabContent: (tabId, content) =>
    set((state) => ({
      openTabs: state.openTabs.map((tab) =>
        tab.id === tabId ? { ...tab, content, isDirty: true } : tab
      ),
    })),

  setBottomPanelVisible: (visible) => set({ bottomPanelVisible: visible }),
  setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
  setActiveBottomPanel: (panel) => set({ activeBottomPanel: panel }),

  addTerminalLine: (line) =>
    set((state) => ({
      terminalLines: [
        ...state.terminalLines,
        { ...line, id: Date.now().toString() },
      ],
    })),

  clearTerminal: () => set({ terminalLines: [] }),

  setTerminalConnection: (connection) => set({ terminalConnection: connection }),

  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
  setStdinInput: (input) => set({ stdinInput: input }),

  runCode: () => {
    set({ isRunning: true, runOutput: 'Running...' });
    setTimeout(() => {
      set({
        isRunning: false,
        runOutput: 'Lines: 3, Words: 9, Characters: 52\n\nProcess exited with code 0.',
      });
    }, 1500);
  },

  startDebug: () =>
    set({
      debugState: { isRunning: true, isPaused: false },
      activeBottomPanel: 'debug',
    }),

  pauseDebug: () =>
    set((state) => ({
      debugState: { ...state.debugState, isPaused: true },
    })),

  continueDebug: () =>
    set((state) => ({
      debugState: { ...state.debugState, isPaused: false },
    })),

  stopDebug: () =>
    set({
      debugState: { isRunning: false, isPaused: false },
    }),

  // File management actions
  startCreatingFile: (parentId) => {
    if (parentId) {
      const newExpanded = new Set(get().expandedFolders);
      newExpanded.add(parentId);
      set({ expandedFolders: newExpanded });
    }
    set({ creatingItem: { parentId, type: 'file' }, renamingItemId: null });
  },

  startCreatingFolder: (parentId) => {
    if (parentId) {
      const newExpanded = new Set(get().expandedFolders);
      newExpanded.add(parentId);
      set({ expandedFolders: newExpanded });
    }
    set({ creatingItem: { parentId, type: 'folder' }, renamingItemId: null });
  },

  cancelCreating: () => set({ creatingItem: null }),

  confirmCreate: (name) => {
    const { creatingItem, files } = get();
    if (!creatingItem || !name.trim()) {
      set({ creatingItem: null });
      return;
    }

    const newId = Date.now().toString();
    const newItem: FileNode = creatingItem.type === 'folder'
      ? { id: newId, name: name.trim(), type: 'folder', children: [] }
      : { id: newId, name: name.trim(), type: 'file', content: '', language: getLanguageFromName(name) };

    const addToParent = (nodes: FileNode[], parentId: string | null): FileNode[] => {
      if (parentId === null) {
        return [...nodes, newItem];
      }
      return nodes.map(node => {
        if (node.id === parentId && node.type === 'folder') {
          return { ...node, children: [...(node.children || []), newItem] };
        }
        if (node.children) {
          return { ...node, children: addToParent(node.children, parentId) };
        }
        return node;
      });
    };

    set({ 
      files: addToParent(files, creatingItem.parentId), 
      creatingItem: null 
    });
  },

  startRenaming: (itemId) => set({ renamingItemId: itemId, creatingItem: null }),

  cancelRenaming: () => set({ renamingItemId: null }),

  confirmRename: (newName) => {
    const { renamingItemId, files, openTabs } = get();
    if (!renamingItemId || !newName.trim()) {
      set({ renamingItemId: null });
      return;
    }

    const renameInTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === renamingItemId) {
          return { ...node, name: newName.trim(), language: getLanguageFromName(newName) };
        }
        if (node.children) {
          return { ...node, children: renameInTree(node.children) };
        }
        return node;
      });
    };

    const updatedTabs = openTabs.map(tab => 
      tab.id === renamingItemId ? { ...tab, name: newName.trim() } : tab
    );

    set({ 
      files: renameInTree(files), 
      openTabs: updatedTabs,
      renamingItemId: null 
    });
  },

  deleteItem: (itemId) => {
    const { files, openTabs, activeTabId } = get();

    const deleteFromTree = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter(node => node.id !== itemId)
        .map(node => {
          if (node.children) {
            return { ...node, children: deleteFromTree(node.children) };
          }
          return node;
        });
    };

    const newTabs = openTabs.filter(tab => tab.id !== itemId);
    let newActiveId = activeTabId;
    if (activeTabId === itemId) {
      newActiveId = newTabs.length > 0 ? newTabs[0].id : null;
    }

    set({ 
      files: deleteFromTree(files), 
      openTabs: newTabs,
      activeTabId: newActiveId
    });
  },

  moveItem: (itemId, newParentId) => {
    const { files } = get();
    
    let movedItem: FileNode | null = null;
    
    const removeFromTree = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter(node => {
          if (node.id === itemId) {
            movedItem = node;
            return false;
          }
          return true;
        })
        .map(node => {
          if (node.children) {
            return { ...node, children: removeFromTree(node.children) };
          }
          return node;
        });
    };

    let filesWithoutItem = removeFromTree(files);
    
    if (!movedItem) return;

    const addToParent = (nodes: FileNode[], parentId: string | null): FileNode[] => {
      if (parentId === null) {
        return [...nodes, movedItem!];
      }
      return nodes.map(node => {
        if (node.id === parentId && node.type === 'folder') {
          return { ...node, children: [...(node.children || []), movedItem!] };
        }
        if (node.children) {
          return { ...node, children: addToParent(node.children, parentId) };
        }
        return node;
      });
    };

    set({ files: addToParent(filesWithoutItem, newParentId) });
  },
}));

// Helper function to determine language from filename
function getLanguageFromName(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
    js: 'javascript', mjs: 'javascript', cjs: 'javascript',
    ts: 'typescript', tsx: 'typescript', jsx: 'javascript',
    py: 'python', rb: 'ruby', go: 'go', rs: 'rust',
    java: 'java', kt: 'kotlin', swift: 'swift',
    html: 'html', css: 'css', scss: 'scss',
    json: 'json', yaml: 'yaml', yml: 'yaml',
    md: 'markdown', txt: 'plaintext',
    sh: 'shell', bash: 'shell',
  };
  return langMap[ext || ''] || 'plaintext';
}
