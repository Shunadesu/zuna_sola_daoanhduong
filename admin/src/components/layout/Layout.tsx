import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/banners': 'Quản lý Banner',
  '/contacts': 'Quản lý Liên hệ',
  '/quotes': 'Yêu cầu báo giá',
};

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={title}
        />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
