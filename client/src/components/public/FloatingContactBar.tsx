import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContactStore } from '@/store';

const contactIcons: Record<string, { icon: React.ReactNode; bg: string; href?: string }> = {
  phone: { icon: <Phone className="w-5 h-5" />, bg: 'bg-red-500 hover:bg-red-600' },
  whatsapp: { icon: <MessageCircle className="w-5 h-5" />, bg: 'bg-green-500 hover:bg-green-600' },
  zalo: { icon: <span className="text-sm font-bold">Zalo</span>, bg: 'bg-blue-500 hover:bg-blue-600' },
  facebook: { icon: <MessageCircle className="w-5 h-5" />, bg: 'bg-blue-600 hover:bg-blue-700' },
  quote: { icon: <FileText className="w-5 h-5" />, bg: 'bg-amber-500 hover:bg-amber-600' },
};

export function FloatingContactBar() {
  const { contacts, fetchContacts } = useContactStore();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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

  // If no contacts from API, show default
  const displayContacts = (contacts && contacts.length > 0) ? contacts : [
    { _id: '1', type: 'phone' as const, label: 'Hotline', value: '0909123456', icon: '', isActive: true, sortOrder: 1 },
    { _id: '2', type: 'zalo' as const, label: 'Zalo', value: '0909123456', icon: '', isActive: true, sortOrder: 2 },
    { _id: '3', type: 'quote' as const, label: 'Báo giá', value: '', icon: '', isActive: true, sortOrder: 3 },
  ];

  return (
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

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
