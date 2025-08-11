export type Currency = 'AUD' | 'NZD' | 'USD'

export interface ListeditState {
  // General Settings
  currency: Currency
  numberOfAgents: number
  
  // Revenue Drivers
  dealsPerYearTop: number
  dealsPerYearLow: number
  topPerformerRatio: number
  avgPropertyValue: number
  commissionRate: number
  topSegmentUplift: number
  lowSegmentUplift: number
  
  // Software & Services Costs
  baselineSoftwarePercent: number
  softwareReplacePercent: number
  listeditPricePerAgent: number
  
  // Repetitive Tasks
  hoursPerWeekPerAgent: number
  costPerHour: number
  afterTimePercent: number
  
  // Human Costs
  assistantPerAgent: number
  marketingPerAgent: number
  humanReplacePercent: number
  
  // Valuation
  payingClients: number
  annualPricePerClient: number
  arrMultiple: number
  samPercent: number
  somPercent: number
  
  // Allocation
  allocationTeam: number
  allocationRnD: number
  allocationPartnerships: number
  allocationInfrastructure: number
  allocationCompliance: number
  allocationSales: number
  allocationBuffer: number
}

export interface CalculatedMetrics {
  // Agent distribution
  topAgents: number
  lowAgents: number
  
  // Revenue calculations
  revenueTopBefore: number
  revenueLowBefore: number
  revenueTotalBefore: number
  revenueTopAfter: number
  revenueLowAfter: number
  revenueTotalAfter: number
  
  // Cost calculations
  softwareCostBefore: number
  softwareCostAfter: number
  repetitiveCostBefore: number
  repetitiveCostAfter: number
  humanCostBefore: number
  humanCostAfter: number
  totalCostBefore: number
  totalCostAfter: number
  
  // Profit calculations
  profitBefore: number
  profitAfter: number
  profitMarginBefore: number
  profitMarginAfter: number
  
  // Valuation calculations
  tam: number
  sam: number
  som: number
  arr: number
  valuation: number
  
  // Savings
  costSavings: number
  revenuIncrease: number
  totalBenefit: number
}

export interface AgentCounts {
  NZ: number
  AUS: number
  CAN: number
  UK: number
  US: number
  Ireland: number
}

export const AGENT_COUNTS: AgentCounts = {
  NZ: 16051,
  AUS: 142000,
  CAN: 160000,
  UK: 18700,
  US: 1500000,
  Ireland: 6200
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  AUD: 'A$',
  NZD: 'NZ$',
  USD: '$'
}

export const DEFAULT_STATE: ListeditState = {
  // General Settings
  currency: 'AUD',
  numberOfAgents: 200,
  
  // Revenue Drivers
  dealsPerYearTop: 25,
  dealsPerYearLow: 3,
  topPerformerRatio: 5,
  avgPropertyValue: 850000,
  commissionRate: 4,
  topSegmentUplift: 10,
  lowSegmentUplift: 35,
  
  // Software & Services Costs
  baselineSoftwarePercent: 10,
  softwareReplacePercent: 50,
  listeditPricePerAgent: 5000,
  
  // Repetitive Tasks
  hoursPerWeekPerAgent: 20,
  costPerHour: 45,
  afterTimePercent: 30,
  
  // Human Costs
  assistantPerAgent: 12000,
  marketingPerAgent: 6000,
  humanReplacePercent: 100,
  
  // Valuation
  payingClients: 200,
  annualPricePerClient: 5000,
  arrMultiple: 15,
  samPercent: 50,
  somPercent: 10,
  
  // Allocation
  allocationTeam: 40,
  allocationRnD: 20,
  allocationPartnerships: 5,
  allocationInfrastructure: 10,
  allocationCompliance: 5,
  allocationSales: 15,
  allocationBuffer: 5
}
