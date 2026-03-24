import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

/**
 * Tooltip Component
 * 
 * Shows additional information on hover.
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case 'left':
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.left + scrollX - tooltipRect.width - 8
        break
      case 'right':
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.right + scrollX + 8
        break
    }

    // Keep tooltip within viewport
    const padding = 8
    if (left < padding) left = padding
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding
    }
    if (top < padding) top = padding
    if (top + tooltipRect.height > window.innerHeight + scrollY - padding) {
      top = window.innerHeight + scrollY - tooltipRect.height - padding
    }

    setTooltipPosition({ top, left })
  }

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setTimeout(updatePosition, 0)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isVisible])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex items-center"
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'fixed z-50 px-3 py-2 bg-secondary-1000 text-white text-bodytext-03 rounded-md shadow-elevation-4 pointer-events-none',
              'animate-in fade-in-0 zoom-in-95 duration-150',
              className
            )}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {content}
            <div
              className={cn(
                'absolute w-2 h-2 bg-secondary-1000 transform rotate-45',
                position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
                position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
              )}
            />
          </div>,
          document.body
        )}
    </>
  )
}
