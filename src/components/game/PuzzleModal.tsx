import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGameStore } from '@/store/useGameStore'
import { CodePuzzle } from './puzzles/CodePuzzle'
import { WordPuzzle } from './puzzles/WordPuzzle'
import { ColorSequencePuzzle } from './puzzles/ColorSequencePuzzle'
import { MemoryPuzzle } from './puzzles/MemoryPuzzle'
import { SliderPuzzle } from './puzzles/SliderPuzzle'
import { WirePuzzle } from './puzzles/WirePuzzle'
import { TimingPuzzle } from './puzzles/TimingPuzzle'
import { RotationPuzzle } from './puzzles/RotationPuzzle'
import { CipherPuzzle } from './puzzles/CipherPuzzle'
import { LightsOutPuzzle } from './puzzles/LightsOutPuzzle'
import { PipePuzzle } from './puzzles/PipePuzzle'
import { MastermindPuzzle } from './puzzles/MastermindPuzzle'
import { MorsePuzzle } from './puzzles/MorsePuzzle'
import { ConstellationPuzzle } from './puzzles/ConstellationPuzzle'

/**
 * Dispatcher modal: based on `puzzle.kind`, renders the appropriate mini-game
 * component. Each child receives onSolve (closes + applies solve effects) and
 * onClose (closes without solving).
 */
export function PuzzleModal() {
  const puzzleId = useGameStore((s) => s.pendingPuzzleId)
  const level = useGameStore((s) => s.level)
  const submitPuzzle = useGameStore((s) => s.submitPuzzle)
  const closePuzzle = useGameStore((s) => s.closePuzzle)

  const puzzle = puzzleId && level ? level.puzzles?.[puzzleId] : null

  return (
    <Dialog open={!!puzzleId} onOpenChange={(o) => !o && closePuzzle()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>{puzzle?.prompt ?? 'Puzzle'}</DialogTitle>
        </DialogHeader>
        {puzzle?.kind === 'code' && (
          <CodePuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'word' && (
          <WordPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'color-sequence' && (
          <ColorSequencePuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'memory' && (
          <MemoryPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'slider' && (
          <SliderPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'wire' && (
          <WirePuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'timing' && (
          <TimingPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'rotation' && (
          <RotationPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'cipher' && (
          <CipherPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'lights-out' && (
          <LightsOutPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'pipe' && (
          <PipePuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'mastermind' && (
          <MastermindPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'morse' && (
          <MorsePuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
        {puzzle?.kind === 'constellation' && (
          <ConstellationPuzzle
            puzzle={puzzle}
            onSolve={() => submitPuzzle(true)}
            onClose={closePuzzle}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
