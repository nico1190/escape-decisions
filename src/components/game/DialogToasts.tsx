import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { cn } from '@/lib/cn'

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
}

const TONE_STYLES = {
  info: 'border-border bg-card text-foreground',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
  error: 'border-destructive/50 bg-destructive/15 text-destructive-foreground',
}

const ICON_COLORS = {
  info: 'text-muted-foreground',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-destructive',
}

export function DialogToasts() {
  const toasts = useGameStore((s) => s.toasts)
  const dismissToast = useGameStore((s) => s.dismissToast)

  useEffect(() => {
    if (toasts.length === 0) return
    const oldest = toasts[0]
    const timer = setTimeout(() => dismissToast(oldest.id), 4200)
    return () => clearTimeout(timer)
  }, [toasts, dismissToast])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-xl backdrop-blur',
                TONE_STYLES[t.tone],
              )}
              onClick={() => dismissToast(t.id)}
              role="status"
            >
              <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', ICON_COLORS[t.tone])} />
              <p className="text-sm leading-relaxed">{t.text}</p>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
