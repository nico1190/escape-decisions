import { motion } from 'framer-motion'
import { Flame, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/useGameStore'
import { useProgressStore } from '@/store/useProgressStore'

export function TitleScreen() {
  const goToSelect = useGameStore((s) => s.goToSelect)
  const level = useGameStore((s) => s.level)
  const completedLevels = useProgressStore((s) => s.completedLevels)
  const hasProgress = completedLevels.length > 0

  if (level) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full flex flex-col items-center justify-center px-6"
    >
      {/* Background flourish */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15),_transparent_60%)]"
      />
      <motion.div
        initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Flame className="h-20 w-20 text-primary drop-shadow-[0_0_24px_rgba(255,180,80,0.55)]" />
          <div className="absolute inset-0 animate-fire-pulse bg-primary/20 rounded-full blur-2xl -z-10" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="font-display text-5xl sm:text-6xl text-center"
      >
        Escape <span className="text-primary">Decisions</span>
      </motion.h1>

      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-3 text-center text-muted-foreground max-w-md"
      >
        Cada habitación encierra un acertijo. Cada acertijo, una decisión que
        define si salís entero.
      </motion.p>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-10"
      >
        <Button size="lg" className="text-lg px-8" onClick={goToSelect}>
          <Play className="h-5 w-5" /> {hasProgress ? 'Continuar' : 'Comenzar'}
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-xs text-muted-foreground/50 uppercase tracking-widest"
      >
        {hasProgress
          ? `${completedLevels.length} nivel${completedLevels.length === 1 ? '' : 'es'} completado${completedLevels.length === 1 ? '' : 's'}`
          : 'Prototipo'}
      </motion.p>
    </motion.div>
  )
}
