'use client'

import React from 'react'
import { ListeditProvider } from '@/contexts/ListeditContext'
import Presentation from '@/components/presentation/Presentation'

export default function Home() {
  return (
    <ListeditProvider>
      <main className="min-h-screen bg-background text-foreground">
        <Presentation />
      </main>
    </ListeditProvider>
  )
}
