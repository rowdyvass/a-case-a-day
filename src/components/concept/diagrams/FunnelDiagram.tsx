'use client'

interface FunnelStage {
  name: string
  width: number
  color: string
  metrics?: string[]
}

interface FunnelData {
  stages: FunnelStage[]
}

interface FunnelDiagramProps {
  data: FunnelData
}

export function FunnelDiagram({ data }: FunnelDiagramProps) {
  const { stages } = data

  return (
    <div className="flex flex-col items-center py-4 space-y-2">
      {stages.map((stage, i) => (
        <div
          key={i}
          className="relative transition-all hover:scale-[1.02] cursor-default group"
          style={{ width: `${stage.width}%` }}
        >
          <div
            className="py-4 px-6 text-white text-center font-semibold shadow-md"
            style={{ 
              backgroundColor: stage.color,
              clipPath: i === stages.length - 1 
                ? 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)'
                : 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'
            }}
          >
            <div className="text-sm md:text-base">{stage.name}</div>
            {stage.metrics && stage.metrics.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {stage.metrics.map((metric, j) => (
                  <span key={j} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {metric}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}


