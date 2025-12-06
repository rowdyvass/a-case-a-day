'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * DataTable
 * 
 * Editorial-quality data table with:
 * - Sortable columns
 * - Search/filter
 * - Highlight rows
 * - Brand-derived styling
 */

interface Column {
  key: string
  label: string
  sortable?: boolean
  type?: 'text' | 'number' | 'currency' | 'percent' | 'badge'
  align?: 'left' | 'center' | 'right'
}

interface DataTableData {
  columns: Column[]
  rows: Record<string, string | number | boolean>[]
  searchable?: boolean
  highlightRows?: number[]
  compact?: boolean
}

interface DataTableProps {
  data: DataTableData
}

export function DataTable({ data }: DataTableProps) {
  const palette = useExhibitPalette()
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Defensive check for missing or malformed data
  if (!data?.columns || !Array.isArray(data.columns) || data.columns.length === 0 ||
      !data?.rows || !Array.isArray(data.rows)) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No table data available</p>
      </div>
    )
  }

  const sortedAndFilteredRows = useMemo(() => {
    let rows = [...data.rows]

    // Filter
    if (searchTerm) {
      rows = rows.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Sort
    if (sortConfig) {
      rows.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        }

        const comparison = String(aVal).localeCompare(String(bVal))
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    return rows
  }, [data.rows, sortConfig, searchTerm])

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const formatCell = (value: string | number | boolean, column: Column) => {
    if (typeof value === 'boolean') return value ? '✓' : '—'

    switch (column.type) {
      case 'currency':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : value
      case 'percent':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : value
      case 'badge':
        return (
          <span 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: palette.primaryLight,
              color: palette.primary
            }}
          >
            {value}
          </span>
        )
      default:
        return value
    }
  }

  const cellPadding = data.compact ? 'px-3 py-2' : 'px-4 py-3'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Search */}
      {data.searchable && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              borderColor: palette.border,
              focusRing: palette.primary
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="exhibit-table-wrapper overflow-x-auto rounded-lg border" style={{ borderColor: palette.border }}>
        <table className="exhibit-table w-full">
          <thead>
            <tr>
              {data.columns.map((column, i) => (
                <th
                  key={column.key}
                  className={`${cellPadding} text-left text-xs font-semibold uppercase tracking-wide ${
                    column.sortable ? 'cursor-pointer hover:bg-slate-100 select-none' : ''
                  }`}
                  style={{
                    backgroundColor: palette.backgroundAlt,
                    borderBottomColor: palette.border,
                    textAlign: column.align || 'left'
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span style={{ color: palette.textMuted }}>{column.label}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredRows.map((row, rowIndex) => {
              const isHighlighted = data.highlightRows?.includes(rowIndex)

              return (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.02 }}
                  className="transition-colors hover:bg-slate-50"
                  style={{
                    backgroundColor: isHighlighted ? palette.primaryLight : 'transparent'
                  }}
                >
                  {data.columns.map((column, colIndex) => (
                    <td
                      key={column.key}
                      className={`${cellPadding} text-sm border-b`}
                      style={{
                        borderBottomColor: palette.borderSubtle,
                        textAlign: column.align || 'left',
                        fontWeight: colIndex === 0 ? 500 : 400,
                        color: colIndex === 0 ? palette.text : palette.textMuted
                      }}
                    >
                      {formatCell(row[column.key], column)}
                    </td>
                  ))}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Row count */}
      <div className="text-xs text-slate-500">
        {sortedAndFilteredRows.length} of {data.rows.length} rows
      </div>
    </motion.div>
  )
}
