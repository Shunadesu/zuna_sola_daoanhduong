import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Image,
  Trees,
  GalleryHorizontalEnd,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/banners', label: 'Banner', icon: Image },
  { path: '/overviews', label: 'Tổng thể', icon: Image },
  { path: '/galleries', label: 'Thư viện ảnh', icon: GalleryHorizontalEnd },
  { path: '/amenities', label: 'Tiện ích', icon: Trees },
  { path: '/contacts', label: 'Liên hệ', icon: Phone },
  { path: '/quotes', label: 'Yêu cầu báo giá', icon: FileText },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, mobileOpen = false, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const sidebarContent = (
    <div
      className={cn(
        'h-screen bg-card border-r transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <span className="font-bold text-lg text-primary">Sola Admin</span>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-accent transition-colors hidden lg:block"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4" role="navigation" aria-label="Main navigation">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 min-w-[20px]" aria-hidden="true" />
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full btn-gold-shimmer /10 text-primary flex items-center justify-center text-xs font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{user.username}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden lg:flex',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar (drawer) */}
      <aside className="fixed left-0 top-0 z-50 lg:hidden">
        <div className="relative">
          {sidebarContent}
          {mobileOpen && (
            <button
              onClick={onMobileClose}
              className="absolute -right-10 top-4 left-full ml-2 p-2 rounded-lg bg-card border shadow-lg hover:bg-accent transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
