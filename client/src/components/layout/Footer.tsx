import { Phone, Mail, MapPin, Facebook, MessageCircle } from 'lucide-react';

const footerLinks = {
  duan: [
    { label: 'Giới thiệu dự án', href: '#about' },
    { label: 'Vị trí', href: '#location' },
    { label: 'Tiện ích', href: '#amenities' },
    { label: 'Mặt bằng', href: '#floorplan' },
  ],
  lienhe: [
    { label: 'Hotline: 0909 123 456', href: 'tel:0909123456' },
    { label: 'Email: info@sola.vn', href: 'mailto:info@sola.vn' },
    { label: 'Địa chỉ: Đảo Ảnh Dương', href: '#contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-primary">SOLA</h3>
              <p className="text-sm text-gray-400">Đảo Ảnh Dương</p>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Dự án căn hộ cao cấp tại vị trí đắc địa bậc nhất, mang đến cuộc sống hoàn hảo cho cư dân.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://zalo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Dự án</h4>
            <ul className="space-y-3">
              {footerLinks.duan.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              {footerLinks.lienhe.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {link.label.includes('Hotline') && <Phone className="w-4 h-4" />}
                    {link.label.includes('Email') && <Mail className="w-4 h-4" />}
                    {link.label.includes('Địa chỉ') && <MapPin className="w-4 h-4" />}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2024 Sola Đảo Ảnh Dương. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
