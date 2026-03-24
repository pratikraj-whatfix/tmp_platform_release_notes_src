import { cn } from '../../../lib/utils'
import type { BadgeProps } from '../../../types'

const variantClasses = {
  default: 'bg-secondary-100 text-secondary-700',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  critical: 'bg-critical-100 text-critical-500',
  info: 'bg-info-100 text-info-500',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-12',
  md: 'px-2.5 py-1 text-14',
}

/**
 * Badge Component
 * 
 * Small status indicator or label.
 * 
 * @example
 * ```tsx
 * <Badge>Default</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" size="sm">Pending</Badge>
 * <Badge variant="critical">Error</Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-sm',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}
