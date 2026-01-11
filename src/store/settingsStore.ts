import { create } from 'zustand';

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    muted: string;
    mutedForeground: string;
    border: string;
    ideBg: string;
    ideSidebar: string;
    ideActivityBar: string;
    ideEditor: string;
    idePanel: string;
    ideTabActive: string;
    syntaxKeyword: string;
    syntaxString: string;
    syntaxNumber: string;
    syntaxComment: string;
    syntaxFunction: string;
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'dark-navy',
    name: 'Dark Navy (Default)',
    colors: {
      background: '222 47% 7%',
      foreground: '213 31% 91%',
      primary: '217 91% 60%',
      secondary: '222 47% 14%',
      muted: '222 47% 12%',
      mutedForeground: '215 20% 55%',
      border: '222 47% 18%',
      ideBg: '222 47% 7%',
      ideSidebar: '222 47% 10%',
      ideActivityBar: '222 47% 8%',
      ideEditor: '222 47% 9%',
      idePanel: '222 47% 8%',
      ideTabActive: '222 47% 12%',
      syntaxKeyword: '210 100% 66%',
      syntaxString: '142 71% 55%',
      syntaxNumber: '32 95% 65%',
      syntaxComment: '215 20% 45%',
      syntaxFunction: '270 100% 75%',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai Pro',
    colors: {
      background: '70 8% 15%',
      foreground: '60 30% 96%',
      primary: '326 100% 74%',
      secondary: '70 8% 20%',
      muted: '70 8% 18%',
      mutedForeground: '60 10% 60%',
      border: '70 8% 22%',
      ideBg: '70 8% 15%',
      ideSidebar: '70 8% 17%',
      ideActivityBar: '70 8% 13%',
      ideEditor: '70 8% 16%',
      idePanel: '70 8% 13%',
      ideTabActive: '70 8% 20%',
      syntaxKeyword: '326 100% 74%',
      syntaxString: '80 76% 53%',
      syntaxNumber: '261 100% 75%',
      syntaxComment: '60 10% 45%',
      syntaxFunction: '190 81% 67%',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      background: '231 15% 18%',
      foreground: '60 30% 96%',
      primary: '265 89% 78%',
      secondary: '232 14% 24%',
      muted: '232 14% 22%',
      mutedForeground: '228 14% 60%',
      border: '232 14% 28%',
      ideBg: '231 15% 18%',
      ideSidebar: '232 14% 20%',
      ideActivityBar: '231 15% 16%',
      ideEditor: '232 14% 19%',
      idePanel: '231 15% 16%',
      ideTabActive: '232 14% 24%',
      syntaxKeyword: '326 100% 74%',
      syntaxString: '65 92% 76%',
      syntaxNumber: '265 89% 78%',
      syntaxComment: '225 27% 51%',
      syntaxFunction: '135 94% 65%',
    },
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    colors: {
      background: '215 28% 8%',
      foreground: '210 17% 82%',
      primary: '212 92% 45%',
      secondary: '215 28% 14%',
      muted: '215 28% 12%',
      mutedForeground: '215 15% 50%',
      border: '215 28% 18%',
      ideBg: '215 28% 8%',
      ideSidebar: '215 28% 10%',
      ideActivityBar: '215 28% 6%',
      ideEditor: '215 28% 9%',
      idePanel: '215 28% 6%',
      ideTabActive: '215 28% 14%',
      syntaxKeyword: '326 100% 74%',
      syntaxString: '150 60% 54%',
      syntaxNumber: '212 92% 65%',
      syntaxComment: '215 15% 45%',
      syntaxFunction: '273 75% 70%',
    },
  },
  {
    id: 'one-dark',
    name: 'One Dark Pro',
    colors: {
      background: '220 13% 18%',
      foreground: '219 14% 76%',
      primary: '207 82% 66%',
      secondary: '220 13% 23%',
      muted: '220 13% 21%',
      mutedForeground: '219 10% 50%',
      border: '220 13% 26%',
      ideBg: '220 13% 18%',
      ideSidebar: '220 13% 20%',
      ideActivityBar: '220 13% 16%',
      ideEditor: '220 13% 19%',
      idePanel: '220 13% 16%',
      ideTabActive: '220 13% 23%',
      syntaxKeyword: '286 60% 67%',
      syntaxString: '95 38% 62%',
      syntaxNumber: '29 54% 61%',
      syntaxComment: '219 10% 40%',
      syntaxFunction: '207 82% 66%',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    colors: {
      background: '220 16% 22%',
      foreground: '218 27% 92%',
      primary: '193 43% 67%',
      secondary: '220 16% 28%',
      muted: '220 16% 26%',
      mutedForeground: '219 20% 55%',
      border: '220 16% 30%',
      ideBg: '220 16% 22%',
      ideSidebar: '220 16% 24%',
      ideActivityBar: '220 16% 20%',
      ideEditor: '220 16% 23%',
      idePanel: '220 16% 20%',
      ideTabActive: '220 16% 28%',
      syntaxKeyword: '193 43% 67%',
      syntaxString: '92 28% 65%',
      syntaxNumber: '311 20% 63%',
      syntaxComment: '220 16% 44%',
      syntaxFunction: '179 25% 65%',
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    colors: {
      background: '192 100% 11%',
      foreground: '186 8% 55%',
      primary: '175 59% 40%',
      secondary: '192 81% 14%',
      muted: '192 90% 12%',
      mutedForeground: '186 8% 45%',
      border: '192 81% 18%',
      ideBg: '192 100% 11%',
      ideSidebar: '192 81% 13%',
      ideActivityBar: '192 100% 9%',
      ideEditor: '192 100% 12%',
      idePanel: '192 100% 9%',
      ideTabActive: '192 81% 16%',
      syntaxKeyword: '18 89% 55%',
      syntaxString: '175 59% 40%',
      syntaxNumber: '331 64% 52%',
      syntaxComment: '192 13% 45%',
      syntaxFunction: '68 100% 30%',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    colors: {
      background: '235 21% 13%',
      foreground: '231 27% 78%',
      primary: '224 78% 65%',
      secondary: '235 21% 18%',
      muted: '235 21% 16%',
      mutedForeground: '231 18% 50%',
      border: '235 21% 22%',
      ideBg: '235 21% 13%',
      ideSidebar: '235 21% 15%',
      ideActivityBar: '235 21% 11%',
      ideEditor: '235 21% 14%',
      idePanel: '235 21% 11%',
      ideTabActive: '235 21% 18%',
      syntaxKeyword: '267 84% 81%',
      syntaxString: '158 60% 52%',
      syntaxNumber: '28 92% 67%',
      syntaxComment: '231 18% 40%',
      syntaxFunction: '224 78% 65%',
    },
  },
];

export const fontStyles = [
  { id: 'jetbrains', name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { id: 'fira', name: 'Fira Code', value: "'Fira Code', monospace" },
  { id: 'consolas', name: 'Consolas', value: "'Consolas', monospace" },
  { id: 'cascadia', name: 'Cascadia Code', value: "'Cascadia Code', monospace" },
  { id: 'source-code', name: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  { id: 'ubuntu', name: 'Ubuntu Mono', value: "'Ubuntu Mono', monospace" },
  { id: 'roboto', name: 'Roboto Mono', value: "'Roboto Mono', monospace" },
  { id: 'inconsolata', name: 'Inconsolata', value: "'Inconsolata', monospace" },
];

export interface SettingsState {
  // Display
  displayScale: number;
  globalFontSize: number;
  globalFontStyle: string;

  // Editor
  editorFontSize: number;
  editorFontStyle: string;
  editorLineHeight: number;
  editorTabSize: number;
  editorWordWrap: boolean;
  editorMinimap: boolean;
  editorLineNumbers: boolean;

  // Terminal
  terminalFontSize: number;
  terminalFontStyle: string;
  terminalLineHeight: number;

  // Theme
  activeThemeId: string;

  // UI
  compactMode: boolean;
  animationsEnabled: boolean;
  showStatusBar: boolean;

  // History for undo
  previousSettings: Partial<SettingsState> | null;

  // Actions
  setDisplayScale: (scale: number) => void;
  setGlobalFontSize: (size: number) => void;
  setGlobalFontStyle: (style: string) => void;
  setEditorFontSize: (size: number) => void;
  setEditorFontStyle: (style: string) => void;
  setEditorLineHeight: (height: number) => void;
  setEditorTabSize: (size: number) => void;
  setEditorWordWrap: (wrap: boolean) => void;
  setEditorMinimap: (show: boolean) => void;
  setEditorLineNumbers: (show: boolean) => void;
  setTerminalFontSize: (size: number) => void;
  setTerminalFontStyle: (style: string) => void;
  setTerminalLineHeight: (height: number) => void;
  setActiveTheme: (themeId: string) => void;
  setCompactMode: (compact: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setShowStatusBar: (show: boolean) => void;
  resetToDefaults: () => void;
  undoLastChange: () => void;
}

const STORAGE_KEY = 'ide-settings';

const defaultSettings = {
  displayScale: 100,
  globalFontSize: 14,
  globalFontStyle: 'jetbrains',
  editorFontSize: 14,
  editorFontStyle: 'jetbrains',
  editorLineHeight: 1.6,
  editorTabSize: 4,
  editorWordWrap: false,
  editorMinimap: true,
  editorLineNumbers: true,
  terminalFontSize: 13,
  terminalFontStyle: 'jetbrains',
  terminalLineHeight: 1.5,
  activeThemeId: 'dark-navy',
  compactMode: false,
  animationsEnabled: true,
  showStatusBar: true,
  previousSettings: null,
};

const loadSettings = (): Partial<SettingsState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return {};
};

const saveSettings = (state: Partial<SettingsState>) => {
  try {
    const { previousSettings, ...toSave } = state as SettingsState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

const applyTheme = (themeId: string) => {
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--ide-bg', theme.colors.ideBg);
  root.style.setProperty('--ide-sidebar', theme.colors.ideSidebar);
  root.style.setProperty('--ide-activityBar', theme.colors.ideActivityBar);
  root.style.setProperty('--ide-editor', theme.colors.ideEditor);
  root.style.setProperty('--ide-panel', theme.colors.idePanel);
  root.style.setProperty('--ide-tab-active', theme.colors.ideTabActive);
  root.style.setProperty('--syntax-keyword', theme.colors.syntaxKeyword);
  root.style.setProperty('--syntax-string', theme.colors.syntaxString);
  root.style.setProperty('--syntax-number', theme.colors.syntaxNumber);
  root.style.setProperty('--syntax-comment', theme.colors.syntaxComment);
  root.style.setProperty('--syntax-function', theme.colors.syntaxFunction);
};

const applyDisplayScale = (scale: number) => {
  document.documentElement.style.fontSize = `${(scale / 100) * 16}px`;
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const loaded = loadSettings();
  const initial = { ...defaultSettings, ...loaded };

  // Apply theme and scale on load
  setTimeout(() => {
    applyTheme(initial.activeThemeId);
    applyDisplayScale(initial.displayScale);
  }, 0);

  return {
    ...initial,

    setDisplayScale: (scale) => {
      const current = get();
      set({ displayScale: scale, previousSettings: current });
      applyDisplayScale(scale);
      saveSettings({ ...get() });
    },

    setGlobalFontSize: (size) => {
      const current = get();
      set({ globalFontSize: size, previousSettings: current });
      saveSettings({ ...get() });
    },

    setGlobalFontStyle: (style) => {
      const current = get();
      set({ globalFontStyle: style, previousSettings: current });
      saveSettings({ ...get() });
    },

    setEditorFontSize: (size) => {
      const current = get();
      set({ editorFontSize: size, previousSettings: current });
      saveSettings({ ...get() });
    },

    setEditorFontStyle: (style) => {
      const current = get();
      set({ editorFontStyle: style, previousSettings: current });
      saveSettings({ ...get() });
    },

    setEditorLineHeight: (height) => {
      const current = get();
      set({ editorLineHeight: height, previousSettings: current });
      saveSettings({ ...get() });
    },

    setEditorTabSize: (size) => {
      const current = get();
      set({ editorTabSize: size, previousSettings: current });
      saveSettings({ ...get() });
    },

    setEditorWordWrap: (wrap) => {
      const current = get();
      set({ editorWordWrap: wrap, previousSettings: current });
      saveSettings({ ...get() });
    },

    setEditorMinimap: (show) => {
      const current = get();
      set({ editorMinimap: show, previousSettings: current });
      saveSettings({ ...get() });
    },

    setEditorLineNumbers: (show) => {
      const current = get();
      set({ editorLineNumbers: show, previousSettings: current });
      saveSettings({ ...get() });
    },

    setTerminalFontSize: (size) => {
      const current = get();
      set({ terminalFontSize: size, previousSettings: current });
      saveSettings({ ...get() });
    },

    setTerminalFontStyle: (style) => {
      const current = get();
      set({ terminalFontStyle: style, previousSettings: current });
      saveSettings({ ...get() });
    },

    setTerminalLineHeight: (height) => {
      const current = get();
      set({ terminalLineHeight: height, previousSettings: current });
      saveSettings({ ...get() });
    },

    setActiveTheme: (themeId) => {
      const current = get();
      set({ activeThemeId: themeId, previousSettings: current });
      applyTheme(themeId);
      saveSettings({ ...get() });
    },

    setCompactMode: (compact) => {
      const current = get();
      set({ compactMode: compact, previousSettings: current });
      saveSettings({ ...get() });
    },

    setAnimationsEnabled: (enabled) => {
      const current = get();
      set({ animationsEnabled: enabled, previousSettings: current });
      saveSettings({ ...get() });
    },

    setShowStatusBar: (show) => {
      const current = get();
      set({ showStatusBar: show, previousSettings: current });
      saveSettings({ ...get() });
    },

    resetToDefaults: () => {
      const current = get();
      set({ ...defaultSettings, previousSettings: current });
      applyTheme(defaultSettings.activeThemeId);
      applyDisplayScale(defaultSettings.displayScale);
      saveSettings({ ...defaultSettings });
    },

    undoLastChange: () => {
      const { previousSettings } = get();
      if (previousSettings) {
        set({ ...previousSettings, previousSettings: null });
        if (previousSettings.activeThemeId) {
          applyTheme(previousSettings.activeThemeId);
        }
        if (previousSettings.displayScale) {
          applyDisplayScale(previousSettings.displayScale);
        }
        saveSettings({ ...get() });
      }
    },
  };
});
