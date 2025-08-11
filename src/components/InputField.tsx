'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

interface InputFieldProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  tooltip?: string
  type?: 'number' | 'percentage' | 'currency'
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  placeholder?: string
}

export function InputField({
  id,
  label,
  value,
  onChange,
  tooltip,
  type = 'number',
  min,
  max,
  step = 1,
  disabled = false,
  placeholder
}: InputFieldProps) {
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Format number with commas for display
  const formatNumberDisplay = (num: number): string => {
    if (type === 'currency') {
      return num.toLocaleString('en-US')
    }
    return num.toString()
  }

  // Parse formatted number string back to number
  const parseFormattedNumber = (str: string): number => {
    const cleanedStr = str.replace(/[^\d.-]/g, '')
    const parsed = parseFloat(cleanedStr)
    return isNaN(parsed) ? 0 : parsed
  }

  // Update display value when prop value changes
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumberDisplay(value))
    }
  }, [value, isFocused, type])

  // Set initial display value
  useEffect(() => {
    setDisplayValue(formatNumberDisplay(value))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    
    const numericValue = parseFormattedNumber(inputValue)
    
    // Apply min/max constraints
    let constrainedValue = numericValue
    if (min !== undefined && constrainedValue < min) constrainedValue = min
    if (max !== undefined && constrainedValue > max) constrainedValue = max
    
    onChange(constrainedValue)
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Show unformatted value for easier editing
    setDisplayValue(value.toString())
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Format the value when user leaves the field
    setDisplayValue(formatNumberDisplay(value))
  }

  const getSuffix = (): string => {
    if (type === 'percentage') return '%'
    return ''
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="pr-8"
          inputMode="numeric"
        />
        {getSuffix() && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
            {getSuffix()}
          </span>
        )}
      </div>
    </div>
  )
}
