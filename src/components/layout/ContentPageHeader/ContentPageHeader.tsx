import type { ReactNode } from 'react'
import { 
  IconChevronDown, 
  IconFolderPlus, 
  IconSearch, 
  IconAdjustmentsHorizontal,
  IconLayoutGrid,
  IconBoxAlignTopRight,
  IconArrowRight,
} from '@tabler/icons-react'
import { TabGroup } from '../../ui'

interface ActionButton {
  label: string
  icon?: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'text'
}

interface ContentPageHeaderProps {
  title: string
  showCreateButton?: boolean
  createButtonLabel?: string
  createButtonIcon?: ReactNode
  onCreateClick?: () => void
  tabs?: { id: string; label: string }[]
  defaultTabId?: string
  onTabChange?: (tabId: string) => void
  showSearch?: boolean
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  showFilter?: boolean
  onFilterClick?: () => void
  showViewToggle?: boolean
  showCreateFolder?: boolean
  onCreateFolderClick?: () => void
  primaryAction?: ActionButton
  showTransferContent?: boolean
  onTransferContentClick?: () => void
  transferMode?: boolean
  onExitTransferMode?: () => void
}

/**
 * ContentPageHeader Component
 */
export function ContentPageHeader({
  title,
  showCreateButton = true,
  createButtonLabel = 'Create content',
  createButtonIcon,
  onCreateClick,
  tabs,
  defaultTabId,
  onTabChange,
  showSearch = true,
  searchPlaceholder = 'Search content',
  onSearchChange,
  showFilter = true,
  onFilterClick,
  showViewToggle = true,
  showCreateFolder = true,
  onCreateFolderClick,
  primaryAction,
  showTransferContent = false,
  onTransferContentClick,
  transferMode = false,
  onExitTransferMode,
}: ContentPageHeaderProps) {
  return (
    <div className="content-page-header">
      {/* Top row: Title only (no create button at top for cleaner look) */}
      <div className="content-page-header-top">
        <h1 className="content-page-header-title">{title}</h1>
        {showCreateButton && !primaryAction && (
          <button className="content-page-header-create-btn" onClick={onCreateClick}>
            {createButtonIcon}
            {createButtonLabel}
            <IconChevronDown size={16} stroke={2} />
          </button>
        )}
      </div>

      {/* Bottom row: Tabs and actions */}
      <div className="content-page-header-bottom">
        <div className="content-page-header-tabs">
          {tabs && (
            <TabGroup 
              tabs={tabs} 
              defaultActiveId={defaultTabId}
              onChange={onTabChange}
            />
          )}
        </div>

        <div className="content-page-header-actions">
          {/* Transfer content button - shown when items are selected */}
          {showTransferContent && (
            <button 
              className="content-page-header-action-btn" 
              onClick={onTransferContentClick}
            >
              <IconArrowRight size={20} stroke={2} />
              <span>Transfer content</span>
            </button>
          )}

          {/* Primary action button (e.g., Create simulation) */}
          {primaryAction && !showTransferContent && (
            <button 
              className="content-page-header-action-btn" 
              onClick={primaryAction.onClick}
            >
              {primaryAction.icon || <IconBoxAlignTopRight size={20} stroke={2} />}
              <span>{primaryAction.label}</span>
            </button>
          )}

          {/* Create folder */}
          {showCreateFolder && !primaryAction && !showTransferContent && (
            <button className="content-page-header-action-btn" onClick={onCreateFolderClick}>
              <IconFolderPlus size={20} stroke={2} />
              <span>Create folder</span>
            </button>
          )}

          {showSearch && (
            <div className="content-page-header-search">
              <IconSearch size={18} stroke={1.5} />
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          )}

          {showFilter && (
            <button className="content-page-header-filter-btn" onClick={onFilterClick}>
              <IconAdjustmentsHorizontal size={18} stroke={1.5} />
              <span>Filter</span>
            </button>
          )}

          {showViewToggle && (
            <button className="content-page-header-icon-btn">
              <IconLayoutGrid size={18} stroke={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
