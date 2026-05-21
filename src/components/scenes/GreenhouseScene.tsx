import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 12 — "Invernadero Envenenado"
 * Glass-ceiling botanical greenhouse. Vines on pillars, potted plants on a
 * stone bench, a wooden workbench with mortar + pestle and herbal book, jars
 * of dried herbs on a shelf, sunlight filtered green through leaves.
 */
export function GreenhouseScene({ state }: Props) {
  const plantName = !!state.flags.gh_plant
  const antidote = !!state.flags.gh_antidote
  const exit = !!state.flags.gh_exit
  const allOpen = plantName && antidote && exit

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Invernadero">
      <defs>
        <linearGradient id="ghSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d7c3a" />
          <stop offset="100%" stopColor="#1f3a17" />
        </linearGradient>
        <linearGradient id="ghFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4730" />
          <stop offset="100%" stopColor="#2a1f10" />
        </linearGradient>
        <linearGradient id="ghWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92592f" />
          <stop offset="100%" stopColor="#4a2d1a" />
        </linearGradient>
        <radialGradient id="ghLight" cx="0.5" cy="0.2" r="0.6">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* glass roof + sky */}
      <rect x="0" y="0" width="100" height="40" fill="url(#ghSky)" />
      {/* roof panes (glass) */}
      {[14, 28, 42, 56, 70, 84].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="14" stroke="#bbf7d0" strokeOpacity="0.3" strokeWidth="0.25" />
      ))}
      <line x1="0" y1="6" x2="100" y2="6" stroke="#bbf7d0" strokeOpacity="0.4" strokeWidth="0.3" />
      <line x1="0" y1="14" x2="100" y2="14" stroke="#bbf7d0" strokeOpacity="0.5" strokeWidth="0.4" />

      {/* sun beam */}
      <rect x="0" y="0" width="100" height="30" fill="url(#ghLight)" />

      {/* floor */}
      <rect x="0" y="40" width="100" height="16" fill="url(#ghFloor)" />
      {/* terracotta tiles */}
      {[12, 26, 40, 54, 68, 82].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 4} y2="56" stroke="#0a0a0a" strokeOpacity="0.4" strokeWidth="0.2" />
      ))}

      {/* Hanging vines from glass ceiling */}
      <g opacity="0.85">
        <path d="M 10 0 Q 11 8, 9 18 Q 12 22, 10 28" stroke="#15803d" strokeWidth="0.4" fill="none" />
        <circle cx="9.5" cy="13" r="0.6" fill="#22c55e" />
        <circle cx="10.2" cy="22" r="0.5" fill="#22c55e" />

        <path d="M 30 0 Q 31 10, 29 20" stroke="#15803d" strokeWidth="0.3" fill="none" />
        <circle cx="30" cy="16" r="0.5" fill="#22c55e" />

        <path d="M 88 0 Q 87 10, 89 20 Q 86 24, 88 30" stroke="#15803d" strokeWidth="0.4" fill="none" />
        <circle cx="89" cy="14" r="0.6" fill="#22c55e" />
        <circle cx="88" cy="24" r="0.5" fill="#22c55e" />

        <path d="M 65 0 Q 66 8, 64 14" stroke="#15803d" strokeWidth="0.3" fill="none" />
        <circle cx="64" cy="11" r="0.4" fill="#22c55e" />
      </g>

      {/* LEFT — wooden workbench with mortar + pestle (slider puzzle) */}
      <g>
        <rect x="3" y="34" width="22" height="3" fill="url(#ghWood)" stroke="#2a1709" strokeWidth="0.3" />
        <rect x="4" y="37" width="2.5" height="6" fill="#3f2415" />
        <rect x="21.5" y="37" width="2.5" height="6" fill="#3f2415" />
        {/* mortar */}
        <g>
          <ellipse cx="10" cy="34" rx="3" ry="0.5" fill="#1c0e06" />
          <path d="M 7 34 Q 7 30 10 30 Q 13 30 13 34" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.3" />
          <ellipse cx="10" cy="31" rx="2" ry="0.4" fill="#92592f" opacity={antidote ? 0.9 : 0.6} />
          {/* pestle */}
          <rect x="12" y="29" width="0.6" height="3.5" fill="#3f2415" transform="rotate(20 12.3 30.5)" />
        </g>
        {/* jar of dried herbs */}
        <g>
          <rect x="16" y="29" width="2.4" height="5" fill="#bbf7d0" opacity="0.4" stroke="#4d7c3a" strokeWidth="0.2" />
          <rect x="15.5" y="28.5" width="3.4" height="0.8" fill="#3f2415" />
          {/* contents */}
          <rect x="16.3" y="30" width="1.8" height="3.5" fill="#15803d" opacity="0.5" />
        </g>
        {/* botanical book (cipher entry) */}
        <g>
          <rect x="6" y="31.5" width="3.5" height="2.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.2" />
          <rect x="6.3" y="31.8" width="3" height="2" fill="#fef3c7" opacity="0.6" />
          <line x1="7" y1="32.5" x2="9" y2="32.5" stroke="#1c0e06" strokeWidth="0.1" />
          <line x1="7" y1="33" x2="9" y2="33" stroke="#1c0e06" strokeWidth="0.1" />
          <line x1="7" y1="33.5" x2="8.5" y2="33.5" stroke="#1c0e06" strokeWidth="0.1" />
        </g>
      </g>

      {/* CENTER — potted poisonous plant (decorative + danger) */}
      <g transform="translate(50 32)">
        <ellipse cx="0" cy="9" rx="6" ry="0.8" fill="#000" opacity="0.5" />
        {/* pot */}
        <path d="M -4 8 L -5 1 L 5 1 L 4 8 Z" fill="#7c2d12" stroke="#3f0808" strokeWidth="0.3" />
        <rect x="-5" y="0.5" width="10" height="1" fill="#92330a" />
        {/* leaves */}
        {[-25, -10, 0, 15, 30].map((rot, i) => (
          <motion.path
            key={i}
            d="M 0 0 Q -2 -3 -1.5 -7 Q 0 -8 1.5 -7 Q 2 -3 0 0 Z"
            fill={i % 2 ? '#16a34a' : '#15803d'}
            transform={`rotate(${rot}) translate(0, -2)`}
            animate={{ rotate: [rot - 1, rot + 1, rot - 1] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
          />
        ))}
        {/* flower (poisonous purple) */}
        <circle cx="0" cy="-9" r="1.4" fill="#a855f7" />
        <circle cx="0" cy="-9" r="0.5" fill="#fde68a" />
        {/* spores (animated) */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={0 + i * 2}
            cy={-10}
            r="0.18"
            fill="#a855f7"
            animate={{ cy: [-10, -16, -10], opacity: [0.6, 0, 0.6], cx: [0 + i * 2, i * 2 + 1, 0 + i * 2] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </g>

      {/* RIGHT — shelf with herb jars (clue: plant name in latin) */}
      <g>
        <rect x="68" y="20" width="26" height="1" fill="url(#ghWood)" />
        <rect x="68" y="28" width="26" height="1" fill="url(#ghWood)" />
        {/* jars on shelves */}
        {[70, 74, 78, 82, 86, 90].map((x, i) => (
          <g key={x}>
            <rect x={x - 0.7} y="14" width="2.6" height="6" fill="#bbf7d0" opacity="0.35" stroke="#4d7c3a" strokeWidth="0.15" />
            <rect x={x - 1} y="13.5" width="3.2" height="0.7" fill="#3f2415" />
            <rect x={x - 0.4} y="15" width="2" height="4" fill={['#15803d', '#7c2d12', '#fbbf24', '#a855f7', '#15803d', '#7c2d12'][i]} opacity="0.5" />
          </g>
        ))}
        {/* clue label */}
        <rect x="68" y="22" width="26" height="5" fill="#fef3c7" stroke="#7c2d12" strokeWidth="0.25" />
        <text x="81" y="24" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#7c2d12" fontFamily="serif">PROCEDIMIENTO</text>
        <text x="81" y="26.4" textAnchor="middle" fontSize="1.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">2·1·8·3</text>
      </g>

      {/* BACK CENTER — exit door (greenhouse iron door) */}
      <g>
        {allOpen ? (
          <g>
            <rect x="42" y="3" width="16" height="22" fill="#0a0a0a" />
            <rect x="43" y="4" width="14" height="20" fill="#bbf7d0" opacity="0.2" />
            <text x="50" y="15" textAnchor="middle" fontSize="2" fill="#bbf7d0" fontFamily="serif" fontWeight="bold">SALIDA</text>
          </g>
        ) : (
          <g>
            <rect x="42" y="3" width="16" height="22" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.4" />
            <rect x="43" y="4" width="14" height="20" fill="#7c4d2f" stroke="#3f2415" strokeWidth="0.3" />
            {/* iron bars */}
            {[44.5, 47, 50, 53, 55.5].map((x) => (
              <rect key={x} x={x - 0.2} y="4" width="0.4" height="20" fill="#0a0a0a" />
            ))}
            {/* lock + keypad */}
            <rect x="59" y="13" width="5" height="7" fill="#0a0a0a" stroke="#475569" strokeWidth="0.3" rx="0.2" />
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <rect key={`${row}-${col}`} x={59.3 + col * 1.5} y={13.3 + row * 1.4} width="1.2" height="1.2" fill="#1e293b" stroke="#475569" strokeWidth="0.08" />
              )),
            )}
            <circle cx="61.5" cy="19.5" r="0.25" fill={exit ? '#10b981' : '#ef4444'} />
          </g>
        )}
      </g>

      {/* Plant name display revealed after cipher solved */}
      {plantName && (
        <g>
          <motion.ellipse cx="50" cy="38" rx="6" ry="1.2" fill="#fbbf24" animate={{ opacity: [0.06, 0.18, 0.06] }} transition={{ duration: 2.4, repeat: Infinity }} />
          <motion.text x="50" y="38.6" textAnchor="middle" fontSize="1.6" fontWeight="bold" fill="#fde68a" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.6px #fbbf24)' }} opacity="0.72" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity }}>
            ⚘ identificada
          </motion.text>
        </g>
      )}

      {/* Exit code reveal after antidote prepared */}
      {antidote && (
        <g>
          <motion.ellipse cx="50" cy="5.5" rx="5" ry="0.8" fill="#fbbf24" animate={{ opacity: [0.06, 0.16, 0.06] }} transition={{ duration: 2.4, repeat: Infinity }} />
          {['5', '0', '9', '3'].map((d, i) => (
            <motion.text key={i} x={46 + i * 3} y="6.4" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#fde68a" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.5px #fbbf24)' }} opacity="0.7" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.14 }}>
              {d}
            </motion.text>
          ))}
        </g>
      )}
    </svg>
  )
}
