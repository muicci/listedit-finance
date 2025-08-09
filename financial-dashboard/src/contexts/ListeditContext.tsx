'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { ListeditState, CalculatedMetrics, DEFAULT_STATE, Currency } from '@/types/listedit'
import { calculateMetrics } from '@/lib/calculations'

interface ListeditContextType {
  state: ListeditState
  metrics: CalculatedMetrics
  updateState: (updates: Partial<ListeditState>) => void
  updateCurrency: (currency: Currency) => void
  updateAllocation: (field: string, value: number) => void
  resetToDefaults: () => void
}

const ListeditContext = createContext<ListeditContextType | undefined>(undefined)

type Action = 
  | { type: 'UPDATE_STATE'; payload: Partial<ListeditState> }
  | { type: 'UPDATE_CURRENCY'; payload: Currency }
  | { type: 'UPDATE_ALLOCATION'; payload: { field: string; value: number } }
  | { type: 'RESET_TO_DEFAULTS' }

function listeditReducer(state: ListeditState, action: Action): ListeditState {
  switch (action.type) {
    case 'UPDATE_STATE':
      return { ...state, ...action.payload }
    
    case 'UPDATE_CURRENCY':
      return { ...state, currency: action.payload }
    
    case 'UPDATE_ALLOCATION': {
      const { field, value } = action.payload
      
      // Round value to 4 decimal places
      const roundedValue = Math.round(value * 10000) / 10000
      
      // Calculate remaining percentage to distribute
      const remaining = 100 - roundedValue
      const allocationFields = {
        allocationTeam: state.allocationTeam,
        allocationRnD: state.allocationRnD,
        allocationPartnerships: state.allocationPartnerships,
        allocationInfrastructure: state.allocationInfrastructure,
        allocationCompliance: state.allocationCompliance,
        allocationSales: state.allocationSales,
        allocationBuffer: state.allocationBuffer
      }
      
      const otherFields = Object.keys(allocationFields).filter(f => f !== field)
      const otherTotal = otherFields.reduce((sum, f) => sum + allocationFields[f as keyof typeof allocationFields], 0)
      
      const newAllocation = { ...allocationFields, [field]: roundedValue }
      
      if (otherTotal === 0) {
        // Distribute equally among other fields
        const equalShare = remaining / otherFields.length
        otherFields.forEach(f => {
          newAllocation[f as keyof typeof allocationFields] = equalShare
        })
      } else {
        // Proportionally adjust other fields
        const ratio = remaining / otherTotal
        otherFields.forEach(f => {
          newAllocation[f as keyof typeof allocationFields] = allocationFields[f as keyof typeof allocationFields] * ratio
        })
      }
      
      return { ...state, ...newAllocation }
    }
    
    case 'RESET_TO_DEFAULTS':
      return { ...DEFAULT_STATE }
    
    default:
      return state
  }
}

interface ListeditProviderProps {
  children: ReactNode
}

import { useEffect } from 'react'

export function ListeditProvider({ children }: ListeditProviderProps) {
  const [state, dispatch] = useReducer(listeditReducer, DEFAULT_STATE)
  const metrics = calculateMetrics(state)

  useEffect(() => {
    dispatch({ type: 'UPDATE_CURRENCY', payload: 'AUD' })
  }, [])

  const updateState = (updates: Partial<ListeditState>) => {
    dispatch({ type: 'UPDATE_STATE', payload: updates })
  }

  const updateCurrency = (currency: Currency) => {
    dispatch({ type: 'UPDATE_CURRENCY', payload: currency })
  }

  const updateAllocation = (field: string, value: number) => {
    dispatch({ type: 'UPDATE_ALLOCATION', payload: { field, value } })
  }

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_TO_DEFAULTS' })
  }

  const value: ListeditContextType = {
    state,
    metrics,
    updateState,
    updateCurrency,
    updateAllocation,
    resetToDefaults
  }

  return (
    <ListeditContext.Provider value={value}>
      {children}
    </ListeditContext.Provider>
  )
}

export function useListedit(): ListeditContextType {
  const context = useContext(ListeditContext)
  if (context === undefined) {
    throw new Error('useListedit must be used within a ListeditProvider')
  }
  return context
}
