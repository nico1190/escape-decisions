import * as Icons from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'
import { ITEMS } from '@/data/items/itemRegistry'
import { Backpack, Package } from 'lucide-react'
import { getItemIcon } from '@/components/scenes/itemIcons'

export function InventoryBar() {
  const inventory = useGameStore((s) => s.player.inventory)
  const applyEffects = useGameStore((s) => s.applyEffects)

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/80 backdrop-blur border border-border">
      <Backpack className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="text-xs uppercase tracking-widest text-muted-foreground shrink-0">
        Inventario
      </div>
      <div className="flex-1 flex items-center gap-2 min-h-[72px]">
        <AnimatePresence mode="popLayout">
          {inventory.length === 0 && (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground/60 italic"
            >
              vacío — los objetos que recojas aparecen acá. Click para usarlos.
            </motion.span>
          )}
          {inventory.map((entry) => {
            const item = ITEMS[entry.itemId]
            if (!item) return null
            // Prefer custom illustrated icon, fall back to Lucide by name
            const Custom = getItemIcon(item.icon)
            const Lucide =
              (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                item.icon
              ] ?? Package
            const Icon: React.ComponentType<{ className?: string }> = Custom ?? Lucide
            const usable = !!item.onUse?.length

            return (
              <motion.button
                key={entry.itemId}
                type="button"
                layout
                layoutId={`item-${entry.itemId}`}
                initial={{ scale: 0.5, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -10 }}
                whileHover={usable ? { y: -4, boxShadow: '0 8px 20px rgba(251,191,36,0.18)' } : undefined}
                whileTap={usable ? { scale: 0.94 } : undefined}
                transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                disabled={!usable}
                title={item.description}
                aria-label={`Usar ${item.name}`}
                onClick={() => usable && item.onUse && applyEffects(item.onUse)}
                className="group relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/70 hover:border-primary/60 transition-colors disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="h-9 w-9" />
                <span className="text-[10px] font-medium text-foreground max-w-[88px] text-center leading-tight">
                  {item.name}
                </span>
                {entry.quantity > 1 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-primary-foreground rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {entry.quantity}
                  </span>
                )}
                {usable && (
                  <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Usar
                  </span>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
