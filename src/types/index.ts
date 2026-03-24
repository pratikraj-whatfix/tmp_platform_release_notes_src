import type { ReactNode } from 'react'

// Common prop types
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Button types
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonIntent = 'prime' | 'muted' | 'success' | 'warning' | 'critical' | 'info'
export type ButtonSize = 'sm' | 'lg' | 'xl'

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant
  intent?: ButtonIntent
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// Modal types
export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string | ReactNode
  size?: ModalSize
  showCloseButton?: boolean
  footer?: ReactNode
}

// Card types
export interface CardProps extends BaseComponentProps {
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// Badge types
export type BadgeVariant = 'default' | 'success' | 'warning' | 'critical' | 'info'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant
  size?: BadgeSize
}

// Input types
export interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  iconLeft?: ReactNode
  iconRight?: ReactNode
  className?: string
  id?: string
  name?: string
}

// Navigation types
export interface NavSubItem {
  id: string
  label: string
  icon?: ReactNode
}

export interface NavSection {
  id: string
  label: string
  icon?: ReactNode
  isExpandable?: boolean
  items?: NavSubItem[]
}

export interface NavItem {
  id: string
  label: string
  icon: ReactNode
  href?: string
  onClick?: () => void
  badge?: string | number
  children?: NavItem[]
  // Secondary navigation (right panel)
  secondaryNav?: {
    title: string
    sections: NavSection[]
  }
}

// Chart data types
export interface ChartDataPoint {
  name: string
  value: number
}

export interface LineChartData {
  xAxis: string[]
  series: {
    name: string
    data: number[]
  }[]
}

export interface BarChartData {
  xAxis: string[]
  series: {
    name: string
    data: number[]
  }[]
}

export interface PieChartData {
  data: ChartDataPoint[]
}
