'use client'

import { Settings, User, Bell, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/20">
          <Settings className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">App settings and preferences</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-gray-600" />
          </div>
          <CardTitle className="text-xl">Coming Soon</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            We are currently onboarding early users and improving features based on feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Settings</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Account preferences</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Alert preferences</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Security</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Privacy & safety</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
