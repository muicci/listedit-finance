/**
 * Calculation utilities for Listedit Dashboard
 */

import { ListeditState, CalculatedMetrics, AGENT_COUNTS } from '@/types/listedit'

export function calculateMetrics(state: ListeditState): CalculatedMetrics {
  // Agent distribution
  const topAgents = Math.round(state.numberOfAgents * (state.topPerformerRatio / 100))
  const lowAgents = state.numberOfAgents - topAgents
  
  // Commission per deal
  const commissionPerDeal = state.avgPropertyValue * (state.commissionRate / 100)
  
  // Revenue calculations - Before
  const revenueTopBefore = topAgents * state.dealsPerYearTop * commissionPerDeal
  const revenueLowBefore = lowAgents * state.dealsPerYearLow * commissionPerDeal
  const revenueTotalBefore = revenueTopBefore + revenueLowBefore
  
  // Revenue calculations - After
  const revenueTopAfter = topAgents * state.dealsPerYearTop * (1 + state.topSegmentUplift / 100) * commissionPerDeal
  const revenueLowAfter = lowAgents * state.dealsPerYearLow * (1 + state.lowSegmentUplift / 100) * commissionPerDeal
  const revenueTotalAfter = revenueTopAfter + revenueLowAfter
  
  // Cost calculations - Software & Services (now percentage-based)
  const softwareCostBefore = revenueTotalBefore * (state.baselineSoftwarePercent / 100)
  const softwareCostAfter = softwareCostBefore * (1 - state.softwareReplacePercent / 100) + 
                           (state.numberOfAgents * state.listeditPricePerAgent)
  
  // Cost calculations - Repetitive Tasks
  const repetitiveCostBefore = state.numberOfAgents * state.hoursPerWeekPerAgent * 52 * state.costPerHour
  const repetitiveCostAfter = repetitiveCostBefore * (state.afterTimePercent / 100)
  
  // Cost calculations - Human Costs
  const humanCostBefore = state.numberOfAgents * (state.assistantPerAgent + state.marketingPerAgent)
  const humanCostAfter = humanCostBefore * (1 - state.humanReplacePercent / 100)
  
  // Total costs
  const totalCostBefore = softwareCostBefore + repetitiveCostBefore + humanCostBefore
  const totalCostAfter = softwareCostAfter + repetitiveCostAfter + humanCostAfter
  
  // Profit calculations
  const profitBefore = revenueTotalBefore - totalCostBefore
  const profitAfter = revenueTotalAfter - totalCostAfter
  const profitMarginBefore = revenueTotalBefore > 0 ? (profitBefore / revenueTotalBefore) * 100 : 0
  const profitMarginAfter = revenueTotalAfter > 0 ? (profitAfter / revenueTotalAfter) * 100 : 0
  
  // Valuation calculations
  const totalGlobalAgents = Object.values(AGENT_COUNTS).reduce((sum, count) => sum + count, 0)
  const tam = totalGlobalAgents * state.annualPricePerClient
  const sam = tam * (state.samPercent / 100)
  const som = sam * (state.somPercent / 100)
  const arr = state.payingClients * state.annualPricePerClient
  const valuation = arr * state.arrMultiple
  
  // Savings calculations
  const costSavings = totalCostBefore - totalCostAfter
  const revenuIncrease = revenueTotalAfter - revenueTotalBefore
  const totalBenefit = revenuIncrease + costSavings

  return {
    topAgents,
    lowAgents,
    revenueTopBefore,
    revenueLowBefore,
    revenueTotalBefore,
    revenueTopAfter,
    revenueLowAfter,
    revenueTotalAfter,
    softwareCostBefore,
    softwareCostAfter,
    repetitiveCostBefore,
    repetitiveCostAfter,
    humanCostBefore,
    humanCostAfter,
    totalCostBefore,
    totalCostAfter,
    profitBefore,
    profitAfter,
    profitMarginBefore,
    profitMarginAfter,
    tam,
    sam,
    som,
    arr,
    valuation,
    costSavings,
    revenuIncrease,
    totalBenefit
  }
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === 'AUD' ? 'A$' : currency === 'NZD' ? 'NZ$' : '$'
  
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount)).replace(/^/, symbol)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getRepetitiveTasksExplanation(state: ListeditState): string {
  const annualHours = state.hoursPerWeekPerAgent * 52
  const annualCost = annualHours * state.costPerHour
  const afterHours = annualHours * (state.afterTimePercent / 100)
  const savings = annualCost - (annualCost * (state.afterTimePercent / 100))
  
  return `Each agent spends ${state.hoursPerWeekPerAgent} hrs/week (${formatCurrency(annualCost, state.currency)}/year) — Listedit reduces this to ${state.afterTimePercent}% of baseline, saving ${formatCurrency(savings, state.currency)} per year.`
}

export function normalizeAllocation(allocation: Partial<Record<string, number>>, changedKey: string, newValue: number): Record<string, number> {
  const keys = ['allocationTeam', 'allocationRnD', 'allocationPartnerships', 'allocationInfrastructure', 'allocationCompliance', 'allocationSales', 'allocationBuffer']
  const result: Record<string, number> = {}
  
  // Set the changed value
  result[changedKey] = newValue
  
  // Calculate remaining percentage to distribute
  const remaining = 100 - newValue
  const otherKeys = keys.filter(key => key !== changedKey)
  const otherTotal = otherKeys.reduce((sum, key) => sum + (allocation[key] || 0), 0)
  
  // If other values sum to 0, distribute equally
  if (otherTotal === 0) {
    const equalShare = remaining / otherKeys.length
    otherKeys.forEach(key => {
      result[key] = equalShare
    })
  } else {
    // Proportionally adjust other values
    const ratio = remaining / otherTotal
    otherKeys.forEach(key => {
      result[key] = (allocation[key] || 0) * ratio
    })
  }
  
  return result
}

export function calculateTAMSAMSOM(agentCounts: Record<string, number>, annualPrice: number, samPercent: number, somPercent: number) {
  const totalAgents = Object.values(agentCounts).reduce((sum, count) => sum + count, 0)
  const tam = totalAgents * annualPrice
  const sam = tam * (samPercent / 100)
  const som = sam * (somPercent / 100)
  
  return { tam, sam, som, totalAgents }
}

export function generateValuationData(baseClients: number, maxClients: number, step: number, pricePerClient: number, arrMultiple: number) {
  const data = []
  for (let clients = baseClients; clients <= maxClients; clients += step) {
    const arr = clients * pricePerClient
    const valuation = arr * arrMultiple
    data.push({
      clients,
      arr,
      valuation
    })
  }
  return data
}
