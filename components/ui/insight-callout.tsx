import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
import { AlertCircle, CheckCircle, InfoIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface InsightCalloutProps {
  type: 'success' | 'warning' | 'info' | 'lift' | 'cost'
  title: string
  description: string
  footnote?: string
  className?: string
}

const INSIGHT_CONFIG = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-600',
    cardClass: 'border-green-200 bg-green-50',
    badgeVariant: 'default' as const
  },
  warning: {
    icon: AlertCircle,
    iconClass: 'text-amber-600',
    cardClass: 'border-amber-200 bg-amber-50',
    badgeVariant: 'secondary' as const
  },
  info: {
    icon: InfoIcon,
    iconClass: 'text-blue-600',
    cardClass: 'border-blue-200 bg-blue-50',
    badgeVariant: 'outline' as const
  },
  lift: {
    icon: TrendingUp,
    iconClass: 'text-green-600',
    cardClass: 'border-green-200 bg-green-50',
    badgeVariant: 'default' as const
  },
  cost: {
    icon: TrendingDown,
    iconClass: 'text-red-600',
    cardClass: 'border-red-200 bg-red-50',
    badgeVariant: 'destructive' as const
  }
}

export function InsightCallout({ type, title, description, footnote, className }: InsightCalloutProps) {
  const config = INSIGHT_CONFIG[type]
  const Icon = config.icon

  return (
    <Card className={cn('p-4', config.cardClass, className)}>
      <div className="flex items-start space-x-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconClass)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{title}</h4>
            <Badge variant={config.badgeVariant} className="text-xs">
              {type === 'lift' ? '↑ Lift' : type === 'cost' ? '↓ Cost' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-tight">{description}</p>
          {footnote && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              Why this matters: {footnote}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
