import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 21 — "Despacho del Detective"
 * Noir 1940s office: rainy window, radio transmitter (morse), evidence
 * wall, cipher cabinet, desk lamp, exit door at the right.
 */
export function DetectiveScene({ state }: Props) {
  const morse = !!state.flags.dt_morse
  const deduce = !!state.flags.dt_deduce
  const cipher = !!state.flags.dt_cipher
  const allOpen = morse && deduce && cipher

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Despacho del detective"
    >
      <defs>
        <linearGradient id="dtWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id="dtFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1917" />
          <stop offset="100%" stopColor="#0c0a09" />
        </linearGradient>
        <radialGradient id="dtLamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="dtRain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="100" height="42" fill="url(#dtWall)" />
      <rect x="0" y="42" width="100" height="14" fill="url(#dtFloor)" />
      {/* Wood plank floor */}
      {[12, 28, 44, 60, 76, 92].map((x) => (
        <line key={x} x1={x} y1="42" x2={x - 4} y2="56" stroke="#0c0a09" strokeWidth="0.3" />
      ))}

      {/* Venetian blind window with rain (top-left) */}
      <g>
        <rect x="3" y="4" width="20" height="22" fill="url(#dtRain)" stroke="#3f3f46" strokeWidth="0.3" />
        {/* Blinds */}
        {[6, 9, 12, 15, 18, 21, 24].map((y) => (
          <line key={y} x1="3" y1={y} x2="23" y2={y} stroke="#1c1917" strokeWidth="0.4" opacity="0.85" />
        ))}
        {/* Rain streaks */}
        {[5, 8, 11, 14, 17, 20].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1="4"
            x2={x - 0.6}
            y2="26"
            stroke="#94a3b8"
            strokeWidth="0.15"
            opacity="0.5"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 0.6 + i * 0.05, repeat: Infinity }}
          />
        ))}
      </g>

      {/* Desk with lamp and radio (center) */}
      <g>
        {/* desk */}
        <rect x="28" y="32" width="44" height="14" fill="#3f2a1a" stroke="#1c1917" strokeWidth="0.3" />
        <rect x="28" y="46" width="44" height="2" fill="#1c1917" />
        {/* lamp */}
        <g transform="translate(34 24)">
          <rect x="-0.4" y="0" width="0.8" height="8" fill="#52525b" />
          <path d="M -3 0 L 3 0 L 2 -3 L -2 -3 Z" fill="#7c2d12" stroke="#1c0e06" strokeWidth="0.2" />
          {/* light cone */}
          <ellipse cx="0" cy="11" rx="9" ry="6" fill="url(#dtLamp)" />
        </g>
        {/* radio transmitter (morse hotspot) */}
        <g transform="translate(40 34)">
          <rect width="14" height="8" fill="#1c1917" stroke="#52525b" strokeWidth="0.3" rx="0.4" />
          {/* dial */}
          <circle cx="3.5" cy="4" r="2" fill="#27272a" stroke="#52525b" strokeWidth="0.2" />
          <motion.line
            x1="3.5"
            y1="4"
            x2="3.5"
            y2="2.2"
            stroke="#fbbf24"
            strokeWidth="0.3"
            style={{ transformOrigin: '3.5px 4px' }}
            animate={morse ? { rotate: 90 } : { rotate: [0, 60, 0] }}
            transition={{ duration: 3, repeat: morse ? 0 : Infinity }}
          />
          {/* speaker grille */}
          <rect x="7" y="2" width="6" height="4" fill="#27272a" stroke="#52525b" strokeWidth="0.15" />
          {[2.5, 3.5, 4.5].map((y) => (
            <line key={y} x1="7" y1={y} x2="13" y2={y} stroke="#52525b" strokeWidth="0.15" />
          ))}
          {/* power LED */}
          <circle cx="13" cy="7" r="0.3" fill={morse ? '#10b981' : '#ef4444'} />
        </g>
        {/* paperwork + cigarette */}
        <rect x="58" y="36" width="10" height="6" fill="#f5deb3" opacity="0.7" />
        <line x1="59" y1="38" x2="67" y2="38" stroke="#1c1917" strokeWidth="0.1" />
        <line x1="59" y1="39.5" x2="67" y2="39.5" stroke="#1c1917" strokeWidth="0.1" />
        {/* cigarette ash trail */}
        <motion.path
          d="M 56 35 q 0.5 -2 1.5 -3"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="0.2"
          opacity="0.4"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </g>

      {/* Evidence wall (right, deduction puzzle) */}
      <g>
        <rect x="74" y="6" width="22" height="24" fill="#27272a" stroke="#52525b" strokeWidth="0.3" />
        {/* corkboard texture */}
        {[
          [3, 3], [9, 5], [16, 3], [4, 11], [13, 10], [18, 14], [7, 17], [15, 18],
        ].map(([x, y], i) => (
          <rect
            key={i}
            x={74 + x}
            y={6 + y}
            width="3"
            height="3.5"
            fill="#f5deb3"
            opacity={deduce ? '0.4' : '0.7'}
            stroke="#1c1917"
            strokeWidth="0.1"
            transform={`rotate(${(i % 3) * 6 - 6} ${74 + x + 1.5} ${6 + y + 1.5})`}
          />
        ))}
        {/* red string connecting two photos */}
        {deduce && (
          <>
            <line x1="78" y1="11" x2="89" y2="12" stroke="#ef4444" strokeWidth="0.3" />
            <line x1="89" y1="12" x2="80" y2="18" stroke="#ef4444" strokeWidth="0.3" />
            <line x1="80" y1="18" x2="92" y2="22" stroke="#ef4444" strokeWidth="0.3" />
          </>
        )}
      </g>

      {/* Filing cabinet (cipher hotspot, bottom right of desk) */}
      <g transform="translate(76 32)">
        <rect width="14" height="14" fill="#3f3f46" stroke="#18181b" strokeWidth="0.3" />
        {[0, 1, 2].map((row) => (
          <g key={row}>
            <rect x="0" y={row * 4.5} width="14" height="4" fill="#52525b" stroke="#1c1917" strokeWidth="0.15" />
            <circle cx="7" cy={row * 4.5 + 2} r="0.4" fill="#27272a" />
          </g>
        ))}
        <rect x="6" y="0" width="2" height="14" fill={cipher ? '#10b981' : '#52525b'} opacity="0.4" />
      </g>

      {/* Exit door — visible only when all 3 solved */}
      {allOpen && (
        <g>
          <rect x="42" y="2" width="14" height="30" fill="#0a0a0a" stroke="#fbbf24" strokeWidth="0.4" />
          <text x="49" y="20" textAnchor="middle" fontSize="2" fill="#fbbf24" fontFamily="serif">SALIDA</text>
          <ellipse cx="49" cy="32" rx="6" ry="0.5" fill="#fbbf24" opacity="0.2" />
        </g>
      )}
    </svg>
  )
}
