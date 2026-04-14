import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from '@/components/animated';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    alt: 'Hình ảnh căn hộ',
  },
  {
    src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    alt: 'Phòng khách hiện đại',
  },
  {
    src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    alt: 'Phòng ngủ cao cấp',
  },
  {
    src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    alt: 'Bếp hiện đại',
  },
  {
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    alt: 'Toàn cảnh dự án',
  },
  {
    src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    alt: 'Khu vực sinh hoạt',
  },
];

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const nextImage = () => setSelectedIndex((prev) => (prev! + 1) % galleryImages.length);
  const prevImage = () => setSelectedIndex((prev) => (prev! - 1 + galleryImages.length) % galleryImages.length);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Hình ảnh
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Thư Viện Ảnh
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá không gian sống đẳng cấp qua bộ sưu tập hình ảnh
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.alt}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl cursor-pointer ${
                index === 0 || index === 3 ? 'md:col-span-2' : ''
              }`}
              onClick={() => openLightbox(index)}
            >
              <LazyImage
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                aspectRatio={index === 0 || index === 3 ? '16/9' : '4/3'}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 hover:opacity-100 transition-opacity font-medium">
                  {image.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-8 text-white text-center">
              <p className="text-lg font-medium">{galleryImages[selectedIndex].alt}</p>
              <p className="text-sm text-white/70 mt-1">
                {selectedIndex + 1} / {galleryImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
