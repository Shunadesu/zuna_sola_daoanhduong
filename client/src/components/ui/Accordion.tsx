import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>(
    items.reduce<number[]>((acc, item, i) => {
      if (item.defaultOpen) acc.push(i);
      return acc;
    }, [])
  );

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      if (allowMultiple) {
        return [...prev, index];
      }
      return [index];
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(index);
        return (
          <div
            key={index}
            className="border rounded-xl overflow-hidden bg-card"
          >
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
              id={`accordion-trigger-${index}`}
            >
              <span className="font-medium text-foreground pr-4">{item.title}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 text-muted-foreground"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  id={`accordion-content-${index}`}
                  role="region"
                  aria-labelledby={`accordion-trigger-${index}`}
                >
                  <div className="px-5 pb-4 text-sm text-muted-foreground">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
