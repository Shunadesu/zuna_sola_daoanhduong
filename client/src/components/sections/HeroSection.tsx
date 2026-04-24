import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { bannerApi } from '@/lib/api';
import type { Banner } from '@/lib/api';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const DEFAULT_BANNERS: Banner[] = [
  {
    _id: '1',
    title: 'Căn Hộ Cao Cấp',
    subtitle: 'Tại Đảo Ảnh Dương',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80',
    linkUrl: '',
    isActive: true,
    sortOrder: 0,
    createdAt: '',
  },
  {
    _id: '2',
    title: 'Cuộc Sống Hoàn Hảo',
    subtitle: 'Vị trí đắc địa, tiện ích đẳng cấp',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
    linkUrl: '',
    isActive: true,
    sortOrder: 1,
    createdAt: '',
  },
  {
    _id: '3',
    title: 'Đầu Tư Sinh Lời',
    subtitle: 'Cơ hội sở hữu căn hộ mơ ước',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    linkUrl: '',
    isActive: true,
    sortOrder: 2,
    createdAt: '',
  },
];

export function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerApi.getActive();
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        setBanners(data);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;

  if (isLoading) {
    return (
      <section className="relative h-screen bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block w-48 h-8 bg-gray-200 rounded-full mb-6 mx-auto" />
              <div className="w-80 md:w-96 h-16 bg-gray-200 rounded-lg mx-auto mb-4" />
              <div className="w-64 h-8 bg-gray-200 rounded-lg mx-auto mb-10" />
              <div className="flex justify-center gap-4">
                <div className="w-36 h-12 bg-gray-200 rounded-full" />
                <div className="w-36 h-12 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/TVC Branding 2 phut_master.mov" type="video/quicktime" />
          <source src="/TVC Branding 2 phut_master.mp4" type="video/mp4" />
        </video>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />

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
        className="h-full z-[2]"
      >
        {currentBanners.map((banner, index) => (
          <SwiperSlide key={banner._id}>
            <div className="relative h-full">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out"
                style={{
                  backgroundImage: `url(${banner.imageUrl})`,
                  transform: `scale(${activeIndex === index ? 1.08 : 1})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

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
                        className="max-w-3xl mx-auto text-center"
                      >
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-block px-4 py-2 badge-white text-sm rounded-full mb-6 font-medium"
                        >
                          Sola Đảo Ánh Dương
                        </motion.span>
                        <motion.h1
                          itemProp="name"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-4xl md:text-5xl lg:text-6xl font-bold text-shimmer-gold mb-4 leading-tight text-balance"
                        >
                          Biệt Thự Sola Đảo Ánh Dương - Sola The Global City
                        </motion.h1>
                        <motion.h2
                          itemProp="description"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg md:text-xl italic text-white/90 mb-10"
                        >
                          Dự án biệt thự cao cấp Quận 2 · Hotline: 0845 228 379
                        </motion.h2>
                        {/* <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap gap-4"
                        >
                          <a
                            href="#contact"
                            className="px-8 py-4 bg-white font-semibold rounded-full transition-all shadow-lg  hover:-translate-y-0.5"
                          >
                            Đăng ký ngay
                          </a>
                          <a
                            href="#about"
                            className="px-8 py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-full hover:bg-white/30 transition-all"
                          >
                            Tìm hiểu thêm
                          </a>
                        </motion.div> */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center text-white gap-2">
          <span className="text-xs font-medium tracking-wider uppercase">Cuộn xuống</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-9 border-2 border-white/60 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/80 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
    </>
  );
}
