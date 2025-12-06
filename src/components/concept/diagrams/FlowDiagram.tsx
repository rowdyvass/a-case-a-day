'use client'

import { ArrowRight, ArrowDown } from 'lucide-react'

interface FlowNode {
  name?: string
  label?: string
  description?: string
  color?: string
  step?: number
  items?: string[]
  tools?: string[]
}

interface FlowData {
  type?: string
  steps?: FlowNode[]
  phases?: FlowNode[]
  centerNode?: FlowNode & { label: string }
  surroundingNodes?: (FlowNode & { label: string; position: string; arrow?: string })[]
  primaryActivities?: FlowNode[]
  supportActivities?: FlowNode[]
  margin?: string
}

interface FlowDiagramProps {
  data: FlowData
  category: string
}

const categoryColors: Record<string, string> = {
  Strategy: '#8b5cf6',
  Finance: '#3b82f6',
  Marketing: '#ec4899',
  Operations: '#f97316',
  Leadership: '#14b8a6',
  Economics: '#6366f1'
}

export function FlowDiagram({ data, category }: FlowDiagramProps) {
  const accentColor = categoryColors[category] || '#8b5cf6'

  // Porter's Five Forces style (center with surrounding)
  if (data.centerNode && data.surroundingNodes) {
    return (
      <div className="relative py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Top node */}
          {data.surroundingNodes.filter(n => n.position === 'top').map((node, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className="px-6 py-3 rounded-lg text-white font-semibold text-center"
                style={{ backgroundColor: node.color || accentColor }}
              >
                {node.label}
              </div>
              <ArrowDown className="h-6 w-6 text-slate-400 my-2" />
            </div>
          ))}

          {/* Middle row: Left - Center - Right */}
          <div className="flex items-center gap-4 w-full justify-center">
            {/* Left nodes */}
            {data.surroundingNodes.filter(n => n.position === 'left').map((node, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className="px-6 py-3 rounded-lg text-white font-semibold text-center"
                  style={{ backgroundColor: node.color || accentColor }}
                >
                  {node.label}
                </div>
                <ArrowRight className="h-6 w-6 text-slate-400 mx-2" />
              </div>
            ))}

            {/* Center */}
            <div 
              className="px-8 py-6 rounded-xl text-white font-bold text-lg text-center shadow-lg"
              style={{ backgroundColor: data.centerNode.color || accentColor }}
            >
              {data.centerNode.label}
            </div>

            {/* Right nodes */}
            {data.surroundingNodes.filter(n => n.position === 'right').map((node, i) => (
              <div key={i} className="flex items-center">
                <ArrowRight className="h-6 w-6 text-slate-400 mx-2 rotate-180" />
                <div 
                  className="px-6 py-3 rounded-lg text-white font-semibold text-center"
                  style={{ backgroundColor: node.color || accentColor }}
                >
                  {node.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom node */}
          {data.surroundingNodes.filter(n => n.position === 'bottom').map((node, i) => (
            <div key={i} className="flex flex-col items-center">
              <ArrowDown className="h-6 w-6 text-slate-400 my-2 rotate-180" />
              <div 
                className="px-6 py-3 rounded-lg text-white font-semibold text-center"
                style={{ backgroundColor: node.color || accentColor }}
              >
                {node.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Value Chain style
  if (data.primaryActivities && data.supportActivities) {
    return (
      <div className="space-y-4">
        {/* Support Activities */}
        <div className="bg-slate-100 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Support Activities</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.supportActivities.map((activity, i) => (
              <div key={i} className="bg-white px-3 py-2 rounded text-sm text-slate-700 text-center">
                {activity.name}
              </div>
            ))}
          </div>
        </div>

        {/* Primary Activities */}
        <div className="flex items-center gap-0">
          {data.primaryActivities.map((activity, i) => (
            <div key={i} className="flex items-center flex-1">
              <div 
                className="flex-1 py-4 px-3 text-white text-center font-medium text-sm rounded-lg"
                style={{ backgroundColor: activity.color || accentColor }}
              >
                {activity.name}
              </div>
              {i < data.primaryActivities!.length - 1 && (
                <ArrowRight className="h-5 w-5 text-slate-400 mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
          {data.margin && (
            <>
              <ArrowRight className="h-5 w-5 text-slate-400 mx-2" />
              <div className="py-4 px-4 bg-amber-500 text-white font-bold rounded-lg">
                {data.margin}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Linear flow (steps/phases)
  const items = data.steps || data.phases || []
  if (items.length > 0) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-start gap-3 justify-center">
          {items.map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center max-w-[160px]">
                <div 
                  className="w-full py-3 px-4 rounded-lg text-white font-semibold text-center text-sm"
                  style={{ backgroundColor: item.color || accentColor }}
                >
                  {item.step && <span className="text-xs opacity-75 block mb-1">Step {item.step}</span>}
                  {item.name || item.label}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-500 text-center mt-2">{item.description}</p>
                )}
                {item.items && item.items.length > 0 && (
                  <ul className="text-xs text-slate-500 mt-2 space-y-1">
                    {item.items.map((it, j) => (
                      <li key={j}>• {it}</li>
                    ))}
                  </ul>
                )}
                {item.tools && item.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tools.slice(0, 2).map((tool, j) => (
                      <span key={j} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {i < items.length - 1 && (
                <ArrowRight className="h-5 w-5 text-slate-400 mx-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center text-slate-500 py-8">
      Flow diagram visualization
    </div>
  )
}


