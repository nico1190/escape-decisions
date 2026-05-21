import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Unlock, RotateCcw, X } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface Star {
  id: string
  /** 0-100 percent positions within the SVG viewBox. */
  x: number
  y: number
  /** Optional small label shown on hover/always. */
  label?: string
}

interface ConstellationPayload {
  stars: Star[]
  /** Optional hint text. */
  hint?: string
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

export function ConstellationPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as ConstellationPayload
  // solution: comma-separated star ids in order, e.g. "s1,s4,s2,s5"
  const correctOrder = String(puzzle.solution).split(',').map((s) => s.trim())

  const [order, setOrder] = useState<string[]>([])
  const [phase, setPhase] = useState<'idle' | 'right' | 'wrong'>('idle')

  useEffect(() => {
    setOrder([])
    setPhase('idle')
  }, [puzzle.id])

  function clickStar(id: string) {
    if (phase !== 'idle') return
    if (order.includes(id)) return
    const nextOrder = [...order, id]
    const idx = nextOrder.length - 1
    if (nextOrder[idx] !== correctOrder[idx]) {
      // Wrong order — fail and reset shortly
      playSfx('error')
      setOrder(nextOrder)
      setPhase('wrong')
      setTimeout(() => {
        setOrder([])
        setPhase('idle')
      }, 900)
      return
    }
    playSfx('click')
    setOrder(nextOrder)
    if (nextOrder.length === correctOrder.length) {
      playSfx('puzzle-solve')
      setPhase('right')
      setTimeout(onSolve, 1000)
    }
  }

  function reset() {
    setOrder([])
    setPhase('idle')
  }

  // Build segments between consecutive correctly-clicked stars
  const segments = order.slice(1).map((id, i) => {
    const from = payload.stars.find((s) => s.id === order[i])!
    const to = payload.stars.find((s) => s.id === id)!
    return { from, to, key: `${from.id}-${to.id}` }
  })

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : phase === 'wrong' ? (
          <X className="h-5 w-5 text-red-400" />
        ) : (
          <Sparkles className="h-5 w-5 text-indigo-300" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        {payload.hint ?? 'Conectá las estrellas en el orden correcto. Una equivocación reinicia.'}
      </p>

      <div
        className={cn(
          'relative aspect-video w-full rounded border bg-gradient-to-b from-slate-950 to-indigo-950/40 border-slate-800 overflow-hidden',
          phase === 'wrong' && 'border-red-700',
          phase === 'right' && 'border-emerald-700',
        )}
      >
        <svg viewBox="0 0 100 56" className="w-full h-full">
          {/* Decorative dim stars */}
          {Array.from({ length: 40 }).map((_, i) => {
            const x = (i * 37) % 100
            const y = ((i * 17) % 56) + (i % 5)
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={0.3}
                className="fill-slate-500/40"
              />
            )
          })}

          {/* Lines connecting clicked stars */}
          {segments.map(({ from, to, key }) => (
            <motion.line
              key={key}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                'stroke-indigo-300',
                phase === 'right' && 'stroke-emerald-300',
                phase === 'wrong' && 'stroke-red-400',
              )}
              strokeWidth={0.5}
              strokeLinecap="round"
            />
          ))}

          {/* Stars */}
          {payload.stars.map((s, i) => {
            const clickedIdx = order.indexOf(s.id)
            const clicked = clickedIdx >= 0
            return (
              <g key={s.id}>
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r={clicked ? 2.4 : 1.6}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => clickStar(s.id)}
                  className={cn(
                    'cursor-pointer transition-all',
                    clicked
                      ? phase === 'right'
                        ? 'fill-emerald-300 drop-shadow-[0_0_4px_rgba(110,231,183,0.9)]'
                        : phase === 'wrong'
                          ? 'fill-red-400'
                          : 'fill-indigo-200 drop-shadow-[0_0_4px_rgba(199,210,254,0.9)]'
                      : 'fill-slate-300 hover:fill-amber-200',
                  )}
                  style={{ pointerEvents: phase === 'idle' ? 'auto' : 'none' }}
                />
                {clicked && (
                  <text
                    x={s.x}
                    y={s.y + 4.5}
                    textAnchor="middle"
                    className="fill-indigo-200 text-[2px] font-mono pointer-events-none"
                  >
                    {clickedIdx + 1}
                  </text>
                )}
                {s.label && (
                  <text
                    x={s.x}
                    y={s.y - 2.5}
                    textAnchor="middle"
                    className="fill-slate-400 text-[1.6px] pointer-events-none"
                  >
                    {s.label}
                  </text>
                )}
                {!s.label && i < payload.stars.length && (
                  <text
                    x={s.x + 2.5}
                    y={s.y + 0.8}
                    className="fill-slate-500 text-[1.4px] pointer-events-none"
                  >
                    {s.id}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-2 tabular-nums">
        Trazo: <span className="text-foreground font-mono">{order.length}/{correctOrder.length}</span>
      </p>

      <div className="flex justify-between items-center gap-2 mt-3">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={phase === 'right'}>
          Salir
        </Button>
        <Button variant="outline" size="sm" onClick={reset} disabled={phase === 'right'}>
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      </div>
    </>
  )
}
