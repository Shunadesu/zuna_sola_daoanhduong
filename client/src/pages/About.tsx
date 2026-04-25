import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Building2, Users, Award, TrendingUp, Shield, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Về Chúng Tôi | Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2</title>
        <meta name="description" content="Tìm hiểu về dự án Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2. Chủ đầu tư Masterise Vietnam, quy mô 45 hecta, hơn 1,000 sản phẩm biệt thự cao cấp." />
        <meta name="keywords" content="về sola global city, giới thiệu sola đảo ảnh dương, chủ đầu tư masterise vietnam, dự án the global city quận 2, biệt thự quận 2" />
        <link rel="canonical" href="https://soladaoanhduong.nthanhproperty.fun/about" />
        <meta property="og:title" content="Về Chúng Tôi | Biệt Thự Sola Đảo Ảnh Dương" />
        <meta property="og:description" content="Tìm hiểu về dự án Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2. Chủ đầu tư Masterise Vietnam." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://soladaoanhduong.nthanhproperty.fun/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Về Chúng Tôi | Biệt Thự Sola Đảo Ảnh Dương" />
        <meta name="twitter:description" content="Tìm hiểu về dự án Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2." />
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
                Về <span className="text-primary">Sola Global City</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Biệt Thự Sola Đảo Ảnh Dương - Biểu tượng Villa Compound duy nhất tại The Global City, 
                Quận 2, TP. Hồ Chí Minh
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                  Dự Án Biệt Thự Cao Cấp Hàng Đầu
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    <strong className="text-gray-900">Sola Global City</strong> là phân khu biệt thự cao cấp 
                    nằm trong khu đô thị <strong className="text-gray-900">The Global City</strong> - một 
                    trong những dự án quy hoạch đô thị hiện đại và đồng bộ nhất tại Quận 2, TP. Hồ Chí Minh.
                  </p>
                  <p>
                    Với quy mô <strong className="text-gray-900">45 hecta</strong> và hơn 
                    <strong className="text-gray-900"> 1,000 sản phẩm</strong> biệt thự và shophouse, 
                    Sola Global City mang đến không gian sống đẳng cấp với thiết kế hiện đại, 
                    tiện ích đồng bộ và vị trí chiến lược.
                  </p>
                  <p>
                    Dự án được phát triển bởi <strong className="text-gray-900">Masterise Vietnam</strong> - 
                    một trong những chủ đầu tư uy tín hàng đầu Việt Nam, cam kết mang đến 
                    những sản phẩm bất động sản chất lượng cao cấp.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                  alt="Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2 - Dự án biệt thự cao cấp Masterise Vietnam"
                  className="rounded-2xl shadow-2xl w-full"
                  width="800"
                  height="600"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-lg">
                  <p className="text-3xl font-bold">45 ha</p>
                  <p className="text-sm">Quy mô dự án</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Building2, number: '1,000+', label: 'Sản phẩm', suffix: '' },
                { icon: Users, number: '45', label: 'Hecta', suffix: 'ha' },
                { icon: Award, number: '4.8', label: 'Đánh giá', suffix: '/5' },
                { icon: TrendingUp, number: '20-30%', label: 'Tăng giá/năm', suffix: '' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">
                    {stat.number}<span className="text-primary">{stat.suffix}</span>
                  </p>
                  <p className="text-gray-600 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                Giá Trị Cốt Lõi
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những giá trị làm nên thương hiệu Sola Global City
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Pháp Lý Minh Bạch',
                  description: 'Sở hữu sổ hồng riêng từng căn, hợp đồng mua bán theo quy định pháp luật. Quý khách hoàn toàn yên tâm khi đầu tư.'
                },
                {
                  icon: Award,
                  title: 'Chất Lượng Cao Cấp',
                  description: 'Thiết kế hiện đại, vật liệu xây dựng cao cấp, quy hoạch đồng bộ theo tiêu chuẩn quốc tế.'
                },
                {
                  icon: Heart,
                  title: 'Tiện Ích Đẳng Cấp',
                  description: 'Hệ thống tiện ích đồng bộ: hồ bơi, phòng gym, công viên, trường học, bệnh viện quốc tế ngay trong khuôn viên.'
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 mb-6 bg-primary/10 rounded-xl flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4">
                  Chủ Đầu Tư
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
                  Masterise Vietnam
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Masterise Vietnam là một trong những chủ đầu tư bất động sản uy tín hàng đầu 
                  Việt Nam, với nhiều năm kinh nghiệm trong việc phát triển các dự án bất động 
                  sản cao cấp. Cam kết mang đến những sản phẩm chất lượng, dịch vụ tận tâm 
                  và giá trị bền vững cho khách hàng.
                </p>
                <a
                  href="tel:0845228379"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Liên hệ tư vấn: 0845 228 379
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"
                  alt="Dự án Masterise Vietnam - Biệt thự cao cấp Sola Global City"
                  className="rounded-xl w-full h-48 object-cover"
                  width="400"
                  height="192"
                />
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
                  alt="Dự án Masterise Vietnam - Villa compound Sola Global City"
                  className="rounded-xl w-full h-48 object-cover"
                  width="400"
                  height="192"
                />
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"
                  alt="Dự án Masterise Vietnam - Shophouse Sola Global City Quận 2"
                  className="rounded-xl w-full h-48 object-cover"
                  width="400"
                  height="192"
                />
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80"
                  alt="Dự án Masterise Vietnam - Căn hộ cao cấp TP.HCM"
                  className="rounded-xl w-full h-48 object-cover"
                  width="400"
                  height="192"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quan Tâm Đến Dự Án?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Liên hệ ngay để được tư vấn chi tiết về Biệt Thự Sola Đảo Ảnh Dương - 
              Cơ hội đầu tư sinh lời hấp dẫn tại Quận 2
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

export default AboutPage;
