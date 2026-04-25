import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';
import { Header, Footer, SmoothScroll } from '@/components/layout';
import { FloatingContactBar } from '@/components/public';
import { HeroSection, OverviewSection, AmenitiesSection, GallerySection, ContactSection, SellerSection, PerspectiveSection } from '@/components/sections';
import { FAQSection } from '@/components/sections/FAQSection';
import { OverviewSection2 } from './components/sections/OverviewSection2';
import { trackApi } from '@/lib/api';

// Lazy load pages for better performance (code splitting)
const About = lazy(() => import('@/pages/About'));
const Location = lazy(() => import('@/pages/Location'));
const FAQ = lazy(() => import('@/pages/FAQ'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-gray-500">Đang tải...</p>
      </div>
    </div>
  );
}

const SITE_CONFIG = {
  name: 'Biệt Thự Sola Đảo Ảnh Dương',
  shortName: 'Sola Global City',
  description: 'Dự án biệt thự cao cấp, SOLA VILLAS THE GLOBAL CITY BIỂU TƯỢNG VILLA COMPOUND DUY NHẤT TẠI GLOBAL CITY Phân khu Sola - Đảo Ánh Dương nằm trong khu đô thị The Global City',
  url: 'https://soladaoanhduong.nthanhproperty.fun',
  ogImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
  keywords: 'biệt thự sola đảo ảnh dương, Biệt thự Sola, biệt thự sola global city, sola dao anh duong, biệt thự quận 2, Biệt thự Sola The Global City - Đảo Ánh Dương, bất động sản quận 2',
};

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    trackApi.pageview(location.pathname, document.referrer);
  }, [location]);
  return null;
}

function SellerPersonSchema() {
  const location = useLocation();
  useEffect(() => {
  }, [location]);
  return null;
}

function Home() {
  return (
    <>
      <Helmet>
        <title>Biệt Thự Sola Đảo Ảnh Dương | Biệt Thự Sola Global City Quận 2</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <meta name="keywords" content={SITE_CONFIG.keywords} />
        <meta property="og:title" content="Biệt Thự Sola Đảo Ảnh Dương | Biệt Thự Sola Global City Quận 2" />
        <meta property="og:description" content={SITE_CONFIG.description} />
        <meta property="og:image" content={SITE_CONFIG.ogImage} />
        <meta property="og:url" content={SITE_CONFIG.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Biệt Thự Sola Đảo Ảnh Dương | Sola Global City Quận 2" />
        <meta name="twitter:description" content={SITE_CONFIG.description} />
        <meta name="twitter:image" content={SITE_CONFIG.ogImage} />
        <link rel="canonical" href={SITE_CONFIG.url} />
      </Helmet>

      <SellerPersonSchema />

      <HeroSection />
      <SellerSection />
      <PerspectiveSection />
      <OverviewSection />
      <GallerySection />
      <OverviewSection2 />
      <AmenitiesSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <SmoothScroll>
          <a
            href="#main-content"
            className="skip-to-content"
          >
            Skip to main content
          </a>

          <div className="min-h-screen bg-white">
            <Header />
            <main id="main-content">
              <h1 className="sr-only">Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2 | Dự án biệt thự cao cấp TP.HCM</h1>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/location" element={<Location />} />
                  <Route path="/faq" element={<FAQ />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <FloatingContactBar />
          </div>
          <PageTracker />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--foreground))',
                color: 'hsl(var(--background))',
                borderRadius: '0.75rem',
                fontSize: '14px',
              },
            }}
          />
        </SmoothScroll>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
