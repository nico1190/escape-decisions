import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Unlock, Eye } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface MemoryPayload {
  /** Sequence of digits to memorize (and the solution, in correct order). */
  numbers: number[]
  /** How long to display the flash before hiding (default 2500ms). */
  showMs?: number
  /**
   * If true, the flash shows the digits in REVERSE order. The puzzle is a
   * trap: the actual solution is the correct (un-reversed) order, which
   * must come from a clue elsewhere in the scene.
   */
  reverseDisplay?: boolean
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

/**
 * Memory puzzle: press "Mostrar" to flash a sequence of digits for ~3 seconds.
 * After they disappear the player must type them back in order using a number
 * pad. Hidden until shown — pure short-term memory test.
 */
export function MemoryPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as MemoryPayload
  const { numbers, showMs = 2500, reverseDisplay = false } = payload
  const solution = numbers.join('')
  // The on-screen flash uses this — possibly the reverse of the solution.
  const displayed = reverseDisplay ? [...numbers].reverse() : numbers

  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'right' | 'wrong'>('idle')
  const [input, setInput] = useState('')

  useEffect(() => {
    setPhase('idle')
    setInput('')
  }, [puzzle.id])

  function showNumbers() {
    setInput('')
    setPhase('showing')
    setTimeout(() => setPhase('input'), showMs)
  }

  function press(d: number) {
    if (phase !== 'input' || input.length >= numbers.length) return
    const next = input + d
    setInput(next)
    if (next.length === numbers.length) {
      // Auto-submit when filled
      setTimeout(() => {
        if (next === solution) {
          setPhase('right')
          setTimeout(onSolve, 800)
        } else {
          playSfx('error')
          setPhase('wrong')
          setTimeout(() => {
            setInput('')
            setPhase('idle')
          }, 800)
        }
      }, 250)
    }
  }

  function backspace() {
    if (phase !== 'input') return
    setInput((s) => s.slice(0, -1))
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Brain className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Vas a ver una secuencia por unos segundos. Memorizala y luego repetila.
      </p>

      {/* Display area */}
      <div
        className={cn(
          'h-20 rounded-xl flex items-center justify-center gap-3 mb-3 border-2 transition-colors',
          phase === 'showing'
            ? 'border-primary bg-primary/10'
            : phase === 'right'
              ? 'border-emerald-500 bg-emerald-500/10'
              : phase === 'wrong'
                ? 'border-destructive bg-destructive/10 animate-shake'
                : 'border-border bg-secondary/40',
        )}
      >
        <AnimatePresence mode="wait">
          {phase === 'showing' && (
            <motion.div
              key="show"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="flex gap-3"
            >
              {displayed.map((n, i) => (
                <span
                  key={i}
                  className="font-mono text-4xl font-bold text-primary tabular-nums"
                >
                  {n}
                </span>
              ))}
            </motion.div>
          )}
          {phase === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground italic"
            >
              Presioná "Mostrar" para ver la secuencia
            </motion.span>
          )}
          {(phase === 'input' || phase === 'right' || phase === 'wrong') && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              {numbers.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-10 h-12 rounded-lg border flex items-center justify-center font-mono text-2xl font-bold tabular-nums',
                    input[i]
                      ? 'border-primary bg-secondary text-foreground'
                      : 'border-border bg-card/40 text-muted-foreground/30',
                  )}
                >
                  {input[i] ?? '–'}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button
            key={d}
            type="button"
            disabled={phase !== 'input'}
            onClick={() => press(d)}
            className="aspect-square rounded-lg border border-border bg-secondary text-2xl font-mono font-bold text-foreground hover:bg-secondary/70 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          disabled={phase !== 'input' || input.length === 0}
          onClick={backspace}
          className="aspect-square rounded-lg border border-border bg-secondary text-xs uppercase tracking-wider text-muted-foreground hover:bg-secondary/70 disabled:opacity-40 transition-colors col-span-1"
        >
          ←
        </button>
        <button
          type="button"
          disabled={phase !== 'input'}
          onClick={() => press(0)}
          className="aspect-square rounded-lg border border-border bg-secondary text-2xl font-mono font-bold text-foreground hover:bg-secondary/70 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
        >
          0
        </button>
        <button
          type="button"
          disabled={phase !== 'idle' && phase !== 'wrong'}
          onClick={showNumbers}
          className="aspect-square rounded-lg border border-primary bg-primary/20 text-xs uppercase tracking-wider text-primary hover:bg-primary/30 disabled:opacity-40 transition-colors col-span-1 flex flex-col items-center justify-center gap-0.5"
        >
          <Eye className="h-4 w-4" />
          Ver
        </button>
      </div>

      <div className="flex justify-between items-center gap-2">
        <Button variant="ghost" onClick={onClose} size="sm">
          Salir
        </Button>
      </div>
    </>
  )
}
