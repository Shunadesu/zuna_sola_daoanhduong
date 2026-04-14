import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Header, Footer, SmoothScroll } from '@/components/layout';
import { FloatingContactBar } from '@/components/public';
import { HeroSection, AboutSection, LocationSection, AmenitiesSection, GallerySection, ContactSection } from '@/components/sections';

function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <LocationSection />
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
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <FloatingContactBar />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </SmoothScroll>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
