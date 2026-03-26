'use client'

import { Layout } from '@/components/layout'
import { KPICardPremium } from '@/components/kpi-card-premium'
import { InsightsCard } from '@/components/insights-card'
import { RevenueChartPremium } from '@/components/revenue-chart-premium'
import { OrdersChartPremium } from '@/components/orders-chart-premium'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Package,
  Target
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getDashboardStats, getRevenueData, getOrdersData, getTopProducts, getInsights } from '@/lib/data'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  conversionRate: number
  averageOrderValue: number
  totalCustomers: number
  totalProducts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    totalProducts: 0
  })
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [ordersData, setOrdersData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardStats, revenue, orders, products, aiInsights] = await Promise.all([
          getDashboardStats(),
          getRevenueData(),
          getOrdersData(),
          getTopProducts(),
          getInsights()
        ])

        setStats(dashboardStats)
        setRevenueData(revenue)
        setOrdersData(orders)
        setTopProducts(products)
        setInsights(aiInsights)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rs. ${(value / 1000000).toFixed(2)}L`
    } else if (value >= 1000) {
      return `Rs. ${(value / 1000).toFixed(1)}K`
    }
    return `Rs. ${value.toLocaleString()}`
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* AI Insights */}
        <InsightsCard insights={insights} />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICardPremium
            title="Total Revenue"
            value={stats.totalRevenue}
            change={18}
            icon={<DollarSign className="h-5 w-5" />}
            trend="up"
            description="Last 30 days"
          />
          <KPICardPremium
            title="Total Orders"
            value={stats.totalOrders}
            change={12}
            icon={<ShoppingCart className="h-5 w-5" />}
            trend="up"
            description="Last 30 days"
          />
          <KPICardPremium
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            change={-2}
            icon={<Target className="h-5 w-5" />}
            trend="down"
            description="Last 30 days"
          />
          <KPICardPremium
            title="Average Order Value"
            value={stats.averageOrderValue}
            change={5}
            icon={<TrendingUp className="h-5 w-5" />}
            trend="up"
            description="Last 30 days"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChartPremium data={revenueData} />
          <OrdersChartPremium data={ordersData} />
        </div>

        {/* Top Products */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[256px] w-full" style={{ minHeight: '256px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="horizontal" margin={{ top: 10, right: 10, left: 80, bottom: 10 }}>
                  <defs>
                    <linearGradient id="productsGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={75}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      name === 'sales' ? `${value} units` : formatCurrency(value),
                      name === 'sales' ? 'Units Sold' : 'Revenue'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="sales" fill="url(#productsGradient)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">+24%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
