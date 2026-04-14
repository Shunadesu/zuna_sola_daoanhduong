import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'muted' | 'hero';
}

function Section({ className, variant = 'default', ...props }: SectionProps) {
  return (
    <section
      className={cn(
        'w-full',
        {
          'py-20 md:py-28': variant === 'default',
          'py-16 md:py-24 bg-muted/50': variant === 'muted',
          'min-h-screen flex items-center': variant === 'hero',
        },
        className
      )}
      {...props}
    />
  );
}

export { Section };
