import { Menu, Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  onToggleSidebar?: () => void;
  title: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function Header({ onMenuClick, title, onRefresh, refreshing }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b flex items-center px-4 gap-3 sticky top-0 z-20">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <h1 className="text-lg font-semibold lg:text-xl flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  );
}
