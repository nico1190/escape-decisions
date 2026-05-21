import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 11 — "Laboratorio Σ" (FINAL)
 * Hazmat-yellow lab: chemical cabinets, mainframe with blinking LEDs,
 * containment door with a 5-symbol biometric lock, broken centrifuge
 * spraying sparks, danger sign. Starts in darkness — find the lantern.
 */
export function LabScene({ state }: Props) {
  const reset = !!state.flags.lab_reset
  const power = !!state.flags.lab_power
  const sample = !!state.flags.lab_sample
  const codename = !!state.flags.lab_codename
  const door = !!state.flags.lab_door
  const allOpen = reset && power && sample && codename && door
  const hasLight = state.inventory.some((e) => e.itemId === 'flashlight')

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Laboratorio sigma">
      <defs>
        <linearGradient id="labWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1521" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="labFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2a35" />
          <stop offset="100%" stopColor="#0a0f15" />
        </linearGradient>
        <linearGradient id="labMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="hazmat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <radialGradient id="labGreenGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="labRedGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#labWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#labFloor)" />
      {/* tile grid floor */}
      {[10, 25, 40, 55, 70, 85].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 3} y2="56" stroke="#0a0a0a" strokeOpacity="0.7" strokeWidth="0.15" />
      ))}
      {[45, 49, 53].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#0a0a0a" strokeOpacity="0.4" strokeWidth="0.1" />
      ))}

      {/* hazmat hazard tape top */}
      {Array.from({ length: 25 }).map((_, i) => (
        <rect key={i} x={i * 4} y="0" width="2" height="2" fill={i % 2 ? '#0a0a0a' : '#fbbf24'} />
      ))}

      {/* Red emergency strip */}
      <motion.rect x="0" y="2" width="100" height="0.6" fill="#ef4444" animate={{ opacity: allOpen ? 0.3 : [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <rect x="0" y="0" width="100" height="14" fill="url(#labRedGlow)" opacity={allOpen ? 0.2 : 0.55} />

      {/* LEFT: chemical cabinet — sample sliders */}
      <g>
        <rect x="3" y="8" width="18" height="26" fill="url(#labMetal)" stroke="#0a0a0a" strokeWidth="0.4" rx="0.3" />
        <text x="12" y="11" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill={sample ? '#10b981' : '#fbbf24'} fontFamily="monospace">REACTIVOS</text>
        {/* shelves */}
        {[14, 22, 30].map((y) => (
          <rect key={y} x="3" y={y} width="18" height="0.6" fill="#0a0a0a" />
        ))}
        {/* test tubes */}
        {[
          { c: '#10b981', y: 15 },
          { c: '#3b82f6', y: 15, x: 7 },
          { c: '#a855f7', y: 23 },
          { c: '#fbbf24', y: 23, x: 8 },
          { c: '#ef4444', y: 31 },
        ].map((t, i) => (
          <g key={i} transform={`translate(${5 + (t.x ?? i * 3)} ${t.y})`}>
            <rect x="0" y="0" width="1.4" height="5" rx="0.5" fill={t.c} stroke="#0a0a0a" strokeWidth="0.15" opacity="0.8" />
            <rect x="-0.3" y="-0.5" width="2" height="0.8" fill="#1e293b" />
          </g>
        ))}
      </g>

      {/* MAIN FRAME — center wall, wire puzzle */}
      <g>
        <rect x="26" y="8" width="24" height="22" fill="#0a0a0a" stroke="#475569" strokeWidth="0.4" rx="0.3" />
        <text x="38" y="11" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill={power ? '#10b981' : '#ef4444'} fontFamily="monospace">MAINFRAME Σ</text>
        {/* status leds */}
        {[14, 16, 18, 20, 22].map((y, i) => (
          <motion.circle key={i} cx={28} cy={y} r="0.4" fill={power ? '#10b981' : i === 2 ? '#ef4444' : '#475569'} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1 + i * 0.2, repeat: Infinity, delay: i * 0.1 }} />
        ))}
        {/* wire bay (the puzzle hotspot wraps this) */}
        {power ? (
          <g>
            {[15, 17, 19, 21, 23, 25].map((y, i) => (
              <line key={i} x1="32" y1={y} x2="48" y2={y} stroke={['#ef4444', '#3b82f6', '#fbbf24', '#10b981', '#a855f7', '#f97316'][i]} strokeWidth="0.45" />
            ))}
          </g>
        ) : (
          <g>
            <path d="M 32 16 Q 38 19, 44 16 T 48 18" stroke="#ef4444" strokeWidth="0.45" fill="none" />
            <path d="M 32 18 Q 40 22, 46 18 T 48 22" stroke="#3b82f6" strokeWidth="0.45" fill="none" />
            <path d="M 32 21 Q 38 25, 45 21 T 48 25" stroke="#fbbf24" strokeWidth="0.45" fill="none" />
            <motion.circle cx="40" cy="20" r="0.35" fill="#fef3c7" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4, repeat: Infinity }} />
          </g>
        )}
        {/* screen with status */}
        <rect x="32" y="27" width="16" height="2.6" fill="#0a0a0a" stroke="#22d3ee" strokeWidth="0.2" />
        <text x="40" y="29" textAnchor="middle" fontSize="1.1" fill="#22d3ee" fontFamily="monospace">{power ? 'ONLINE' : 'OFFLINE'}</text>
      </g>

      {/* CENTRIFUGE — slider puzzle (sample calibration) */}
      <g transform="translate(60 22)">
        <ellipse cx="0" cy="9" rx="8" ry="1.2" fill="#000" opacity="0.6" />
        <rect x="-7" y="-2" width="14" height="11" fill="url(#labMetal)" stroke="#0a0a0a" strokeWidth="0.4" rx="0.3" />
        <text x="0" y="0" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill={sample ? '#10b981' : '#fbbf24'} fontFamily="monospace">CENTRÍFUGA</text>
        {/* sliders */}
        {[-4.5, -1.5, 1.5, 4.5].map((x, i) => (
          <g key={x}>
            <rect x={x - 0.4} y="2" width="0.8" height="5" fill="#0a0a0a" />
            <rect x={x - 1.4} y={sample ? 2.5 : 2.5 + i * 0.7} width="2.8" height="0.8" rx="0.2" fill={sample ? '#10b981' : '#fbbf24'} />
          </g>
        ))}
        {/* sparks if broken */}
        {!sample && (
          <motion.circle cx="3" cy="-3" r="0.3" fill="#fef3c7" animate={{ opacity: [0, 1, 0], cy: [-3, -5, -3] }} transition={{ duration: 0.5, repeat: Infinity }} />
        )}
      </g>

      {/* RIGHT: containment door with biometric cipher panel */}
      <g>
        <rect x="76" y="8" width="20" height="32" fill="url(#labMetal)" stroke="#0a0a0a" strokeWidth="0.5" />
        {allOpen ? (
          <g>
            <rect x="77" y="9" width="18" height="30" fill="#0a0a0a" />
            <rect x="78" y="10" width="16" height="28" fill="url(#labGreenGlow)" opacity="0.7" />
            <text x="86" y="26" textAnchor="middle" fontSize="2" fill="#10b981" fontFamily="monospace" fontWeight="bold">CLEAR</text>
          </g>
        ) : (
          <g>
            <rect x="77" y="9" width="18" height="30" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.3" />
            {/* hazard stripes */}
            <rect x="77" y="9" width="18" height="1.6" fill={door ? '#10b981' : '#fbbf24'} />
            <rect x="77" y="37.4" width="18" height="1.6" fill={door ? '#10b981' : '#fbbf24'} />
            {/* biohazard symbol */}
            <g transform="translate(86 22)">
              <circle r="3" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
              {[0, 120, 240].map((d) => {
                const a = ((d - 90) * Math.PI) / 180
                return <circle key={d} cx={3 * Math.cos(a)} cy={3 * Math.sin(a)} r="1.2" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
              })}
              <circle r="0.5" fill="#fbbf24" />
            </g>
            {/* keypad for cipher/code */}
            <g transform="translate(78 30)">
              <rect x="0" y="0" width="16" height="6" fill="#0a0a0a" stroke="#475569" strokeWidth="0.25" rx="0.2" />
              {[0, 1, 2, 3, 4].map((col) => (
                <rect key={col} x={0.6 + col * 3} y="0.7" width="2.7" height="4.6" fill="#1e293b" stroke="#475569" strokeWidth="0.1" rx="0.1" />
              ))}
              <circle cx="14" cy="2" r="0.3" fill={door ? '#10b981' : '#ef4444'} />
            </g>
          </g>
        )}
      </g>

      {/* Toolbox on floor (gives flashlight) */}
      <g>
        <rect x="22" y="44" width="6" height="4" fill={hasLight ? '#1e293b' : '#dc2626'} stroke="#0a0a0a" strokeWidth="0.3" rx="0.2" />
        <rect x="22" y="44" width="6" height="0.6" fill={hasLight ? '#0a0a0a' : '#7f1d1d'} />
        <path d="M 23.5 44 Q 25 42.5, 26.5 44" stroke="#0a0a0a" strokeWidth="0.3" fill="none" />
        <text x="25" y="46.4" textAnchor="middle" fontSize="0.7" fill="#0a0a0a" fontFamily="monospace" fontWeight="bold">SAFE</text>
      </g>

      {/* Whiteboard with reset codename (cipher hint after power restored) */}
      {power && (
        <g>
          <rect x="51" y="43" width="14" height="7" fill="#f1f5f9" stroke="#0a0a0a" strokeWidth="0.3" />
          <text x="58" y="45.5" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#0a0a0a" fontFamily="monospace">PROYECTO</text>
          <text x="58" y="48.5" textAnchor="middle" fontSize="1.6" fontWeight="bold" fill="#dc2626" fontFamily="serif">19·15·13·1</text>
        </g>
      )}

      {/* Reset button hot spot — visible only initially (memory test before everything else) */}
      <g>
        <rect x="38" y="43" width="10" height="5" fill={reset ? '#10b981' : '#dc2626'} stroke="#0a0a0a" strokeWidth="0.3" rx="0.4" />
        <text x="43" y="46.4" textAnchor="middle" fontSize="1.1" fontWeight="bold" fill="#fef3c7" fontFamily="monospace">{reset ? 'RESET OK' : 'RESET'}</text>
      </g>

      {/* Subtle code revealed for door after codename solved */}
      {codename && (
        <g>
          <motion.ellipse cx="86" cy="6" rx="5" ry="0.8" fill="#10b981" animate={{ opacity: [0.05, 0.16, 0.05] }} transition={{ duration: 2.4, repeat: Infinity }} />
          {['Σ', '4', '7', '2', '8'].map((d, i) => (
            <motion.text key={i} x={82 + i * 2} y="6.6" textAnchor="middle" fontSize="1.2" fontWeight="bold" fill="#d1fae5" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.5px #10b981)' }} opacity="0.7" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.14 }}>
              {d}
            </motion.text>
          ))}
        </g>
      )}
    </svg>
  )
}
