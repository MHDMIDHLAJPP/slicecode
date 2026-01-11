import { useRef, useState, useEffect, useCallback } from 'react';
import { useIDEStore } from '@/store/ideStore';
import { useSettingsStore, fontStyles } from '@/store/settingsStore';
import { Settings, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple syntax highlighter for C code
function highlightC(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Preprocessor directives
    if (line.trim().startsWith('#')) {
      return (
        <span key={lineIndex} className="text-syntax-preprocessor">{line}</span>
      );
    }

    // Comments
    const commentMatch = line.match(/\/\/.*/);
    if (commentMatch) {
      const beforeComment = line.slice(0, commentMatch.index);
      const comment = commentMatch[0];
      
      return (
        <span key={lineIndex}>
          {highlightCLine(beforeComment)}
          <span className="text-syntax-comment">{comment}</span>
        </span>
      );
    }

    return <span key={lineIndex}>{highlightCLine(line)}</span>;
  });
}

function highlightCLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const keywords = ['int', 'char', 'void', 'return', 'if', 'else', 'while', 'for', 'switch', 'case', 'break', 'continue', 'NULL', 'EOF', 'FILE'];
  
  // Simple tokenization
  const pattern = /(".*?"|'.'|\b\d+\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b|[{}();,=<>+\-*/&|!]|\s+)/g;
  const matches = line.match(pattern) || [line];
  
  matches.forEach((token, i) => {
    if (token.startsWith('"') || token.startsWith("'")) {
      tokens.push(<span key={i} className="text-syntax-string">{token}</span>);
    } else if (/^\d+$/.test(token)) {
      tokens.push(<span key={i} className="text-syntax-number">{token}</span>);
    } else if (keywords.includes(token)) {
      tokens.push(<span key={i} className="text-syntax-keyword">{token}</span>);
    } else if (token.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) && token.match(/^[A-Z]/)) {
      tokens.push(<span key={i} className="text-syntax-type">{token}</span>);
    } else if (token.match(/^(printf|fopen|fclose|fgetc|fputc|exit|main)$/)) {
      tokens.push(<span key={i} className="text-syntax-function">{token}</span>);
    } else if (token.match(/[{}();,=<>+\-*/&|!]/)) {
      tokens.push(<span key={i} className="text-syntax-punctuation">{token}</span>);
    } else {
      tokens.push(<span key={i}>{token}</span>);
    }
  });

  return tokens;
}

export function CodeEditor() {
  const { openTabs, activeTabId, updateTabContent } = useIDEStore();
  const { 
    editorFontSize, 
    editorFontStyle, 
    editorLineHeight, 
    editorMinimap,
    editorLineNumbers,
    editorWordWrap,
    showStatusBar,
    compactMode 
  } = useSettingsStore();
  
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeTab = openTabs.find((tab) => tab.id === activeTabId);
  const fontFamily = fontStyles.find(f => f.id === editorFontStyle)?.value || fontStyles[0].value;

  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });

  // Sync scroll between all elements
  const handleScroll = useCallback(() => {
    if (textareaRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;
      
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
      if (highlightRef.current) {
        highlightRef.current.scrollTop = scrollTop;
        highlightRef.current.scrollLeft = scrollLeft;
      }
    }
  }, []);

  // Update cursor position
  const updateCursorPosition = useCallback(() => {
    if (textareaRef.current) {
      const text = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const textBeforeCursor = text.substring(0, selectionStart);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, col });
    }
  }, []);

  // Handle content change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeTab) {
      updateTabContent(activeTab.id, e.target.value);
    }
    updateCursorPosition();
  }, [activeTab, updateTabContent, updateCursorPosition]);

  // Handle tab key for indentation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        
        if (activeTab) {
          updateTabContent(activeTab.id, newValue);
        }
        
        // Set cursor position after the tab
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
    updateCursorPosition();
  }, [activeTab, updateTabContent, updateCursorPosition]);

  useEffect(() => {
    updateCursorPosition();
  }, [activeTabId, updateCursorPosition]);

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center bg-ide-editor text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">No file open</p>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  const lines = activeTab.content.split('\n');

  const editorStyle = {
    fontFamily,
    fontSize: `${editorFontSize}px`,
    lineHeight: editorLineHeight,
  };

  const lineHeightPx = editorFontSize * editorLineHeight;

  return (
    <div className="flex-1 flex flex-col bg-ide-editor overflow-hidden">
      {/* Status bar */}
      {showStatusBar && (
        <div className={cn(
          'flex items-center justify-between px-4 bg-ide-bg border-b border-border text-xs text-muted-foreground',
          compactMode ? 'py-0.5' : 'py-1'
        )}>
          <div className="flex items-center gap-4">
            <span className="uppercase">{activeTab.language}</span>
            <span>Line {cursorPosition.line}, Col {cursorPosition.col}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Live Preview</span>
            <button className="p-1 hover:bg-secondary rounded">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:bg-secondary rounded">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Editor content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        {editorLineNumbers && (
          <div 
            ref={lineNumbersRef}
            className="py-2 px-3 text-right select-none bg-ide-editor border-r border-border/50 shrink-0 text-ide-lineNumber overflow-hidden"
            style={editorStyle}
          >
            {lines.map((_, i) => (
              <div 
                key={i} 
                style={{ height: `${lineHeightPx}px` }}
                className={cn(
                  cursorPosition.line === i + 1 && 'text-foreground'
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Code editor with overlay */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden"
        >
          {/* Syntax highlighted background */}
          <pre 
            ref={highlightRef}
            className={cn(
              'absolute inset-0 py-2 px-4 text-foreground pointer-events-none overflow-hidden m-0',
              editorWordWrap && 'whitespace-pre-wrap break-words'
            )}
            style={editorStyle}
            aria-hidden="true"
          >
            {lines.map((line, i) => (
              <div 
                key={i} 
                className={cn(
                  cursorPosition.line === i + 1 && 'bg-ide-lineHighlight'
                )}
                style={{ height: `${lineHeightPx}px` }}
              >
                {activeTab.language === 'c' ? highlightC(line + '\n') : (line || ' ')}
              </div>
            ))}
          </pre>

          {/* Editable textarea overlay */}
          <textarea
            ref={textareaRef}
            value={activeTab.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            className={cn(
              'absolute inset-0 w-full h-full py-2 px-4 bg-transparent text-transparent caret-foreground resize-none outline-none ide-scrollbar',
              editorWordWrap && 'whitespace-pre-wrap break-words'
            )}
            style={editorStyle}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>

        {/* Minimap */}
        {editorMinimap && (
          <div className="w-24 bg-ide-bg/50 shrink-0 hidden lg:block overflow-hidden">
            <div className="p-2 text-[4px] leading-[1.2] opacity-50 overflow-hidden">
              {lines.slice(0, 100).map((line, i) => (
                <div key={i} className="truncate text-muted-foreground">{line || ' '}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
