import { motion } from 'framer-motion'
import { Sparkles, SkullIcon, RotateCcw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/useGameStore'
import { getNextLevel } from '@/data/levels'

export function OutcomeScreen() {
  const outcome = useGameStore((s) => s.outcome)
  const level = useGameStore((s) => s.level)
  const beginLevel = useGameStore((s) => s.beginLevel)
  const reset = useGameStore((s) => s.reset)

  if (!outcome || !level) return null

  const isWin = outcome.kind === 'win'
  const message = isWin ? level.outro?.good : (level.outro?.bad ?? outcome.reason)
  const Icon = isWin ? Sparkles : SkullIcon
  const nextLevel = isWin ? getNextLevel(level.id) : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl text-center"
      >
        <Icon
          className={
            isWin
              ? 'mx-auto h-14 w-14 text-emerald-400 mb-4'
              : 'mx-auto h-14 w-14 text-destructive mb-4'
          }
        />
        <h2 className="font-display text-3xl mb-2">
          {isWin ? '¡Lo lograste!' : 'Game over'}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {nextLevel ? (
            <Button onClick={() => beginLevel(nextLevel)} size="lg">
              <ArrowRight className="h-4 w-4" /> Siguiente nivel: {nextLevel.title}
            </Button>
          ) : (
            <Button onClick={() => beginLevel(level)} size="lg">
              <RotateCcw className="h-4 w-4" /> Reintentar
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={reset}>
            Volver al menú
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
