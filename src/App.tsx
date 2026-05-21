import { useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { ensureFirstLevelUnlocked } from '@/store/useProgressStore'
import { getFirstLevel } from '@/data/levels'
import { TitleScreen } from '@/components/screens/TitleScreen'
import { GameScreen } from '@/components/screens/GameScreen'
import { LevelSelectScreen } from '@/components/screens/LevelSelectScreen'
import { DecisionDialog } from '@/components/game/DecisionDialog'
import { DialogToasts } from '@/components/game/DialogToasts'
import { OutcomeScreen } from '@/components/game/OutcomeScreen'
import { PuzzleModal } from '@/components/game/PuzzleModal'

function App() {
  const level = useGameStore((s) => s.level)
  const route = useGameStore((s) => s.route)

  // On boot: make sure level 1 is unlocked so the player can always start.
  useEffect(() => {
    ensureFirstLevelUnlocked(getFirstLevel().id)
  }, [])

  return (
    <div className="min-h-full flex flex-col">
      {level ? (
        <GameScreen />
      ) : route === 'select' ? (
        <LevelSelectScreen />
      ) : (
        <TitleScreen />
      )}

      <DecisionDialog />
      <PuzzleModal />
      <DialogToasts />
      <OutcomeScreen />
    </div>
  )
}

export default App
