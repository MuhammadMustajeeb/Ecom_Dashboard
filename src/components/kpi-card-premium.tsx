'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardPremiumProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  description?: string
  className?: string
}

export function KPICardPremium({
  title,
  value,
  change,
  changeLabel = 'vs last week',
  icon,
  trend = 'neutral',
  description,
  className
}: KPICardPremiumProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `Rs. ${(val / 1000000).toFixed(2)}L`
      } else if (val >= 1000) {
        return `Rs. ${(val / 1000).toFixed(1)}K`
      }
      return `Rs. ${val.toLocaleString()}`
    }
    return val
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-200 hover:opacity-100" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              {icon}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(value)}
          </div>
          
          {change !== undefined && (
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium",
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{changeLabel}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
