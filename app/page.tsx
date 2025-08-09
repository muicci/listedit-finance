'use client'

import React from 'react'
import { ListeditProvider } from '@/contexts/ListeditContext'
import { ListeditDashboard } from '@/components/ListeditDashboard'

export default function Home() {
  return (
    <ListeditProvider>
      <ListeditDashboard />
    </ListeditProvider>
  )
}
