import { useState, useEffect } from 'react'
import {
  IconFolder,
  IconRoute,
  IconTarget,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronDown,
  IconChevronsRight,
  IconFolderPlus,
  IconShare,
  IconDownload,
  IconTags,
  IconArchive,
  IconTrash,
  IconX,
  IconTransfer,
  IconChecklist,
  IconRocket,
  IconAntenna,
} from '@tabler/icons-react'
import { Badge } from '../components/ui'

export interface ContentItem {
  id: string
  name: string
  type: 'folder' | 'flow' | 'beacon' | 'smart-tip' | 'launcher' | 'task-list'
  version?: number
  lastUpdatedOn: string
  lastUpdatedBy: string
  createdBy: string
}

const generateSampleContent = (): ContentItem[] => {
  return [
    { id: 'folder-1', name: 'ga 0', type: 'folder', lastUpdatedOn: 'Dec 20, 2024', lastUpdatedBy: 'Jinal', createdBy: 'Jinal' },
    { id: 'content-1', name: 'enter wala use case', type: 'flow', version: 1, lastUpdatedOn: 'Dec 16, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
    { id: 'content-2', name: 'Flow Exp 1', type: 'flow', version: 3, lastUpdatedOn: 'Nov 14, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
    { id: 'content-3', name: 'beacon', type: 'beacon', version: 1, lastUpdatedOn: 'Aug 12, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
    { id: 'content-4', name: '67y8ghyu', type: 'flow', version: 1, lastUpdatedOn: 'Mar 10, 2025', lastUpdatedBy: 'Madhav Sridhar', createdBy: 'Madhav Sridhar' },
    { id: 'content-5', name: '64567464y', type: 'flow', version: 2, lastUpdatedOn: 'Feb 05, 2025', lastUpdatedBy: 'Madhav Sridhar', createdBy: 'Madhav Sridhar' },
    { id: 'content-6', name: 'wikipedia test', type: 'flow', version: 1, lastUpdatedOn: 'Feb 04, 2025', lastUpdatedBy: 'Madhav Sridhar', createdBy: 'Madhav Sridhar' },
    { id: 'content-7', name: 'vsblhoh', type: 'flow', version: 1, lastUpdatedOn: 'Dec 18, 2024', lastUpdatedBy: 'Jinal', createdBy: 'Jinal' },
    { id: 'content-8', name: 'ga', type: 'flow', version: 2, lastUpdatedOn: 'Dec 03, 2024', lastUpdatedBy: 'Jinal', createdBy: 'Jinal' },
    { id: 'content-9', name: 'hs', type: 'flow', version: 1, lastUpdatedOn: 'Dec 03, 2024', lastUpdatedBy: 'Jinal', createdBy: 'Jinal' },
    { id: 'content-10', name: 'test content 1', type: 'smart-tip', version: 1, lastUpdatedOn: 'Jan 15, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
    { id: 'content-11', name: 'test content 2', type: 'launcher', version: 1, lastUpdatedOn: 'Jan 10, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
    { id: 'content-12', name: 'test content 3', type: 'task-list', version: 1, lastUpdatedOn: 'Jan 05, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
    { id: 'folder-2', name: 'test folder', type: 'folder', lastUpdatedOn: 'Jan 20, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
    { id: 'content-13', name: 'another flow', type: 'flow', version: 1, lastUpdatedOn: 'Jan 25, 2025', lastUpdatedBy: 'Pratik Raj', createdBy: 'Pratik Raj' },
  ]
}

const getTypeIcon = (type: ContentItem['type']) => {
  const iconClass = 'flex-shrink-0'
  switch (type) {
    case 'folder':
      return <IconFolder size={20} stroke={1.5} className={`${iconClass} text-warning-400`} />
    case 'flow':
      return <IconRoute size={20} stroke={1.5} className={`${iconClass} text-info-400`} />
    case 'beacon':
      return <IconAntenna size={20} stroke={1.5} className={`${iconClass} text-success-400`} />
    case 'smart-tip':
      return <IconTarget size={20} stroke={1.5} className={`${iconClass} text-primary-300`} />
    case 'launcher':
      return <IconRocket size={20} stroke={1.5} className={`${iconClass} text-secondary-600`} />
    case 'task-list':
      return <IconChecklist size={20} stroke={1.5} className={`${iconClass} text-info-500`} />
    default:
      return <IconRoute size={20} stroke={1.5} className={`${iconClass} text-secondary-500`} />
  }
}

const getTypeLabel = (type: ContentItem['type']) => {
  switch (type) {
    case 'folder': return 'Folder'
    case 'flow': return 'Flow'
    case 'beacon': return 'Beacon'
    case 'smart-tip': return 'Smart Tip'
    case 'launcher': return 'Launcher'
    case 'task-list': return 'Task List'
    default: return type
  }
}

const getTypeBadgeVariant = (type: ContentItem['type']): 'default' | 'info' | 'success' | 'warning' | 'critical' => {
  switch (type) {
    case 'folder': return 'warning'
    case 'flow': return 'info'
    case 'beacon': return 'success'
    case 'smart-tip': return 'default'
    case 'launcher': return 'default'
    case 'task-list': return 'info'
    default: return 'default'
  }
}

interface ContentViewProps {
  onSelectionChange?: (selectedIds: string[]) => void
  onTransferClick?: () => void
  transferMode?: boolean
  transferSource?: { id: string; name: string; email: string } | null
  onExitTransferMode?: () => void
}

export function ContentView({ onSelectionChange, onTransferClick, transferMode, transferSource, onExitTransferMode }: ContentViewProps) {
  const [contentItems] = useState<ContentItem[]>(generateSampleContent())
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(15)
  const [sortColumn, setSortColumn] = useState<'name' | 'lastUpdatedOn'>('lastUpdatedOn')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    onSelectionChange?.(Array.from(selectedItems))
  }, [selectedItems, onSelectionChange])

  const filteredContent = contentItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lastUpdatedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedContent = [...filteredContent].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    if (sortColumn === 'name') {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
    } else {
      aValue = new Date(a.lastUpdatedOn).getTime()
      bValue = new Date(b.lastUpdatedOn).getTime()
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const paginatedContent = sortedContent.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(paginatedContent.map(item => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedItems(newSelected)
  }

  const handleDeselectAll = () => {
    setSelectedItems(new Set())
  }

  const handleSort = (column: 'name' | 'lastUpdatedOn') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ column }: { column: 'name' | 'lastUpdatedOn' }) => {
    if (sortColumn !== column) return <IconChevronDown size={12} stroke={2} className="text-secondary-400" />
    return sortDirection === 'asc' 
      ? <IconChevronUp size={12} stroke={2} className="text-secondary-700" /> 
      : <IconChevronDown size={12} stroke={2} className="text-secondary-700" />
  }

  const allSelected = paginatedContent.length > 0 && paginatedContent.every(item => selectedItems.has(item.id))
  const someSelected = selectedItems.size > 0
  const totalRows = filteredContent.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  // Toolbar action button component
  const ToolbarAction = ({ icon, label, onClick, variant = 'default' }: { 
    icon: React.ReactNode; label: string; onClick?: () => void; variant?: 'default' | 'danger' 
  }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-[13px] font-medium transition-all duration-150 ${
        variant === 'danger'
          ? 'text-critical-400 hover:bg-critical-50 hover:text-critical-500'
          : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#FCFCFD', overflow: 'hidden' }}>
      {/* Transfer Mode Banner */}
      {transferMode && !someSelected && (
        <div
          className="flex items-center gap-3 px-5 border-b border-info-200 bg-info-50"
          style={{ height: '52px', flexShrink: 0 }}
        >
          <IconTransfer size={16} stroke={1.5} className="text-info-500" />
          <span className="text-[13px] text-info-600 font-medium">
            Select content to transfer from {transferSource?.name || 'teammate'}
          </span>
          <button
            onClick={onExitTransferMode}
            className="ml-auto inline-flex items-center gap-1 px-3 h-7 rounded-md text-[12px] font-medium text-secondary-600 hover:bg-white border border-secondary-200 transition-colors"
          >
            Cancel transfer
          </button>
        </div>
      )}

      {/* Selection Toolbar */}
      {someSelected && (
        <div 
          className="flex items-center gap-1 px-5 border-b border-secondary-200 bg-white"
          style={{ height: '52px', flexShrink: 0 }}
        >
          {/* Selected count pill */}
          <button
            onClick={handleDeselectAll}
            className="inline-flex items-center gap-1.5 pl-3 pr-2 h-8 bg-info-50 border border-info-300 text-info-500 rounded-full text-[13px] font-medium hover:bg-info-100 transition-all duration-150"
          >
            <span>{selectedItems.size} selected</span>
            <IconX size={14} stroke={2.5} />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-secondary-200 mx-1" />

          {/* Actions */}
          <ToolbarAction 
            icon={<IconFolderPlus size={16} stroke={1.5} />} 
            label="Move to folder" 
          />
          <ToolbarAction 
            icon={<IconTransfer size={16} stroke={1.5} />} 
            label="Transfer Content" 
            onClick={onTransferClick}
          />
          <ToolbarAction 
            icon={<IconShare size={16} stroke={1.5} />} 
            label="Share" 
          />
          <ToolbarAction 
            icon={<IconDownload size={16} stroke={1.5} />} 
            label="Download" 
          />
          {!transferMode && (
            <>
              <ToolbarAction 
                icon={<IconChevronsRight size={16} stroke={1.5} />} 
                label="Send to Ready" 
              />
              <ToolbarAction 
                icon={<IconTags size={16} stroke={1.5} />} 
                label="Tags" 
              />
              <ToolbarAction 
                icon={<IconArchive size={16} stroke={1.5} />} 
                label="Archive" 
              />
              <ToolbarAction 
                icon={<IconTrash size={16} stroke={1.5} />} 
                label="Delete" 
                variant="danger"
              />
            </>
          )}
        </div>
      )}

      {/* Content Table */}
      <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
        <div className="px-6 py-5">
          <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-elevation-1">
            <table className="w-full" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="border-b border-secondary-200" style={{ backgroundColor: '#F8F8FB' }}>
                  <th style={{ width: '48px', padding: '0 0 0 16px' }}>
                    <div className="flex items-center justify-center h-11">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-[15px] h-[15px] rounded-sm border-secondary-300 text-info-400 focus:ring-info-400 focus:ring-offset-0 cursor-pointer accent-[#0975D7]"
                      />
                    </div>
                  </th>
                  <th className="text-left" style={{ padding: '0 16px', minWidth: '280px' }}>
                    <button
                      onClick={() => handleSort('name')}
                      className="inline-flex items-center gap-1 h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500 hover:text-secondary-700 transition-colors"
                    >
                      Name
                      <SortIcon column="name" />
                    </button>
                  </th>
                  <th className="text-left" style={{ padding: '0 16px', minWidth: '100px' }}>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Type</span>
                  </th>
                  <th className="text-left" style={{ padding: '0 16px', minWidth: '80px' }}>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Version</span>
                  </th>
                  <th className="text-left" style={{ padding: '0 16px', minWidth: '160px' }}>
                    <button
                      onClick={() => handleSort('lastUpdatedOn')}
                      className="inline-flex items-center gap-1 h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500 hover:text-secondary-700 transition-colors"
                    >
                      Last Updated
                      <SortIcon column="lastUpdatedOn" />
                    </button>
                  </th>
                  <th className="text-left" style={{ padding: '0 16px', minWidth: '160px' }}>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Updated By</span>
                  </th>
                  <th className="text-left" style={{ padding: '0 16px', minWidth: '160px' }}>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Created By</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedContent.map((item, index) => {
                  const isSelected = selectedItems.has(item.id)
                  const isLast = index === paginatedContent.length - 1
                  return (
                    <tr
                      key={item.id}
                      className={`group transition-colors duration-100 ${
                        isSelected 
                          ? 'bg-info-50 hover:bg-info-50' 
                          : 'bg-white hover:bg-secondary-50'
                      } ${!isLast ? 'border-b border-secondary-200' : ''}`}
                    >
                      <td style={{ padding: '0 0 0 16px' }}>
                        <div className="flex items-center justify-center h-[52px]">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                            className="w-[15px] h-[15px] rounded-sm border-secondary-300 text-info-400 focus:ring-info-400 focus:ring-offset-0 cursor-pointer accent-[#0975D7]"
                          />
                        </div>
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <div className="flex items-center gap-3 h-[52px]">
                          {getTypeIcon(item.type)}
                          <span className="text-[14px] text-secondary-900 font-medium truncate">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <Badge variant={getTypeBadgeVariant(item.type)} size="sm">
                          {getTypeLabel(item.type)}
                        </Badge>
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        {item.version ? (
                          <span className="text-[13px] text-secondary-700 tabular-nums">
                            v{item.version}
                          </span>
                        ) : (
                          <span className="text-[13px] text-secondary-400">—</span>
                        )}
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <span className="text-[13px] text-secondary-600">
                          {item.lastUpdatedOn}
                        </span>
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <span className="text-[13px] text-secondary-600">
                          {item.lastUpdatedBy}
                        </span>
                      </td>
                      <td style={{ padding: '0 16px' }}>
                        <span className="text-[13px] text-secondary-600">
                          {item.createdBy}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div 
        className="flex items-center justify-between px-6 bg-white border-t border-secondary-200"
        style={{ height: '52px', flexShrink: 0 }}
      >
        <span className="text-[13px] text-secondary-500">
          {Math.min((currentPage - 1) * rowsPerPage + 1, totalRows)}–{Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 rounded-md text-secondary-500 hover:bg-secondary-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronLeft size={16} stroke={2} />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md text-[13px] font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-info-400 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-md text-secondary-500 hover:bg-secondary-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronRight size={16} stroke={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
