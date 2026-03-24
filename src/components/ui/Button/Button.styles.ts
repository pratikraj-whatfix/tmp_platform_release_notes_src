import { cva } from 'class-variance-authority'

/**
 * Button style variants using class-variance-authority
 * Supports all Whatfix design system specifications
 */
export const buttonStyles = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-default',
    'focus-ring cursor-pointer',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: 'bg-transparent border',
        tertiary: 'bg-transparent border-none',
      },
      intent: {
        prime: '',
        muted: '',
        success: '',
        warning: '',
        critical: '',
        info: '',
      },
      size: {
        sm: 'h-8 px-3 py-2 text-12 rounded-sm',
        lg: 'h-11 px-4 py-3 text-14 rounded-sm',
        xl: 'h-12 px-4 py-3 text-16 rounded-sm',
      },
      iconOnly: {
        true: '',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      // Primary variant compounds
      {
        variant: 'primary',
        intent: 'prime',
        className: 'bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600',
      },
      {
        variant: 'primary',
        intent: 'muted',
        className: 'bg-secondary-900 text-white hover:bg-secondary-800 active:bg-secondary-700',
      },
      {
        variant: 'primary',
        intent: 'success',
        className: 'bg-success-400 text-white hover:bg-success-500 active:bg-success-600',
      },
      {
        variant: 'primary',
        intent: 'warning',
        className: 'bg-warning-400 text-secondary-1000 hover:bg-warning-500 active:bg-warning-600',
      },
      {
        variant: 'primary',
        intent: 'critical',
        className: 'bg-critical-400 text-white hover:bg-critical-500 active:bg-critical-600',
      },
      {
        variant: 'primary',
        intent: 'info',
        className: 'bg-info-400 text-white hover:bg-info-500 active:bg-info-600',
      },
      
      // Secondary variant compounds
      {
        variant: 'secondary',
        intent: 'prime',
        className: 'border-primary-400 text-primary-400 hover:bg-primary-50 active:bg-primary-100',
      },
      {
        variant: 'secondary',
        intent: 'muted',
        className: 'border-secondary-300 text-secondary-700 hover:bg-secondary-50 active:bg-secondary-100',
      },
      {
        variant: 'secondary',
        intent: 'success',
        className: 'border-success-400 text-success-400 hover:bg-success-50 active:bg-success-100',
      },
      {
        variant: 'secondary',
        intent: 'warning',
        className: 'border-warning-400 text-warning-500 hover:bg-warning-50 active:bg-warning-100',
      },
      {
        variant: 'secondary',
        intent: 'critical',
        className: 'border-critical-400 text-critical-400 hover:bg-critical-50 active:bg-critical-100',
      },
      {
        variant: 'secondary',
        intent: 'info',
        className: 'border-info-400 text-info-400 hover:bg-info-50 active:bg-info-100',
      },
      
      // Tertiary variant compounds
      {
        variant: 'tertiary',
        intent: 'prime',
        className: 'text-primary-400 hover:bg-primary-50 active:bg-primary-100',
      },
      {
        variant: 'tertiary',
        intent: 'muted',
        className: 'text-secondary-700 hover:bg-secondary-50 active:bg-secondary-100',
      },
      {
        variant: 'tertiary',
        intent: 'success',
        className: 'text-success-500 hover:bg-success-50 active:bg-success-100',
      },
      {
        variant: 'tertiary',
        intent: 'warning',
        className: 'text-warning-500 hover:bg-warning-50 active:bg-warning-100',
      },
      {
        variant: 'tertiary',
        intent: 'critical',
        className: 'text-critical-400 hover:bg-critical-50 active:bg-critical-100',
      },
      {
        variant: 'tertiary',
        intent: 'info',
        className: 'text-info-400 hover:bg-info-50 active:bg-info-100',
      },
      
      // Icon only size adjustments (rounded, square)
      {
        iconOnly: true,
        size: 'sm',
        className: 'w-8 h-8 p-0 rounded-full',
      },
      {
        iconOnly: true,
        size: 'lg',
        className: 'w-11 h-11 p-0 rounded-full',
      },
      {
        iconOnly: true,
        size: 'xl',
        className: 'w-12 h-12 p-0 rounded-full',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      intent: 'prime',
      size: 'lg',
      iconOnly: false,
      fullWidth: false,
    },
  }
)

/**
 * Icon size mappings based on button size
 */
export const iconSizes = {
  sm: 16,
  lg: 20,
  xl: 24,
} as const
