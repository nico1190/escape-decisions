import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 17 — "La Cripta"
 * Gothic crypt: stone sarcophagus, candelabra with lit candles (Lights Out
 * theme), a tombstone with carved name, an iron-gated arch. The clue for
 * the door code is INTEGRATED into the scene art (not in obvious posters).
 */
export function CryptScene({ state }: Props) {
  const candles = !!state.flags.cr2_candles
  const name = !!state.flags.cr2_name
  const door = !!state.flags.cr2_door
  const allOpen = candles && name && door

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Cripta">
      <defs>
        <linearGradient id="cr2Wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="cr2Floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f1f1f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="cr2Stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#1f1f1f" />
        </linearGradient>
        <radialGradient id="cr2Candle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#cr2Wall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#cr2Floor)" />
      {/* stone block courses */}
      {[10, 20, 30].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#000" strokeOpacity="0.6" strokeWidth="0.15" />
      ))}
      {[15, 35, 55, 75, 95].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="40" stroke="#000" strokeOpacity="0.5" strokeWidth="0.15" />
      ))}
      {/* flagstone floor */}
      {[15, 30, 45, 60, 75, 90].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 3} y2="56" stroke="#000" strokeOpacity="0.6" strokeWidth="0.2" />
      ))}

      {/* Gothic arched ceiling */}
      <path d="M 0 0 L 0 8 Q 25 -2 50 6 Q 75 -2 100 8 L 100 0 Z" fill="#000" opacity="0.6" />

      {/* LEFT — sarcophagus (decorative) */}
      <g transform="translate(15 38)">
        <ellipse cx="0" cy="6" rx="10" ry="1" fill="#000" opacity="0.6" />
        <rect x="-9" y="0" width="18" height="6" fill="url(#cr2Stone)" stroke="#000" strokeWidth="0.4" />
        <rect x="-10" y="-1" width="20" height="1.5" fill="#5a5a5a" stroke="#000" strokeWidth="0.3" />
        {/* engraving — a cross */}
        <line x1="0" y1="1" x2="0" y2="5" stroke="#1c1c1c" strokeWidth="0.4" />
        <line x1="-1.5" y1="2.5" x2="1.5" y2="2.5" stroke="#1c1c1c" strokeWidth="0.4" />
      </g>

      {/* CENTER — candelabra (Lights Out puzzle hotspot) */}
      <g transform="translate(50 28)">
        {/* base */}
        <ellipse cx="0" cy="11" rx="6" ry="0.8" fill="#000" opacity="0.5" />
        <rect x="-4" y="8" width="8" height="3" fill="#3f2415" stroke="#000" strokeWidth="0.3" />
        <rect x="-0.4" y="-6" width="0.8" height="14" fill="#3f2415" />
        {/* candle arms (5) */}
        {[-3.5, -1.8, 0, 1.8, 3.5].map((x, i) => (
          <g key={i}>
            <line x1="0" y1={-3 + i * 0.5} x2={x * 1.5} y2={-5 - Math.abs(x) * 0.3} stroke="#3f2415" strokeWidth="0.35" />
            {/* candle */}
            <rect x={x * 1.5 - 0.4} y={-7 - Math.abs(x) * 0.3} width="0.8" height="1.5" fill="#fef3c7" stroke="#854d0e" strokeWidth="0.1" />
            {/* flame (lit when candles flag NOT set — they start lit, need to be put out) */}
            {!candles && (
              <motion.path
                d={`M ${x * 1.5} ${-7.5 - Math.abs(x) * 0.3} q -0.4 -0.4 0 -1 q 0.4 0.5 0 1 z`}
                fill="#fbbf24"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.9 + i * 0.1, repeat: Infinity }}
              />
            )}
          </g>
        ))}
        {/* glow when lit */}
        {!candles && <circle cx="0" cy="-5" r="9" fill="url(#cr2Candle)" />}
      </g>

      {/* RIGHT — tombstone with cipher inscription (CARVED, no signage) */}
      <g>
        <rect x="74" y="20" width="20" height="20" fill="url(#cr2Stone)" stroke="#000" strokeWidth="0.4" />
        {/* arched top */}
        <path d="M 74 20 Q 84 14 94 20 L 94 21 Q 84 15 74 21 Z" fill="#3f3f46" />
        {/* RIP */}
        <text x="84" y="25" textAnchor="middle" fontSize="2" fontWeight="bold" fill="#1c1c1c" fontFamily="serif">R.I.P.</text>
        {/* cipher numbers carved on the slab — no other context */}
        <text x="84" y="32" textAnchor="middle" fontSize="2.4" fontWeight="bold" fill="#1c1c1c" fontFamily="serif">20·21·13·2·1</text>
        {/* dates — the key to the door code is hidden in these */}
        <text x="84" y="38" textAnchor="middle" fontSize="1.1" fill="#1c1c1c" fontFamily="serif" fontStyle="italic">1847 — 1903</text>
      </g>

      {/* BACK CENTER — iron-gated arch (exit) */}
      <g>
        {allOpen ? (
          <g>
            <path d="M 40 4 Q 50 0 60 4 L 60 22 L 40 22 Z" fill="#0a0a0a" />
            <path d="M 41 5 Q 50 1 59 5 L 59 22 L 41 22 Z" fill="#fef3c7" opacity="0.2" />
            <text x="50" y="14" textAnchor="middle" fontSize="2" fill="#fef3c7" fontFamily="serif" fontWeight="bold">SALIDA</text>
          </g>
        ) : (
          <g>
            <path d="M 40 4 Q 50 0 60 4 L 60 22 L 40 22 Z" fill="#1c0e06" stroke="#000" strokeWidth="0.4" />
            {/* iron bars */}
            {[42, 44, 46, 48, 50, 52, 54, 56, 58].map((x) => (
              <rect key={x} x={x - 0.2} y="5" width="0.4" height="17" fill="#3f3f46" />
            ))}
            {/* horizontal bar */}
            <rect x="40" y="13" width="20" height="0.5" fill="#3f3f46" />
            {/* keypad below the arch */}
            <rect x="62" y="14" width="6" height="8" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="0.3" rx="0.3" />
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <rect key={`${row}-${col}`} x={62.5 + col * 1.5} y={14.5 + row * 1.5} width="1.3" height="1.3" fill="#1c0e06" stroke="#3f3f46" strokeWidth="0.08" />
              )),
            )}
            <circle cx="65" cy="21" r="0.3" fill={door ? '#10b981' : '#ef4444'} />
          </g>
        )}
      </g>

      {/* fog at floor */}
      <motion.ellipse cx="50" cy="50" rx="42" ry="2" fill="#1f1f1f" opacity="0.6" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 5, repeat: Infinity }} />
    </svg>
  )
}
