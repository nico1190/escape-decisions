import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 5 — "El Faro Abandonado"
 * Gothic / stormy. Top floor of a coastal lighthouse: rain streaks down the
 * round window, lantern on the desk, an old lamp mechanism in the center
 * with mirrored prisms (rotation puzzle), a logbook on the desk (cipher
 * clue), a brass door with keypad.
 */
export function LighthouseScene({ state }: Props) {
  const mirrors = !!state.flags.lh_mirrors
  const journal = !!state.flags.lh_journal
  const door = !!state.flags.lh_door
  const allOpen = mirrors && journal && door

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Faro abandonado">
      <defs>
        <linearGradient id="lhWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0b1220" />
        </linearGradient>
        <linearGradient id="lhFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f2415" />
          <stop offset="100%" stopColor="#1c0e06" />
        </linearGradient>
        <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <radialGradient id="stormSky" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <radialGradient id="lanternGlow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#lhWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#lhFloor)" />
      {/* wood planks */}
      {[12, 28, 44, 60, 76, 92].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 3} y2="56" stroke="#0a0a0a" strokeOpacity="0.7" strokeWidth="0.2" />
      ))}

      {/* round porthole / storm window */}
      <g transform="translate(50 17)">
        <circle r="11" fill="#1c0e06" />
        <circle r="10" fill="url(#stormSky)" />
        {/* lightning flash */}
        <motion.path
          d="M -3 -6 L -1 -1 L -3 1 L 2 6 L 0 1 L 2 -1 Z"
          fill="#fef3c7"
          animate={{ opacity: [0, 0, 0, 0.85, 0, 0, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeOut' }}
        />
        {/* rain streaks */}
        {[-7, -3, 1, 5, 8].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1={-9}
            x2={x - 1.5}
            y2={-4}
            stroke="#94a3b8"
            strokeWidth="0.15"
            animate={{ opacity: [0.2, 0.7, 0.2], y: [0, 3, 0] }}
            transition={{ duration: 0.5 + i * 0.07, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        {/* window cross frame */}
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#1c0e06" strokeWidth="0.3" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#1c0e06" strokeWidth="0.3" />
        {/* brass rivets */}
        {[0, 60, 120, 180, 240, 300].map((d) => {
          const a = (d * Math.PI) / 180
          return <circle key={d} cx={10.4 * Math.cos(a)} cy={10.4 * Math.sin(a)} r="0.35" fill="#fbbf24" />
        })}
      </g>

      {/* LEFT — old desk with logbook (cipher clue) */}
      <g>
        <rect x="3" y="36" width="22" height="2.6" fill="#5a3520" stroke="#2a1709" strokeWidth="0.3" />
        <rect x="4" y="38.6" width="3" height="6" fill="#3f2415" />
        <rect x="21" y="38.6" width="3" height="6" fill="#3f2415" />
        {/* logbook */}
        <g>
          <rect x="6" y="32.5" width="9" height="3.6" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.25" />
          <rect x="6.5" y="33" width="8" height="3" fill="#fef3c7" opacity="0.4" />
          {/* tiny text lines */}
          {[33.6, 34.4, 35.2].map((y, i) => (
            <line key={i} x1="7" y1={y} x2="14" y2={y} stroke="#1c0e06" strokeWidth="0.12" opacity={0.7 - i * 0.15} />
          ))}
          <text x="10.5" y="32.2" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#1c0e06" fontFamily="serif">
            DIARIO
          </text>
        </g>
        {/* lantern on desk */}
        <g transform="translate(20 32)">
          <rect x="-1" y="1" width="2" height="0.4" fill="#1c0e06" />
          <rect x="-1.5" y="-2.5" width="3" height="3.5" fill="url(#brass)" stroke="#854d0e" strokeWidth="0.3" rx="0.3" />
          <motion.circle cx="0" cy="-1" r="0.7" fill="#fef3c7" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <circle cx="0" cy="-1" r="6" fill="url(#lanternGlow)" />
          <line x1="0" y1="-2.5" x2="0" y2="-4" stroke="#1c0e06" strokeWidth="0.2" />
        </g>
      </g>

      {/* CENTER — lighthouse lamp mechanism with 3 mirror prisms (rotation puzzle target) */}
      <g transform="translate(50 42)">
        {/* base */}
        <ellipse cx="0" cy="3" rx="12" ry="1.4" fill="#000" opacity="0.6" />
        <rect x="-11" y="-1" width="22" height="4" fill="url(#brass)" stroke="#854d0e" strokeWidth="0.4" rx="0.4" />
        <rect x="-10" y="-1.2" width="20" height="0.6" fill="#fef3c7" opacity="0.3" />
        {/* the 3 nested mirror rings (visual cue) */}
        {[8, 5.5, 3].map((r, idx) => (
          <circle key={idx} r={r} fill="none" stroke={mirrors ? '#22d3ee' : '#cbd5e1'} strokeWidth="0.6" opacity="0.7" cy="-3" />
        ))}
        {/* central beam emission */}
        <circle cx="0" cy="-3" r="1.2" fill={mirrors ? '#22d3ee' : '#1e293b'} />
        {mirrors && (
          <motion.line
            x1="0" y1="-3" x2="0" y2="-50"
            stroke="#22d3ee" strokeWidth="1.6"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            opacity="0.6"
          />
        )}
      </g>

      {/* RIGHT — brass door with keypad */}
      <g>
        {allOpen ? (
          <g>
            <rect x="76" y="9" width="14" height="32" fill="#0a0a0a" />
            {/* light spill */}
            <rect x="77" y="10" width="12" height="30" fill="#22d3ee" opacity="0.18" />
            <text x="83" y="26" textAnchor="middle" fontSize="2" fill="#22d3ee" fontFamily="serif" fontWeight="bold">SALIDA</text>
          </g>
        ) : (
          <g>
            <rect x="76" y="9" width="14" height="32" fill="url(#brass)" stroke="#854d0e" strokeWidth="0.4" />
            <rect x="77" y="10" width="12" height="30" fill="#92750a" stroke="#854d0e" strokeWidth="0.25" />
            {/* rivet pattern */}
            {[12, 17, 22, 27, 32, 37].map((y) => (
              <g key={y}>
                <circle cx="78.5" cy={y} r="0.35" fill="#1c0e06" />
                <circle cx="87.5" cy={y} r="0.35" fill="#1c0e06" />
              </g>
            ))}
            {/* compass rose embossed */}
            <circle cx="83" cy="22" r="3" fill="none" stroke="#1c0e06" strokeWidth="0.3" />
            <path d="M 83 19 L 84 22 L 83 25 L 82 22 Z" fill="#854d0e" />
            <path d="M 80 22 L 83 21 L 86 22 L 83 23 Z" fill="#1c0e06" opacity="0.5" />
            {/* keypad to the right */}
            <rect x="91" y="20" width="5" height="8" fill="#1c0e06" stroke="#854d0e" strokeWidth="0.3" rx="0.3" />
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <rect key={`${row}-${col}`} x={91.4 + col * 1.4} y={20.4 + row * 1.7} width="1.2" height="1.4" rx="0.15" fill="#3f2415" stroke="#5a3520" strokeWidth="0.1" />
              )),
            )}
            <circle cx="93.5" cy="27.4" r="0.3" fill={door ? '#10b981' : '#ef4444'} />
          </g>
        )}
      </g>

      {/* Hint stone tablet on RIGHT wall — alphabet key for cipher */}
      <g>
        <rect x="28" y="32" width="10" height="6" fill="#5a3520" stroke="#2a1709" strokeWidth="0.3" />
        <text x="33" y="35" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#fef3c7" fontFamily="monospace" opacity="0.9">CLAVE</text>
        <text x="33" y="36.8" textAnchor="middle" fontSize="0.7" fill="#fef3c7" fontFamily="monospace" opacity="0.7">A=01 · Z=26</text>
      </g>

      {/* Subtle engraved code that appears after cipher solved */}
      {journal && (
        <g>
          <motion.ellipse
            cx="83" cy="13.5" rx="6" ry="1.2"
            fill="#fbbf24"
            animate={{ opacity: [0.06, 0.16, 0.06] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          {['8', '2', '5', '3'].map((d, i) => (
            <motion.text
              key={i}
              x={78 + i * 3.3}
              y="14.1"
              textAnchor="middle"
              fontSize="1.8"
              fontWeight="bold"
              fill="#fde68a"
              fontFamily="serif"
              style={{ filter: 'drop-shadow(0 0 0.6px #fbbf24)' }}
              opacity="0.72"
              animate={{ opacity: [0.55, 0.78, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.18 }}
            >
              {d}
            </motion.text>
          ))}
        </g>
      )}

      {/* rain on the floor */}
      <g opacity="0.4">
        <ellipse cx="40" cy="50" rx="3" ry="0.4" fill="#3b82f6" />
        <ellipse cx="60" cy="52" rx="2.4" ry="0.3" fill="#3b82f6" />
      </g>
    </svg>
  )
}
