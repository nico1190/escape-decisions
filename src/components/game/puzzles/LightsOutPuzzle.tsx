import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Unlock, RotateCcw } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

interface LightsOutPayload {
  /** N×N grid of 0/1. 1 = lit. */
  initialGrid: number[][]
  /** Target state: 'all-off' (default) or 'all-on'. */
  target?: 'all-off' | 'all-on'
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

/**
 * Lights Out classic mini-game. Click a cell to toggle that cell and its
 * 4 orthogonal neighbors. Solve when every cell matches the target state
 * (default: all off).
 */
export function LightsOutPuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as LightsOutPayload
  const target = payload.target ?? 'all-off'
  const targetVal = target === 'all-off' ? 0 : 1

  const [grid, setGrid] = useState<number[][]>(() => payload.initialGrid.map((r) => [...r]))
  const [phase, setPhase] = useState<'idle' | 'right'>('idle')
  const [moves, setMoves] = useState(0)

  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  useEffect(() => {
    setGrid(payload.initialGrid.map((r) => [...r]))
    setPhase('idle')
    setMoves(0)
  }, [puzzle.id, payload.initialGrid])

  useEffect(() => {
    if (phase === 'right') return
    const solved = grid.every((row) => row.every((c) => c === targetVal))
    if (solved && moves > 0) {
      setPhase('right')
      setTimeout(onSolve, 800)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, phase])

  function toggle(r: number, c: number) {
    if (phase === 'right') return
    playSfx('click')
    setMoves((m) => m + 1)
    setGrid((g) => {
      const next = g.map((row) => [...row])
      // toggle self
      next[r][c] = 1 - next[r][c]
      // 4 neighbors
      if (r > 0) next[r - 1][c] = 1 - next[r - 1][c]
      if (r < rows - 1) next[r + 1][c] = 1 - next[r + 1][c]
      if (c > 0) next[r][c - 1] = 1 - next[r][c - 1]
      if (c < cols - 1) next[r][c + 1] = 1 - next[r][c + 1]
      return next
    })
  }

  function reset() {
    setGrid(payload.initialGrid.map((r) => [...r]))
    setMoves(0)
    setPhase('idle')
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Lightbulb className="h-5 w-5 text-muted-foreground" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Click una celda para invertir esa y sus 4 vecinas. Objetivo:{' '}
        <span className="text-foreground font-medium">
          {target === 'all-off' ? 'apagar todas' : 'encender todas'}
        </span>
        .
      </p>

      <div
        className="grid gap-1.5 mx-auto py-2 w-fit"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <motion.button
              key={`${r}-${c}`}
              type="button"
              onClick={() => toggle(r, c)}
              disabled={phase === 'right'}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'w-10 h-10 rounded-md border-2 transition-colors',
                cell === 1
                  ? 'bg-amber-400 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.55)]'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700',
                phase === 'right' && 'cursor-default',
              )}
              aria-label={`Celda ${r + 1},${c + 1} ${cell === 1 ? 'encendida' : 'apagada'}`}
            />
          )),
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground mt-2 tabular-nums">
        Movimientos: <span className="text-foreground font-mono">{moves}</span>
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
