import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Unlock } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface RotationPayload {
  /**
   * One config per ring (outer → inner). Each ring has `segments` positions
   * (e.g. 8 = 45°-per-step). `start` is the initial position offset, and
   * `target` is the position the player must rotate to (default 0 = top).
   */
  rings: { segments: number; start: number; target?: number; label?: string }[]
  /** Optional glyphs (single chars) to draw on each segment of each ring. */
  glyphs?: string[][]
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

/**
 * Rotation lock — 3 concentric stone rings each rotate independently. Click
 * a ring to rotate it one step. Solve when every ring's marker is on its
 * target position. The puzzle does NOT show the target positions for each
 * ring; only the current orientation, so the player must discover them.
 */
export function RotationPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as RotationPayload
  const { rings, glyphs } = payload

  const [positions, setPositions] = useState<number[]>(() =>
    rings.map((r) => r.start % r.segments),
  )
  const [phase, setPhase] = useState<'idle' | 'right'>('idle')

  useEffect(() => {
    setPositions(rings.map((r) => r.start % r.segments))
    setPhase('idle')
  }, [puzzle.id, rings])

  useEffect(() => {
    if (phase === 'right') return
    const allOK = positions.every((p, i) => p === (rings[i].target ?? 0))
    if (allOK) {
      setPhase('right')
      setTimeout(onSolve, 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions])

  function rotate(i: number) {
    if (phase === 'right') return
    playSfx('click')
    setPositions((arr) =>
      arr.map((p, idx) => (idx === i ? (p + 1) % rings[i].segments : p)),
    )
  }

  // SVG ring radii (outer → inner)
  const RING_RADII = [44, 32, 20] // in viewBox units
  const RING_THICKNESS = 10
  const CENTER = 50

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Compass className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Click cada anillo para rotarlo. Los marcadores deben apuntar todos hacia
        arriba (12 horas).
      </p>

      <div className="relative mx-auto w-full max-w-[280px] aspect-square">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="rotBg" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <linearGradient id="rotStone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a16e3e" />
              <stop offset="100%" stopColor="#5a3520" />
            </linearGradient>
          </defs>
          {/* background disc */}
          <circle cx={CENTER} cy={CENTER} r="48" fill="url(#rotBg)" />

          {/* rings (outer→inner) */}
          {rings.map((ring, i) => {
            const r = RING_RADII[i] ?? 44
            const segAngle = 360 / ring.segments
            const target = ring.target ?? 0
            const pos = positions[i]
            return (
              <g
                key={i}
                onClick={() => rotate(i)}
                className={cn('cursor-pointer', phase === 'right' && 'cursor-default')}
                style={{ pointerEvents: 'all' }}
              >
                {/* ring base */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={r}
                  fill="none"
                  stroke="url(#rotStone)"
                  strokeWidth={RING_THICKNESS}
                />
                {/* segment dividers */}
                {Array.from({ length: ring.segments }).map((_, s) => {
                  const a = ((s * segAngle - 90) * Math.PI) / 180
                  const x1 = CENTER + (r - RING_THICKNESS / 2) * Math.cos(a)
                  const y1 = CENTER + (r - RING_THICKNESS / 2) * Math.sin(a)
                  const x2 = CENTER + (r + RING_THICKNESS / 2) * Math.cos(a)
                  const y2 = CENTER + (r + RING_THICKNESS / 2) * Math.sin(a)
                  return (
                    <line
                      key={s}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#2a1709"
                      strokeWidth="0.4"
                    />
                  )
                })}
                {/* glyphs on each segment */}
                {glyphs?.[i]?.map((g, s) => {
                  const a = ((s * segAngle + segAngle / 2 - 90) * Math.PI) / 180
                  const tx = CENTER + r * Math.cos(a)
                  const ty = CENTER + r * Math.sin(a) + 1.4
                  return (
                    <text
                      key={s}
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      fontSize="4"
                      fontWeight="bold"
                      fill="#fef3c7"
                      opacity="0.5"
                      fontFamily="serif"
                    >
                      {g}
                    </text>
                  )
                })}
                {/* the active marker (filled segment) */}
                {(() => {
                  const a1 = ((pos * segAngle - 90) * Math.PI) / 180
                  const a2 = (((pos + 1) * segAngle - 90) * Math.PI) / 180
                  const rIn = r - RING_THICKNESS / 2
                  const rOut = r + RING_THICKNESS / 2
                  const large = segAngle > 180 ? 1 : 0
                  const isOnTarget = pos === target
                  const x1 = CENTER + rIn * Math.cos(a1)
                  const y1 = CENTER + rIn * Math.sin(a1)
                  const x2 = CENTER + rOut * Math.cos(a1)
                  const y2 = CENTER + rOut * Math.sin(a1)
                  const x3 = CENTER + rOut * Math.cos(a2)
                  const y3 = CENTER + rOut * Math.sin(a2)
                  const x4 = CENTER + rIn * Math.cos(a2)
                  const y4 = CENTER + rIn * Math.sin(a2)
                  return (
                    <motion.path
                      d={`M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 ${large} 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 ${large} 0 ${x1} ${y1} Z`}
                      fill={isOnTarget ? '#10b981' : '#fbbf24'}
                      animate={{ opacity: isOnTarget ? 1 : 0.85 }}
                    />
                  )
                })()}
              </g>
            )
          })}

          {/* target marker at the top */}
          <g pointerEvents="none">
            <path d="M 50 0 L 47 4 L 53 4 Z" fill="#fef3c7" />
            <line x1="50" y1="4" x2="50" y2="10" stroke="#fef3c7" strokeWidth="0.6" strokeDasharray="1 1" />
          </g>

          {/* center jewel */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r="6"
            fill={phase === 'right' ? '#10b981' : '#1e293b'}
            stroke="#fbbf24"
            strokeWidth="0.6"
          />
          <circle cx={CENTER} cy={CENTER} r="2" fill={phase === 'right' ? '#fef3c7' : '#475569'} />
        </svg>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-2 tabular-nums">
        {rings.map((r, i) => (
          <span key={i} className="mx-2">
            {r.label ?? `Anillo ${i + 1}`}:{' '}
            <span
              className={cn(
                'font-mono',
                positions[i] === (r.target ?? 0) ? 'text-emerald-400' : 'text-foreground',
              )}
            >
              {positions[i] + 1}/{r.segments}
            </span>
          </span>
        ))}
      </div>

      <div className="flex justify-end items-center gap-2 mt-3">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={phase === 'right'}>
          Salir
        </Button>
      </div>
    </>
  )
}
