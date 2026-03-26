'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings,
  Menu,
  X,
  TrendingUp,
  CreditCard,
  FileText,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: BarChart3,
    badge: null,
    description: 'Overview and analytics'
  },
  { 
    name: 'Orders', 
    href: '/orders', 
    icon: ShoppingCart,
    badge: '12',
    description: 'Manage orders'
  },
  { 
    name: 'Customers', 
    href: '/customers', 
    icon: Users,
    badge: null,
    description: 'Customer database'
  },
  { 
    name: 'Products', 
    href: '/products', 
    icon: Package,
    badge: null,
    description: 'Product catalog'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: TrendingUp,
    badge: 'New',
    description: 'Deep insights'
  },
  { 
    name: 'Transactions', 
    href: '/transactions', 
    icon: CreditCard,
    badge: null,
    description: 'Payment history'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: FileText,
    badge: null,
    description: 'Business reports'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    badge: null,
    description: 'App settings'
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white dark:bg-gray-800 shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">EcomDash</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Analytics Suite</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Main Menu
              </h3>
              {navigation.slice(0, 5).map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    )} />
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant={item.badge === 'New' ? 'default' : 'secondary'} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Business
              </h3>
              {navigation.slice(5).map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    )} />
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant={item.badge === 'New' ? 'default' : 'secondary'} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Need Help?</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Check our documentation or contact support
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Get Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
