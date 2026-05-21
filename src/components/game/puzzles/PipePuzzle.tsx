import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Unlock, RotateCcw } from 'lucide-react'
import type { Puzzle } from '@/types/game'
import { Button } from '@/components/ui/button'
import { playSfx } from '@/lib/audio'
import { cn } from '@/lib/cn'

/**
 * Pipe types and the connectors each one exposes on its 4 sides at rotation=0.
 *  - 'straight'  : connects left ↔ right
 *  - 'elbow'     : connects top ↔ right  (an "L")
 *  - 't'         : connects left ↔ right ↔ bottom
 *  - 'cross'     : connects all 4 sides (used sparingly)
 *  - 'source'    : emits flow on right side only (rotates)
 *  - 'sink'      : receives flow on left side only (rotates)
 *  - 'blocked'   : impassable / decorative
 *  - 'empty'     : no pipe (impassable)
 */
type PipeType = 'straight' | 'elbow' | 't' | 'cross' | 'source' | 'sink' | 'blocked' | 'empty'

interface PipeCell {
  type: PipeType
  /** 0=0°, 1=90°, 2=180°, 3=270° (rotation count) */
  r: number
  /** If true, the cell is locked and cannot be rotated. */
  locked?: boolean
}

interface PipePayload {
  /** Grid in row-major order. */
  grid: PipeCell[][]
  /** Coordinates of the single source cell (must be type 'source'). */
  source: { r: number; c: number }
  /** Coordinates of the single sink cell (must be type 'sink'). */
  sink: { r: number; c: number }
}

interface Props {
  puzzle: Puzzle
  onSolve: () => void
  onClose: () => void
}

const SIDES = ['top', 'right', 'bottom', 'left'] as const
type Side = (typeof SIDES)[number]
const OPPOSITE: Record<Side, Side> = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }

/** Base connectors for each pipe type at rotation = 0 (no rotation). */
const BASE_CONNECTORS: Record<PipeType, Side[]> = {
  straight: ['left', 'right'],
  elbow: ['top', 'right'],
  t: ['left', 'right', 'bottom'],
  cross: ['top', 'right', 'bottom', 'left'],
  source: ['right'],
  sink: ['left'],
  blocked: [],
  empty: [],
}

const SIDE_INDEX: Record<Side, number> = { top: 0, right: 1, bottom: 2, left: 3 }

function rotateSide(side: Side, rotations: number): Side {
  const idx = (SIDE_INDEX[side] + rotations) % 4
  return SIDES[idx]
}

function getConnectors(cell: PipeCell): Side[] {
  return BASE_CONNECTORS[cell.type].map((s) => rotateSide(s, cell.r))
}

/**
 * Flood-fill from the source. Returns true if the sink is reachable through
 * properly-mating connectors (each side of a cell must match the opposite
 * side of the neighbor).
 */
function isSolved(grid: PipeCell[][], source: { r: number; c: number }, sink: { r: number; c: number }): boolean {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const visited = new Set<string>()
  const stack: Array<{ r: number; c: number }> = [{ ...source }]

  while (stack.length > 0) {
    const { r, c } = stack.pop()!
    const key = `${r},${c}`
    if (visited.has(key)) continue
    visited.add(key)
    if (r === sink.r && c === sink.c) return true

    const cell = grid[r]?.[c]
    if (!cell) continue
    const conns = getConnectors(cell)
    for (const side of conns) {
      const nr = side === 'top' ? r - 1 : side === 'bottom' ? r + 1 : r
      const nc = side === 'left' ? c - 1 : side === 'right' ? c + 1 : c
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const neighbor = grid[nr][nc]
      if (!neighbor || neighbor.type === 'empty' || neighbor.type === 'blocked') continue
      const neighborConns = getConnectors(neighbor)
      if (neighborConns.includes(OPPOSITE[side])) {
        stack.push({ r: nr, c: nc })
      }
    }
  }
  return false
}

/** SVG representation of each pipe type, rendered at rotation=0 inside a 40×40 box. */
function PipeGlyph({ cell }: { cell: PipeCell }) {
  const stroke = 'stroke-cyan-400'
  const fill = 'fill-cyan-500/30'
  const common = 'transition-transform duration-200'

  if (cell.type === 'empty')
    return <div className="w-full h-full" aria-hidden />
  if (cell.type === 'blocked')
    return (
      <div className="w-full h-full bg-slate-900 border border-slate-700 rounded-sm" aria-hidden />
    )

  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('w-full h-full', common)}
      style={{ transform: `rotate(${cell.r * 90}deg)` }}
    >
      {cell.type === 'straight' && (
        <rect x="0" y="16" width="40" height="8" className={cn(fill, stroke)} strokeWidth="2" />
      )}
      {cell.type === 'elbow' && (
        <>
          <rect x="16" y="0" width="8" height="24" className={cn(fill, stroke)} strokeWidth="2" />
          <rect x="16" y="16" width="24" height="8" className={cn(fill, stroke)} strokeWidth="2" />
        </>
      )}
      {cell.type === 't' && (
        <>
          <rect x="0" y="16" width="40" height="8" className={cn(fill, stroke)} strokeWidth="2" />
          <rect x="16" y="16" width="8" height="24" className={cn(fill, stroke)} strokeWidth="2" />
        </>
      )}
      {cell.type === 'cross' && (
        <>
          <rect x="0" y="16" width="40" height="8" className={cn(fill, stroke)} strokeWidth="2" />
          <rect x="16" y="0" width="8" height="40" className={cn(fill, stroke)} strokeWidth="2" />
        </>
      )}
      {cell.type === 'source' && (
        <>
          <rect x="16" y="16" width="24" height="8" className={cn(fill, stroke)} strokeWidth="2" />
          <circle cx="12" cy="20" r="8" className="fill-cyan-300 stroke-cyan-200" strokeWidth="2" />
        </>
      )}
      {cell.type === 'sink' && (
        <>
          <rect x="0" y="16" width="24" height="8" className={cn(fill, stroke)} strokeWidth="2" />
          <rect x="24" y="10" width="14" height="20" className="fill-amber-500/40 stroke-amber-400" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}

export function PipePuzzle({ puzzle, onSolve, onClose }: Props) {
  const payload = puzzle.payload as PipePayload
  const initial = useMemo(
    () => payload.grid.map((row) => row.map((c) => ({ ...c }))),
    [payload.grid],
  )
  const [grid, setGrid] = useState<PipeCell[][]>(initial)
  const [phase, setPhase] = useState<'idle' | 'right'>('idle')
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    setGrid(payload.grid.map((row) => row.map((c) => ({ ...c }))))
    setPhase('idle')
    setMoves(0)
  }, [puzzle.id, payload.grid])

  useEffect(() => {
    if (phase === 'right') return
    if (isSolved(grid, payload.source, payload.sink)) {
      setPhase('right')
      setTimeout(onSolve, 900)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, phase])

  function rotate(r: number, c: number) {
    if (phase === 'right') return
    const cell = grid[r][c]
    if (!cell || cell.locked) return
    if (cell.type === 'empty' || cell.type === 'blocked') return
    playSfx('click')
    setMoves((m) => m + 1)
    setGrid((g) => {
      const next = g.map((row) => row.map((c2) => ({ ...c2 })))
      next[r][c].r = (next[r][c].r + 1) % 4
      return next
    })
  }

  function reset() {
    setGrid(payload.grid.map((row) => row.map((c) => ({ ...c }))))
    setMoves(0)
    setPhase('idle')
  }

  const cols = grid[0]?.length ?? 0

  return (
    <>
      <div className="flex items-center gap-2 text-xl font-display font-semibold mb-1">
        {phase === 'right' ? (
          <Unlock className="h-5 w-5 text-emerald-400" />
        ) : (
          <Droplets className="h-5 w-5 text-cyan-400" />
        )}
        {puzzle.prompt}
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Click una pieza para rotarla 90°. Conectá el surtidor (◯) con el desagüe (▭).
      </p>

      <div
        className="grid gap-0.5 mx-auto py-2 w-fit bg-slate-950/40 p-1 rounded"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <motion.button
              key={`${r}-${c}`}
              type="button"
              onClick={() => rotate(r, c)}
              disabled={phase === 'right' || cell.locked || cell.type === 'empty' || cell.type === 'blocked'}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'w-9 h-9 rounded-sm border transition-colors',
                cell.type === 'empty'
                  ? 'border-transparent bg-transparent cursor-default'
                  : cell.type === 'blocked'
                    ? 'border-slate-800 bg-slate-900 cursor-default'
                    : cell.locked
                      ? 'border-amber-700/50 bg-slate-900 cursor-default'
                      : 'border-slate-700 bg-slate-900 hover:bg-slate-800',
              )}
              aria-label={`Celda ${r + 1},${c + 1} tipo ${cell.type}`}
            >
              <PipeGlyph cell={cell} />
            </motion.button>
          )),
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground mt-2 tabular-nums">
        Rotaciones: <span className="text-foreground font-mono">{moves}</span>
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
