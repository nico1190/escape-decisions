import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Unlock } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface ColorPayload {
  /** Names of the buttons (used as the solution alphabet). */
  palette: string[]
  /** The pattern to memorize, in order. */
  sequence: string[]
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

const COLOR_STYLES: Record<string, { bg: string; ring: string; label: string }> = {
  red: { bg: 'bg-red-500', ring: 'ring-red-300', label: 'Rojo' },
  green: { bg: 'bg-emerald-500', ring: 'ring-emerald-300', label: 'Verde' },
  blue: { bg: 'bg-blue-500', ring: 'ring-blue-300', label: 'Azul' },
  yellow: { bg: 'bg-amber-400', ring: 'ring-amber-300', label: 'Amarillo' },
  purple: { bg: 'bg-purple-500', ring: 'ring-purple-300', label: 'Violeta' },
}

/**
 * Color sequence lock — no "show" button. The puzzle does NOT reveal the
 * pattern. The player must learn the sequence from clues elsewhere in the
 * scene (in level 2, from the stained-glass window) and press the buttons in
 * the correct order. A wrong press resets the input.
 */
export function ColorSequencePuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as ColorPayload
  const { palette, sequence } = payload
  const solution = sequence.join(',')

  const [entered, setEntered] = useState<string[]>([])
  const [phase, setPhase] = useState<'idle' | 'right' | 'wrong'>('idle')
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    setEntered([])
    setPhase('idle')
    setFlash(null)
  }, [puzzle.id])

  function press(color: string) {
    if (phase === 'right') return
    setFlash(color)
    setTimeout(() => setFlash(null), 180)

    const next = [...entered, color]
    setEntered(next)
    const expected = sequence[next.length - 1]
    if (color !== expected) {
      playSfx('error')
      setPhase('wrong')
      setTimeout(() => {
        setEntered([])
        setPhase('idle')
      }, 700)
      return
    }
    // Correct press — short positive blip
    playSfx('click')
    if (next.length === sequence.length) {
      if (next.join(',') === solution) {
        setPhase('right')
        setTimeout(onSolve, 800)
      }
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Palette className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Presioná los colores en el orden correcto. Si te equivocás, vuelve a cero.
      </p>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-3">
        {sequence.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 w-6 rounded-full transition-colors',
              phase === 'wrong' && i < entered.length
                ? 'bg-destructive'
                : i < entered.length
                  ? 'bg-emerald-400'
                  : 'bg-secondary',
            )}
          />
        ))}
      </div>

      {/* Color pad */}
      <div
        className={cn(
          'grid grid-cols-2 gap-3 max-w-[260px] mx-auto py-4',
          phase === 'wrong' && 'animate-shake',
        )}
      >
        {palette.map((color) => {
          const style = COLOR_STYLES[color] ?? { bg: 'bg-slate-500', ring: 'ring-slate-300', label: color }
          const isLit = flash === color
          return (
            <motion.button
              key={color}
              type="button"
              onClick={() => press(color)}
              disabled={phase === 'right'}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'aspect-square rounded-2xl border-2 border-black/30 shadow-inner transition-all flex items-center justify-center font-medium text-white/90',
                style.bg,
                isLit
                  ? `brightness-150 ring-4 ${style.ring} ring-offset-2 ring-offset-card scale-95`
                  : 'brightness-75 hover:brightness-100',
              )}
            >
              {style.label}
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-end items-center gap-2 mt-3">
        <Button variant="ghost" onClick={onClose} size="sm">
          Salir
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-2">
        Pista: en algún rincón del desván hay una guía visual del orden. Buscala antes de probar.
      </p>
    </>
  )
}
