'use client'

import React from 'react'
import Presentation from '@/components/presentation/Presentation'
import { ListeditProvider } from '@/contexts/ListeditContext'

export default function PresentationPage() {
  return (
    <ListeditProvider>
      <main className="min-h-screen bg-background text-foreground">
        <Presentation />
      </main>
    </ListeditProvider>
  )
}
