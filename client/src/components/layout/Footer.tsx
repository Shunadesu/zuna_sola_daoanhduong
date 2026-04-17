import { Phone, Mail, MapPin, Facebook, MessageCircle, Building2 } from 'lucide-react';

const ADDRESS = 'Công ty cố phần đầu từ Địa Ốc Việt Nam Property Số 8 - 10 Tạ Hiện, Phường Thạnh Mỹ Lợi, Quận 2, TP. Hồ Chí Minh';
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
};

export function Footer() {
  return (
    <footer className="bg-white text-gray-800">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Logo Image */}
            <div className="mb-6">
              <img 
                src={LOGO_IMAGE}
                alt="SOLA Đảo Ảnh Dương"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </div>

            <p className="text-gray-600 max-w-md leading-relaxed">
              Dự án căn hộ cao cấp tại vị trí đắc địa bậc nhất Quận 7, mang đến cuộc sống hoàn hảo 
              với tiêu chuẩn quốc tế và tiện ích đẳng cấp cho cư dân.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-blue-500 transition-all hover:scale-110 hover:text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://zalo.com"
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

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Liên hệ
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:0845228379"
                  className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Hotline</p>
                    <p className="font-medium text-gray-800">0845228379</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:thanhpham.02092002@gmail.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 text-sm break-all">thanhpham.02092002@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Địa chỉ</p>
                    <p className="font-medium text-gray-800 text-sm">{ADDRESS}</p>
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
        alt="Bản đồ vị trí dự án Sola Đảo Ảnh Dương"
        className="w-full h-full object-cover"
      />

      {/* Copyright */}
      <div className="container mx-auto px-4 py-8">
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Sola Đảo Ảnh Dương. Tất cả quyền được bảo lưu.
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
