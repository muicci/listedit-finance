'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useListedit } from '@/contexts/ListeditContext'
import { InputField } from '@/components/InputField'
import { getRepetitiveTasksExplanation, formatCurrency } from '@/lib/calculations'

import { Info, CheckCircle2, Sparkles } from 'lucide-react'

// Unified callout (colored info box)
function Callout({
  variant = 'info',
  icon,
  children,
  style,
}: {
  variant?: 'success' | 'info' | 'warning'
  icon?: React.ReactNode
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  const styles =
    variant === 'success'
      ? 'bg-[#ECFDF5] text-[#065F46] ring-[#A7F3D0]'
      : variant === 'warning'
      ? 'bg-[#FFFBEB] text-[#92400E] ring-[#FDE68A]'
      : 'bg-[#EFF6FF] text-[#1E3A8A] ring-[#BFDBFE]'

  return (
    <div className={`mt-6 p-4 md:p-5 rounded-xl ring-1 ${styles} shadow-sm`} style={style}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export function InputsTab() {
  const { state, metrics, updateState } = useListedit()

  return (
    <div className="space-y-10 md:space-y-14 lg:space-y-16">
      {/* General Settings */}
      <Card className="bg-white border border-border/60 rounded-2xl mb-4">
        <CardHeader className="border-b border-border/20 bg-white rounded-t-2xl py-5">
          <CardTitle className="text-base font-semibold tracking-tight">General Settings</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Basic configuration for your agency analysis</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          <InputField
            id="numberOfAgents"
            label="Number of agents"
            value={state.numberOfAgents}
            onChange={(value) => updateState({ numberOfAgents: value })}
            tooltip="Total number of agents in your agency"
            min={1}
          />
        </CardContent>
      </Card>

      {/* Revenue Drivers */}
      <Card className="bg-white border border-border/60 rounded-2xl mb-4">
        <CardHeader className="border-b border-border/20 bg-white rounded-t-2xl py-5">
          <CardTitle className="text-base font-semibold tracking-tight">Revenue Drivers</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Key factors that determine agent revenue performance</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          <InputField
            id="dealsPerYearTop"
            label="Deals/year – Top performers"
            value={state.dealsPerYearTop}
            onChange={(value) => updateState({ dealsPerYearTop: value })}
            tooltip="Average number of deals closed per year by top performing agents"
            min={0}
          />
          
          <InputField
            id="dealsPerYearLow"
            label="Deals/year – Low performers"
            value={state.dealsPerYearLow}
            onChange={(value) => updateState({ dealsPerYearLow: value })}
            tooltip="Average number of deals closed per year by low performing agents"
            min={0}
          />
          
          <InputField
            id="topPerformerRatio"
            label="Top performer ratio"
            value={state.topPerformerRatio}
            onChange={(value) => updateState({ topPerformerRatio: value })}
            tooltip="Percentage of agents classified as top performers"
            type="percentage"
            min={0}
            max={100}
          />
          
          <InputField
            id="avgPropertyValue"
            label="Average property value"
            value={state.avgPropertyValue}
            onChange={(value) => updateState({ avgPropertyValue: value })}
            tooltip="Average value of properties sold by agents"
            type="currency"
            min={0}
            placeholder="$"
          />
          
          <InputField
            id="commissionRate"
            label="Commission rate"
            value={state.commissionRate}
            onChange={(value) => updateState({ commissionRate: value })}
            tooltip="Commission percentage on property sales"
            type="percentage"
            min={0}
            max={100}
            step={0.1}
          />
          
          <div className="space-y-8">
            <Separator className="my-3 bg-border/30" />
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <h4 className="font-medium tracking-tight">Performance uplift with Listedit</h4>
            </div>
            
            <InputField
              id="topSegmentUplift"
              label="Top segment uplift"
              value={state.topSegmentUplift}
              onChange={(value) => updateState({ topSegmentUplift: value })}
              tooltip="Expected performance improvement for top performing agents"
              type="percentage"
              min={0}
              max={100}
            />
            
            <InputField
              id="lowSegmentUplift"
              label="Low segment uplift"
              value={state.lowSegmentUplift}
              onChange={(value) => updateState({ lowSegmentUplift: value })}
              tooltip="Expected performance improvement for low performing agents"
              type="percentage"
              min={0}
              max={100}
            />
          </div>
        </CardContent>
      </Card>

      {/* Costs - Baseline vs With Listedit */}
      <Card className="bg-white border border-border/60 rounded-2xl mb-4">
        <CardHeader className="border-b border-border/20 bg-white rounded-t-2xl py-5">
          <CardTitle className="text-base font-semibold tracking-tight">Costs – Baseline vs With Listedit</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Compare operational costs before and after Listedit implementation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Software & Services */}
          <div className="space-y-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-sm" />
              <h4 className="font-medium tracking-tight">Software &amp; Services</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 xl:gap-8">
              <InputField
                id="baselineSoftwarePercent"
                label="Baseline spend as % of revenue"
                value={state.baselineSoftwarePercent}
                onChange={(value) => updateState({ baselineSoftwarePercent: value })}
                tooltip="Current software and services spend as percentage of revenue"
                type="percentage"
                min={0}
                max={100}
              />
              
              <InputField
                id="softwareReplacePercent"
                label="% replaced by Listedit"
                value={state.softwareReplacePercent}
                onChange={(value) => updateState({ softwareReplacePercent: value })}
                tooltip="Percentage of existing software costs that Listedit will replace"
                type="percentage"
                min={0}
                max={100}
              />
              
              <InputField
                id="listeditPricePerAgent"
                label="Listedit annual price per agent"
                value={state.listeditPricePerAgent}
                onChange={(value) => updateState({ listeditPricePerAgent: value })}
                tooltip="Annual subscription cost per agent for Listedit"
                type="currency"
                min={0}
              />
            </div>

          {/* Total Cost Savings Explanation */}
          <Callout variant="success" icon={<CheckCircle2 className="h-5 w-5 mt-0.5 text-[#059669]" />} style={{ backgroundColor: '#E6F4EA' }}>
            Total baseline costs in Software &amp; Services are <strong>{formatCurrency(metrics.softwareCostBefore, state.currency)}</strong>, reduced to <strong>{formatCurrency(metrics.softwareCostAfter, state.currency)}</strong> with Listedit—saving <strong>{formatCurrency(metrics.softwareCostBefore - metrics.softwareCostAfter, state.currency)}</strong> ({((metrics.softwareCostBefore - metrics.softwareCostAfter) / metrics.softwareCostBefore * 100).toFixed(1)}%) per year.
          </Callout>
          </div>

          <Separator className="my-6 bg-border/30" />

          {/* Repetitive Tasks */}
          <div className="space-y-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-sm" />
              <h4 className="font-medium tracking-tight">Repetitive Tasks (Manual Work)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 xl:gap-8">
              <InputField
                id="hoursPerWeekPerAgent"
                label="Hours/week per agent"
                value={state.hoursPerWeekPerAgent}
                onChange={(value) => updateState({ hoursPerWeekPerAgent: value })}
                tooltip="Hours per week each agent spends on repetitive tasks"
                min={0}
                max={168}
              />
              
              <InputField
                id="costPerHour"
                label="Cost/hour"
                value={state.costPerHour}
                onChange={(value) => updateState({ costPerHour: value })}
                tooltip="Hourly cost for agent time spent on repetitive tasks"
                type="currency"
                min={0}
              />
              
              <InputField
                id="afterTimePercent"
                label="After time as % of baseline"
                value={state.afterTimePercent}
                onChange={(value) => updateState({ afterTimePercent: value })}
                tooltip="Percentage of baseline time required after Listedit implementation"
                type="percentage"
                min={0}
                max={100}
              />
            </div>
            
            {/* Dynamic explanation */}
            <Callout variant="info" icon={<Info className="h-5 w-5 mt-0.5 text-[#1D4ED8]" />} style={{ backgroundColor: '#E8F0FE' }}>
              {getRepetitiveTasksExplanation(state)}
            </Callout>
          </div>

          <Separator className="my-6 bg-border/30" />

          {/* Human Costs */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-sm" />
              <h4 className="font-medium tracking-tight">Human Costs (Assistants, Support staff)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 xl:gap-8">
              <InputField
                id="assistantPerAgent"
                label="Assistant per agent (annual)"
                value={state.assistantPerAgent}
                onChange={(value) => updateState({ assistantPerAgent: value })}
                tooltip="Annual cost of assistant per agent"
                type="currency"
                min={0}
              />
              
              <InputField
                id="marketingPerAgent"
                label="Marketing assistant (VA) per agent (annual)"
                value={state.marketingPerAgent}
                onChange={(value) => updateState({ marketingPerAgent: value })}
                tooltip="Annual cost of marketing assistant per agent"
                type="currency"
                min={0}
              />
              
              <InputField
                id="humanReplacePercent"
                label="Human replacement %"
                value={state.humanReplacePercent}
                onChange={(value) => updateState({ humanReplacePercent: value })}
                tooltip="Percent reduction in assistant + marketing cost after Listedit"
                type="percentage"
                min={0}
                max={100}
              />
            </div>
          </div>

          {/* Human Cost Savings Explanation */}
          <Callout variant="warning" icon={<Sparkles className="h-5 w-5 mt-0.5 text-[#B45309]" />} style={{ backgroundColor: '#FFF4E5' }}>
            Total baseline human costs are <strong>{formatCurrency(metrics.humanCostBefore, state.currency)}</strong>, reduced to <strong>{formatCurrency(metrics.humanCostAfter, state.currency)}</strong> with Listedit—saving <strong>{formatCurrency(metrics.humanCostBefore - metrics.humanCostAfter, state.currency)}</strong> ({((metrics.humanCostBefore - metrics.humanCostAfter) / metrics.humanCostBefore * 100).toFixed(1)}%) per year.
          </Callout>

        </CardContent>
      </Card>
    </div>
  )
}
