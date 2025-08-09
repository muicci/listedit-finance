'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import { useListedit } from '@/contexts/ListeditContext'
import { Currency, CURRENCY_SYMBOLS } from '@/types/listedit'
import { DashboardTab } from '@/components/tabs/DashboardTab'
import { InputsTab } from '@/components/tabs/InputsTab'
import { NumbersTab } from '@/components/tabs/NumbersTab'
import { ValuationTab } from '@/components/tabs/ValuationTab'
import { AllocationTab } from '@/components/tabs/AllocationTab'

export function ListeditDashboard() {
  const { state, updateCurrency, resetToDefaults } = useListedit()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Listedit</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="numbers">Numbers</TabsTrigger>
            <TabsTrigger value="valuation">Valuation</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="inputs" className="space-y-6">
            <InputsTab />
          </TabsContent>

          <TabsContent value="numbers" className="space-y-6">
            <NumbersTab />
          </TabsContent>

          <TabsContent value="valuation" className="space-y-6">
            <ValuationTab />
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <AllocationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
