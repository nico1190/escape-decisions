import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface CodePayload {
  length: number
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

export function CodePuzzle({ puzzle, onSolve, onClose }: Props) {
  const length = (puzzle.payload as CodePayload).length
  const solution = String(puzzle.solution)

  const [digits, setDigits] = useState<number[]>(() =>
    Array.from({ length }, () => 0),
  )
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle')

  useEffect(() => {
    setDigits(Array.from({ length }, () => 0))
    setStatus('idle')
  }, [puzzle.id, length])

  function bump(i: number, delta: number) {
    setStatus('idle')
    setDigits((d) => d.map((n, idx) => (idx === i ? (n + delta + 10) % 10 : n)))
  }

  function handleSubmit() {
    const entered = digits.join('')
    if (entered === solution) {
      setStatus('right')
      setTimeout(onSolve, 700)
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
          <Lock className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>

      <div className={cn('flex justify-center gap-3 py-4', status === 'wrong' && 'animate-shake')}>
        {digits.map((n, i) => (
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
              aria-label={`Subir dígito ${i + 1}`}
              className="text-muted-foreground hover:text-primary p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <div className="w-10 h-12 flex items-center justify-center font-mono text-3xl font-bold text-foreground">
              {n}
            </div>
            <button
              type="button"
              onClick={() => bump(i, -1)}
              aria-label={`Bajar dígito ${i + 1}`}
              className="text-muted-foreground hover:text-primary p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center gap-2">
        <Button variant="ghost" onClick={onClose} size="sm">
          Salir
        </Button>
        <Button onClick={handleSubmit} disabled={status === 'right'} size="lg" className="flex-1">
          {status === 'right' ? '¡Abierto!' : `Probar ${digits.join('-')}`}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-2">
        Buscá pistas escondidas en la escena para descubrir el código de {length} dígitos.
      </p>
    </>
  )
}
