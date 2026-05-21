import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 15 — "Barco Pirata"
 * Captain's quarters on a pirate galleon. Oak-paneled walls, treasure map
 * on wall, compass + telescope on desk, gunpowder barrel, treasure chest,
 * porthole windows showing stormy sea, hanging lantern swaying.
 */
export function PirateScene({ state }: Props) {
  const compass = !!state.flags.pi_compass
  const map = !!state.flags.pi_map
  const powder = !!state.flags.pi_powder
  const cannon = !!state.flags.pi_cannon
  const allOpen = compass && map && powder && cannon

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Barco pirata">
      <defs>
        <linearGradient id="piWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3520" />
          <stop offset="100%" stopColor="#2a1709" />
        </linearGradient>
        <linearGradient id="piFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c4d2f" />
          <stop offset="100%" stopColor="#3f2415" />
        </linearGradient>
        <linearGradient id="piSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0c1230" />
        </linearGradient>
        <linearGradient id="piMap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#a16e3e" />
        </linearGradient>
        <linearGradient id="piBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#piWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#piFloor)" />
      {/* oak planks horizontal */}
      {[10, 18, 26, 34].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#1c0e06" strokeOpacity="0.45" strokeWidth="0.2" />
      ))}
      {/* floor planks */}
      {[14, 28, 44, 60, 76, 92].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 4} y2="56" stroke="#1c0e06" strokeOpacity="0.5" strokeWidth="0.2" />
      ))}

      {/* Two portholes with stormy sea */}
      {[[14, 14], [86, 14]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <circle r="6" fill="#0a0a0a" />
          <circle r="5.4" fill="url(#piSea)" />
          {/* sea waves */}
          <motion.path
            d="M -5 2 Q -2 0, 0 2 Q 2 4, 5 2"
            stroke="#3b82f6" strokeWidth="0.2" fill="none"
            animate={{ d: ['M -5 2 Q -2 0, 0 2 Q 2 4, 5 2', 'M -5 1 Q -2 3, 0 1 Q 2 -1, 5 1', 'M -5 2 Q -2 0, 0 2 Q 2 4, 5 2'] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          />
          {/* brass rivets */}
          {[0, 60, 120, 180, 240, 300].map((d) => {
            const a = (d * Math.PI) / 180
            return <circle key={d} cx={6.4 * Math.cos(a)} cy={6.4 * Math.sin(a)} r="0.32" fill="#fbbf24" />
          })}
        </g>
      ))}

      {/* CENTER WALL — treasure map */}
      <g>
        <rect x="30" y="6" width="40" height="20" fill="url(#piMap)" stroke="#7c2d12" strokeWidth="0.35" />
        {/* burnt edges */}
        <path d="M 30 6 L 33 8 L 30 10 Z M 67 22 L 70 24 L 70 20 Z" fill="#1c0e06" />
        {/* island */}
        <path d="M 36 15 Q 42 12, 50 14 Q 60 13, 64 18 L 60 22 L 42 22 Z" fill="#15803d" opacity="0.7" />
        {/* X marks the spot */}
        <g transform="translate(55 17)">
          <line x1="-1.5" y1="-1.5" x2="1.5" y2="1.5" stroke="#dc2626" strokeWidth="0.4" />
          <line x1="-1.5" y1="1.5" x2="1.5" y2="-1.5" stroke="#dc2626" strokeWidth="0.4" />
        </g>
        {/* compass rose */}
        <g transform="translate(38 10)">
          <circle r="1.5" fill="none" stroke="#7c2d12" strokeWidth="0.2" />
          <path d="M 0 -1.4 L 0.3 0 L 0 1.4 L -0.3 0 Z" fill="#1c0e06" />
          <text y="-2.2" fontSize="0.7" textAnchor="middle" fill="#1c0e06" fontFamily="serif">N</text>
        </g>
        <text x="50" y="9" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#7c2d12" fontFamily="serif">MAPA DEL TESORO</text>
        {/* cipher numbers carved at bottom */}
        <text x="50" y="25" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#1c0e06" fontFamily="serif">8 · 21 · 18 · 20 · 15</text>
      </g>

      {/* LEFT FLOOR — captain's desk with compass + telescope */}
      <g>
        <rect x="3" y="32" width="22" height="3" fill="#5a3520" stroke="#1c0e06" strokeWidth="0.3" />
        <rect x="4" y="35" width="3" height="6" fill="#3f2415" />
        <rect x="21" y="35" width="3" height="6" fill="#3f2415" />
        {/* Compass (rotation puzzle) */}
        <g transform="translate(10 30)">
          <circle r="3.2" fill="url(#piBrass)" stroke="#854d0e" strokeWidth="0.3" />
          <circle r="2.6" fill="#1e293b" stroke="#854d0e" strokeWidth="0.2" />
          {/* cardinal letters */}
          {['N', 'E', 'S', 'O'].map((c, i) => {
            const a = ((i * 90 - 90) * Math.PI) / 180
            return (
              <text key={c} x={2.1 * Math.cos(a)} y={2.1 * Math.sin(a) + 0.3} textAnchor="middle" fontSize="0.7" fill="#fbbf24" fontFamily="serif">{c}</text>
            )
          })}
          {/* needle */}
          <motion.path
            d="M 0 -2 L 0.3 0 L 0 2 L -0.3 0 Z"
            fill={compass ? '#10b981' : '#dc2626'}
            animate={compass ? { rotate: 0 } : { rotate: [0, 25, -15, 30, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ transformOrigin: '0 0' }}
          />
        </g>
        {/* Telescope */}
        <g transform="translate(20 31) rotate(-20)">
          <rect x="-3" y="-0.4" width="6" height="0.8" fill="url(#piBrass)" stroke="#854d0e" strokeWidth="0.2" rx="0.2" />
          <rect x="3" y="-0.5" width="0.5" height="1" fill="#0a0a0a" />
        </g>
      </g>

      {/* RIGHT FLOOR — gunpowder barrel + cannon */}
      <g>
        {/* gunpowder barrel */}
        <g transform="translate(78 34)">
          <ellipse cx="0" cy="6" rx="4" ry="0.6" fill="#000" opacity="0.6" />
          <rect x="-3.5" y="0" width="7" height="6" fill="#7c4d2f" stroke="#3f2415" strokeWidth="0.3" />
          <ellipse cx="0" cy="0" rx="3.5" ry="0.7" fill="#92592f" />
          {[2, 4].map((y) => (
            <rect key={y} x="-3.5" y={y} width="7" height="0.5" fill="#1c0e06" />
          ))}
          <text x="0" y="3.5" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#fef3c7" fontFamily="monospace">PÓLVORA</text>
        </g>
        {/* cannon (small, on right wall) */}
        <g transform="translate(90 34)">
          <rect x="-3" y="-1.5" width="6" height="3" fill="#1e293b" rx="0.4" />
          <circle cx="-2.5" cy="0" r="1.2" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.2" />
          <circle cx="2.5" cy="0" r="1.2" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.2" />
          <rect x="3" y="-0.6" width="3" height="1.2" fill="#475569" />
          {!cannon && (
            <motion.path
              d="M 3.5 -0.8 L 4.5 -1.8 L 4 -2 L 3.5 -0.8 Z"
              fill="#fbbf24"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </g>
      </g>

      {/* Hanging lantern (sways) */}
      <motion.g
        transform="translate(50 4)"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 0' }}
      >
        <line x1="0" y1="0" x2="0" y2="2" stroke="#3f2415" strokeWidth="0.2" />
        <rect x="-1.2" y="2" width="2.4" height="3" fill="url(#piBrass)" stroke="#854d0e" strokeWidth="0.2" />
        <motion.circle cx="0" cy="3.5" r="0.5" fill="#fef3c7" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </motion.g>

      {/* Treasure chest (exit, only after all 4) */}
      <g>
        {allOpen ? (
          <g transform="translate(50 45)">
            <rect x="-7" y="0" width="14" height="6" fill="#5a3520" stroke="#3f2415" strokeWidth="0.4" />
            <path d="M -7 0 Q 0 -4, 7 0" fill="#7c4d2f" stroke="#3f2415" strokeWidth="0.4" />
            <rect x="-7" y="-1" width="14" height="1" fill="#fbbf24" />
            {/* glowing gold */}
            <motion.ellipse cx="0" cy="-1" rx="6" ry="1.4" fill="#fef3c7" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <text x="0" y="3" textAnchor="middle" fontSize="1.5" fontWeight="bold" fill="#fef3c7" fontFamily="serif">¡TESORO!</text>
          </g>
        ) : (
          <g transform="translate(50 45)">
            <rect x="-7" y="0" width="14" height="6" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.4" />
            <path d="M -7 0 Q 0 -3, 7 0" fill="#5a3520" stroke="#1c0e06" strokeWidth="0.4" />
            <rect x="-1" y="2.5" width="2" height="2" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.15" />
            <circle cx="0" cy="3.5" r="0.3" fill="#1c0e06" />
          </g>
        )}
      </g>

      {/* Map heading clue after compass solved */}
      {compass && (
        <g>
          <motion.ellipse cx="50" cy="38" rx="6" ry="1" fill="#fbbf24" animate={{ opacity: [0.06, 0.18, 0.06] }} transition={{ duration: 2.4, repeat: Infinity }} />
          <motion.text x="50" y="38.6" textAnchor="middle" fontSize="1.3" fontWeight="bold" fill="#fde68a" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.5px #fbbf24)' }} opacity="0.7" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity }}>
            rumbo: NORTE
          </motion.text>
        </g>
      )}
    </svg>
  )
}
