import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { Header, Footer, SmoothScroll } from '@/components/layout';
import { FloatingContactBar } from '@/components/public';
import { HeroSection, OverviewSection, AmenitiesSection, GallerySection, ContactSection, SellerSection, PerspectiveSection } from '@/components/sections';
import { trackApi } from '@/lib/api';
import { OverviewSection2 } from './components/sections/OverviewSection2';

const SITE_CONFIG = {
  name: 'Biệt Thự Sola Đảo Ảnh Dương',
  shortName: 'Sola Global City',
  description: 'Dự án biệt thự cao cấp, shophouse tại vị trí đắc địa Quận 2, TP. Hồ Chí Minh. Giá biệt thự từ 8.5 tỷ, shophouse từ 5.2 tỷ.',
  url: 'https://soladaoanhduong.nthanhproperty.fun',
  ogImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
  keywords: 'biệt thự sola đảo ảnh dương, biệt thự sola global city, sola dao anh duong, biệt thự quận 2, shophouse quận 2, bất động sản quận 2',
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
    // Schema is handled in index.html
  }, [location]);
  return null;
}

function Home() {
  return (
    <>
      <Helmet>
        <title>Biệt Thự Sola Đảo Ảnh Dương | Biệt Thự Sola Global City Quận 2 Giá Tốt</title>
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
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
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
