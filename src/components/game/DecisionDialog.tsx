import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useGameStore } from '@/store/useGameStore'
import { cn } from '@/lib/cn'

export function DecisionDialog() {
  const decisionId = useGameStore((s) => s.pendingDecisionId)
  const level = useGameStore((s) => s.level)
  const applyEffects = useGameStore((s) => s.applyEffects)
  const closeDecision = useGameStore((s) => s.closeDecision)

  const decision = decisionId && level ? level.decisions[decisionId] : null

  const [picked, setPicked] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [shake, setShake] = useState(false)

  // Reset state every time a new decision opens
  useEffect(() => {
    setPicked(null)
    setShake(false)
    setTimeLeft(decision?.timerMs ?? 0)
  }, [decisionId, decision?.timerMs])

  // Timer countdown
  useEffect(() => {
    if (!decision || !decision.timerMs || picked) return
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 100))
    }, 100)
    return () => clearInterval(interval)
  }, [decision, picked])

  // Auto-fire worst option on timeout
  useEffect(() => {
    if (!decision || !decision.timerMs || picked) return
    if (timeLeft === 0 && decision.timerMs > 0) {
      const wrong = decision.options.find((o) => !o.isCorrect) ?? decision.options[0]
      handlePick(wrong.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  function handlePick(optionId: string) {
    if (!decision || picked) return
    const option = decision.options.find((o) => o.id === optionId)
    if (!option) return
    setPicked(optionId)
    if (!option.isCorrect) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    // Brief delay so the user sees their selection highlighted
    setTimeout(() => {
      applyEffects(option.consequences)
      closeDecision()
    }, 850)
  }

  if (!decision) return null

  const timerPct = decision.timerMs ? (timeLeft / decision.timerMs) * 100 : 0

  return (
    <Dialog open={!!decisionId} onOpenChange={(o) => !o && closeDecision()}>
      <DialogContent
        showClose={false}
        className={cn('max-w-2xl', shake && 'animate-shake')}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{decision.prompt}</DialogTitle>
        </DialogHeader>
        {decision.timerMs && (
          <div className="-mt-2">
            <Progress
              value={timerPct}
              indicatorClassName={cn(
                timerPct > 50
                  ? 'bg-primary'
                  : timerPct > 20
                    ? 'bg-accent'
                    : 'bg-destructive',
              )}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Decidí rápido — {(timeLeft / 1000).toFixed(1)}s
            </p>
          </div>
        )}

        <div className="grid gap-2">
          {decision.options.map((opt, i) => {
            const isPicked = picked === opt.id
            return (
              <motion.button
                key={opt.id}
                type="button"
                disabled={!!picked}
                onClick={() => handlePick(opt.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 380, damping: 26 }}
                whileHover={!picked ? { x: 4 } : undefined}
                className={cn(
                  'text-left rounded-lg border px-4 py-3 transition-colors',
                  'hover:bg-secondary/70 disabled:cursor-not-allowed',
                  !isPicked && 'border-border bg-secondary/40',
                  isPicked && opt.isCorrect && 'border-emerald-500 bg-emerald-500/15',
                  isPicked && !opt.isCorrect && 'border-destructive bg-destructive/15',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-muted-foreground mt-0.5 shrink-0">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className="text-base font-medium">{opt.label}</span>
                </div>
                {isPicked && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-sm text-muted-foreground"
                  >
                    {opt.feedback}
                  </motion.p>
                )}
              </motion.button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
