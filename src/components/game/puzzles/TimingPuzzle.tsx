import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Unlock } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface TimingPayload {
  /**
   * One config per round. Each round:
   *  - greenSize: width of the green target zone as % of the full bar (0–100).
   *  - greenPos: center of the green zone as % of bar (0–100). Default 50.
   *  - cycleMs: time in ms for the needle to travel left→right→left.
   */
  rounds: { greenSize: number; greenPos?: number; cycleMs: number }[]
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

/**
 * Skill-based timing lock. A needle ping-pongs across a horizontal bar; click
 * (or press Space) to LOCK it. If the needle landed inside the green zone the
 * round passes; otherwise the whole sequence resets to round 1. Cleared after
 * N successful locks.
 */
export function TimingPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as TimingPayload
  const { rounds } = payload

  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'running' | 'hit' | 'miss' | 'right'>(
    'running',
  )
  const [needlePct, setNeedlePct] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  // Animation loop — bounce the needle left/right based on cycleMs.
  useEffect(() => {
    if (phase !== 'running') return
    const cycleMs = rounds[round]?.cycleMs ?? 1500
    startTimeRef.current = performance.now()
    const tick = (t: number) => {
      const elapsed = t - startTimeRef.current
      const u = (elapsed % cycleMs) / cycleMs
      // triangle wave from 0→100→0
      const pct = u < 0.5 ? u * 2 * 100 : (1 - u) * 2 * 100
      setNeedlePct(pct)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [phase, round, rounds])

  // Keyboard space to lock
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        lock()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round, needlePct])

  function lock() {
    if (phase !== 'running') return
    const cfg = rounds[round]
    const center = cfg.greenPos ?? 50
    const halfSize = cfg.greenSize / 2
    const inZone = needlePct >= center - halfSize && needlePct <= center + halfSize
    if (inZone) {
      playSfx('click')
      setPhase('hit')
      setTimeout(() => {
        if (round + 1 >= rounds.length) {
          setPhase('right')
          setTimeout(onSolve, 800)
        } else {
          setRound(round + 1)
          setPhase('running')
        }
      }, 500)
    } else {
      playSfx('error')
      setPhase('miss')
      setTimeout(() => {
        setRound(0)
        setPhase('running')
      }, 700)
    }
  }

  const cfg = rounds[round]
  const greenCenter = cfg?.greenPos ?? 50
  const greenSize = cfg?.greenSize ?? 20

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Target className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Cliqueá <kbd className="rounded bg-secondary border border-border px-1.5 py-0.5 text-[10px] font-mono">Bloquear</kbd> (o
        barra espaciadora) cuando la aguja entre en la zona verde. Una falla
        reinicia todo.
      </p>

      {/* Round progress dots */}
      <div className="flex justify-center gap-2 mb-3">
        {rounds.map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'h-2 w-8 rounded-full transition-colors',
              phase === 'miss' && i === round
                ? 'bg-destructive'
                : i < round
                  ? 'bg-emerald-400'
                  : i === round && phase === 'hit'
                    ? 'bg-emerald-400'
                    : 'bg-secondary',
            )}
            animate={phase === 'miss' && i === round ? { x: [0, -4, 4, 0] } : {}}
          />
        ))}
      </div>

      {/* Skill bar */}
      <div
        className={cn(
          'relative h-12 rounded-xl border-2 bg-secondary/40 overflow-hidden my-4',
          phase === 'miss'
            ? 'border-destructive animate-shake'
            : phase === 'hit' || phase === 'right'
              ? 'border-emerald-500'
              : 'border-border',
        )}
      >
        {/* danger gradient as backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.06) 30%, rgba(239,68,68,0.06) 70%, rgba(239,68,68,0.18) 100%)',
          }}
        />
        {/* green target zone */}
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/40 border-x border-emerald-400/70"
          style={{
            left: `${Math.max(0, greenCenter - greenSize / 2)}%`,
            width: `${greenSize}%`,
          }}
        />
        {/* needle */}
        <motion.div
          className={cn(
            'absolute top-0 bottom-0 w-1 rounded-full shadow-[0_0_8px_rgba(254,243,199,0.8)]',
            phase === 'right' || phase === 'hit'
              ? 'bg-emerald-300'
              : phase === 'miss'
                ? 'bg-destructive'
                : 'bg-amber-200',
          )}
          style={{ left: `${needlePct}%`, x: '-50%' }}
        />
        {/* tick marks at bottom for visual reference */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 opacity-50">
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} className="block h-1.5 w-px bg-muted-foreground" />
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground mb-3 tabular-nums">
        Ronda <span className="text-foreground font-mono">{round + 1}</span> de{' '}
        {rounds.length}
        {phase === 'miss' && (
          <span className="ml-2 text-destructive font-medium">— fallaste</span>
        )}
        {phase === 'hit' && (
          <span className="ml-2 text-emerald-400 font-medium">— ¡acertaste!</span>
        )}
      </div>

      <div className="flex justify-between items-center gap-2">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={phase === 'right'}>
          Salir
        </Button>
        <Button
          onClick={lock}
          disabled={phase !== 'running'}
          size="lg"
          className="flex-1"
        >
          {phase === 'right' ? 'Bloqueado' : 'Bloquear'}
        </Button>
      </div>
    </>
  )
}
