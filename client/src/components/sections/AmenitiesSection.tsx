import { motion } from 'framer-motion';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animated';

const amenities = [
  { icon: '🏊', title: 'Hồ bơi', description: 'Hồ bơi vô cực view thành phố' },
  { icon: '🏋️', title: 'Phòng gym', description: 'Trang thiết bị hiện đại 24/7' },
  { icon: '🎾', title: 'Sân tennis', description: 'Sân tennis tiêu chuẩn quốc tế' },
  { icon: '🧒', title: 'Khu vui chơi', description: 'Khu vui chơi trẻ em an toàn' },
  { icon: '🛒', title: 'Trung tâm thương mại', description: 'Shophouse tiện lợi ngay tại dự án' },
  { icon: '🌳', title: 'Công viên', description: 'Không gian xanh mát rộng 2.000m²' },
  { icon: '🔒', title: 'Bảo vệ 24/7', description: 'Hệ thống an ninh thông minh' },
  { icon: '🚗', title: 'Bãi đỗ xe', description: 'Hầm đỗ xe thông minh' },
];

export function AmenitiesSection() {
  return (
    <section id="amenities" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Tiện ích
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tiện Ích Đẳng Cấp
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hệ thống tiện ích đồng bộ, mang đến cuộc sống tiện nghi cho cư dân
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <StaggerItem key={amenity.title}>
              <motion.div
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="p-6 bg-gray-50 rounded-2xl text-center h-full flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-5xl mb-4"
                >
                  {amenity.icon}
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">{amenity.title}</h3>
                <p className="text-sm text-gray-500">{amenity.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
