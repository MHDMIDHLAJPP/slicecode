import {
  FileCode,
  FileJson,
  FileText,
  FileType,
  File,
  Image,
  Music,
  Video,
  Database,
  Settings,
  Lock,
  Terminal,
  Coffee,
  Gem,
  Hexagon,
  Box,
  Flame,
  Zap,
  Globe,
  Palette,
  FileSpreadsheet,
  ScrollText,
  FileArchive,
  Folder,
  FolderOpen,
  FolderGit,
  FolderCode,
  Package,
  Server,
  Cloud,
  Cog,
  Shield,
  type LucideIcon
} from 'lucide-react';

// File extension to icon and color mapping
const fileIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  // Programming Languages
  '.c': { icon: FileCode, color: '#A8B9CC' },
  '.cpp': { icon: FileCode, color: '#00599C' },
  '.h': { icon: FileCode, color: '#A8B9CC' },
  '.java': { icon: Coffee, color: '#ED8B00' },
  '.js': { icon: FileCode, color: '#F7DF1E' },
  '.mjs': { icon: FileCode, color: '#F7DF1E' },
  '.cjs': { icon: FileCode, color: '#F7DF1E' },
  '.ts': { icon: FileCode, color: '#3178C6' },
  '.py': { icon: FileCode, color: '#3776AB' },
  '.rb': { icon: Gem, color: '#CC342D' },
  '.go': { icon: FileCode, color: '#00ADD8' },
  '.rs': { icon: Cog, color: '#DEA584' },
  '.php': { icon: FileCode, color: '#777BB4' },
  '.swift': { icon: Flame, color: '#FA7343' },
  '.kt': { icon: FileCode, color: '#7F52FF' },
  '.dart': { icon: Zap, color: '#00B4AB' },
  '.cs': { icon: FileCode, color: '#512BD4' },
  '.scala': { icon: FileCode, color: '#DC322F' },

  // Web / Frontend
  '.html': { icon: Globe, color: '#E34F26' },
  '.htm': { icon: Globe, color: '#E34F26' },
  '.css': { icon: Palette, color: '#1572B6' },
  '.scss': { icon: Palette, color: '#CC6699' },
  '.sass': { icon: Palette, color: '#CC6699' },
  '.less': { icon: Palette, color: '#1D365D' },
  '.jsx': { icon: FileCode, color: '#61DAFB' },
  '.tsx': { icon: FileCode, color: '#3178C6' },
  '.vue': { icon: FileCode, color: '#4FC08D' },
  '.svelte': { icon: Flame, color: '#FF3E00' },

  // Data / Config / Markup
  '.json': { icon: FileJson, color: '#F7DF1E' },
  '.yaml': { icon: FileText, color: '#CB171E' },
  '.yml': { icon: FileText, color: '#CB171E' },
  '.xml': { icon: FileCode, color: '#0060AC' },
  '.toml': { icon: FileText, color: '#9C4121' },
  '.ini': { icon: Settings, color: '#6D8086' },
  '.md': { icon: ScrollText, color: '#083FA1' },
  '.txt': { icon: FileText, color: '#6D8086' },
  '.csv': { icon: FileSpreadsheet, color: '#217346' },
  '.log': { icon: Terminal, color: '#6D8086' },

  // Images / Media
  '.svg': { icon: Image, color: '#FFB13B' },
  '.png': { icon: Image, color: '#89CFF0' },
  '.jpg': { icon: Image, color: '#89CFF0' },
  '.jpeg': { icon: Image, color: '#89CFF0' },
  '.webp': { icon: Image, color: '#89CFF0' },
  '.gif': { icon: Image, color: '#89CFF0' },
  '.ico': { icon: Image, color: '#89CFF0' },
  '.bmp': { icon: Image, color: '#89CFF0' },
  '.mp3': { icon: Music, color: '#FF5722' },
  '.wav': { icon: Music, color: '#FF5722' },
  '.mp4': { icon: Video, color: '#9C27B0' },
  '.webm': { icon: Video, color: '#9C27B0' },

  // Fonts
  '.ttf': { icon: FileType, color: '#FF6B6B' },
  '.otf': { icon: FileType, color: '#FF6B6B' },
  '.woff': { icon: FileType, color: '#FF6B6B' },
  '.woff2': { icon: FileType, color: '#FF6B6B' },

  // Scripts / Shell
  '.sh': { icon: Terminal, color: '#4EAA25' },
  '.bash': { icon: Terminal, color: '#4EAA25' },
  '.zsh': { icon: Terminal, color: '#4EAA25' },
  '.ps1': { icon: Terminal, color: '#012456' },
  '.bat': { icon: Terminal, color: '#C1F12E' },
  '.cmd': { icon: Terminal, color: '#C1F12E' },

  // Build / Binary / Misc
  '.exe': { icon: Box, color: '#6D8086' },
  '.bin': { icon: Box, color: '#6D8086' },
  '.out': { icon: Box, color: '#6D8086' },
  '.o': { icon: Box, color: '#6D8086' },
  '.class': { icon: Coffee, color: '#ED8B00' },
  '.zip': { icon: FileArchive, color: '#FFC107' },
  '.tar': { icon: FileArchive, color: '#FFC107' },
  '.gz': { icon: FileArchive, color: '#FFC107' },
  '.rar': { icon: FileArchive, color: '#FFC107' },
  '.7z': { icon: FileArchive, color: '#FFC107' },

  // Database
  '.sql': { icon: Database, color: '#336791' },
  '.db': { icon: Database, color: '#336791' },
  '.sqlite': { icon: Database, color: '#003B57' },

  // Environment / Security
  '.env': { icon: Lock, color: '#ECD53F' },
  '.pem': { icon: Shield, color: '#CB171E' },
  '.key': { icon: Shield, color: '#CB171E' },
  '.cert': { icon: Shield, color: '#CB171E' },
};

// Special filename mappings
const specialFileMap: Record<string, { icon: LucideIcon; color: string }> = {
  'package.json': { icon: Package, color: '#CB3837' },
  'package-lock.json': { icon: Package, color: '#CB3837' },
  'yarn.lock': { icon: Package, color: '#2C8EBB' },
  'pnpm-lock.yaml': { icon: Package, color: '#F69220' },
  'tsconfig.json': { icon: Settings, color: '#3178C6' },
  'vite.config.js': { icon: Zap, color: '#646CFF' },
  'vite.config.ts': { icon: Zap, color: '#646CFF' },
  'webpack.config.js': { icon: Box, color: '#8DD6F9' },
  'next.config.js': { icon: Hexagon, color: '#000000' },
  'next.config.mjs': { icon: Hexagon, color: '#000000' },
  'nuxt.config.js': { icon: Hexagon, color: '#00DC82' },
  'nuxt.config.ts': { icon: Hexagon, color: '#00DC82' },
  'angular.json': { icon: Shield, color: '#DD0031' },
  'dockerfile': { icon: Server, color: '#2496ED' },
  '.dockerignore': { icon: Server, color: '#2496ED' },
  'docker-compose.yml': { icon: Server, color: '#2496ED' },
  'docker-compose.yaml': { icon: Server, color: '#2496ED' },
  '.env.local': { icon: Lock, color: '#ECD53F' },
  '.env.production': { icon: Lock, color: '#ECD53F' },
  '.env.development': { icon: Lock, color: '#ECD53F' },
  'procfile': { icon: Cloud, color: '#430098' },
  'nginx.conf': { icon: Server, color: '#009639' },
  '.gitignore': { icon: FolderGit, color: '#F05032' },
  '.gitattributes': { icon: FolderGit, color: '#F05032' },
  'readme.md': { icon: ScrollText, color: '#083FA1' },
  'license': { icon: ScrollText, color: '#D4AF37' },
  'license.md': { icon: ScrollText, color: '#D4AF37' },
  'changelog.md': { icon: ScrollText, color: '#4FC08D' },
};

// Folder name to icon and color mapping
const folderIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  'node_modules': { icon: Package, color: '#CB3837' },
  'src': { icon: FolderCode, color: '#42A5F5' },
  'source': { icon: FolderCode, color: '#42A5F5' },
  'lib': { icon: FolderCode, color: '#7E57C2' },
  'public': { icon: Globe, color: '#4CAF50' },
  'assets': { icon: Image, color: '#FF9800' },
  'images': { icon: Image, color: '#FF9800' },
  'img': { icon: Image, color: '#FF9800' },
  'components': { icon: Box, color: '#61DAFB' },
  'pages': { icon: FileText, color: '#9C27B0' },
  'views': { icon: FileText, color: '#9C27B0' },
  'hooks': { icon: Zap, color: '#FFC107' },
  'utils': { icon: Cog, color: '#607D8B' },
  'helpers': { icon: Cog, color: '#607D8B' },
  'services': { icon: Cloud, color: '#03A9F4' },
  'api': { icon: Server, color: '#4CAF50' },
  'store': { icon: Database, color: '#673AB7' },
  'stores': { icon: Database, color: '#673AB7' },
  'state': { icon: Database, color: '#673AB7' },
  'styles': { icon: Palette, color: '#E91E63' },
  'css': { icon: Palette, color: '#1572B6' },
  'config': { icon: Settings, color: '#78909C' },
  'configs': { icon: Settings, color: '#78909C' },
  'test': { icon: Shield, color: '#8BC34A' },
  'tests': { icon: Shield, color: '#8BC34A' },
  '__tests__': { icon: Shield, color: '#8BC34A' },
  'spec': { icon: Shield, color: '#8BC34A' },
  'dist': { icon: Box, color: '#FF5722' },
  'build': { icon: Box, color: '#FF5722' },
  'out': { icon: Box, color: '#FF5722' },
  '.git': { icon: FolderGit, color: '#F05032' },
  '.github': { icon: FolderGit, color: '#181717' },
  '.vscode': { icon: Settings, color: '#007ACC' },
  'docker': { icon: Server, color: '#2496ED' },
  'scripts': { icon: Terminal, color: '#4EAA25' },
  'types': { icon: FileCode, color: '#3178C6' },
  'interfaces': { icon: FileCode, color: '#3178C6' },
  'models': { icon: Database, color: '#FF9800' },
  'controllers': { icon: Cog, color: '#009688' },
  'routes': { icon: Globe, color: '#4CAF50' },
  'middleware': { icon: Shield, color: '#795548' },
  'plugins': { icon: Zap, color: '#9C27B0' },
  'modules': { icon: Package, color: '#3F51B5' },
  'locales': { icon: Globe, color: '#2196F3' },
  'i18n': { icon: Globe, color: '#2196F3' },
  'fonts': { icon: FileType, color: '#FF6B6B' },
  'icons': { icon: Image, color: '#FFC107' },
  'layouts': { icon: Box, color: '#00BCD4' },
  'templates': { icon: FileText, color: '#8BC34A' },
  'docs': { icon: ScrollText, color: '#2196F3' },
  'documentation': { icon: ScrollText, color: '#2196F3' },
  'vendor': { icon: Package, color: '#607D8B' },
  'packages': { icon: Package, color: '#673AB7' },
  'bin': { icon: Terminal, color: '#4EAA25' },
  'backup': { icon: FileArchive, color: '#FFC107' },
  'logs': { icon: Terminal, color: '#78909C' },
  'tmp': { icon: Folder, color: '#9E9E9E' },
  'temp': { icon: Folder, color: '#9E9E9E' },
  'cache': { icon: Database, color: '#9E9E9E' },
};

export function getFileIcon(fileName: string): LucideIcon {
  const lowerName = fileName.toLowerCase();
  
  // Check special files first
  if (specialFileMap[lowerName]) {
    return specialFileMap[lowerName].icon;
  }
  
  // Get extension
  const ext = '.' + lowerName.split('.').pop();
  if (fileIconMap[ext]) {
    return fileIconMap[ext].icon;
  }
  
  return File;
}

export function getFileColor(fileName: string): string {
  const lowerName = fileName.toLowerCase();
  
  // Check special files first
  if (specialFileMap[lowerName]) {
    return specialFileMap[lowerName].color;
  }
  
  // Get extension
  const ext = '.' + lowerName.split('.').pop();
  if (fileIconMap[ext]) {
    return fileIconMap[ext].color;
  }
  
  return '#6D8086';
}

export function getFolderIcon(folderName: string, isOpen: boolean = false): LucideIcon {
  const lowerName = folderName.toLowerCase();
  
  if (folderIconMap[lowerName]) {
    return folderIconMap[lowerName].icon;
  }
  
  return isOpen ? FolderOpen : Folder;
}

export function getFolderColor(folderName: string): string {
  const lowerName = folderName.toLowerCase();
  
  if (folderIconMap[lowerName]) {
    return folderIconMap[lowerName].color;
  }
  
  return '#90A4AE';
}
