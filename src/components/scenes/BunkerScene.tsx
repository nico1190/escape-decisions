import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 10 — "Búnker '79"
 * Cold war underground bunker. Concrete walls, military green console with
 * blinking lights, rotary phone, wall map of the world, ICBM launch panel.
 */
export function BunkerScene({ state }: Props) {
  const launch = !!state.flags.bk_launch
  const wires = !!state.flags.bk_wires
  const valve = !!state.flags.bk_valve
  const allOpen = launch && wires && valve

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Bunker">
      <defs>
        <linearGradient id="bkWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#384139" />
          <stop offset="100%" stopColor="#1a201b" />
        </linearGradient>
        <linearGradient id="bkFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a322b" />
          <stop offset="100%" stopColor="#10160f" />
        </linearGradient>
        <linearGradient id="milGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d5a3e" />
          <stop offset="100%" stopColor="#2d3625" />
        </linearGradient>
        <radialGradient id="redAlert" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#bkWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#bkFloor)" />
      {/* concrete block lines */}
      {[10, 25, 40, 55, 70, 85].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="40" stroke="#000" strokeOpacity="0.5" strokeWidth="0.2" />
      ))}
      {[10, 20, 30].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#000" strokeOpacity="0.3" strokeWidth="0.15" />
      ))}

      {/* Spinning red alert dome */}
      <motion.rect x="46" y="3" width="8" height="1.4" rx="0.3" fill="#ef4444" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <rect x="20" y="0" width="60" height="14" fill="url(#redAlert)" opacity={allOpen ? 0.2 : 0.7} />

      {/* World map on left wall */}
      <g>
        <rect x="4" y="9" width="20" height="14" fill="#2a322b" stroke="#000" strokeWidth="0.3" />
        <text x="14" y="11.5" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#cbd5e1" fontFamily="monospace">CIA · MAPA</text>
        {/* fake continents */}
        <path d="M 6 14 Q 9 13, 11 15 L 11 18 L 7 19 Z" fill="#4d5a3e" stroke="#000" strokeWidth="0.15" />
        <path d="M 14 13 Q 18 12, 20 15 L 22 19 L 16 20 Z" fill="#4d5a3e" stroke="#000" strokeWidth="0.15" />
        {/* pins */}
        <circle cx="9" cy="15" r="0.4" fill="#ef4444" />
        <circle cx="18" cy="17" r="0.4" fill="#ef4444" />
      </g>

      {/* Launch panel — code puzzle */}
      <g>
        <rect x="30" y="14" width="16" height="20" fill="url(#milGreen)" stroke="#000" strokeWidth="0.4" rx="0.3" />
        <text x="38" y="17" textAnchor="middle" fontSize="1.1" fontWeight="bold" fill={launch ? '#10b981' : '#fbbf24'} fontFamily="monospace">LAUNCH ABORT</text>
        {/* missile silhouette */}
        <path d="M 36 19 L 40 19 L 40 28 L 38 30 L 36 28 Z" fill="#1c0e06" stroke="#fbbf24" strokeWidth="0.2" />
        <rect x="37" y="25" width="2" height="0.4" fill="#dc2626" />
        {/* keypad */}
        <g transform="translate(31 22)">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2].map((col) => (
              <rect key={`${row}-${col}`} x={col * 1.4} y={row * 1.4} width="1.2" height="1.2" fill="#1c0e06" stroke="#475569" strokeWidth="0.1" rx="0.15" />
            )),
          )}
        </g>
        <circle cx="36" cy="33" r="0.35" fill={launch ? '#10b981' : '#ef4444'} />
      </g>

      {/* Wiring panel — wire puzzle */}
      <g>
        <rect x="50" y="14" width="18" height="20" fill="#1c0e06" stroke="#475569" strokeWidth="0.4" />
        <text x="59" y="17" textAnchor="middle" fontSize="1" fontWeight="bold" fill={wires ? '#10b981' : '#fbbf24'} fontFamily="monospace">CIRCUITO PRINCIPAL</text>
        {/* tangled wires */}
        {wires ? (
          <g>
            {[20, 22, 24, 26, 28].map((y, i) => (
              <line key={i} x1="52" y1={y} x2="66" y2={y} stroke={['#ef4444', '#3b82f6', '#fbbf24', '#10b981', '#a855f7'][i]} strokeWidth="0.5" />
            ))}
          </g>
        ) : (
          <g>
            <path d="M 52 21 Q 56 23, 58 21 T 66 23" stroke="#ef4444" strokeWidth="0.5" fill="none" />
            <path d="M 52 24 Q 56 27, 62 24 T 66 27" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            <path d="M 52 27 Q 58 30, 63 26 T 66 30" stroke="#fbbf24" strokeWidth="0.5" fill="none" />
            <motion.circle cx="58" cy="25" r="0.3" fill="#fef3c7" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.45, repeat: Infinity }} />
          </g>
        )}
      </g>

      {/* Pressure valve — timing puzzle */}
      <g>
        <rect x="72" y="14" width="14" height="20" fill="url(#milGreen)" stroke="#000" strokeWidth="0.4" rx="0.3" />
        <text x="79" y="17" textAnchor="middle" fontSize="1" fontWeight="bold" fill={valve ? '#10b981' : '#fbbf24'} fontFamily="monospace">PRESIÓN N₂</text>
        {/* gauge */}
        <circle cx="79" cy="24" r="3.5" fill="#0a0a0a" stroke="#475569" strokeWidth="0.4" />
        <circle cx="79" cy="24" r="3" fill="#1e293b" />
        <motion.line x1="79" y1="24" x2={valve ? 81 : 76.5} y2={valve ? 21.5 : 25} stroke={valve ? '#10b981' : '#ef4444'} strokeWidth="0.5" animate={valve ? {} : { rotate: [-30, 30, -30] }} style={{ transformOrigin: '79px 24px' }} transition={{ duration: 1.4, repeat: Infinity }} />
        <text x="79" y="32" textAnchor="middle" fontSize="0.8" fill="#fbbf24" fontFamily="monospace">{valve ? 'OK' : 'CRÍTICO'}</text>
      </g>

      {/* Rotary phone — atmospheric */}
      <g transform="translate(8 42)">
        <rect x="0" y="0" width="6" height="3" fill="#0a0a0a" rx="0.4" />
        <rect x="0.5" y="-1" width="5" height="1.4" fill="#1c0e06" rx="0.3" />
        <circle cx="3" cy="1.5" r="1.2" fill="#1e293b" stroke="#475569" strokeWidth="0.15" />
      </g>

      {/* Phone book hint with launch code */}
      <g transform="translate(40 47) rotate(-3)">
        <rect x="0" y="0" width="8" height="5" fill="#fef3c7" stroke="#7c2d12" strokeWidth="0.2" />
        <text x="4" y="1.7" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">ABORT</text>
        <text x="4" y="4" textAnchor="middle" fontSize="1.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">1·1·7·9</text>
      </g>

      {/* Hatch exit */}
      <g>
        {allOpen ? (
          <g>
            <circle cx="92" cy="46" r="6" fill="#0a0a0a" />
            <text x="92" y="47.5" textAnchor="middle" fontSize="1.5" fill="#10b981" fontFamily="monospace" fontWeight="bold">SUBIR</text>
          </g>
        ) : (
          <g>
            <circle cx="92" cy="46" r="6" fill="#1e293b" stroke="#000" strokeWidth="0.5" />
            <circle cx="92" cy="46" r="5" fill="url(#milGreen)" />
            {[0, 60, 120, 180, 240, 300].map((d) => {
              const a = (d * Math.PI) / 180
              return <line key={d} x1="92" y1="46" x2={92 + 4.5 * Math.cos(a)} y2={46 + 4.5 * Math.sin(a)} stroke="#000" strokeWidth="0.4" />
            })}
            <circle cx="92" cy="46" r="1.2" fill="#0a0a0a" />
          </g>
        )}
      </g>
    </svg>
  )
}
