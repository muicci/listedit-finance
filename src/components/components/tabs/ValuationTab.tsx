'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useListedit } from '@/contexts/ListeditContext'
import { InputField } from '@/components/InputField'
import { formatCurrency, formatNumber } from '@/lib/calculations'
import { AGENT_COUNTS } from '@/types/listedit'

const currencySymbol = (c: string) => (c === 'USD' ? '$' : c === 'AUD' ? 'A$' : 'NZ$')

const PALETTE = {
  green: '#16a34a',
  blue: '#2563eb',
  amber: '#f59e0b',
}

function SegmentedPill({
  value,
  onChange,
}: {
  value: 'global' | 'anz'
  onChange: (v: 'global' | 'anz') => void
}) {
  const items = [
    { key: 'global' as const, label: 'Global', color: '#2563eb' },
    { key: 'anz' as const, label: 'ANZ', color: '#16a34a' },
  ]
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm ring-1 ring-border/40">
      {items.map((it) => {
        const active = value === it.key
        return (
          <button
            key={it.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(it.key)}
            className={[
              'px-3 py-1.5 text-sm rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active ? 'text-white shadow' : 'text-foreground bg-muted hover:bg-muted/80',
            ].join(' ')}
            style={active ? { backgroundColor: it.color, boxShadow: '0 6px 18px rgba(0,0,0,.12)' } : undefined}
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  )
}

export default function ValuationTab() {
  const { state, updateState, metrics } = useListedit()
  const [region, setRegion] = useState<'global' | 'anz'>('global')

  useEffect(() => {
    const needsSam = state.samPercent === undefined || state.samPercent === null || state.samPercent === 10
    const needsSom = state.somPercent === undefined || state.somPercent === null || state.somPercent === 10

    if (needsSam || needsSom) {
      updateState({
        ...(needsSam ? { samPercent: 50 } : {}),
        ...(needsSom ? { somPercent: 50 } : {}),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalAgents = useMemo(() => Object.values(AGENT_COUNTS).reduce((a, b) => a + b, 0), [])
  const anzAgents = AGENT_COUNTS.NZ + AGENT_COUNTS.AUS

  const globalTam = totalAgents * state.annualPricePerClient
  const globalSam = globalTam * (state.samPercent / 100)
  const globalSom = globalSam * (state.somPercent / 100)

  const anzTam = anzAgents * state.annualPricePerClient
  const anzSam = anzTam * (state.samPercent / 100)
  const anzSom = anzSam * (state.somPercent / 100)

  const currency = state.currency

  return (
    <div className="space-y-8">
      {/* Overview */}
      <Card className="border border-border rounded-[20px] md:rounded-[24px] overflow-hidden bg-white">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-xl">Valuation Overview</CardTitle>
          <CardDescription>ARR × multiple, plus market size context</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-xl bg-white">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/20 to-transparent" />
              <div className="relative z-10">
                <Stat
                  label="ARR"
                  value={formatCurrency(metrics.arr, currency)}
                  sub={`${formatNumber(state.payingClients)} clients × ${formatCurrency(state.annualPricePerClient, currency)}`}
                />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent" />
              <div className="relative z-10">
                <Stat label="Multiple" value={`${state.arrMultiple}×`} sub="Revenue multiple" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent" />
              <div className="relative z-10">
                <Stat label="Valuation" value={formatCurrency(metrics.valuation, currency)} sub="Total company value" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inputs + market cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border border-border rounded-[20px] md:rounded-[24px] overflow-hidden bg-white">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Market-wide Valuation Scenario</CardTitle>
            <CardDescription>Adjust assumptions to see impact</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              id="payingClients"
              label="Number of paying clients"
              value={state.payingClients}
              onChange={(value) => updateState({ payingClients: value })}
              tooltip="Expected number of agencies/clients paying for Listedit"
              min={0}
            />
            <InputField
              id="annualPricePerClient"
              label="Annual price per client"
              value={state.annualPricePerClient}
              onChange={(value) => updateState({ annualPricePerClient: value })}
              tooltip="Annual subscription price per client (agency)"
              type="currency"
              min={0}
            />
            <InputField
              id="arrMultiple"
              label="ARR multiple"
              value={state.arrMultiple}
              onChange={(value) => updateState({ arrMultiple: value })}
              tooltip="Revenue multiple for valuation calculation"
              min={0}
              step={0.1}
            />
            <InputField
              id="samPercent"
              label="SAM %"
              value={state.samPercent}
              onChange={(value) => updateState({ samPercent: value })}
              tooltip="Serviceable Addressable Market as percentage of TAM"
              type="percentage"
              min={0}
              max={100}
            />
            <InputField
              id="somPercent"
              label="SOM %"
              value={state.somPercent}
              onChange={(value) => updateState({ somPercent: value })}
              tooltip="Serviceable Obtainable Market as percentage of SAM"
              type="percentage"
              min={0}
              max={100}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border border-border rounded-[20px] md:rounded-[24px] overflow-hidden bg-white">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{region === 'global' ? 'Global Market' : 'ANZ Market'}</CardTitle>
                  <CardDescription>
                    {region === 'global' ? 'Worldwide TAM / SAM / SOM' : 'Australia & New Zealand focus market'}
                  </CardDescription>
                </div>
                <SegmentedPill value={region} onChange={setRegion} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'rgba(22,163,74,0.10)', borderColor: 'rgba(22,163,74,0.28)' }}>
                <span className="inline-block w-1.5 h-6 rounded-full mr-3" style={{ background: PALETTE.green }} />
                <span className="font-medium">TAM (Total)</span>
                <span className="font-mono font-bold">{formatCurrency(region === 'global' ? globalTam : anzTam, currency)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'rgba(37,99,235,0.10)', borderColor: 'rgba(37,99,235,0.28)' }}>
                <span className="inline-block w-1.5 h-6 rounded-full mr-3" style={{ background: PALETTE.blue }} />
                <span className="font-medium">SAM ({state.samPercent}%)</span>
                <span className="font-mono font-bold">{formatCurrency(region === 'global' ? globalSam : anzSam, currency)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.32)' }}>
                <span className="inline-block w-1.5 h-6 rounded-full mr-3" style={{ background: PALETTE.amber }} />
                <span className="font-medium">SOM ({state.somPercent}%)</span>
                <span className="font-mono font-bold">{formatCurrency(region === 'global' ? globalSom : anzSom, currency)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {formatNumber(region === 'global' ? totalAgents : anzAgents)} agents
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Count Reference */}
      <Card className="border border-border rounded-[20px] md:rounded-[24px] overflow-hidden bg-white">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Agent Count Reference</CardTitle>
          <CardDescription>Latest available data for real estate agents by country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Agent Count</TableHead>
                  <TableHead className="text-right">TAM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(AGENT_COUNTS)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([country, count]) => (
                    <TableRow key={country} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{country}</TableCell>
                      <TableCell className="text-right font-mono">{formatNumber(count)}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(count * state.annualPricePerClient, currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow className="font-semibold bg-muted/60">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right font-mono">{formatNumber(totalAgents)}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(totalAgents * state.annualPricePerClient, currency)}
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