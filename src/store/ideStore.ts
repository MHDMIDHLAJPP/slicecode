import { create } from 'zustand';
import type { FileNode, EditorTab, BottomPanelTab, ActivityItem, TerminalLine, ConnectionState, DebugState } from '@/types/ide';

// Helper function to sort files (folders first, then alphabetically)
const sortFiles = (files: FileNode[]): FileNode[] => {
  return [...files].sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  }).map(file => ({
    ...file,
    children: file.children ? sortFiles(file.children) : undefined
  }));
};

// Helper to generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to get language from filename
const getLanguageFromName = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    'c': 'c', 'cpp': 'cpp', 'h': 'c', 'java': 'java', 'js': 'javascript',
    'mjs': 'javascript', 'cjs': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
    'py': 'python', 'rb': 'ruby', 'go': 'go', 'rs': 'rust', 'php': 'php',
    'swift': 'swift', 'kt': 'kotlin', 'dart': 'dart', 'cs': 'csharp', 'scala': 'scala',
    'html': 'html', 'htm': 'html', 'css': 'css', 'scss': 'scss', 'sass': 'sass',
    'less': 'less', 'jsx': 'javascript', 'vue': 'vue', 'svelte': 'svelte',
    'json': 'json', 'yaml': 'yaml', 'yml': 'yaml', 'xml': 'xml', 'toml': 'toml',
    'md': 'markdown', 'txt': 'plaintext', 'csv': 'plaintext', 'log': 'plaintext',
    'sh': 'shell', 'bash': 'shell', 'zsh': 'shell', 'ps1': 'powershell',
  };
  return langMap[ext || ''] || 'plaintext';
};

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

  // File operations
  createFile: (parentId: string | null, name: string) => void;
  createFolder: (parentId: string | null, name: string) => void;
  renameNode: (nodeId: string, newName: string) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, targetParentId: string | null) => void;
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

  // File operations
  createFile: (parentId, name) =>
    set((state) => {
      const newFile: FileNode = {
        id: generateId(),
        name,
        type: 'file',
        content: '',
        language: getLanguageFromName(name),
      };

      if (!parentId) {
        return { files: sortFiles([...state.files, newFile]) };
      }

      const addToParent = (nodes: FileNode[]): FileNode[] =>
        nodes.map((node) => {
          if (node.id === parentId && node.type === 'folder') {
            return {
              ...node,
              children: sortFiles([...(node.children || []), newFile]),
            };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });

      return { 
        files: sortFiles(addToParent(state.files)),
        expandedFolders: new Set([...state.expandedFolders, parentId])
      };
    }),

  createFolder: (parentId, name) =>
    set((state) => {
      const newFolder: FileNode = {
        id: generateId(),
        name,
        type: 'folder',
        children: [],
      };

      if (!parentId) {
        return { files: sortFiles([...state.files, newFolder]) };
      }

      const addToParent = (nodes: FileNode[]): FileNode[] =>
        nodes.map((node) => {
          if (node.id === parentId && node.type === 'folder') {
            return {
              ...node,
              children: sortFiles([...(node.children || []), newFolder]),
            };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });

      return { 
        files: sortFiles(addToParent(state.files)),
        expandedFolders: new Set([...state.expandedFolders, parentId])
      };
    }),

  renameNode: (nodeId, newName) =>
    set((state) => {
      const renameInTree = (nodes: FileNode[]): FileNode[] =>
        sortFiles(nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              name: newName,
              language: node.type === 'file' ? getLanguageFromName(newName) : node.language,
            };
          }
          if (node.children) {
            return { ...node, children: renameInTree(node.children) };
          }
          return node;
        }));

      // Also update open tabs
      const updatedTabs = state.openTabs.map((tab) =>
        tab.id === nodeId ? { ...tab, name: newName, language: getLanguageFromName(newName) } : tab
      );

      return { files: renameInTree(state.files), openTabs: updatedTabs };
    }),

  deleteNode: (nodeId) =>
    set((state) => {
      const deleteFromTree = (nodes: FileNode[]): FileNode[] =>
        nodes
          .filter((node) => node.id !== nodeId)
          .map((node) => ({
            ...node,
            children: node.children ? deleteFromTree(node.children) : undefined,
          }));

      // Close tab if open
      const newTabs = state.openTabs.filter((tab) => tab.id !== nodeId);
      let newActiveId = state.activeTabId;
      if (state.activeTabId === nodeId) {
        newActiveId = newTabs.length > 0 ? newTabs[0].id : null;
      }

      return {
        files: deleteFromTree(state.files),
        openTabs: newTabs,
        activeTabId: newActiveId,
      };
    }),

  moveNode: (nodeId, targetParentId) =>
    set((state) => {
      let movedNode: FileNode | null = null;

      // Find and remove node from original location
      const removeFromTree = (nodes: FileNode[]): FileNode[] =>
        nodes
          .filter((node) => {
            if (node.id === nodeId) {
              movedNode = node;
              return false;
            }
            return true;
          })
          .map((node) => ({
            ...node,
            children: node.children ? removeFromTree(node.children) : undefined,
          }));

      let newFiles = removeFromTree(state.files);

      if (!movedNode) return state;

      // Add to new location
      if (!targetParentId) {
        newFiles = sortFiles([...newFiles, movedNode]);
      } else {
        const addToParent = (nodes: FileNode[]): FileNode[] =>
          nodes.map((node) => {
            if (node.id === targetParentId && node.type === 'folder') {
              return {
                ...node,
                children: sortFiles([...(node.children || []), movedNode!]),
              };
            }
            if (node.children) {
              return { ...node, children: addToParent(node.children) };
            }
            return node;
          });
        newFiles = sortFiles(addToParent(newFiles));
      }

      return { 
        files: newFiles,
        expandedFolders: targetParentId 
          ? new Set([...state.expandedFolders, targetParentId])
          : state.expandedFolders
      };
    }),
}));
