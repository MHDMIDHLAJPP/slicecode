export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface EditorTab {
  id: string;
  name: string;
  language: string;
  content: string;
  isDirty: boolean;
}

export type BottomPanelTab = 'terminal' | 'run' | 'preview' | 'debug';

export type ActivityItem = 'explorer' | 'search' | 'source-control' | 'run' | 'terminal' | 'extensions' | 'settings';

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp?: Date;
}

export interface DebugState {
  isRunning: boolean;
  isPaused: boolean;
  currentLine?: number;
}

export interface ConnectionState {
  status: 'connected' | 'disconnected' | 'connecting';
  url?: string;
}
