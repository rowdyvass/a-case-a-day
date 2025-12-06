'use client'

import { type ReactNode } from 'react'
import { useExhibitPalette } from '../../ExhibitContext'

/**
 * ExhibitWrapper
 * 
 * Editorial-quality container for all exhibit types.
 * Inspired by The Economist and NY Times data visualization style.
 */

interface ExhibitWrapperProps {
  children: ReactNode
  title: string
  index: number
  subtitle?: string
  source?: string
  note?: string
  className?: string
}

export function ExhibitWrapper({
  children,
  title,
  index,
  subtitle,
  source,
  note,
  className = '',
}: ExhibitWrapperProps) {
  const palette = useExhibitPalette()

  return (
    <figure 
      className={`exhibit-wrapper group ${className}`}
      role="figure"
      aria-labelledby={`exhibit-${index}-title`}
    >
      {/* Header */}
      <header className="exhibit-header">
        <div className="exhibit-label">
          <span 
            className="exhibit-accent-line"
            style={{ backgroundColor: palette.primary }}
          />
          <span className="exhibit-number">
            Exhibit {index}
          </span>
        </div>
        <h3 
          id={`exhibit-${index}-title`}
          className="exhibit-title"
        >
          {title}
        </h3>
        {subtitle && (
          <p className="exhibit-subtitle">{subtitle}</p>
        )}
      </header>

      {/* Content */}
      <div className="exhibit-content">
        {children}
      </div>

      {/* Footer */}
      {(source || note) && (
        <footer className="exhibit-footer">
          {note && (
            <p className="exhibit-note">
              <span className="exhibit-note-label">Note:</span> {note}
            </p>
          )}
          {source && (
            <p className="exhibit-source">
              <span className="exhibit-source-label">Source:</span> {source}
            </p>
          )}
        </footer>
      )}
    </figure>
  )
}


