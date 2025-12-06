'use client'

interface CustomDiagramProps {
  data: Record<string, unknown>
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

export function CustomDiagram({ data, category }: CustomDiagramProps) {
  const accentColor = categoryColors[category] || '#8b5cf6'
  const type = data.type as string

  // Network Effects Curve
  if (type === 'networkEffectCurve') {
    const phases = data.phases as { name: string; users: string; value: string; growth: string }[]
    return (
      <div className="space-y-4">
        <div className="relative h-48 bg-slate-50 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path
              d="M 0 180 Q 100 170 150 140 Q 200 100 250 40 Q 300 20 400 15"
              fill="none"
              stroke={accentColor}
              strokeWidth="3"
            />
            <text x="10" y="190" className="text-xs fill-slate-500">Users</text>
            <text x="370" y="30" className="text-xs fill-slate-500">Value</text>
          </svg>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {phases?.map((phase, i) => (
            <div key={i} className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="font-semibold text-slate-900 text-sm">{phase.name}</div>
              <div className="text-xs text-slate-500 mt-1">Users: {phase.users}</div>
              <div className="text-xs text-slate-500">Value: {phase.value}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Seven Wastes (Lean)
  if (type === 'sevenWastes') {
    const wastes = data.wastes as { name: string; description: string; icon: string }[]
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {wastes?.map((waste, i) => (
          <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-4 text-center hover:bg-red-100 transition-colors">
            <div className="text-2xl mb-2">
              {waste.icon === 'truck' && '🚚'}
              {waste.icon === 'box' && '📦'}
              {waste.icon === 'move' && '🏃'}
              {waste.icon === 'clock' && '⏰'}
              {waste.icon === 'plus' && '➕'}
              {waste.icon === 'cog' && '⚙️'}
              {waste.icon === 'x' && '❌'}
            </div>
            <div className="font-semibold text-red-800 text-sm">{waste.name}</div>
            <div className="text-xs text-red-600 mt-1">{waste.description}</div>
          </div>
        ))}
      </div>
    )
  }

  // EQ Framework
  if (type === 'eqFramework') {
    const components = data.components as { name: string; category: string; color: string }[]
    const selfComponents = components?.filter(c => c.category === 'Self') || []
    const othersComponents = components?.filter(c => c.category === 'Others') || []
    
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 text-center">Self (Personal)</h4>
          <div className="space-y-2">
            {selfComponents.map((comp, i) => (
              <div 
                key={i} 
                className="py-3 px-4 rounded-lg text-white font-medium text-center"
                style={{ backgroundColor: comp.color }}
              >
                {comp.name}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-700 mb-3 text-center">Social (Others)</h4>
          <div className="space-y-2">
            {othersComponents.map((comp, i) => (
              <div 
                key={i} 
                className="py-3 px-4 rounded-lg text-white font-medium text-center"
                style={{ backgroundColor: comp.color }}
              >
                {comp.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Four I's (Transformational Leadership)
  if (type === 'fourIs') {
    const components = data.components as { name: string; description: string; icon: string }[]
    return (
      <div className="grid grid-cols-2 gap-4">
        {components?.map((comp, i) => (
          <div key={i} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 text-center hover:shadow-md transition-all">
            <div className="text-3xl mb-3">
              {comp.icon === 'star' && '⭐'}
              {comp.icon === 'lightbulb' && '💡'}
              {comp.icon === 'brain' && '🧠'}
              {comp.icon === 'users' && '👥'}
            </div>
            <div className="font-semibold text-slate-900">{comp.name}</div>
            <div className="text-sm text-slate-500 mt-1">{comp.description}</div>
          </div>
        ))}
      </div>
    )
  }

  // Segmentation Types
  if (type === 'segmentationTypes') {
    const segments = data.segments as { type: string; examples: string[]; color: string }[]
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {segments?.map((seg, i) => (
          <div 
            key={i} 
            className="rounded-xl p-5 border-2"
            style={{ borderColor: seg.color, backgroundColor: seg.color + '10' }}
          >
            <div className="font-semibold text-slate-900 mb-3">{seg.type}</div>
            <div className="flex flex-wrap gap-2">
              {seg.examples.map((ex, j) => (
                <span 
                  key={j} 
                  className="text-xs px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: seg.color }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // NPS Scale
  if (type === 'npsScale') {
    const scale = data.scale as number[]
    const categories = data.categories as { name: string; range: number[]; color: string }[]
    
    return (
      <div className="space-y-4">
        <div className="flex gap-1">
          {scale?.map((num) => {
            const category = categories?.find(c => num >= c.range[0] && num <= c.range[1])
            return (
              <div 
                key={num}
                className="flex-1 py-3 text-center text-white font-semibold rounded"
                style={{ backgroundColor: category?.color || '#6b7280' }}
              >
                {num}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-sm">
          {categories?.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-slate-600">{cat.name} ({cat.range[0]}-{cat.range[1]})</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Kanban Board
  if (type === 'kanbanBoard') {
    const columns = data.columns as { name: string; wipLimit: number | null; items: string[] }[]
    return (
      <div className="grid grid-cols-4 gap-3">
        {columns?.map((col, i) => (
          <div key={i} className="bg-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-800 text-sm">{col.name}</h4>
              {col.wipLimit && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  WIP: {col.wipLimit}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {col.items.map((item, j) => (
                <div key={j} className="bg-white p-2 rounded border border-slate-200 text-sm text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Platform Diagram
  if (type === 'platform') {
    const sides = data.sides as { name: string; role: string; icon: string }[]
    const platform = data.platform as { name: string; functions: string[] }
    
    return (
      <div className="flex items-center justify-center gap-4">
        {/* Left Side */}
        <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold text-blue-800">{sides?.[0]?.name}</div>
          <div className="text-xs text-blue-600">{sides?.[0]?.role}</div>
        </div>

        {/* Arrows and Platform */}
        <div className="flex flex-col items-center">
          <div className="text-slate-400">←→</div>
          <div className="my-2 p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
            <div className="font-bold text-amber-800 text-center mb-2">{platform?.name}</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {platform?.functions.map((fn, i) => (
                <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full text-amber-700">
                  {fn}
                </span>
              ))}
            </div>
          </div>
          <div className="text-slate-400">←→</div>
        </div>

        {/* Right Side */}
        <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-3xl mb-2">🏪</div>
          <div className="font-semibold text-green-800">{sides?.[1]?.name}</div>
          <div className="text-xs text-green-600">{sides?.[1]?.role}</div>
        </div>
      </div>
    )
  }

  // Ratio Categories (Financial Ratios)
  if (type === 'ratioCategories') {
    const categories = data.categories as { name: string; ratios: string[]; color: string }[]
    return (
      <div className="grid md:grid-cols-3 gap-3">
        {categories?.map((cat, i) => (
          <div 
            key={i} 
            className="rounded-xl p-4 border-2"
            style={{ borderColor: cat.color, backgroundColor: cat.color + '10' }}
          >
            <div className="font-semibold mb-2" style={{ color: cat.color }}>{cat.name}</div>
            <ul className="space-y-1">
              {cat.ratios.map((ratio, j) => (
                <li key={j} className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {ratio}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  // Strategy Canvas (Blue Ocean)
  if (type === 'strategyCanvas') {
    const factors = data.factors as string[]
    const competitors = data.competitors as { name: string; values: number[]; color: string }[]
    
    return (
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-lg p-4 h-48 relative">
          {/* Simplified strategy canvas visualization */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between">
            {factors?.map((factor, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-slate-500 mb-2 -rotate-45 origin-top-left">{factor}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-6">
          {competitors?.map((comp, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
              <span className="text-sm text-slate-600">{comp.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="text-center py-8 text-slate-500">
      <div className="text-4xl mb-4">📊</div>
      <p className="font-medium">Custom visualization</p>
      <p className="text-sm">Interactive diagram for this concept</p>
    </div>
  )
}


