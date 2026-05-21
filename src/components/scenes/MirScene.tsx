import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 18 — "Estación Mir Abandonada"
 * Zero-G Soviet station. Cyrillic panels, exposed oxygen pipes, an emergency
 * airlock, a cipher panel and a hatch. Pressure gauge swings, debris drifts.
 */
export function MirScene({ state }: Props) {
  const pipes = !!state.flags.mir_pipes
  const cipher = !!state.flags.mir_cipher
  const airlock = !!state.flags.mir_airlock
  const allOpen = pipes && cipher && airlock

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Estación Mir abandonada"
    >
      <defs>
        <linearGradient id="mirWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="mirPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="mirRedAlarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="100" height="56" fill="url(#mirWall)" />

      {/* Red emergency wash over upper area */}
      <motion.rect
        x="0"
        y="0"
        width="100"
        height="40"
        fill="url(#mirRedAlarm)"
        animate={{ opacity: allOpen ? 0 : [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />

      {/* Floor (catwalk grating) */}
      <rect x="0" y="48" width="100" height="8" fill="#1e293b" stroke="#334155" strokeWidth="0.2" />
      {[10, 25, 40, 55, 70, 85].map((x) => (
        <line key={x} x1={x} y1="48" x2={x} y2="56" stroke="#0f172a" strokeWidth="0.4" />
      ))}

      {/* Ceiling panels with rivets */}
      {[15, 35, 55, 75].map((x, i) => (
        <g key={i}>
          <rect x={x} y="0" width="14" height="5" fill="url(#mirPanel)" stroke="#0f172a" strokeWidth="0.3" />
          <circle cx={x + 2} cy="2.5" r="0.4" fill="#334155" />
          <circle cx={x + 12} cy="2.5" r="0.4" fill="#334155" />
        </g>
      ))}

      {/* Cyrillic warning sign */}
      <g transform="translate(86 6)">
        <rect width="12" height="6" fill="#fbbf24" stroke="#000" strokeWidth="0.2" />
        <text x="6" y="4.2" textAnchor="middle" fontSize="2.2" fontWeight="bold" fill="#000" fontFamily="monospace">
          ОПАСНО
        </text>
      </g>

      {/* LEFT — oxygen pipes panel (hotspot: pipe puzzle) */}
      <g>
        <rect x="3" y="20" width="22" height="28" fill="#1e293b" stroke="#334155" strokeWidth="0.4" rx="0.4" />
        <text x="14" y="24" textAnchor="middle" fontSize="1.6" fill="#94a3b8" fontFamily="monospace">КИСЛОРОД</text>
        {/* Stylized pipe lattice (decorative) */}
        {[26, 30, 34, 38, 42].map((y) => (
          <line key={y} x1="5" y1={y} x2="23" y2={y} stroke="#475569" strokeWidth="0.6" />
        ))}
        {[7, 13, 19].map((x) => (
          <line key={x} x1={x} y1="26" x2={x} y2="42" stroke="#475569" strokeWidth="0.6" />
        ))}
        {/* Valve indicator */}
        <circle cx="14" cy="46" r="1" fill={pipes ? '#10b981' : '#ef4444'} />
        {pipes && (
          <motion.circle
            cx="14"
            cy="46"
            r="1.5"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.3"
            animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
      </g>

      {/* CENTER — Caesar cipher console (hotspot: cipher puzzle) */}
      <g transform="translate(35 22)">
        <rect width="28" height="22" fill="url(#mirPanel)" stroke="#334155" strokeWidth="0.4" rx="0.4" />
        <rect x="2" y="2" width="24" height="10" fill="#020617" stroke="#475569" strokeWidth="0.3" />
        {/* Cyrillic-looking jumble in the screen */}
        <text x="14" y="6" textAnchor="middle" fontSize="1.6" fill="#a5f3fc" fontFamily="monospace">
          ШИФР 3
        </text>
        <text x="14" y="9" textAnchor="middle" fontSize="1.4" fill="#67e8f9" fontFamily="monospace">
          ХОЦОЕА
        </text>
        {/* Numpad */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={3 + col * 3}
              y={14 + row * 2.5}
              width="2.4"
              height="2"
              fill="#475569"
              stroke="#0f172a"
              strokeWidth="0.15"
              rx="0.2"
            />
          )),
        )}
        {/* Solved LED */}
        <circle cx="23" cy="18" r="0.7" fill={cipher ? '#10b981' : '#475569'} />
      </g>

      {/* RIGHT — Airlock hatch with pressure gauge (hotspot: airlock timing) */}
      <g transform="translate(72 18)">
        {/* circular hatch */}
        <circle cx="13" cy="14" r="11" fill="#0f172a" stroke="#475569" strokeWidth="0.6" />
        <circle cx="13" cy="14" r="9" fill="#1e293b" stroke="#334155" strokeWidth="0.4" />
        {/* bolts around the hatch */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8
          const x = 13 + Math.cos(angle) * 9.5
          const y = 14 + Math.sin(angle) * 9.5
          return <circle key={i} cx={x} cy={y} r="0.4" fill="#64748b" />
        })}
        {/* wheel */}
        <motion.g
          animate={airlock ? { rotate: 90 } : { rotate: 0 }}
          style={{ transformOrigin: '13px 14px' }}
        >
          <circle cx="13" cy="14" r="4" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
          <line x1="9" y1="14" x2="17" y2="14" stroke="#fbbf24" strokeWidth="0.5" />
          <line x1="13" y1="10" x2="13" y2="18" stroke="#fbbf24" strokeWidth="0.5" />
        </motion.g>
        {/* gauge */}
        <g transform="translate(0 0)">
          <rect x="0" y="0" width="6" height="6" fill="#0f172a" stroke="#475569" strokeWidth="0.3" rx="0.4" />
          <circle cx="3" cy="3" r="2.2" fill="#020617" stroke="#475569" strokeWidth="0.2" />
          <motion.line
            x1="3"
            y1="3"
            x2="3"
            y2="1.2"
            stroke="#ef4444"
            strokeWidth="0.3"
            style={{ transformOrigin: '3px 3px' }}
            animate={{ rotate: airlock ? -30 : [60, 80, 65] }}
            transition={{ duration: 1.6, repeat: airlock ? 0 : Infinity }}
          />
        </g>
      </g>

      {/* Floating debris (zero-G) */}
      <motion.circle
        cx="20"
        cy="8"
        r="0.5"
        fill="#94a3b8"
        animate={{ x: [0, 6, -2, 0], y: [0, 3, -4, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.rect
        x="60"
        y="50"
        width="1"
        height="0.4"
        fill="#cbd5e1"
        animate={{ x: [0, -10, 4, 0], y: [0, -7, 2, 0], rotate: [0, 90, 180, 360] }}
        transition={{ duration: 18, repeat: Infinity }}
      />
      <motion.circle
        cx="50"
        cy="12"
        r="0.3"
        fill="#cbd5e1"
        animate={{ x: [0, 8, -3, 0], y: [0, -4, 6, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
    </svg>
  )
}
