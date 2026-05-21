import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 14 — "Manicomio Abandonado"
 * Cold, decayed psychiatric ward. Padded room with restraints, file cabinet,
 * cracked tile floor, a flickering hallway bulb. Plays in darkness.
 */
export function AsylumScene({ state }: Props) {
  const chair = !!state.flags.as_chair
  const heart = !!state.flags.as_heart
  const file = !!state.flags.as_file
  const door = !!state.flags.as_door
  const allOpen = chair && heart && file && door
  const hasLight = state.inventory.some((e) => e.itemId === 'flashlight')

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Manicomio">
      <defs>
        <linearGradient id="asWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="asFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1f2b" />
          <stop offset="100%" stopColor="#0a0c14" />
        </linearGradient>
        <linearGradient id="asPad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#1f1f1f" />
        </linearGradient>
        <radialGradient id="asFlicker" cx="0.5" cy="0" r="0.5">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#asWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#asFloor)" />
      {/* cracked tiles */}
      {[12, 26, 40, 54, 68, 82].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 3} y2="56" stroke="#000" strokeOpacity="0.7" strokeWidth="0.2" />
      ))}
      {[45, 50, 55].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#000" strokeOpacity="0.4" strokeWidth="0.15" />
      ))}
      {/* random cracks */}
      <path d="M 14 41 Q 22 44, 30 42" stroke="#000" strokeWidth="0.2" fill="none" />
      <path d="M 60 50 Q 70 52, 80 49" stroke="#000" strokeWidth="0.2" fill="none" />

      {/* Padded walls (top) */}
      {[[3, 6], [22, 6], [42, 6], [62, 6], [81, 6]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="14" height="10" fill="url(#asPad)" stroke="#000" strokeWidth="0.3" rx="0.4" />
      ))}

      {/* flickering ceiling bulb */}
      <g>
        <line x1="50" y1="0" x2="50" y2="5" stroke="#3f3f46" strokeWidth="0.3" />
        <motion.circle
          cx="50" cy="5" r="0.7" fill="#fef3c7"
          animate={{ opacity: [0.3, 1, 0.4, 1, 0.2, 0.9, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.15, 0.3, 0.35, 0.6, 1] }}
        />
        <motion.rect
          x="20" y="0" width="60" height="20"
          fill="url(#asFlicker)"
          animate={{ opacity: [0.3, 1, 0.4, 1, 0.2, 0.9, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.15, 0.3, 0.35, 0.6, 1] }}
        />
      </g>

      {/* LEFT — restraint chair (rotation puzzle) */}
      <g transform="translate(16 36)">
        <rect x="-5" y="0" width="10" height="2" fill="#0a0a0a" />
        <rect x="-4" y="-6" width="8" height="6" fill="#3f3f46" stroke="#0a0a0a" strokeWidth="0.3" />
        <rect x="-4" y="-10" width="8" height="4" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.3" />
        {/* leather straps */}
        <rect x="-5" y="-7" width="10" height="0.6" fill="#7c2d12" />
        <rect x="-5" y="-3" width="10" height="0.6" fill="#7c2d12" />
        {/* combination dial on side */}
        <circle r="2" cx="5.5" cy="-5" fill={chair ? '#10b981' : '#1e293b'} stroke="#fbbf24" strokeWidth="0.3" />
        <circle r="0.5" cx="5.5" cy="-5" fill="#fef3c7" />
      </g>

      {/* CENTER — heart rate monitor (timing puzzle / heart beat) */}
      <g>
        <rect x="42" y="22" width="16" height="10" fill="#0a0a0a" stroke="#475569" strokeWidth="0.4" rx="0.3" />
        <text x="50" y="25" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill={heart ? '#10b981' : '#ef4444'} fontFamily="monospace">PULSO</text>
        {/* ECG line */}
        <motion.path
          d="M 43 29 L 46 29 L 47 26 L 48 32 L 49 29 L 55 29 L 56 28 L 57 30 L 58 29 L 57 29"
          stroke={heart ? '#10b981' : '#ef4444'}
          strokeWidth="0.3"
          fill="none"
          animate={heart ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        {/* BPM */}
        <text x="50" y="31" textAnchor="middle" fontSize="0.7" fill="#fbbf24" fontFamily="monospace">{heart ? 'CALMA' : 'CRÍTICO'}</text>
      </g>

      {/* RIGHT — file cabinet (code) */}
      <g>
        <rect x="76" y="20" width="14" height="20" fill="#3f3f46" stroke="#0a0a0a" strokeWidth="0.4" />
        {/* 4 drawers */}
        {[20.5, 25, 29.5, 34].map((y, i) => (
          <g key={y}>
            <rect x="77" y={y} width="12" height="4" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.25" />
            {/* drawer handle */}
            <rect x="81" y={y + 1.7} width="4" height="0.6" fill="#475569" />
            {/* tiny label */}
            <text x="83" y={y + 3} textAnchor="middle" fontSize="0.5" fill="#94a3b8" fontFamily="monospace">{['A-F', 'G-L', 'M-R', 'S-Z'][i]}</text>
          </g>
        ))}
        {/* lock keypad */}
        <rect x="77" y="38.5" width="12" height="1.2" fill="#0a0a0a" />
        <circle cx="80" cy="39.1" r="0.25" fill={file ? '#10b981' : '#ef4444'} />
      </g>

      {/* Toolbox (gives flashlight) */}
      <g>
        <rect x="48" y="46" width="6" height="4" fill={hasLight ? '#1e293b' : '#dc2626'} stroke="#0a0a0a" strokeWidth="0.3" rx="0.2" />
        <rect x="48" y="46" width="6" height="0.7" fill={hasLight ? '#0a0a0a' : '#7f1d1d'} />
        <path d="M 49.5 46 Q 51 44.5, 52.5 46" stroke="#0a0a0a" strokeWidth="0.3" fill="none" />
        <text x="51" y="48.6" textAnchor="middle" fontSize="0.7" fill="#0a0a0a" fontFamily="monospace" fontWeight="bold">FIRE</text>
      </g>

      {/* Doctor's note pinned to padded wall (cipher hint visible after chair solved) */}
      {chair && (
        <g transform="translate(60 7) rotate(-4)">
          <rect x="0" y="0" width="10" height="8" fill="#fef3c7" stroke="#7c2d12" strokeWidth="0.25" />
          <text x="5" y="2" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">DR. NOTES</text>
          <text x="5" y="4.5" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#1c0e06" fontFamily="serif">3·7·4·9</text>
          <text x="5" y="6.5" textAnchor="middle" fontSize="0.55" fill="#7c2d12" fontFamily="serif" fontStyle="italic">"hist. clínica"</text>
        </g>
      )}

      {/* Exit door */}
      <g>
        {allOpen ? (
          <g>
            <rect x="6" y="18" width="14" height="22" fill="#0a0a0a" />
            <rect x="7" y="19" width="12" height="20" fill="#fef3c7" opacity="0.18" />
            <text x="13" y="30" textAnchor="middle" fontSize="2" fill="#fef3c7" fontFamily="serif" fontWeight="bold">SALIDA</text>
          </g>
        ) : (
          <g>
            <rect x="6" y="18" width="14" height="22" fill="#1c0e06" stroke="#000" strokeWidth="0.4" />
            <rect x="7" y="19" width="12" height="20" fill="#3f3f46" stroke="#1c0e06" strokeWidth="0.3" />
            {/* tiny barred window */}
            <rect x="9" y="22" width="8" height="3" fill="#0a0a0a" />
            {[10, 11.5, 13, 14.5, 16].map((x) => (
              <line key={x} x1={x} y1="22" x2={x} y2="25" stroke="#1e293b" strokeWidth="0.2" />
            ))}
            <circle cx="17" cy="29" r="0.5" fill="#475569" />
          </g>
        )}
      </g>

      {/* Subtle code reveal on file cabinet area after heart calmed */}
      {heart && (
        <g>
          <motion.ellipse cx="83" cy="18" rx="5" ry="0.9" fill="#fbbf24" animate={{ opacity: [0.05, 0.16, 0.05] }} transition={{ duration: 2.4, repeat: Infinity }} />
          <motion.text x="83" y="18.5" textAnchor="middle" fontSize="1.3" fontWeight="bold" fill="#fde68a" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.5px #fbbf24)' }} opacity="0.7" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity }}>
            file: ver historia
          </motion.text>
        </g>
      )}
    </svg>
  )
}
