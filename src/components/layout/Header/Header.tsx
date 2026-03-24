import { useState, useEffect } from 'react'
import { cn } from '../../../lib/utils'
import type { BaseComponentProps } from '../../../types'

interface HeaderProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumbs?: React.ReactNode
}

/**
 * Header Component
 * 
 * Top header bar for page context and actions.
 * 
 * Specifications:
 * - Height: 64px
 * - Background: white
 * - Border bottom: 1px solid secondary-200
 * - Shadow on scroll: elevation-01
 * 
 * @example
 * ```tsx
 * <Header
 *   title="Dashboard"
 *   subtitle="Overview of your content performance"
 *   actions={<Button>Create new</Button>}
 * />
 * ```
 */
export function Header({
  title,
  subtitle,
  actions,
  breadcrumbs,
  children,
  className,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-16 bg-white border-b border-secondary-200',
        'flex items-center justify-between px-6',
        'transition-shadow duration-150',
        isScrolled && 'shadow-elevation-1',
        className
      )}
    >
      <div className="flex flex-col min-w-0">
        {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}
        <div className="flex items-center gap-3">
          {title && (
            <h1 className="text-subheading-03 text-secondary-1000 truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <span className="text-bodytext-03 text-secondary-500 truncate hidden sm:block">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
      )}

      {children}
    </header>
  )
}
