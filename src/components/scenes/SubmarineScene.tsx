import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 6 — "Submarino a la Deriva"
 * Claustrophobic interior of a Cold-War sub. Dim red emergency light, water
 * dripping from pipes, a porthole showing deep ocean, periscope, radio, and
 * a leaking valve. Darkness gameplay: starts dim, find the lantern first.
 */
export function SubmarineScene({ state }: Props) {
  const valves = !!state.flags.sub_valves
  const depth = !!state.flags.sub_depth
  const radio = !!state.flags.sub_radio
  const allOnline = valves && depth && radio
  const hasLight = state.inventory.some((e) => e.itemId === 'flashlight')

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Submarino">
      <defs>
        <linearGradient id="subWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1f2b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="subSteel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <radialGradient id="redEmer" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="deepOcean" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#subWall)" />
      <rect x="0" y="40" width="100" height="16" fill="#0a0a0a" />
      {/* steel floor grating */}
      {[8, 22, 38, 54, 70, 88].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 5} y2="56" stroke="#1e293b" strokeWidth="0.3" />
      ))}

      {/* riveted ceiling */}
      <rect x="0" y="0" width="100" height="3.5" fill="#1e293b" />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={2.5 + i * 5} cy="1.8" r="0.3" fill="#475569" />
      ))}

      {/* Emergency red light dome */}
      <motion.rect x="46" y="3.4" width="8" height="1.3" rx="0.3" fill="#ef4444" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <rect x="20" y="0" width="60" height="14" fill="url(#redEmer)" opacity={allOnline ? 0.3 : 0.7} />

      {/* Porthole window — deep ocean */}
      <g transform="translate(78 18)">
        <circle r="9" fill="#0a0a0a" />
        <circle r="8" fill="url(#deepOcean)" />
        {[0, 60, 120, 180, 240, 300].map((d) => {
          const a = (d * Math.PI) / 180
          return <circle key={d} cx={8.5 * Math.cos(a)} cy={8.5 * Math.sin(a)} r="0.4" fill="#475569" />
        })}
        {/* tiny fish */}
        <motion.circle cx="0" cy="0" r="0.4" fill="#fbbf24" animate={{ cx: [-7, 7], opacity: [0, 1, 0] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.circle cx="0" cy="2" r="0.3" fill="#cbd5e1" animate={{ cx: [7, -7], opacity: [0, 1, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} />
      </g>

      {/* LEFT: leaking valve panel — timing puzzle */}
      <g>
        <rect x="3" y="20" width="14" height="16" fill="url(#subSteel)" stroke="#0a0a0a" strokeWidth="0.4" />
        <text x="10" y="23" textAnchor="middle" fontSize="1.1" fontWeight="bold" fill={valves ? '#10b981' : '#fbbf24'} fontFamily="monospace">VÁLVULAS</text>
        {/* gauge */}
        <circle cx="7" cy="29" r="2.4" fill="#0a0a0a" stroke="#475569" strokeWidth="0.3" />
        <circle cx="7" cy="29" r="2" fill="#1e293b" />
        <line x1="7" y1="29" x2={valves ? 8 : 5.5} y2={valves ? 27.5 : 30.5} stroke={valves ? '#10b981' : '#ef4444'} strokeWidth="0.4" />
        {/* valve handle */}
        <circle cx="13" cy="29" r="2" fill={valves ? '#10b981' : '#dc2626'} stroke="#0a0a0a" strokeWidth="0.3" />
        <line x1="11" y1="29" x2="15" y2="29" stroke="#0a0a0a" strokeWidth="0.4" />
        <line x1="13" y1="27" x2="13" y2="31" stroke="#0a0a0a" strokeWidth="0.4" />
        {/* dripping water */}
        {!valves && (
          <>
            <motion.line x1="10" y1="36" x2="10" y2="38" stroke="#3b82f6" strokeWidth="0.3" animate={{ y: [0, 5, 0], opacity: [0.8, 0, 0.8] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <ellipse cx="10" cy="42" rx="3" ry="0.3" fill="#3b82f6" opacity="0.5" />
          </>
        )}
      </g>

      {/* CENTER: depth slider console */}
      <g>
        <rect x="32" y="28" width="32" height="12" fill="url(#subSteel)" stroke="#0a0a0a" strokeWidth="0.4" rx="0.4" />
        <text x="48" y="31" textAnchor="middle" fontSize="1.1" fontWeight="bold" fill={depth ? '#10b981' : '#fbbf24'} fontFamily="monospace">PROFUNDIDAD</text>
        {/* 4 sliders */}
        {[37, 43, 49, 55].map((x, i) => (
          <g key={x}>
            <rect x={x - 0.4} y="33" width="0.8" height="6" fill="#0a0a0a" />
            <rect x={x - 1.4} y={depth ? 33.5 : 34 + i} width="2.8" height="0.9" rx="0.2" fill={depth ? '#10b981' : '#fbbf24'} />
          </g>
        ))}
        {/* status display */}
        <rect x="58" y="33" width="5" height="4" fill="#0a0a0a" stroke="#22d3ee" strokeWidth="0.25" />
        <text x="60.5" y="35.8" textAnchor="middle" fontSize="1.6" fill="#22d3ee" fontFamily="monospace" fontWeight="bold">{depth ? '0m' : '∞m'}</text>
      </g>

      {/* RIGHT-bottom: radio with keypad — code puzzle */}
      <g>
        <rect x="68" y="32" width="14" height="9" fill="url(#subSteel)" stroke="#0a0a0a" strokeWidth="0.4" rx="0.3" />
        <text x="75" y="34" textAnchor="middle" fontSize="1.1" fontWeight="bold" fill={radio ? '#10b981' : '#fbbf24'} fontFamily="monospace">RADIO</text>
        {/* speaker grille */}
        <rect x="69" y="35" width="5" height="5" fill="#0a0a0a" />
        {[36, 37, 38, 39].map((y, i) => (
          <line key={i} x1="69.3" y1={y} x2="73.7" y2={y} stroke="#475569" strokeWidth="0.15" />
        ))}
        {/* keypad */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect key={`${row}-${col}`} x={75.5 + col * 1.7} y={35.2 + row * 1.6} width="1.5" height="1.3" fill="#1e293b" stroke="#475569" strokeWidth="0.1" />
          )),
        )}
        <circle cx="80.5" cy="39.5" r="0.3" fill={radio ? '#10b981' : '#ef4444'} />
      </g>

      {/* Toolbox (gives flashlight) */}
      <g>
        <rect x="22" y="45" width="6" height="4" fill={hasLight ? '#1e293b' : '#dc2626'} stroke="#0a0a0a" strokeWidth="0.3" rx="0.2" />
        <rect x="22" y="45" width="6" height="0.7" fill={hasLight ? '#0a0a0a' : '#7f1d1d'} />
        <path d="M 23.5 45 Q 25 43.5, 26.5 45" stroke="#0a0a0a" strokeWidth="0.3" fill="none" />
        <text x="25" y="47.4" textAnchor="middle" fontSize="0.7" fill="#0a0a0a" fontFamily="monospace" fontWeight="bold">SOS</text>
      </g>

      {/* Sealed hatch (final exit) */}
      <g>
        {allOnline ? (
          <g>
            <circle cx="50" cy="46" r="6" fill="#0a0a0a" stroke="#22d3ee" strokeWidth="0.4" />
            <text x="50" y="47.5" textAnchor="middle" fontSize="1.6" fill="#22d3ee" fontFamily="serif" fontWeight="bold">↑ EMERGER</text>
          </g>
        ) : (
          <g>
            <circle cx="50" cy="46" r="6" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.5" />
            <circle cx="50" cy="46" r="5" fill="url(#subSteel)" />
            {/* spoke wheel */}
            {[0, 60, 120, 180, 240, 300].map((d) => {
              const a = (d * Math.PI) / 180
              return <line key={d} x1="50" y1="46" x2={50 + 4.5 * Math.cos(a)} y2={46 + 4.5 * Math.sin(a)} stroke="#0a0a0a" strokeWidth="0.4" />
            })}
            <circle cx="50" cy="46" r="1.2" fill="#0a0a0a" />
            <text x="50" y="54.5" textAnchor="middle" fontSize="0.8" fill="#94a3b8" fontFamily="monospace">ESCOTILLA</text>
          </g>
        )}
      </g>

      {/* Hint poster (radio code clue) */}
      <g>
        <rect x="84" y="46" width="9" height="6" fill="#fef3c7" stroke="#854d0e" strokeWidth="0.2" transform="rotate(-3 88 49)" />
        <text x="88.5" y="48.5" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace" transform="rotate(-3 88 49)">FREQ</text>
        <text x="88.5" y="51" textAnchor="middle" fontSize="1.5" fontWeight="bold" fill="#7c2d12" fontFamily="monospace" transform="rotate(-3 88 49)">4-7-2-9</text>
      </g>

      {/* Hint slider clue — depth chart */}
      <g>
        <rect x="33" y="44" width="8" height="6" fill="#fef3c7" stroke="#854d0e" strokeWidth="0.2" />
        <text x="37" y="46" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">DEPTH</text>
        <text x="37" y="49" textAnchor="middle" fontSize="1.3" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">2-5-1-3</text>
      </g>

      {/* condensation */}
      <g opacity="0.5">
        <line x1="55" y1="4" x2="55" y2="14" stroke="#22d3ee" strokeWidth="0.15" />
        <line x1="58" y1="4" x2="58" y2="11" stroke="#22d3ee" strokeWidth="0.1" />
      </g>
    </svg>
  )
}
