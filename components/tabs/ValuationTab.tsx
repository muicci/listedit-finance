'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useListedit } from '@/contexts/ListeditContext'
import { InputField } from '@/components/InputField'
import { formatCurrency, formatNumber, generateValuationData } from '@/lib/calculations'
import { AGENT_COUNTS } from '@/types/listedit'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function ValuationTab() {
  const { state, updateState, metrics } = useListedit()

  // Calculate TAM/SAM/SOM
  const totalGlobalAgents = Object.values(AGENT_COUNTS).reduce((sum, count) => sum + count, 0)
  const anzAgents = AGENT_COUNTS.NZ + AGENT_COUNTS.AUS
  
  const globalTam = totalGlobalAgents * state.annualPricePerClient
  const globalSam = globalTam * (state.samPercent / 100)
  const globalSom = globalSam * (state.somPercent / 100)
  
  const anzTam = anzAgents * state.annualPricePerClient
  const anzSam = anzTam * (state.samPercent / 100)
  const anzSom = anzSam * (state.somPercent / 100)

  // Generate valuation chart data
  const valuationData = generateValuationData(100, 1000, 100, state.annualPricePerClient, state.arrMultiple)

  return (
    <div className="space-y-6">
      {/* Valuation */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-gray-300">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-green-900">Valuation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-green-700">ARR</p>
                <p className="text-xl font-bold text-green-800">
                  {formatCurrency(metrics.arr, state.currency)}
                </p>
                <p className="text-xs text-green-600">
                  {state.payingClients} clients × {formatCurrency(state.annualPricePerClient, state.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-700">Multiple</p>
                <p className="text-xl font-bold text-green-800">{state.arrMultiple}×</p>
                <p className="text-xs text-green-600">Revenue multiple</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Valuation</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(metrics.valuation, state.currency)}
                </p>
                <p className="text-xs text-green-600">Total company value</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market-wide Valuation Inputs */}
      <Card className="border border-gray-300">
        <CardHeader>
          <CardTitle>Market-wide Valuation Scenario</CardTitle>
          <CardDescription>Inputs for calculating total addressable market and company valuation</CardDescription>
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

      {/* Agent Count Reference */}
      <Card className="border border-gray-300">
        <CardHeader>
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
                {Object.entries(AGENT_COUNTS).map(([country, count]) => (
                  <TableRow key={country}>
                    <TableCell className="font-medium">{country}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(count)}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(count * state.annualPricePerClient, state.currency)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-gray-100">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right font-mono">{formatNumber(Object.values(AGENT_COUNTS).reduce((a, b) => a + b, 0))}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(Object.values(AGENT_COUNTS).reduce((a, b) => a + b, 0) * state.annualPricePerClient, state.currency)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ANZ Market */}
      <Card className="border border-gray-300">
        <CardHeader>
          <CardTitle>ANZ Market Potential</CardTitle>
          <CardDescription>Australia & New Zealand focus market</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="font-medium">TAM (Total)</span>
              <span className="font-mono font-bold">{formatCurrency(anzTam, state.currency)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-100 rounded-lg border border-amber-300">
              <span className="font-medium">SAM ({state.samPercent}%)</span>
              <span className="font-mono font-bold">{formatCurrency(anzSam, state.currency)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-200 rounded-lg border border-amber-400">
              <span className="font-medium">SOM ({state.somPercent}%)</span>
              <span className="font-mono font-bold">{formatCurrency(anzSom, state.currency)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {formatNumber(anzAgents)} agents in Australia & New Zealand
          </p>
        </CardContent>
      </Card>

      {/* Valuation Sensitivity Chart */}
      <Card className="border border-gray-300">
        <CardHeader>
          <CardTitle>Valuation Sensitivity</CardTitle>
          <CardDescription>Company valuation based on different client counts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={valuationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="clients" />
              <YAxis tickFormatter={(value) => `${state.currency === 'USD' ? '$' : state.currency === 'AUD' ? 'A$' : 'NZ$'}${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value, state.currency),
                  'ARR'
                ]}
                labelFormatter={(clients) => `${clients} clients`}
              />
              <Legend />
              <Bar dataKey="valuation" fill="#10b981" name="Valuation" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
