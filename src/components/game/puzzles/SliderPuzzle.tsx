import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, Unlock } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface SliderPayload {
  /** Target value each slider must land on, in order. */
  targets: number[]
  /** Inclusive range for every slider. */
  range: { min: number; max: number }
  /** Optional label for each slider (e.g. "Reactor A"). */
  labels?: string[]
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

/**
 * Slider combination lock. Each slider must land on a target value (read from
 * a clue elsewhere in the scene). The puzzle never reveals the targets — only
 * gives live feedback per slider (matches / off). Auto-solves when all line up.
 */
export function SliderPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as SliderPayload
  const { targets, range, labels } = payload
  const count = targets.length

  const [values, setValues] = useState<number[]>(() =>
    Array.from({ length: count }, () => range.min),
  )
  const [phase, setPhase] = useState<'idle' | 'right'>('idle')

  useEffect(() => {
    setValues(Array.from({ length: count }, () => range.min))
    setPhase('idle')
  }, [puzzle.id, count, range.min])

  useEffect(() => {
    if (phase === 'right') return
    const allMatch = values.every((v, i) => v === targets[i])
    if (allMatch) {
      setPhase('right')
      setTimeout(onSolve, 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, phase])

  function update(i: number, v: number) {
    setValues((arr) => arr.map((cur, idx) => (idx === i ? v : cur)))
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Sliders className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Ajustá cada slider a su valor correcto. El sistema muestra ✓ cuando uno acierta.
      </p>

      <div className="space-y-4 py-2">
        {values.map((v, i) => {
          const matches = v === targets[i]
          const label = labels?.[i] ?? `Canal ${i + 1}`
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={cn(
                    'uppercase tracking-wider font-medium',
                    matches ? 'text-emerald-400' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
                <span
                  className={cn(
                    'font-mono text-sm tabular-nums px-2 py-0.5 rounded border',
                    matches
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                      : 'border-border bg-secondary text-foreground',
                  )}
                >
                  {String(v).padStart(2, '0')}
                  {matches && <span className="ml-1 text-emerald-400">✓</span>}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={1}
                  value={v}
                  onChange={(e) => update(i, Number(e.target.value))}
                  disabled={phase === 'right'}
                  aria-label={`Slider ${i + 1}`}
                  className={cn(
                    'w-full h-2 appearance-none rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    matches ? 'bg-emerald-500/30' : 'bg-secondary',
                    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full',
                    matches
                      ? '[&::-webkit-slider-thumb]:bg-emerald-400 [&::-moz-range-thumb]:bg-emerald-400'
                      : '[&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary',
                    '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md',
                    '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background',
                  )}
                />
                {/* Tick marks below the slider for grid feel */}
                <div className="flex justify-between px-0.5 mt-1 text-[9px] text-muted-foreground tabular-nums">
                  {Array.from({ length: range.max - range.min + 1 }).map((_, k) => (
                    <span key={k}>{range.min + k}</span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {phase === 'right' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-emerald-400 font-medium text-sm mt-3"
        >
          Todos los canales alineados. Sistema desbloqueado.
        </motion.div>
      )}

      <div className="flex justify-end items-center gap-2 mt-3">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={phase === 'right'}>
          Salir
        </Button>
      </div>
    </>
  )
}
