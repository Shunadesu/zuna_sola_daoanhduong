import { motion } from 'framer-motion';
import { MapPin, Train, ShoppingBag, Car } from 'lucide-react';

interface LocationAdvantageSectionProps {
  imageUrl?: string;
}

const locationFeatures = [
  {
    icon: Train,
    title: 'Tuyến Metro Số 4',
    description: 'Kết nối trực tiếp với ga Metro số 4, di chuyển thuận tiện đến mọi khu vực',
    position: 'top-left',
  },
  {
    icon: MapPin,
    title: 'Đại Lộ Võ Văn Kiệt',
    description: 'Nằm trên Đại Lộ Võ Văn Kiệt - tuyến đường huyết mạch kết nối các quận trung tâm',
    position: 'top-right',
  },
  {
    icon: ShoppingBag,
    title: 'Trung Tâm Thương Mại',
    description: 'Gần các trung tâm thương mại lớn: SC VivoCity, Crescent Mall',
    position: 'bottom-left',
  },
  {
    icon: Car,
    title: 'Cao Tốc Trung Lương',
    description: 'Dễ dàng kết nối cao tốc Trung Lương, thuận tiện về miền Tây',
    position: 'bottom-right',
  },
];

export function LocationAdvantageSection({ imageUrl }: LocationAdvantageSectionProps) {
  return (
    <section id="location" className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vị Trí Đắc Địa
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sở hữu vị trí chiến lược tại trái tim Quận 7, kết nối hoàn hảo mọi tiện ích
          </p>
        </motion.div>

        {/* Content Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-8"
        >
          {/* Distance Info */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {[
              { time: '5 phút', place: 'Thảo Điền' },
              { time: '10 phút', place: 'Thủ Thiêm' },
              { time: '20 phút', place: 'Chợ Bến Thành' },
              { time: '30 phút', place: 'Phú Mỹ Hưng' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm">
                  <span className="font-semibold text-primary">{item.time}</span>
                  <span className="text-gray-500"> – {item.place}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Main Description */}
          <div className="text-center space-y-6">
            {/* <p className="text-lg md:text-xl text-gray-600 leading-relaxed italic">
              "Nơi ánh sáng đánh thức từng nhịp sống, nơi thiên nhiên và con người giao hoà trong một bức tranh đầy thi vị."
            </p> */}

            <div className="space-y-4 text-gray-600 max-w-4xl mx-auto">
              <p>
                Giữa trung tâm đô thị sôi động nhất Việt Nam – nơi từng mét vuông đất đều quý như vàng – hiện hữu một bán đảo biệt lập mang tên <span className="font-semibold text-primary">SOLA – Đảo Ánh Dương</span>, được kiến tạo như một bản hoà ca của ánh sáng, thiên nhiên và cảm xúc.
              </p>

              <div className="grid md:grid-cols-3 gap-6 pt-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5">
                  <div className="text-3xl mb-3">🌅</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Buổi Sáng</h4>
                  <p className="text-sm">
                    Những tia nắng đầu tiên khẽ len lỏi qua từng tán cây công viên ven sông. Ánh sáng xuyên qua kẽ lá – năng lượng sống lan tỏa qua ban công, sân thượng.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5">
                  <div className="text-3xl mb-3">🌇</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Buổi Chiều</h4>
                  <p className="text-sm">
                    Mặt trời lặn phía sau toà nhà cao nhất Sài Gòn – Bitexco – tạo nên khung cảnh hoàng hôn rực rỡ như dải lụa ánh sáng trải dài trên mặt nước.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5">
                  <div className="text-3xl mb-3">🌃</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Buổi Tối</h4>
                  <p className="text-sm">
                    SOLA biến thành sân khấu lung linh nơi ánh sáng nhạc nước tại Canal of Love vẽ nên bức hoạ đô thị hiện đại giữa lòng thiên nhiên.
                  </p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed pt-4">
                <span className="text-2xl mr-2">🎶</span>
                Hãy nhắm mắt lại, bạn sẽ nghe thấy tiếng chim hót líu lo, tiếng gió vi vu qua tán cây, tiếng nước chảy róc rách… tất cả hợp xướng nên giai điệu cuộc sống nơi đây – <span className="font-medium text-primary">vừa nhẹ nhàng thư thái, vừa sống động và đầy hứng khởi</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Center Image with Feature Boxes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={imageUrl || 'https://masterisevietnam.com/wp-content/uploads/2025/08/vi-tri-sola-global-city.jpg'}
              alt="Vị trí dự án Sola Đảo Ảnh Dương"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Feature Boxes */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute top-4 left-4 md:top-8 md:left-8 pointer-events-auto"
            >
              <FeatureBox {...locationFeatures[0]} />
            </motion.div>

            {/* Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-4 right-4 md:top-8 md:right-8 pointer-events-auto"
            >
              <FeatureBox {...locationFeatures[1]} />
            </motion.div>

            {/* Bottom Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute bottom-4 left-4 md:bottom-8 md:left-8 pointer-events-auto"
            >
              <FeatureBox {...locationFeatures[2]} />
            </motion.div>

            {/* Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute bottom-4 right-4 md:bottom-8 md:right-8 pointer-events-auto"
            >
              <FeatureBox {...locationFeatures[3]} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureBox({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-primary/10 max-w-[200px] md:max-w-[240px]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
            {title}
          </h3>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
