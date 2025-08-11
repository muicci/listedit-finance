'use client'

import React, { useMemo, useState } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useListedit } from '@/contexts/ListeditContext'
import {
  formatCurrency,
  formatPercentage,
  generateValuationData
} from '@/lib/calculations'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ComposedChart
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Target, Zap } from 'lucide-react'

type Scenario = 'without' | 'with'

interface MetricCardProps {
  title: string
  value: string
  change?: string
  isPositive?: boolean
  icon: React.ReactNode
  description?: string
  accent?: string
}

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace('#','');
  const bigint = parseInt(m.length === 3 ? m.split('').map(c => c + c).join('') : m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Solid color palette (hex) to avoid SVGs falling back to black.
 * These are tuned to your theme.
 */
const PALETTE = {
  green: '#16a34a', // chart-1
  blue: '#2563eb',  // chart-2
  purple: '#7c3aed',// chart-3
  amber: '#f59e0b', // chart-4
  sky: '#0ea5e9',   // chart-5
  gray: '#e5e7eb',  // grid/borders
  ink: '#111827',   // tooltip text
  card: '#ffffff'   // tooltip bg (light)
}

const GRID_STROKE = PALETTE.gray

function MetricCard({ title, value, change, isPositive, icon, description, accent = '#2563eb' }: MetricCardProps) {
  const tintBg = hexToRgba(accent, 0.08);
  const tintHeader = hexToRgba(accent, 0.06);
  const tintBorder = hexToRgba(accent, 0.25);
  const textAccent = accent;
  return (
    <Card
      className="border shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
      style={{
        borderColor: tintBorder,
        background: `linear-gradient(180deg, ${tintBg} 0%, #ffffff 55%)`
      }}
    >
      <CardHeader
        className="pb-3 border-b rounded-t-xl"
        style={{ borderColor: hexToRgba(accent, 0.18), background: tintHeader }}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium tracking-tight">{title}</CardTitle>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: hexToRgba(accent, 0.15), color: textAccent }}
          >
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {change && (
          <p
            className="text-xs flex items-center mt-1 font-medium"
            style={{ color: isPositive ? textAccent : '#dc2626' }}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

function SegmentedToggle({
  value,
  onChange,
}: {
  value: Scenario
  onChange: (v: Scenario) => void
}) {
  const items: { key: Scenario; label: string }[] = [
    { key: 'without', label: 'Without Listedit' },
    { key: 'with', label: 'With Listedit' },
  ]
  return (
    <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
      {items.map((it) => {
        const active = it.key === value
        const isWith = it.key === 'with'
        const bg = active ? (isWith ? '#16a34a' : '#f43f5e') : 'var(--color-muted)'
        const fg = active ? '#ffffff' : 'var(--color-foreground)'
        return (
          <button
            key={it.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(it.key)}
            className="px-3 py-1.5 text-sm rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            style={{ background: bg, color: fg }}
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

/** Recharts helpers **/
function CurrencyTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: PALETTE.card,
        color: PALETTE.ink,
        border: `1px solid ${PALETTE.gray}`,
        borderRadius: 10,
        padding: '10px 12px',
        boxShadow: '0 8px 24px rgba(0,0,0,.12)'
      }}
    >
      <div className="text-xs opacity-70" style={{ marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="text-sm" style={{ lineHeight: 1.3 }}>
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: <span className="font-medium">{formatCurrency(p.value, currency)}</span>
        </div>
      ))}
    </div>
  )
}

function toPercent(v?: number) {
  const n = Number(v ?? 0)
  if (!isFinite(n)) return 0
  // If the number looks like 0.435 => 43.5%, otherwise assume it's already a percent
  return n <= 1 ? n * 100 : n
}

export function DashboardTab() {
  const { state, metrics } = useListedit()
  const [scenario, setScenario] = useState<Scenario>('with')
  const showWith = scenario === 'with'
  const beforeMarginPct = Math.max(0, Math.min(100, Math.round(toPercent(metrics.profitMarginBefore))))
  const afterMarginPct  = Math.max(0, Math.min(100, Math.round(toPercent(metrics.profitMarginAfter))))

  /** DATA **/
  const costComparisonData = [
    { category: 'Software & Services', before: metrics.softwareCostBefore, after: metrics.softwareCostAfter },
    { category: 'Repetitive Tasks',   before: metrics.repetitiveCostBefore, after: metrics.repetitiveCostAfter },
    { category: 'Human Costs',        before: metrics.humanCostBefore,      after: metrics.humanCostAfter }
  ]

  const profitTrendData = [
    {
      scenario: showWith ? 'With Listedit' : 'Without Listedit',
      revenue: showWith ? metrics.revenueTotalAfter : metrics.revenueTotalBefore,
      profit:  showWith ? metrics.profitAfter        : metrics.profitBefore,
    }
  ]

  const impactBreakdownData = [
    { name: 'Revenue Increase', value: metrics.revenuIncrease, fill: PALETTE.green },
    { name: 'Cost Savings',     value: metrics.costSavings,   fill: PALETTE.blue },
    { name: 'Existing Profit',  value: metrics.profitBefore,  fill: PALETTE.amber },
  ]

  const valuationData = useMemo(
    () => generateValuationData(100, 1000, 100, state.annualPricePerClient, state.arrMultiple),
    [state.annualPricePerClient, state.arrMultiple]
  )

  const monthlyProjection = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const baseRev = (showWith ? metrics.revenueTotalAfter : metrics.revenueTotalBefore) / 12
    const baseProf = (showWith ? metrics.profitAfter : metrics.profitBefore) / 12
    return months.map((m) => ({
      m: `M${m}`,
      revenue: baseRev * (1 + m * 0.01),
      profit: baseProf * (1 + m * 0.012),
    }))
  }, [metrics, showWith])

  const beforeAfterStacked = [
    { label: 'Before', Software: metrics.softwareCostBefore, Repetitive: metrics.repetitiveCostBefore, Human: metrics.humanCostBefore },
    { label: 'After',  Software: metrics.softwareCostAfter,  Repetitive: metrics.repetitiveCostAfter,  Human: metrics.humanCostAfter },
  ]

  const beforeAfterNormalized = useMemo(() => {
    const rows = [
      { label: 'Before', Software: metrics.softwareCostBefore, Repetitive: metrics.repetitiveCostBefore, Human: metrics.humanCostBefore },
      { label: 'After',  Software: metrics.softwareCostAfter,  Repetitive: metrics.repetitiveCostAfter,  Human: metrics.humanCostAfter },
    ]
    return rows.map(r => {
      const total = (r.Software || 0) + (r.Repetitive || 0) + (r.Human || 0) || 1
      return {
        label: r.label,
        Software: Math.round((r.Software / total) * 100),
        Repetitive: Math.round((r.Repetitive / total) * 100),
        Human: Math.round((r.Human / total) * 100),
      }
    })
  }, [metrics.softwareCostBefore, metrics.softwareCostAfter, metrics.repetitiveCostBefore, metrics.repetitiveCostAfter, metrics.humanCostBefore, metrics.humanCostAfter])

  const marginData = [{ name: 'Margin', before: beforeMarginPct, after: afterMarginPct }]

  /** UI **/
  return (
    <div className="space-y-6">
      {/* Header / Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full border-border text-xs">
            Financial Overview
          </Badge>
          <span className="text-sm text-muted-foreground">Interactive scenario view</span>
        </div>
        <SegmentedToggle value={scenario} onChange={setScenario} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Annual Revenue"
          value={formatCurrency(showWith ? metrics.revenueTotalAfter : metrics.revenueTotalBefore, state.currency)}
          change={showWith ? `+${formatCurrency(metrics.revenuIncrease, state.currency)} increase` : undefined}
          isPositive={showWith}
          icon={<DollarSign className="w-4 h-4" />}
          description={showWith ? 'With Listedit implementation' : 'Without Listedit'}
          accent={PALETTE.blue}
        />
        <MetricCard
          title="Total Cost Savings"
          value={formatCurrency(showWith ? metrics.costSavings : 0, state.currency)}
          change={
            showWith
              ? `${formatPercentage((metrics.costSavings / (metrics.totalCostBefore || 1)) * 100)} reduction`
              : undefined
          }
          isPositive={showWith}
          icon={<Target className="w-4 h-4" />}
          description={showWith ? 'Annual operational savings' : 'N/A'}
          accent={PALETTE.green}
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(showWith ? metrics.profitAfter : metrics.profitBefore, state.currency)}
          change={showWith ? `+${formatCurrency(metrics.totalBenefit, state.currency)} improvement` : undefined}
          isPositive={showWith}
          icon={<TrendingUp className="w-4 h-4" />}
          description={showWith ? 'Combined revenue + savings' : undefined}
          accent={PALETTE.purple}
        />
        <MetricCard
          title="Profit Margin"
          value={`${showWith ? afterMarginPct : beforeMarginPct}%`}
          change={
            showWith
              ? `+${Math.max(0, afterMarginPct - beforeMarginPct)}% improvement`
              : undefined
          }
          isPositive={showWith && afterMarginPct > beforeMarginPct}
          icon={<Zap className="w-4 h-4" />}
          description={showWith ? 'Efficiency improvement' : undefined}
          accent={PALETTE.amber}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Impact */}
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-base">Revenue & Profit Impact</CardTitle>
            <CardDescription>{showWith ? 'With Listedit' : 'Without Listedit'}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitTrendData} barGap={12}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="scenario" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(v) =>
                    `${state.currency === 'USD' ? '$' : state.currency === 'AUD' ? 'A$' : 'NZ$'}${(v / 1_000_000).toFixed(1)}M`
                  }
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip wrapperStyle={{ outline: 'none' }} content={(p) => <CurrencyTooltip {...p} currency={state.currency} />} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill={PALETTE.green} radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill={PALETTE.blue} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Optimization */}
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-base">Cost Optimization</CardTitle>
            <CardDescription>Reduction across categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costComparisonData} barCategoryGap="18%">
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(v) =>
                    `${state.currency === 'USD' ? '$' : state.currency === 'AUD' ? 'A$' : 'NZ$'}${(v / 1_000).toFixed(0)}K`
                  }
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip wrapperStyle={{ outline: 'none' }} content={(p) => <CurrencyTooltip {...p} currency={state.currency} />} />
                <Legend />
                <Bar dataKey="before" name="Before" fill={PALETTE.purple} radius={[8, 8, 0, 0]} opacity={showWith ? 0.45 : 1} />
                <Bar dataKey="after"  name="After"  fill={PALETTE.green}  radius={[8, 8, 0, 0]} opacity={showWith ? 1 : 0.45} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Composition (100% stacked) */}
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-base">Cost Composition (Before vs After)</CardTitle>
            <CardDescription>Normalized to 100%</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={beforeAfterNormalized}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={(p) => {
                  if (!p.active || !p.payload?.length) return null
                  const item = p.payload[0].payload
                  const total = item.Software + item.Repetitive + item.Human || 1
                  const rows = [
                    { name: 'Software', v: item.Software, color: PALETTE.blue },
                    { name: 'Repetitive', v: item.Repetitive, color: PALETTE.amber },
                    { name: 'Human', v: item.Human, color: PALETTE.sky },
                  ].map(r => ({ ...r, pct: Math.round((r.v / total) * 100) }))
                  return (
                    <div style={{ background: PALETTE.card, color: PALETTE.ink, border: `1px solid ${PALETTE.gray}` , borderRadius: 10, padding: '10px 12px', boxShadow: '0 8px 24px rgba(0,0,0,.12)'}}>
                      <div className="text-xs opacity-70">{item.label}</div>
                      {rows.map(r => (
                        <div key={r.name} className="text-sm"><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: r.color }} />{r.name}: {r.pct}%</div>
                      ))}
                    </div>
                  )
                }} />
                <Legend />
                <Bar dataKey="Software"  stackId="a" fill={PALETTE.blue}  radius={0} />
                <Bar dataKey="Repetitive" stackId="a" fill={PALETTE.amber} radius={0} />
                <Bar dataKey="Human"      stackId="a" fill={PALETTE.sky}   radius={[6, 6, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 12‑Month Projection */}
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2 border-b border-gray-200">
            <CardTitle className="text-base">12‑Month Projection</CardTitle>
            <CardDescription>Revenue & Profit trend</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyProjection}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(v) => `${state.currency === 'USD' ? '$' : state.currency === 'AUD' ? 'A$' : 'NZ$'}${(v / 1_000_000).toFixed(1)}M`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip wrapperStyle={{ outline: 'none' }} content={(p) => <CurrencyTooltip {...p} currency={state.currency} />} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={PALETTE.green} fillOpacity={0.2} fill={PALETTE.green} strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke={PALETTE.blue} fillOpacity={0.2} fill={PALETTE.blue} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* With Listedit only */}
        {showWith && (
          <>
            {/* Impact Breakdown */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader className="pb-2 border-b border-gray-200">
                <CardTitle className="text-base">Total Impact Breakdown</CardTitle>
                <CardDescription>Sources of improvement</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactBreakdownData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={90}
                      cornerRadius={8}
                      paddingAngle={2}
                    >
                      {impactBreakdownData.map((seg, i) => (
                        <Cell key={i} fill={seg.fill} />
                      ))}
                    </Pie>
                    <Tooltip wrapperStyle={{ outline: 'none' }} content={(p) => <CurrencyTooltip {...p} currency={state.currency} />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Margin (Before vs After) — horizontal bars */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader className="pb-2 border-b border-gray-200">
                <CardTitle className="text-base leading-none">Profit Margin (Before vs After)</CardTitle>
                <CardDescription>Side‑by‑side comparison</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { label: 'Profit Margin', before: beforeMarginPct, after: afterMarginPct }
                    ]}
                    layout="vertical"
                    barCategoryGap="30%"
                  >
                    <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      tickFormatter={(v) => `${v}%`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} />
                    <Tooltip formatter={(v: any) => `${v}%`} />
                    <Legend />
                    <Bar dataKey="before" name="Before" fill={PALETTE.purple} radius={[0, 8, 8, 0]} barSize={18}>
                      <LabelList dataKey="before" position="right" formatter={(v: any) => `${v}%`} />
                    </Bar>
                    <Bar dataKey="after" name="After" fill={PALETTE.green} radius={[0, 8, 8, 0]} barSize={18}>
                      <LabelList dataKey="after" position="right" formatter={(v: any) => `${v}%`} />
                    </Bar>
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