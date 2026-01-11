import React from 'react';

// VS Code style file icons as SVG components
export const CFileIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#649AD0" d="M27.5 5.5v21a2 2 0 01-2 2h-19a2 2 0 01-2-2v-17l6-6h15a2 2 0 012 2z"/>
    <path fill="#B5CFEA" d="M4.5 9.5l6-6v4a2 2 0 01-2 2z"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">C</text>
  </svg>
);

export const CppFileIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#649AD0" d="M27.5 5.5v21a2 2 0 01-2 2h-19a2 2 0 01-2-2v-17l6-6h15a2 2 0 012 2z"/>
    <path fill="#B5CFEA" d="M4.5 9.5l6-6v4a2 2 0 01-2 2z"/>
    <text x="16" y="21" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">C++</text>
  </svg>
);

export const HeaderFileIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#9B6EB7" d="M27.5 5.5v21a2 2 0 01-2 2h-19a2 2 0 01-2-2v-17l6-6h15a2 2 0 012 2z"/>
    <path fill="#D4B8E0" d="M4.5 9.5l6-6v4a2 2 0 01-2 2z"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">H</text>
  </svg>
);

export const JavaScriptIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="2" y="2" width="28" height="28" rx="2" fill="#F7DF1E"/>
    <text x="22" y="25" textAnchor="middle" fill="#323330" fontSize="16" fontWeight="bold" fontFamily="sans-serif">JS</text>
  </svg>
);

export const TypeScriptIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="2" y="2" width="28" height="28" rx="2" fill="#3178C6"/>
    <text x="16" y="23" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">TS</text>
  </svg>
);

export const ReactIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <circle cx="16" cy="16" r="3" fill="#61DAFB"/>
    <ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="#61DAFB" strokeWidth="1.5"/>
    <ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 16 16)"/>
    <ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 16 16)"/>
  </svg>
);

export const PythonIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#3776AB" d="M15.9 3c-7.5 0-7 3.3-7 3.3v3.4h7.1v1H6.5S2 10.2 2 17.6s3.9 7.1 4.6 7.1h2.8v-3.4s-.1-4.6 4.5-4.6h7.8s4.4.1 4.4-4.2V7.2S26.8 3 15.9 3zm-4.3 2.5c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4-1.4-.6-1.4-1.4.6-1.4 1.4-1.4z"/>
    <path fill="#FFD43B" d="M16.1 29c7.5 0 7-3.3 7-3.3v-3.4h-7.1v-1h9.5s4.5.5 4.5-6.9-3.9-7.1-4.6-7.1h-2.8v3.4s.1 4.6-4.5 4.6H10.3s-4.4-.1-4.4 4.2v5.3S5.2 29 16.1 29zm4.3-2.5c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4z"/>
  </svg>
);

export const HtmlIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#E44D26" d="M5.9 28L4 4h24l-1.9 24-10.1 3z"/>
    <path fill="#F16529" d="M16 26.5l8.2-2.3 1.6-18.2H16z"/>
    <path fill="#EBEBEB" d="M16 13.4h-4.5l-.3-3.4H16V6.8H7.8l.8 9h7.4zm0 6.3l-4.2-1.1-.3-3h-3.2l.5 6.1 7.2 2z"/>
    <path fill="#fff" d="M16 13.4v3.2h4.2l-.4 4.5-3.8 1v3.4l7-1.9.5-5.8.3-4.4zm0-6.6v3.2h7.8l.3-3.2z"/>
  </svg>
);

export const CssIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#1572B6" d="M5.9 28L4 4h24l-1.9 24-10.1 3z"/>
    <path fill="#33A9DC" d="M16 26.5l8.2-2.3 1.6-18.2H16z"/>
    <path fill="#EBEBEB" d="M16 13.4h-4.5l-.3-3.4H16V6.8H7.8l.8 9h7.4zm0 6.3l-4.2-1.1-.3-3h-3.2l.5 6.1 7.2 2z"/>
    <path fill="#fff" d="M16 13.4v3.2h4.2l-.4 4.5-3.8 1v3.4l7-1.9.5-5.8.3-4.4zm0-6.6v3.2h7.8l.3-3.2z"/>
  </svg>
);

export const JsonIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#F5DE19" d="M4 4h24v24H4z"/>
    <path fill="#323330" d="M14.5 22.5c0 2.5-1.5 3.5-3.5 3.5s-3-1.2-3-3h2c0 .8.3 1.2 1 1.2s1-.5 1-1.5v-8h2.5zm7.5 3.5c-2.2 0-3.8-1.2-4-3.2h2.2c.2.9.8 1.4 1.8 1.4s1.5-.5 1.5-1.2c0-.8-.5-1.2-2-1.6-2.2-.5-3.5-1.2-3.5-3.2 0-1.9 1.5-3.2 3.8-3.2 2.2 0 3.6 1.2 3.8 3h-2.2c-.1-.8-.7-1.2-1.6-1.2s-1.4.4-1.4 1.1c0 .8.6 1 2 1.4 2.2.5 3.6 1.2 3.6 3.4 0 2.1-1.7 3.3-4 3.3z"/>
  </svg>
);

export const MarkdownIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="2" y="6" width="28" height="20" rx="2" fill="#083F4D"/>
    <path fill="white" d="M6 22V10h3l3 5 3-5h3v12h-3v-7l-3 5-3-5v7zm16-6v6h-3l4.5-6-4.5-6h3l3 4v-4h2v12h-2v-4z"/>
  </svg>
);

export const GitIgnoreIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#F05033" d="M29.5 16.8l-14.3 14.3c-.4.4-1 .4-1.4 0L1.9 19.2c-.4-.4-.4-1 0-1.4l14.3-14.3c.4-.4 1-.4 1.4 0l11.9 11.9c.4.4.4 1 0 1.4z"/>
    <path fill="white" d="M16 10.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
  </svg>
);

export const EnvIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#ECD53F"/>
    <path fill="#323330" d="M8 11h6v2H10v2h4v2H10v4H8zm10 0h4c1.1 0 2 .9 2 2v2c0 .8-.5 1.5-1.2 1.8l1.7 4.2h-2.3l-1.5-3.8-.7-.2v4h-2zm2 2v3h1.5c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5z"/>
  </svg>
);

export const PackageJsonIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#8ED6FB" d="M16 2l13 7.5v13L16 30 3 22.5v-13z"/>
    <path fill="#1C78C0" d="M16 2v28l13-7.5v-13z"/>
    <path fill="#1C78C0" d="M3 9.5L16 17l13-7.5"/>
    <path fill="#8ED6FB" d="M3 9.5L16 2l13 7.5"/>
    <path fill="#fff" d="M16 17v13"/>
  </svg>
);

export const LockFileIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="6" y="12" width="20" height="16" rx="2" fill="#CB3837"/>
    <path fill="#CB3837" d="M10 12V9c0-3.3 2.7-6 6-6s6 2.7 6 6v3h-3V9c0-1.7-1.3-3-3-3s-3 1.3-3 3v3z"/>
    <circle cx="16" cy="20" r="2" fill="white"/>
    <path fill="white" d="M15 20h2v5h-2z"/>
  </svg>
);

export const DockerfileIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#2496ED" d="M30 14c-.5-.3-1.6-.4-2.5-.2-.2-1.2-.8-2.2-1.6-3l-.3-.3-.3.3c-.7.5-1.2 1.3-1.4 2.1-.1.4-.1.8-.1 1.2-1.2-.4-2.5-.4-3.7-.2-.2 0-.4 0-.6.1h-1.1c-.1-.8-.2-1.6-.2-2.5V8h-3v3.5c0 .7 0 1.4.1 2.1H13V8h-3v5.6H7V8H4v5.6H1v3h28.8c.2-.9.1-1.8-.3-2.6h.5z"/>
    <path fill="#2496ED" d="M4 16h3v3H4zm4 0h3v3H8zm4 0h3v3h-3zm4 0h3v3h-3zm-4-4h3v3h-3zm4 0h3v3h-3zm-4-4h3v3h-3z"/>
  </svg>
);

export const YamlIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#CB171E" d="M27.5 5.5v21a2 2 0 01-2 2h-19a2 2 0 01-2-2v-17l6-6h15a2 2 0 012 2z"/>
    <path fill="#EF9A9A" d="M4.5 9.5l6-6v4a2 2 0 01-2 2z"/>
    <text x="16" y="22" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">YML</text>
  </svg>
);

export const ConfigIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#6D8086" d="M27.5 5.5v21a2 2 0 01-2 2h-19a2 2 0 01-2-2v-17l6-6h15a2 2 0 012 2z"/>
    <path fill="#B0BEC5" d="M4.5 9.5l6-6v4a2 2 0 01-2 2z"/>
    <path fill="white" d="M16 12l6 3.5v7L16 26l-6-3.5v-7z"/>
    <path fill="#6D8086" d="M16 14l4 2.3v4.4L16 23l-4-2.3v-4.4z"/>
  </svg>
);

export const ImageIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#26A69A"/>
    <circle cx="11" cy="11" r="3" fill="white"/>
    <path fill="white" d="M4 24l7-10 5 6 4-3 8 7v2c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2z"/>
  </svg>
);

export const SvgIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#FFB300"/>
    <text x="16" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">SVG</text>
  </svg>
);

export const FontIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#E53935"/>
    <text x="16" y="23" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="serif">A</text>
  </svg>
);

export const ShellIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#4EAA25"/>
    <path fill="white" d="M8 12l5 4-5 4v-2l3-2-3-2zm6 6h8v2h-8z"/>
  </svg>
);

export const TextFileIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#90A4AE" d="M27.5 5.5v21a2 2 0 01-2 2h-19a2 2 0 01-2-2v-17l6-6h15a2 2 0 012 2z"/>
    <path fill="#CFD8DC" d="M4.5 9.5l6-6v4a2 2 0 01-2 2z"/>
    <path fill="white" d="M9 14h14v1.5H9zm0 4h14v1.5H9zm0 4h10v1.5H9z"/>
  </svg>
);

export const BinaryIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#607D8B"/>
    <text x="16" y="20" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="monospace">BIN</text>
  </svg>
);

export const ViteIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#646CFF" d="M28 7L16 28 4 7l12 3z"/>
    <path fill="#FFDD35" d="M22 4l-6 16L10 4l6 2z"/>
  </svg>
);

export const EslintIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#4B32C3" d="M16 3L3 10.5v13L16 31l13-7.5v-13z"/>
    <path fill="white" d="M16 9l-8 4.5v9L16 27l8-4.5v-9z"/>
    <path fill="#4B32C3" d="M16 13l-4 2.3v4.4l4 2.3 4-2.3v-4.4z"/>
  </svg>
);

export const ReadmeIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#42A5F5"/>
    <path fill="white" d="M8 10h4v12H8zm6 0h4l2 6 2-6h4v12h-3v-8l-2 5h-2l-2-5v8h-3z"/>
  </svg>
);

export const DefaultFileIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#78909C" d="M27.5 5.5v21a2 2 0 01-2 2h-19a2 2 0 01-2-2v-17l6-6h15a2 2 0 012 2z"/>
    <path fill="#B0BEC5" d="M4.5 9.5l6-6v4a2 2 0 01-2 2z"/>
  </svg>
);

export const FolderIcon = ({ isOpen = false }: { isOpen?: boolean }) => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    {isOpen ? (
      <>
        <path fill="#DCAD60" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
        <path fill="#F5D77F" d="M2 12h28v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z"/>
      </>
    ) : (
      <path fill="#DCAD60" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
    )}
  </svg>
);

export const NodeModulesIcon = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    <path fill="#8BC34A" d="M16 2l13 7.5v13L16 30 3 22.5v-13z"/>
    <path fill="#689F38" d="M16 2v28l13-7.5v-13z"/>
  </svg>
);

export const SrcFolderIcon = ({ isOpen = false }: { isOpen?: boolean }) => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    {isOpen ? (
      <>
        <path fill="#42A5F5" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
        <path fill="#90CAF9" d="M2 12h28v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z"/>
      </>
    ) : (
      <path fill="#42A5F5" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
    )}
  </svg>
);

export const PublicFolderIcon = ({ isOpen = false }: { isOpen?: boolean }) => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    {isOpen ? (
      <>
        <path fill="#26A69A" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
        <path fill="#80CBC4" d="M2 12h28v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z"/>
      </>
    ) : (
      <path fill="#26A69A" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
    )}
  </svg>
);

export const DistFolderIcon = ({ isOpen = false }: { isOpen?: boolean }) => (
  <svg viewBox="0 0 32 32" className="w-4 h-4">
    {isOpen ? (
      <>
        <path fill="#78909C" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
        <path fill="#B0BEC5" d="M2 12h28v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z"/>
      </>
    ) : (
      <path fill="#78909C" d="M2 8v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2H15l-2-3H4c-1.1 0-2 .9-2 2z"/>
    )}
  </svg>
);

// Main function to get the appropriate icon component
export function getVSCodeFileIcon(filename: string): React.FC {
  const lowerName = filename.toLowerCase();
  
  // Special filenames first
  if (lowerName === 'package.json') return PackageJsonIcon;
  if (lowerName === 'package-lock.json' || lowerName === 'yarn.lock' || lowerName === 'pnpm-lock.yaml' || lowerName === 'bun.lockb') return LockFileIcon;
  if (lowerName === 'dockerfile' || lowerName === '.dockerignore') return DockerfileIcon;
  if (lowerName === '.gitignore' || lowerName === '.gitattributes') return GitIgnoreIcon;
  if (lowerName.startsWith('.env')) return EnvIcon;
  if (lowerName === 'readme.md') return ReadmeIcon;
  if (lowerName === 'vite.config.js' || lowerName === 'vite.config.ts') return ViteIcon;
  if (lowerName.includes('eslint')) return EslintIcon;
  if (lowerName.includes('tsconfig')) return TypeScriptIcon;
  
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    // Programming Languages
    case 'c': return CFileIcon;
    case 'cpp': case 'cc': case 'cxx': return CppFileIcon;
    case 'h': case 'hpp': return HeaderFileIcon;
    case 'js': case 'mjs': case 'cjs': return JavaScriptIcon;
    case 'ts': return TypeScriptIcon;
    case 'jsx': case 'tsx': return ReactIcon;
    case 'py': return PythonIcon;
    
    // Web
    case 'html': case 'htm': return HtmlIcon;
    case 'css': case 'scss': case 'sass': case 'less': return CssIcon;
    
    // Data/Config
    case 'json': return JsonIcon;
    case 'yaml': case 'yml': return YamlIcon;
    case 'md': case 'markdown': return MarkdownIcon;
    case 'txt': case 'log': return TextFileIcon;
    
    // Images
    case 'svg': return SvgIcon;
    case 'png': case 'jpg': case 'jpeg': case 'gif': case 'webp': case 'ico': case 'bmp': return ImageIcon;
    
    // Fonts
    case 'ttf': case 'otf': case 'woff': case 'woff2': return FontIcon;
    
    // Scripts
    case 'sh': case 'bash': case 'zsh': case 'ps1': case 'bat': case 'cmd': return ShellIcon;
    
    // Binary
    case 'exe': case 'bin': case 'out': case 'o': case 'class': return BinaryIcon;
    
    default: return DefaultFileIcon;
  }
}

export function getVSCodeFolderIcon(folderName: string, isOpen: boolean): React.FC {
  const lowerName = folderName.toLowerCase();
  
  if (lowerName === 'node_modules') return NodeModulesIcon;
  if (lowerName === 'src') return () => <SrcFolderIcon isOpen={isOpen} />;
  if (lowerName === 'public') return () => <PublicFolderIcon isOpen={isOpen} />;
  if (lowerName === 'dist' || lowerName === 'build' || lowerName === 'out') return () => <DistFolderIcon isOpen={isOpen} />;
  
  return () => <FolderIcon isOpen={isOpen} />;
}
