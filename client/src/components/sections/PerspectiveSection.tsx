import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';

interface PerspectiveItem {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export function PerspectiveSection() {
  const [perspectives, setPerspectives] = useState<PerspectiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ item: PerspectiveItem; index: number } | null>(null);

  useEffect(() => {
    fetch('/api/perspectives')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPerspectives(data.data);
        }
      })
      .catch((err) => {
        console.error('[PerspectiveSection] Error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox]);

  const openLightbox = (item: PerspectiveItem, index: number) => {
    setLightbox({ item, index });
  };
  const closeLightbox = () => setLightbox(null);

  const navigatePrev = () => {
    if (!lightbox) return;
    const idx = (lightbox.index - 1 + perspectives.length) % perspectives.length;
    setLightbox({ item: perspectives[idx], index: idx });
  };

  const navigateNext = () => {
    if (!lightbox) return;
    const idx = (lightbox.index + 1) % perspectives.length;
    setLightbox({ item: perspectives[idx], index: idx });
  };

  const handleDownload = (src: string, alt: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${alt.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <section id="perspective" className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Phối cảnh
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Phối Cảnh Dự Án
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3 auto-rows-[minmax(80px,auto)]">
            {[...Array(6)].map((_, i) => {
              const spanPatterns = [
               'col-span-2 row-span-2 ',      // 2×2
                'col-span-2 row-span-1 ',       // 2×1
                'col-span-1 row-span-2 ',       // 1×2
                'col-span-1 row-span-1 ',      // 1×1
                'col-span-2 row-span-1 ',       // 2×1
                'col-span-1 row-span-2 ',  
              ];
              return (
                <div
                  key={i}
                  className={`bg-gray-200 rounded-xl animate-pulse ${spanPatterns[i % spanPatterns.length]}`}
                />
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (perspectives.length === 0) {
    return null;
  }

  return (
    <>
      <section id="perspective" className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 btn-gold-shimmer/10 text-primary text-sm font-medium rounded-full mb-4">
              Phối cảnh
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Phối Cảnh Dự Án
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá tổng thể không gian và thiết kế độc đáo của dự án
            </p>
          </motion.div>

          {/* Grid Gallery — varied spans: 2×2, 2×1, 1×2, 1×1, all cells maintain square aspect */}
          <div className="grid grid-cols-4 gap-2 md:gap-3 auto-rows-[minmax(80px,auto)]">
            {perspectives.map((item, idx) => {
              // Span pattern: cycles through sizes to fill the grid evenly
              // Pattern: 2×2, 2×1, 1×2, 1×2, 2×1, 1×1, 2×2, 1×1...
              const spanPatterns = [
                'col-span-2 row-span-2 ',      // 2×2
                'col-span-2 row-span-1 ',       // 2×1
                'col-span-1 row-span-2 ',       // 1×2
                'col-span-1 row-span-1 ',      // 1×1
                'col-span-2 row-span-1 ',       // 2×1
                'col-span-1 row-span-2 ',      // 1×1
              ];
              const spanClass = spanPatterns[idx % spanPatterns.length];
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative overflow-hidden w-full h-full rounded-xl cursor-pointer group ${spanClass}`}
                  onClick={() => openLightbox(item, idx)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
                      <ZoomIn className="w-5 h-5 text-gray-800" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex flex-col"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh phóng to"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-primary" />
                <h3 className="text-white font-semibold text-base md:text-lg">
                  Phối Cảnh Dự Án
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(lightbox.item.imageUrl, lightbox.item.title);
                  }}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Tải ảnh"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Đóng"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Image Area */}
            <div className="flex-1 flex items-center justify-center relative px-4 md:px-8">
              {perspectives.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
                  className="absolute left-2 md:left-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              )}

              <motion.img
                key={lightbox.item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={lightbox.item.imageUrl}
                alt={lightbox.item.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {perspectives.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigateNext(); }}
                  className="absolute right-2 md:right-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                  aria-label="Ảnh sau"
                >
                  <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              )}
            </div>

            {/* Bottom Info */}
            <div className="px-4 md:px-6 py-4 text-center">
              <p className="text-white font-medium text-base md:text-lg">
                {lightbox.item.title}
              </p>
              <p className="text-white/40 text-sm mt-1">
                ← → để chuyển ảnh · ESC để đóng
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
