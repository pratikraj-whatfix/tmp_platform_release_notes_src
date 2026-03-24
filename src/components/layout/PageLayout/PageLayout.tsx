import { cn } from '../../../lib/utils'
import type { BaseComponentProps } from '../../../types'

interface PageLayoutProps extends BaseComponentProps {
  sidebar?: React.ReactNode
  header?: React.ReactNode
}

/**
 * PageLayout Component
 * 
 * Main layout wrapper with sidebar and header slots.
 * 
 * @example
 * ```tsx
 * <PageLayout
 *   sidebar={<Sidebar items={navItems} />}
 *   header={<Header title="Dashboard" />}
 * >
 *   <div className="p-6">
 *     Page content goes here
 *   </div>
 * </PageLayout>
 * ```
 */
export function PageLayout({
  sidebar,
  header,
  children,
  className,
}: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-secondary-0">
      {sidebar}
      
      <div className={cn('flex flex-col flex-1 min-w-0 overflow-hidden', className)}>
        {header}
        
        <main className="flex-1 flex flex-col overflow-hidden min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}
