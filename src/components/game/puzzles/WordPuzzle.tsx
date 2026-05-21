import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Unlock, Delete } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface WordPayload {
  length: number
  hint?: string
  /** Letters available to choose from (includes solution + decoys). */
  bank: string[]
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

/**
 * Letter-bank word puzzle: a row of slots and a pile of letters. Click a
 * letter to drop it into the next empty slot; click an occupied slot to
 * remove. When all slots are filled, "Probar" checks against the solution.
 */
export function WordPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as WordPayload
  const solution = String(puzzle.solution).toUpperCase()
  const { length, bank, hint } = payload

  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array.from({ length }, () => null),
  )
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle')

  useEffect(() => {
    setSlots(Array.from({ length }, () => null))
    setStatus('idle')
  }, [puzzle.id, length])

  function placeLetter(letter: string) {
    if (status === 'right') return
    const i = slots.findIndex((s) => s === null)
    if (i === -1) return
    setStatus('idle')
    setSlots((arr) => arr.map((s, idx) => (idx === i ? letter : s)))
  }

  function removeLetter(i: number) {
    if (status === 'right') return
    setStatus('idle')
    setSlots((arr) => arr.map((s, idx) => (idx === i ? null : s)))
  }

  function clear() {
    setSlots(Array.from({ length }, () => null))
    setStatus('idle')
  }

  function handleSubmit() {
    const entered = slots.map((s) => s ?? ' ').join('').toUpperCase()
    if (entered === solution) {
      setStatus('right')
      setTimeout(onSolve, 800)
    } else {
      playSfx('error')
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 700)
    }
  }

  // Track used letter indices so the bank greys-out chosen ones.
  const usedIndices: number[] = []
  const bankSlots = bank.map((letter, idx) => {
    const usedCount = usedIndices.filter((u) => bank[u] === letter).length
    const placedCount = slots.filter((s) => s === letter).length
    const isUsed = placedCount > usedCount
    if (isUsed) usedIndices.push(idx)
    return { letter, idx, isUsed }
  })

  const filled = slots.every((s) => s !== null)

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {status === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <KeyRound className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      {hint && <p className="text-sm text-muted-foreground mb-2">{hint}</p>}

      {/* Slots */}
      <div
        className={cn('flex justify-center gap-2 py-4', status === 'wrong' && 'animate-shake')}
      >
        {slots.map((s, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => s && removeLetter(i)}
            disabled={!s || status === 'right'}
            className={cn(
              'w-12 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-2xl font-bold transition-colors',
              status === 'wrong'
                ? 'border-destructive bg-destructive/10 text-foreground'
                : status === 'right'
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200'
                  : s
                    ? 'border-primary bg-secondary text-foreground hover:bg-secondary/70 cursor-pointer'
                    : 'border-border bg-secondary/30 text-muted-foreground',
            )}
            animate={status === 'wrong' ? { x: [0, -3, 3, -2, 2, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            {s ?? ''}
          </motion.button>
        ))}
      </div>

      {/* Letter bank */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {bankSlots.map(({ letter, idx, isUsed }) => (
          <button
            key={idx}
            type="button"
            disabled={isUsed || status === 'right'}
            onClick={() => placeLetter(letter)}
            className={cn(
              'w-9 h-9 rounded-md font-mono font-bold text-base transition-all',
              isUsed
                ? 'bg-secondary/30 text-muted-foreground/40 cursor-not-allowed'
                : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:scale-95',
            )}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center gap-2">
        <Button variant="ghost" onClick={onClose} size="sm">
          Salir
        </Button>
        <Button variant="outline" onClick={clear} size="sm" disabled={status === 'right'}>
          <Delete className="h-4 w-4" /> Borrar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!filled || status === 'right'}
          size="lg"
          className="flex-1"
        >
          {status === 'right' ? '¡Correcto!' : 'Probar palabra'}
        </Button>
      </div>
    </>
  )
}
