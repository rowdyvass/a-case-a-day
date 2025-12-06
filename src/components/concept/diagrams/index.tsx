'use client'

import { MatrixDiagram } from './MatrixDiagram'
import { FlowDiagram } from './FlowDiagram'
import { PyramidDiagram } from './PyramidDiagram'
import { FunnelDiagram } from './FunnelDiagram'
import { RadarDiagram } from './RadarDiagram'
import { CustomDiagram } from './CustomDiagram'

interface DiagramRendererProps {
  type: string
  data: Record<string, unknown>
  category: string
}

export function DiagramRenderer({ type, data, category }: DiagramRendererProps) {
  switch (type) {
    case 'matrix':
      return <MatrixDiagram data={data as Parameters<typeof MatrixDiagram>[0]['data']} />
    
    case 'flow':
      return <FlowDiagram data={data as Parameters<typeof FlowDiagram>[0]['data']} category={category} />
    
    case 'pyramid':
      return <PyramidDiagram data={data as Parameters<typeof PyramidDiagram>[0]['data']} />
    
    case 'funnel':
      return <FunnelDiagram data={data as Parameters<typeof FunnelDiagram>[0]['data']} />
    
    case 'radar':
      return <RadarDiagram data={data as Parameters<typeof RadarDiagram>[0]['data']} />
    
    case 'custom':
    default:
      return <CustomDiagram data={data} category={category} />
  }
}

export { MatrixDiagram } from './MatrixDiagram'
export { FlowDiagram } from './FlowDiagram'
export { PyramidDiagram } from './PyramidDiagram'
export { FunnelDiagram } from './FunnelDiagram'
export { RadarDiagram } from './RadarDiagram'
export { CustomDiagram } from './CustomDiagram'


