import { Files, Search, GitBranch, Play, Terminal, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/store/ideStore';
import type { ActivityItem } from '@/types/ide';

const activities: { id: ActivityItem; icon: React.ElementType; label: string }[] = [
  { id: 'explorer', icon: Files, label: 'Explorer' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'source-control', icon: GitBranch, label: 'Source Control' },
  { id: 'run', icon: Play, label: 'Run and Debug' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'extensions', icon: Puzzle, label: 'Extensions' },
];

export function ActivityBar() {
  const { activeActivity, setActiveActivity, sidebarVisible, toggleSidebar } = useIDEStore();

  const handleActivityClick = (activity: ActivityItem) => {
    if (activeActivity === activity && sidebarVisible) {
      toggleSidebar();
    } else {
      setActiveActivity(activity);
      if (!sidebarVisible) {
        toggleSidebar();
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-12 bg-ide-activityBar border-r border-border py-2 shrink-0">
      {activities.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => handleActivityClick(id)}
          className={cn(
            'w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative',
            activeActivity === id && sidebarVisible && 'text-foreground'
          )}
          title={label}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} />
          {activeActivity === id && sidebarVisible && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />
          )}
        </button>
      ))}
    </div>
  );
}
