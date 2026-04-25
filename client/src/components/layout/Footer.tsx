import { Phone, Mail, MapPin, Facebook, MessageCircle, Building2 } from 'lucide-react';

const PROJECT_NAME = 'Biệt Thự Sola Đảo Ảnh Dương';
const SHORT_NAME = 'Sola Global City';
const ADDRESS = 'Số 8 - 10 Tạ Hiện, Phường Thạnh Mỹ Lợi, Quận 2, TP. Hồ Chí Minh';
const PHONE = '0845 228 379';
const PHONE_RAW = '0845228379';
const EMAIL = 'thanhpham.02092002@gmail.com';
const MAP_IMAGE = 'https://masterisevietnam.com/wp-content/uploads/2025/08/vi-tri-sola-global-city.jpg';
const LOGO_IMAGE = '/SOLA-dao-anh-duong-scaled.png';

const footerLinks = {
  duan: [
    { label: 'Giới thiệu dự án', href: '#about' },
    { label: 'Tổng quan', href: '#overview' },
    { label: 'Vị trí', href: '#location' },
    { label: 'Tiện ích', href: '#amenities' },
    { label: 'Hình ảnh', href: '#gallery' },
  ],
  thongtin: [
    { label: 'Về Chúng Tôi', href: '/about' },
    { label: 'Vị Trí Dự Án', href: '/location' },
    { label: 'Câu Hỏi Thường Gặp', href: '/faq' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white text-gray-800" itemScope itemType="https://schema.org/RealEstateAgent">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Logo Image */}
            <div className="mb-6">
              <img 
                src={LOGO_IMAGE}
                alt={`${PROJECT_NAME} - ${SHORT_NAME}`}
                className="h-14 md:h-16 w-auto object-contain"
                itemProp="image"
              />
            </div>
            <meta itemProp="name" content={`${PROJECT_NAME} - ${SHORT_NAME}`} />
            <meta itemProp="description" content="Dự án biệt thự cao cấp, shophouse tại vị trí đắc địa Quận 2, TP. Hồ Chí Minh." />

            <p className="text-gray-600 max-w-md leading-relaxed">
              {PROJECT_NAME} ({SHORT_NAME}) - Dự án biệt thự cao cấp, SOLA VILLAS THE GLOBAL CITY BIỂU TƯỢNG VILLA COMPOUND DUY NHẤT TẠI GLOBAL CITY Phân khu Sola - Đảo Ánh Dương nằm trong khu đô thị The Global City
              Quận 2, TP. Hồ Chí Minh.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com/solaglobalcity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-blue-500 transition-all hover:scale-110 hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://zalo.me/${PHONE_RAW}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo"
                className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 hover:text-white"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Dự án
            </h4>
            <ul className="space-y-3">
              {footerLinks.duan.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Thông Tin
            </h4>
            <ul className="space-y-3">
              {footerLinks.thongtin.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Liên hệ
            </h4>
            <ul className="space-y-4" itemProp="contactPoint" itemScope itemType="https://schema.org/ContactPoint">
              <meta itemProp="contactType" content="customer service" />
              <meta itemProp="areaServed" content="Việt Nam" />
              <meta itemProp="availableLanguage" content="Vietnamese" />
              <li>
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hotline</p>
                    <p className="font-semibold text-gray-800" itemProp="telephone">{PHONE}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800 text-sm break-all" itemProp="email">{EMAIL}</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ</p>
                    <p className="font-medium text-gray-800 text-sm" itemProp="streetAddress">{ADDRESS}</p>
                    <meta itemProp="addressLocality" content="Quận 2" />
                    <meta itemProp="addressRegion" content="TP. Hồ Chí Minh" />
                    <meta itemProp="addressCountry" content="VN" />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map Full Width */}
      <img
        src={MAP_IMAGE}
        alt={`Bản đồ vị trí ${PROJECT_NAME} - ${SHORT_NAME} Quận 2`}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Copyright */}
      <div className="container mx-auto px-4 py-8">
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {PROJECT_NAME}. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-800 transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-gray-800 transition-colors">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
