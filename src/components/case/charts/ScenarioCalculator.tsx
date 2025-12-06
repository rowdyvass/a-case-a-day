'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * ScenarioCalculator
 * 
 * Interactive financial/business scenario calculator with:
 * - Multiple input variables
 * - Real-time calculation
 * - Sensitivity analysis
 */

interface Variable {
  key: string
  label: string
  default: number
  min: number
  max: number
  step?: number
  unit?: string
  format?: 'number' | 'currency' | 'percent'
}

interface Output {
  key: string
  label: string
  formula: string // Uses variable keys, e.g., "revenue * margin"
  format?: 'number' | 'currency' | 'percent'
  highlight?: boolean
}

interface ScenarioCalculatorData {
  title?: string
  description?: string
  variables: Variable[]
  outputs: Output[]
  scenarios?: {
    name: string
    values: Record<string, number>
  }[]
}

interface ScenarioCalculatorProps {
  data: ScenarioCalculatorData
}

export function ScenarioCalculator({ data }: ScenarioCalculatorProps) {
  const palette = useExhibitPalette()
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(data.variables.map(v => [v.key, v.default]))
  )
  const [activeScenario, setActiveScenario] = useState<string | null>(null)

  const calculateOutput = (formula: string): number => {
    try {
      // Replace variable keys with values
      let expr = formula
      Object.entries(values).forEach(([key, value]) => {
        expr = expr.replace(new RegExp(key, 'g'), String(value))
      })
      // eslint-disable-next-line no-eval
      return eval(expr)
    } catch {
      return 0
    }
  }

  const outputs = useMemo(() => {
    return data.outputs.map(output => ({
      ...output,
      value: calculateOutput(output.formula)
    }))
  }, [values, data.outputs])

  const formatValue = (value: number, format?: string, unit?: string) => {
    let formatted: string
    switch (format) {
      case 'currency':
        if (value >= 1000000000) formatted = `$${(value / 1000000000).toFixed(1)}B`
        else if (value >= 1000000) formatted = `$${(value / 1000000).toFixed(1)}M`
        else if (value >= 1000) formatted = `$${(value / 1000).toFixed(0)}K`
        else formatted = `$${value.toLocaleString()}`
        break
      case 'percent':
        formatted = `${value.toFixed(1)}%`
        break
      default:
        formatted = value.toLocaleString()
    }
    return unit ? `${formatted}${unit}` : formatted
  }

  const applyScenario = (scenarioName: string) => {
    const scenario = data.scenarios?.find(s => s.name === scenarioName)
    if (scenario) {
      setValues({ ...values, ...scenario.values })
      setActiveScenario(scenarioName)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      {(data.title || data.description) && (
        <div>
          {data.title && (
            <h4 className="font-serif text-lg font-semibold text-slate-900">{data.title}</h4>
          )}
          {data.description && (
            <p className="text-sm text-slate-600 mt-1">{data.description}</p>
          )}
        </div>
      )}

      {/* Scenario presets */}
      {data.scenarios && data.scenarios.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.scenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => applyScenario(scenario.name)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                activeScenario === scenario.name
                  ? 'text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              style={{
                backgroundColor: activeScenario === scenario.name ? palette.primary : 'transparent'
              }}
            >
              {scenario.name}
            </button>
          ))}
        </div>
      )}

      {/* Variables */}
      <div className="grid gap-5 md:grid-cols-2">
        {data.variables.map((variable, i) => {
          const value = values[variable.key]
          const percent = ((value - variable.min) / (variable.max - variable.min)) * 100

          return (
            <motion.div
              key={variable.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{variable.label}</span>
                <motion.span 
                  key={value}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-semibold text-slate-900"
                >
                  {formatValue(value, variable.format, variable.unit)}
                </motion.span>
              </div>
              <input
                type="range"
                min={variable.min}
                max={variable.max}
                step={variable.step || 1}
                value={value}
                onChange={(e) => {
                  setValues({ ...values, [variable.key]: parseFloat(e.target.value) })
                  setActiveScenario(null)
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${palette.primary} ${percent}%, ${palette.border} ${percent}%)`
                }}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>{formatValue(variable.min, variable.format, variable.unit)}</span>
                <span>{formatValue(variable.max, variable.format, variable.unit)}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Outputs */}
      <div 
        className="grid gap-4 p-5 rounded-xl"
        style={{ backgroundColor: palette.backgroundAlt }}
      >
        {outputs.map((output, i) => (
          <div 
            key={output.key}
            className={`flex justify-between items-center ${
              output.highlight ? 'pt-3 border-t' : ''
            }`}
            style={{ borderTopColor: output.highlight ? palette.border : 'transparent' }}
          >
            <span className={`text-sm ${output.highlight ? 'font-semibold' : ''} text-slate-600`}>
              {output.label}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={output.value}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={`font-semibold ${output.highlight ? 'text-lg' : 'text-sm'}`}
                style={{ color: output.highlight ? palette.primary : palette.text }}
              >
                {formatValue(output.value, output.format)}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
