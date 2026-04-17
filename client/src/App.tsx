import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { Header, Footer, SmoothScroll } from '@/components/layout';
import { FloatingContactBar } from '@/components/public';
import { HeroSection, OverviewSection, LocationAdvantageSection, LocationSection, AmenitiesSection, GallerySection, ContactSection } from '@/components/sections';
import { trackApi } from '@/lib/api';

const SITE_CONFIG = {
  name: 'Sola Đảo Ảnh Dương',
  description: 'Dự án căn hộ cao cấp tại Đảo Ảnh Dương, Quận 7, TP. Hồ Chí Minh. Vị trí đắc địa, tiện ích đẳng cấp.',
  url: 'https://sola.vn',
  phone: '0909 123 456',
  email: 'info@sola.vn',
  address: 'Đường Đại Lộ Võ Văn Kiệt, Quận 7, TP. Hồ Chí Minh',
  ogImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
};

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    trackApi.pageview(location.pathname, document.referrer);
  }, [location]);
  return null;
}

function Home() {
  return (
    <>
      <Helmet>
        <title>{SITE_CONFIG.name} | Căn Hộ Cao Cấp Quận 7</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <meta name="keywords" content="căn hộ cao cấp, đảo ảnh dương, quận 7, bất động sản, hồ chí minh" />
        <meta property="og:title" content={`${SITE_CONFIG.name} | Căn Hộ Cao Cấp`} />
        <meta property="og:description" content={SITE_CONFIG.description} />
        <meta property="og:image" content={SITE_CONFIG.ogImage} />
        <meta property="og:url" content={SITE_CONFIG.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_CONFIG.name} />
        <meta name="twitter:description" content={SITE_CONFIG.description} />
        <meta name="twitter:image" content={SITE_CONFIG.ogImage} />
        <link rel="canonical" href={SITE_CONFIG.url} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: SITE_CONFIG.name,
            description: SITE_CONFIG.description,
            url: SITE_CONFIG.url,
            telephone: SITE_CONFIG.phone,
            email: SITE_CONFIG.email,
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Đường Đại Lộ Võ Văn Kiệt',
              addressLocality: 'Quận 7',
              addressRegion: 'TP. Hồ Chí Minh',
              addressCountry: 'VN',
            },
          })}
        </script>
      </Helmet>

      <HeroSection />
      <LocationAdvantageSection />
      <OverviewSection />
      <AmenitiesSection />
      <GallerySection />
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
