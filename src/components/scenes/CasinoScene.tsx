import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 9 — "Casino Vault"
 * Neon-noir vault. Red velvet floor, neon "VIP" sign, alarm panel with
 * tangled wires, big circular vault door, slot machine in corner.
 */
export function CasinoScene({ state }: Props) {
  const alarm = !!state.flags.cas_alarm
  const dial = !!state.flags.cas_dial
  const vault = !!state.flags.cas_vault
  const allOpen = alarm && dial && vault

  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Casino vault">
      <defs>
        <linearGradient id="casWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c0e22" />
          <stop offset="100%" stopColor="#0a0612" />
        </linearGradient>
        <linearGradient id="casFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#3f0a0a" />
        </linearGradient>
        <linearGradient id="vaultSteel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <radialGradient id="neonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="redNeon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="100" height="40" fill="url(#casWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#casFloor)" />
      {/* velvet floor pattern */}
      <g opacity="0.4">
        {[42, 46, 50, 54].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#fbbf24" strokeWidth="0.05" />
        ))}
      </g>

      {/* Neon "VIP" sign */}
      <g transform="translate(15 8)">
        <motion.text x="0" y="0" fontSize="6" fontWeight="bold" fill="#a855f7" fontFamily="monospace" style={{ filter: 'drop-shadow(0 0 2px #a855f7) drop-shadow(0 0 5px #a855f7)' }} animate={{ opacity: [0.7, 1, 0.9, 1, 0.7] }} transition={{ duration: 2.4, repeat: Infinity }}>
          VIP
        </motion.text>
        <rect x="-4" y="-12" width="20" height="14" fill="url(#neonGlow)" />
      </g>

      {/* Slot machine corner */}
      <g transform="translate(8 26)">
        <rect x="0" y="0" width="14" height="14" fill="#7f1d1d" stroke="#3f0a0a" strokeWidth="0.4" rx="0.4" />
        <rect x="1" y="2" width="12" height="6" fill="#0a0a0a" />
        {[3.5, 7, 10.5].map((x, i) => (
          <motion.text key={i} x={x} y="6.5" textAnchor="middle" fontSize="3.5" fontWeight="bold" fill="#fbbf24" fontFamily="monospace" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1 + i * 0.2, repeat: Infinity }}>
            7
          </motion.text>
        ))}
        <rect x="11" y="9" width="2" height="3" fill="#0a0a0a" />
        <rect x="0" y="13" width="14" height="1" fill="#3f0a0a" />
      </g>

      {/* Alarm panel center-left — wire puzzle */}
      <g>
        <rect x="28" y="14" width="14" height="14" fill="#0a0a0a" stroke="#a855f7" strokeWidth="0.4" rx="0.3" />
        <text x="35" y="17" textAnchor="middle" fontSize="1" fontWeight="bold" fill={alarm ? '#10b981' : '#ef4444'} fontFamily="monospace">ALARMA</text>
        {/* tangled wires */}
        {alarm ? (
          <g>
            {[18.5, 20, 21.5, 23, 24.5].map((y, i) => (
              <line key={i} x1="29" y1={y} x2="41" y2={y} stroke={['#ef4444', '#3b82f6', '#fbbf24', '#10b981', '#a855f7'][i]} strokeWidth="0.4" />
            ))}
          </g>
        ) : (
          <g>
            <path d="M 29 18.5 Q 32 22, 35 19 T 41 21" stroke="#ef4444" strokeWidth="0.5" fill="none" />
            <path d="M 29 20 Q 33 24, 38 21 T 41 24" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            <path d="M 29 22 Q 32 26, 35 22 T 41 26" stroke="#fbbf24" strokeWidth="0.5" fill="none" />
            <motion.circle cx="34" cy="24" r="0.3" fill="#fef3c7" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4, repeat: Infinity }} />
          </g>
        )}
      </g>

      {/* Big vault door — center-right */}
      <g transform="translate(70 22)">
        {allOpen ? (
          <g>
            <circle r="14" fill="#0a0a0a" />
            <circle r="12" fill="#fef3c7" opacity="0.18" />
            <text x="0" y="2" textAnchor="middle" fontSize="3" fill="#fef3c7" fontFamily="monospace" fontWeight="bold">$ $ $</text>
          </g>
        ) : (
          <g>
            {/* outer ring */}
            <circle r="14" fill="url(#vaultSteel)" stroke="#0a0a0a" strokeWidth="0.6" />
            {/* bolts */}
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * 45 * Math.PI) / 180
              return <circle key={i} cx={12.5 * Math.cos(a)} cy={12.5 * Math.sin(a)} r="0.7" fill="#1e293b" />
            })}
            {/* inner panel */}
            <circle r="10" fill="#1e293b" stroke="#0a0a0a" strokeWidth="0.4" />
            {/* combination dial */}
            <circle r="6" fill={dial ? '#10b981' : '#475569'} stroke="#0a0a0a" strokeWidth="0.4" />
            <circle r="4.5" fill="#0a0a0a" />
            {/* dial pointer */}
            <line x1="0" y1="0" x2="0" y2="-4" stroke="#fbbf24" strokeWidth="0.4" />
            {/* dial ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180
              return <line key={i} x1={5.5 * Math.cos(a)} y1={5.5 * Math.sin(a)} x2={6.5 * Math.cos(a)} y2={6.5 * Math.sin(a)} stroke="#cbd5e1" strokeWidth="0.2" />
            })}
            {/* spinning wheel handle */}
            <g transform="translate(0 8)">
              {[0, 90, 180, 270].map((d) => (
                <rect key={d} x="-0.3" y="-2" width="0.6" height="2" fill="#1e293b" transform={`rotate(${d})`} />
              ))}
              <circle r="0.6" fill="#0a0a0a" />
            </g>
            {/* keypad on the right side */}
            <g transform="translate(11 -6)">
              <rect x="0" y="0" width="6" height="9" fill="#0a0a0a" stroke="#475569" strokeWidth="0.3" rx="0.3" />
              {[0, 1, 2].map((row) =>
                [0, 1, 2].map((col) => (
                  <rect key={`${row}-${col}`} x={0.6 + col * 1.7} y={0.5 + row * 1.7} width="1.4" height="1.4" fill="#1e293b" stroke="#475569" strokeWidth="0.1" rx="0.15" />
                )),
              )}
              <circle cx="3" cy="7.5" r="0.3" fill={vault ? '#10b981' : '#ef4444'} />
            </g>
          </g>
        )}
      </g>

      {/* Subtle red neon strip top edge — security camera area */}
      <motion.rect x="0" y="0" width="100" height="0.6" fill="#ef4444" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <rect x="0" y="0" width="100" height="10" fill="url(#redNeon)" />

      {/* Hint dealer card on the floor */}
      <g transform="translate(45 47) rotate(8)">
        <rect x="0" y="0" width="6" height="8" fill="#fef3c7" stroke="#0a0a0a" strokeWidth="0.2" />
        <text x="3" y="2" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#dc2626" fontFamily="monospace">DIAL</text>
        <text x="3" y="4.5" textAnchor="middle" fontSize="2" fontWeight="bold" fill="#1c0e06" fontFamily="serif">7</text>
        <text x="3" y="6.7" textAnchor="middle" fontSize="0.7" fontWeight="bold" fill="#1c0e06" fontFamily="monospace">2·5·9</text>
      </g>

      {/* Subtle vault code shown after dial solved */}
      {dial && (
        <g>
          <motion.ellipse cx="70" cy="40" rx="5" ry="0.9" fill="#fbbf24" animate={{ opacity: [0.05, 0.16, 0.05] }} transition={{ duration: 2.4, repeat: Infinity }} />
          {['9', '6', '3', '0'].map((d, i) => (
            <motion.text key={i} x={67 + i * 2.5} y="40.6" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#fde68a" fontFamily="serif" style={{ filter: 'drop-shadow(0 0 0.5px #fbbf24)' }} opacity="0.7" animate={{ opacity: [0.55, 0.78, 0.55] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.16 }}>
              {d}
            </motion.text>
          ))}
        </g>
      )}
    </svg>
  )
}
