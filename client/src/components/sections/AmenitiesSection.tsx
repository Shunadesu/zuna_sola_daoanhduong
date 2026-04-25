import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { amenityApi } from '@/lib/api';

interface AmenityImage {
  imageUrl: string;
  sortOrder: number;
}

interface Amenity {
  _id: string;
  name: string;
  images: AmenityImage[];
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export function AmenitiesSection() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await amenityApi.getActive();
        if (res.data?.success) {
          setAmenities(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAmenities();
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeTab]);

  const activeAmenity = amenities[activeTab];
  const images = activeAmenity?.images || [];
  const hasMultipleImages = images.length > 1;

  if (isLoading) {
    return (
      <section id="amenities" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Tiện ích
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tiện Ích Đẳng Cấp
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (amenities.length === 0) {
    return null;
  }

  return (
    <section id="amenities" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Tiện ích
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tiện Ích Đẳng Cấp
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hệ thống tiện ích đồng bộ, mang đến cuộc sống tiện nghi cho cư dân
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
            {amenities.map((amenity, index) => (
              <button
                key={amenity._id}
                onClick={() => setActiveTab(index)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeTab === index
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {amenity.name}
              </button>
            ))}
          </div>
        </div>

        {/* Image Carousel */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
            {images.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={images[activeImageIndex].imageUrl}
                    alt={`Hình ảnh tiện ích ${activeAmenity?.name} - Sola Global City Quận 2 - ${activeAmenity?.description || 'Tiện ích đẳng cấp cho cư dân'}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    loading="lazy"
                    width="1200"
                    height="675"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`
                            w-2.5 h-2.5 rounded-full transition-all
                            ${activeImageIndex === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}
                          `}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>Chưa có hình ảnh</p>
              </div>
            )}
          </div>

          {/* Description */}
          <motion.div
            key={`desc-${activeTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeAmenity?.name}
            </h3>
            {activeAmenity?.description && (
              <p className="text-gray-600 max-w-xl mx-auto">
                {activeAmenity.description}
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
