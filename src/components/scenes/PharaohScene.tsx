import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 8 — "La Cámara del Faraón"
 * Egyptian tomb. Sandstone walls with hieroglyphs, sarcophagus in center,
 * canopic jars on a shelf, a wall of glyphs (cipher hint), torch-lit.
 */
export function PharaohScene({ state }: Props) {
  const sarc = !!state.flags.ph_sarc
  const glyphs = !!state.flags.ph_glyphs
  const balance = !!state.flags.ph_balance
  const allOpen = sarc && glyphs && balance

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Cámara del faraón">
      <defs>
        <linearGradient id="phWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a16e3e" />
          <stop offset="100%" stopColor="#5a3520" />
        </linearGradient>
        <linearGradient id="phFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c4d2f" />
          <stop offset="100%" stopColor="#3f2415" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <radialGradient id="torchPh" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#phWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#phFloor)" />
      {/* sand piles */}
      <ellipse cx="15" cy="50" rx="8" ry="1" fill="#92750a" opacity="0.5" />
      <ellipse cx="85" cy="51" rx="10" ry="1" fill="#92750a" opacity="0.4" />

      {/* Torch left + right */}
      {[6, 94].map((x, i) => (
        <g key={x}>
          <rect x={x - 0.7} y="14" width="1.4" height="6" fill="#3f2415" />
          <motion.path d={`M ${x - 1} 13 Q ${x} 8 ${x + 1} 13`} fill="url(#torchPh)" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.8 + i * 0.2, repeat: Infinity }} />
          <motion.circle cx={x} cy="10" r="0.5" fill="#fef3c7" animate={{ opacity: [0.7, 1, 0.7], cy: [10, 9.5, 10] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.3 }} />
          <circle cx={x} cy="13" r="11" fill="url(#torchPh)" opacity="0.6" />
        </g>
      ))}

      {/* Wall of hieroglyphs (cipher hint visualization) */}
      <g>
        <rect x="12" y="22" width="22" height="14" fill="#5a3520" stroke="#2a1709" strokeWidth="0.3" />
        <text x="23" y="25" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#fde68a" fontFamily="serif">JEROGLÍFICOS</text>
        {/* glyph rows */}
        {[28, 30.5, 33].map((y, ri) => (
          <text key={ri} x="23" y={y} textAnchor="middle" fontSize="1.8" fill="#fde68a" fontFamily="serif">
            {['𓂀 𓆣 𓅓 𓊪', '𓃭 𓎛 𓂋 𓏏', '𓊃 𓍯 𓆑 𓈖'][ri]}
          </text>
        ))}
      </g>

      {/* Sarcophagus center — rotation puzzle */}
      <g transform="translate(50 42)">
        <ellipse cx="0" cy="3" rx="14" ry="1.5" fill="#000" opacity="0.6" />
        {/* sarcophagus shape */}
        <path d="M -12 3 Q -12 -7 -8 -8 Q 0 -10 8 -8 Q 12 -7 12 3 Z" fill="url(#gold)" stroke="#854d0e" strokeWidth="0.4" />
        {/* face mask */}
        <ellipse cx="0" cy="-5" rx="3" ry="3.5" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.3" />
        <rect x="-2" y="-3" width="4" height="0.6" fill="#1c0e06" />
        <rect x="-1.5" y="-5.5" width="3" height="0.4" fill="#1c0e06" />
        {/* rings on chest */}
        {[5, 3.5, 2].map((r, idx) => (
          <circle key={idx} r={r} fill="none" stroke={sarc ? '#10b981' : '#1c0e06'} strokeWidth="0.3" opacity="0.8" cy="1" />
        ))}
        <circle r="0.6" fill={sarc ? '#10b981' : '#854d0e'} cy="1" />
      </g>

      {/* Canopic jars shelf (cipher panel entry) */}
      <g>
        <rect x="62" y="32" width="22" height="4" fill="#7c4d2f" stroke="#2a1709" strokeWidth="0.3" />
        {/* 4 canopic jars */}
        {['◑', '◐', '◒', '◓'].map((g, i) => (
          <g key={i}>
            <rect x={64 + i * 5} y="26" width="3.5" height="6" fill={glyphs ? '#10b981' : '#fbbf24'} stroke="#854d0e" strokeWidth="0.25" rx="0.3" />
            <ellipse cx={65.75 + i * 5} cy="25.5" rx="2" ry="1" fill={glyphs ? '#10b981' : '#854d0e'} />
            <text x={65.75 + i * 5} y="29.5" textAnchor="middle" fontSize="1.4" fill="#1c0e06" fontFamily="serif">{g}</text>
          </g>
        ))}
        <text x="73" y="36.5" textAnchor="middle" fontSize="0.9" fill="#fde68a" fontFamily="serif">VASOS CANOPOS</text>
      </g>

      {/* Hieroglyph cipher numbers carved on left wall */}
      <g>
        <rect x="38" y="22" width="20" height="6" fill="#5a3520" stroke="#2a1709" strokeWidth="0.3" />
        <text x="48" y="24" textAnchor="middle" fontSize="0.8" fontWeight="bold" fill="#fde68a" fontFamily="serif">INSCRIPCIÓN</text>
        <text x="48" y="27.4" textAnchor="middle" fontSize="2.5" fontWeight="bold" fill="#fde68a" fontFamily="serif">1·13·21·14</text>
      </g>

      {/* Balance scale on the right (slider puzzle) */}
      <g>
        <line x1="50" y1="12" x2="50" y2="20" stroke="#854d0e" strokeWidth="0.4" />
        <line x1="45" y1="14" x2="55" y2="14" stroke="#854d0e" strokeWidth="0.4" />
        <circle cx="44.5" cy="14.5" r="1" fill={balance ? '#10b981' : '#fbbf24'} />
        <circle cx="55.5" cy="14.5" r="1" fill={balance ? '#10b981' : '#fbbf24'} />
        <line x1="44.5" y1="15.5" x2="44.5" y2="18" stroke="#854d0e" strokeWidth="0.3" />
        <line x1="55.5" y1="15.5" x2="55.5" y2="18" stroke="#854d0e" strokeWidth="0.3" />
        {!balance && (
          <motion.line x1="42" y1="14" x2="58" y2="14" stroke="#854d0e" strokeWidth="0.4" animate={{ rotate: [-5, 5, -5] }} style={{ transformOrigin: '50px 14px' }} transition={{ duration: 1.5, repeat: Infinity }} />
        )}
      </g>

      {/* Exit door — top-back center */}
      <g>
        {allOpen ? (
          <g>
            <path d="M 43 2 Q 50 -2 57 2 L 57 14 L 43 14 Z" fill="#1c0e06" />
            <rect x="44" y="3" width="12" height="11" fill="#fde68a" opacity="0.2" />
            <text x="50" y="9" textAnchor="middle" fontSize="1.6" fill="#fde68a" fontFamily="serif" fontWeight="bold">SALIDA</text>
          </g>
        ) : (
          <g>
            <path d="M 43 6 Q 50 2 57 6 L 57 14 L 43 14 Z" fill="url(#phWall)" stroke="#2a1709" strokeWidth="0.4" />
            <text x="50" y="11" textAnchor="middle" fontSize="3" fill="#1c0e06" fontFamily="serif">𓋹</text>
          </g>
        )}
      </g>

      {/* Subtle glow effect over the door once all 3 mechanisms unlock */}
      {allOpen && (
        <motion.ellipse
          cx="50" cy="8" rx="10" ry="3"
          fill="#fde68a" opacity="0.3"
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* dust motes */}
      {[20, 40, 65, 80].map((x, i) => (
        <circle key={i} cx={x} cy={15 + (i % 2) * 10} r="0.18" fill="#fef3c7" opacity="0.4" />
      ))}
    </svg>
  )
}
