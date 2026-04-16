import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animated';
import {
  Waves,
  Dumbbell,
  Baby,
  ShoppingBag,
  Trees,
  Shield,
  Car,
  Footprints,
  Trophy,
  FlowerIcon,
  IceCream,
} from 'lucide-react';

const amenityIcons: Record<string, React.ReactNode> = {
  '🏊': <Waves className="w-7 h-7" />,
  '🏋️': <Dumbbell className="w-7 h-7" />,
  '🎾': <Trophy className="w-7 h-7" />,
  '🧒': <Baby className="w-7 h-7" />,
  '🛒': <ShoppingBag className="w-7 h-7" />,
  '🌳': <Trees className="w-7 h-7" />,
  '🔒': <Shield className="w-7 h-7" />,
  '🚗': <Car className="w-7 h-7" />,
  '🏃': <Footprints className="w-7 h-7" />,
  '⚽': <Trophy className="w-7 h-7" />,
  '🌺': <FlowerIcon className="w-7 h-7" />,
  '🍦': <IceCream className="w-7 h-7" />,
};

interface AmenityItem {
  icon: string;
  title: string;
  description: string;
  category: string;
}

const amenities: AmenityItem[] = [
  { icon: '🏊', title: 'Hồ bơi', description: 'Hồ bơi vô cực view thành phố', category: 'tiện ích' },
  { icon: '🏋️', title: 'Phòng gym', description: 'Trang thiết bị hiện đại 24/7', category: 'tiện ích' },
  { icon: '🎾', title: 'Sân tennis', description: 'Sân tennis tiêu chuẩn quốc tế', category: 'giải trí' },
  { icon: '🧒', title: 'Khu vui chơi', description: 'Khu vui chơi trẻ em an toàn', category: 'tiện ích' },
  { icon: '🛒', title: 'Trung tâm thương mại', description: 'Shophouse tiện lợi ngay tại dự án', category: 'tiện ích' },
  { icon: '🌳', title: 'Công viên', description: 'Không gian xanh mát rộng 2.000m²', category: 'tiện ích' },
  { icon: '🔒', title: 'Bảo vệ 24/7', description: 'Hệ thống an ninh thông minh', category: 'an ninh' },
  { icon: '🚗', title: 'Bãi đỗ xe', description: 'Hầm đỗ xe thông minh', category: 'tiện ích' },
  { icon: '🏃', title: 'Đường chạy bộ', description: 'Đường dạo quanh dự án 500m', category: 'giải trí' },
  { icon: '⚽', title: 'Sân bóng đá', description: 'Sân bóng mini tiêu chuẩn', category: 'giải trí' },
  { icon: '🌺', title: 'Sky garden', description: 'Vườn trên cao view thành phố', category: 'tiện ích' },
  { icon: '🍦', title: 'Khu BBQ', description: 'Khu vực nướng BBQ ngoài trời', category: 'giải trí' },
];

const categoryTabs = [
  { id: 'all', label: 'Tất cả' },
  { id: 'tiện ích', label: 'Cơ sở vật chất' },
  { id: 'giải trí', label: 'Giải trí' },
  { id: 'an ninh', label: 'An ninh' },
];

export function AmenitiesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAmenities =
    activeCategory === 'all'
      ? amenities
      : amenities.filter((a) => a.category === activeCategory);

  return (
    <section id="amenities" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-12">
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

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredAmenities.map((amenity) => (
            <StaggerItem key={amenity.title}>
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}
                className="group p-5 md:p-6 bg-gray-50 rounded-2xl text-center h-full flex flex-col items-center cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                >
                  {amenityIcons[amenity.icon] || <span className="text-3xl">{amenity.icon}</span>}
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm md:text-base">{amenity.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{amenity.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
