import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import {
  Minus, Square, X, Maximize2, Settings, Layout, PanelLeft,
  PanelBottom, Save, FolderOpen, FilePlus, Download, Upload,
  Undo2, Redo2, Scissors, Copy, ClipboardPaste, Search,
  Replace, Play, Bug, Terminal as TerminalIcon, HelpCircle,
  Info, Keyboard, BookOpen, MessageSquare, Zap, ChevronDown,
  RotateCcw, FileCode, Trash2, FolderPlus, Moon, Sun, Monitor,
  SplitSquareVertical, PanelLeftClose, PanelBottomClose, Columns,
  Menu
} from 'lucide-react';

type MenuId = 'file' | 'edit' | 'selection' | 'view' | 'go' | 'run' | 'terminal' | 'help' | null;

interface MenuItem {
  label: string;
  shortcut?: string;
  icon?: React.ElementType;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
  submenu?: MenuItem[];
}

interface MenuData {
  id: MenuId;
  label: string;
  items: MenuItem[];
}

export function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<MenuId>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { 
    sidebarVisible, 
    bottomPanelVisible, 
    toggleSidebar, 
    setBottomPanelVisible,
    createFile,
    createFolder,
  } = useIDEStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus: MenuData[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New File', shortcut: 'Ctrl+N', icon: FilePlus, action: () => createFile('root', 'untitled.txt') },
        { label: 'New Folder', icon: FolderPlus, action: () => createFolder('root', 'new-folder') },
        { label: 'Open File...', shortcut: 'Ctrl+O', icon: FolderOpen },
        { label: 'Open Folder...', shortcut: 'Ctrl+K Ctrl+O', icon: FolderOpen },
        { divider: true, label: '' },
        { label: 'Save', shortcut: 'Ctrl+S', icon: Save },
        { label: 'Save As...', shortcut: 'Ctrl+Shift+S', icon: Save },
        { label: 'Save All', shortcut: 'Ctrl+K S', icon: Save },
        { divider: true, label: '' },
        { label: 'Export...', icon: Download },
        { label: 'Import...', icon: Upload },
        { divider: true, label: '' },
        { label: 'Close Editor', shortcut: 'Ctrl+W', icon: X },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', icon: Undo2 },
        { label: 'Redo', shortcut: 'Ctrl+Y', icon: Redo2 },
        { divider: true, label: '' },
        { label: 'Cut', shortcut: 'Ctrl+X', icon: Scissors },
        { label: 'Copy', shortcut: 'Ctrl+C', icon: Copy },
        { label: 'Paste', shortcut: 'Ctrl+V', icon: ClipboardPaste },
        { divider: true, label: '' },
        { label: 'Find', shortcut: 'Ctrl+F', icon: Search },
        { label: 'Replace', shortcut: 'Ctrl+H', icon: Replace },
        { label: 'Find in Files', shortcut: 'Ctrl+Shift+F', icon: Search },
      ],
    },
    {
      id: 'selection',
      label: 'Selection',
      items: [
        { label: 'Select All', shortcut: 'Ctrl+A' },
        { label: 'Expand Selection', shortcut: 'Shift+Alt+→' },
        { label: 'Shrink Selection', shortcut: 'Shift+Alt+←' },
        { divider: true, label: '' },
        { label: 'Copy Line Up', shortcut: 'Shift+Alt+↑' },
        { label: 'Copy Line Down', shortcut: 'Shift+Alt+↓' },
        { label: 'Move Line Up', shortcut: 'Alt+↑' },
        { label: 'Move Line Down', shortcut: 'Alt+↓' },
        { divider: true, label: '' },
        { label: 'Add Cursor Above', shortcut: 'Ctrl+Alt+↑' },
        { label: 'Add Cursor Below', shortcut: 'Ctrl+Alt+↓' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'Command Palette...', shortcut: 'Ctrl+Shift+P', icon: Zap },
        { divider: true, label: '' },
        { 
          label: sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar', 
          shortcut: 'Ctrl+B', 
          icon: sidebarVisible ? PanelLeftClose : PanelLeft,
          action: toggleSidebar 
        },
        { 
          label: bottomPanelVisible ? 'Hide Panel' : 'Show Panel', 
          shortcut: 'Ctrl+J', 
          icon: bottomPanelVisible ? PanelBottomClose : PanelBottom,
          action: () => setBottomPanelVisible(!bottomPanelVisible) 
        },
        { divider: true, label: '' },
        { label: 'Explorer', shortcut: 'Ctrl+Shift+E', icon: FolderOpen },
        { label: 'Search', shortcut: 'Ctrl+Shift+F', icon: Search },
        { label: 'Source Control', shortcut: 'Ctrl+Shift+G', icon: FileCode },
        { label: 'Run and Debug', shortcut: 'Ctrl+Shift+D', icon: Bug },
        { divider: true, label: '' },
        { label: 'Split Editor', icon: SplitSquareVertical },
        { label: 'Editor Layout', icon: Columns },
      ],
    },
    {
      id: 'go',
      label: 'Go',
      items: [
        { label: 'Go to File...', shortcut: 'Ctrl+P', icon: FileCode },
        { label: 'Go to Symbol...', shortcut: 'Ctrl+Shift+O' },
        { label: 'Go to Line...', shortcut: 'Ctrl+G' },
        { divider: true, label: '' },
        { label: 'Go to Definition', shortcut: 'F12' },
        { label: 'Go to Declaration', shortcut: 'Ctrl+F12' },
        { label: 'Go to References', shortcut: 'Shift+F12' },
        { divider: true, label: '' },
        { label: 'Go Back', shortcut: 'Alt+←' },
        { label: 'Go Forward', shortcut: 'Alt+→' },
      ],
    },
    {
      id: 'run',
      label: 'Run',
      items: [
        { label: 'Start Debugging', shortcut: 'F5', icon: Bug },
        { label: 'Run Without Debugging', shortcut: 'Ctrl+F5', icon: Play },
        { label: 'Stop Debugging', shortcut: 'Shift+F5', icon: X },
        { label: 'Restart Debugging', shortcut: 'Ctrl+Shift+F5', icon: RotateCcw },
        { divider: true, label: '' },
        { label: 'Step Over', shortcut: 'F10' },
        { label: 'Step Into', shortcut: 'F11' },
        { label: 'Step Out', shortcut: 'Shift+F11' },
        { divider: true, label: '' },
        { label: 'Toggle Breakpoint', shortcut: 'F9' },
        { label: 'Add Configuration...' },
      ],
    },
    {
      id: 'terminal',
      label: 'Terminal',
      items: [
        { label: 'New Terminal', shortcut: 'Ctrl+Shift+`', icon: TerminalIcon, action: () => setBottomPanelVisible(true) },
        { label: 'Split Terminal', icon: SplitSquareVertical },
        { divider: true, label: '' },
        { label: 'Run Task...' },
        { label: 'Run Build Task...', shortcut: 'Ctrl+Shift+B' },
        { label: 'Run Active File', icon: Play },
        { divider: true, label: '' },
        { label: 'Configure Tasks...' },
        { label: 'Configure Default Build Task...' },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { label: 'Welcome', icon: Info },
        { label: 'Documentation', icon: BookOpen },
        { label: 'Show All Commands', shortcut: 'Ctrl+Shift+P', icon: Zap },
        { divider: true, label: '' },
        { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+K Ctrl+S', icon: Keyboard },
        { label: 'Tips and Tricks' },
        { divider: true, label: '' },
        { label: 'Report Issue', icon: MessageSquare },
        { label: 'View License' },
        { divider: true, label: '' },
        { label: 'About', icon: HelpCircle },
      ],
    },
  ];

  const handleMenuClick = (menuId: MenuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const handleMenuHover = (menuId: MenuId) => {
    if (activeMenu !== null) {
      setActiveMenu(menuId);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.action && !item.disabled) {
      item.action();
    }
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div 
      ref={menuRef}
      className="h-8 bg-ide-bg border-b border-border flex items-center justify-between px-2 select-none shrink-0"
    >
      {/* Mobile hamburger */}
      <button
        className="md:hidden p-1 hover:bg-secondary rounded"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Desktop menus */}
      <div className="hidden md:flex items-center gap-0">
        {menus.map((menu) => (
          <div key={menu.id} className="relative">
            <button
              onClick={() => handleMenuClick(menu.id)}
              onMouseEnter={() => handleMenuHover(menu.id)}
              className={cn(
                'px-2 py-1 text-xs font-medium transition-colors rounded-sm',
                activeMenu === menu.id
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              {menu.label}
            </button>

            {/* Dropdown */}
            {activeMenu === menu.id && (
              <div className="absolute left-0 top-full mt-0.5 min-w-[220px] bg-popover border border-border rounded-md shadow-lg py-1 z-50">
                {menu.items.map((item, idx) => (
                  item.divider ? (
                    <div key={idx} className="h-px bg-border my-1 mx-2" />
                  ) : (
                    <button
                      key={idx}
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors',
                        item.disabled 
                          ? 'text-muted-foreground/50 cursor-not-allowed'
                          : 'text-foreground hover:bg-secondary'
                      )}
                    >
                      {item.icon && <item.icon className="w-3.5 h-3.5 text-muted-foreground" />}
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-muted-foreground text-[10px] ml-4">{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-8 right-0 bg-popover border-b border-border shadow-lg z-50 md:hidden max-h-[70vh] overflow-auto">
          {menus.map((menu) => (
            <div key={menu.id} className="border-b border-border last:border-b-0">
              <button
                onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {menu.label}
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  activeMenu === menu.id && "rotate-180"
                )} />
              </button>
              {activeMenu === menu.id && (
                <div className="bg-secondary/30 py-1">
                  {menu.items.filter(item => !item.divider).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemClick(item)}
                      className="w-full flex items-center gap-2 px-6 py-2 text-xs text-foreground hover:bg-secondary"
                    >
                      {item.icon && <item.icon className="w-3.5 h-3.5 text-muted-foreground" />}
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Center: Workspace name */}
      <div className="hidden sm:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <span className="text-xs text-muted-foreground">Untitled (Workspace)</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-secondary rounded hidden sm:block" title="Toggle Layout">
          <Layout className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-secondary rounded hidden sm:block" title="Settings">
          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <div className="w-px h-4 bg-border mx-1 hidden sm:block" />
        <button className="p-1.5 hover:bg-secondary rounded" title="Minimize">
          <Minus className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-secondary rounded" title="Maximize">
          <Square className="w-3 h-3 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-secondary/80 hover:bg-red-500/80 rounded group" title="Close">
          <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}
