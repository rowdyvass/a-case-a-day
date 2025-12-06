'use client'

interface RadarData {
  factors: string[]
  colors?: string[]
}

interface RadarDiagramProps {
  data: RadarData
}

export function RadarDiagram({ data }: RadarDiagramProps) {
  const { factors, colors } = data
  const defaultColors = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6']
  const factorColors = colors || defaultColors

  const numFactors = factors.length
  const centerX = 150
  const centerY = 150
  const radius = 100

  // Calculate positions for each factor
  const positions = factors.map((_, i) => {
    const angle = (i * 2 * Math.PI) / numFactors - Math.PI / 2
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      labelX: centerX + (radius + 40) * Math.cos(angle),
      labelY: centerY + (radius + 40) * Math.sin(angle)
    }
  })

  // Create hexagon path
  const hexPath = positions.map((pos, i) => 
    `${i === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`
  ).join(' ') + ' Z'

  // Create inner rings
  const rings = [0.33, 0.66, 1]

  return (
    <div className="flex justify-center py-4">
      <svg viewBox="0 0 300 300" className="w-full max-w-md">
        {/* Background rings */}
        {rings.map((scale, i) => {
          const ringPath = positions.map((pos, j) => {
            const x = centerX + (pos.x - centerX) * scale
            const y = centerY + (pos.y - centerY) * scale
            return `${j === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ') + ' Z'
          return (
            <path
              key={i}
              d={ringPath}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          )
        })}

        {/* Lines from center to each point */}
        {positions.map((pos, i) => (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Factor labels with colored dots */}
        {factors.map((factor, i) => {
          const pos = positions[i]
          const textAnchor = pos.labelX < centerX - 20 ? 'end' : pos.labelX > centerX + 20 ? 'start' : 'middle'
          const dy = pos.labelY < centerY - 20 ? '-0.5em' : pos.labelY > centerY + 20 ? '1em' : '0.3em'
          
          return (
            <g key={i}>
              <circle
                cx={pos.labelX}
                cy={pos.labelY}
                r="6"
                fill={factorColors[i % factorColors.length]}
              />
              <text
                x={pos.labelX + (textAnchor === 'start' ? 12 : textAnchor === 'end' ? -12 : 0)}
                y={pos.labelY}
                textAnchor={textAnchor}
                dy={dy}
                className="text-xs fill-slate-600 font-medium"
              >
                {factor}
              </text>
            </g>
          )
        })}

        {/* Center dot */}
        <circle cx={centerX} cy={centerY} r="4" fill="#64748b" />
      </svg>
    </div>
  )
}


