import {
  FileCode,
  FileText,
  File,
  FileJson,
  FileType,
  Image,
  Settings,
  Database,
  Terminal,
  Package,
  Lock,
  Cloud,
  Globe,
  Palette,
  Music,
  Video,
  Archive,
  Shield,
  Cog,
  Box,
  Braces,
  Hash,
  Coffee,
  Gem,
  Flame,
  Zap,
  Leaf,
  Bird,
  Apple,
  Smartphone,
  Server,
  Container,
  Key,
  FileSpreadsheet,
  BookOpen,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

type FileIconConfig = {
  icon: LucideIcon;
  color: string;
};

// Extension to icon mapping
const extensionIcons: Record<string, FileIconConfig> = {
  // Programming Languages
  c: { icon: FileCode, color: 'text-blue-400' },
  cpp: { icon: FileCode, color: 'text-blue-500' },
  h: { icon: FileCode, color: 'text-purple-400' },
  java: { icon: Coffee, color: 'text-orange-500' },
  js: { icon: Braces, color: 'text-yellow-400' },
  mjs: { icon: Braces, color: 'text-yellow-400' },
  cjs: { icon: Braces, color: 'text-yellow-400' },
  ts: { icon: Braces, color: 'text-blue-500' },
  py: { icon: FileCode, color: 'text-yellow-300' },
  rb: { icon: Gem, color: 'text-red-500' },
  go: { icon: FileCode, color: 'text-cyan-400' },
  rs: { icon: Cog, color: 'text-orange-400' },
  php: { icon: FileCode, color: 'text-indigo-400' },
  swift: { icon: Bird, color: 'text-orange-500' },
  kt: { icon: FileCode, color: 'text-purple-500' },
  dart: { icon: Zap, color: 'text-cyan-500' },
  cs: { icon: FileCode, color: 'text-green-500' },
  scala: { icon: Flame, color: 'text-red-400' },

  // Web / Frontend
  html: { icon: Globe, color: 'text-orange-500' },
  htm: { icon: Globe, color: 'text-orange-500' },
  css: { icon: Palette, color: 'text-blue-500' },
  scss: { icon: Palette, color: 'text-pink-400' },
  sass: { icon: Palette, color: 'text-pink-400' },
  less: { icon: Palette, color: 'text-indigo-400' },
  jsx: { icon: Braces, color: 'text-cyan-400' },
  tsx: { icon: Braces, color: 'text-blue-400' },
  vue: { icon: Leaf, color: 'text-green-500' },
  svelte: { icon: Flame, color: 'text-orange-500' },

  // Data / Config / Markup
  json: { icon: Braces, color: 'text-yellow-500' },
  yaml: { icon: FileText, color: 'text-red-400' },
  yml: { icon: FileText, color: 'text-red-400' },
  xml: { icon: FileCode, color: 'text-orange-400' },
  toml: { icon: FileText, color: 'text-gray-400' },
  ini: { icon: Settings, color: 'text-gray-400' },
  md: { icon: BookOpen, color: 'text-blue-300' },
  txt: { icon: FileText, color: 'text-gray-400' },
  csv: { icon: FileSpreadsheet, color: 'text-green-400' },
  log: { icon: ScrollText, color: 'text-gray-500' },

  // Images / Media
  svg: { icon: Image, color: 'text-yellow-500' },
  png: { icon: Image, color: 'text-purple-400' },
  jpg: { icon: Image, color: 'text-green-400' },
  jpeg: { icon: Image, color: 'text-green-400' },
  webp: { icon: Image, color: 'text-blue-400' },
  gif: { icon: Image, color: 'text-pink-400' },
  ico: { icon: Image, color: 'text-yellow-400' },
  bmp: { icon: Image, color: 'text-orange-400' },
  mp3: { icon: Music, color: 'text-pink-500' },
  wav: { icon: Music, color: 'text-blue-400' },
  mp4: { icon: Video, color: 'text-red-500' },
  webm: { icon: Video, color: 'text-purple-500' },

  // Fonts
  ttf: { icon: FileType, color: 'text-red-400' },
  otf: { icon: FileType, color: 'text-red-400' },
  woff: { icon: FileType, color: 'text-blue-400' },
  woff2: { icon: FileType, color: 'text-blue-400' },

  // Scripts / Shell
  sh: { icon: Terminal, color: 'text-green-400' },
  bash: { icon: Terminal, color: 'text-green-400' },
  zsh: { icon: Terminal, color: 'text-green-500' },
  ps1: { icon: Terminal, color: 'text-blue-500' },
  bat: { icon: Terminal, color: 'text-green-300' },
  cmd: { icon: Terminal, color: 'text-green-300' },

  // Build / Binary / Misc
  exe: { icon: Box, color: 'text-gray-400' },
  bin: { icon: Box, color: 'text-gray-500' },
  out: { icon: Box, color: 'text-green-400' },
  o: { icon: Box, color: 'text-blue-400' },
  class: { icon: Coffee, color: 'text-orange-400' },
  zip: { icon: Archive, color: 'text-yellow-500' },
  tar: { icon: Archive, color: 'text-orange-500' },
  gz: { icon: Archive, color: 'text-red-400' },

  // Environment
  env: { icon: Key, color: 'text-yellow-500' },
};

// Special filename mappings (exact match)
const filenameIcons: Record<string, FileIconConfig> = {
  // Package managers
  'package.json': { icon: Package, color: 'text-green-500' },
  'package-lock.json': { icon: Lock, color: 'text-red-400' },
  'yarn.lock': { icon: Lock, color: 'text-blue-400' },
  'pnpm-lock.yaml': { icon: Lock, color: 'text-orange-400' },
  'bun.lockb': { icon: Lock, color: 'text-pink-400' },

  // TypeScript / Build configs
  'tsconfig.json': { icon: Braces, color: 'text-blue-500' },
  'jsconfig.json': { icon: Braces, color: 'text-yellow-500' },
  'vite.config.js': { icon: Zap, color: 'text-purple-500' },
  'vite.config.ts': { icon: Zap, color: 'text-purple-500' },
  'webpack.config.js': { icon: Box, color: 'text-blue-400' },
  'webpack.config.ts': { icon: Box, color: 'text-blue-400' },
  'next.config.js': { icon: FileCode, color: 'text-white' },
  'next.config.mjs': { icon: FileCode, color: 'text-white' },
  'nuxt.config.js': { icon: Leaf, color: 'text-green-500' },
  'nuxt.config.ts': { icon: Leaf, color: 'text-green-500' },
  'angular.json': { icon: Shield, color: 'text-red-500' },
  'tailwind.config.js': { icon: Palette, color: 'text-cyan-400' },
  'tailwind.config.ts': { icon: Palette, color: 'text-cyan-400' },
  'postcss.config.js': { icon: Settings, color: 'text-red-400' },
  'eslint.config.js': { icon: Shield, color: 'text-purple-500' },
  '.eslintrc': { icon: Shield, color: 'text-purple-500' },
  '.eslintrc.js': { icon: Shield, color: 'text-purple-500' },
  '.eslintrc.json': { icon: Shield, color: 'text-purple-500' },
  '.prettierrc': { icon: Palette, color: 'text-pink-400' },
  'prettier.config.js': { icon: Palette, color: 'text-pink-400' },

  // Docker
  'Dockerfile': { icon: Container, color: 'text-blue-400' },
  'dockerfile': { icon: Container, color: 'text-blue-400' },
  '.dockerignore': { icon: Container, color: 'text-gray-400' },
  'docker-compose.yml': { icon: Container, color: 'text-blue-500' },
  'docker-compose.yaml': { icon: Container, color: 'text-blue-500' },
  'compose.yml': { icon: Container, color: 'text-blue-500' },
  'compose.yaml': { icon: Container, color: 'text-blue-500' },

  // Environment files
  '.env': { icon: Key, color: 'text-yellow-500' },
  '.env.local': { icon: Key, color: 'text-yellow-400' },
  '.env.production': { icon: Key, color: 'text-green-500' },
  '.env.development': { icon: Key, color: 'text-blue-400' },
  '.env.example': { icon: Key, color: 'text-gray-400' },

  // Git
  '.gitignore': { icon: FileText, color: 'text-orange-400' },
  '.gitattributes': { icon: FileText, color: 'text-orange-400' },

  // Server configs
  'Procfile': { icon: Server, color: 'text-purple-500' },
  'nginx.conf': { icon: Server, color: 'text-green-500' },

  // Readme
  'README.md': { icon: BookOpen, color: 'text-blue-400' },
  'readme.md': { icon: BookOpen, color: 'text-blue-400' },
  'LICENSE': { icon: ScrollText, color: 'text-yellow-400' },
  'LICENSE.md': { icon: ScrollText, color: 'text-yellow-400' },

  // Components config
  'components.json': { icon: Box, color: 'text-gray-400' },
};

export function getFileIcon(filename: string): LucideIcon {
  // Check exact filename first
  if (filenameIcons[filename]) {
    return filenameIcons[filename].icon;
  }

  // Check for .env* files
  if (filename.startsWith('.env')) {
    return Key;
  }

  // Get extension
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext && extensionIcons[ext]) {
    return extensionIcons[ext].icon;
  }

  return File;
}

export function getFileColor(filename: string): string {
  // Check exact filename first
  if (filenameIcons[filename]) {
    return filenameIcons[filename].color;
  }

  // Check for .env* files
  if (filename.startsWith('.env')) {
    return 'text-yellow-500';
  }

  // Get extension
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext && extensionIcons[ext]) {
    return extensionIcons[ext].color;
  }

  return 'text-muted-foreground';
}
