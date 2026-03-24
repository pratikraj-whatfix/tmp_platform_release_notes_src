import { forwardRef, useId } from 'react'
import { cn } from '../../../lib/utils'
import type { InputProps } from '../../../types'

/**
 * Input Component
 * 
 * Text input field with label, helper text, and error states.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email address"
 *   placeholder="you@example.com"
 *   type="email"
 *   required
 * />
 * 
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      error,
      helperText,
      disabled = false,
      required = false,
      type = 'text',
      iconLeft,
      iconRight,
      className,
      id: propId,
      name,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = propId || generatedId
    const hasError = Boolean(error)

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        {label && (
          <label
            htmlFor={id}
            className="text-label-medium text-secondary-700"
          >
            {label}
            {required && <span className="text-critical-400 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              'w-full h-11 px-3 py-2',
              'text-bodytext-03 text-secondary-1000 placeholder:text-secondary-400',
              'bg-white border rounded-md',
              'transition-default focus-ring',
              'disabled:bg-secondary-50 disabled:text-secondary-400 disabled:cursor-not-allowed',
              hasError
                ? 'border-critical-400 focus:border-critical-400'
                : 'border-secondary-300 hover:border-secondary-400 focus:border-info-400',
              iconLeft && 'pl-10',
              iconRight && 'pr-10'
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            {...props}
          />

          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {iconRight}
            </span>
          )}
        </div>

        {error && (
          <p id={`${id}-error`} className="text-bodytext-04 text-critical-400">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${id}-helper`} className="text-bodytext-04 text-secondary-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
