import { useState } from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconBell,
  IconBook,
  IconMessage,
  IconSparkles,
} from '@tabler/icons-react'
import { SidebarItem } from './SidebarItem'
import { ProductSwitcher } from './ProductSwitcher'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import type { NavItem } from '../../../types'

interface Product {
  id: string
  name: string
  description: string
  icon: string // Image path
  badge?: string
}

interface Workspace {
  id: string
  name: string
}

interface SidebarProps {
  items: NavItem[]
  activeItemId?: string
  onItemClick?: (item: NavItem) => void
  products?: Product[]
  currentProductId?: string
  currentProductName?: string
  currentProductIcon?: string
  onProductSelect?: (productId: string) => void
  workspaces?: Workspace[]
  currentWorkspaceId?: string
  onWorkspaceSelect?: (workspaceId: string) => void
  userName?: string
  defaultCollapsed?: boolean
  showExploreDemo?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

/**
 * Sidebar Component
 */
export function Sidebar({
  items,
  activeItemId,
  onItemClick,
  products = [],
  currentProductId = '',
  currentProductName = '',
  currentProductIcon = '',
  onProductSelect,
  workspaces = [],
  currentWorkspaceId = '',
  onWorkspaceSelect,
  userName = 'User',
  defaultCollapsed = false,
  showExploreDemo = false,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed
  const setIsCollapsed = (v: boolean) => {
    setInternalCollapsed(v)
    onCollapsedChange?.(v)
  }

  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <aside
      className="sidebar"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: isCollapsed ? '68px' : '260px',
        transition: 'width 200ms',
      }}
    >
      {/* Collapse Toggle */}
      <button
        className="sidebar-collapse-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <IconChevronRight size={14} stroke={2} />
        ) : (
          <IconChevronLeft size={14} stroke={2} />
        )}
      </button>

      {/* Header */}
      <div className="sidebar-header" style={isCollapsed ? { justifyContent: 'center', padding: '0', position: 'relative' } : {}}>
        {isCollapsed ? (
          // Collapsed state - product icon with bracket indicator at edge
          <>
            {products.length > 0 && onProductSelect ? (
              <ProductSwitcher
                products={products}
                currentProductId={currentProductId}
                currentProductIcon={currentProductIcon}
                onProductSelect={onProductSelect}
                isCollapsed={true}
              />
            ) : (
              currentProductIcon ? (
                <img 
                  src={currentProductIcon} 
                  alt={currentProductName}
                  style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                />
              ) : (
                <DefaultProductIcon />
              )
            )}
          </>
        ) : (
          // Expanded state
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {currentProductIcon ? (
                <img 
                  src={currentProductIcon} 
                  alt={currentProductName}
                  style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                />
              ) : (
                <DefaultProductIcon />
              )}
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
                {currentProductName}
              </span>
            </div>
            {products.length > 0 && onProductSelect && (
              <ProductSwitcher
                products={products}
                currentProductId={currentProductId}
                onProductSelect={onProductSelect}
              />
            )}
          </>
        )}
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Workspace Selector */}
      {workspaces.length > 0 && onWorkspaceSelect && (
        <WorkspaceSwitcher
          workspaces={workspaces}
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceSelect={onWorkspaceSelect}
          isCollapsed={isCollapsed}
        />
      )}

      {/* Main Navigation */}
      <nav className={isCollapsed ? 'sidebar-nav sidebar-nav-collapsed' : 'sidebar-nav'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={activeItemId === item.id}
              isCollapsed={isCollapsed}
              onClick={onItemClick}
            />
          ))}
        </div>
      </nav>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Bottom Section */}
      <div className={isCollapsed ? 'sidebar-bottom sidebar-bottom-collapsed' : 'sidebar-bottom'}>
        {/* User Profile */}
        <button className="sidebar-user" style={isCollapsed ? { justifyContent: 'center', padding: '12px 0' } : {}}>
          <div className="sidebar-user-avatar">{userInitial}</div>
          {!isCollapsed && <span>{userName}</span>}
        </button>

        {/* Explore Demo - only for Analytics */}
        {showExploreDemo && (
          <SidebarItem
            item={{
              id: 'explore-demo',
              label: 'Explore demo',
              icon: <IconSparkles size={22} stroke={2} />,
            }}
            isCollapsed={isCollapsed}
            onClick={onItemClick}
          />
        )}

        {/* Notifications */}
        <SidebarItem
          item={{
            id: 'notifications',
            label: 'Notifications',
            icon: <IconBell size={22} stroke={2} />,
          }}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
          hasIndicator
        />

        {/* Resources */}
        <SidebarItem
          item={{
            id: 'resources',
            label: 'Resources',
            icon: <IconBook size={22} stroke={2} />,
          }}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
        />

        {/* Chat */}
        <SidebarItem
          item={{
            id: 'chat',
            label: 'Chat',
            icon: <IconMessage size={22} stroke={2} />,
          }}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
        />
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Whatfix Logo */}
      <div 
        className="sidebar-logo" 
        style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isCollapsed ? '8px' : '8px 16px'
        }}
      >
        <img 
          src="/brand/whatfix-logo.png" 
          alt="Whatfix"
          style={{ 
            height: isCollapsed ? '24px' : '70px', 
            width: 'auto',
            objectFit: 'contain' 
          }}
        />
      </div>
    </aside>
  )
}

function DefaultProductIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L28 16L16 28L4 16L16 4Z" fill="#E45913" />
      <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="#FF7A3D" />
    </svg>
  )
}
