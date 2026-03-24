import { useState } from 'react'
import { IconChevronUp } from '@tabler/icons-react'
import type { NavSection } from '../../../types'

interface SecondaryNavProps {
  title: string
  sections: NavSection[]
  onItemClick?: (sectionId: string, itemId: string) => void
  activeItemId?: string
  sidebarWidth?: number
}

/**
 * SecondaryNav Component - Right panel navigation
 */
export function SecondaryNav({
  title,
  sections,
  onItemClick,
  activeItemId,
  sidebarWidth = 260,
}: SecondaryNavProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.filter(s => s.isExpandable !== false).map(s => s.id)
  )

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="secondary-nav" style={{ left: `${sidebarWidth}px` }}>
      <div className="secondary-nav-header">
        <h2 className="secondary-nav-title">{title}</h2>
      </div>

      <div className="secondary-nav-content">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          const hasItems = section.items && section.items.length > 0

          return (
            <div key={section.id} className="secondary-nav-section">
              {section.isExpandable && hasItems ? (
                // Expandable section with items
                <>
                  <button
                    className="secondary-nav-section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    {section.icon && (
                      <span className="secondary-nav-section-icon">{section.icon}</span>
                    )}
                    <span className="secondary-nav-section-label">{section.label}</span>
                    <IconChevronUp 
                      size={16} 
                      stroke={2}
                      className={`secondary-nav-chevron ${isExpanded ? '' : 'collapsed'}`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="secondary-nav-section-items">
                      {section.items?.map((item) => (
                        <button
                          key={item.id}
                          className={`secondary-nav-item ${activeItemId === item.id ? 'active' : ''}`}
                          onClick={() => onItemClick?.(section.id, item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : hasItems ? (
                // Non-expandable section with items (just show items)
                <>
                  <button
                    className={`secondary-nav-link ${activeItemId === section.id ? 'active' : ''}`}
                    onClick={() => onItemClick?.(section.id, section.id)}
                  >
                    {section.icon && (
                      <span className="secondary-nav-link-icon">{section.icon}</span>
                    )}
                    <span>{section.label}</span>
                  </button>
                  <div className="secondary-nav-section-items">
                    {section.items?.map((item) => (
                      <button
                        key={item.id}
                        className={`secondary-nav-item ${activeItemId === item.id ? 'active' : ''}`}
                        onClick={() => onItemClick?.(section.id, item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                // Simple link without items
                <button
                  className={`secondary-nav-link ${activeItemId === section.id ? 'active' : ''}`}
                  onClick={() => onItemClick?.(section.id, section.id)}
                >
                  {section.icon && (
                    <span className="secondary-nav-link-icon">{section.icon}</span>
                  )}
                  <span>{section.label}</span>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
