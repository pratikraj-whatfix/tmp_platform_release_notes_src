import { useState } from 'react'
import {
  IconLayoutDashboard,
  IconChartBar,
  IconFileText,
  IconSettings,
  IconApps,
  IconPalette,
  IconTags,
  IconUsers,
  IconBulb,
  IconTarget,
  IconCategory,
  IconRoute,
  IconHelpCircle,
  IconListDetails,
  IconClipboardList,
  IconPlugConnected,
  IconSettingsAutomation,
  IconFolderPlus,
} from '@tabler/icons-react'
import { PageLayout, Sidebar, SecondaryNav, ContentPageHeader } from './components/layout'
import { TeamAuditLogsView, ContentView, TeammatesView } from './views'
import { TransferContentModal, type ContentItem as TransferContentItem } from './components/TransferContentModal'
import { Modal, Button } from './components/ui'
import type { NavItem } from './types'

// Products for switcher - using brand images
const products = [
  {
    id: 'guidance',
    name: 'Whatfix Guidance',
    shortName: 'Guidance',
    description: 'Drive digital adoption',
    icon: '/brand/DAP.png',
    badge: 'Trial',
  },
  {
    id: 'analytics',
    name: 'Whatfix Analytics',
    shortName: 'Analytics',
    description: 'Measure product usage',
    icon: '/brand/PA.png',
    badge: 'Trial',
  },
  {
    id: 'mirror',
    name: 'Whatfix Mirror',
    shortName: 'Mirror',
    description: 'Create interactive application replicas',
    icon: '/brand/Mirror.png',
    badge: 'Trial',
  },
  {
    id: 'studio',
    name: 'Whatfix Studio',
    shortName: 'Studio',
    description: 'Content creation platform',
    icon: '/brand/Studio.png',
    badge: 'Trial',
  },
]

// Navigation configurations per product
const productNavConfigs: Record<string, NavItem[]> = {
  guidance: [
    { 
      id: 'content', 
      label: 'Content', 
      icon: <IconCategory size={22} stroke={2} />,
    },
    { 
      id: 'widgets', 
      label: 'Widgets', 
      icon: <IconApps size={22} stroke={2} />,
      secondaryNav: {
        title: 'Widgets',
        sections: [
          { id: 'all-widgets', label: 'All widgets' },
          { 
            id: 'guides', 
            label: 'Guides', 
            icon: <IconRoute size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'pop-ups', label: 'Pop-ups' },
              { id: 'smart-tips', label: 'Smart-tips' },
              { id: 'beacons', label: 'Beacons' },
              { id: 'launchers', label: 'Launchers' },
            ]
          },
          { id: 'self-help', label: 'Self help', icon: <IconHelpCircle size={18} stroke={1.5} /> },
          { id: 'task-lists', label: 'Task lists', icon: <IconListDetails size={18} stroke={1.5} /> },
          { id: 'surveys', label: 'Surveys', icon: <IconClipboardList size={18} stroke={1.5} /> },
        ]
      }
    },
    { 
      id: 'guidance-analytics', 
      label: 'Guidance analytics', 
      icon: <IconChartBar size={22} stroke={2} />,
      secondaryNav: {
        title: 'Guidance analytics',
        sections: [
          { id: 'summary', label: 'Summary' },
          { 
            id: 'guides', 
            label: 'Guides', 
            icon: <IconRoute size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'flows', label: 'Flows' },
              { id: 'pop-ups', label: 'Pop-ups' },
              { id: 'smart-tips', label: 'Smart-tips' },
              { id: 'beacons', label: 'Beacons' },
            ]
          },
          { id: 'self-help', label: 'Self help', icon: <IconHelpCircle size={18} stroke={1.5} /> },
          { id: 'task-lists', label: 'Task lists', icon: <IconListDetails size={18} stroke={1.5} /> },
          { id: 'surveys', label: 'Surveys', icon: <IconClipboardList size={18} stroke={1.5} /> },
        ]
      }
    },
    { 
      id: 'style', 
      label: 'Style', 
      icon: <IconPalette size={22} stroke={2} />,
      secondaryNav: {
        title: 'Style',
        sections: [
          { id: 'font', label: 'Font' },
          { id: 'icon', label: 'Icon' },
          { 
            id: 'guides', 
            label: 'Guides', 
            icon: <IconRoute size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'flows', label: 'Flows' },
              { id: 'smart-tips', label: 'Smart-tips' },
              { id: 'beacons', label: 'Beacons' },
              { id: 'launchers', label: 'Launchers' },
            ]
          },
          { id: 'self-help', label: 'Self help', icon: <IconHelpCircle size={18} stroke={1.5} /> },
          { id: 'task-lists', label: 'Task lists', icon: <IconListDetails size={18} stroke={1.5} /> },
          { id: 'custom-labels', label: 'Custom labels' },
        ]
      }
    },
    { 
      id: 'tags', 
      label: 'Tags', 
      icon: <IconTags size={22} stroke={2} />,
      secondaryNav: {
        title: 'Tags',
        sections: [
          { id: 'all-tags', label: 'All tags' },
          { id: 'roles', label: 'Roles' },
          { id: 'pages', label: 'Pages' },
          { id: 'other', label: 'Other' },
        ]
      }
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <IconSettings size={22} stroke={2} />,
      secondaryNav: {
        title: 'Settings',
        sections: [
          { 
            id: 'content', 
            label: 'Content', 
            icon: <IconFileText size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'translations', label: 'Translations' },
              { id: 'video', label: 'Video' },
            ]
          },
          { 
            id: 'integrations', 
            label: 'Integrations', 
            icon: <IconPlugConnected size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'repositories', label: 'Repositories' },
              { id: 'video-channels', label: 'Video channels' },
              { id: 'app-integrations', label: 'App integrations' },
            ]
          },
          { 
            id: 'team', 
            label: 'Team', 
            icon: <IconUsers size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'teammates', label: 'Teammates' },
              { id: 'team-audit-logs', label: 'Team audit logs' },
            ]
          },
          { 
            id: 'setup', 
            label: 'Setup', 
            icon: <IconSettingsAutomation size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'api-token', label: 'API token' },
              { id: 'advanced-customisation', label: 'Advanced customisation' },
              { id: 'content-deployment', label: 'Content deployment' },
              { id: 'sso-authentication', label: 'SSO and authentication' },
            ]
          },
        ]
      }
    },
  ],
  analytics: [
    { id: 'dashboards', label: 'Dashboards', icon: <IconLayoutDashboard size={22} stroke={2} /> },
    { id: 'insights', label: 'Insights', icon: <IconBulb size={22} stroke={2} /> },
    { id: 'tracking', label: 'Tracking', icon: <IconTarget size={22} stroke={2} /> },
    { id: 'audience', label: 'Audience', icon: <IconUsers size={22} stroke={2} /> },
    { id: 'settings', label: 'Settings', icon: <IconSettings size={22} stroke={2} /> },
  ],
  mirror: [
    { 
      id: 'workflows', 
      label: 'Workflows', 
      icon: <IconCategory size={22} stroke={2} />,
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <IconChartBar size={22} stroke={2} />,
      secondaryNav: {
        title: 'Analytics',
        sections: [
          { id: 'workflows', label: 'Workflows', icon: <IconFileText size={18} stroke={1.5} /> },
          { id: 'assessments', label: 'Assessments', icon: <IconFileText size={18} stroke={1.5} /> },
        ]
      }
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <IconSettings size={22} stroke={2} />,
      secondaryNav: {
        title: 'Settings',
        sections: [
          { 
            id: 'team', 
            label: 'Team', 
            icon: <IconUsers size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'teammates', label: 'Teammates' },
              { id: 'team-audit-logs', label: 'Team audit logs' },
            ]
          },
          { 
            id: 'setup', 
            label: 'Setup', 
            icon: <IconSettingsAutomation size={18} stroke={1.5} />,
            isExpandable: true,
            items: [
              { id: 'api-token', label: 'API token' },
            ]
          },
          { id: 'analytics', label: 'Analytics', icon: <IconChartBar size={18} stroke={1.5} /> },
        ]
      }
    },
  ],
  studio: [
    { id: 'projects', label: 'Projects', icon: <IconFileText size={22} stroke={2} /> },
    { id: 'templates', label: 'Templates', icon: <IconApps size={22} stroke={2} /> },
    { id: 'settings', label: 'Settings', icon: <IconSettings size={22} stroke={2} /> },
  ],
}

// Workspaces
const workspaces = [
  { id: 'Pratik_PS', name: 'Pratik_PS' },
  { id: 'shubhambhatt_demo', name: 'shubhambhatt_demo' },
]

/**
 * Main App Component
 */
function App() {
  const [currentProduct, setCurrentProduct] = useState('guidance')
  const [activeNavItem, setActiveNavItem] = useState('content')
  const [currentWorkspace, setCurrentWorkspace] = useState('Pratik_PS')
  const [activeSecondaryItem, setActiveSecondaryItem] = useState<string | null>(null)
  const [openSecondaryNavId, setOpenSecondaryNavId] = useState<string | null>(null)
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([])
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [activeTab, setActiveTab] = useState('draft')
  const [transferMode, setTransferMode] = useState(false)
  const [transferSource, setTransferSource] = useState<{ id: string; name: string; email: string } | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // ENT ID - this would typically come from workspace/context
  const entId = '7566f4af-2878-4b55-82f2-9e7362b17eb0'
  
  // Sample content items - in real app, this would come from API
  const sampleContentItems: TransferContentItem[] = [
    { id: 'folder-1', name: 'ga 0', type: 'folder' },
    { id: 'content-1', name: 'enter wala use case', type: 'flow' },
    { id: 'content-2', name: 'Flow Exp 1', type: 'flow' },
    { id: 'content-3', name: 'beacon', type: 'beacon' },
    { id: 'content-4', name: '67y8ghyu', type: 'flow' },
    { id: 'content-5', name: '64567464y', type: 'flow' },
    { id: 'content-6', name: 'wikipedia test', type: 'flow' },
    { id: 'content-7', name: 'vsblhoh', type: 'flow' },
    { id: 'content-8', name: 'ga', type: 'flow' },
    { id: 'content-9', name: 'hs', type: 'flow' },
    { id: 'content-10', name: 'test content 1', type: 'smart-tip' },
    { id: 'content-11', name: 'test content 2', type: 'launcher' },
    { id: 'content-12', name: 'test content 3', type: 'task-list' },
    { id: 'folder-2', name: 'test folder', type: 'folder' },
    { id: 'content-13', name: 'another flow', type: 'flow' },
  ]

  const currentProductData = products.find((p) => p.id === currentProduct)
  const navItems = productNavConfigs[currentProduct] || []
  
  // Find the nav item whose secondary nav is currently open
  const openNavItem = navItems.find(item => item.id === openSecondaryNavId)
  const secondaryNav = openNavItem?.secondaryNav

  const handleProductSelect = (productId: string) => {
    setCurrentProduct(productId)
    // Reset to first nav item when switching products
    const firstItem = productNavConfigs[productId]?.[0]
    if (firstItem) {
      setActiveNavItem(firstItem.id)
      setActiveSecondaryItem(null)
      setOpenSecondaryNavId(null)
    }
  }

  const handleNavItemClick = (item: NavItem) => {
    if (item.secondaryNav) {
      // If item has secondary nav, toggle it open/closed
      if (openSecondaryNavId === item.id) {
        setOpenSecondaryNavId(null)
      } else {
        setOpenSecondaryNavId(item.id)
      }
    } else {
      // If item doesn't have secondary nav, select it and close any open secondary nav
      setActiveNavItem(item.id)
      setActiveSecondaryItem(null)
      setOpenSecondaryNavId(null)
    }
  }

  const handleSecondaryItemClick = (_sectionId: string, itemId: string) => {
    // When selecting from secondary nav, set the parent nav item as active
    if (openSecondaryNavId) {
      setActiveNavItem(openSecondaryNavId)
    }
    setActiveSecondaryItem(itemId)
    setOpenSecondaryNavId(null) // Close the secondary nav after selection
  }

  const handleCloseSecondaryNav = () => {
    setOpenSecondaryNavId(null)
  }

  const handleTransferFromTeammates = (
    teammate: { id: string; name: string; email: string },
    stage: 'draft' | 'ready' | 'production'
  ) => {
    setTransferSource(teammate)
    setTransferMode(true)
    setActiveTab(stage)
    setActiveNavItem('content')
    setActiveSecondaryItem(null)
    setOpenSecondaryNavId(null)
  }

  return (
    <PageLayout
      sidebar={
        <Sidebar
          items={navItems}
          activeItemId={activeNavItem}
          onItemClick={handleNavItemClick}
          products={products}
          currentProductId={currentProduct}
          currentProductName={currentProductData?.shortName || 'Whatfix'}
          currentProductIcon={currentProductData?.icon}
          onProductSelect={handleProductSelect}
          workspaces={workspaces}
          currentWorkspaceId={currentWorkspace}
          onWorkspaceSelect={setCurrentWorkspace}
          userName="Pratik Raj"
          showExploreDemo={currentProduct === 'analytics'}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      }
    >
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Secondary Navigation Panel with backdrop */}
        {secondaryNav && (
          <>
            {/* Backdrop to close on click outside */}
            <div 
              className="secondary-nav-backdrop"
              onClick={handleCloseSecondaryNav}
            />
            <SecondaryNav
              title={secondaryNav.title}
              sections={secondaryNav.sections}
              onItemClick={handleSecondaryItemClick}
              activeItemId={activeSecondaryItem || undefined}
              sidebarWidth={sidebarCollapsed ? 68 : 260}
            />
          </>
        )}

        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#FCFCFD',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Show ContentPageHeader for Guidance Content */}
          {currentProduct === 'guidance' && activeNavItem === 'content' && (
            <ContentPageHeader
              title="Content"
              createButtonLabel="Create content"
              tabs={[
                { id: 'draft', label: 'Draft' },
                { id: 'ready', label: 'Ready' },
                { id: 'production', label: 'Production' },
              ]}
              defaultTabId={activeTab}
              onTabChange={(tabId) => { setActiveTab(tabId) }}
              showTransferContent={selectedContentIds.length > 0}
              onTransferContentClick={() => setShowTransferModal(true)}
              transferMode={transferMode}
              onExitTransferMode={() => { setTransferMode(false); setTransferSource(null) }}
            />
          )}

          {/* Show ContentPageHeader for Mirror Workflows */}
          {currentProduct === 'mirror' && activeNavItem === 'workflows' && (
            <ContentPageHeader
              title="Workflows"
              showCreateButton={false}
              tabs={[
                { id: 'draft', label: 'Draft' },
                { id: 'ready', label: 'Ready' },
                { id: 'production', label: 'Production' },
              ]}
              defaultTabId="draft"
              primaryAction={{
                label: 'Create simulation',
                icon: <IconFolderPlus size={20} stroke={2} />,
                onClick: () => console.log('Create simulation clicked'),
              }}
              searchPlaceholder="Search folder"
              showCreateFolder={false}
            />
          )}

          {/* Show Content View */}
          {currentProduct === 'guidance' && activeNavItem === 'content' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <ContentView
                onSelectionChange={setSelectedContentIds}
                onTransferClick={() => setShowTransferModal(true)}
                transferMode={transferMode}
                transferSource={transferSource}
                onExitTransferMode={() => { setTransferMode(false); setTransferSource(null) }}
              />
            </div>
          ) : activeNavItem === 'settings' && activeSecondaryItem === 'teammates' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto' }}>
              <TeammatesView onTransferContent={handleTransferFromTeammates} />
            </div>
          ) : activeNavItem === 'settings' && activeSecondaryItem === 'team-audit-logs' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
              <TeamAuditLogsView />
            </div>
          ) : (
            /* Empty state for other pages */
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: 0,
              overflow: 'auto',
            }}>
              <div style={{ width: '200px', height: '160px', marginBottom: '24px', opacity: 0.6 }}>
                <EmptyStateIllustration />
              </div>
              <p style={{ fontSize: '15px', color: '#7B7891' }}>
                Select an item from the sidebar to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Content Modal */}
      {currentProduct === 'guidance' && activeNavItem === 'content' && (
        <TransferContentModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          selectedItems={sampleContentItems.filter(item => selectedContentIds.includes(item.id))}
          entId={entId}
          currentUserEmail={transferSource?.email || 'pratik.raj@whatfix.com'}
          onTransfer={(targetUserId) => {
            console.log('Transferring content to user:', targetUserId)
            setShowTransferModal(false)
            setShowSuccessModal(true)
            setSelectedContentIds([])
            setTransferMode(false)
            setTransferSource(null)
          }}
        />
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={
          <div className="flex items-center gap-2.5">
            <div 
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: '28px', height: '28px', backgroundColor: '#D9FBEE' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#21AD73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[16px] font-semibold text-secondary-1000">Transfer Successful</span>
          </div>
        }
        size="sm"
        footer={
          <Button
            intent="prime"
            size="lg"
            onClick={() => setShowSuccessModal(false)}
          >
            Done
          </Button>
        }
      >
        <p className="text-[14px] leading-relaxed text-secondary-600">
          Content has been successfully transferred to the selected user. The transferred items will now appear in their content library.
        </p>
      </Modal>
    </PageLayout>
  )
}

function EmptyStateIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="160" height="110" rx="8" fill="#F6F6F9" stroke="#ECECF3" strokeWidth="2" />
      <rect x="35" y="35" width="60" height="8" rx="2" fill="#DFDDE7" />
      <rect x="35" y="50" width="130" height="5" rx="1.5" fill="#ECECF3" />
      <rect x="35" y="60" width="100" height="5" rx="1.5" fill="#ECECF3" />
      <rect x="35" y="75" width="55" height="40" rx="4" fill="#ECECF3" />
      <rect x="100" y="75" width="55" height="40" rx="4" fill="#ECECF3" />
      <circle cx="62" cy="90" r="8" fill="#DFDDE7" />
      <circle cx="127" cy="90" r="8" fill="#E45913" opacity="0.6" />
      <rect x="50" y="103" width="25" height="4" rx="1" fill="#DFDDE7" />
      <rect x="115" y="103" width="25" height="4" rx="1" fill="#DFDDE7" />
    </svg>
  )
}

export default App
