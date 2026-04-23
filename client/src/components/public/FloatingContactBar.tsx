import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, FileText, X, Send, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContactStore } from '@/store';
import { bannerApi } from '@/lib/api';
import toast from 'react-hot-toast';

const contactIcons: Record<string, { icon: React.ReactNode; bg: string; href?: string }> = {
  phone: { icon: <Phone className="w-5 h-5" />, bg: 'bg-red-500 hover:bg-red-600' },
  whatsapp: { icon: <MessageCircle className="w-5 h-5" />, bg: 'bg-green-500 hover:bg-green-600' },
  zalo: { icon: <span className="text-sm font-bold">Zalo</span>, bg: 'bg-blue-500 hover:bg-blue-600' },
  facebook: { icon: <MessageCircle className="w-5 h-5" />, bg: 'bg-blue-600 hover:bg-blue-700' },
  quote: { icon: <FileText className="w-5 h-5" />, bg: 'bg-amber-500 hover:bg-amber-600' },
};

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
}

function QuoteModal({ open, onClose }: QuoteModalProps) {
  const [banners, setBanners] = useState<string[]>([]);
  const [bgImage, setBgImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    apartment: '',
  });

  useEffect(() => {
    if (open) {
      fetchBanners();
    }
  }, [open]);

  useEffect(() => {
    if (banners.length > 0) {
      const randomIndex = Math.floor(Math.random() * banners.length);
      setBgImage(banners[randomIndex]);
    }
  }, [banners]);

  const fetchBanners = async () => {
    try {
      const res = await bannerApi.getActive();
      if (res.data?.success && res.data.data?.length > 0) {
        const urls = res.data.data.map((b: { imageUrl: string }) => b.imageUrl);
        setBanners(urls);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast.error('Vui lòng nhập họ tên và số điện thoại');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        setFormData({ fullName: '', phone: '', email: '', apartment: '' });
        onClose();
      } else {
        toast.error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with banner image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
            onClick={onClose}
          >
            {bgImage && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
              />
            )}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Đăng Ký Nhận Báo Giá</h2>
              <p className="text-white/80 text-sm">Điền thông tin để nhận tư vấn chi tiết về dự án</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (tuỳ chọn)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email của bạn"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Căn hộ quan tâm</label>
                <select
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                >
                  <option value="">-- Chọn loại căn hộ --</option>
                  <option value="biệt thự song lập">Biệt thự song lập</option>
                  <option value="biệt thự đơn lập">Biệt thự đơn lập</option>
                  <option value="nhà phố liền kề">Nhà phố liền kề</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Gửi Yêu Cầu
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingContactBar() {
  const { contacts, fetchContacts } = useContactStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Auto-open modal once after 10s on first visit
  useEffect(() => {
    const hasShownModal = localStorage.getItem('quote_modal_shown');
    if (!hasShownModal) {
      const timer = setTimeout(() => {
        setShowQuoteModal(true);
        localStorage.setItem('quote_modal_shown', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClick = (type: string, value: string) => {
    switch (type) {
      case 'phone':
        window.location.href = `tel:${value}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank');
        break;
      case 'zalo':
        window.open(`https://zalo.me/${value}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://m.me/${value}`, '_blank');
        break;
      case 'quote':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const displayContacts = (contacts && contacts.length > 0) ? contacts : [
    { _id: '1', type: 'phone' as const, label: 'Hotline', value: '0909123456', icon: '', isActive: true, sortOrder: 1 },
    { _id: '2', type: 'zalo' as const, label: 'Zalo', value: '0909123456', icon: '', isActive: true, sortOrder: 2 },
    { _id: '3', type: 'quote' as const, label: 'Báo giá', value: '', icon: '', isActive: true, sortOrder: 3 },
  ];

  return (
    <>
      {/* Left: Báo giá ngay button */}
      <div className="fixed left-4 bottom-4 z-50">
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          onClick={() => setShowQuoteModal(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-5 py-3.5 rounded-full transition-all hover:scale-105 cursor-pointer"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-amber-400 opacity-30" />

          {/* Icon */}
          <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>

          {/* Text */}
          <div className="relative flex flex-col items-start">
            <span className="text-xs font-medium text-white/80 leading-none mb-0.5">Nhấn ngay</span>
            <span className="text-sm font-bold leading-none">Báo giá ngay</span>
          </div>

          {/* Arrow */}
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="relative ml-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.span>
        </motion.button>
      </div>

      {/* Right: Contact buttons */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-3"
            >
              {displayContacts.map((contact, index) => {
                const iconConfig = contactIcons[contact.type] || contactIcons.quote;
                return (
                  <motion.button
                    key={contact._id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick(contact.type, contact.value)}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all',
                      iconConfig.bg
                    )}
                    title={contact.label}
                  >
                    {iconConfig.icon}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quote button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuoteModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg"
          title="Đăng ký báo giá"
        >
          <FileText className="w-6 h-6" />
        </motion.button>

        {/* Toggle button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full bg-gray-600 text-white flex items-center justify-center shadow-lg"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </div>

      <QuoteModal open={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
    </>
  );
}
