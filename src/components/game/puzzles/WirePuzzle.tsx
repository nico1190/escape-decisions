import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Cable, Unlock, RotateCcw } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface WirePayload {
  /** Colors of the left ports (in order, top to bottom). */
  leftColors: string[]
  /** Colors of the right ports (in scrambled order, top to bottom). */
  rightColors: string[]
  /**
   * Optional ordering constraint. When set, connections must be made in
   * the alphabetical (or reverse-alphabetical) order of the COLOR LABEL
   * (Spanish). Any deviation resets all connections.
   */
  matchRule?: 'alphabetical' | 'reverse-alphabetical'
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

const WIRE_COLORS: Record<string, { hex: string; label: string }> = {
  red: { hex: '#ef4444', label: 'Rojo' },
  green: { hex: '#10b981', label: 'Verde' },
  blue: { hex: '#3b82f6', label: 'Azul' },
  yellow: { hex: '#fbbf24', label: 'Amarillo' },
  purple: { hex: '#a855f7', label: 'Violeta' },
  orange: { hex: '#f97316', label: 'Naranja' },
}

/**
 * Wire-connection puzzle. Left ports each have a fixed color; right ports
 * the same colors but in scrambled order. Click a left port, then a right
 * port — a curved wire connects them. Solve when every connection joins
 * matching colors.
 *
 * Difficulty mode (`matchRule`):
 *  - default: any order is fine, just match colors
 *  - 'alphabetical': you MUST connect colors in the alphabetical order of
 *    their Spanish names (amarillo → azul → naranja → rojo → verde → violeta).
 *    Wrong order resets everything.
 *  - 'reverse-alphabetical': inverse.
 */
export function WirePuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as WirePayload
  const { leftColors, rightColors, matchRule } = payload
  const count = leftColors.length

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  // connections[i] = j means left port i is wired to right port j (or null)
  const [connections, setConnections] = useState<(number | null)[]>(() =>
    Array.from({ length: count }, () => null),
  )
  const [phase, setPhase] = useState<'idle' | 'right' | 'wrong'>('idle')

  // Expected color sequence when matchRule is active.
  const expectedSequence = useMemo<string[] | null>(() => {
    if (!matchRule) return null
    const uniqueLeft = Array.from(new Set(leftColors))
    const sorted = [...uniqueLeft].sort((a, b) =>
      (WIRE_COLORS[a]?.label ?? a).localeCompare(WIRE_COLORS[b]?.label ?? b, 'es'),
    )
    return matchRule === 'reverse-alphabetical' ? sorted.reverse() : sorted
  }, [leftColors, matchRule])

  useEffect(() => {
    setConnections(Array.from({ length: count }, () => null))
    setSelectedLeft(null)
    setPhase('idle')
  }, [puzzle.id, count])

  useEffect(() => {
    if (phase === 'right' || phase === 'wrong') return
    const allCorrect =
      connections.every((j, i) => j !== null && leftColors[i] === rightColors[j])
    if (allCorrect) {
      setPhase('right')
      setTimeout(onSolve, 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections, phase])

  function resetWithFlash() {
    playSfx('error')
    setPhase('wrong')
    setTimeout(() => {
      setConnections(Array.from({ length: count }, () => null))
      setSelectedLeft(null)
      setPhase('idle')
    }, 700)
  }

  function selectLeft(i: number) {
    if (phase !== 'idle') return
    // If left port already wired, unwire on click (default mode) OR reset (rule mode)
    if (connections[i] !== null) {
      if (expectedSequence) {
        // Strict mode — touching a wired port resets everything
        resetWithFlash()
      } else {
        setConnections((arr) => arr.map((v, idx) => (idx === i ? null : v)))
        setSelectedLeft(null)
      }
      return
    }
    setSelectedLeft((cur) => (cur === i ? null : i))
  }

  function selectRight(j: number) {
    if (phase !== 'idle' || selectedLeft === null) return
    if (connections.includes(j)) return

    const leftI = selectedLeft
    const colorsMatch = leftColors[leftI] === rightColors[j]

    if (expectedSequence) {
      // Order constraint: must wire colors in `expectedSequence` order.
      const stepIdx = connections.filter((c) => c !== null).length // 0-based step
      const expected = expectedSequence[stepIdx]
      if (!colorsMatch || leftColors[leftI] !== expected) {
        resetWithFlash()
        return
      }
    } else {
      // No order constraint, but mismatched colors are still allowed visually
      // (wire shows in left color). The puzzle just won't auto-solve.
    }

    setConnections((arr) => arr.map((v, idx) => (idx === leftI ? j : v)))
    setSelectedLeft(null)
    if (colorsMatch) playSfx('click')
  }

  function resetAll() {
    setConnections(Array.from({ length: count }, () => null))
    setSelectedLeft(null)
    setPhase('idle')
  }

  // Port positions in SVG coords (0–100 width, 0–100 height inside the panel)
  const portR = 6
  const slot = 100 / (count + 1)
  const leftX = 14
  const rightX = 86
  const yFor = (i: number) => slot * (i + 1)

  const ruleHint = expectedSequence
    ? `Conectá los cables en orden ${matchRule === 'reverse-alphabetical' ? 'alfabético INVERSO' : 'alfabético'} del nombre del color: ${expectedSequence.map((c) => WIRE_COLORS[c]?.label ?? c).join(' → ')}. Equivocarse reinicia todo.`
    : 'Conectá cada terminal izquierdo con el derecho del mismo color. Tocá un cable conectado para quitarlo.'

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Cable className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      <p
        className={cn(
          'text-sm mb-2',
          expectedSequence ? 'text-amber-300/90 font-medium' : 'text-muted-foreground',
        )}
      >
        {ruleHint}
      </p>

      <div
        className={cn(
          'relative w-full mx-auto rounded-xl border border-border bg-secondary/50 p-2',
          phase === 'right' && 'border-emerald-500/60 bg-emerald-500/5',
          phase === 'wrong' && 'border-destructive bg-destructive/10 animate-shake',
        )}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full aspect-square max-h-[320px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* connecting wires */}
          {connections.map((j, i) =>
            j === null ? null : (
              <path
                key={`wire-${i}`}
                d={`M ${leftX + portR} ${yFor(i)} C 50 ${yFor(i)}, 50 ${yFor(j)}, ${rightX - portR} ${yFor(j)}`}
                fill="none"
                stroke={
                  leftColors[i] === rightColors[j]
                    ? '#10b981'
                    : WIRE_COLORS[leftColors[i]]?.hex ?? '#888'
                }
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity={leftColors[i] === rightColors[j] ? 1 : 0.85}
              />
            ),
          )}

          {/* preview wire while picking right port */}
          {selectedLeft !== null && (
            <line
              x1={leftX + portR}
              y1={yFor(selectedLeft)}
              x2={rightX - portR}
              y2={yFor(selectedLeft)}
              stroke={WIRE_COLORS[leftColors[selectedLeft]]?.hex ?? '#888'}
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.5"
            />
          )}

          {/* Left ports */}
          {leftColors.map((c, i) => (
            <g
              key={`L-${i}`}
              onClick={() => selectLeft(i)}
              className="cursor-pointer"
              style={{ pointerEvents: 'all' }}
            >
              <circle
                cx={leftX}
                cy={yFor(i)}
                r={portR + 0.8}
                fill="none"
                stroke={selectedLeft === i ? '#fef3c7' : 'transparent'}
                strokeWidth="0.8"
                strokeDasharray={selectedLeft === i ? '1.5 1' : 'none'}
              />
              <circle
                cx={leftX}
                cy={yFor(i)}
                r={portR}
                fill={WIRE_COLORS[c]?.hex ?? '#888'}
                stroke="#0a0a0a"
                strokeWidth="0.6"
              />
              <circle
                cx={leftX}
                cy={yFor(i)}
                r={portR * 0.55}
                fill="#0a0a0a"
                opacity="0.6"
              />
            </g>
          ))}

          {/* Right ports */}
          {rightColors.map((c, j) => {
            const wired = connections.includes(j)
            return (
              <g
                key={`R-${j}`}
                onClick={() => selectRight(j)}
                className={cn('cursor-pointer', wired && 'cursor-not-allowed')}
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx={rightX}
                  cy={yFor(j)}
                  r={portR}
                  fill={WIRE_COLORS[c]?.hex ?? '#888'}
                  stroke="#0a0a0a"
                  strokeWidth="0.6"
                />
                <circle
                  cx={rightX}
                  cy={yFor(j)}
                  r={portR * 0.55}
                  fill="#0a0a0a"
                  opacity="0.6"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {phase === 'right' && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-emerald-400 font-medium text-sm mt-3"
        >
          Circuito completo. Sistema online.
        </motion.p>
      )}

      <div className="flex justify-between items-center gap-2 mt-3">
        <Button variant="ghost" onClick={onClose} size="sm" disabled={phase === 'right'}>
          Salir
        </Button>
        <Button variant="outline" size="sm" onClick={resetAll} disabled={phase === 'right'}>
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      </div>
    </>
  )
}
