import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Layout } from '@/components/layout/Layout';
import { Analytics } from '@vercel/analytics/react';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import BannerManager from '@/pages/BannerManager';
import ContactManager from '@/pages/ContactManager';
import QuoteManager from '@/pages/QuoteManager';
import OverviewManager from '@/pages/OverviewManager';
import AmenityManager from '@/pages/AmenityManager';
import GalleryManager from '@/pages/GalleryManager';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Layout />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/banners" element={<BannerManager />} />
            <Route path="/contacts" element={<ContactManager />} />
            <Route path="/quotes" element={<QuoteManager />} />
            <Route path="/overviews" element={<OverviewManager />} />
            <Route path="/amenities" element={<AmenityManager />} />
            <Route path="/galleries" element={<GalleryManager />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Analytics />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
