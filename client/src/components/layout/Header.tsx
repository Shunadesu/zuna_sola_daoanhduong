import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactApi } from '@/lib/api';

const navLinks = [
  { href: '#home', label: 'Trang chủ' },
  { href: '#overview', label: 'Tổng thể' },
  { href: '#amenities', label: 'Tiện ích' },
  { href: '#gallery', label: 'Hình ảnh' },
  { href: '#contact', label: 'Liên hệ' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('0845228379');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await contactApi.getByType('phone');
        if (res.data?.data?.length > 0) {
          setPhoneNumber(res.data.data[0].value);
        }
      } catch (error) {
        console.error('Failed to fetch phone number:', error);
      }
    };
    fetchPhone();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isScrolledStyle = isScrolled
    ? 'bg-white/95 backdrop-blur-md shadow-sm'
    : 'bg-transparent';
  const textColor = isScrolled ? 'text-gray-800' : 'text-white';
  const mobileBtnColor = isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolledStyle
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => handleNavClick('#home')}
            >
              <img 
                src="/SOLA-dao-anh-duong-scaled.png" 
                alt="SOLA Đảo Ảnh Dương"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    textColor
                  )}
                >
                  {link.label}
                </button>
              ))}
              <a
                href={`tel:${phoneNumber}`}
                className="btn-gold-shimmer flex items-center gap-2 text-white px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Liên hệ ngay</span>
              </a>
            </nav>

            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                mobileBtnColor
              )}
              aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay - Only visible when open */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-20 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di động"
          >
            <nav className="flex flex-col items-center gap-2 p-6 pt-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full max-w-xs py-3 text-lg font-medium text-gray-800 hover:text-primary transition-colors text-center rounded-lg hover:bg-gray-50"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="mt-6 w-full max-w-xs"
              >
                <a
                  href={`tel:${phoneNumber}`}
                  className="btn-gold-shimmer flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  Liên hệ ngay
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
