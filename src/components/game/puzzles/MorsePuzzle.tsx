import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, Unlock, RotateCcw, Play, Volume2, X } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playMorse, playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface MorsePayload {
  /** The actual encoded message (revealed as morse via audio + optional visual). */
  message: string
  /** Show the dot/dash visual along with audio? Default true. */
  showVisual?: boolean
  /** Unit duration in ms (defaults to 90). Decrease for tougher levels. */
  unitMs?: number
  /** Hint text shown above the input. */
  hint?: string
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

const MORSE_TABLE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
}

export function MorsePuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as MorsePayload
  const solution = String(puzzle.solution).toUpperCase()
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState<'idle' | 'right' | 'wrong'>('idle')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setValue('')
    setPhase('idle')
  }, [puzzle.id])

  function play() {
    if (playing) return
    setPlaying(true)
    const total = playMorse(payload.message.toUpperCase(), payload.unitMs ?? 90)
    setTimeout(() => setPlaying(false), Math.max(800, total + 200))
  }

  function submit() {
    if (phase !== 'idle') return
    if (value.toUpperCase().trim() === solution) {
      playSfx('puzzle-solve')
      setPhase('right')
      setTimeout(onSolve, 700)
    } else {
      playSfx('error')
      setPhase('wrong')
      setTimeout(() => {
        setPhase('idle')
        setValue('')
      }, 900)
    }
  }

  function reset() {
    setValue('')
    setPhase('idle')
  }

  const visualMorse = (payload.showVisual ?? true)
    ? payload.message
        .toUpperCase()
        .split('')
        .map((ch) => (ch === ' ' ? '/' : MORSE_TABLE[ch] ?? '?'))
        .join('  ')
    : ''

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : phase === 'wrong' ? (
          <X className="h-5 w-5 text-red-400" />
        ) : (
          <Radio className="h-5 w-5 text-amber-400" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        {payload.hint ?? 'Escuchá la transmisión y traducí el mensaje.'}
      </p>

      <div className="flex justify-center mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={play}
          disabled={playing || phase === 'right'}
          className="gap-2"
        >
          {playing ? <Volume2 className="h-4 w-4 animate-pulse" /> : <Play className="h-4 w-4" />}
          {playing ? 'Transmitiendo…' : 'Reproducir'}
        </Button>
      </div>

      {visualMorse && (
        <div
          className={cn(
            'text-center font-mono text-lg tracking-widest py-3 px-2 rounded bg-slate-900/60 border border-slate-800 mb-3',
            playing && 'text-amber-300 animate-pulse',
          )}
        >
          {visualMorse}
        </div>
      )}

      <motion.input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        disabled={phase !== 'idle'}
        animate={phase === 'wrong' ? { x: [-6, 6, -5, 5, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        placeholder="Mensaje decodificado"
        className={cn(
          'w-full text-center text-lg font-mono tracking-wider py-2 rounded border bg-slate-900 border-slate-700 outline-none focus:border-amber-500',
          phase === 'right' && 'border-emerald-500',
          phase === 'wrong' && 'border-red-500',
        )}
      />

      <div className="flex justify-between items-center gap-2 mt-3">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={phase === 'right'}>
          Salir
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset} disabled={phase === 'right'}>
            <RotateCcw className="h-3 w-3" /> Limpiar
          </Button>
          <Button size="sm" onClick={submit} disabled={!value.trim() || phase !== 'idle'}>
            Enviar
          </Button>
        </div>
      </div>
    </>
  )
}
