'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Slide from './Slide'
import FinancialChart from './FinancialChart'
import { Button } from '@/components/ui/button'
import { ListeditDashboard } from '@/components/ListeditDashboard'

const slidesData = [
  {
    id: 1,
    title: 'LISTEDIT',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;">
        <div style="width:760px;max-width:84%;margin-bottom:20px;">
          <img src="/listedit-logo.svg" alt="Listedit logo" style="width:100%;height:auto;display:block;object-fit:contain;" onerror="this.style.display='none'"/>
        </div>
        <div style="width:40px;height:4px;background:var(--primary,#000);margin:14px 0;border-radius:2px;"></div>
        <div style="font-family:Inter, sans-serif;color:#333;font-size:28px;max-width:900px;text-align:center;margin-top:12px;">
          Transforming Real Estate Sales with Agentic AI
        </div>
        <div style="font-family:Montserrat, sans-serif;color:#666;font-size:14px;font-weight:500;letter-spacing:1px;margin-top:18px;text-align:center;">
          PREPARED FOR TREMAINS REAL ESTATE AGENCY
        </div>
        <div style="font-family:Inter;color:#999;font-size:13px;margin-top:6px;text-align:center;">
          August 2025
        </div>
      </div>
    `,
  },
  {
    id: 2,
    title: 'The Vision',
    html: `
      <div style="padding:0 40px;">
        <div style="font-family:Montserrat, sans-serif;font-size:48px;font-weight:600;margin-bottom:12px;">The Vision</div>
        <div style="width:40px;height:4px;background:#000;margin:20px 0;"></div>
        <div style="max-width:900px;">
          <h3 style="font-family:Montserrat;font-size:28px;margin-bottom:8px;">Transforming Real Estate Through AI</h3>
          <p style="font-family:Inter;font-size:20px;color:#333;">Listedit replaces manual tasks with AI agents that execute your proven sales process 24/7, allowing agents to focus on high-value client interactions.</p>
          <h3 style="font-family:Montserrat;font-size:28px;margin-top:28px;margin-bottom:8px;">Addressing Core Industry Challenges</h3>
          <p style="font-family:Inter;font-size:20px;color:#333;">
            <strong>Automate follow-up</strong> across all channels, ensuring no lead falls through the cracks.<br/><br/>
            <strong>Eliminate administrative burden</strong> by handling repetitive tasks and paperwork.<br/><br/>
            <strong>Increase revenue</strong> while significantly reducing operational costs.
          </p>
        </div>
      </div>
    `,
  },
  {
    id: 3,
    title: 'The Performance Gap',
    html: `
      <div style="display:flex;gap:40px;align-items:flex-start;">
        <div style="flex:1">
          <div style="font-family:Montserrat;font-size:72px;font-weight:700;">20%</div>
          <div style="font-family:Inter;font-size:20px;color:#333;">
            Top agents handle <strong>65% of all transactions</strong>, creating a massive productivity gap in real estate agencies.
          </div>
          <p style="font-family:Inter;margin-top:20px;color:#333;">Most agents could perform better if they followed proven processes – but in practice, they often don't follow through on required tasks.</p>
        </div>
        <div style="flex:1">
          <img src="https://private-us-east-1.manuscdn.com/sessionFile/tIa20FjOkPFzgtVnBlASuP/sandbox/slides_resource_in7yykvs484wxki28mczy-6d9282e2-e2b-prod-aws_1754804359626_na1fn_L2hvbWUvdWJ1bnR1L3Byb2R1Y3Rpdml0eV9jaGFydA.png" alt="Agent Productivity Distribution" style="max-width:100%;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.06);" />
        </div>
      </div>
    `,
  },
  {
    id: 4,
    title: 'The Follow-Up Gap',
    html: `
      <div>
        <div style="font-family:Montserrat;font-size:48px;font-weight:600;margin-bottom:12px;">The Follow-Up Gap</div>
        <div style="width:40px;height:4px;background:#000;margin:20px 0;"></div>
        <p style="font-family:Inter;font-size:24px;color:#333;max-width:900px;">
          Despite spending heavily on lead generation, agencies lose most potential revenue due to <strong>inconsistent follow-up practices</strong>.
        </p>
        <div style="display:flex;gap:20px;margin-top:40px;">
          <div style="flex:1;text-align:center;">
            <div style="font-family:Montserrat;font-size:72px;font-weight:700;">49%</div>
            <div style="font-family:Inter;color:#333;">of agents never follow up beyond initial contact</div>
          </div>
          <div style="flex:1;text-align:center;">
            <div style="font-family:Montserrat;font-size:72px;font-weight:700;">25%</div>
            <div style="font-family:Inter;color:#333;">make only a second follow-up call</div>
          </div>
          <div style="flex:1;text-align:center;">
            <div style="font-family:Montserrat;font-size:48px;font-weight:700;">5+</div>
            <div style="font-family:Inter;color:#333;">touches needed for optimal conversion</div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 5,
    title: 'Hidden Costs to Agencies',
    html: `
      <div style="display:flex;gap:40px;">
        <div style="flex:1;">
          <div style="font-family:Montserrat;font-size:48px;font-weight:700;margin-bottom:12px;">Hidden Costs to Agencies</div>
          <div style="width:40px;height:4px;background:#000;margin:20px 0;"></div>
          <div style="margin-top:12px;">
            <div style="font-family:Montserrat;font-size:48px;font-weight:700;">50%</div>
            <div style="font-family:Inter;color:#333;margin-bottom:18px;">of leads never receive follow-up beyond initial contact</div>
            <div style="font-family:Montserrat;font-size:48px;font-weight:700;">$32K+</div>
            <div style="font-family:Inter;color:#333;margin-top:8px;">annual cost per agent for administrative support</div>
          </div>
        </div>
        <div style="flex:1;">
          <img src="https://private-us-east-1.manuscdn.com/sessionFile/tIa20FjOkPFzgtVnBlASuP/sandbox/slides_resource_in7yykvs484wxki28mczy-6d9282e2-e2b-prod-aws_1754804387966_na1fn_L2hvbWUvdWJ1bnR1L2ZvbGxvd3VwX2NoYXJ0.png" alt="Lead Follow-up Statistics" style="max-width:100%;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.06);" />
        </div>
      </div>
    `,
  },
  {
    id: 6,
    title: 'Administrative Burden',
    html: `
      <div style="display:flex;gap:28px;align-items:flex-start;">
        <div style="flex:1;">
          <div style="font-family:Montserrat;font-size:72px;font-weight:700;">40%</div>
          <div style="font-family:Inter;color:#333;margin-top:8px;">of agent productive time is consumed by administrative tasks</div>
          <p style="font-family:Inter;margin-top:20px;color:#333;">Agents are burdened with repetitive administrative tasks that consume valuable time they could spend on high-value client interactions and closing deals.</p>
        </div>
        <div style="flex:1;">
          <!-- We will replace this with a Chart component when rendering if desired -->
          <div style="height:300px;">
            <canvas id="timeAllocationChart" style="max-width:100%;"></canvas>
          </div>
        </div>
      </div>
    `,
    // mark as chart slide so we can mount a chart in-place if needed
    kind: 'chart',
    chart: {
      labels: ['Administrative Tasks', 'Lead Generation', 'Client Interactions'],
      datasets: [
        { label: 'Time Allocation (%)', data: [40, 30, 30], backgroundColor: '#0D1C17' },
      ],
      height: 300,
    },
  },
  {
    id: 7,
    title: 'The Solution',
    html: `
      <div style="display:flex;gap:36px;">
        <div style="flex:1;">
          <div style="font-family:Montserrat;font-size:48px;font-weight:600;margin-bottom:12px;">The Solution</div>
          <div style="width:40px;height:4px;background:#000;margin:20px 0;"></div>
          <p style="font-family:Inter;color:#333;">Listedit's AI platform automates repetitive tasks and ensures consistent follow-up across multiple channels, effectively serving as a tireless virtual team member for every agent.</p>
          <h4 style="font-family:Montserrat;margin-top:20px;">24/7 AI-Powered Outreach</h4>
          <p style="font-family:Inter;">Makes human-like calls, sends personalized emails and messages without ever taking a break.</p>
          <h4 style="font-family:Montserrat;margin-top:12px;">Structured Sales Process</h4>
          <p style="font-family:Inter;">Follows your agency's proven sales playbook with perfect consistency across all leads.</p>
        </div>
        <div style="flex:1;">
          <img src="https://private-us-east-1.manuscdn.com/sessionFile/tIa20FjOkPFzgtVnBlASuP/sandbox/slides_resource_in7yykvs484wxki28mczy-6d9282e2-e2b-prod-aws_1754804488462_na1fn_L2hvbWUvdWJ1bnR1L2xpc3RlZGl0X3NvbHV0aW9u.png" alt="Listedit AI Solution" style="max-width:100%;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.06);" />
        </div>
      </div>
    `,
  },
  {
    id: 8,
    title: 'Your AI Team',
    html: `
      <div>
        <h2 style="font-family:Playfair Display, serif;font-size:36px;margin-bottom:12px;">Your AI Team: Multiple Specialized Agents Working Together</h2>
        <div style="width:40px;height:4px;background:#000;margin:20px 0;"></div>
        <div style="font-family:Inter;color:#333;max-width:1000px;">
          <p>Listedit provides a complete team of AI agents, each with specific responsibilities, working in harmony under the real estate agent's direction.</p>
        </div>
        <div style="margin-top:20px;">
          <img src="https://private-us-east-1.manuscdn.com/sessionFile/tIa20FjOkPFzgtVnBlASuP/sandbox/slides_resource_in7yykvs484wxki28mczy-6d9282e2-e2b-prod-aws_1754804894552_na1fn_L2hvbWUvdWJ1bnR1L2FpX3RlYW1fc3RydWN0dXJl.png" alt="AI Team Structure" style="max-width:100%;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.06);" />
        </div>
      </div>
    `,
  },
  {
    id: 9,
    title: 'Automated Multi-Channel Follow-Up',
    html: `
      <div style="display:flex;gap:28px;">
        <div style="flex:1;">
          <h2 style="font-family:Playfair Display, serif;font-size:28px;">Automated Multi-Channel Follow-Up Increases Conversion by 60%</h2>
          <div style="margin-top:12px;background:#F5F5F5;padding:12px;border-left:4px solid #5B8C85;">
            <p style="margin:0;">Listedit's AI agents execute a structured communication strategy across multiple channels, ensuring no lead falls through the cracks.</p>
          </div>
          <div style="margin-top:20px;">
            <h3 style="font-family:Montserrat;">How the AI Follow-Up System Works</h3>
            <ol style="margin-left:18px;">
              <li><strong>Lead Capture & Analysis</strong> — AI immediately processes new leads and determines optimal contact strategy</li>
              <li><strong>Multi-Channel Engagement</strong> — Automated outreach via phone calls, emails, SMS, and WhatsApp</li>
              <li><strong>Persistent Follow-Through</strong> — Continues the 5+ touches needed for conversion</li>
              <li><strong>Qualification & Handoff</strong> — Qualified leads are prioritized and handed to human agents</li>
            </ol>
          </div>
        </div>
        <div style="flex:1;">
          <img src="https://private-us-east-1.manuscdn.com/sessionFile/tIa20FjOkPFzgtVnBlASuP/sandbox/slides_resource_in7yykvs484wxki28mczy-6d9282e2-e2b-prod-aws_1754804570874_na1fn_L2hvbWUvdWJ1bnR1L211bHRpY2hhbm5lbF9mbG93.png" alt="Multi-Channel Communication Flow" style="max-width:100%;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.06);" />
        </div>
      </div>
    `,
  },
  {
    id: 12,
    title: 'Implementation Results',
    html: `
      <div style="display:flex;gap:24px;">
        <div style="flex:1;">
          <h2 style="font-family:Playfair Display,serif;font-size:28px;">Implementation Results: Transformative Impact on Agency Performance</h2>
          <div style="background:#F5F7F6;padding:12px;border-left:4px solid #1A442D;margin-top:8px;">
            <p style="margin:0;">Listedit delivers dramatic improvements across all key performance metrics, fundamentally transforming how real estate agencies operate.</p>
          </div>
          <div style="margin-top:20px;background:#fff;padding:12px;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.04);">
            <p style="font-style:italic;">"Listedit has completely transformed our business model..." — Regional Sales Director</p>
          </div>
        </div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:28px;margin-bottom:12px;">Transformative Results</div>
          <ul>
            <li><strong>5×</strong> Manual Task Reduction</li>
            <li><strong>+15%</strong> Top Performer Boost</li>
            <li><strong>+45%</strong> Low Performer Improvement</li>
            <li><strong>-50%</strong> Software/Service Costs</li>
          </ul>
          <p style="margin-top:12px;">Implementation time: <strong>Just 2 weeks</strong> from onboarding to full operation</p>
        </div>
      </div>
    `,
  },
  {
    id: 13,
    title: 'Meet the Listedit Team',
    html: `
      <div style="text-align:center;">
        <h2 style="font-family:Playfair Display,serif;font-size:28px;margin-bottom:8px;">Meet the Listedit Team</h2>
        <div style="background:#F5F7F6;padding:12px;border-left:4px solid #1A442D;margin:12px auto;max-width:800px;">
          <p style="margin:0;">Our team combines expertise in real estate, artificial intelligence, and enterprise software to deliver a transformative solution for the industry.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1000px;margin:18px auto;">
          <div>
            <div style="width:100px;height:100px;border-radius:50%;background:#F5F7F6;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-user" /></div>
            <div style="font-weight:700;">Sarah Johnson</div>
            <div style="color:#666;">CEO & Co-Founder</div>
          </div>
          <div>
            <div style="width:100px;height:100px;border-radius:50%;background:#F5F7F6;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-user" /></div>
            <div style="font-weight:700;">Michael Chen</div>
            <div style="color:#666;">CTO & Co-Founder</div>
          </div>
          <div>
            <div style="width:100px;height:100px;border-radius:50%;background:#F5F7F6;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-user" /></div>
            <div style="font-weight:700;">David Williams</div>
            <div style="color:#666;">Head of Product</div>
          </div>
        </div>
        <div style="margin-top:12px;background:#F5F7F6;padding:12px;border-radius:6px;display:inline-block;">
          <div style="font-weight:700;">Get in Touch</div>
          <div>contact@listedit.com • +64 21 555 7890 • www.listedit.com</div>
        </div>
      </div>
    `,
  },
  {
    id: 0,
    title: 'Financial Projections',
    kind: 'dashboard',
    html: '',
  },
]

export default function Presentation() {
  const [index, setIndex] = useState(0)
  const total = slidesData.length

  const active = slidesData[index]

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        setIndex((i) => Math.min(total - 1, i + 1))
      } else if (e.key === 'ArrowLeft') {
        setIndex((i) => Math.max(0, i - 1))
      } else if (/^[1-9]$/.test(e.key)) {
        const n = Number(e.key) - 1
        if (n < total) setIndex(n)
      } else if (e.key === '0') {
        // 0 could map to 10
        if (total >= 10) setIndex(9)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total])

  // mount charts after slide renders (for canvas tags in HTML) - we'll render FinancialChart for slides that define chart data
  const chartNode = useMemo(() => {
    if (active.kind && (active.kind === 'chart' || active.kind === 'financial' || active.kind === 'charts')) {
      return active.chart
    }
    return null
  }, [active])

  // Projection state & computed data for the "Financial Projections" slide (id: 14)
  const [projectionScenario, setProjectionScenario] = useState<'best' | 'base' | 'worst'>('base')

  const projectionData = useMemo(() => {
    if (active.kind !== 'projections') return null

    // Projection assumptions (A$ millions)
    const startYear = 2025
    const years = Array.from({ length: 5 }, (_, i) => startYear + i) // 2025-2029
    const startRevenue = 40.928 // from "After" Revenue (A$ millions)
    const startCosts = 5.472 // from "After" Total Costs (A$ millions)

    const rates =
      projectionScenario === 'best'
        ? { rev: 0.15, cost: 0.02 }
        : projectionScenario === 'worst'
        ? { rev: 0.02, cost: 0.02 }
        : { rev: 0.08, cost: -0.05 } // base

    const revenue: number[] = []
    const costs: number[] = []
    const profit: number[] = []

    let r = startRevenue
    let c = startCosts

    for (let i = 0; i < years.length; i++) {
      if (i > 0) {
        r = r * (1 + rates.rev)
        c = c * (1 + rates.cost)
      }
      revenue.push(Number(r.toFixed(3)))
      costs.push(Number(c.toFixed(3)))
      profit.push(Number((r - c).toFixed(3)))
    }

    const totalRevenue = revenue.reduce((a, b) => a + b, 0)
    const totalCosts = costs.reduce((a, b) => a + b, 0)
    const totalProfit = profit.reduce((a, b) => a + b, 0)
    const firstRevenue = revenue[0]
    const lastRevenue = revenue[revenue.length - 1]
    const cagr = firstRevenue > 0 ? (Math.pow(lastRevenue / firstRevenue, 1 / (years.length - 1)) - 1) * 100 : 0

    return {
      labels: years.map(String),
      datasets: [
        { label: 'Revenue (A$ millions)', data: revenue, backgroundColor: '#0D1C17', borderColor: '#0D1C17' },
        { label: 'Total Costs (A$ millions)', data: costs, backgroundColor: '#D04848', borderColor: '#D04848' },
        { label: 'Profit (A$ millions)', data: profit, backgroundColor: '#1A442D', borderColor: '#1A442D' },
      ],
      summary: {
        totalRevenue,
        totalCosts,
        totalProfit,
        cagr,
        firstRevenue,
        lastRevenue,
      },
    }
  }, [active, projectionScenario])

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between bg-background text-foreground py-8">
      <div className="w-full flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[1280px]">
          <div
            key={active.id}
            className="transition-all duration-400 ease-in-out"
            aria-live="polite"
          >
            {active.kind === 'dashboard' ? (
              <div className="w-full">
                <ListeditDashboard />
              </div>
            ) : (
              <>
                <Slide title={active.title} html={active.html} />
                {/* If this slide has chart data, render a FinancialChart below the slide area so it visually replaces the canvas */}
                {chartNode && (
                  <div className="max-w-[1280px] mx-auto mt-4">
                    {/* if financial type: render datasets as provided */}
                    <FinancialChart
                      labels={chartNode.labels}
                      datasets={chartNode.datasets.map((d: any) => ({
                        label: d.label,
                        data: d.data,
                        backgroundColor: d.backgroundColor,
                        borderColor: d.backgroundColor,
                      }))}
                      height={chartNode.height || 320}
                    />
                  </div>
                )}
              </>
            )}

            {/* Financial projections interactive chart */}
            {active.kind === 'projections' && projectionData && (
              <div className="max-w-[1280px] mx-auto mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium" htmlFor="scenario-select">Scenario:</label>
                    <select
                      id="scenario-select"
                      className="border px-2 py-1 rounded text-sm"
                      value={projectionScenario}
                      onChange={(e) => setProjectionScenario(e.target.value as 'best' | 'base' | 'worst')}
                    >
                      <option value="best">Best</option>
                      <option value="base">Base</option>
                      <option value="worst">Worst</option>
                    </select>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    CAGR: {projectionData.summary.cagr.toFixed(1)}% · Total Profit: A${projectionData.summary.totalProfit.toLocaleString()}
                  </div>
                </div>

                <FinancialChart
                  labels={projectionData.labels}
                  datasets={projectionData.datasets.map((d: any) => ({
                    label: d.label,
                    data: d.data,
                    backgroundColor: d.backgroundColor,
                    borderColor: d.borderColor || d.backgroundColor,
                  }))}
                  chartType="line"
                  height={420}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mt-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" size="sm" onClick={() => setIndex((i) => Math.max(0, i - 1))} aria-label="Previous slide">
              ‹ Prev
            </Button>
          </div>

            <div className="flex items-center gap-2 overflow-x-auto px-2 scrollbar-hide">
            {slidesData.map((s, i) => (
              <Button
                key={s.id}
                size="sm"
                variant={i === index ? 'default' : 'ghost'}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                title={s.title}
                className={i === index ? 'shadow-md' : ''}
              >
                <span className="hidden sm:inline">{i + 1} — {s.title}</span>
                <span className="sm:hidden">{i + 1}</span>
              </Button>
            ))}
          </div>

          <div>
            <Button variant="outline" size="sm" onClick={() => setIndex((i) => Math.min(total - 1, i + 1))} aria-label="Next slide">
              Next ›
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
