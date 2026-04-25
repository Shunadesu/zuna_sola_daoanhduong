import { Helmet } from 'react-helmet-async';
import { FAQSection } from '@/components/sections/FAQSection';

const FAQPage = () => {
  return (
    <>
      <Helmet>
        <title>Câu Hỏi Thường Gặp | Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2</title>
        <meta name="description" content="Giải đáp các câu hỏi thường gặp về dự án Biệt Thự Sola Đảo Ảnh Dương - Sola Global City Quận 2: vị trí, giá cả, pháp lý, tiện ích, thanh toán." />
        <meta name="keywords" content="faq sola global city, câu hỏi thường gặp biệt thự quận 2, hỏi đáp dự án the global city, giải đáp sola đảo ảnh dương" />
        <link rel="canonical" href="https://soladaoanhduong.nthanhproperty.fun/faq" />
        <meta property="og:title" content="Câu Hỏi Thường Gặp | Biệt Thự Sola Đảo Ảnh Dương" />
        <meta property="og:description" content="Giải đáp các câu hỏi thường gặp về dự án Sola Global City Quận 2: vị trí, giá cả, pháp lý, tiện ích." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://soladaoanhduong.nthanhproperty.fun/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Câu Hỏi Thường Gặp | Biệt Thự Sola Đảo Ảnh Dương" />
        <meta name="twitter:description" content="Giải đáp các câu hỏi thường gặp về dự án Sola Global City Quận 2." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80" />
      </Helmet>

      <div className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-amber-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Giải đáp những thắc mắc phổ biến về dự án Biệt Thự Sola Đảo Ảnh Dương - Sola Global City
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection isPage={true} />

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cần Tư Vấn Thêm?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Đội ngũ chuyên viên của chúng tôi sẵn sàng hỗ trợ 24/7
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

export default FAQPage;
