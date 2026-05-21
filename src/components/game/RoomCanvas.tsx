import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/store/useGameStore'
import { evaluate } from '@/engine/conditionEvaluator'
import { Hotspot } from './Hotspot'
import { DarknessOverlay } from './DarknessOverlay'
import { getScene } from '@/components/scenes/registry'
import { cn } from '@/lib/cn'

export function RoomCanvas() {
  const level = useGameStore((s) => s.level)
  const player = useGameStore((s) => s.player)
  const applyEffects = useGameStore((s) => s.applyEffects)
  const stageRef = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })

  if (!level || !player.currentRoomId) return null
  const room = level.rooms[player.currentRoomId]
  if (!room) return null

  const visibleHotspots = room.hotspots.filter((h) => evaluate(h.visibleWhen, player))
  const overlayVisible = room.overlay && evaluate(room.overlay.visibleWhen, player)
  const Scene = getScene(room.sceneKey)
  const dark = room.darkness
  const hasLight = dark
    ? player.inventory.some((e) => e.itemId === dark.lightSourceItem && e.quantity > 0)
    : true

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!dark || !stageRef.current) return
    const r = stageRef.current.getBoundingClientRect()
    setPointer({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    })
  }

  return (
    <div className="relative w-full">
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        className="relative w-full aspect-video overflow-hidden rounded-2xl border border-border shadow-2xl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={room.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={cn('absolute inset-0', !Scene && room.background)}
          >
            {Scene && <Scene state={player} />}

            {!Scene && (
              <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:24px_24px]" />
            )}

            {overlayVisible && room.overlay && <div className={room.overlay.className} />}

            {/* Darkness overlay sits ABOVE the scene art but BELOW hotspots,
                so the player still gets click feedback even in pitch black. */}
            {dark && <DarknessOverlay x={pointer.x} y={pointer.y} hasLight={hasLight} />}

            <div className="absolute inset-0">
              {visibleHotspots.map((h) => (
                <Hotspot
                  key={h.id}
                  hotspot={h}
                  onClick={() => applyEffects(h.onClick)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* "It's dark" prompt when player lacks light */}
        {dark && !hasLight && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-md bg-card/95 border border-border text-xs text-muted-foreground backdrop-blur">
            Está oscuro. Necesitás algo para iluminar.
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
        <span>{room.name}</span>
        <span>
          {dark && !hasLight ? '? elementos visibles' : `${visibleHotspots.length} elementos visibles`}
        </span>
      </div>
    </div>
  )
}
