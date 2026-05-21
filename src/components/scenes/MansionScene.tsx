import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 19 — "Mansión Victoriana"
 * Gothic parlor: candelabra (lights-out), bay window with night sky
 * (constellation), portrait wall, locked front door.
 */
export function MansionScene({ state }: Props) {
  const candles = !!state.flags.mn_candles
  const stars = !!state.flags.mn_stars
  const word = !!state.flags.mn_word
  const allOpen = candles && stars && word

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Mansión victoriana"
    >
      <defs>
        <linearGradient id="mnWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c1810" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="mnFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f2a1a" />
          <stop offset="100%" stopColor="#1c1410" />
        </linearGradient>
        <linearGradient id="mnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="mnGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="44" fill="url(#mnWall)" />
      <rect x="0" y="44" width="100" height="12" fill="url(#mnFloor)" />

      {/* Wallpaper damask pattern (subtle) */}
      {Array.from({ length: 18 }).map((_, i) => (
        <text
          key={i}
          x={(i % 6) * 17 + 5}
          y={Math.floor(i / 6) * 14 + 12}
          fontSize="3"
          opacity="0.05"
          fill="#92400e"
          fontFamily="serif"
        >
          ❦
        </text>
      ))}

      {/* Floor boards */}
      {[10, 30, 50, 70, 90].map((x) => (
        <line key={x} x1={x} y1="44" x2={x - 3} y2="56" stroke="#1c1410" strokeWidth="0.3" />
      ))}

      {/* LEFT — bay window with starry night sky (constellation puzzle) */}
      <g>
        <rect x="3" y="6" width="22" height="30" fill="url(#mnSky)" stroke="#5a3a20" strokeWidth="0.5" />
        {/* window frame cross */}
        <line x1="14" y1="6" x2="14" y2="36" stroke="#5a3a20" strokeWidth="0.4" />
        <line x1="3" y1="21" x2="25" y2="21" stroke="#5a3a20" strokeWidth="0.4" />
        <rect x="3" y="6" width="22" height="2" fill="#5a3a20" />
        <rect x="3" y="34" width="22" height="2" fill="#5a3a20" />
        {/* Decorative stars in window */}
        {[
          [6, 10], [9, 14], [12, 11], [10, 25], [18, 14], [22, 18], [16, 30], [21, 28], [7, 30],
        ].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="0.4"
            fill="#fde68a"
            animate={stars ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.5 }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity }}
          />
        ))}
        {/* Crescent moon */}
        <path d="M 20 11 a 2 2 0 1 0 0.5 -3 a 1.5 1.5 0 1 1 -0.5 3 z" fill="#fef3c7" opacity="0.85" />
      </g>

      {/* CENTER — candelabra on a side table (lights-out hotspot) */}
      <g transform="translate(50 30)">
        {/* table */}
        <rect x="-8" y="6" width="16" height="2" fill="#3f2a1a" stroke="#000" strokeWidth="0.2" />
        <rect x="-6" y="8" width="2" height="6" fill="#3f2a1a" />
        <rect x="4" y="8" width="2" height="6" fill="#3f2a1a" />
        {/* candelabra base */}
        <rect x="-3" y="2" width="6" height="4" fill="#7c2d12" stroke="#000" strokeWidth="0.2" />
        <rect x="-0.4" y="-9" width="0.8" height="11" fill="#7c2d12" />
        {/* arms */}
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <g key={i}>
            <line x1="0" y1={-4 + i * 0.4} x2={x * 1.5} y2={-6 - Math.abs(x) * 0.3} stroke="#7c2d12" strokeWidth="0.3" />
            <rect x={x * 1.5 - 0.4} y={-8 - Math.abs(x) * 0.3} width="0.8" height="1.5" fill="#fef3c7" />
            {!candles && (
              <motion.path
                d={`M ${x * 1.5} ${-8.5 - Math.abs(x) * 0.3} q -0.3 -0.3 0 -0.8 q 0.3 0.4 0 0.8 z`}
                fill="#fbbf24"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1 + i * 0.1, repeat: Infinity }}
              />
            )}
          </g>
        ))}
        {!candles && <circle cx="0" cy="-6" r="7" fill="url(#mnGlow)" />}
      </g>

      {/* RIGHT — portrait wall (word puzzle hotspot, name plaque) */}
      <g>
        <rect x="73" y="6" width="22" height="30" fill="#1c1410" stroke="#5a3a20" strokeWidth="0.4" />
        {/* portrait frame */}
        <rect x="76" y="9" width="16" height="20" fill="#92400e" stroke="#000" strokeWidth="0.3" />
        <rect x="77.5" y="10.5" width="13" height="17" fill="#1c1410" />
        {/* silhouette portrait */}
        <circle cx="84" cy="15.5" r="2.5" fill="#3f2a1a" />
        <path d="M 79 27 Q 84 18 89 27 Z" fill="#3f2a1a" />
        {/* tarnished plaque */}
        <rect x="76" y="31" width="16" height="3" fill="#78350f" stroke="#000" strokeWidth="0.2" />
        <text x="84" y="33.2" textAnchor="middle" fontSize="1.5" fill="#fbbf24" fontFamily="serif" fontStyle="italic">
          ¿? — 1879
        </text>
      </g>

      {/* CENTER — exit door (visible when all flags set) */}
      <g>
        {allOpen ? (
          <g>
            <rect x="40" y="14" width="20" height="30" fill="#0a0a0a" stroke="#5a3a20" strokeWidth="0.4" />
            <rect x="41" y="15" width="18" height="28" fill="#fef3c7" opacity="0.2" />
            <text x="50" y="32" textAnchor="middle" fontSize="2.5" fill="#fef3c7" fontFamily="serif">SALIDA</text>
          </g>
        ) : (
          <g>
            <rect x="40" y="14" width="20" height="30" fill="#2c1810" stroke="#5a3a20" strokeWidth="0.4" />
            <rect x="42" y="16" width="7" height="26" fill="#3f2a1a" stroke="#1c1410" strokeWidth="0.2" />
            <rect x="51" y="16" width="7" height="26" fill="#3f2a1a" stroke="#1c1410" strokeWidth="0.2" />
            {/* knob */}
            <circle cx="56" cy="29" r="0.6" fill="#fbbf24" />
            {/* keyhole */}
            <circle cx="44" cy="29" r="0.4" fill="#000" />
            <rect x="43.8" y="29" width="0.4" height="1.4" fill="#000" />
          </g>
        )}
      </g>

      {/* Cobwebs in corners */}
      <path d="M 0 0 L 4 0 L 0 4 Z" fill="none" stroke="#94a3b8" strokeWidth="0.15" opacity="0.4" />
      <path d="M 96 0 L 100 0 L 100 4 Z" fill="none" stroke="#94a3b8" strokeWidth="0.15" opacity="0.4" />
    </svg>
  )
}
