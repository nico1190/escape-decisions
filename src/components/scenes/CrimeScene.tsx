import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 13 — "Escena del Crimen"
 * Detective's office. Corkboard with red string between suspect photos.
 * Desk with case files, broken phone, evidence bags, a desk lamp.
 * Floor with chalk outline.
 */
export function CrimeScene({ state }: Props) {
  const suspect = !!state.flags.cr_suspect
  const witness = !!state.flags.cr_witness
  const note = !!state.flags.cr_note
  const allOpen = suspect && witness && note

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Escena del crimen">
      <defs>
        <linearGradient id="crWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1f1c" />
          <stop offset="100%" stopColor="#100a08" />
        </linearGradient>
        <linearGradient id="crFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f1a18" />
          <stop offset="100%" stopColor="#0a0807" />
        </linearGradient>
        <linearGradient id="crCork" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a16e3e" />
          <stop offset="100%" stopColor="#5a3520" />
        </linearGradient>
        <radialGradient id="lampLight" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#crWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#crFloor)" />

      {/* CORKBOARD with suspect grid + red string */}
      <g>
        <rect x="6" y="6" width="38" height="22" fill="url(#crCork)" stroke="#3f2415" strokeWidth="0.4" />
        <text x="25" y="9" textAnchor="middle" fontSize="0.9" fontWeight="bold" fill="#fde68a" fontFamily="monospace">CASO #2304</text>
        {/* 6 suspect photos in 2 rows */}
        {[0, 1, 2].map((col) =>
          [0, 1].map((row) => (
            <g key={`${col}-${row}`}>
              <rect x={9 + col * 12} y={11 + row * 8} width="8" height="6" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.25" />
              <circle cx={13 + col * 12} cy={13.5 + row * 8} r="1.2" fill="#cbd5e1" />
              <rect x={11.4 + col * 12} y={14.5 + row * 8} width="3.2" height="1.8" fill="#475569" />
            </g>
          )),
        )}
        {/* red string connections */}
        <path d="M 13 17 Q 22 13, 33 19" stroke="#dc2626" strokeWidth="0.3" fill="none" opacity="0.85" />
        <path d="M 25 24 Q 30 20, 37 25" stroke="#dc2626" strokeWidth="0.3" fill="none" opacity="0.85" />
        {/* highlighted suspect (when identified, draw an X) */}
        {suspect && (
          <g>
            <line x1="33" y1="20" x2="41" y2="26" stroke="#10b981" strokeWidth="0.6" />
            <line x1="33" y1="26" x2="41" y2="20" stroke="#10b981" strokeWidth="0.6" />
          </g>
        )}
        {/* anagram clue note */}
        <g transform="translate(36 12) rotate(6)">
          <rect x="0" y="0" width="6" height="4" fill="#fef3c7" stroke="#7c2d12" strokeWidth="0.15" />
          <text x="3" y="1.5" textAnchor="middle" fontSize="0.6" fill="#7c2d12" fontFamily="monospace">ANAGRAMA</text>
          <text x="3" y="3.2" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#1c0e06" fontFamily="serif">RAOSO</text>
        </g>
      </g>

      {/* DESK with case file + lamp + broken phone */}
      <g>
        <rect x="50" y="30" width="46" height="3" fill="#5a3520" stroke="#1c0e06" strokeWidth="0.3" />
        <rect x="52" y="33" width="3" height="6" fill="#3f2415" />
        <rect x="91" y="33" width="3" height="6" fill="#3f2415" />

        {/* desk lamp (green banker's) */}
        <g transform="translate(55 30)">
          <rect x="-0.4" y="-0.5" width="0.8" height="-4" fill="#1c0e06" />
          <path d="M -3 -4 L 3 -4 L 2.5 -6 L -2.5 -6 Z" fill="#15803d" stroke="#0a0a0a" strokeWidth="0.25" />
          <motion.circle cx="0" cy="-5" r="0.6" fill="#fef3c7" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <circle cx="0" cy="-4" r="12" fill="url(#lampLight)" />
        </g>

        {/* case file folder */}
        <g transform="translate(64 28) rotate(-5)">
          <rect x="0" y="0" width="10" height="6" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.25" />
          <rect x="0.5" y="0.5" width="9" height="5" fill="#fef3c7" />
          <text x="5" y="2" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">EXPEDIENTE</text>
          <line x1="2" y1="3" x2="8" y2="3" stroke="#1c0e06" strokeWidth="0.15" />
          <line x1="2" y1="3.7" x2="8" y2="3.7" stroke="#1c0e06" strokeWidth="0.15" />
          <line x1="2" y1="4.4" x2="6.5" y2="4.4" stroke="#1c0e06" strokeWidth="0.15" />
        </g>

        {/* broken phone (memory clue) */}
        <g transform="translate(80 28) rotate(20)">
          <rect x="0" y="0" width="6" height="3" fill="#1e293b" rx="0.3" />
          <rect x="0.4" y="0.4" width="5.2" height="2.2" fill="#0a0a0a" />
          <circle cx="3" cy="1.5" r="0.5" fill="#1e293b" />
          {/* crack */}
          <line x1="0.5" y1="0.5" x2="5.5" y2="2.5" stroke="#fef3c7" strokeWidth="0.15" />
          <line x1="2" y1="0.5" x2="4.5" y2="2.5" stroke="#fef3c7" strokeWidth="0.1" />
        </g>
      </g>

      {/* Encrypted note from victim (cipher entry) */}
      <g>
        <rect x="48" y="42" width="14" height="9" fill="#fef3c7" stroke="#7c2d12" strokeWidth="0.3" />
        <line x1="49" y1="43" x2="61" y2="43" stroke="#dc2626" strokeWidth="0.15" />
        <text x="55" y="44.5" textAnchor="middle" fontSize="0.8" fontWeight="bold" fill="#7c2d12" fontFamily="monospace">NOTA VÍCTIMA</text>
        <text x="55" y="47.5" textAnchor="middle" fontSize="2" fontWeight="bold" fill="#1c0e06" fontFamily="serif">8·21·25·5</text>
        <text x="55" y="50" textAnchor="middle" fontSize="0.6" fill="#7c2d12" fontFamily="serif" fontStyle="italic">"él dijo..."</text>
      </g>

      {/* Chalk outline on floor */}
      <g opacity="0.6">
        <path d="M 10 50 Q 6 47, 8 44 Q 12 42, 14 46 L 18 46 L 20 50 L 16 53 L 12 52 Z" fill="none" stroke="#f1f5f9" strokeWidth="0.3" strokeDasharray="0.5 0.4" />
      </g>

      {/* Evidence bag (witness memory) */}
      <g transform="translate(28 44)">
        <rect x="0" y="0" width="10" height="8" fill="#fef3c7" opacity="0.4" stroke="#475569" strokeWidth="0.25" />
        <text x="5" y="2" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#1c0e06" fontFamily="monospace">PRUEBA</text>
        <text x="5" y="4" textAnchor="middle" fontSize="0.6" fill="#7c2d12" fontFamily="monospace">ÚLT. LLAMADA</text>
        <rect x="2" y="5" width="6" height="2.5" fill="#fef3c7" stroke="#7c2d12" strokeWidth="0.15" />
      </g>

      {/* Exit door */}
      <g>
        {allOpen ? (
          <g>
            <rect x="78" y="6" width="14" height="22" fill="#0a0a0a" />
            <rect x="79" y="7" width="12" height="20" fill="#fde68a" opacity="0.2" />
            <text x="85" y="18" textAnchor="middle" fontSize="2" fill="#fde68a" fontFamily="serif" fontWeight="bold">SALIDA</text>
          </g>
        ) : (
          <g>
            <rect x="78" y="6" width="14" height="22" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.4" />
            <rect x="79" y="7" width="12" height="20" fill="#5a3520" stroke="#3f2415" strokeWidth="0.3" />
            <circle cx="89" cy="17" r="0.5" fill="#fbbf24" />
            <text x="85" y="18" textAnchor="middle" fontSize="3" fill="#1c0e06" fontFamily="serif">?</text>
          </g>
        )}
      </g>

      {/* Subtle code reveal */}
      {note && (
        <g>
          <motion.ellipse cx="85" cy="4" rx="5" ry="0.9" fill="#fbbf24" animate={{ opacity: [0.06, 0.16, 0.06] }} transition={{ duration: 2.4, repeat: Infinity }} />
          {['1', '4', '2', '7'].map((d, i) => (
            <motion.text key={i} x={81 + i * 2.5} y="4.6" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#fde68a" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.5px #fbbf24)' }} opacity="0.7" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.16 }}>
              {d}
            </motion.text>
          ))}
        </g>
      )}
    </svg>
  )
}
