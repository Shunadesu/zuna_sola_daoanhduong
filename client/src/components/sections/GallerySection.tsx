import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';
import { galleryApi, Gallery } from '@/lib/api';

const categories = [
  { id: 'biệt thự song lập', label: 'Biệt thự song lập', color: 'bg-blue-600', lightColor: 'bg-blue-500' },
  { id: 'biệt thự đơn lập', label: 'Biệt thự đơn lập', color: 'bg-purple-600', lightColor: 'bg-purple-500' },
  { id: 'nhà phố liền kề', label: 'Nhà phố liền kề', color: 'bg-green-600', lightColor: 'bg-green-500' },
];

interface LightboxState {
  image: Gallery;
  index: number;
  category: string;
}

export function GallerySection() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [activeCategory, setActiveCategory] = useState('biệt thự song lập');

  useEffect(() => {
    fetchGalleries();
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

  const fetchGalleries = async () => {
    try {
      const res = await galleryApi.getActive();
      if (res.data?.success) {
        setGalleries(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImagesByCategory = (categoryId: string) =>
    galleries.filter((img) => img.category === categoryId);

  const filteredImages = getImagesByCategory(activeCategory);

  const openLightbox = (image: Gallery, index: number) => {
    setLightbox({ image, index, category: activeCategory });
  };
  const closeLightbox = () => setLightbox(null);

  const getCategoryImages = () => {
    if (!lightbox) return [];
    return galleries.filter((img) => img.category === lightbox.category);
  };

  const navigatePrev = () => {
    if (!lightbox) return;
    const imgs = getCategoryImages();
    const idx = (imgs.findIndex((i) => i._id === lightbox.image._id) - 1 + imgs.length) % imgs.length;
    setLightbox({ image: imgs[idx], index: idx, category: lightbox.category });
  };

  const navigateNext = () => {
    if (!lightbox) return;
    const imgs = getCategoryImages();
    const idx = (imgs.findIndex((i) => i._id === lightbox.image._id) + 1) % imgs.length;
    setLightbox({ image: imgs[idx], index: idx, category: lightbox.category });
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

  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Hình ảnh
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Thư Viện Ảnh
            </h2>
          </div>
          {/* Full-width single skeleton */}
          <div className="w-full">
            <div className="w-full aspect-[16/9] bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (galleries.length === 0) {
    return null;
  }

  return (
    <>
      <section id="gallery" className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 btn-gold-shimmer/10 text-primary text-sm font-medium rounded-full mb-4">
              Hình ảnh
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Thư Viện Ảnh
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá không gian sống đẳng cấp qua bộ sưu tập hình ảnh
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-10">
            <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? `${cat.color} text-white shadow-sm`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full-width single image */}
          {filteredImages.length === 1 ? (
            <motion.div
              key={filteredImages[0]._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full overflow-hidden rounded-xl cursor-pointer group"
              onClick={() => openLightbox(filteredImages[0], 0)}
            >
              <img
                src={filteredImages[0].imageUrl}
                alt={`Hình ảnh ${filteredImages[0].title || 'biệt thự'} - ${activeCategory} Sola Global City Quận 2 - Dự án biệt thự cao cấp`}
                className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                width="1200"
                height="675"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
                  <ZoomIn className="w-5 h-5 text-gray-800" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-4 gap-2 md:gap-3 auto-rows-[minmax(80px,auto)]"
            >
              {filteredImages.map((image, idx) => {
                const spanPatterns = [
                  'col-span-2 row-span-2 aspect-square',
                  'col-span-2 row-span-1 aspect-[2/1]',
                  'col-span-1 row-span-2 aspect-[1/2]',
                  'col-span-1 row-span-1 aspect-square',
                  'col-span-2 row-span-1 aspect-[2/1]',
                  'col-span-1 row-span-1 aspect-square',
                  'col-span-2 row-span-2 aspect-square',
                  'col-span-1 row-span-1 aspect-square',
                  'col-span-2 row-span-1 aspect-[2/1]',
                ];
                const spanClass = spanPatterns[idx % spanPatterns.length];
                return (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`relative overflow-hidden rounded-xl cursor-pointer w-full h-full group ${spanClass}`}
                  onClick={() => openLightbox(image, idx)}
                >
                  <img
                    src={image.imageUrl}
                    alt={`Hình ảnh ${image.title || 'biệt thự'} - ${activeCategory} Sola Global City Quận 2 - Dự án biệt thự cao cấp`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width="800"
                    height="600"
                  />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
                        <ZoomIn className="w-5 h-5 text-gray-800" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
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
                <div className={`w-1 h-6 rounded-full ${currentCat.lightColor}`} />
                <h3 className="text-white font-semibold text-base md:text-lg">
                  {currentCat.label}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(lightbox.image.imageUrl, lightbox.image.title);
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
              {getCategoryImages().length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
                  className="absolute left-2 md:left-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              )}

              <motion.img
                key={lightbox.image._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={lightbox.image.imageUrl}
                alt={`Hình ảnh ${lightbox.image.title || 'biệt thự'} - ${currentCat.label} Sola Global City Quận 2`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {getCategoryImages().length > 1 && (
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
                {lightbox.image.title}
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
