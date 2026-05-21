import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 20 — "Asalto de Precisión"
 * Vault room: laser grid (timing puzzle), big circular vault (mastermind),
 * a control kiosk with a code, marble floor, security cameras.
 */
export function HeistScene({ state }: Props) {
  const lasers = !!state.flags.hs_lasers
  const vault = !!state.flags.hs_vault
  const code = !!state.flags.hs_code
  const allOpen = lasers && vault && code

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Sala de bóveda"
    >
      <defs>
        <linearGradient id="hsWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1917" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="hsMarble" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="50%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>
        <radialGradient id="hsLaser" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="44" fill="url(#hsWall)" />
      <rect x="0" y="44" width="100" height="12" fill="url(#hsMarble)" />
      {/* Marble tiles */}
      {[16, 32, 48, 64, 80].map((x) => (
        <line key={x} x1={x} y1="44" x2={x - 2} y2="56" stroke="#0a0a0a" strokeWidth="0.3" opacity="0.4" />
      ))}

      {/* Security cameras (corners) */}
      {[
        { x: 5, y: 4 },
        { x: 95, y: 4 },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x - 1.5} y={c.y - 0.4} width="3" height="1.2" fill="#1c1917" />
          <rect x={c.x - 0.4} y={c.y - 1.5} width="0.8" height="1.4" fill="#1c1917" />
          <motion.circle
            cx={c.x}
            cy={c.y}
            r="0.35"
            fill="#ef4444"
            animate={{ opacity: allOpen ? 0.3 : [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </g>
      ))}

      {/* LEFT — laser grid corridor (timing puzzle hotspot) */}
      <g>
        <rect x="3" y="14" width="22" height="30" fill="#1c1917" stroke="#3f3f46" strokeWidth="0.3" />
        {/* Lasers */}
        {[18, 22, 26, 30, 34, 38].map((y) => (
          <motion.line
            key={y}
            x1="5"
            y1={y}
            x2="23"
            y2={y}
            stroke={lasers ? '#10b981' : '#ef4444'}
            strokeWidth="0.3"
            animate={lasers ? { opacity: 0.2 } : { opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: y * 0.04 }}
          />
        ))}
        {/* Emitter dots */}
        {[18, 22, 26, 30, 34, 38].map((y) => (
          <g key={y}>
            <circle cx="5" cy={y} r="0.4" fill={lasers ? '#10b981' : '#ef4444'} />
            <circle cx="23" cy={y} r="0.4" fill={lasers ? '#10b981' : '#ef4444'} />
          </g>
        ))}
        <text x="14" y="13" textAnchor="middle" fontSize="1.4" fill="#94a3b8" fontFamily="monospace">CORREDOR-A</text>
        {!lasers && <rect x="3" y="14" width="22" height="30" fill="url(#hsLaser)" opacity="0.2" />}
      </g>

      {/* CENTER — circular vault (mastermind hotspot) */}
      <g transform="translate(50 28)">
        <circle cx="0" cy="0" r="14" fill="#27272a" stroke="#71717a" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="12" fill="#1c1917" stroke="#52525b" strokeWidth="0.4" />
        {/* Bolts */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12
          const x = Math.cos(angle) * 13
          const y = Math.sin(angle) * 13
          return <circle key={i} cx={x} cy={y} r="0.4" fill="#71717a" />
        })}
        {/* Center dial */}
        <motion.g
          animate={vault ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1.4 }}
          style={{ transformOrigin: '0px 0px' }}
        >
          <circle cx="0" cy="0" r="5" fill="#3f3f46" stroke="#fbbf24" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="2" fill="#fbbf24" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 12
            const x = Math.cos(angle) * 4.2
            const y = Math.sin(angle) * 4.2
            return <circle key={i} cx={x} cy={y} r="0.2" fill="#fbbf24" />
          })}
          <line x1="0" y1="-5" x2="0" y2="-3" stroke="#fef3c7" strokeWidth="0.4" />
        </motion.g>
        {/* LED row at bottom */}
        {[-3, -1, 1, 3].map((x, i) => (
          <circle key={i} cx={x} cy="10" r="0.5" fill={vault ? '#10b981' : '#52525b'} />
        ))}
      </g>

      {/* RIGHT — security kiosk with code keypad (hotspot: code puzzle) */}
      <g>
        <rect x="73" y="20" width="22" height="24" fill="#1c1917" stroke="#3f3f46" strokeWidth="0.3" />
        <text x="84" y="24" textAnchor="middle" fontSize="1.4" fill="#94a3b8" fontFamily="monospace">CONTROL</text>
        <rect x="76" y="26" width="16" height="6" fill="#020617" stroke="#3f3f46" strokeWidth="0.2" />
        <text x="84" y="30" textAnchor="middle" fontSize="2" fill={code ? '#10b981' : '#ef4444'} fontFamily="monospace">
          {code ? 'AUTORIZADO' : '— — — —'}
        </text>
        {/* numpad */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={77 + col * 4.5}
              y={33 + row * 2.4}
              width="3.8"
              height="2"
              fill="#3f3f46"
              stroke="#0f0f0f"
              strokeWidth="0.15"
              rx="0.3"
            />
          )),
        )}
      </g>

      {/* CENTER — gold bars on the floor when vault is open */}
      {allOpen && (
        <g>
          {[42, 47, 52, 57].map((x, i) => (
            <motion.rect
              key={i}
              x={x}
              y={49}
              width="3.5"
              height="1.6"
              fill="#fbbf24"
              stroke="#92400e"
              strokeWidth="0.2"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 49, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          ))}
        </g>
      )}

      {/* Floor reflection of dial */}
      <ellipse cx="50" cy="50" rx="14" ry="1" fill="#fbbf24" opacity="0.08" />
    </svg>
  )
}
