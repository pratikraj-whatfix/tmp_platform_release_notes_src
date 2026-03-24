import { useState } from 'react'
import {
  IconPlus,
  IconDownload,
  IconTrendingUp,
  IconUsers,
  IconEye,
  IconClock,
} from '@tabler/icons-react'
import { Button, Card, Modal, Input } from '../components/ui'
import { ContentPanel, Header } from '../components/layout'
import { LineChart, BarChart, PieChart } from '../components/charts'
import { formatNumber, formatPercentage } from '../lib/utils'

// Sample data for charts
const lineChartData = {
  xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    { name: 'Users', data: [1200, 1900, 1500, 2800, 2200, 3200] },
    { name: 'Sessions', data: [800, 1200, 1000, 2000, 1800, 2500] },
  ],
}

const barChartData = {
  xAxis: ['Onboarding', 'Feature tours', 'Task lists', 'Smart tips', 'Surveys'],
  series: [
    { name: 'Views', data: [4500, 3200, 2800, 2100, 1800] },
    { name: 'Completions', data: [3800, 2600, 2200, 1700, 1500] },
  ],
}

const pieChartData = {
  data: [
    { name: 'Desktop', value: 5234 },
    { name: 'Mobile', value: 2341 },
    { name: 'Tablet', value: 892 },
  ],
}

// Stat card component
interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change && change > 0

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-bodytext-03 text-secondary-500">{title}</p>
          <p className="text-heading-04 text-secondary-1000 mt-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {change !== undefined && (
            <p
              className={`text-bodytext-04 mt-2 ${
                isPositive ? 'text-success-500' : 'text-critical-500'
              }`}
            >
              {isPositive ? '↑' : '↓'} {formatPercentage(Math.abs(change))} vs last period
            </p>
          )}
        </div>
        <div className="p-2 bg-secondary-50 rounded-md text-secondary-500">
          {icon}
        </div>
      </div>
    </Card>
  )
}

// Recent activity item
interface ActivityItemProps {
  title: string
  description: string
  time: string
  status: 'success' | 'warning' | 'info'
}

function ActivityItem({ title, description, time, status }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-secondary-100 last:border-0">
      <div
        className={`w-2 h-2 rounded-full mt-2 ${
          status === 'success'
            ? 'bg-success-400'
            : status === 'warning'
            ? 'bg-warning-400'
            : 'bg-info-400'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-label-medium text-secondary-1000">{title}</p>
        <p className="text-bodytext-04 text-secondary-500 truncate">{description}</p>
      </div>
      <span className="text-bodytext-04 text-secondary-400 flex-shrink-0">{time}</span>
    </div>
  )
}

/**
 * DashboardView
 * 
 * Main dashboard page showcasing all components and charts.
 */
export function DashboardView() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [flowName, setFlowName] = useState('')

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your content."
        actions={
          <Button
            iconLeft={<IconPlus size={20} stroke={1.5} />}
            onClick={() => setIsModalOpen(true)}
          >
            Create flow
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total users"
          value={12847}
          change={12.5}
          icon={<IconUsers size={24} stroke={1.5} />}
        />
        <StatCard
          title="Content views"
          value={45230}
          change={8.2}
          icon={<IconEye size={24} stroke={1.5} />}
        />
        <StatCard
          title="Avg. completion rate"
          value="78.4%"
          change={-2.1}
          icon={<IconTrendingUp size={24} stroke={1.5} />}
        />
        <StatCard
          title="Avg. time to complete"
          value="2m 34s"
          change={5.3}
          icon={<IconClock size={24} stroke={1.5} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentPanel title="User engagement trends">
          <LineChart data={lineChartData} height={320} showArea />
        </ContentPanel>

        <ContentPanel title="Content performance">
          <BarChart data={barChartData} height={320} />
        </ContentPanel>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ContentPanel
          title="Device breakdown"
          className="lg:col-span-1"
        >
          <PieChart data={pieChartData} height={280} donut />
        </ContentPanel>

        <ContentPanel
          title="Recent activity"
          actions={
            <Button variant="tertiary" intent="info" size="sm">
              View all
            </Button>
          }
          className="lg:col-span-2"
        >
          <div>
            <ActivityItem
              title="New onboarding flow published"
              description="Product tour for new users was activated by John D."
              time="2 hours ago"
              status="success"
            />
            <ActivityItem
              title="Flow completion rate dropped"
              description="Feature discovery flow dropped below 70% threshold"
              time="5 hours ago"
              status="warning"
            />
            <ActivityItem
              title="New smart tip created"
              description="Dashboard navigation tip added by Sarah M."
              time="Yesterday"
              status="info"
            />
            <ActivityItem
              title="Survey responses collected"
              description="NPS survey received 142 new responses"
              time="Yesterday"
              status="success"
            />
          </div>
        </ContentPanel>
      </div>

      {/* Export Section */}
      <ContentPanel>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-subheading-05 text-secondary-1000">Export data</h3>
            <p className="text-bodytext-03 text-secondary-500 mt-1">
              Download your analytics data for external analysis
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" intent="muted" iconLeft={<IconDownload size={20} stroke={1.5} />}>
              Export CSV
            </Button>
            <Button variant="tertiary" intent="info">
              View reports
            </Button>
          </div>
        </div>
      </ContentPanel>

      {/* Create Flow Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create new flow"
        size="sm"
        footer={
          <>
            <Button
              variant="tertiary"
              intent="muted"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Flow name"
            placeholder="e.g., New user onboarding"
            value={flowName}
            onChange={setFlowName}
            required
          />
          <p className="text-bodytext-04 text-secondary-500">
            You can customize the flow settings after creation.
          </p>
        </div>
      </Modal>
    </div>
  )
}
