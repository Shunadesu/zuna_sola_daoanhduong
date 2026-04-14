import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animated';

const highlights = [
  'Kết nối trung tâm thành phố trong 15 phút',
  'Gần trường học, bệnh viện quốc tế',
  'Hệ thống giao thông công cộng thuận tiện',
  'Tầm view không chắn tứ phía',
];

export function LocationSection() {
  return (
    <section id="location" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Vị trí
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Vị Trí Đắc Địa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tọa lạc tại vị trí chiến lược, dễ dàng kết nối đến mọi điểm đến trong thành phố
          </p>
        </FadeInUp>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <FadeInUp>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                alt="Location Map"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Đảo Ảnh Dương</p>
                    <p className="text-white/80 text-sm">Quận 7, TP. Hồ Chí Minh</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Location Info */}
          <div>
            <StaggerContainer className="space-y-6">
              <StaggerItem>
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">Đường Đại Lộ Võ Văn Kiệt, Quận 7, TP. Hồ Chí Minh</p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hotline</h3>
                    <p className="text-gray-600">0909 123 456</p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Giờ mở cửa</h3>
                    <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                    <p className="text-gray-600">Thứ 7 - CN: 9:00 - 17:00</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <FadeInUp delay={0.4}>
              <div className="mt-8 p-6 bg-primary/5 rounded-2xl">
                <h4 className="font-semibold text-gray-900 mb-4">Điểm nổi bật</h4>
                <ul className="space-y-3">
                  {highlights.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
