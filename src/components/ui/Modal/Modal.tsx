import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { IconX } from '@tabler/icons-react'
import { cn } from '../../../lib/utils'
import { Button } from '../Button'
import type { ModalProps } from '../../../types'

const sizeClasses = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
}

/**
 * Modal Component
 * 
 * A dialog overlay for focused user interactions.
 * 
 * Sizes:
 * - Small (400px): Confirmations, simple forms
 * - Medium (560px): Standard forms, content
 * - Large (720px): Complex content, tables
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Create new item"
 *   footer={
 *     <>
 *       <Button variant="tertiary" intent="muted" onClick={handleClose}>
 *         Cancel
 *       </Button>
 *       <Button onClick={handleSave}>Save</Button>
 *     </>
 *   }
 * >
 *   <p>Modal content goes here</p>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  footer,
  children,
  className,
}: ModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-secondary-1000/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full bg-white rounded-xl shadow-elevation-4',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between" style={{ padding: '28px 32px 20px 32px' }}>
            {title && (
              <h2
                id="modal-title"
                className="text-subheading-03 text-secondary-1000"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="tertiary"
                intent="muted"
                size="sm"
                iconOnly
                onClick={onClose}
                className="ml-auto"
                aria-label="Close modal"
              >
                <IconX size={20} stroke={1.5} />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '0 32px 28px 32px' }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-secondary-200" style={{ padding: '20px 32px 28px 32px' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
