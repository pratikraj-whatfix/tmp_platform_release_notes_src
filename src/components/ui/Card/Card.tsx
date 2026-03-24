import { cn } from '../../../lib/utils'
import type { CardProps } from '../../../types'

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * Card Component
 * 
 * Container component for grouping related content.
 * 
 * @example
 * ```tsx
 * <Card>
 *   <h3 className="text-subheading-05">Card title</h3>
 *   <p className="text-bodytext-03 text-secondary-600">
 *     Card content goes here
 *   </p>
 * </Card>
 * 
 * <Card hoverable onClick={handleClick}>
 *   Clickable card with hover effect
 * </Card>
 * ```
 */
export function Card({
  children,
  hoverable = false,
  padding = 'md',
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-md border border-secondary-200',
        'shadow-elevation-1',
        hoverable && 'transition-default hover:shadow-elevation-2 cursor-pointer',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
