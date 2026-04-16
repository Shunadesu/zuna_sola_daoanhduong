import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

const navLinks = [
  { href: '#home', label: 'Trang chủ' },
  { href: '#about', label: 'Giới thiệu' },
  { href: '#location', label: 'Vị trí' },
  { href: '#amenities', label: 'Tiện ích' },
  { href: '#gallery', label: 'Hình ảnh' },
  { href: '#contact', label: 'Liên hệ' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMenuOpen, toggleMenu, closeMenu } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    closeMenu();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headerBg = isScrolled
    ? 'bg-white/95 backdrop-blur-md shadow-sm'
    : 'bg-transparent';
  const textColor = isScrolled ? 'text-gray-800' : 'text-white';
  const subColor = isScrolled ? 'text-gray-500' : 'text-white/80';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          headerBg
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => handleNavClick('#home')}
            >
              <div className={cn('font-bold text-2xl transition-colors', textColor)}>
                SOLA
              </div>
              <div className={cn('text-xs transition-colors', subColor)}>
                Đảo Ảnh Dương
              </div>
            </Link>

            {/* Desktop Nav */}
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
                href="tel:0909123456"
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Liên hệ ngay</span>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              )}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-20"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Backdrop blur overlay */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md" />

            <nav className="relative z-10 flex flex-col items-center gap-2 p-6 pt-8">
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
                  href="tel:0909123456"
                  className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
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
