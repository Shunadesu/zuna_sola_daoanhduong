import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Biệt Thự Sola Đảo Ảnh Dương ở đâu?",
    answer: "Biệt Thự Sola Đảo Ảnh Dương (Sola Global City) tọa lạc tại Phường Thạnh Mỹ Lợi, Quận 2, TP. Hồ Chí Minh. Vị trí đắc địa ngay trung tâm đảo ảnh dương, kết nối giao thông thuận tiện đến các quận trung tâm."
  },
  {
    question: "Giá biệt thự Sola Global City bao nhiêu?",
    answer: "Giá biệt thự Sola Global City dao động từ 8.5 tỷ đến 15 tỷ VND tùy vị trí và diện tích. Shophouse có giá từ 5.2 tỷ VND. Đây là mức giá cạnh tranh cho phân khúc biệt thự cao cấp tại Quận 2."
  },
  {
    question: "Sola Global City có pháp lý rõ ràng không?",
    answer: "Dự án Sola Global City có pháp lý minh bạch, sổ hồng riêng từng căn, hợp đồng mua bán theo quy định pháp luật. Quý khách có thể yên tâm khi đầu tư vào dự án này."
  },
  {
    question: "Liên hệ tư vấn Sola Global City ở đâu?",
    answer: "Quý khách có thể liên hệ tư vấn Sola Global City qua hotline: 0845 228 379 hoặc Zalo: 0845228379. Đội ngũ chuyên viên sẵn sàng hỗ trợ 24/7."
  },
  {
    question: "Sola Global City có những tiện ích gì?",
    answer: "Dự án Sola Global City được quy hoạch đồng bộ với hệ thống tiện ích đẳng cấp gồm: hồ bơi, phòng gym, công viên, trường học, bệnh viện, trung tâm thương mại và khu vui chơi trẻ em - đáp ứng mọi nhu cầu của cư dân."
  },
  {
    question: "Đầu tư biệt thự Sola Global City có sinh lời không?",
    answer: "Biệt thự Sola Global City nằm ở vị trí chiến lược Quận 2 - khu vực có tốc độ tăng giá mạnh nhất TP.HCM. Theo thống kê, giá bất động sản Quận 2 tăng trung bình 20-30%/năm. Đây là cơ hội đầu tư sinh lời hấp dẫn."
  },
  {
    question: "Chủ đầu tư Sola Global City là ai?",
    answer: "Sola Global City được phát triển bởi Masterise Vietnam - một trong những chủ đầu tư uy tín hàng đầu Việt Nam với nhiều dự án bất động sản cao cấp thành công."
  },
  {
    question: "Diện tích biệt thự Sola Global City là bao nhiêu?",
    answer: "Biệt thự Sola Global City có diện tích đất từ 300m2 đến 500m2, với 4-6 phòng ngủ và 4-5 phòng tắm. Thiết kế hiện đại, sang trọng, phù hợp cho gia đình đa thế hệ."
  },
  {
    question: "Sola Global City có gần trường học và bệnh viện không?",
    answer: "Có, Sola Global City nằm trong khu vực có hệ thống trường học quốc tế và bệnh viện quốc tế, thuận tiện cho con em học tập và khám chữa bệnh. Các tiện ích y tế và giáo dục đều trong bán kính 5-10 phút di chuyển."
  },
  {
    question: "Thanh toán Sola Global City như thế nào?",
    answer: "Sola Global City hỗ trợ nhiều hình thức thanh toán linh hoạt: thanh toán trước 30% và phần còn lại theo tiến độ xây dựng. Liên hệ hotline 0845 228 379 để được tư vấn chi tiết về phương án thanh toán phù hợp."
  },
];

interface FAQSectionProps {
  isPage?: boolean;
}

export function FAQSection({ isPage = false }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={`py-20 md:py-28 ${isPage ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Giải đáp những thắc mắc phổ biến về dự án Biệt Thự Sola Đảo Ảnh Dương
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Bạn có câu hỏi khác?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:0845228379"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <span>📞</span>
              <span>0845 228 379</span>
            </a>
            <a
              href="https://zalo.me/0845228379"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <span>💬</span>
              <span>Zalo: 0845228379</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQSection;
