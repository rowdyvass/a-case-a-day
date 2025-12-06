'use client'

import { useExhibitPalette } from '../../ExhibitContext'

/**
 * Annotation
 * 
 * NYT-style callout annotation for highlighting key data points in charts.
 */

interface AnnotationProps {
  x: number | string
  y: number | string
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  showLine?: boolean
  lineLength?: number
  className?: string
}

export function Annotation({
  x,
  y,
  text,
  position = 'top',
  showLine = true,
  lineLength = 30,
  className = '',
}: AnnotationProps) {
  const palette = useExhibitPalette()

  const positionStyles = {
    top: {
      transform: 'translate(-50%, -100%)',
      lineProps: { x1: '50%', y1: '100%', x2: '50%', y2: `calc(100% + ${lineLength}px)` },
    },
    bottom: {
      transform: 'translate(-50%, 0)',
      lineProps: { x1: '50%', y1: 0, x2: '50%', y2: -lineLength },
    },
    left: {
      transform: 'translate(-100%, -50%)',
      lineProps: { x1: '100%', y1: '50%', x2: `calc(100% + ${lineLength}px)`, y2: '50%' },
    },
    right: {
      transform: 'translate(0, -50%)',
      lineProps: { x1: 0, y1: '50%', x2: -lineLength, y2: '50%' },
    },
  }

  return (
    <g className={`chart-annotation ${className}`}>
      {showLine && (
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={typeof y === 'number' ? y - lineLength : y}
          stroke={palette.textMuted}
          strokeWidth={1}
          strokeDasharray="2,2"
        />
      )}
      <foreignObject
        x={typeof x === 'number' ? x - 60 : x}
        y={typeof y === 'number' ? y - lineLength - 24 : y}
        width={120}
        height={48}
        style={{ overflow: 'visible' }}
      >
        <div
          className="chart-annotation-box"
          style={{
            backgroundColor: palette.annotationBg,
            borderColor: palette.border,
          }}
        >
          {text}
        </div>
      </foreignObject>
    </g>
  )
}

/**
 * Callout box for inline annotations (not in SVG)
 */
interface CalloutProps {
  children: React.ReactNode
  variant?: 'default' | 'highlight' | 'warning' | 'success'
  className?: string
}

export function Callout({ 
  children, 
  variant = 'default',
  className = '' 
}: CalloutProps) {
  const palette = useExhibitPalette()

  const variantStyles = {
    default: {
      borderColor: palette.primary,
      backgroundColor: palette.primaryLight,
    },
    highlight: {
      borderColor: palette.accent,
      backgroundColor: palette.accentLight,
    },
    warning: {
      borderColor: palette.neutral,
      backgroundColor: palette.neutralLight,
    },
    success: {
      borderColor: palette.positive,
      backgroundColor: palette.positiveLight,
    },
  }

  const styles = variantStyles[variant]

  return (
    <aside 
      className={`chart-callout ${className}`}
      style={{
        borderLeftColor: styles.borderColor,
        backgroundColor: styles.backgroundColor,
      }}
    >
      {children}
    </aside>
  )
}


