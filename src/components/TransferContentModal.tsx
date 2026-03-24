import { useState } from 'react'
import { IconInfoCircle, IconChevronDown, IconX } from '@tabler/icons-react'
import { createPortal } from 'react-dom'

export interface ContentItem {
  id: string
  name: string
  type: 'folder' | 'flow' | 'beacon' | 'smart-tip' | 'launcher' | 'task-list'
}

interface TransferContentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItems: ContentItem[]
  entId: string
  onTransfer: (targetUserId: string) => void
  currentUserEmail?: string
}

const availableUsers = [
  { id: 'user-1', name: 'John', email: 'john.doe@example.com' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@whatfix.com' },
  { id: 'user-3', name: 'Bob Johnson', email: 'bob.johnson@whatfix.com' },
  { id: 'user-4', name: 'Alice Williams', email: 'alice.williams@whatfix.com' },
  { id: 'user-5', name: 'Charlie Brown', email: 'charlie.brown@whatfix.com' },
]

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

const MOCK_ID = 'c6e446b8-a07d-4482-b01c-f6d8b0b3d3da'
const ITEM_HEIGHT = 58

function ScrollableList({ children, itemCount }: { children: React.ReactNode; itemCount: number }) {
  const maxVisible = 3
  const needsScroll = itemCount > maxVisible

  return (
    <div
      style={{
        maxHeight: needsScroll ? `${maxVisible * ITEM_HEIGHT}px` : 'auto',
        overflowY: needsScroll ? 'auto' : 'visible',
        paddingRight: needsScroll ? '4px' : '0',
      }}
    >
      {children}
    </div>
  )
}

export function TransferContentModal({
  isOpen,
  onClose,
  selectedItems,
  entId,
  onTransfer,
}: TransferContentModalProps) {
  const [targetUserId, setTargetUserId] = useState('')
  const [error, setError] = useState('')

  const contents = selectedItems.filter(item => item.type !== 'folder')
  const containers = selectedItems.filter(item => item.type === 'folder')

  const handleTransfer = () => {
    if (!targetUserId) {
      setError('Please select a target user')
      return
    }
    setError('')
    onTransfer(targetUserId)
  }

  const handleClose = () => {
    setTargetUserId('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      <div
        className="relative w-full bg-white rounded-2xl"
        style={{
          maxWidth: '560px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '28px 32px 0 32px', flexShrink: 0 }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
                border: '2.5px solid #93C5FD',
              }}
            >
              <IconInfoCircle size={22} stroke={1.8} color="#2563EB" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', flex: 1, letterSpacing: '-0.01em' }}>
              Transfer Content
            </h2>
            <button
              onClick={handleClose}
              className="flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              style={{ width: '32px', height: '32px' }}
            >
              <IconX size={18} stroke={2} color="#9CA3AF" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 32px 28px 32px', flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {/* Description */}
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#4B5563', marginBottom: '12px' }}>
            Transfer the following contents & containers to another user?
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#4B5563', marginBottom: '28px' }}>
            Select the target user/teammate below and review the selected contents and containers you want to transfer.
          </p>

          {/* Enterprise ID */}
          <p style={{ fontSize: '15px', color: '#111827', marginBottom: '28px' }}>
            <span style={{ fontWeight: 700 }}>Enterprise ID:</span>{' '}
            <span style={{ color: '#374151' }}>{entId}</span>
          </p>

          {/* Selected Contents */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Selected Contents:
            </p>
            {contents.length > 0 ? (
              <ScrollableList itemCount={contents.length}>
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', margin: 0 }}>
                  {contents.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '12px',
                        paddingLeft: '4px',
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Content Name:</span>{' '}
                      {item.name} | <span style={{ fontWeight: 700 }}>Type:</span>{' '}
                      {getTypeLabel(item.type)}
                      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '4px', marginBottom: 0 }}>
                        <li style={{ fontSize: '13px', color: '#6B7280' }}>
                          ID: {MOCK_ID}
                        </li>
                      </ul>
                    </li>
                  ))}
                </ol>
              </ScrollableList>
            ) : (
              <p style={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>No contents selected</p>
            )}
          </div>

          {/* Selected Containers */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Selected Containers:
            </p>
            {containers.length > 0 ? (
              <ScrollableList itemCount={containers.length}>
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', margin: 0 }}>
                  {containers.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '12px',
                        paddingLeft: '4px',
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Container Name:</span>{' '}
                      {item.name}
                      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '4px', marginBottom: 0 }}>
                        <li style={{ fontSize: '13px', color: '#6B7280' }}>
                          ID: {MOCK_ID}
                        </li>
                      </ul>
                    </li>
                  ))}
                </ol>
              </ScrollableList>
            ) : (
              <p style={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>No containers selected</p>
            )}
          </div>

          {/* Target User */}
          <div>
            <p style={{ fontSize: '15px', color: '#111827', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700 }}>Target User:</span>{' '}
              <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
            </p>
            <div style={{ position: 'relative' }}>
              <select
                value={targetUserId}
                onChange={(e) => { setTargetUserId(e.target.value); setError('') }}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 44px 0 16px',
                  fontSize: '15px',
                  color: targetUserId ? '#111827' : '#9CA3AF',
                  backgroundColor: '#FFFFFF',
                  border: error ? '1.5px solid #DC2626' : '1.5px solid #D1D5DB',
                  borderRadius: '10px',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={(e) => {
                  if (!error) e.target.style.borderColor = '#2563EB'
                  e.target.style.boxShadow = error
                    ? '0 0 0 3px rgba(220,38,38,0.1)'
                    : '0 0 0 3px rgba(37,99,235,0.1)'
                }}
                onBlur={(e) => {
                  if (!error) e.target.style.borderColor = '#D1D5DB'
                  e.target.style.boxShadow = 'none'
                }}
              >
                <option value="">Teammate name</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={18}
                stroke={2}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                  pointerEvents: 'none',
                }}
              />
            </div>
            {error && (
              <p style={{ fontSize: '13px', color: '#DC2626', marginTop: '6px' }}>{error}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '20px 32px',
            borderTop: '1px solid #E5E7EB',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleClose}
            style={{
              padding: '0 24px',
              height: '42px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #D1D5DB',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!targetUserId}
            style={{
              padding: '0 28px',
              height: '42px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: !targetUserId ? '#93C5FD' : '#2563EB',
              border: 'none',
              cursor: !targetUserId ? 'not-allowed' : 'pointer',
              opacity: !targetUserId ? 0.7 : 1,
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (targetUserId) e.currentTarget.style.backgroundColor = '#1D4ED8'
            }}
            onMouseLeave={(e) => {
              if (targetUserId) e.currentTarget.style.backgroundColor = '#2563EB'
            }}
          >
            Transfer
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
