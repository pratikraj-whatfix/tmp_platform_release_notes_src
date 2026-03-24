import { useState } from 'react'
import { IconUpload } from '@tabler/icons-react'
import { Button, Card, Input, Badge } from '../components/ui'
import { ContentPanel, Header } from '../components/layout'

interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="py-6 border-b border-secondary-200 last:border-0">
      <div className="flex flex-col lg:flex-row lg:gap-16">
        <div className="lg:w-1/3 mb-4 lg:mb-0">
          <h3 className="text-subheading-05 text-secondary-1000">{title}</h3>
          {description && (
            <p className="text-bodytext-03 text-secondary-500 mt-1">{description}</p>
          )}
        </div>
        <div className="lg:w-2/3">{children}</div>
      </div>
    </div>
  )
}

/**
 * SettingsView
 * 
 * Settings page demonstrating form components and layouts.
 */
export function SettingsView() {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    company: 'Acme Corp',
    timezone: 'UTC-5 (Eastern Time)',
  })

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    productUpdates: true,
    weeklyReport: false,
  })

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Settings"
        subtitle="Manage your account preferences and configurations"
      />

      {/* Profile Settings */}
      <ContentPanel>
        <SettingsSection
          title="Profile information"
          description="Update your personal details and contact information."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center">
                <span className="text-heading-04 text-secondary-600">JD</span>
              </div>
              <Button variant="secondary" intent="muted" size="sm" iconLeft={<IconUpload size={16} stroke={1.5} />}>
                Upload photo
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First name"
                value={profileData.firstName}
                onChange={(value) => setProfileData({ ...profileData, firstName: value })}
              />
              <Input
                label="Last name"
                value={profileData.lastName}
                onChange={(value) => setProfileData({ ...profileData, lastName: value })}
              />
            </div>
            <Input
              label="Email address"
              type="email"
              value={profileData.email}
              onChange={(value) => setProfileData({ ...profileData, email: value })}
              helperText="This email will be used for all communications"
            />
            <Input
              label="Company"
              value={profileData.company}
              onChange={(value) => setProfileData({ ...profileData, company: value })}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Email notifications"
          description="Choose what updates you want to receive."
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-md cursor-pointer hover:bg-secondary-100 transition-default">
              <div>
                <p className="text-label-medium text-secondary-1000">Daily email digest</p>
                <p className="text-bodytext-04 text-secondary-500">
                  Receive a summary of your content performance each day
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailDigest}
                onChange={(e) =>
                  setNotifications({ ...notifications, emailDigest: e.target.checked })
                }
                className="w-5 h-5 rounded border-secondary-300 text-primary-400 focus:ring-info-400"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-md cursor-pointer hover:bg-secondary-100 transition-default">
              <div>
                <p className="text-label-medium text-secondary-1000">Product updates</p>
                <p className="text-bodytext-04 text-secondary-500">
                  Get notified about new features and improvements
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.productUpdates}
                onChange={(e) =>
                  setNotifications({ ...notifications, productUpdates: e.target.checked })
                }
                className="w-5 h-5 rounded border-secondary-300 text-primary-400 focus:ring-info-400"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-secondary-50 rounded-md cursor-pointer hover:bg-secondary-100 transition-default">
              <div>
                <p className="text-label-medium text-secondary-1000">Weekly analytics report</p>
                <p className="text-bodytext-04 text-secondary-500">
                  Comprehensive weekly report delivered every Monday
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyReport}
                onChange={(e) =>
                  setNotifications({ ...notifications, weeklyReport: e.target.checked })
                }
                className="w-5 h-5 rounded border-secondary-300 text-primary-400 focus:ring-info-400"
              />
            </label>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Subscription"
          description="Manage your plan and billing information."
        >
          <Card className="border-info-200 bg-info-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-subheading-05 text-secondary-1000">Enterprise plan</p>
                  <Badge variant="info">Active</Badge>
                </div>
                <p className="text-bodytext-03 text-secondary-600 mt-1">
                  Unlimited users • All features • Priority support
                </p>
              </div>
              <Button variant="secondary" intent="info" size="sm">
                Manage billing
              </Button>
            </div>
          </Card>
        </SettingsSection>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <Button variant="tertiary" intent="muted">
            Cancel
          </Button>
          <Button>Save changes</Button>
        </div>
      </ContentPanel>

      {/* Danger Zone */}
      <ContentPanel>
        <SettingsSection
          title="Danger zone"
          description="Irreversible actions. Please proceed with caution."
        >
          <Card className="border-critical-200 bg-critical-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-subheading-06 text-critical-600">Delete account</p>
                <p className="text-bodytext-04 text-secondary-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="secondary" intent="critical" size="sm">
                Delete account
              </Button>
            </div>
          </Card>
        </SettingsSection>
      </ContentPanel>
    </div>
  )
}
