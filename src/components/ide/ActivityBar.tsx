import { Files, Search, GitBranch, Play, Terminal, Puzzle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { ActivityItem } from '@/types/ide';

const activities: { id: ActivityItem; icon: React.ElementType; label: string }[] = [
  { id: 'explorer', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'source-control', icon: GitBranch, label: 'Source Control' },
  { id: 'run', icon: Play, label: 'Run and Debug' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'extensions', icon: Puzzle, label: 'Extensions' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface ActivityBarProps {
  onOpenSettings: () => void;
}

export function ActivityBar({ onOpenSettings }: ActivityBarProps) {
  const { activeActivity, setActiveActivity, sidebarVisible, toggleSidebar } = useIDEStore();
  const { compactMode } = useSettingsStore();

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity === 'settings') {
      onOpenSettings();
      return;
    }
    
    if (activeActivity === activity && sidebarVisible) {
      toggleSidebar();
    } else {
      setActiveActivity(activity);
      if (!sidebarVisible) {
        toggleSidebar();
      }
    }
  };

  const mainActivities = activities.filter(a => a.id !== 'settings');
  const settingsActivity = activities.find(a => a.id === 'settings')!;

  return (
    <div className={cn(
      'flex flex-col items-center bg-ide-activityBar border-r border-border shrink-0',
      compactMode ? 'w-10 py-1' : 'w-12 py-2'
    )}>
      <div className="flex-1 flex flex-col">
        {mainActivities.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleActivityClick(id)}
            className={cn(
              'flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative',
              compactMode ? 'w-10 h-10' : 'w-12 h-12',
              activeActivity === id && sidebarVisible && 'text-foreground'
            )}
            title={label}
          >
            <Icon className={cn(compactMode ? 'w-4 h-4' : 'w-5 h-5')} strokeWidth={1.5} />
            {activeActivity === id && sidebarVisible && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />
            )}
          </button>
        ))}
      </div>
      
      {/* Settings at bottom */}
      <button
        onClick={() => handleActivityClick('settings')}
        className={cn(
          'flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors',
          compactMode ? 'w-10 h-10' : 'w-12 h-12'
        )}
        title={settingsActivity.label}
      >
        <settingsActivity.icon className={cn(compactMode ? 'w-4 h-4' : 'w-5 h-5')} strokeWidth={1.5} />
      </button>
    </div>
  );
}
