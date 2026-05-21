import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 4 — "El Templo Olvidado"
 * Atmósfera: piedra antigua, antorchas, vides colgando, glifos tallados.
 * Centro: altar con 3 anillos concéntricos rotatorios (rotation puzzle).
 * Pared izquierda: tablilla con cifra numérica (cipher hint).
 * Pared derecha: estela con la clave del alfabeto (clue para descifrar).
 * Atrás: puerta sellada con keypad de 4 dígitos (door code).
 */
export function TempleScene({ state }: Props) {
  const sysRings = !!state.flags.temple_rings
  const sysCipher = !!state.flags.temple_cipher
  const sysDoor = !!state.flags.temple_door
  const allOpen = sysRings && sysCipher && sysDoor

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Templo olvidado"
    >
      <defs>
        <linearGradient id="templeWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3520" />
          <stop offset="100%" stopColor="#2a1709" />
        </linearGradient>
        <linearGradient id="templeFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f2a1c" />
          <stop offset="100%" stopColor="#1f140d" />
        </linearGradient>
        <linearGradient id="stoneBlock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c5742" />
          <stop offset="100%" stopColor="#3f2a1c" />
        </linearGradient>
        <linearGradient id="tablet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6d4f" />
          <stop offset="100%" stopColor="#4a3220" />
        </linearGradient>
        <radialGradient id="torchGlow" cx="0.5" cy="0.6" r="0.6">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="templeVignette" cx="0.5" cy="0.55" r="0.8">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.65" />
        </radialGradient>
      </defs>

      {/* wall + floor */}
      <rect x="0" y="0" width="100" height="40" fill="url(#templeWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#templeFloor)" />
      {/* stone block courses */}
      {[8, 18, 28, 38].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#1c0e06" strokeOpacity="0.5" strokeWidth="0.2" />
      ))}
      {[15, 35, 50, 70, 85].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="40" stroke="#1c0e06" strokeOpacity="0.4" strokeWidth="0.15" />
      ))}
      {/* floor tile cracks */}
      {[15, 32, 50, 68, 85].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 4} y2="56" stroke="#0a0a0a" strokeOpacity="0.6" strokeWidth="0.2" />
      ))}

      {/* Torches on walls — left and right */}
      <g>
        {/* left torch */}
        <rect x="2" y="14" width="1.4" height="5" fill="#3f2415" />
        <rect x="1.4" y="13" width="2.6" height="1.2" fill="#1c0e06" />
        <motion.path
          d="M 1.8 13 Q 2.7 9, 3.6 13"
          fill="url(#torchGlow)"
          animate={{ opacity: [0.8, 1, 0.85] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.circle
          cx="2.7" cy="11" r="0.5" fill="#fef3c7"
          animate={{ opacity: [0.7, 1, 0.7], cy: [11, 10.5, 11] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        {/* glow halo */}
        <circle cx="2.7" cy="13" r="12" fill="url(#torchGlow)" opacity="0.6" />

        {/* right torch */}
        <rect x="96.6" y="14" width="1.4" height="5" fill="#3f2415" />
        <rect x="96" y="13" width="2.6" height="1.2" fill="#1c0e06" />
        <motion.path
          d="M 96.4 13 Q 97.3 9, 98.2 13"
          fill="url(#torchGlow)"
          animate={{ opacity: [0.85, 1, 0.8] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="97.3" cy="11" r="0.5" fill="#fef3c7"
          animate={{ opacity: [0.7, 1, 0.7], cy: [11, 10.4, 11] }}
          transition={{ duration: 1.3, repeat: Infinity, delay: 0.4 }}
        />
        <circle cx="97.3" cy="13" r="12" fill="url(#torchGlow)" opacity="0.6" />
      </g>

      {/* Vines hanging from ceiling */}
      <g opacity="0.85">
        <path d="M 10 0 Q 11 8, 9 14 Q 12 18, 10 24" stroke="#15803d" strokeWidth="0.3" fill="none" />
        <circle cx="9.5" cy="13" r="0.5" fill="#22c55e" opacity="0.8" />
        <circle cx="10.2" cy="20" r="0.4" fill="#22c55e" opacity="0.7" />

        <path d="M 88 0 Q 87 8, 90 14 Q 87 18, 89 24" stroke="#15803d" strokeWidth="0.3" fill="none" />
        <circle cx="89" cy="11" r="0.5" fill="#22c55e" opacity="0.8" />
        <circle cx="88.5" cy="20" r="0.4" fill="#22c55e" opacity="0.7" />

        <path d="M 22 0 Q 23 6, 21 12" stroke="#15803d" strokeWidth="0.25" fill="none" opacity="0.7" />
        <path d="M 78 0 Q 77 6, 79 12" stroke="#15803d" strokeWidth="0.25" fill="none" opacity="0.7" />
      </g>

      {/* LEFT WALL: cipher tablet — the encrypted numbers (clue for cipher puzzle) */}
      <g>
        <rect x="6" y="22" width="14" height="14" fill="url(#tablet)" stroke="#2a1709" strokeWidth="0.4" />
        {/* carved title */}
        <text x="13" y="26" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#1c0e06" fontFamily="serif" opacity="0.9">
          INSCRIPCIÓN
        </text>
        <line x1="7" y1="27" x2="19" y2="27" stroke="#1c0e06" strokeOpacity="0.4" strokeWidth="0.15" />
        {/* the four numbers */}
        <text x="13" y="32" textAnchor="middle" fontSize="3.6" fontWeight="bold" fill="#1c0e06" fontFamily="serif">
          4 · 9 · 15 · 19
        </text>
        {/* moss */}
        <rect x="6" y="34" width="14" height="0.4" fill="#15803d" opacity="0.5" />
        <circle cx="7" cy="22.5" r="0.5" fill="#22c55e" opacity="0.5" />
      </g>

      {/* RIGHT WALL: alphabet stela — the cipher key (A=1 ... Z=26) */}
      <g>
        <rect x="80" y="22" width="14" height="14" fill="url(#tablet)" stroke="#2a1709" strokeWidth="0.4" />
        <text x="87" y="26" textAnchor="middle" fontSize="1.4" fontWeight="bold" fill="#1c0e06" fontFamily="serif">
          ESTELA
        </text>
        <line x1="81" y1="27" x2="93" y2="27" stroke="#1c0e06" strokeOpacity="0.4" strokeWidth="0.15" />
        {/* sample mapping lines */}
        <text x="87" y="29.6" textAnchor="middle" fontSize="1.3" fill="#1c0e06" fontFamily="monospace">
          A=1 · B=2 · …
        </text>
        <text x="87" y="31.6" textAnchor="middle" fontSize="1.3" fill="#1c0e06" fontFamily="monospace">
          M=13 · N=14 · …
        </text>
        <text x="87" y="33.6" textAnchor="middle" fontSize="1.3" fill="#1c0e06" fontFamily="monospace">
          Y=25 · Z=26
        </text>
        <rect x="80" y="34" width="14" height="0.4" fill="#15803d" opacity="0.4" />
      </g>

      {/* CENTER: stone altar with 3 concentric rings on top */}
      <g>
        {/* altar shadow */}
        <ellipse cx="50" cy="45.5" rx="14" ry="1.2" fill="#000" opacity="0.5" />
        {/* altar block */}
        <rect x="38" y="36" width="24" height="9" fill="url(#stoneBlock)" stroke="#2a1709" strokeWidth="0.4" rx="0.4" />
        <rect x="36" y="35" width="28" height="1.6" fill="#7c5742" stroke="#2a1709" strokeWidth="0.3" />
        <rect x="36" y="44" width="28" height="1.6" fill="#5a3520" stroke="#2a1709" strokeWidth="0.3" />
        {/* glyphs etched on the side */}
        {['◆', '◇', '◉', '✦', '✧'].map((g, i) => (
          <text
            key={i}
            x={40 + i * 5}
            y="42.4"
            fontSize="1.6"
            fill="#fbbf24"
            opacity="0.5"
            fontFamily="serif"
          >
            {g}
          </text>
        ))}

        {/* The 3-ring puzzle on top of altar — visual cue */}
        <g transform="translate(50 30)">
          {[7, 5, 3].map((r, idx) => (
            <circle
              key={idx}
              r={r}
              fill="none"
              stroke={sysRings ? '#10b981' : '#a16e3e'}
              strokeWidth="1.2"
              opacity={sysRings ? 0.9 : 0.7}
            />
          ))}
          <circle r="1.2" fill={sysRings ? '#10b981' : '#1c0e06'} />
          {/* tiny up arrow indicating "target = top" */}
          <path d="M 0 -8.5 L -1 -7 L 1 -7 Z" fill="#fef3c7" />
          {/* status indicator next to altar */}
          {sysRings && (
            <motion.circle
              r="9"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.3"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
        </g>
      </g>

      {/* BACK CENTER: sealed temple door with keypad */}
      <g>
        {allOpen ? (
          // Open archway — path beyond
          <g>
            <path
              d="M 41 5 Q 50 0, 59 5 L 59 22 L 41 22 Z"
              fill="#1c0e06"
              stroke="#3f2415"
              strokeWidth="0.4"
            />
            {/* light spilling */}
            <path
              d="M 43 7 Q 50 4, 57 7 L 57 22 L 43 22 Z"
              fill="#fef3c7"
              opacity="0.18"
            />
            <text x="50" y="14" textAnchor="middle" fontSize="2.2" fontWeight="bold" fill="#fef3c7" fontFamily="serif" opacity="0.8">
              SALIDA
            </text>
          </g>
        ) : (
          // Sealed door (round-topped stone)
          <g>
            <path
              d="M 41 8 Q 50 3, 59 8 L 59 22 L 41 22 Z"
              fill="url(#stoneBlock)"
              stroke="#2a1709"
              strokeWidth="0.4"
            />
            {/* stone seam */}
            <line x1="50" y1="3.5" x2="50" y2="22" stroke="#1c0e06" strokeWidth="0.3" />
            {/* central glyph */}
            <text x="50" y="17" textAnchor="middle" fontSize="3.5" fill="#1c0e06" fontFamily="serif" fontWeight="bold">
              ✦
            </text>

            {/* Glowing runes — ONLY visible after the cipher is solved.
                These reveal the door code (7-4-2-1). The corresponding hotspot
                ("Runas sobre el portón") sits right here. */}
            {sysCipher && (
              <g>
                {/* subtle halo */}
                <motion.ellipse
                  cx="50"
                  cy="10.7"
                  rx="6"
                  ry="1.2"
                  fill="#fbbf24"
                  animate={{ opacity: [0.06, 0.18, 0.06] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* the 4 numerals — engraved, faint glow */}
                {['7', '4', '2', '1'].map((d, i) => (
                  <motion.text
                    key={i}
                    x={45.5 + i * 3}
                    y="11.6"
                    textAnchor="middle"
                    fontSize="1.9"
                    fontWeight="bold"
                    fill="#fde68a"
                    fontFamily="serif"
                    style={{ filter: 'drop-shadow(0 0 0.6px #fbbf24)' }}
                    opacity="0.72"
                    animate={{ opacity: [0.55, 0.78, 0.55] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.18,
                    }}
                  >
                    {d}
                  </motion.text>
                ))}
              </g>
            )}
            {/* keypad panel to the right of the door */}
            <g>
              <rect x="60" y="11" width="6" height="9" fill="#1c0e06" stroke="#3f2415" strokeWidth="0.3" rx="0.3" />
              {[0, 1, 2].map((row) =>
                [0, 1, 2].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={60.7 + col * 1.6}
                    y={11.7 + row * 2}
                    width="1.4"
                    height="1.6"
                    rx="0.2"
                    fill="#3f2415"
                    stroke="#5a3520"
                    strokeWidth="0.1"
                  />
                )),
              )}
              <circle cx="63" cy="19.6" r="0.3" fill={sysDoor ? '#10b981' : '#ef4444'} />
            </g>
            {/* hanging chain motif over door */}
            <line x1="50" y1="0" x2="50" y2="3" stroke="#475569" strokeWidth="0.2" />
          </g>
        )}
      </g>

      {/* Sealed compartment panel — opens when cipher solved (just visual indicator) */}
      <g>
        <rect x="68" y="38" width="6" height="3" fill={sysCipher ? '#15803d' : '#1c0e06'} stroke="#2a1709" strokeWidth="0.2" />
        <text x="71" y="40.3" textAnchor="middle" fontSize="0.9" fill={sysCipher ? '#fef3c7' : '#fbbf24'} fontFamily="serif" opacity="0.9">
          {sysCipher ? 'ABIERTO' : 'CIFRA'}
        </text>
      </g>

      {/* Cracks and atmospheric details on floor */}
      <g opacity="0.7">
        <path d="M 18 48 Q 28 49, 36 47" stroke="#0a0a0a" strokeWidth="0.2" fill="none" />
        <path d="M 70 52 Q 80 51, 92 53" stroke="#0a0a0a" strokeWidth="0.2" fill="none" />
        {/* fallen rocks */}
        <circle cx="22" cy="51" r="0.6" fill="#5a3520" />
        <circle cx="25" cy="52" r="0.4" fill="#3f2a1c" />
        <circle cx="78" cy="50" r="0.5" fill="#5a3520" />
      </g>

      {/* corner vignette */}
      <rect x="0" y="0" width="100" height="56" fill="url(#templeVignette)" />
    </svg>
  )
}
