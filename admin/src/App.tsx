import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Layout } from '@/components/layout/Layout';
import { Analytics } from '@vercel/analytics/react';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import BannerManager from '@/pages/BannerManager';
import ContactManager from '@/pages/ContactManager';
import QuoteManager from '@/pages/QuoteManager';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/banners" element={<BannerManager />} />
          <Route path="/contacts" element={<ContactManager />} />
          <Route path="/quotes" element={<QuoteManager />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
