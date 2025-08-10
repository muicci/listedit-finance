'use client'

import React from 'react'

export default function Slide({
  html,
  title,
  subtitle,
  className = '',
}: {
  html?: string
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div
      className={`w-full max-w-[1280px] min-h-[720px] bg-white mx-auto p-8 box-border flex items-center justify-center ${className}`}
      style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)', borderRadius: 8 }}
      aria-label={title || 'slide'}
    >
      <div className="w-full h-full overflow-hidden">
        {title && (
          <div className="mb-4">
            <h2
              className="text-4xl md:text-5xl font-semibold"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {title}
            </h2>
          </div>
        )}
        {subtitle && <div className="mb-6 text-lg text-muted-foreground">{subtitle}</div>}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: html || '' }}
        />
      </div>
    </div>
  )
}
