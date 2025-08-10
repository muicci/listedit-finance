'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from 'react'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
  Title
)

type Dataset = {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
}

export default function FinancialChart({
  labels,
  datasets,
  options,
  height = 320,
  chartType = 'bar',
}: {
  labels: string[]
  datasets: Dataset[]
  options?: any
  height?: number
  chartType?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // cleanup previous
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    chartRef.current = new (Chart as any)(ctx, {
      type: chartType || 'bar',
      data: {
        labels,
        datasets: datasets.map((d) => ({
          label: d.label,
          data: d.data,
          backgroundColor: d.backgroundColor || '#0D1C17',
          borderColor: d.borderColor || d.backgroundColor || '#0D1C17',
          borderWidth: 1,
          fill: chartType === 'line' ? false : undefined,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const val = context.parsed.y ?? context.parsed
                return typeof val === 'number' ? `A$${val.toLocaleString()}` : val
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                if (typeof value === 'number') return 'A$' + value.toLocaleString()
                return value
              },
            },
          },
        },
        ...(options || {}),
      },
    })

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy()
        } catch (e) {
          // ignore
        }
      }
    }
    // re-create when labels/datasets change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(labels), JSON.stringify(datasets), JSON.stringify(options)])

  return (
    <div style={{ height }} className="w-full">
      <canvas ref={canvasRef} />
    </div>
  )
}
