'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Insight {
  type: 'positive' | 'neutral' | 'warning'
  title: string
  description: string
  icon: string
}

interface InsightsCardProps {
  insights: Insight[]
  className?: string
}

export function InsightsCard({ insights, className }: InsightsCardProps) {
  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
      case 'warning':
        return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
    }
  }

  const getBadgeColor = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      case 'warning':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    }
  }

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">🧠</span>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
              getInsightColor(insight.type)
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{insight.icon}</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <Badge variant="secondary" className={cn("text-xs", getBadgeColor(insight.type))}>
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
