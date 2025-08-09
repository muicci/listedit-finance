'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Lightbulb, Target, TrendingUp } from 'lucide-react'
import { useListedit } from '@/contexts/ListeditContext'
import { Recommendation, generateRecommendations, QUICK_WIN_TWEAKS } from '@/lib/recommendations'
import { calculateMetrics } from '@/lib/calculations'
import { cn } from '@/lib/utils'

interface RecommendationsPanelProps {
  className?: string
}

export function RecommendationsPanel({ className }: RecommendationsPanelProps) {
  const { state, updateState } = useListedit()
  const [collapsed, setCollapsed] = useState(false)
  const [changeLog, setChangeLog] = useState<Array<{ id: string; label: string; timestamp: Date }>>([])

  const metrics = calculateMetrics(state)
  const recommendations = generateRecommendations(state, metrics)

  const handleApplyTweak = (recommendation: Recommendation) => {
    if (recommendation.action) {
      updateState(recommendation.action.changes)
      setChangeLog(prev => [
        {
          id: recommendation.id,
          label: recommendation.action!.label,
          timestamp: new Date()
        },
        ...prev.slice(0, 4) // Keep only last 5 entries
      ])
    }
  }

  const handleQuickWin = (tweakKey: string) => {
    const tweak = QUICK_WIN_TWEAKS[tweakKey as keyof typeof QUICK_WIN_TWEAKS]
    if (tweak) {
      const changes = typeof tweak.changes === 'function' ? tweak.changes(state) : tweak.changes
      updateState(changes)
      setChangeLog(prev => [
        {
          id: tweakKey,
          label: tweak.label,
          timestamp: new Date()
        },
        ...prev.slice(0, 4)
      ])
    }
  }

  if (collapsed) {
    return (
      <Card className={cn('border-l-4 border-l-amber-500', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(false)}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={cn('border-l-4 border-l-amber-500', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </CardTitle>
            <CardDescription className="text-xs">
              AI-powered insights and quick optimizations
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
            className="h-8 w-8 p-0"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="scenario" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="scenario" className="text-xs">This Scenario</TabsTrigger>
            <TabsTrigger value="benchmarks" className="text-xs">Benchmarks</TabsTrigger>
            <TabsTrigger value="tweaks" className="text-xs">What to try</TabsTrigger>
          </TabsList>

          <TabsContent value="scenario" className="space-y-3">
            {recommendations.slice(0, 5).map((rec) => (
              <div key={rec.id} className="p-3 rounded-lg border bg-card text-card-foreground">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm leading-tight">{rec.title}</h4>
                      <Badge
                        variant={rec.type === 'warning' ? 'destructive' : rec.type === 'insight' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight mb-2">
                      {rec.description}
                    </p>
                    {rec.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplyTweak(rec)}
                        className="h-6 px-2 text-xs"
                      >
                        {rec.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recommendations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                All metrics look good! No specific recommendations at this time.
              </p>
            )}
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-3">
            <div className="p-3 rounded-lg border bg-card">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Industry Benchmarks
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Top performer ratio:</span>
                  <span className="font-mono">5-15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Manual time savings:</span>
                  <span className="font-mono">80-90%</span>
                </div>
                <div className="flex justify-between">
                  <span>Software replacement:</span>
                  <span className="font-mono">60-80%</span>
                </div>
                <div className="flex justify-between">
                  <span>ARR multiple:</span>
                  <span className="font-mono">10-23×</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tweaks" className="space-y-3">
            <div className="grid gap-2">
              {Object.entries(QUICK_WIN_TWEAKS).map(([key, tweak]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickWin(key)}
                  className="justify-start h-8 text-xs"
                >
                  <TrendingUp className="h-3 w-3 mr-2" />
                  {tweak.label}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {changeLog.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-xs mb-2 text-muted-foreground">Recent Changes</h4>
            <div className="space-y-1">
              {changeLog.map((change, index) => (
                <div key={`${change.id}-${index}`} className="text-xs text-muted-foreground flex justify-between">
                  <span className="truncate">{change.label}</span>
                  <span className="text-xs">{change.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
