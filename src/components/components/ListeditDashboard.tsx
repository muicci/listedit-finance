'use client'

import * as React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

// Tabs (pages)
import { DashboardTab } from '@/components/tabs/DashboardTab'
import { InputsTab } from '@/components/tabs/InputsTab'
import { NumbersTab } from '@/components/tabs/NumbersTab'
import ValuationTab from '@/components/tabs/ValuationTab'
import { AllocationTab } from '@/components/tabs/AllocationTab'

/**
 * ListeditDashboard
 * Restores the named export expected by Presentation.tsx and
 * applies colored active states per tab.
 */
export function ListeditDashboard() {
  return (
    <Tabs.Root defaultValue="dashboard" orientation="horizontal">
      <Tabs.List
        className={cn(
          'inline-flex w-full flex-wrap items-center gap-2 rounded-full border border-border bg-card p-1 shadow-sm ring-1 ring-border/40',
          'sm:w-auto sm:justify-start'
        )}
      >
        <Tabs.Trigger
          value="dashboard"
          className={cn(
            baseTrigger,
            'rounded-full',
            'data-[state=active]:bg-[#2563eb] data-[state=active]:text-white'
          )}
        >
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger
          value="inputs"
          className={cn(
            baseTrigger,
            'rounded-full',
            'data-[state=active]:bg-[#f59e0b] data-[state=active]:text-white'
          )}
        >
          Inputs
        </Tabs.Trigger>
        <Tabs.Trigger
          value="numbers"
          className={cn(
            baseTrigger,
            'rounded-full',
            'data-[state=active]:bg-[#38bdf8] data-[state=active]:text-white'
          )}
        >
          Numbers
        </Tabs.Trigger>
        <Tabs.Trigger
          value="valuation"
          className={cn(
            baseTrigger,
            'rounded-full',
            'data-[state=active]:bg-[#16a34a] data-[state=active]:text-white'
          )}
        >
          Valuation
        </Tabs.Trigger>
        <Tabs.Trigger
          value="allocation"
          className={cn(
            baseTrigger,
            'rounded-full',
            'data-[state=active]:bg-[#8b5cf6] data-[state=active]:text-white'
          )}
        >
          Allocation
        </Tabs.Trigger>
      </Tabs.List>

      <div className="mt-4 space-y-6">
        <Tabs.Content value="dashboard" className="focus-visible:outline-none">
          <DashboardTab />
        </Tabs.Content>
        <Tabs.Content value="inputs" className="focus-visible:outline-none">
          <InputsTab />
        </Tabs.Content>
        <Tabs.Content value="numbers" className="focus-visible:outline-none">
          <NumbersTab />
        </Tabs.Content>
        <Tabs.Content value="valuation" className="focus-visible:outline-none">
          <ValuationTab />
        </Tabs.Content>
        <Tabs.Content value="allocation" className="focus-visible:outline-none">
          <AllocationTab />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  )
}

const baseTrigger = cn(
  'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium',
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',
  // Inactive styles
  'bg-transparent text-foreground/90 hover:bg-muted'
)

export default ListeditDashboard
