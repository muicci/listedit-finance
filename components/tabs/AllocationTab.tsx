'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useListedit } from '@/contexts/ListeditContext'
import { InputField } from '@/components/InputField'
import { formatPercentage } from '@/lib/calculations'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const ALLOCATION_COLORS = [
  '#3b82f6', // Team - Blue
  '#10b981', // R&D - Green
  '#f59e0b', // Partnerships - Amber
  '#8b5cf6', // Infrastructure - Purple
  '#ef4444', // Compliance - Red
  '#06b6d4', // Sales & Marketing - Cyan
  '#6b7280'  // Buffer - Gray
]

export function AllocationTab() {
  const { state, updateAllocation } = useListedit()

  const allocationData = [
    { 
      name: 'Team', 
      value: state.allocationTeam, 
      fill: ALLOCATION_COLORS[0],
      key: 'allocationTeam' 
    },
    { 
      name: 'R&D', 
      value: state.allocationRnD, 
      fill: ALLOCATION_COLORS[1],
      key: 'allocationRnD' 
    },
    { 
      name: 'Partnerships & Conferences', 
      value: state.allocationPartnerships, 
      fill: ALLOCATION_COLORS[2],
      key: 'allocationPartnerships' 
    },
    { 
      name: 'Infrastructure', 
      value: state.allocationInfrastructure, 
      fill: ALLOCATION_COLORS[3],
      key: 'allocationInfrastructure' 
    },
    { 
      name: 'Compliance & Legal', 
      value: state.allocationCompliance, 
      fill: ALLOCATION_COLORS[4],
      key: 'allocationCompliance' 
    },
    { 
      name: 'Sales & Marketing', 
      value: state.allocationSales, 
      fill: ALLOCATION_COLORS[5],
      key: 'allocationSales' 
    },
    { 
      name: 'Buffer', 
      value: state.allocationBuffer, 
      fill: ALLOCATION_COLORS[6],
      key: 'allocationBuffer' 
    }
  ]

  const totalAllocation = allocationData.reduce((sum, item) => sum + item.value, 0)

  const handleUpdateAllocation = (field: string, value: number) => {
    const roundedValue = Math.round(value * 100) / 100
    updateAllocation(field, roundedValue)
  }

  return (
    <div className="space-y-6">
      {/* Allocation Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Allocation</CardTitle>
          <CardDescription>
            Breakdown of investment use across different categories. Values automatically balance to 100%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              id="allocationTeam"
              label="Team"
              value={state.allocationTeam}
              onChange={(value) => handleUpdateAllocation('allocationTeam', value)}
              tooltip="Investment in hiring and team development"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationRnD"
              label="R&D"
              value={state.allocationRnD}
              onChange={(value) => handleUpdateAllocation('allocationRnD', value)}
              tooltip="Research and development activities"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationPartnerships"
              label="Partnerships & Conference Sponsorships"
              value={state.allocationPartnerships}
              onChange={(value) => handleUpdateAllocation('allocationPartnerships', value)}
              tooltip="Strategic partnerships and industry event sponsorships"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationInfrastructure"
              label="Infrastructure"
              value={state.allocationInfrastructure}
              onChange={(value) => handleUpdateAllocation('allocationInfrastructure', value)}
              tooltip="Technology infrastructure and platform development"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationCompliance"
              label="Compliance & Legal"
              value={state.allocationCompliance}
              onChange={(value) => handleUpdateAllocation('allocationCompliance', value)}
              tooltip="Legal, compliance, and regulatory activities"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationSales"
              label="Sales & Marketing"
              value={state.allocationSales}
              onChange={(value) => handleUpdateAllocation('allocationSales', value)}
              tooltip="Sales team and marketing activities"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationBuffer"
              label="Buffer"
              value={state.allocationBuffer}
              onChange={(value) => handleUpdateAllocation('allocationBuffer', value)}
              tooltip="Reserve funds for unexpected opportunities or challenges"
              type="percentage"
              min={0}
              max={100}
            />
          </div>

          {/* Total Validation */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Allocation:</span>
              <span className={`font-bold text-lg ${Math.abs(totalAllocation - 100) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(totalAllocation)}
              </span>
            </div>
            {Math.abs(totalAllocation - 100) > 0.1 && (
              <p className="text-sm text-red-600 mt-1">
                Allocation should total 100%. Current total: {formatPercentage(totalAllocation)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Breakdown</CardTitle>
            <CardDescription>Pie chart showing investment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatPercentage(value || 0)}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatPercentage(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Allocation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Allocation Details</CardTitle>
          <CardDescription>Detailed breakdown of investment allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allocationData.map((item, index) => (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{formatPercentage(item.value)}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(item.value / 50) * 100}%`,
                        backgroundColor: item.fill 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
