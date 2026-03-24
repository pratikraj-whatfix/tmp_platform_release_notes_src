import { cn } from '../../../lib/utils'
import type { BaseComponentProps } from '../../../types'

interface ContentPanelProps extends BaseComponentProps {
  title?: string
  actions?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * ContentPanel Component
 * 
 * Content container with optional title and actions.
 * 
 * @example
 * ```tsx
 * <ContentPanel
 *   title="Recent activity"
 *   actions={<Button variant="tertiary" size="sm">View all</Button>}
 * >
 *   <ActivityList />
 * </ContentPanel>
 * ```
 */
export function ContentPanel({
  title,
  actions,
  padding = 'md',
  children,
  className,
}: ContentPanelProps) {
  return (
    <section
      className={cn(
        'bg-white rounded-md border border-secondary-200 shadow-elevation-1',
        paddingClasses[padding],
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-subheading-05 text-secondary-1000">{title}</h2>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
