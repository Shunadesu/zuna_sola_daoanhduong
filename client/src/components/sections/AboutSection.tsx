import { motion } from 'framer-motion';
import { FadeInUp, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/animated';

const features = [
  {
    icon: '🏠',
    value: 500,
    suffix: '+',
    label: 'Căn hộ',
    description: 'Đa dạng loại hình',
  },
  {
    icon: '📐',
    value: 50,
    suffix: 'm²',
    label: 'Diện tích',
    description: 'Từ 50-150m²',
  },
  {
    icon: '🌳',
    value: 60,
    suffix: '%',
    label: 'Cây xanh',
    description: 'Không gian xanh',
  },
  {
    icon: '🏊',
    value: 20,
    suffix: '+',
    label: 'Tiện ích',
    description: 'Tiện nghi đẳng cấp',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <FadeInUp>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Về dự án
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Sola Đảo Ảnh Dương
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Dự án căn hộ cao cấp tại vị trí đắc địa bậc nhất, mang đến cuộc sống hoàn hảo cho cư dân với hệ thống tiện ích đẳng cấp 5 sao.
              </p>
              <p className="text-gray-600 mb-8">
                Với thiết kế hiện đại, không gian xanh mát và tầm nhìn panorama tuyệt đẹp, Sola Đảo Ảnh Dương là lựa chọn hoàn hảo cho những ai tìm kiếm cuộc sống chất lượng.
              </p>
            </FadeInUp>

            <StaggerContainer className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <StaggerItem key={feature.label}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-6 bg-gray-50 rounded-2xl"
                  >
                    <span className="text-4xl mb-4 block">{feature.icon}</span>
                    <div className="text-3xl font-bold text-primary mb-1">
                      <AnimatedCounter target={feature.value} suffix={feature.suffix} />
                    </div>
                    <p className="font-semibold text-gray-900">{feature.label}</p>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Images */}
          <div className="relative">
            <FadeInUp delay={0.2}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                  alt="Sola Building"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl"
                >
                  <div className="text-4xl font-bold text-primary mb-1">10+</div>
                  <p className="text-gray-600">Năm kinh nghiệm</p>
                </motion.div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
