'use client'

interface MatrixCell {
  row: number
  col: number
  label: string
  subtitle?: string
  color: string
  description?: string
  examples?: string[]
  risk?: string
  strategy?: string
  icon?: string
}

interface MatrixData {
  rows: number
  cols: number
  cells: MatrixCell[]
  axes?: {
    x?: { label?: string; positive?: string; negative?: string }
    y?: { label?: string; positive?: string; negative?: string }
  }
}

interface MatrixDiagramProps {
  data: MatrixData
}

export function MatrixDiagram({ data }: MatrixDiagramProps) {
  const { rows, cols, cells, axes } = data

  // Create a grid to position cells
  const grid: (MatrixCell | undefined)[][] = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => undefined)
  )

  cells.forEach(cell => {
    if (cell.row < rows && cell.col < cols) {
      grid[cell.row][cell.col] = cell
    }
  })

  return (
    <div className="space-y-4">
      {/* Y-Axis Label */}
      {axes?.y?.label && (
        <div className="flex items-center justify-center mb-2">
          <div className="text-sm font-medium text-slate-500">
            {axes.y.positive && <span>↑ {axes.y.positive}</span>}
            {axes.y.label && <span className="mx-4 text-slate-700 font-semibold">{axes.y.label}</span>}
            {axes.y.negative && <span>{axes.y.negative} ↓</span>}
          </div>
        </div>
      )}

      <div className="flex items-stretch gap-4">
        {/* Y-Axis Labels */}
        {axes?.y && (
          <div className="flex flex-col justify-between py-4 text-xs text-slate-500 font-medium">
            <span>{axes.y.positive || 'High'}</span>
            <span>{axes.y.negative || 'Low'}</span>
          </div>
        )}

        {/* Matrix Grid */}
        <div className="flex-1">
          <div 
            className="grid gap-3"
            style={{ 
              gridTemplateRows: `repeat(${rows}, minmax(120px, 1fr))`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`
            }}
          >
            {grid.flat().map((cell, idx) => (
              <div
                key={idx}
                className="rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg cursor-default group"
                style={{ backgroundColor: cell?.color + '20', borderColor: cell?.color, borderWidth: '2px' }}
              >
                {cell && (
                  <div className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-lg">{cell.label}</h3>
                      {cell.subtitle && (
                        <span className="text-2xl">{cell.subtitle}</span>
                      )}
                    </div>
                    {cell.description && (
                      <p className="text-sm text-slate-600 mb-2">{cell.description}</p>
                    )}
                    {cell.risk && (
                      <p className="text-xs text-slate-500">Risk: {cell.risk}</p>
                    )}
                    {cell.strategy && (
                      <p className="text-xs text-slate-500">Strategy: {cell.strategy}</p>
                    )}
                    {cell.examples && cell.examples.length > 0 && (
                      <div className="mt-auto pt-2">
                        <div className="flex flex-wrap gap-1">
                          {cell.examples.map((ex, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-white/50 rounded-full text-slate-600">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* X-Axis Labels (Right) */}
        {axes?.x && (
          <div className="flex flex-col justify-between py-4 text-xs text-slate-500 font-medium">
            <span>{axes.x.positive || 'High'}</span>
            <span>{axes.x.negative || 'Low'}</span>
          </div>
        )}
      </div>

      {/* X-Axis Label */}
      {axes?.x?.label && (
        <div className="flex items-center justify-center mt-2">
          <div className="text-sm font-medium text-slate-500">
            {axes.x.negative && <span>← {axes.x.negative}</span>}
            {axes.x.label && <span className="mx-4 text-slate-700 font-semibold">{axes.x.label}</span>}
            {axes.x.positive && <span>{axes.x.positive} →</span>}
          </div>
        </div>
      )}
    </div>
  )
}


