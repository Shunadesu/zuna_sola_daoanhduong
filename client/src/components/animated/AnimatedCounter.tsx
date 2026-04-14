import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => `${prefix}${latest.toLocaleString()}${suffix}`);

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [target]);

  return <motion.span className={cn('', className)}>{display}</motion.span>;
}
