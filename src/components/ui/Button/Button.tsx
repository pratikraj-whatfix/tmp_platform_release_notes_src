import { forwardRef } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { cn } from '../../../lib/utils'
import { buttonStyles, iconSizes } from './Button.styles'
import type { ButtonProps } from '../../../types'

/**
 * Button Component
 * 
 * Primary UI component for user actions following Whatfix design system.
 * 
 * Rules:
 * - Only ONE primary button per page/modal
 * - Maximum THREE buttons per page/modal
 * - Icon-only buttons use rounded (36px) radius
 * 
 * @example
 * ```tsx
 * // Primary action
 * <Button intent="prime">Save changes</Button>
 * 
 * // Secondary action
 * <Button variant="secondary" intent="info">Preview</Button>
 * 
 * // Icon only
 * <Button iconOnly intent="muted">
 *   <IconSettings size={20} />
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      intent = 'prime',
      size = 'lg',
      iconLeft,
      iconRight,
      iconOnly = false,
      disabled = false,
      loading = false,
      fullWidth = false,
      onClick,
      type = 'button',
      className,
      ...props
    },
    ref
  ) => {
    const iconSize = iconSizes[size]

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={cn(
          buttonStyles({
            variant,
            intent,
            size,
            iconOnly,
            fullWidth,
          }),
          className
        )}
        {...props}
      >
        {loading ? (
          <IconLoader2 size={iconSize} className="animate-spin" />
        ) : (
          <>
            {iconLeft && (
              <span className="flex-shrink-0" style={{ width: iconSize, height: iconSize }}>
                {iconLeft}
              </span>
            )}
            {!iconOnly && children}
            {iconRight && (
              <span className="flex-shrink-0" style={{ width: iconSize, height: iconSize }}>
                {iconRight}
              </span>
            )}
            {iconOnly && !iconLeft && !iconRight && children}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
