import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBannerStore } from '@/store';
import type { Banner } from '@/store/useBannerStore';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export function HeroSection() {
  const { banners, fetchBanners } = useBannerStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const defaultBanners: Banner[] = (banners && banners.length > 0) ? banners : [
    {
      _id: '1',
      title: 'Căn Hộ Cao Cấp',
      subtitle: 'Tại Đảo Ảnh Dương',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80',
      linkUrl: '',
      isActive: true,
      sortOrder: 0,
    },
    {
      _id: '2',
      title: 'Cuộc Sống Hoàn Hảo',
      subtitle: 'Vị trí đắc địa, tiện ích đẳng cấp',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
      linkUrl: '',
      isActive: true,
      sortOrder: 1,
    },
    {
      _id: '3',
      title: 'Đầu Tư Sinh Lời',
      subtitle: 'Cơ hội sở hữu căn hộ mơ ước',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
      linkUrl: '',
      isActive: true,
      sortOrder: 2,
    },
  ];

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-2 !h-2',
          bulletActiveClass: '!bg-white !w-6 !rounded-full',
        }}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="h-full"
      >
        {defaultBanners.map((banner, index) => (
          <SwiperSlide key={banner._id}>
            <div className="relative h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out"
                style={{
                  backgroundImage: `url(${banner.imageUrl})`,
                  transform: `scale(${activeIndex === index ? 1.08 : 1})`,
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                  <AnimatePresence mode="wait">
                    {activeIndex === index && (
                      <motion.div
                        key={banner._id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                      >
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-block px-4 py-2 bg-primary/90 text-white text-sm rounded-full mb-6"
                        >
                          Dự án cao cấp
                        </motion.span>
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight text-balance"
                        >
                          {banner.title}
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-xl md:text-2xl text-white/90 mb-10"
                        >
                          {banner.subtitle}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap gap-4"
                        >
                          <a
                            href="#contact"
                            className="px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
                          >
                            Đăng ký ngay
                          </a>
                          <a
                            href="#about"
                            className="px-8 py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-full hover:bg-white/30 transition-all"
                          >
                            Tìm hiểu thêm
                          </a>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center text-white/70 gap-2">
          <span className="text-xs font-medium tracking-wider uppercase">Cuộn xuống</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-9 border-2 border-white/40 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
