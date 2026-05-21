import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Hotspot as HotspotType } from '@/types/game'
import { cn } from '@/lib/cn'

interface Props {
  hotspot: HotspotType
  onClick: () => void
}

const CURSOR_CLASS: Record<string, string> = {
  look: 'cursor-help',
  grab: 'cursor-grab',
  use: 'cursor-pointer',
  enter: 'cursor-pointer',
}

/**
 * Invisible-at-rest hotspot. The player only discovers it when their cursor
 * sweeps over it: the cursor changes (per `cursor` field) and a small label
 * tooltip appears. No idle pulse, no dashed border — purely a hidden-object
 * style hint. Clicks emit a quick ripple for click feedback.
 */
export function Hotspot({ hotspot, onClick }: Props) {
  const [ripples, setRipples] = useState<number[]>([])

  function handleClick() {
    const id = Date.now()
    setRipples((r) => [...r, id])
    setTimeout(() => setRipples((r) => r.filter((rid) => rid !== id)), 700)
    onClick()
  }

  return (
    <motion.button
      type="button"
      aria-label={hotspot.label}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'absolute group rounded-md overflow-visible',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        CURSOR_CLASS[hotspot.cursor ?? 'use'],
      )}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.w}%`,
        height: `${hotspot.h}%`,
        background: 'transparent',
        border: 'none',
      }}
    >
      {/* Label tooltip — only shows when hovered, positioned above the hotspot */}
      <span
        className={cn(
          'pointer-events-none absolute left-1/2 -translate-x-1/2 -top-7',
          'text-[11px] font-medium text-foreground bg-card/95 backdrop-blur',
          'px-2 py-0.5 rounded-md border border-border whitespace-nowrap',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          'shadow-md',
        )}
      >
        {hotspot.label}
      </span>

      {/* Click ripple */}
      <AnimatePresence>
        {ripples.map((id) => (
          <motion.span
            key={id}
            className="pointer-events-none absolute inset-1/2 rounded-full bg-primary/30"
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.7 }}
            animate={{ width: '180%', height: '180%', x: '-90%', y: '-90%', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  )
}
