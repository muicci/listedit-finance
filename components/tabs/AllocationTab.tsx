'use client'


import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useListedit } from '@/contexts/ListeditContext'
import { InputField } from '@/components/InputField'
import { formatPercentage, formatCurrency } from '@/lib/calculations'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const numberFormatter = new Intl.NumberFormat('en-US')


const ALLOCATION_COLORS = [
  '#3b82f6', // Team - Blue
  '#10b981', // R&D - Green
  '#f59e0b', // Partnerships - Amber
  '#8b5cf6', // Infrastructure - Purple
  '#ef4444', // Compliance - Red
  '#06b6d4', // Sales & Marketing - Cyan
  '#6b7280'  // Buffer - Gray
]

// Round to max 2 decimal places for clean percentage inputs
const round2 = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100

function SolidTooltip({ active, payload, label, amount }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div
      style={{
        background: 'var(--tooltip-bg, #ffffff)',
        color: 'var(--foreground, #111827)',
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 10,
        padding: '10px 12px',
        boxShadow: '0 8px 24px rgba(0,0,0,.12)',
        minWidth: 160
      }}
    >
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-1 font-medium">{formatPercentage(p.value || 0)}</div>
      {typeof amount === 'number' && (
        <div className="text-xs mt-1 opacity-80">
          ≈ {formatCurrency(((p.value || 0) / 100) * amount, 'AUD')}
        </div>
      )}
    </div>
  )
}

export function AllocationTab() {
  const { state, updateAllocation } = useListedit()

  const [investmentAmt, setInvestmentAmt] = React.useState<number>(1500000);

  const allocationData = [
    {
      name: 'Team',
      value: round2(state.allocationTeam),
      fill: ALLOCATION_COLORS[0],
      key: 'allocationTeam'
    },
    {
      name: 'R&D',
      value: round2(state.allocationRnD),
      fill: ALLOCATION_COLORS[1],
      key: 'allocationRnD'
    },
    {
      name: 'Partnerships & Conferences',
      value: round2(state.allocationPartnerships),
      fill: ALLOCATION_COLORS[2],
      key: 'allocationPartnerships'
    },
    {
      name: 'Infrastructure',
      value: round2(state.allocationInfrastructure),
      fill: ALLOCATION_COLORS[3],
      key: 'allocationInfrastructure'
    },
    {
      name: 'Compliance & Legal',
      value: round2(state.allocationCompliance),
      fill: ALLOCATION_COLORS[4],
      key: 'allocationCompliance'
    },
    {
      name: 'Sales & Marketing',
      value: round2(state.allocationSales),
      fill: ALLOCATION_COLORS[5],
      key: 'allocationSales'
    },
    {
      name: 'Buffer',
      value: round2(state.allocationBuffer),
      fill: ALLOCATION_COLORS[6],
      key: 'allocationBuffer'
    }
  ]

  const totalAllocation = allocationData.reduce((sum, item) => sum + item.value, 0)
  const balanced = Math.abs(totalAllocation - 100) < 0.1

  const handleUpdateAllocation = (field: string, value: number) => {
    const roundedValue = round2(value)
    updateAllocation(field, roundedValue)
  }

  return (
    <div className="space-y-6">
      {/* Allocation Inputs */}
      <Card className="bg-white">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between bg-white">
          <div>
            <CardTitle>Investment Allocation</CardTitle>
            <CardDescription>
              Breakdown of investment use across different categories. Values automatically balance to 100%.
            </CardDescription>
          </div>
          <div
            className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              balanced ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {balanced ? 'Balanced' : `Adjust ${Math.abs(100 - totalAllocation).toFixed(1)}%`}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-1 sm:col-span-1">
              <label className="block text-sm font-medium mb-1">Total investment</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9,]*"
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                  value={numberFormatter.format(investmentAmt)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    setInvestmentAmt(Number(raw || 0))
                  }}
                  onBlur={(e) => {
                    // Reformat on blur to ensure commas
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    e.currentTarget.value = numberFormatter.format(Number(raw || 0))
                  }}
                  placeholder="1,500,000"
                />
                <span className="text-xs text-muted-foreground">AUD</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              id="allocationTeam"
              label="Team"
              value={round2(state.allocationTeam)}
              onChange={(value) => handleUpdateAllocation('allocationTeam', value)}
              tooltip="Investment in hiring and team development"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationRnD"
              label="R&D"
              value={round2(state.allocationRnD)}
              onChange={(value) => handleUpdateAllocation('allocationRnD', value)}
              tooltip="Research and development activities"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationPartnerships"
              label="Partnerships & Conference Sponsorships"
              value={round2(state.allocationPartnerships)}
              onChange={(value) => handleUpdateAllocation('allocationPartnerships', value)}
              tooltip="Strategic partnerships and industry event sponsorships"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationInfrastructure"
              label="Infrastructure"
              value={round2(state.allocationInfrastructure)}
              onChange={(value) => handleUpdateAllocation('allocationInfrastructure', value)}
              tooltip="Technology infrastructure and platform development"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationCompliance"
              label="Compliance & Legal"
              value={round2(state.allocationCompliance)}
              onChange={(value) => handleUpdateAllocation('allocationCompliance', value)}
              tooltip="Legal, compliance, and regulatory activities"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationSales"
              label="Sales & Marketing"
              value={round2(state.allocationSales)}
              onChange={(value) => handleUpdateAllocation('allocationSales', value)}
              tooltip="Sales team and marketing activities"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="allocationBuffer"
              label="Buffer"
              value={round2(state.allocationBuffer)}
              onChange={(value) => handleUpdateAllocation('allocationBuffer', value)}
              tooltip="Reserve funds for unexpected opportunities or challenges"
              type="percentage"
              min={0}
              max={100}
            />
          </div>

          {/* Total Validation */}
          <div
            className={`p-4 rounded-lg border ${
              balanced ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
            } bg-white`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Allocation</span>
              <span className={`font-bold text-lg ${balanced ? 'text-emerald-700' : 'text-amber-700'}`}>
                {formatPercentage(totalAllocation)}
              </span>
            </div>
            {!balanced && (
              <p className="text-sm mt-1 text-amber-700">
                Allocation should total 100%. Current total: {formatPercentage(totalAllocation)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-white">
          <CardHeader className="bg-white">
            <CardTitle>Allocation Breakdown</CardTitle>
            <CardDescription>Pie chart showing investment distribution</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="relative" style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatPercentage(value || 0)}`}
                    outerRadius={120}
                    innerRadius={60}
                    cornerRadius={6}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<SolidTooltip amount={investmentAmt} />} />
                  {/* Center labels inside the SVG to avoid overlap with legend */}
                  <text x="50%" y="44%" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="var(--muted-foreground, #6b7280)">Total</text>
                  <text x="50%" y="56%" textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="600" fill="var(--foreground, #111827)">{formatPercentage(totalAllocation)}</text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
              {allocationData.map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-sm">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.fill }} />
                  <span className="truncate">{item.name}</span>
                  <span className="ml-auto font-medium">{formatPercentage(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horizontal bar chart */}
        <Card className="bg-white">
          <CardHeader className="bg-white">
            <CardTitle>Allocation (0–100%)</CardTitle>
            <CardDescription>Horizontal comparison by category</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={allocationData}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid stroke="var(--border, #e5e7eb)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={140} axisLine={false} tickLine={false} />
                <Tooltip content={<SolidTooltip amount={investmentAmt} />} />
                <Legend />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {allocationData.map((item, i) => (
                    <Cell key={item.key} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader className="bg-white">
          <CardTitle>Dollars allocation (at {formatCurrency(investmentAmt, 'AUD')})</CardTitle>
          <CardDescription>Estimated amounts per category</CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allocationData.map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border p-3" style={{borderColor:'var(--border)'}}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block w-3 h-3 rounded-full" style={{background:item.fill}} />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatPercentage(item.value)}</div>
                  <div className="text-lg font-semibold">{formatCurrency((item.value/100)*investmentAmt, 'AUD')}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
