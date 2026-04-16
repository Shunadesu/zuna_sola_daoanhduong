import { useState } from 'react';
import { Phone, Mail, MapPin, Facebook, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

const footerLinks = {
  duan: [
    { label: 'Giới thiệu dự án', href: '#about' },
    { label: 'Vị trí', href: '#location' },
    { label: 'Tiện ích', href: '#amenities' },
    { label: 'Hình ảnh', href: '#gallery' },
  ],
  lienhe: [
    { label: 'Hotline: 0909 123 456', href: 'tel:0909123456', icon: Phone },
    { label: 'Email: info@sola.vn', href: 'mailto:info@sola.vn', icon: Mail },
    { label: 'Địa chỉ: Đảo Ảnh Dương', href: '#contact', icon: MapPin },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-primary">SOLA</h3>
              <p className="text-sm text-gray-400">Đảo Ảnh Dương</p>
            </div>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              Dự án căn hộ cao cấp tại vị trí đắc địa bậc nhất, mang đến cuộc sống hoàn hảo cho cư dân.
            </p>

            {/* Newsletter */}
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Đăng ký nhận tin</h4>
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 rounded-lg px-4 py-3 max-w-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Cảm ơn bạn đã đăng ký!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    required
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:bg-white/5 transition-colors text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    aria-label="Subscribe"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://zalo.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo"
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
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
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
              {footerLinks.lienhe.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"
                    >
                      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sola Đảo Ảnh Dương. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
