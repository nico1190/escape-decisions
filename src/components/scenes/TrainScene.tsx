import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 7 — "Tren Nocturno"
 * Whodunit compartment: red velvet seats, brass lamp on the table, a leather
 * suitcase trunk, a passenger ticket on the table, photo of a suspect on the
 * wall. Rain blurs the window with passing landscape lights.
 */
export function TrainScene({ state }: Props) {
  const ticket = !!state.flags.tr_ticket
  const suspect = !!state.flags.tr_suspect
  const trunk = !!state.flags.tr_trunk
  const allOpen = ticket && suspect && trunk

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Tren nocturno">
      <defs>
        <linearGradient id="trWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f2415" />
          <stop offset="100%" stopColor="#1c0e06" />
        </linearGradient>
        <linearGradient id="trVelvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#3f0808" />
        </linearGradient>
        <radialGradient id="trLamp" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#trWall)" />
      <rect x="0" y="40" width="100" height="16" fill="#1c0e06" />
      {/* wood paneling */}
      {[14, 30, 46, 62, 78, 94].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="40" stroke="#0a0a0a" strokeOpacity="0.5" strokeWidth="0.2" />
      ))}

      {/* Rain on window — left */}
      <g>
        <rect x="6" y="10" width="22" height="14" fill="#0b1220" stroke="#0a0a0a" strokeWidth="0.4" />
        <rect x="7" y="11" width="20" height="12" fill="#1e293b" />
        {/* passing lights */}
        <motion.circle cx="0" cy="16" r="0.6" fill="#fde68a" animate={{ cx: [7, 26], opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
        <motion.circle cx="0" cy="19" r="0.4" fill="#cbd5e1" animate={{ cx: [27, 7], opacity: [0, 1, 0] }} transition={{ duration: 2.3, repeat: Infinity, delay: 1 }} />
        {/* rain streaks */}
        {[10, 14, 18, 22, 25].map((x, i) => (
          <motion.line key={i} x1={x} y1={11} x2={x - 1.5} y2={14} stroke="#94a3b8" strokeWidth="0.1" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 0.6 + i * 0.05, repeat: Infinity }} />
        ))}
        {/* cross frames */}
        <line x1="17" y1="10" x2="17" y2="24" stroke="#3f2415" strokeWidth="0.3" />
        <line x1="6" y1="17" x2="28" y2="17" stroke="#3f2415" strokeWidth="0.3" />
      </g>

      {/* Photo of suspect on wall (clue) */}
      <g>
        <rect x="36" y="6" width="10" height="12" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.3" />
        <rect x="36.7" y="6.7" width="8.6" height="10.6" fill="#1e293b" />
        {/* face silhouette */}
        <circle cx="41" cy="11" r="2" fill="#cbd5e1" />
        <rect x="39" y="13" width="4" height="4" fill="#475569" />
        <text x="41" y="19.5" textAnchor="middle" fontSize="0.7" fill="#cbd5e1" fontFamily="serif" opacity="0.8">SOSPECHOSO</text>
      </g>

      {/* Velvet seat */}
      <g>
        <rect x="34" y="28" width="32" height="14" fill="url(#trVelvet)" stroke="#2a0404" strokeWidth="0.3" rx="0.6" />
        {/* tufts */}
        {[40, 50, 60].map((x) => (
          <circle key={x} cx={x} cy="35" r="0.4" fill="#5a1010" />
        ))}
        <rect x="34" y="40" width="32" height="2" fill="#3f0808" />
      </g>

      {/* Table with brass lamp + ticket */}
      <g>
        <rect x="40" y="42" width="20" height="2" fill="#5a3520" stroke="#2a1709" strokeWidth="0.3" />
        <rect x="42" y="44" width="2" height="6" fill="#3f2415" />
        <rect x="56" y="44" width="2" height="6" fill="#3f2415" />
        {/* brass lamp */}
        <g transform="translate(50 42)">
          <rect x="-0.4" y="-0.5" width="0.8" height="-3" fill="#854d0e" />
          <path d="M -2 -3.5 L 2 -3.5 L 1 -5.5 L -1 -5.5 Z" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.2" />
          <motion.circle cx="0" cy="-4.5" r="0.5" fill="#fef3c7" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <circle cx="0" cy="-3" r="10" fill="url(#trLamp)" />
        </g>
        {/* ticket */}
        <g transform="translate(43 42.5) rotate(-6)">
          <rect x="0" y="0" width="6" height="3" fill="#fef3c7" stroke="#854d0e" strokeWidth="0.2" />
          <text x="3" y="1.5" textAnchor="middle" fontSize="0.6" fill="#7c2d12" fontFamily="monospace" fontWeight="bold">TICKET</text>
          <text x="3" y="2.5" textAnchor="middle" fontSize="0.7" fill="#7c2d12" fontFamily="monospace">11·05·22·05·14·13</text>
        </g>
      </g>

      {/* RIGHT: leather trunk with combination keypad */}
      <g>
        <rect x="72" y="34" width="22" height="10" fill="#5a3520" stroke="#1c0e06" strokeWidth="0.4" rx="0.4" />
        <rect x="72" y="34" width="22" height="1.6" fill="#7c4d2f" />
        {/* leather straps */}
        <rect x="76" y="34" width="1.4" height="10" fill="#3f2415" />
        <rect x="88.6" y="34" width="1.4" height="10" fill="#3f2415" />
        {/* clasp / lock */}
        <rect x="80" y="37" width="6" height="4" fill="#0a0a0a" stroke="#854d0e" strokeWidth="0.3" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect key={`${row}-${col}`} x={80.5 + col * 1.7} y={37.3 + row * 1.1} width="1.4" height="0.9" fill="#3f2415" stroke="#5a3520" strokeWidth="0.08" />
          )),
        )}
        <circle cx="83" cy="40.8" r="0.25" fill={trunk ? '#10b981' : '#ef4444'} />
        <text x="83" y="46.5" textAnchor="middle" fontSize="1" fill="#854d0e" fontFamily="serif" fontWeight="bold">BAÚL</text>
      </g>

      {/* Memory: photo briefly shows numbers (suspect ID badge) */}
      <g>
        <rect x="3" y="44" width="14" height="6" fill="#0a0a0a" stroke="#475569" strokeWidth="0.3" />
        <text x="10" y="46.5" textAnchor="middle" fontSize="0.8" fontWeight="bold" fill={suspect ? '#10b981' : '#fbbf24'} fontFamily="monospace">EXPEDIENTE</text>
        {suspect ? (
          <text x="10" y="49" textAnchor="middle" fontSize="0.9" fill="#10b981" fontFamily="monospace">✓</text>
        ) : (
          <text x="10" y="49" textAnchor="middle" fontSize="0.7" fill="#94a3b8" fontFamily="monospace">tocar para revisar</text>
        )}
      </g>

      {/* Subtle code on the trunk after suspect identified */}
      {suspect && (
        <g>
          <motion.ellipse cx="83" cy="32" rx="5" ry="0.9" fill="#fbbf24" animate={{ opacity: [0.05, 0.16, 0.05] }} transition={{ duration: 2.4, repeat: Infinity }} />
          {['6', '4', '9', '1'].map((d, i) => (
            <motion.text key={i} x={79 + i * 2.8} y="32.6" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#fde68a" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.5px #fbbf24)' }} opacity="0.7" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.16 }}>
              {d}
            </motion.text>
          ))}
        </g>
      )}

      {/* exit door — between compartments */}
      <g opacity={allOpen ? 1 : 0.85}>
        {allOpen ? (
          <g>
            <rect x="3" y="29" width="6" height="13" fill="#0a0a0a" />
            <text x="6" y="36" textAnchor="middle" fontSize="0.9" fill="#22d3ee" fontFamily="serif" fontWeight="bold">SALIDA</text>
          </g>
        ) : null}
      </g>

      {/* train motion lines on floor */}
      <g opacity="0.3">
        <motion.line x1="0" y1="48" x2="20" y2="48" stroke="#475569" strokeWidth="0.15" animate={{ x: [-30, 100] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
        <motion.line x1="0" y1="52" x2="14" y2="52" stroke="#475569" strokeWidth="0.12" animate={{ x: [-30, 100] }} transition={{ duration: 2.1, repeat: Infinity, ease: 'linear' }} />
      </g>
    </svg>
  )
}
