import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 16 — "Volcán Activo"
 * Research outpost on the rim of an erupting volcano. Big window showing
 * lava + ash. Alarm panel, seismograph, escape pod door, control desk
 * with red blinking lights.
 */
export function VolcanoScene({ state }: Props) {
  const alarm = !!state.flags.vo_alarm
  const tremor = !!state.flags.vo_tremor
  const pod = !!state.flags.vo_pod
  const allOpen = alarm && tremor && pod

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Volcán">
      <defs>
        <linearGradient id="voWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f1a1a" />
          <stop offset="100%" stopColor="#0a0808" />
        </linearGradient>
        <linearGradient id="voFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1f1c" />
          <stop offset="100%" stopColor="#100a08" />
        </linearGradient>
        <linearGradient id="lava" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <radialGradient id="voGlow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="redEmer" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#voWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#voFloor)" />

      {/* Big observation window showing lava + erupting cone */}
      <g>
        <rect x="22" y="6" width="56" height="22" fill="#0a0a0a" stroke="#3f2415" strokeWidth="0.5" />
        <rect x="23" y="7" width="54" height="20" fill="#1c0e06" />
        {/* sky / smoke gradient */}
        <rect x="23" y="7" width="54" height="10" fill="url(#voGlow)" opacity="0.7" />
        {/* volcanic cone */}
        <path d="M 23 24 L 36 14 L 46 11 L 58 14 L 77 24 L 77 27 L 23 27 Z" fill="#2a1f1c" stroke="#000" strokeWidth="0.3" />
        {/* crater glow */}
        <ellipse cx="50" cy="13" rx="6" ry="2" fill="url(#lava)" opacity="0.9" />
        {/* lava streams */}
        <path d="M 50 14 Q 45 20, 38 24 L 35 27 L 42 27 Q 47 22, 50 14" fill="#dc2626" opacity="0.85" />
        <path d="M 50 14 Q 55 20, 60 24 L 65 27 L 58 27 Q 53 22, 50 14" fill="#dc2626" opacity="0.85" />
        {/* erupting particles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx={48 + i * 1.5}
            cy={11}
            r="0.3"
            fill="#fef3c7"
            animate={{
              cy: [11, 5 - i, 11],
              opacity: [1, 0, 1],
              cx: [48 + i * 1.5, 48 + i * 2.5, 48 + i * 1.5],
            }}
            transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        {/* smoke */}
        <motion.ellipse
          cx="50" cy="9" rx="8" ry="2.5"
          fill="#475569"
          opacity="0.4"
          animate={{ opacity: [0.3, 0.55, 0.3], rx: [8, 11, 8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* window frame bolts */}
        {[[24, 7], [76, 7], [24, 27], [76, 27]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.35" fill="#3f2415" />
        ))}
      </g>

      {/* Red emergency strobe */}
      <motion.rect x="46" y="2" width="8" height="1.4" rx="0.3" fill="#ef4444" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.1, repeat: Infinity }} />
      <rect x="20" y="0" width="60" height="8" fill="url(#redEmer)" opacity={allOpen ? 0.2 : 0.6} />

      {/* LEFT — alarm panel (wire) */}
      <g>
        <rect x="3" y="30" width="14" height="14" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.4" rx="0.3" />
        <text x="10" y="33" textAnchor="middle" fontSize="1" fontWeight="bold" fill={alarm ? '#10b981' : '#ef4444'} fontFamily="monospace">ALARMA</text>
        {/* wires */}
        {alarm ? (
          <g>
            {[36, 38, 40, 42].map((y, i) => (
              <line key={i} x1="4" y1={y} x2="16" y2={y} stroke={['#ef4444', '#3b82f6', '#fbbf24', '#10b981'][i]} strokeWidth="0.4" />
            ))}
          </g>
        ) : (
          <g>
            <path d="M 4 36 Q 8 39, 12 36 T 16 38" stroke="#ef4444" strokeWidth="0.4" fill="none" />
            <path d="M 4 38 Q 9 42, 13 38 T 16 41" stroke="#3b82f6" strokeWidth="0.4" fill="none" />
            <path d="M 4 40 Q 8 43, 12 40 T 16 43" stroke="#fbbf24" strokeWidth="0.4" fill="none" />
            <motion.circle cx="10" cy="40" r="0.3" fill="#fef3c7" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4, repeat: Infinity }} />
          </g>
        )}
      </g>

      {/* CENTER — seismograph (timing) */}
      <g>
        <rect x="38" y="32" width="24" height="12" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.4" />
        <text x="50" y="34.5" textAnchor="middle" fontSize="1" fontWeight="bold" fill={tremor ? '#10b981' : '#fbbf24'} fontFamily="monospace">SISMÓGRAFO</text>
        {/* needle line */}
        <motion.path
          d="M 40 39 L 44 39 L 45 36 L 46 42 L 47 39 L 50 39 L 51 38 L 52 40 L 53 39 L 60 39"
          stroke={tremor ? '#10b981' : '#ef4444'}
          strokeWidth="0.3"
          fill="none"
          animate={tremor ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
        <text x="50" y="42.5" textAnchor="middle" fontSize="0.7" fill="#94a3b8" fontFamily="monospace">{tremor ? 'Estable' : 'Magnitud 6.8'}</text>
      </g>

      {/* RIGHT — escape pod door + keypad */}
      <g>
        {allOpen ? (
          <g>
            <rect x="76" y="30" width="20" height="20" fill="#0a0a0a" />
            <rect x="78" y="32" width="16" height="16" fill="#bbf7d0" opacity="0.25" />
            <text x="86" y="42" textAnchor="middle" fontSize="2" fill="#bbf7d0" fontFamily="monospace" fontWeight="bold">CÁPSULA</text>
          </g>
        ) : (
          <g>
            <rect x="76" y="30" width="20" height="20" fill="#475569" stroke="#0a0a0a" strokeWidth="0.4" />
            <rect x="77" y="31" width="18" height="18" fill="#64748b" stroke="#0a0a0a" strokeWidth="0.3" />
            <rect x="77" y="31" width="18" height="1.6" fill="#fbbf24" />
            <rect x="77" y="47.4" width="18" height="1.6" fill="#fbbf24" />
            <circle cx="86" cy="40" r="1.2" fill="#ef4444" />
            <motion.circle cx="86" cy="40" r="2" fill="none" stroke="#ef4444" strokeWidth="0.3" animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ transformOrigin: '86px 40px' }} />
            <text x="86" y="45.5" textAnchor="middle" fontSize="0.7" fill="#94a3b8" fontFamily="monospace">SELLADA</text>
            {/* keypad below */}
            <rect x="80" y="50" width="12" height="5" fill="#0a0a0a" stroke="#475569" strokeWidth="0.25" />
            {[0, 1, 2].map((col) => (
              <rect key={col} x={80.7 + col * 3.6} y="50.7" width="3" height="3.6" fill="#1e293b" stroke="#475569" strokeWidth="0.1" />
            ))}
          </g>
        )}
      </g>

      {/* Hint poster (escape code) */}
      <g transform="translate(20 45) rotate(-3)">
        <rect x="0" y="0" width="9" height="6" fill="#fef3c7" stroke="#7c2d12" strokeWidth="0.2" />
        <text x="4.5" y="2" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">ESCAPE</text>
        <text x="4.5" y="5" textAnchor="middle" fontSize="2" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">8·1·5·2</text>
      </g>

      {/* Ash falling */}
      {[10, 25, 50, 75, 90].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={-2}
          r="0.18"
          fill="#94a3b8"
          opacity="0.6"
          animate={{ cy: [-2, 56], opacity: [0, 0.6, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}
    </svg>
  )
}
