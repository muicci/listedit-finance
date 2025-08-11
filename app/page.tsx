'use client'

import React from 'react'
import { ListeditProvider } from '@/contexts/ListeditContext'
import ListeditDashboard from '@/components/ListeditDashboard' // dashboard root

export default function Home() {
  return (
    <ListeditProvider>
      <main className="container mx-auto px-4 py-6">
        <ListeditDashboard />
      </main>
    </ListeditProvider>
  )
}