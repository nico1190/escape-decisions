import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/useGameStore'
import { useAudioStore } from '@/store/useAudioStore'
import { RoomCanvas } from '@/components/game/RoomCanvas'
import { InventoryBar } from '@/components/game/InventoryBar'
import { LivesIndicator } from '@/components/game/LivesIndicator'

export function GameScreen() {
  const level = useGameStore((s) => s.level)
  const reset = useGameStore((s) => s.reset)
  const shakeTick = useGameStore((s) => s.shakeTick)
  const muted = useAudioStore((s) => s.muted)
  const toggleMuted = useAudioStore((s) => s.toggleMuted)
  const controls = useAnimationControls()

  useEffect(() => {
    if (shakeTick === 0) return
    controls.start({
      x: [0, -12, 12, -8, 8, -4, 4, 0],
      transition: { duration: 0.45, ease: 'easeInOut' },
    })
  }, [shakeTick, controls])

  if (!level) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={reset} className="mb-2 -ml-3">
            <ArrowLeft className="h-4 w-4" />
            Salir al menú
          </Button>
          <h1 className="font-display text-2xl sm:text-3xl">{level.title}</h1>
          {level.subtitle && (
            <p className="text-sm text-muted-foreground">{level.subtitle}</p>
          )}
        </div>
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMuted}
            title={muted ? 'Activar audio' : 'Silenciar'}
            className="text-muted-foreground hover:text-foreground"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <LivesIndicator />
        </div>
      </header>

      <motion.div animate={controls}>
        <RoomCanvas />
      </motion.div>

      <InventoryBar />
    </motion.div>
  )
}
