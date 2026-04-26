import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MapPin, Car, Train, Building, GraduationCap, Heart, ShoppingBag } from 'lucide-react';

const LocationPage = () => {
  const connectivity = [
    { icon: Car, title: 'Đại lộ Võ Nguyên Giáp', time: '3 phút', description: 'Kết nối trực tiếp vào trung tâm Quận 1' },
    { icon: Car, title: 'Đường Đỗ Xuân Hợp', time: '5 phút', description: 'Kết nối Quận 7, Nhà Bè' },
    { icon: Train, title: 'Metro Bến Thành - Suối Tiên', time: '10 phút', description: 'Ga Trường Đại học Quốc gia (dự kiến)' },
    { icon: Car, title: 'Cầu Thủ Thiêm', time: '10 phút', description: 'Kết nối Quận 1, Quận 3' },
    { icon: Car, title: 'Cầu Cần Giuộc', time: '15 phút', description: 'Kết nối Long An, Quận 4' },
    { icon: Car, title: 'Cao tốc Long Thành - Dầu Giây', time: '20 phút', description: 'Kết nối Đồng Nai, Vũng Tàu' },
  ];

  const amenities = [
    { icon: GraduationCap, name: 'Trường quốc tế', distance: '3-5 phút', items: ['AIS', 'ISMS', 'Trường ĐH Quốc gia'] },
    { icon: Heart, name: 'Bệnh viện quốc tế', distance: '5-10 phút', items: ['BV Quốc tế Việt Đức', 'BV Tim Tâm Đức', 'BVFV'] },
    { icon: ShoppingBag, name: 'Trung tâm thương mại', distance: '5-10 phút', items: ['VivoCity', 'Paragon Center', 'Estella Place'] },
    { icon: Building, name: 'Khu văn phòng', distance: '5-10 phút', items: ['Masterise Centre', 'Vinhomes Central Park', 'Thảo Điền Square'] },
  ];

  return (
    <>
      <Helmet>
        <title>Vị Trí Dự Án | Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2</title>
        <meta name="description" content="Vị trí dự án Biệt Thự Sola Đảo Ảnh Dương - Sola Global City tại Phường Thạnh Mỹ Lợi, Quận 2, TP.HCM. Kết nối giao thông thuận tiện, gần trường học, bệnh viện quốc tế." />
        <meta name="keywords" content="vị trí sola global city, vị trí biệt thự quận 2, bản đồ sola đảo ảnh dương, vị trí đắc địa quận 2, the global city vị trí" />
        <link rel="canonical" href="https://soladaoanhduong.nthanhproperty.fun/location" />
        <meta property="og:title" content="Vị Trí Dự Án | Biệt Thự Sola Đảo Ảnh Dương" />
        <meta property="og:description" content="Vị trí dự án Sola Global City tại Quận 2, TP.HCM. Kết nối giao thông thuận tiện, gần trường học, bệnh viện quốc tế." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://soladaoanhduong.nthanhproperty.fun/location" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vị Trí Dự Án | Biệt Thự Sola Đảo Ảnh Dương" />
        <meta name="twitter:description" content="Vị trí dự án Sola Global City tại Quận 2, TP.HCM. Kết nối giao thông thuận tiện." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80" />
      </Helmet>

      <div className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-amber-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-serif">
                Vị Trí <span className="text-primary">Đắc Địa</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Biệt Thự Sola Đảo Ảnh Dương tọa lạc tại Phường Thạnh Mỹ Lợi, Quận 2 - 
                Vị trí chiến lược bậc nhất TP. Hồ Chí Minh
              </p>
            </motion.div>
          </div>
        </section>

        {/* Address Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Địa Chỉ Dự Án</h2>
                  <p className="text-gray-600 text-lg">
                    Số 8 - 10 Tạ Hiện, Phường Thạnh Mỹ Lợi, Quận 2, TP. Hồ Chí Minh
                  </p>
                  <p className="text-gray-500 mt-2">
                    Tọa độ: 10.72942°N, 106.69842°E
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google Maps Embed */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl max-w-6xl mx-auto"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31349.40837969883!2d106.69842!3d10.72942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2zQ-G6o25nIEQgxJDDrG0!5e0!3m2!1svi!2s!4v1"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí Biệt Thự Sola Đảo Ảnh Dương trên Google Maps"
              />
            </motion.div>
          </div>
        </section>

        {/* Connectivity Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                Kết Nối Giao Thông
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Từ Sola Global City, bạn dễ dàng di chuyển đến mọi điểm đến trong thành phố
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {connectivity.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-primary font-semibold text-sm mb-1">{item.time}</p>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Amenities */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                Tiện Ích Xung Quanh
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hệ thống tiện ích đẳng cấp trong bán kính 5-15 phút di chuyển
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {amenities.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <category.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                      <p className="text-primary text-sm font-medium">{category.distance}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Benefits */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                  Tại Sao Vị Trí Quận 2?
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Quận 2 (nay là Thủ Đức) được quy hoạch trở thành trung tâm tài chính 
                    và kinh tế mới của TP. Hồ Chí Minh, với hạ tầng giao thông hiện đại 
                    và đồng bộ.
                  </p>
                  <div className="space-y-3">
                    {[
                      'Hạ tầng giao thông đồng bộ với hệ thống cầu, đường hiện đại',
                      'Quy hoạch thành trung tâm tài chính - kinh tế mới TP.HCM',
                      'Tốc độ tăng giá bất động sản cao nhất thành phố (20-30%/năm)',
                      'Hệ thống trường học, bệnh viện quốc tế đầy đủ',
                      'Nhiều dự án hạ tầng lớn đang triển khai',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        </span>
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://masterisevietnam.com/wp-content/uploads/2025/08/vi-tri-sola-global-city.jpg"
                  alt="Bản đồ vị trí Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2 - Kết nối giao thông thuận tiện"
                  className="rounded-2xl shadow-2xl w-full"
                  width="600"
                  height="400"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Muốn Xem Trực Tiếp Dự Án?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Đăng ký ngay để được sắp xếp tham quan thực tế dự án Sola Global City
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:0845228379"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors"
              >
                📞 Hotline: 0845 228 379
              </a>
              <a
                href="https://zalo.me/0845228379"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-colors"
              >
                💬 Zalo: 0845228379
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocationPage;
