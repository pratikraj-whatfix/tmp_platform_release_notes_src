import { useState, useRef, useEffect } from 'react'
import { IconUsers, IconSearch, IconCheck, IconSelector } from '@tabler/icons-react'

interface Workspace {
  id: string
  name: string
}

interface WorkspaceSwitcherProps {
  workspaces: Workspace[]
  currentWorkspaceId: string
  onWorkspaceSelect: (workspaceId: string) => void
  isCollapsed?: boolean
}

/**
 * WorkspaceSwitcher Component
 */
export function WorkspaceSwitcher({
  workspaces,
  currentWorkspaceId,
  onWorkspaceSelect,
  isCollapsed = false,
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredWorkspaces = workspaces.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {isCollapsed ? (
        // Collapsed state - icon with hover background and bracket
        <button
          className="workspace-switcher-collapsed-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IconUsers size={22} stroke={2} color="#FFFFFF" />
          <span className="sidebar-bracket-indicator-bottom">┐</span>
        </button>
      ) : (
        // Expanded state
        <button
          className="workspace-switcher-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IconUsers size={20} stroke={1.5} />
          <span style={{ flex: 1, textAlign: 'left' }}>{currentWorkspace?.name || 'Select workspace'}</span>
          <IconSelector size={16} stroke={1.5} style={{ opacity: 0.6 }} />
        </button>
      )}

      {isOpen && (
        <div className="workspace-dropdown">
          {/* Header with current workspace */}
          <div className="workspace-dropdown-header">
            <IconUsers size={20} stroke={1.5} />
            <span>{currentWorkspace?.name}</span>
          </div>

          {/* Search */}
          <div className="workspace-dropdown-search">
            <IconSearch size={18} stroke={1.5} style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search for a workspace"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Workspaces list */}
          <div className="workspace-dropdown-section">
            <div className="workspace-dropdown-section-title">All workspaces</div>
            <div className="workspace-dropdown-list">
              {filteredWorkspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => {
                    onWorkspaceSelect(workspace.id)
                    setIsOpen(false)
                    setSearchQuery('')
                  }}
                  className={`workspace-dropdown-item ${workspace.id === currentWorkspaceId ? 'active' : ''}`}
                >
                  <IconUsers size={20} stroke={1.5} style={{ color: '#6B7280' }} />
                  <span className="workspace-dropdown-item-name">{workspace.name}</span>
                  {workspace.id === currentWorkspaceId && (
                    <IconCheck size={18} stroke={2} style={{ color: '#3B82F6' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
