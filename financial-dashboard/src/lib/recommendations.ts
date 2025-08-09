import { ListeditState, CalculatedMetrics } from '@/types/listedit'

export interface Recommendation {
  id: string
  type: 'tweak' | 'insight' | 'warning'
  category: 'profit' | 'manual' | 'software' | 'human' | 'allocation' | 'valuation'
  title: string
  description: string
  action?: {
    label: string
    changes: Partial<ListeditState>
  }
  priority: 'high' | 'medium' | 'low'
}

export interface InsightData {
  type: 'success' | 'warning' | 'info' | 'lift' | 'cost'
  title: string
  description: string
  footnote?: string
}

export function generateRecommendations(state: ListeditState, metrics: CalculatedMetrics): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  // Calculate profit delta percentage
  const profitDelta = metrics.profitAfter - metrics.profitBefore
  const profitDeltaPct = metrics.profitBefore > 0 ? (profitDelta / metrics.profitBefore) * 100 : 0

  // Profit Analysis
  if (profitDeltaPct >= 20) {
    recommendations.push({
      id: 'profit-strong',
      type: 'insight',
      category: 'profit',
      title: 'Strong ROI Scenario',
      description: 'Strong uplift: lead with manual-time savings and low-segment lift.',
      priority: 'high'
    })
  } else if (profitDeltaPct >= 0 && profitDeltaPct < 20) {
    recommendations.push({
      id: 'profit-ok',
      type: 'tweak',
      category: 'profit',
      title: 'Good Results, Room for Improvement',
      description: 'Good result: consider +10pp to low-segment uplift or reduce remaining manual time.',
      action: {
        label: 'Increase Low Uplift by 10pp',
        changes: { lowSegmentUplift: Math.min(100, state.lowSegmentUplift + 10) }
      },
      priority: 'medium'
    })
  } else if (profitDeltaPct < 0) {
    recommendations.push({
      id: 'profit-negative',
      type: 'warning',
      category: 'profit',
      title: 'Negative Impact Warning',
      description: 'At current settings, profit dips. Raise replace%, lower seat price, or increase uplift.',
      action: {
        label: 'Increase Replace% to 60%',
        changes: { softwareReplacePercent: 60 }
      },
      priority: 'high'
    })
  }

  // Manual Time Analysis
  if (state.afterTimePercent > 20) {
    recommendations.push({
      id: 'manual-time-high',
      type: 'tweak',
      category: 'manual',
      title: 'High Manual Time Remaining',
      description: 'Manual time remains high; target 10–15% of baseline with a six-touch cadence.',
      action: {
        label: 'Reduce After Time to 12%',
        changes: { afterTimePercent: 12 }
      },
      priority: 'medium'
    })
  }

  // Software Cost Analysis
  if (metrics.softwareCostAfter > metrics.softwareCostBefore) {
    recommendations.push({
      id: 'software-overlap',
      type: 'warning',
      category: 'software',
      title: 'Software Cost Overlap',
      description: 'Software cost rises post-Listedit — increase replace% or phase legacy tools faster.',
      action: {
        label: 'Increase Replace% to 70%',
        changes: { softwareReplacePercent: 70 }
      },
      priority: 'medium'
    })
  }

  // Human Replacement Analysis
  if (state.humanReplacePercent < 50) {
    recommendations.push({
      id: 'human-replace-low',
      type: 'tweak',
      category: 'human',
      title: 'Conservative Human Replacement',
      description: 'Human replacement is modest; pilot call/sms workflows to safely raise to 60–80%.',
      action: {
        label: 'Increase Human Replace to 70%',
        changes: { humanReplacePercent: 70 }
      },
      priority: 'low'
    })
  }

  // Allocation Analysis
  if (state.allocationTeam < 35) {
    recommendations.push({
      id: 'alloc-team-low',
      type: 'warning',
      category: 'allocation',
      title: 'Team Allocation Too Low',
      description: 'Team allocation may be thin for delivery; consider ≥35%.',
      action: {
        label: 'Shift 5% to Team',
        changes: { allocationTeam: Math.min(100, state.allocationTeam + 5) }
      },
      priority: 'medium'
    })
  }

  if (state.allocationRnD < 15) {
    recommendations.push({
      id: 'alloc-rd-low',
      type: 'warning',
      category: 'allocation',
      title: 'R&D Under-resourced',
      description: 'R&D under 15% risks roadmap velocity; consider ≥15%.',
      priority: 'medium'
    })
  }

  if (state.allocationSales < 10) {
    recommendations.push({
      id: 'alloc-sm-low',
      type: 'warning',
      category: 'allocation',
      title: 'Sales & Marketing Mismatch',
      description: 'Sales & Marketing under 10% may limit SOM targets; adjust accordingly.',
      priority: 'medium'
    })
  }

  // Valuation Analysis
  if (state.arrMultiple < 10) {
    recommendations.push({
      id: 'valuation-low-multiple',
      type: 'warning',
      category: 'valuation',
      title: 'Below Growth Corridor',
      description: 'Multiple below high-growth corridor; sanity check with 10–23× comps.',
      action: {
        label: 'Set Multiple to 12×',
        changes: { arrMultiple: 12 }
      },
      priority: 'low'
    })
  }

  // Sort by priority
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  return recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
}

export function generateInsights(state: ListeditState, metrics: CalculatedMetrics): InsightData[] {
  const insights: InsightData[] = []
  
  // Calculate key metrics for insights
  const profitDelta = metrics.profitAfter - metrics.profitBefore
  const profitDeltaPct = metrics.profitBefore > 0 ? (profitDelta / metrics.profitBefore) * 100 : 0
  const manualTimeSavings = metrics.repetitiveCostBefore - metrics.repetitiveCostAfter
  const topPerformersRevShare = (metrics.revenueTopBefore / metrics.revenueTotalBefore) * 100

  // Strong profit insight
  if (profitDeltaPct >= 20) {
    insights.push({
      type: 'success',
      title: 'Strong ROI Scenario',
      description: `Profit increases by ${profitDeltaPct.toFixed(1)}% with Listedit implementation.`,
      footnote: 'High-impact scenario validates investment in automation.'
    })
  }

  // Manual time savings insight
  if (manualTimeSavings > 0) {
    const savingsPerAgent = manualTimeSavings / state.numberOfAgents
    insights.push({
      type: 'lift',
      title: 'Manual Time Recovery',
      description: `Manual time falls from ${state.hoursPerWeekPerAgent}h/wk to ${(state.hoursPerWeekPerAgent * state.afterTimePercent / 100).toFixed(1)}h/wk per agent; that's $${savingsPerAgent.toLocaleString()}/agent/yr back into selling time.`,
      footnote: 'Freed-up time can be redirected to high-value client interactions.'
    })
  }

  // Top performers insight
  if (topPerformersRevShare > 60) {
    insights.push({
      type: 'info',
      title: 'Revenue Concentration',
      description: `Top ${state.topPerformerRatio}% of agents create ${topPerformersRevShare.toFixed(1)}% of revenue; raising low segment output by ${state.lowSegmentUplift}% has the bigger ROI.`,
      footnote: 'Focus on lifting the long tail for maximum impact.'
    })
  }

  // Software replacement insight
  const softwareDelta = metrics.softwareCostAfter - metrics.softwareCostBefore
  if (Math.abs(softwareDelta) > 1000) {
    insights.push({
      type: softwareDelta > 0 ? 'warning' : 'cost',
      title: 'Software Cost Impact',
      description: `You're replacing ${state.softwareReplacePercent}% of legacy software while adding $${state.listeditPricePerAgent}/agent/yr for Listedit; net change: $${softwareDelta.toLocaleString()}.`,
      footnote: softwareDelta > 0 ? 'Consider higher replacement percentage to reduce overlap.' : 'Net software cost reduction improves margins.'
    })
  }

  return insights.slice(0, 5) // Limit to 5 insights max
}

export const QUICK_WIN_TWEAKS = {
  'reduce-after-time': {
    label: 'Reduce After time to 8%',
    changes: { afterTimePercent: 8 } as Partial<ListeditState>
  },
  'increase-low-uplift': {
    label: 'Increase Low uplift by +10pp',
    changes: { lowSegmentUplift: (state: ListeditState) => Math.min(100, state.lowSegmentUplift + 10) } as any
  },
  'raise-replace': {
    label: 'Raise Replace% to 60%',
    changes: { softwareReplacePercent: 60 } as Partial<ListeditState>
  },
  'lower-seat-price': {
    label: 'Seat price to $4,500',
    changes: { listeditPricePerAgent: 4500 } as Partial<ListeditState>
  },
  'shift-to-team': {
    label: 'Shift 5% to Team',
    changes: { allocationTeam: (state: ListeditState) => Math.min(100, state.allocationTeam + 5) } as any
  }
}
