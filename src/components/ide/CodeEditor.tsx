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
  
  const activeTab = openTabs.find((tab) => tab.id === activeTabId);
  const fontFamily = fontStyles.find(f => f.id === editorFontStyle)?.value || fontStyles[0].value;

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
  const cursorLine = 1;
  const cursorCol = 1;

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
            <span>Line {cursorLine}, Col {cursorCol}</span>
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
            className="py-2 px-3 text-right select-none bg-ide-editor border-r border-border/50 shrink-0 text-ide-lineNumber"
            style={editorStyle}
          >
            {lines.map((_, i) => (
              <div key={i} style={{ height: `${lineHeightPx}px` }}>
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Code content */}
        <div className={cn(
          'flex-1 overflow-auto ide-scrollbar',
          editorWordWrap && 'whitespace-pre-wrap break-words'
        )}>
          <pre 
            className="py-2 px-4 text-foreground min-h-full"
            style={editorStyle}
          >
            {lines.map((line, i) => (
              <div 
                key={i} 
                className="hover:bg-ide-lineHighlight"
                style={{ height: `${lineHeightPx}px` }}
              >
                {activeTab.language === 'c' ? highlightC(line + '\n') : line}
              </div>
            ))}
          </pre>
        </div>

        {/* Minimap */}
        {editorMinimap && (
          <div className="w-24 bg-ide-bg/50 shrink-0 hidden lg:block">
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
