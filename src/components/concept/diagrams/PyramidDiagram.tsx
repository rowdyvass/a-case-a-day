'use client'

interface PyramidLevel {
  label: string
  description?: string
  color: string
}

interface PyramidData {
  levels: PyramidLevel[]
  inverted?: boolean
}

interface PyramidDiagramProps {
  data: PyramidData
}

export function PyramidDiagram({ data }: PyramidDiagramProps) {
  const { levels, inverted } = data
  const displayLevels = inverted ? [...levels].reverse() : levels

  return (
    <div className="flex flex-col items-center py-4">
      {displayLevels.map((level, i) => {
        // Calculate width percentage based on position
        const totalLevels = levels.length
        const position = inverted ? totalLevels - i : i + 1
        const widthPercent = inverted 
          ? 40 + (position / totalLevels) * 50  // Inverted: wider at top
          : 40 + ((totalLevels - position + 1) / totalLevels) * 50  // Normal: wider at bottom

        return (
          <div
            key={i}
            className="relative transition-all hover:scale-[1.02] cursor-default group"
            style={{ width: `${widthPercent}%` }}
          >
            <div
              className="py-4 px-6 text-white text-center font-semibold rounded-lg mb-1 shadow-md"
              style={{ backgroundColor: level.color }}
            >
              <div className="text-sm md:text-base">{level.label}</div>
              {level.description && (
                <div className="text-xs opacity-80 mt-1 font-normal">{level.description}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}


