'use client'

import { Layout } from '@/components/layout'
import { TablePremium } from '@/components/table-premium'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getOrders } from '@/lib/data'
import { useEffect, useState } from 'react'
import { Calendar, Download, TrendingUp, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Order {
  id: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  date: string
  customerName: string
  customerEmail: string
  city?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all')

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders()
        setOrders(data as Order[])
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(1)}L`
    }
    return `Rs. ${(value / 1000).toFixed(0)}K`
  }

  const columns = [
    {
      key: 'id',
      title: 'Order ID',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
          {value}
        </span>
      )
    },
    {
      key: 'customerName',
      title: 'Customer',
      sortable: true,
      render: (value: string, row: Order) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.customerEmail}
          </div>
          {row.city && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              📍 {row.city}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => {
        const statusConfig = {
          paid: { variant: 'default' as const, color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100', icon: '✓' },
          pending: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100', icon: '⏳' },
          failed: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100', icon: '✗' },
        }

        const config = statusConfig[value.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending

        return (
          <Badge className={cn("capitalize", config.color)}>
            <span className="mr-1">{config.icon}</span>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'date',
      title: 'Date',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {new Date(value).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      )
    }
  ]

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.status === 'paid').length,
    pending: orders.filter(o => o.status === 'pending').length,
    failed: orders.filter(o => o.status === 'failed').length,
    totalRevenue: orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0)
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all your orders in one place.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Orders</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.paid}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {(['all', 'paid', 'pending', 'failed'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status === 'all' ? 'All Orders' : status}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                  {status === 'all' ? stats.total : 
                   status === 'paid' ? stats.paid :
                   status === 'pending' ? stats.pending : stats.failed}
                </span>
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Orders Table */}
        <TablePremium
          data={filteredOrders}
          columns={columns}
          title="Recent Orders"
          searchPlaceholder="Search by order ID, customer name, or email..."
        />
      </div>
    </Layout>
  )
}
