import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b flex items-center px-4 gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
