// components/ui/card.tsx
import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base styles with glassmorphism
        'relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm shadow-lg',
        // Subtle border with primary accent
        'border border-primary-100/50',
        // Elevation and transitions
        'transition-all duration-300 ease-out',
        // Hover effects for interactive cards
        'hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1',
        // Focus styles
        'focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:ring-offset-2',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Spacing and layout
        'px-6 py-6 pb-4',
        // Typography hierarchy
        'space-y-2',
        // Subtle border bottom for separation
        'border-b border-primary-50',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Material UI inspired typography
      'text-xl font-medium leading-tight tracking-tight',
      // Color scheme
      'text-neutral-900',
      // Letter spacing for elegance
      'font-sans',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      // Material UI secondary text
      'text-sm leading-relaxed',
      // Muted color
      'text-neutral-600',
      // Line height for readability
      'mt-1',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Consistent padding
        'px-6 py-4',
        // Typography
        'text-neutral-800',
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Padding and layout
        'px-6 py-4 pt-4',
        // Flex for button layouts
        'flex items-center justify-end gap-2',
        // Subtle top border
        'border-t border-primary-50',
        // Background variation
        'bg-gradient-to-r from-primary-50/30 to-secondary-50/30',
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

// Elevated card variant for special cases
const CardElevated = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base card styles with glassmorphism
        'relative overflow-hidden rounded-xl bg-white/95 backdrop-blur-md',
        // Enhanced elevation with primary accents
        'shadow-xl shadow-primary-500/10 border border-primary-200/50',
        // Smooth transitions
        'transition-all duration-300 ease-out',
        // Enhanced hover effects
        'hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2',
        // Focus styles
        'focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:ring-offset-2',
        className
      )}
      {...props}
    />
  )
);
CardElevated.displayName = 'CardElevated';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardElevated,
};
