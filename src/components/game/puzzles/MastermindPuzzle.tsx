import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Unlock, RotateCcw, X } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface MastermindPayload {
  /** Color palette available to the player (CSS-safe tokens). */
  colors: string[]
  /** Length of the hidden code (typically 4). */
  codeLength: number
  /** Max attempts allowed before failure. */
  maxAttempts: number
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

const COLOR_STYLES: Record<string, string> = {
  red: 'bg-red-500 border-red-400',
  blue: 'bg-blue-500 border-blue-400',
  green: 'bg-emerald-500 border-emerald-400',
  yellow: 'bg-yellow-400 border-yellow-300',
  purple: 'bg-purple-500 border-purple-400',
  orange: 'bg-orange-500 border-orange-400',
  pink: 'bg-pink-500 border-pink-400',
  cyan: 'bg-cyan-400 border-cyan-300',
  white: 'bg-slate-100 border-slate-300',
  black: 'bg-slate-900 border-slate-700',
}

function feedbackFor(guess: string[], secret: string[]): { exact: number; partial: number } {
  let exact = 0
  const sRem: string[] = []
  const gRem: string[] = []
  for (let i = 0; i < secret.length; i++) {
    if (guess[i] === secret[i]) exact++
    else {
      sRem.push(secret[i])
      gRem.push(guess[i])
    }
  }
  let partial = 0
  const sCount = new Map<string, number>()
  for (const c of sRem) sCount.set(c, (sCount.get(c) ?? 0) + 1)
  for (const g of gRem) {
    const n = sCount.get(g) ?? 0
    if (n > 0) {
      partial++
      sCount.set(g, n - 1)
    }
  }
  return { exact, partial }
}

export function MastermindPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as MastermindPayload
  const secret = useMemo(() => String(puzzle.solution).split(','), [puzzle.solution])

  const [current, setCurrent] = useState<string[]>(() => Array(payload.codeLength).fill(''))
  const [history, setHistory] = useState<Array<{ guess: string[]; exact: number; partial: number }>>([])
  const [phase, setPhase] = useState<'idle' | 'right' | 'wrong'>('idle')

  useEffect(() => {
    setCurrent(Array(payload.codeLength).fill(''))
    setHistory([])
    setPhase('idle')
  }, [puzzle.id, payload.codeLength])

  function setSlot(slot: number, color: string) {
    if (phase === 'right' || phase === 'wrong') return
    setCurrent((c) => {
      const next = [...c]
      next[slot] = color
      return next
    })
  }

  function submit() {
    if (phase !== 'idle') return
    if (current.some((c) => !c)) return
    playSfx('click')
    const fb = feedbackFor(current, secret)
    const newHistory = [...history, { guess: [...current], ...fb }]
    setHistory(newHistory)
    if (fb.exact === secret.length) {
      setPhase('right')
      setTimeout(onSolve, 900)
      return
    }
    if (newHistory.length >= payload.maxAttempts) {
      setPhase('wrong')
      playSfx('error')
      setTimeout(() => {
        setHistory([])
        setCurrent(Array(payload.codeLength).fill(''))
        setPhase('idle')
      }, 1400)
      return
    }
    setCurrent(Array(payload.codeLength).fill(''))
  }

  function reset() {
    setCurrent(Array(payload.codeLength).fill(''))
    setHistory([])
    setPhase('idle')
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : phase === 'wrong' ? (
          <X className="h-5 w-5 text-red-400" />
        ) : (
          <Target className="h-5 w-5 text-purple-400" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Adiviná los {payload.codeLength} colores. ● color y posición exacta · ○ color correcto, posición incorrecta.
      </p>

      {/* History */}
      <div className="space-y-1 mb-3 max-h-40 overflow-y-auto">
        {history.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between gap-2 px-2 py-1 bg-slate-900/40 rounded"
          >
            <div className="flex gap-1">
              {row.guess.map((c, j) => (
                <div
                  key={j}
                  className={cn('w-6 h-6 rounded-full border', COLOR_STYLES[c] ?? 'bg-slate-800')}
                />
              ))}
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: row.exact }).map((_, k) => (
                <div key={`e${k}`} className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              ))}
              {Array.from({ length: row.partial }).map((_, k) => (
                <div key={`p${k}`} className="w-2.5 h-2.5 rounded-full border border-amber-400" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current row */}
      <div className="flex justify-center gap-1.5 mb-3">
        {current.map((c, i) => (
          <div
            key={i}
            className={cn(
              'w-9 h-9 rounded-full border-2',
              c ? COLOR_STYLES[c] ?? 'bg-slate-800' : 'border-dashed border-slate-700',
            )}
          />
        ))}
      </div>

      {/* Palette */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {payload.colors.map((c) => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => {
              const slot = current.findIndex((x) => !x)
              if (slot !== -1) setSlot(slot, c)
            }}
            disabled={phase !== 'idle'}
            className={cn(
              'w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform',
              COLOR_STYLES[c] ?? 'bg-slate-800',
            )}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      <p className="text-xs text-center text-muted-foreground mb-2 tabular-nums">
        Intentos: <span className="text-foreground font-mono">{history.length}/{payload.maxAttempts}</span>
      </p>

      <div className="flex justify-between items-center gap-2">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={phase === 'right'}>
          Salir
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={phase === 'right'}
          >
            <RotateCcw className="h-3 w-3" /> Limpiar
          </Button>
          <Button
            size="sm"
            onClick={submit}
            disabled={current.some((c) => !c) || phase !== 'idle'}
          >
            Probar
          </Button>
        </div>
      </div>
    </>
  )
}
