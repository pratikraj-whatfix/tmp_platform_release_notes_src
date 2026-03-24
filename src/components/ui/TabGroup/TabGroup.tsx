import { useState } from 'react'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabGroupProps {
  tabs: Tab[]
  defaultActiveId?: string
  onChange?: (tabId: string) => void
}

/**
 * TabGroup Component
 * 
 * Implements the Navi Design System tab component.
 * - Active tab: #0975D7 (Info-400) with rounded underline indicator
 * - Inactive tab: #3D3C52 (Secondary-800)
 * - Font: Inter Semi Bold, 16px, line-height 24px
 */
export function TabGroup({ tabs, defaultActiveId, onChange }: TabGroupProps) {
  const [activeId, setActiveId] = useState(defaultActiveId || tabs[0]?.id)

  const handleTabClick = (tabId: string) => {
    setActiveId(tabId)
    onChange?.(tabId)
  }

  return (
    <div className="tab-group">
      {tabs.map((tab) => {
        const isActive = activeId === tab.id
        return (
          <button
            key={tab.id}
            className={`tab-group-tab ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <div className="tab-group-tab-content">
              <span className="tab-group-tab-label">
                {tab.label}
              </span>
              {tab.count !== undefined && (
                <span className="tab-group-count">{tab.count}</span>
              )}
            </div>
            <div className={`tab-group-indicator ${isActive ? 'active' : ''}`} />
          </button>
        )
      })}
    </div>
  )
}
