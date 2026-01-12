import { useState, useRef, useEffect, useCallback } from 'react';
import { Copy, RotateCcw, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import { useSettingsStore, fontStyles } from '@/store/settingsStore';
import { useTerminalShell } from '@/hooks/useTerminalShell';
import { MobileKeyboard } from './MobileKeyboard';
import { useIsMobile } from '@/hooks/use-mobile';

export function TerminalPanel() {
  const { terminalLines, terminalConnection, clearTerminal, setTerminalConnection, addTerminalLine } = useIDEStore();
  const { terminalFontSize, terminalFontStyle, terminalLineHeight, compactMode } = useSettingsStore();
  const { getPrompt, executeCommand, navigateHistory, getAutoComplete, commandHistory } = useTerminalShell();
  const isMobile = useIsMobile();
  
  const [inputValue, setInputValue] = useState('');
  const [url, setUrl] = useState(terminalConnection.url || 'ws://10.147.82.1:4545');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fontFamily = fontStyles.find(f => f.id === terminalFontStyle)?.value || fontStyles[0].value;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleCommand = useCallback((command: string) => {
    executeCommand(command);
    setInputValue('');
    setCursorPosition(0);
    setShowSuggestions(false);
  }, [executeCommand]);

  const handleConnect = () => {
    if (terminalConnection.status === 'connected') {
      setTerminalConnection({ status: 'disconnected' });
      addTerminalLine({ type: 'system', content: 'Session closed.' });
    } else {
      setTerminalConnection({ status: 'connecting', url });
      setTimeout(() => {
        setTerminalConnection({ status: 'connected', url });
        addTerminalLine({ type: 'system', content: `Connected to ${url}` });
        addTerminalLine({ type: 'system', content: 'Type "help" for available commands.' });
      }, 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (inputValue.trim()) {
          handleCommand(inputValue.trim());
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevCmd = navigateHistory('up');
        if (prevCmd) {
          setInputValue(prevCmd);
          setCursorPosition(prevCmd.length);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        const nextCmd = navigateHistory('down');
        setInputValue(nextCmd);
        setCursorPosition(nextCmd.length);
        break;
      case 'Tab':
        e.preventDefault();
        const completions = getAutoComplete(inputValue);
        if (completions.length === 1) {
          const parts = inputValue.split(' ');
          parts[parts.length - 1] = completions[0];
          setInputValue(parts.join(' '));
        } else if (completions.length > 1) {
          setSuggestions(completions);
          setShowSuggestions(true);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      case 'c':
        if (e.ctrlKey) {
          addTerminalLine({ type: 'input', content: `${getPrompt()} ${inputValue}^C` });
          setInputValue('');
        }
        break;
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          clearTerminal();
        }
        break;
    }
  };

  const handleMobileKeyPress = (key: string) => {
    const newValue = inputValue.slice(0, cursorPosition) + key + inputValue.slice(cursorPosition);
    setInputValue(newValue);
    setCursorPosition(cursorPosition + key.length);
    inputRef.current?.focus();
  };

  const handleMobileSpecialKey = (key: 'Enter' | 'Backspace' | 'Tab' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End' | 'Ctrl+C' | 'Ctrl+L' | 'Ctrl+D' | 'Ctrl+Z' | 'Ctrl+A' | 'Escape') => {
    switch (key) {
      case 'Enter':
        if (inputValue.trim()) handleCommand(inputValue.trim());
        break;
      case 'Backspace':
        if (cursorPosition > 0) {
          setInputValue(inputValue.slice(0, cursorPosition - 1) + inputValue.slice(cursorPosition));
          setCursorPosition(cursorPosition - 1);
        }
        break;
      case 'Tab':
        const completions = getAutoComplete(inputValue);
        if (completions.length === 1) {
          const parts = inputValue.split(' ');
          parts[parts.length - 1] = completions[0];
          setInputValue(parts.join(' '));
        }
        break;
      case 'ArrowUp':
        const prevCmd = navigateHistory('up');
        if (prevCmd) setInputValue(prevCmd);
        break;
      case 'ArrowDown':
        const nextCmd = navigateHistory('down');
        setInputValue(nextCmd);
        break;
      case 'ArrowLeft':
        setCursorPosition(Math.max(0, cursorPosition - 1));
        break;
      case 'ArrowRight':
        setCursorPosition(Math.min(inputValue.length, cursorPosition + 1));
        break;
      case 'Home':
      case 'Ctrl+A':
        setCursorPosition(0);
        break;
      case 'End':
        setCursorPosition(inputValue.length);
        break;
      case 'Ctrl+C':
        addTerminalLine({ type: 'input', content: `${getPrompt()} ${inputValue}^C` });
        setInputValue('');
        break;
      case 'Ctrl+L':
        clearTerminal();
        break;
      case 'Ctrl+D':
        if (!inputValue) {
          setTerminalConnection({ status: 'disconnected' });
          addTerminalLine({ type: 'system', content: 'Session closed.' });
        }
        break;
      case 'Ctrl+Z':
        addTerminalLine({ type: 'system', content: '^Z (suspended)' });
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
    inputRef.current?.focus();
  };

  const terminalStyle = {
    fontFamily,
    fontSize: `${terminalFontSize}px`,
    lineHeight: terminalLineHeight,
  };

  const getStatusIcon = () => {
    switch (terminalConnection.status) {
      case 'connected': return <Wifi className="w-4 h-4 text-status-success" />;
      case 'connecting': return <Loader2 className="w-4 h-4 text-status-warning animate-spin" />;
      default: return <WifiOff className="w-4 h-4 text-status-error" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Connection bar */}
      <div className={cn(
        'flex items-center gap-2 sm:gap-3 px-2 sm:px-4 bg-ide-bg border-b border-border',
        compactMode ? 'py-1' : 'py-2'
      )}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Terminal URL"
          className={cn(
            'flex-1 min-w-0 bg-secondary border border-border rounded px-2 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary',
            compactMode ? 'py-1' : 'py-1.5'
          )}
        />
        <button
          onClick={handleConnect}
          disabled={terminalConnection.status === 'connecting'}
          className={cn(
            'px-2 sm:px-4 rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
            compactMode ? 'py-1' : 'py-1.5',
            terminalConnection.status === 'connected'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
            terminalConnection.status === 'connecting' && 'opacity-50 cursor-not-allowed'
          )}
        >
          {terminalConnection.status === 'connected' ? 'Disconnect' : terminalConnection.status === 'connecting' ? 'Connecting...' : 'Connect'}
        </button>
        <button 
          className="p-1.5 hover:bg-secondary rounded shrink-0" 
          title="Copy URL"
          onClick={() => navigator.clipboard.writeText(url)}
        >
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>
        <button 
          className="p-1.5 hover:bg-secondary rounded shrink-0" 
          title="Clear Terminal"
          onClick={clearTerminal}
        >
          <RotateCcw className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          {getStatusIcon()}
          <span className="text-xs sm:text-sm text-muted-foreground capitalize hidden sm:inline">
            {terminalConnection.status}
          </span>
        </div>
      </div>

      {/* Mobile keyboard */}
      {isMobile && terminalConnection.status === 'connected' && (
        <MobileKeyboard
          onKeyPress={handleMobileKeyPress}
          onSpecialKey={handleMobileSpecialKey}
        />
      )}

      {/* Terminal output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto ide-scrollbar p-2 sm:p-4"
        style={terminalStyle}
        onClick={() => inputRef.current?.focus()}
      >
        {terminalLines.map((line) => (
          <div
            key={line.id}
            className={cn(
              'whitespace-pre-wrap break-all',
              line.type === 'input' && 'text-status-success',
              line.type === 'output' && 'text-foreground',
              line.type === 'error' && 'text-status-error',
              line.type === 'system' && 'text-muted-foreground italic'
            )}
          >
            {line.content.split('\n').map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        ))}

        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 py-2 text-muted-foreground">
            {suggestions.map((s, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 bg-secondary rounded cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  const parts = inputValue.split(' ');
                  parts[parts.length - 1] = s;
                  setInputValue(parts.join(' '));
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Input line */}
        {terminalConnection.status === 'connected' && (
          <div className="flex items-center text-status-success">
            <span className="shrink-0">{getPrompt()}&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setCursorPosition(e.target.selectionStart || 0);
                setShowSuggestions(false);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground caret-foreground min-w-0"
              style={terminalStyle}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <span className="w-2 h-4 bg-foreground animate-blink shrink-0" />
          </div>
        )}

        {/* Disconnected message */}
        {terminalConnection.status === 'disconnected' && (
          <div className="text-muted-foreground italic py-4 text-center">
            Terminal disconnected. Click Connect to start a new session.
          </div>
        )}
      </div>
    </div>
  );
}
