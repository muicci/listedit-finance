'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useListedit } from '@/contexts/ListeditContext'
import { formatCurrency, formatPercentage, generateValuationData } from '@/lib/calculations'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Target, Zap } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change?: string
  isPositive?: boolean
  icon: React.ReactNode
  description?: string
}

function MetricCard({ title, value, change, isPositive, icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardTab() {
  const { state, metrics } = useListedit()
  const [showWithListedit, setShowWithListedit] = useState(true)

  // --- BUG FIX 1: Corrected chart data ---
  // The 'before' and 'after' values should not be swapped by the toggle.
  // This chart's purpose is to always show a direct comparison.
  const costComparisonData = [
    {
      category: 'Software & Services',
      before: metrics.softwareCostBefore,
      after: metrics.softwareCostAfter
    },
    {
      category: 'Repetitive Tasks',
      before: metrics.repetitiveCostBefore,
      after: metrics.repetitiveCostAfter
    },
    {
      category: 'Human Costs',
      before: metrics.humanCostBefore,
      after: metrics.humanCostAfter
    }
  ]

  // This data correctly toggles between the two scenarios
  const profitTrendData = [
    {
      scenario: showWithListedit ? 'With Listedit' : 'Without Listedit',
      revenue: showWithListedit ? metrics.revenueTotalAfter : metrics.revenueTotalBefore,
      costs: showWithListedit ? metrics.totalCostAfter : metrics.totalCostBefore,
      profit: showWithListedit ? metrics.profitAfter : metrics.profitBefore
    }
  ]

  // This data is only relevant when showing the impact of Listedit
  const impactBreakdownData = [
    { name: 'Revenue Increase', value: metrics.revenuIncrease, fill: '#10b981' },
    { name: 'Cost Savings', value: metrics.costSavings, fill: '#3b82f6' },
    { name: 'Existing Profit', value: metrics.profitBefore, fill: '#6b7280' }
  ]

  // This data is a projection based on the "With Listedit" scenario
  const valuationData = generateValuationData(100, 1000, 100, state.annualPricePerClient, state.arrMultiple)

  return (
    <div className="space-y-6">
      {/* Toggle Switch */}
      <div className="flex items-center space-x-4">
        <label htmlFor="toggle-listedit" className="text-sm font-medium">Show with Listedit</label>
        <input
          id="toggle-listedit"
          type="checkbox"
          checked={showWithListedit}
          onChange={() => setShowWithListedit(!showWithListedit)}
          className="toggle toggle-primary"
        />
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Annual Revenue"
            value={formatCurrency(showWithListedit ? metrics.revenueTotalAfter : metrics.revenueTotalBefore, state.currency)}
            change={showWithListedit ? `+${formatCurrency(metrics.revenuIncrease, state.currency)} increase` : undefined}
            isPositive={showWithListedit}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            description={showWithListedit ? "With Listedit implementation" : "Without Listedit"}
          />
        
        <MetricCard
          title="Total Cost Savings"
          value={formatCurrency(showWithListedit ? metrics.costSavings : 0, state.currency)}
          change={showWithListedit ? `${formatPercentage((metrics.costSavings / metrics.totalCostBefore) * 100)} reduction` : undefined}
          isPositive={showWithListedit}
          icon={<Target className="w-4 h-4 text-muted-foreground" />}
          description={showWithListedit ? "Annual operational savings" : "N/A"}
        />
        
        <MetricCard
          title="Net Profit"
          value={formatCurrency(showWithListedit ? metrics.profitAfter : metrics.profitBefore, state.currency)}
          change={showWithListedit ? `+${formatCurrency(metrics.totalBenefit, state.currency)} improvement` : undefined}
          isPositive={showWithListedit}
          icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
          description={showWithListedit ? "Combined revenue + savings" : undefined}
        />
        
        <MetricCard
          title="Profit Margin"
          value={formatPercentage(showWithListedit ? metrics.profitMarginAfter : metrics.profitMarginBefore)}
          change={showWithListedit ? `+${formatPercentage(metrics.profitMarginAfter - metrics.profitMarginBefore)} improvement` : undefined}
          isPositive={showWithListedit && metrics.profitMarginAfter > metrics.profitMarginBefore}
          icon={<Zap className="w-4 h-4 text-muted-foreground" />}
          description={showWithListedit ? "Efficiency improvement" : undefined}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Profit Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Impact</CardTitle>
            <CardDescription>{showWithListedit ? "With Listedit" : "Without Listedit"}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" />
                <YAxis tickFormatter={(value) => `${state.currency === 'USD' ? '$' : state.currency === 'AUD' ? 'A$' : 'NZ$'}${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value, state.currency)} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Reduction Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Optimization</CardTitle>
            <CardDescription>Cost reduction across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `${state.currency === 'USD' ? '$' : state.currency === 'AUD' ? 'A$' : 'NZ$'}${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => formatCurrency(value, state.currency)} />
                <Legend />
                <Bar dataKey="before" fill="#ef4444" name="Before" />
                <Bar dataKey="after" fill="#22c55e" name="After" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* --- BUG FIX 2: Conditionally render impact charts --- */}
        {/* These charts are only relevant in the "With Listedit" view. */}
        {showWithListedit && (
          <>
            {/* Impact Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Total Impact Breakdown</CardTitle>
                <CardDescription>Sources of financial improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {impactBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value, state.currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Growth Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Growth Over Time</CardTitle>
                <CardDescription>Projected profit growth based on client acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valuationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="clients" />
                <YAxis tickFormatter={(value) => `${state.currency === 'USD' ? '$' : state.currency === 'AUD' ? 'A$' : 'NZ$'}${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value, state.currency)} />
                <Legend />
                <Bar dataKey="valuation" fill="#f59e0b" name="Valuation" />
              </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
