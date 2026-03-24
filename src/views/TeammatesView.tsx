import { useState, useRef, useEffect } from 'react'
import {
  IconSearch,
  IconDotsVertical,
  IconUserOff,
  IconTransfer,
  IconTrash,
  IconInfoCircle,
  IconX,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutGrid,
  IconLayoutList,
  IconTable,
  IconAdjustmentsHorizontal,
  IconExternalLink,
} from '@tabler/icons-react'
import { Button } from '../components/ui'

interface Teammate {
  id: string
  name: string
  email: string
  role: string
  teammateType: 'Member' | 'Guest'
  contentCount: number
  validUntil: string | null
  status: 'active' | 'inactive'
}

const generateTeammates = (): Teammate[] => {
  const rows: Teammate[] = []
  for (let i = 1; i <= 50; i++) {
    rows.push({
      id: `u${i}`,
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      role: 'Translator',
      teammateType: i <= 4 ? 'Member' : 'Guest',
      contentCount: 3,
      validUntil: i <= 4 ? null : 'Mar 01, 2026',
      status: i <= 50 ? 'active' : 'inactive',
    })
  }
  for (let i = 51; i <= 58; i++) {
    rows.push({
      id: `u${i}`,
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      role: 'Translator',
      teammateType: 'Guest',
      contentCount: 3,
      validUntil: 'Mar 01, 2026',
      status: 'inactive',
    })
  }
  return rows
}

interface TeammatesViewProps {
  onTransferContent?: (teammate: { id: string; name: string; email: string }, stage: 'draft' | 'ready' | 'production') => void
}

export function TeammatesView({ onTransferContent }: TeammatesViewProps) {
  const [teammates] = useState<Teammate[]>(generateTeammates())
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [stagePickerFor, setStagePickerFor] = useState<Teammate | null>(null)
  const [selectedStage, setSelectedStage] = useState<'draft' | 'ready' | 'production'>('ready')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 9
  const menuRef = useRef<HTMLDivElement>(null)

  const activeCount = teammates.filter(t => t.status === 'active').length
  const inactiveCount = teammates.filter(t => t.status === 'inactive').length

  const filtered = teammates
    .filter(t => t.status === activeTab)
    .filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const totalPages = Math.ceil(filtered.length / rowsPerPage)
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTransferClick = (teammate: Teammate) => {
    setOpenMenuId(null)
    setStagePickerFor(teammate)
    setSelectedStage('ready')
  }

  const handleViewContent = () => {
    if (stagePickerFor && onTransferContent) {
      onTransferContent(
        { id: stagePickerFor.id, name: stagePickerFor.name, email: stagePickerFor.email },
        selectedStage
      )
    }
    setStagePickerFor(null)
  }

  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#FCFCFD', overflow: 'hidden' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-[22px] font-bold text-secondary-1000 mb-5">Teammates</h1>

        {/* Info Banner */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-lg mb-5"
          style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}
        >
          <IconInfoCircle size={20} stroke={1.5} className="text-info-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-secondary-900">Awaiting provisioning call</p>
            <p className="text-[13px] text-secondary-500 mt-0.5">
              In the next 72hrs we will retry to activate SCIM. Keep a watch on this page for updates. Contact support for further help
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 h-9 rounded-md text-[13px] font-medium border border-info-300 text-info-500 hover:bg-info-50 transition-colors flex-shrink-0"
          >
            Contact support
          </button>
          <button className="text-secondary-400 hover:text-secondary-600 flex-shrink-0 mt-0.5">
            <IconX size={18} stroke={2} />
          </button>
        </div>

        {/* Tabs + Search + Actions row */}
        <div className="flex items-center justify-between mb-4">
          {/* Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => { setActiveTab('active'); setCurrentPage(1) }}
              className="relative flex items-center gap-2 pb-2.5"
            >
              <span className={`text-[15px] font-semibold ${activeTab === 'active' ? 'text-[#E45913]' : 'text-secondary-500'}`}>
                Active
              </span>
              <span className={`inline-flex items-center justify-center min-w-[24px] h-[20px] px-1.5 rounded-full text-[11px] font-bold ${
                activeTab === 'active' ? 'bg-info-100 text-info-500' : 'bg-secondary-100 text-secondary-500'
              }`}>
                {activeCount}
              </span>
              {activeTab === 'active' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E45913] rounded-full" />
              )}
            </button>
            <button
              onClick={() => { setActiveTab('inactive'); setCurrentPage(1) }}
              className="relative flex items-center gap-2 pb-2.5"
            >
              <span className={`text-[15px] font-semibold ${activeTab === 'inactive' ? 'text-[#E45913]' : 'text-secondary-500'}`}>
                Inactive
              </span>
              <span className={`inline-flex items-center justify-center min-w-[24px] h-[20px] px-1.5 rounded-full text-[11px] font-bold ${
                activeTab === 'inactive' ? 'bg-info-100 text-info-500' : 'bg-secondary-100 text-secondary-500'
              }`}>
                {inactiveCount}
              </span>
              {activeTab === 'inactive' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E45913] rounded-full" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-secondary-200 bg-white" style={{ minWidth: '220px' }}>
              <IconSearch size={16} stroke={1.5} className="text-secondary-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="flex-1 text-[13px] text-secondary-900 bg-transparent outline-none placeholder:text-secondary-400"
              />
            </div>

            {/* View toggles */}
            <div className="flex items-center gap-0.5">
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 transition-colors">
                <IconAdjustmentsHorizontal size={18} stroke={1.5} />
              </button>
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 transition-colors">
                <IconLayoutList size={18} stroke={1.5} />
              </button>
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 transition-colors">
                <IconTable size={18} stroke={1.5} />
              </button>
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 transition-colors">
                <IconLayoutGrid size={18} stroke={1.5} />
              </button>
            </div>

            {/* Add Teammate */}
            <Button intent="prime" size="lg">
              Add Teammate
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6" style={{ minHeight: 0 }}>
        <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-elevation-1">
          <table className="w-full" style={{ minWidth: '1000px' }}>
            <thead>
              <tr className="border-b border-secondary-200" style={{ backgroundColor: '#F8F8FB' }}>
                <th style={{ width: '44px', padding: '0 0 0 12px' }}>
                  <div className="flex items-center justify-center h-11">
                    <input
                      type="checkbox"
                      className="w-[15px] h-[15px] rounded-sm border-secondary-300 text-info-400 focus:ring-info-400 cursor-pointer accent-[#0975D7]"
                    />
                  </div>
                </th>
                <th className="text-left" style={{ padding: '0 12px', minWidth: '150px' }}>
                  <span className="inline-flex items-center h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Name</span>
                </th>
                <th className="text-left" style={{ padding: '0 12px', minWidth: '180px' }}>
                  <span className="inline-flex items-center h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Email</span>
                </th>
                <th className="text-left" style={{ padding: '0 12px', minWidth: '120px' }}>
                  <span className="inline-flex items-center h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Role</span>
                </th>
                <th className="text-left" style={{ padding: '0 12px', minWidth: '140px' }}>
                  <span className="inline-flex items-center h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Teammate Type</span>
                </th>
                <th className="text-left" style={{ padding: '0 12px', minWidth: '90px' }}>
                  <span className="inline-flex items-center h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Content</span>
                </th>
                <th className="text-left" style={{ padding: '0 12px', minWidth: '120px' }}>
                  <span className="inline-flex items-center h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Valid Until</span>
                </th>
                <th className="text-left" style={{ padding: '0 12px', minWidth: '70px' }}>
                  <span className="inline-flex items-center h-11 text-[12px] font-semibold uppercase tracking-wider text-secondary-500">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((teammate, index) => {
                const isLast = index === paginated.length - 1
                const initials = teammate.name.split(' ').map(n => n[0]).join('').toUpperCase()
                return (
                  <tr
                    key={`${teammate.id}-${index}`}
                    className={`group bg-white hover:bg-secondary-50 transition-colors duration-100 ${!isLast ? 'border-b border-secondary-200' : ''}`}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '0 0 0 12px' }}>
                      <div className="flex items-center justify-center h-[48px]">
                        <input
                          type="checkbox"
                          className="w-[15px] h-[15px] rounded-sm border-secondary-300 text-info-400 focus:ring-info-400 cursor-pointer accent-[#0975D7]"
                        />
                      </div>
                    </td>

                    {/* Name with avatar */}
                    <td style={{ padding: '0 12px' }}>
                      <div className="flex items-center gap-2.5 h-[48px]">
                        <div className="w-[30px] h-[30px] rounded-full bg-secondary-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-semibold text-secondary-600">{initials}</span>
                        </div>
                        <span className="text-[13px] text-secondary-900 font-medium">{teammate.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '0 12px' }}>
                      <span className="text-[13px] text-secondary-600">{teammate.email}</span>
                    </td>

                    {/* Role with dropdown */}
                    <td style={{ padding: '0 12px' }}>
                      <div className="inline-flex items-center gap-1 px-2 h-7 rounded border border-secondary-200 bg-white text-[13px] text-secondary-700 cursor-pointer">
                        <span>{teammate.role}</span>
                        <IconChevronDown size={12} stroke={2} className="text-secondary-400" />
                      </div>
                    </td>

                    {/* Teammate Type */}
                    <td style={{ padding: '0 12px' }}>
                      {teammate.teammateType === 'Member' ? (
                        <span className="inline-flex items-center px-3 h-[26px] rounded-full text-[12px] font-semibold bg-[#FFF3ED] text-[#E45913] border border-[#FDCDB0]">
                          Member
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 h-[26px] rounded-full text-[12px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] cursor-pointer">
                          Guest
                          <IconChevronDown size={11} stroke={2.5} />
                        </span>
                      )}
                    </td>

                    {/* Content */}
                    <td style={{ padding: '0 12px' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-secondary-900 font-medium">{teammate.contentCount}</span>
                        <button className="text-info-400 hover:text-info-500">
                          <IconExternalLink size={14} stroke={1.8} />
                        </button>
                      </div>
                    </td>

                    {/* Valid Until */}
                    <td style={{ padding: '0 12px' }}>
                      <span className="text-[13px] text-secondary-600">
                        {teammate.validUntil ?? 'N/A'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0 12px' }}>
                      <div className="relative" ref={openMenuId === teammate.id ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === teammate.id ? null : teammate.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-md text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                        >
                          <IconDotsVertical size={16} stroke={1.5} />
                        </button>

                        {openMenuId === teammate.id && (
                          <div className="absolute right-0 top-full mt-1 w-[180px] bg-white border border-secondary-200 rounded-lg shadow-elevation-3 z-50 py-1">
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-secondary-700 hover:bg-secondary-50 transition-colors"
                            >
                              <IconUserOff size={15} stroke={1.5} className="text-secondary-500" />
                              Mark as Inactive
                            </button>
                            <button
                              onClick={() => handleTransferClick(teammate)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-secondary-700 hover:bg-secondary-50 transition-colors"
                            >
                              <IconTransfer size={15} stroke={1.5} className="text-secondary-500" />
                              Transfer Content
                            </button>
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-secondary-700 hover:bg-secondary-50 transition-colors"
                            >
                              <IconTrash size={15} stroke={1.5} className="text-secondary-500" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <p className="text-[14px] text-secondary-500">No teammates found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-center px-6 bg-white border-t border-secondary-200"
        style={{ height: '52px', flexShrink: 0 }}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 rounded-md text-secondary-500 hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronLeft size={16} stroke={2} />
          </button>
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={`dots-${idx}`} className="flex items-center justify-center w-8 h-8 text-[13px] text-secondary-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page as number)}
                className={`flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md text-[13px] font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-info-400 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center justify-center w-8 h-8 rounded-md text-secondary-500 hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <IconChevronRight size={16} stroke={2} />
          </button>
        </div>
      </div>

      {/* Stage Picker Modal */}
      {stagePickerFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-secondary-1000/20"
            onClick={() => setStagePickerFor(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-elevation-4 w-[480px]" style={{ padding: '32px 36px' }}>
            <button
              onClick={() => setStagePickerFor(null)}
              className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600"
            >
              <IconX size={20} stroke={2} />
            </button>

            <h3 className="text-[18px] font-bold text-secondary-900 leading-snug pr-8 mb-8">
              Choose the stage for which you want to transfer the content to another teammate
            </h3>

            {/* Radio options */}
            <div className="space-y-5 mb-8">
              {/* Draft */}
              <label className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedStage('draft')}>
                <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedStage === 'draft' ? 'border-info-400' : 'border-secondary-300'
                }`}>
                  {selectedStage === 'draft' && <div className="w-[10px] h-[10px] rounded-full bg-info-400" />}
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-full text-[13px] font-semibold bg-secondary-100 text-secondary-800">
                  <span className="w-[8px] h-[8px] rounded-full bg-secondary-700" />
                  Draft
                </span>
              </label>

              {/* Ready */}
              <label className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedStage('ready')}>
                <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedStage === 'ready' ? 'border-info-400' : 'border-secondary-300'
                }`}>
                  {selectedStage === 'ready' && <div className="w-[10px] h-[10px] rounded-full bg-info-400" />}
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-full text-[13px] font-semibold bg-info-50 text-info-500">
                  <span className="w-[8px] h-[8px] rounded-full bg-info-400" />
                  Ready
                </span>
              </label>

              {/* Production */}
              <label className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedStage('production')}>
                <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedStage === 'production' ? 'border-info-400' : 'border-secondary-300'
                }`}>
                  {selectedStage === 'production' && <div className="w-[10px] h-[10px] rounded-full bg-info-400" />}
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 h-[28px] rounded-full text-[13px] font-semibold bg-success-50 text-success-600">
                  <span className="w-[8px] h-[8px] rounded-full bg-success-400" />
                  Production
                </span>
              </label>
            </div>

            <p className="text-[14px] text-secondary-500 leading-relaxed mb-8">
              You will be redirected to the 'Content' view page where you can select relevant content and choose to transfer to another teammate.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setStagePickerFor(null)}
                className="px-5 h-10 rounded-lg text-[14px] font-medium text-secondary-700 border border-secondary-300 hover:bg-secondary-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleViewContent}
                className="px-5 h-10 rounded-lg text-[14px] font-semibold text-white transition-colors"
                style={{ backgroundColor: '#E5A100' }}
              >
                View content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
