import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';
import { LazyImage } from '@/components/animated';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', alt: 'Hình ảnh căn hộ', category: 'căn hộ' },
  { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', alt: 'Phòng khách hiện đại', category: 'nội thất' },
  { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', alt: 'Phòng ngủ cao cấp', category: 'nội thất' },
  { src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', alt: 'Bếp hiện đại', category: 'nội thất' },
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', alt: 'Toàn cảnh dự án', category: 'căn hộ' },
  { src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', alt: 'Khu vực sinh hoạt', category: 'tiện ích' },
  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', alt: 'Hồ bơi', category: 'tiện ích' },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', alt: 'Mặt bằng dự án', category: 'căn hộ' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Khu vườn', category: 'tiện ích' },
  { src: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80', alt: 'Khu gym', category: 'tiện ích' },
  { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', alt: 'Phòng làm việc', category: 'nội thất' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Phòng tắm', category: 'nội thất' },
];

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'căn hộ', label: 'Căn hộ' },
  { id: 'nội thất', label: 'Nội thất' },
  { id: 'tiện ích', label: 'Tiện ích' },
];

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages =
    activeCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const handlePrev = () =>
    setSelectedIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
  const handleNext = () =>
    setSelectedIndex((prev) => (prev! + 1) % filteredImages.length);

  const handleDownload = (src: string, alt: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${alt.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
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

        {/* Category Filter */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                index === 0 || index === 4 ? 'md:col-span-2' : ''
              }`}
              onClick={() => openLightbox(index)}
            >
              <LazyImage
                src={image.src}
                alt={image.alt}
                className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                aspectRatio={index === 0 || index === 4 ? '16/9' : '4/3'}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                  <ZoomIn className="w-5 h-5 text-gray-800" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs font-medium truncate">{image.alt}</p>
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
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Download */}
            <button
              className="absolute top-4 right-16 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(filteredImages[selectedIndex].src, filteredImages[selectedIndex].alt);
              }}
              aria-label="Download image"
            >
              <Download className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={filteredImages[selectedIndex].src}
              alt={filteredImages[selectedIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 text-white text-center w-full">
              <p className="text-base font-medium">{filteredImages[selectedIndex].alt}</p>
              <p className="text-sm text-white/60 mt-1">
                {selectedIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
