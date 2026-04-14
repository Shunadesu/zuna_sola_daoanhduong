import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollAnimationProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

export function ScrollAnimation({
  children,
  variants,
  className,
  delay = 0,
}: ScrollAnimationProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay }}
      className={cn('', className)}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <ScrollAnimation
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4, delay } },
      }}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
}

export function FadeInUp({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <ScrollAnimation
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
      }}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
}

export function FadeInDown({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <ScrollAnimation
      variants={{
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
      }}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideInLeft({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <ScrollAnimation
      variants={{
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay } },
      }}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideInRight({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <ScrollAnimation
      variants={{
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay } },
      }}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
}

export function ScaleIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <ScrollAnimation
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay } },
      }}
      className={className}
    >
      {children}
    </ScrollAnimation>
  );
}
