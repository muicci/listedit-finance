'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useListedit } from '@/contexts/ListeditContext'
import { formatCurrency, formatPercentage } from '@/lib/calculations'
import { AGENT_COUNTS } from '@/types/listedit'
import { Users } from 'lucide-react'

export function NumbersTab() {
  const { state, metrics } = useListedit()

  const tableData = [
    {
      category: 'Revenue Total',
      before: metrics.revenueTotalBefore,
      after: metrics.revenueTotalAfter,
      difference: metrics.revenueTotalAfter - metrics.revenueTotalBefore,
      type: 'currency' as const
    },
    {
      category: 'Software & Services',
      before: metrics.softwareCostBefore,
      after: metrics.softwareCostAfter,
      difference: metrics.softwareCostAfter - metrics.softwareCostBefore,
      type: 'currency' as const
    },
    {
      category: 'Repetitive Tasks',
      before: metrics.repetitiveCostBefore,
      after: metrics.repetitiveCostAfter,
      difference: metrics.repetitiveCostAfter - metrics.repetitiveCostBefore,
      type: 'currency' as const
    },
    {
      category: 'Human Costs',
      before: metrics.humanCostBefore,
      after: metrics.humanCostAfter,
      difference: metrics.humanCostAfter - metrics.humanCostBefore,
      type: 'currency' as const
    },
    {
      category: 'Total Costs',
      before: metrics.totalCostBefore,
      after: metrics.totalCostAfter,
      difference: metrics.totalCostAfter - metrics.totalCostBefore,
      type: 'currency' as const
    },
    {
      category: 'Profit (absolute $)',
      before: metrics.profitBefore,
      after: metrics.profitAfter,
      difference: metrics.profitAfter - metrics.profitBefore,
      type: 'currency' as const
    },
    {
      category: 'Profit Margin %',
      before: metrics.profitMarginBefore,
      after: metrics.profitMarginAfter,
      difference: metrics.profitMarginAfter - metrics.profitMarginBefore,
      type: 'percentage' as const
    }
  ]

  const formatValue = (value: number, type: 'currency' | 'percentage') => {
    if (type === 'currency') {
      return formatCurrency(value, state.currency)
    }
    return formatPercentage(value)
  }

  const getDifferenceColor = (difference: number, category: string) => {
    if (category.includes('Cost') && category !== 'Total Costs') {
      // For costs, negative difference is good (cost reduction)
      return difference < 0 ? 'text-green-600' : difference > 0 ? 'text-red-600' : 'text-gray-600'
    }
    // For revenue and profit, positive difference is good
    return difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'
  }

  const getDifferenceIcon = (difference: number, category: string) => {
    if (Math.abs(difference) < 0.01) return ''
    
    if (category.includes('Cost') && category !== 'Total Costs') {
      return difference < 0 ? '↓' : '↑'
    }
    return difference > 0 ? '↑' : '↓'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Comparison</CardTitle>
          <CardDescription>
            Clean, table-based Before vs After data showing the impact of Listedit implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="text-right">Before Listedit</TableHead>
                  <TableHead className="text-right font-medium">With Listedit</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                  <TableHead className="text-right">% Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => {
                  const percentChange = row.before !== 0 ? ((row.difference / Math.abs(row.before)) * 100) : 0
                  const isWithListedit = row.category.includes('Profit') || row.category.includes('Revenue')
                  
                  return (
                    <TableRow key={index} className={isWithListedit ? 'bg-amber-50/30' : ''}>
                      <TableCell className="font-medium">{row.category}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatValue(row.before, row.type)}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${isWithListedit ? 'font-semibold' : ''}`}>
                        {formatValue(row.after, row.type)}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${getDifferenceColor(row.difference, row.category)}`}>
                        {getDifferenceIcon(row.difference, row.category)} {formatValue(Math.abs(row.difference), row.type)}
                      </TableCell>
                      <TableCell className={`text-right ${getDifferenceColor(row.difference, row.category)}`}>
                        {Math.abs(percentChange) > 0.1 ? (
                          <Badge 
                            variant={
                              (row.category.includes('Cost') && row.category !== 'Total Costs') 
                                ? (row.difference < 0 ? 'default' : 'destructive')
                                : (row.difference > 0 ? 'default' : 'destructive')
                            }
                            className="text-xs"
                          >
                            {getDifferenceIcon(row.difference, row.category)} {Math.abs(percentChange).toFixed(1)}%
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-green-900">Revenue Increase</h3>
              <p className="text-2xl font-bold text-green-800">
                {formatCurrency(metrics.revenuIncrease, state.currency)}
              </p>
              <p className="text-sm text-green-700">
                {formatPercentage((metrics.revenuIncrease / metrics.revenueTotalBefore) * 100)} improvement
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-blue-900">Cost Savings</h3>
              <p className="text-2xl font-bold text-blue-800">
                {formatCurrency(metrics.costSavings, state.currency)}
              </p>
              <p className="text-sm text-blue-700">
                {formatPercentage((metrics.costSavings / metrics.totalCostBefore) * 100)} reduction
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-purple-900">Total Benefit</h3>
              <p className="text-2xl font-bold text-purple-800">
                {formatCurrency(metrics.totalBenefit, state.currency)}
              </p>
              <p className="text-sm text-purple-700">
                Combined impact
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Breakdown</CardTitle>
          <CardDescription>Revenue impact by agent segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Segment</TableHead>
                  <TableHead className="text-right">Agent Count</TableHead>
                  <TableHead className="text-right">Deals/Year Each</TableHead>
                  <TableHead className="text-right">Revenue Before</TableHead>
                  <TableHead className="text-right">Revenue After</TableHead>
                  <TableHead className="text-right">Improvement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Top Performers</TableCell>
                  <TableCell className="text-right">{metrics.topAgents}</TableCell>
                  <TableCell className="text-right">{state.dealsPerYearTop}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(metrics.revenueTopBefore, state.currency)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatCurrency(metrics.revenueTopAfter, state.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default" className="text-xs">
                      +{formatPercentage(state.topSegmentUplift)}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Low Performers</TableCell>
                  <TableCell className="text-right">{metrics.lowAgents}</TableCell>
                  <TableCell className="text-right">{state.dealsPerYearLow}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(metrics.revenueLowBefore, state.currency)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatCurrency(metrics.revenueLowAfter, state.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default" className="text-xs">
                      +{formatPercentage(state.lowSegmentUplift)}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
