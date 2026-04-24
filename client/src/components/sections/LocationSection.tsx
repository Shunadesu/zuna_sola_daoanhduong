import { useState } from 'react';
import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animated';

const highlights = [
  'Kết nối trung tâm thành phố trong 15 phút',
  'Gần trường học, bệnh viện quốc tế',
  'Hệ thống giao thông công cộng thuận tiện',
  'Tầm view không chắn tứ phía',
];

const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31349.40837969883!2d106.69842!3d10.72942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2zQ-G6o25nIEQgxJDDrG0!5e0!3m2!1svi!2s!4v1';

export function LocationSection() {
  const [mapError, setMapError] = useState(false);

  return (
    <section id="location" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block px-4 py-2 btn-gold-shimmer/10 text-primary text-sm font-medium rounded-full mb-4">
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
          {/* Map */}
          <FadeInUp>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {mapError ? (
                /* Fallback: static image if map fails */
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                    alt="Bản đồ vị trí dự án"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 btn-gold-shimmer rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Đảo Ảnh Dương</p>
                        <p className="text-white/80 text-sm">Quận 2, TP. Hồ Chí Minh</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="400"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí dự án Sola Đảo Ảnh Dương"
                  onError={() => setMapError(true)}
                  className="w-full"
                />
              )}

              {/* Map overlay badge */}
              <div className="absolute bottom-6 left-6 right-6 text-white hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 btn-gold-shimmer  rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Sola Đảo Ảnh Dương</p>
                    <p className="text-white/80 text-sm">Quận 2, TP. Hồ Chí Minh</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Location Info */}
          <div>
            <StaggerContainer className="space-y-4">
              <StaggerItem>
                <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 btn-gold-shimmer /10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600 text-sm">Công ty cố phần đầu từ Địa Ốc Việt Nam Property Số 8 - 10 Tạ Hiện, Phường Thạnh Mỹ Lợi, Quận 2, TP. Hồ Chí Minh</p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 btn-gold-shimmer /10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hotline</h3>
                    <a href="tel:0909123456" className="text-primary font-medium hover:underline">
                      0845 228 379
                    </a>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 btn-gold-shimmer /10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Giờ mở cửa</h3>
                    <p className="text-gray-600 text-sm">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                    <p className="text-gray-600 text-sm">Thứ 7 - CN: 9:00 - 17:00</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <FadeInUp delay={0.4}>
              <div className="mt-6 p-5 btn-gold-shimmer /5 rounded-2xl border border-primary/10">
                <h4 className="font-semibold text-gray-900 mb-4">Điểm nổi bật</h4>
                <ul className="space-y-3">
                  {highlights.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full btn-gold-shimmer /10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-gray-600 text-sm">{item}</span>
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
