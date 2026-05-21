import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'

export function LivesIndicator() {
  const lives = useGameStore((s) => s.player.lives)
  const maxLives = useGameStore((s) => s.level?.maxLives ?? 0)
  if (maxLives === 0) return null

  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/80 backdrop-blur border border-border">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Vidas</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxLives }).map((_, i) => {
          const alive = i < lives
          return (
            <motion.div
              key={i}
              animate={{ scale: alive ? 1 : 0.85, opacity: alive ? 1 : 0.25 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
            >
              <Heart
                className="h-5 w-5"
                fill={alive ? 'currentColor' : 'transparent'}
                color={alive ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))'}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
