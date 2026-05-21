import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Lock, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useGameStore } from '@/store/useGameStore'
import { useProgressStore } from '@/store/useProgressStore'
import { LEVELS } from '@/data/levels'
import { cn } from '@/lib/cn'

const TONE_BADGE: Record<string, { label: string; classes: string }> = {
  educational: { label: 'Educativo', classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
  mystery: { label: 'Misterio', classes: 'bg-violet-500/15 text-violet-300 border-violet-500/40' },
  comedy: { label: 'Humor', classes: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  realistic: { label: 'Realista', classes: 'bg-sky-500/15 text-sky-300 border-sky-500/40' },
}

export function LevelSelectScreen() {
  const beginLevel = useGameStore((s) => s.beginLevel)
  const goToTitle = useGameStore((s) => s.goToTitle)
  const unlockedLevels = useProgressStore((s) => s.unlockedLevels)
  const completedLevels = useProgressStore((s) => s.completedLevels)
  const resetProgress = useProgressStore((s) => s.reset)

  function handleResetProgress() {
    if (confirm('¿Borrar todo el progreso guardado? Esta acción no se puede deshacer.')) {
      resetProgress()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6"
    >
      <header className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={goToTitle} className="-ml-3">
          <ArrowLeft className="h-4 w-4" />
          Inicio
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetProgress}
          className="text-muted-foreground hover:text-destructive"
          title="Borrar progreso"
        >
          <RotateCcw className="h-4 w-4" />
          Borrar progreso
        </Button>
      </header>

      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Seleccionar nivel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {completedLevels.length} / {LEVELS.length} completados · {unlockedLevels.length} desbloqueados
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEVELS.map((level, idx) => {
          const isUnlocked = unlockedLevels.includes(level.id)
          const isCompleted = completedLevels.includes(level.id)
          const badge = TONE_BADGE[level.tone] ?? TONE_BADGE.realistic

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              <Card
                className={cn(
                  'h-full overflow-hidden transition-all relative',
                  isUnlocked
                    ? 'hover:border-primary/60 hover:shadow-[0_0_24px_rgba(251,191,36,0.15)] cursor-pointer'
                    : 'opacity-60 cursor-not-allowed',
                  isCompleted && 'border-emerald-500/40',
                )}
                onClick={() => isUnlocked && beginLevel(level)}
              >
                {isCompleted && (
                  <div className="absolute top-2 right-2 z-10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                )}

                {/* Decorative "preview" header band — tone-colored gradient */}
                <div
                  className={cn(
                    'h-20 w-full relative overflow-hidden',
                    level.tone === 'educational' && 'bg-gradient-to-br from-amber-900/60 via-orange-700/50 to-red-900/40',
                    level.tone === 'mystery' && 'bg-gradient-to-br from-amber-950/70 via-orange-900/30 to-zinc-950',
                    (level.tone === 'realistic' || level.id === 'level-03-station') && 'bg-gradient-to-br from-slate-900 via-blue-900/40 to-black',
                  )}
                >
                  {/* Locked overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Lock className="h-7 w-7 text-muted-foreground" />
                    </div>
                  )}
                  {/* Decorative noise dots */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:18px_18px]" />
                </div>

                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {idx + 1}. {level.title}
                    </CardTitle>
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-widest border rounded-full px-2 py-0.5 shrink-0',
                        badge.classes,
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {level.intro?.text ?? level.subtitle}
                  </CardDescription>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {Object.keys(level.puzzles ?? {}).length} puzzle
                      {Object.keys(level.puzzles ?? {}).length === 1 ? '' : 's'} · {level.maxLives} vidas
                    </span>
                    {isUnlocked ? (
                      <Button
                        size="sm"
                        variant={isCompleted ? 'outline' : 'default'}
                        onClick={(e) => {
                          e.stopPropagation()
                          beginLevel(level)
                        }}
                      >
                        <Play className="h-3 w-3" />
                        {isCompleted ? 'Rejugar' : 'Jugar'}
                      </Button>
                    ) : (
                      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                        Bloqueado
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
