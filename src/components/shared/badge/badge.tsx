import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning' // Para estados como 'preparing' o 'cleaning'
  | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm';

  const variantClasses: Record<BadgeVariant, string> = {
    default:
      'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 hover:from-primary-200 hover:to-secondary-200 focus:ring-primary-500/30',
    secondary:
      'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 hover:from-slate-200 hover:to-gray-200 focus:ring-slate-500/30',
    destructive:
      'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200 focus:ring-red-500/30',
    outline:
      'border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-500/30',
    success:
      'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 hover:from-emerald-200 hover:to-green-200 focus:ring-emerald-500/30',
    warning:
      'bg-gradient-to-r from-tertiary-100 to-accent-100 text-tertiary-800 hover:from-tertiary-200 hover:to-accent-200 focus:ring-tertiary-500/30',
    info: 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 hover:from-primary-200 hover:to-secondary-200 focus:ring-primary-500/30',
  };

  return (
    <span
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
