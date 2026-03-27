'use client'

import { CreditCard, Receipt, ArrowUpDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
          <CreditCard className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payment history and transaction management</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">Coming Soon</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            We are currently onboarding early users and improving features based on feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Receipt className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Payment History</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Transaction records</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <ArrowUpDown className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Refunds & Returns</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Return management</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Payment Methods</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Payment processing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
