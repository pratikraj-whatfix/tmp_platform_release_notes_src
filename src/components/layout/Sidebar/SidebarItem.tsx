import type { NavItem } from '../../../types'

interface SidebarItemProps {
  item: NavItem
  isActive?: boolean
  isCollapsed?: boolean
  hasIndicator?: boolean
  onClick?: (item: NavItem) => void
}

/**
 * SidebarItem Component
 */
export function SidebarItem({
  item,
  isActive = false,
  isCollapsed = false,
  hasIndicator = false,
  onClick,
}: SidebarItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(item)
    }
  }

  const className = [
    'sidebar-item',
    isActive ? 'active' : '',
    isCollapsed ? 'sidebar-item-collapsed' : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      onClick={handleClick}
      className={className}
      title={isCollapsed ? item.label : undefined}
    >
      <span className="sidebar-item-icon" style={{ position: 'relative', flexShrink: 0, width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.icon}
        {hasIndicator && <span className="indicator-dot" />}
      </span>
      
      {!isCollapsed && (
        <>
          <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
          {item.badge && (
            <span style={{
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: '#3B82F6',
              color: 'white',
              borderRadius: '4px',
            }}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  )
}
