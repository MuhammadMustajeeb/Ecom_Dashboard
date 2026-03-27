'use client'

import { FileText, Download, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <FileText className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Business reports and data exports</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-xl">Coming Soon</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            We are currently onboarding early users and improving features based on feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sales Reports</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Revenue analytics</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Download className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Data Exports</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">CSV & PDF exports</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Custom Reports</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tailored insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
