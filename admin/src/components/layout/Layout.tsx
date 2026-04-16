import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/banners': 'Quản lý Banner',
  '/contacts': 'Quản lý Liên hệ',
  '/quotes': 'Yêu cầu báo giá',
};

const pagePaths: Record<string, { label: string; path: string }[]> = {
  '/': [],
  '/banners': [{ label: 'Quản lý Banner', path: '/banners' }],
  '/contacts': [{ label: 'Quản lý Liên hệ', path: '/contacts' }],
  '/quotes': [{ label: 'Yêu cầu báo giá', path: '/quotes' }],
};

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin';
  const breadcrumbs = pagePaths[location.pathname] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'transition-all duration-300',
          'hidden lg:block',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={title}
        />

        <main className="p-6">
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  <span className={i === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                    {crumb.label}
                  </span>
                </span>
              ))}
            </nav>
          )}

          <Outlet />
        </main>
      </div>

      {/* Mobile: full-width content */}
      <div
        className={cn(
          'lg:hidden transition-all duration-300',
          mobileOpen ? 'ml-0' : ''
        )}
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          title={title}
        />

        <main className="p-4">
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  <span className={i === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                    {crumb.label}
                  </span>
                </span>
              ))}
            </nav>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
