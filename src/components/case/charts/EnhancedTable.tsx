'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * EnhancedTable
 * 
 * Feature-rich table with visual enhancements:
 * - Sparklines in cells
 * - Progress bars
 * - Conditional formatting
 * - Expandable rows
 */

interface EnhancedColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'currency' | 'percent' | 'sparkline' | 'progress' | 'badge' | 'change'
  width?: string
}

interface EnhancedRow {
  [key: string]: string | number | boolean | number[] | { value: number; change: number }
  expandedContent?: string
}

interface EnhancedTableData {
  columns: EnhancedColumn[]
  rows: EnhancedRow[]
  striped?: boolean
  hoverable?: boolean
}

interface EnhancedTableProps {
  data: EnhancedTableData
}

export function EnhancedTable({ data }: EnhancedTableProps) {
  const palette = useExhibitPalette()
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.columns || !Array.isArray(data.columns) || data.columns.length === 0 ||
      !data?.rows || !Array.isArray(data.rows)) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No table data available</p>
      </div>
    )
  }

  const formatValue = (value: string | number | boolean, type?: string) => {
    if (typeof value === 'boolean') return value ? '✓' : '—'
    if (typeof value === 'string') return value

    switch (type) {
      case 'currency':
        return `$${value.toLocaleString()}`
      case 'percent':
        return `${value.toFixed(1)}%`
      default:
        return value.toLocaleString()
    }
  }

  const renderCell = (value: unknown, column: EnhancedColumn, rowIndex: number) => {
    switch (column.type) {
      case 'sparkline':
        if (!Array.isArray(value)) return '—'
        const sparkData = value as number[]
        const max = Math.max(...sparkData)
        const min = Math.min(...sparkData)
        const range = max - min || 1
        
        return (
          <div className="flex items-end gap-0.5 h-6">
            {sparkData.map((v, i) => (
              <div
                key={i}
                className="w-1 rounded-sm"
                style={{
                  height: `${((v - min) / range) * 100}%`,
                  minHeight: 2,
                  backgroundColor: palette.primary
                }}
              />
            ))}
          </div>
        )

      case 'progress':
        const progressValue = typeof value === 'number' ? value : 0
        return (
          <div className="flex items-center gap-2">
            <div 
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: palette.border }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressValue, 100)}%` }}
                transition={{ duration: 0.5, delay: rowIndex * 0.05 }}
                className="h-full rounded-full"
                style={{ backgroundColor: palette.primary }}
              />
            </div>
            <span className="text-xs text-slate-500 w-10 text-right">
              {progressValue}%
            </span>
          </div>
        )

      case 'badge':
        return (
          <span 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: palette.primaryLight,
              color: palette.primary
            }}
          >
            {String(value)}
          </span>
        )

      case 'change':
        if (typeof value === 'object' && value !== null && 'value' in value && 'change' in value) {
          const changeData = value as { value: number; change: number }
          const isPositive = changeData.change >= 0
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatValue(changeData.value, 'number')}</span>
              <span 
                className="text-xs"
                style={{ color: isPositive ? palette.positive : palette.negative }}
              >
                {isPositive ? '↑' : '↓'} {Math.abs(changeData.change)}%
              </span>
            </div>
          )
        }
        return '—'

      default:
        return formatValue(value as string | number | boolean, column.type)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto rounded-lg border"
      style={{ borderColor: palette.border }}
    >
      <table className="w-full">
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: palette.backgroundAlt,
                  color: palette.textMuted,
                  width: column.width
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIndex * 0.03 }}
              className={`
                border-b transition-colors
                ${data.hoverable !== false ? 'hover:bg-slate-50 cursor-pointer' : ''}
                ${data.striped && rowIndex % 2 === 1 ? 'bg-slate-50/50' : ''}
              `}
              style={{ borderBottomColor: palette.borderSubtle }}
              onClick={() => row.expandedContent && setExpandedRow(expandedRow === rowIndex ? null : rowIndex)}
            >
              {data.columns.map((column, colIndex) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-sm"
                  style={{
                    fontWeight: colIndex === 0 ? 500 : 400,
                    color: colIndex === 0 ? palette.text : palette.textMuted
                  }}
                >
                  {renderCell(row[column.key], column, rowIndex)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
