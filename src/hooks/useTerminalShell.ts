import { useState, useCallback, useRef } from 'react';
import { useIDEStore } from '@/store/ideStore';

interface FileSystem {
  [path: string]: { type: 'file' | 'dir'; content?: string };
}

const initialFileSystem: FileSystem = {
  '/': { type: 'dir' },
  '/home': { type: 'dir' },
  '/home/user': { type: 'dir' },
  '/src': { type: 'dir' },
  '/src/main.c': { type: 'file', content: '#include <stdio.h>\nint main() { return 0; }' },
  '/src/utils.c': { type: 'file', content: '// Utility functions' },
  '/input.txt': { type: 'file', content: 'Hello World\nThis is a test file.' },
  '/output.txt': { type: 'file', content: '' },
  '/README.md': { type: 'file', content: '# Project\nWelcome to SliceCode IDE' },
};

const environmentVars: Record<string, string> = {
  HOME: '/home/user',
  USER: 'user',
  SHELL: '/bin/bash',
  PATH: '/usr/local/bin:/usr/bin:/bin',
  PWD: '/home/user',
  LANG: 'en_US.UTF-8',
  TERM: 'xterm-256color',
  EDITOR: 'vim',
};

export function useTerminalShell() {
  const { addTerminalLine } = useIDEStore();
  const [currentDir, setCurrentDir] = useState('/home/user');
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem);
  const [envVars, setEnvVars] = useState(environmentVars);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [aliases, setAliases] = useState<Record<string, string>>({
    ll: 'ls -la',
    la: 'ls -a',
    '..' : 'cd ..',
    '...': 'cd ../..',
  });

  const resolvePath = useCallback((path: string): string => {
    if (path.startsWith('/')) return path;
    if (path.startsWith('~')) return path.replace('~', envVars.HOME);
    
    const parts = currentDir.split('/').filter(Boolean);
    const newParts = path.split('/');
    
    for (const part of newParts) {
      if (part === '..') parts.pop();
      else if (part !== '.') parts.push(part);
    }
    
    return '/' + parts.join('/');
  }, [currentDir, envVars.HOME]);

  const getPrompt = useCallback(() => {
    const dir = currentDir === envVars.HOME ? '~' : currentDir;
    return `${envVars.USER}@slicecode:${dir}$`;
  }, [currentDir, envVars]);

  const executeCommand = useCallback((input: string): void => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add to history
    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);

    // Check for aliases
    let processedInput = trimmedInput;
    const firstWord = trimmedInput.split(' ')[0];
    if (aliases[firstWord]) {
      processedInput = trimmedInput.replace(firstWord, aliases[firstWord]);
    }

    // Parse command and args
    const parts = processedInput.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const cmd = parts[0]?.toLowerCase();
    const args = parts.slice(1).map(a => a.replace(/^["']|["']$/g, ''));

    addTerminalLine({ type: 'input', content: `${getPrompt()} ${trimmedInput}` });

    // Command execution
    switch (cmd) {
      case 'help':
        addTerminalLine({
          type: 'output',
          content: `Available commands:
  help          - Show this help message
  clear         - Clear terminal screen
  ls [path]     - List directory contents
  cd [path]     - Change directory
  pwd           - Print working directory
  cat <file>    - Display file contents
  echo <text>   - Print text to terminal
  mkdir <name>  - Create directory
  touch <file>  - Create empty file
  rm <path>     - Remove file or directory
  cp <src> <dst>- Copy file
  mv <src> <dst>- Move/rename file
  grep <pat> <f>- Search pattern in file
  head <file>   - Show first 10 lines
  tail <file>   - Show last 10 lines
  wc <file>     - Word/line/char count
  date          - Show current date/time
  whoami        - Show current user
  hostname      - Show hostname
  env           - Show environment variables
  export K=V    - Set environment variable
  alias K=V     - Create command alias
  history       - Show command history
  uname [-a]    - System information
  which <cmd>   - Show command location
  man <cmd>     - Manual for command
  exit          - Close terminal session`
        });
        break;

      case 'clear':
        const { clearTerminal } = useIDEStore.getState();
        clearTerminal();
        break;

      case 'ls': {
        const targetPath = args[0] ? resolvePath(args[0]) : currentDir;
        const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
        
        const entries = Object.keys(fileSystem)
          .filter(p => {
            const parent = p.substring(0, p.lastIndexOf('/')) || '/';
            return parent === targetPath && p !== targetPath;
          })
          .map(p => {
            const name = p.split('/').pop() || '';
            const isDir = fileSystem[p].type === 'dir';
            return { name, isDir, path: p };
          })
          .filter(e => showAll || !e.name.startsWith('.'));

        if (entries.length === 0) {
          addTerminalLine({ type: 'output', content: '' });
        } else if (longFormat) {
          const lines = entries.map(e => {
            const perms = e.isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const size = e.isDir ? '4096' : (fileSystem[e.path].content?.length || 0).toString().padStart(4);
            return `${perms}  1 user user ${size} Jan 12 10:00 ${e.isDir ? `\x1b[34m${e.name}\x1b[0m` : e.name}`;
          });
          addTerminalLine({ type: 'output', content: lines.join('\n') });
        } else {
          const output = entries.map(e => e.isDir ? `\x1b[34m${e.name}\x1b[0m` : e.name).join('  ');
          addTerminalLine({ type: 'output', content: output });
        }
        break;
      }

      case 'cd': {
        const target = args[0] || envVars.HOME;
        const newPath = resolvePath(target);
        
        if (fileSystem[newPath]?.type === 'dir') {
          setCurrentDir(newPath);
          setEnvVars(prev => ({ ...prev, PWD: newPath }));
        } else if (fileSystem[newPath]) {
          addTerminalLine({ type: 'error', content: `cd: not a directory: ${target}` });
        } else {
          addTerminalLine({ type: 'error', content: `cd: no such file or directory: ${target}` });
        }
        break;
      }

      case 'pwd':
        addTerminalLine({ type: 'output', content: currentDir });
        break;

      case 'cat': {
        if (!args[0]) {
          addTerminalLine({ type: 'error', content: 'cat: missing file operand' });
          break;
        }
        const filePath = resolvePath(args[0]);
        const file = fileSystem[filePath];
        if (!file) {
          addTerminalLine({ type: 'error', content: `cat: ${args[0]}: No such file or directory` });
        } else if (file.type === 'dir') {
          addTerminalLine({ type: 'error', content: `cat: ${args[0]}: Is a directory` });
        } else {
          addTerminalLine({ type: 'output', content: file.content || '' });
        }
        break;
      }

      case 'echo': {
        let output = args.join(' ');
        // Handle variable expansion
        output = output.replace(/\$(\w+)/g, (_, name) => envVars[name] || '');
        addTerminalLine({ type: 'output', content: output });
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          addTerminalLine({ type: 'error', content: 'mkdir: missing operand' });
          break;
        }
        const newPath = resolvePath(args[0]);
        if (fileSystem[newPath]) {
          addTerminalLine({ type: 'error', content: `mkdir: cannot create directory '${args[0]}': File exists` });
        } else {
          setFileSystem(prev => ({ ...prev, [newPath]: { type: 'dir' } }));
          addTerminalLine({ type: 'output', content: '' });
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          addTerminalLine({ type: 'error', content: 'touch: missing file operand' });
          break;
        }
        const newPath = resolvePath(args[0]);
        if (!fileSystem[newPath]) {
          setFileSystem(prev => ({ ...prev, [newPath]: { type: 'file', content: '' } }));
        }
        addTerminalLine({ type: 'output', content: '' });
        break;
      }

      case 'rm': {
        if (!args[0]) {
          addTerminalLine({ type: 'error', content: 'rm: missing operand' });
          break;
        }
        const targetPath = resolvePath(args[0]);
        const recursive = args.includes('-r') || args.includes('-rf');
        
        if (!fileSystem[targetPath]) {
          addTerminalLine({ type: 'error', content: `rm: cannot remove '${args[0]}': No such file or directory` });
        } else if (fileSystem[targetPath].type === 'dir' && !recursive) {
          addTerminalLine({ type: 'error', content: `rm: cannot remove '${args[0]}': Is a directory` });
        } else {
          setFileSystem(prev => {
            const newFs = { ...prev };
            Object.keys(newFs).forEach(p => {
              if (p === targetPath || p.startsWith(targetPath + '/')) {
                delete newFs[p];
              }
            });
            return newFs;
          });
          addTerminalLine({ type: 'output', content: '' });
        }
        break;
      }

      case 'cp': {
        if (args.length < 2) {
          addTerminalLine({ type: 'error', content: 'cp: missing destination file operand' });
          break;
        }
        const srcPath = resolvePath(args[0]);
        const dstPath = resolvePath(args[1]);
        
        if (!fileSystem[srcPath]) {
          addTerminalLine({ type: 'error', content: `cp: cannot stat '${args[0]}': No such file or directory` });
        } else if (fileSystem[srcPath].type === 'dir') {
          addTerminalLine({ type: 'error', content: `cp: -r not specified; omitting directory '${args[0]}'` });
        } else {
          setFileSystem(prev => ({
            ...prev,
            [dstPath]: { ...prev[srcPath] }
          }));
          addTerminalLine({ type: 'output', content: '' });
        }
        break;
      }

      case 'mv': {
        if (args.length < 2) {
          addTerminalLine({ type: 'error', content: 'mv: missing destination file operand' });
          break;
        }
        const srcPath = resolvePath(args[0]);
        const dstPath = resolvePath(args[1]);
        
        if (!fileSystem[srcPath]) {
          addTerminalLine({ type: 'error', content: `mv: cannot stat '${args[0]}': No such file or directory` });
        } else {
          setFileSystem(prev => {
            const newFs = { ...prev };
            newFs[dstPath] = newFs[srcPath];
            delete newFs[srcPath];
            return newFs;
          });
          addTerminalLine({ type: 'output', content: '' });
        }
        break;
      }

      case 'grep': {
        if (args.length < 2) {
          addTerminalLine({ type: 'error', content: 'grep: missing pattern or file' });
          break;
        }
        const pattern = args[0];
        const filePath = resolvePath(args[1]);
        const file = fileSystem[filePath];
        
        if (!file || file.type === 'dir') {
          addTerminalLine({ type: 'error', content: `grep: ${args[1]}: No such file or directory` });
        } else {
          const lines = (file.content || '').split('\n');
          const matches = lines.filter(l => l.includes(pattern));
          addTerminalLine({ type: 'output', content: matches.join('\n') || '' });
        }
        break;
      }

      case 'head': {
        const filePath = resolvePath(args[0] || '');
        const file = fileSystem[filePath];
        if (!file || file.type === 'dir') {
          addTerminalLine({ type: 'error', content: `head: cannot open '${args[0]}' for reading` });
        } else {
          const lines = (file.content || '').split('\n').slice(0, 10);
          addTerminalLine({ type: 'output', content: lines.join('\n') });
        }
        break;
      }

      case 'tail': {
        const filePath = resolvePath(args[0] || '');
        const file = fileSystem[filePath];
        if (!file || file.type === 'dir') {
          addTerminalLine({ type: 'error', content: `tail: cannot open '${args[0]}' for reading` });
        } else {
          const lines = (file.content || '').split('\n').slice(-10);
          addTerminalLine({ type: 'output', content: lines.join('\n') });
        }
        break;
      }

      case 'wc': {
        const filePath = resolvePath(args[0] || '');
        const file = fileSystem[filePath];
        if (!file || file.type === 'dir') {
          addTerminalLine({ type: 'error', content: `wc: ${args[0]}: No such file or directory` });
        } else {
          const content = file.content || '';
          const lines = content.split('\n').length;
          const words = content.split(/\s+/).filter(Boolean).length;
          const chars = content.length;
          addTerminalLine({ type: 'output', content: `  ${lines}   ${words}  ${chars} ${args[0]}` });
        }
        break;
      }

      case 'date':
        addTerminalLine({ type: 'output', content: new Date().toString() });
        break;

      case 'whoami':
        addTerminalLine({ type: 'output', content: envVars.USER });
        break;

      case 'hostname':
        addTerminalLine({ type: 'output', content: 'slicecode-terminal' });
        break;

      case 'env':
        addTerminalLine({
          type: 'output',
          content: Object.entries(envVars).map(([k, v]) => `${k}=${v}`).join('\n')
        });
        break;

      case 'export': {
        const match = args[0]?.match(/^(\w+)=(.*)$/);
        if (match) {
          setEnvVars(prev => ({ ...prev, [match[1]]: match[2] }));
          addTerminalLine({ type: 'output', content: '' });
        } else {
          addTerminalLine({ type: 'error', content: 'export: invalid syntax' });
        }
        break;
      }

      case 'alias': {
        if (!args[0]) {
          addTerminalLine({
            type: 'output',
            content: Object.entries(aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n')
          });
        } else {
          const match = args[0]?.match(/^(\w+)=(.*)$/);
          if (match) {
            setAliases(prev => ({ ...prev, [match[1]]: match[2] }));
            addTerminalLine({ type: 'output', content: '' });
          }
        }
        break;
      }

      case 'history':
        addTerminalLine({
          type: 'output',
          content: commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n')
        });
        break;

      case 'uname':
        if (args.includes('-a')) {
          addTerminalLine({ type: 'output', content: 'Linux slicecode 5.15.0-generic #1 SMP x86_64 GNU/Linux' });
        } else {
          addTerminalLine({ type: 'output', content: 'Linux' });
        }
        break;

      case 'which': {
        const binaries: Record<string, string> = {
          ls: '/bin/ls', cd: '/bin/cd', cat: '/bin/cat', grep: '/bin/grep',
          node: '/usr/bin/node', npm: '/usr/bin/npm', python: '/usr/bin/python3',
          git: '/usr/bin/git', gcc: '/usr/bin/gcc', vim: '/usr/bin/vim'
        };
        addTerminalLine({ 
          type: 'output', 
          content: binaries[args[0]] || `which: no ${args[0]} in (${envVars.PATH})`
        });
        break;
      }

      case 'man':
        addTerminalLine({
          type: 'output',
          content: `No manual entry for ${args[0] || 'command'}\nTry 'help' for available commands.`
        });
        break;

      case 'exit':
        addTerminalLine({ type: 'system', content: 'Closing session...' });
        useIDEStore.getState().setTerminalConnection({ status: 'disconnected' });
        break;

      // Package managers
      case 'npm': {
        if (args[0] === 'install' || args[0] === 'i') {
          addTerminalLine({ type: 'output', content: 'npm WARN deprecated package@1.0.0\nadded 47 packages in 2.3s' });
        } else if (args[0] === 'run') {
          addTerminalLine({ type: 'output', content: `> ${args[1]}\n> Running script...\nDone.` });
        } else if (args[0] === '--version' || args[0] === '-v') {
          addTerminalLine({ type: 'output', content: '10.2.0' });
        } else {
          addTerminalLine({ type: 'output', content: 'Usage: npm <command>\n\nCommands: install, run, start, test, --version' });
        }
        break;
      }

      case 'node':
        if (args[0] === '--version' || args[0] === '-v') {
          addTerminalLine({ type: 'output', content: 'v20.10.0' });
        } else {
          addTerminalLine({ type: 'output', content: 'Welcome to Node.js v20.10.0.\nType ".help" for more information.' });
        }
        break;

      case 'python':
      case 'python3':
        if (args[0] === '--version') {
          addTerminalLine({ type: 'output', content: 'Python 3.11.0' });
        } else {
          addTerminalLine({ type: 'output', content: 'Python 3.11.0 (main)\nType "help" for more information.' });
        }
        break;

      case 'git': {
        if (args[0] === 'status') {
          addTerminalLine({ type: 'output', content: 'On branch main\nnothing to commit, working tree clean' });
        } else if (args[0] === '--version') {
          addTerminalLine({ type: 'output', content: 'git version 2.42.0' });
        } else {
          addTerminalLine({ type: 'output', content: 'usage: git <command> [<args>]' });
        }
        break;
      }

      case 'gcc':
        if (args[0] === '--version') {
          addTerminalLine({ type: 'output', content: 'gcc (GCC) 13.2.0' });
        } else if (args.length > 0) {
          addTerminalLine({ type: 'output', content: 'Compilation successful.' });
        }
        break;

      case 'curl':
        addTerminalLine({ type: 'output', content: '<!DOCTYPE html>\n<html>...</html>' });
        break;

      case 'ping':
        addTerminalLine({ type: 'output', content: `PING ${args[0] || 'localhost'}: 64 bytes, time=0.045 ms\n--- ping statistics ---\n1 packets transmitted, 1 received, 0% loss` });
        break;

      case 'sleep':
        addTerminalLine({ type: 'system', content: `Sleeping for ${args[0] || 1} seconds...` });
        break;

      case 'uptime':
        addTerminalLine({ type: 'output', content: ' 10:00:00 up 1 day, 2:30, 1 user, load average: 0.15, 0.10, 0.05' });
        break;

      case 'df':
        addTerminalLine({ type: 'output', content: 'Filesystem     Size  Used Avail Use% Mounted on\n/dev/sda1       50G   15G   35G  30% /' });
        break;

      case 'free':
        addTerminalLine({ type: 'output', content: '              total        used        free\nMem:        8192000     4096000     4096000\nSwap:       2048000           0     2048000' });
        break;

      case 'ps':
        addTerminalLine({ type: 'output', content: '  PID TTY          TIME CMD\n    1 pts/0    00:00:00 bash\n  123 pts/0    00:00:00 ps' });
        break;

      case 'top':
        addTerminalLine({ type: 'output', content: 'top - 10:00:00 up 1 day\nTasks: 150 total, 1 running\n%Cpu(s): 5.0 us, 2.0 sy\nMiB Mem: 8192.0 total, 4096.0 free' });
        break;

      default:
        if (cmd) {
          addTerminalLine({ type: 'error', content: `${cmd}: command not found` });
        }
    }
  }, [addTerminalLine, aliases, currentDir, envVars, fileSystem, getPrompt, resolvePath, commandHistory]);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string => {
    if (commandHistory.length === 0) return '';
    
    let newIndex: number;
    if (direction === 'up') {
      newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
    } else {
      newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1);
    }
    
    setHistoryIndex(newIndex);
    return newIndex >= 0 ? commandHistory[newIndex] : '';
  }, [commandHistory, historyIndex]);

  const getAutoComplete = useCallback((partial: string): string[] => {
    const commands = ['help', 'clear', 'ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 'touch', 'rm', 'cp', 'mv', 
      'grep', 'head', 'tail', 'wc', 'date', 'whoami', 'hostname', 'env', 'export', 'alias', 'history',
      'uname', 'which', 'man', 'exit', 'npm', 'node', 'python', 'git', 'gcc', 'curl', 'ping'];
    
    const parts = partial.split(' ');
    if (parts.length === 1) {
      return commands.filter(c => c.startsWith(partial.toLowerCase()));
    }
    
    // File path completion
    const lastPart = parts[parts.length - 1];
    const pathPrefix = resolvePath(lastPart.substring(0, lastPart.lastIndexOf('/') + 1) || currentDir);
    
    return Object.keys(fileSystem)
      .filter(p => p.startsWith(pathPrefix) && p !== pathPrefix)
      .map(p => p.split('/').pop() || '')
      .filter(name => name.startsWith(lastPart.split('/').pop() || ''));
  }, [currentDir, fileSystem, resolvePath]);

  return {
    currentDir,
    getPrompt,
    executeCommand,
    navigateHistory,
    getAutoComplete,
    commandHistory,
    envVars,
  };
}
