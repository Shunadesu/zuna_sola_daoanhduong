import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Image,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/banners', label: 'Banner', icon: Image },
  { path: '/contacts', label: 'Liên hệ', icon: Phone },
  { path: '/quotes', label: 'Yêu cầu báo giá', icon: FileText },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuthStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <span className="font-bold text-lg text-primary">Sola Admin</span>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  <Icon className="w-5 h-5 min-w-[20px]" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="border-t p-4">
        {!isCollapsed && user && (
          <div className="mb-3 text-sm text-muted-foreground">
            {user.username}
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
