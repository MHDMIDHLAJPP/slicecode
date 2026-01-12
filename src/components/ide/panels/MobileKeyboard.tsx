import { cn } from '@/lib/utils';
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  CornerDownLeft, Delete, Home, MoveHorizontal,
  ChevronUp, ChevronDown
} from 'lucide-react';

interface MobileKeyboardProps {
  onKeyPress: (key: string) => void;
  onSpecialKey: (key: 'Enter' | 'Backspace' | 'Tab' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End' | 'Ctrl+C' | 'Ctrl+L' | 'Ctrl+D' | 'Ctrl+Z' | 'Ctrl+A' | 'Escape') => void;
  className?: string;
}

const quickKeys = [
  { label: 'Tab', key: 'Tab', icon: MoveHorizontal },
  { label: 'Ctrl', key: 'Ctrl', special: true },
  { label: '/', key: '/' },
  { label: '-', key: '-' },
  { label: '.', key: '.' },
  { label: '_', key: '_' },
  { label: '~', key: '~' },
  { label: '|', key: '|' },
  { label: '&', key: '&' },
  { label: '*', key: '*' },
  { label: '$', key: '$' },
  { label: '"', key: '"' },
  { label: "'", key: "'" },
  { label: '(', key: '(' },
  { label: ')', key: ')' },
  { label: '[', key: '[' },
  { label: ']', key: ']' },
  { label: '{', key: '{' },
  { label: '}', key: '}' },
  { label: '<', key: '<' },
  { label: '>', key: '>' },
  { label: '=', key: '=' },
  { label: ';', key: ';' },
  { label: ':', key: ':' },
  { label: '\\', key: '\\' },
  { label: '!', key: '!' },
  { label: '@', key: '@' },
  { label: '#', key: '#' },
  { label: '%', key: '%' },
  { label: '^', key: '^' },
];

const ctrlKeys = [
  { label: 'C', action: 'Ctrl+C' as const, desc: 'Interrupt' },
  { label: 'L', action: 'Ctrl+L' as const, desc: 'Clear' },
  { label: 'D', action: 'Ctrl+D' as const, desc: 'EOF' },
  { label: 'Z', action: 'Ctrl+Z' as const, desc: 'Suspend' },
  { label: 'A', action: 'Ctrl+A' as const, desc: 'Home' },
];

export function MobileKeyboard({ onKeyPress, onSpecialKey, className }: MobileKeyboardProps) {
  return (
    <div className={cn('bg-ide-sidebar border-y border-border', className)}>
      {/* Main scrollable keyboard keys */}
      <div className="flex overflow-x-auto scrollbar-none py-1.5 px-2 gap-1">
        {/* Navigation keys */}
        <div className="flex gap-0.5 shrink-0 pr-2 border-r border-border mr-1">
          <button
            onClick={() => onSpecialKey('ArrowUp')}
            className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title="History Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSpecialKey('ArrowDown')}
            className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title="History Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSpecialKey('ArrowLeft')}
            className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title="Move Left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSpecialKey('ArrowRight')}
            className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title="Move Right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Special function keys */}
        <div className="flex gap-0.5 shrink-0 pr-2 border-r border-border mr-1">
          <button
            onClick={() => onSpecialKey('Tab')}
            className="px-2 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-xs font-medium text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title="Tab / Autocomplete"
          >
            TAB
          </button>
          <button
            onClick={() => onSpecialKey('Home')}
            className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSpecialKey('Escape')}
            className="px-2 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-xs font-medium text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title="Escape"
          >
            ESC
          </button>
        </div>

        {/* Ctrl combo keys */}
        <div className="flex gap-0.5 shrink-0 pr-2 border-r border-border mr-1">
          {ctrlKeys.map(({ label, action, desc }) => (
            <button
              key={action}
              onClick={() => onSpecialKey(action)}
              className="px-2 h-8 flex items-center justify-center bg-accent/50 hover:bg-accent rounded text-xs font-medium text-foreground active:bg-primary active:text-primary-foreground transition-colors"
              title={`Ctrl+${label} (${desc})`}
            >
              ^{label}
            </button>
          ))}
        </div>

        {/* Quick insert keys */}
        {quickKeys.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="w-8 h-8 shrink-0 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-sm font-mono text-foreground active:bg-primary active:text-primary-foreground transition-colors"
            title={label}
          >
            {label}
          </button>
        ))}

        {/* Enter and Backspace at the end */}
        <div className="flex gap-0.5 shrink-0 pl-2 border-l border-border ml-1">
          <button
            onClick={() => onSpecialKey('Backspace')}
            className="w-10 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 rounded text-foreground active:bg-destructive active:text-destructive-foreground transition-colors"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSpecialKey('Enter')}
            className="px-3 h-8 flex items-center justify-center bg-primary hover:bg-primary/90 rounded text-primary-foreground font-medium text-xs active:bg-primary/80 transition-colors"
            title="Enter / Execute"
          >
            <CornerDownLeft className="w-4 h-4 mr-1" />
            Run
          </button>
        </div>
      </div>
    </div>
  );
}
