import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ScrollText, Unlock } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface CipherPayload {
  /** Numbers from the encrypted inscription, in order. e.g. [4, 9, 15, 19]. */
  encrypted: number[]
  /**
   * Hint text shown above the dials — e.g. "A = 1, B = 2 ... Z = 26".
   */
  hint?: string
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Cipher decryption puzzle. The player sees a numeric inscription and a
 * cipher key, and must dial the corresponding letters using A-Z dials.
 * Submit checks the entered word against the puzzle's solution.
 */
export function CipherPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as CipherPayload
  const { encrypted, hint } = payload
  const length = encrypted.length
  const solution = String(puzzle.solution).toUpperCase()

  const [indexes, setIndexes] = useState<number[]>(() =>
    Array.from({ length }, () => 0),
  )
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle')

  useEffect(() => {
    setIndexes(Array.from({ length }, () => 0))
    setStatus('idle')
  }, [puzzle.id, length])

  function bump(i: number, delta: number) {
    setStatus('idle')
    setIndexes((arr) =>
      arr.map((n, idx) => (idx === i ? (n + delta + 26) % 26 : n)),
    )
  }

  function handleSubmit() {
    const entered = indexes.map((n) => ALPHABET[n]).join('')
    if (entered === solution) {
      setStatus('right')
      setTimeout(onSolve, 800)
    } else {
      playSfx('error')
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 700)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {status === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <ScrollText className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>

      {hint && (
        <p className="text-xs text-muted-foreground mb-2 font-mono">{hint}</p>
      )}

      {/* Encrypted message strip */}
      <div className="flex justify-center gap-2 py-2">
        {encrypted.map((n, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 text-amber-300/80 font-mono"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              cifra
            </span>
            <span className="text-2xl font-bold tabular-nums">{String(n).padStart(2, '0')}</span>
          </div>
        ))}
      </div>

      <div className="text-center text-[10px] uppercase tracking-widest text-muted-foreground mt-2 mb-1">
        Tu interpretación
      </div>

      <div
        className={cn(
          'flex justify-center gap-3 py-2',
          status === 'wrong' && 'animate-shake',
        )}
      >
        {indexes.map((n, i) => (
          <motion.div
            key={i}
            className={cn(
              'flex flex-col items-center rounded-xl border-2 px-2 py-2',
              status === 'wrong'
                ? 'border-destructive bg-destructive/10'
                : status === 'right'
                  ? 'border-emerald-500 bg-emerald-500/15'
                  : 'border-border bg-secondary',
            )}
            animate={status === 'wrong' ? { x: [0, -4, 4, -2, 2, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              onClick={() => bump(i, 1)}
              aria-label={`Subir letra ${i + 1}`}
              className="text-muted-foreground hover:text-primary p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <div className="w-10 h-12 flex items-center justify-center font-mono text-3xl font-bold text-foreground">
              {ALPHABET[n]}
            </div>
            <button
              type="button"
              onClick={() => bump(i, -1)}
              aria-label={`Bajar letra ${i + 1}`}
              className="text-muted-foreground hover:text-primary p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center gap-2 mt-2">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={status === 'right'}>
          Salir
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={status === 'right'}
          size="lg"
          className="flex-1"
        >
          {status === 'right' ? '¡Descifrado!' : `Probar ${indexes.map((n) => ALPHABET[n]).join('')}`}
        </Button>
      </div>

      <p className="text-[11px] text-center text-muted-foreground mt-2">
        Cada número corresponde a una letra del alfabeto. La pista te dice cuál.
      </p>
    </>
  )
}
