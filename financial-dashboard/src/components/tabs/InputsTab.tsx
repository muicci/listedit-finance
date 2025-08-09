'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useListedit } from '@/contexts/ListeditContext'
import { InputField } from '@/components/InputField'
import { getRepetitiveTasksExplanation, formatCurrency } from '@/lib/calculations'

export function InputsTab() {
  const { state, metrics, updateState } = useListedit()

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic configuration for your agency analysis</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <Card>
        <CardHeader>
          <CardTitle>Revenue Drivers</CardTitle>
          <CardDescription>Key factors that determine agent revenue performance</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          
          <div className="space-y-4">
            <Separator />
            <h4 className="font-medium">Performance Uplift with Listedit</h4>
            
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
      <Card>
        <CardHeader>
          <CardTitle>Costs – Baseline vs With Listedit</CardTitle>
          <CardDescription>Compare operational costs before and after Listedit implementation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Software & Services */}
          <div className="space-y-4">
            <h4 className="font-medium">Software & Services</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="p-4 bg-green-50 rounded-lg border border-border text-green-900">
            <p>
              Total baseline costs in Software and Services are {formatCurrency(metrics.softwareCostBefore, state.currency)}, reduced to {formatCurrency(metrics.softwareCostAfter, state.currency)} with Listedit, saving {formatCurrency(metrics.softwareCostBefore - metrics.softwareCostAfter, state.currency)} ({((metrics.softwareCostBefore - metrics.softwareCostAfter) / metrics.softwareCostBefore * 100).toFixed(1)}%) per year.
            </p>
          </div>
          </div>

          <Separator />

          {/* Repetitive Tasks */}
          <div className="space-y-4">
            <h4 className="font-medium">Repetitive Tasks (Manual Work)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {getRepetitiveTasksExplanation(state)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Human Costs */}
          <div className="space-y-4">
            <h4 className="font-medium">Human Costs (Assistants, Support staff)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="p-4 bg-yellow-50 rounded-lg border border-border text-yellow-900">
            <p>
              Total baseline human costs are {formatCurrency(metrics.humanCostBefore, state.currency)}, reduced to {formatCurrency(metrics.humanCostAfter, state.currency)} with Listedit, saving {formatCurrency(metrics.humanCostBefore - metrics.humanCostAfter, state.currency)} ({((metrics.humanCostBefore - metrics.humanCostAfter) / metrics.humanCostBefore * 100).toFixed(1)}%) per year.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
