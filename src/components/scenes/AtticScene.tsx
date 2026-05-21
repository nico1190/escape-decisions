import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Level 2 — "El Desván del Abuelo".
 * Warm wood tones, dusty light through a round window, old furniture.
 * Center stage: an antique trunk with three different locks (letters, colors,
 * numbers) that the player has to crack.
 *
 * Clue placement:
 *  - Photo on the desk (top-left of desk)         → word clue
 *  - Stained-glass round window                    → color sequence clue
 *  - Pocket watch on the desk                      → reveals memory numbers
 */
export function AtticScene({ state }: Props) {
  const lockLetters = state.flags.lock_letters === true
  const lockColors = state.flags.lock_colors === true
  const lockNumbers = state.flags.lock_numbers === true
  const allOpen = lockLetters && lockColors && lockNumbers

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Desván del abuelo"
    >
      <defs>
        <linearGradient id="atticWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f2a1c" />
          <stop offset="100%" stopColor="#1f140d" />
        </linearGradient>
        <linearGradient id="atticFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3520" />
          <stop offset="100%" stopColor="#2a1709" />
        </linearGradient>
        <linearGradient id="rafter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f2415" />
          <stop offset="100%" stopColor="#1c0e06" />
        </linearGradient>
        <linearGradient id="trunkWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92592f" />
          <stop offset="100%" stopColor="#4a2d1a" />
        </linearGradient>
        <radialGradient id="sunBeam" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atticVignette" cx="0.5" cy="0.55" r="0.7">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      {/* Wall + floor */}
      <rect x="0" y="0" width="100" height="40" fill="url(#atticWall)" />
      <rect x="0" y="40" width="100" height="16" fill="url(#atticFloor)" />
      {/* floorboards */}
      {[10, 25, 40, 55, 70, 85].map((x) => (
        <line key={x} x1={x} y1="40" x2={x - 3} y2="56" stroke="#2a1709" strokeOpacity="0.6" strokeWidth="0.2" />
      ))}
      <rect x="0" y="39.5" width="100" height="0.7" fill="#0a0a0a" opacity="0.7" />

      {/* Sloped ceiling rafters — define attic shape */}
      <path d="M 0 0 L 30 12 L 70 12 L 100 0 Z" fill="#1f140d" />
      <path d="M 0 0 L 30 12 L 30 14 L 0 2 Z" fill="#3f2415" />
      <path d="M 100 0 L 70 12 L 70 14 L 100 2 Z" fill="#3f2415" />
      {/* center beam */}
      <rect x="48" y="11" width="4" height="1.6" fill="url(#rafter)" />
      <rect x="30" y="12" width="40" height="1.2" fill="#1c0e06" />

      {/* Round stained-glass window — center back wall (color clue) */}
      <g transform="translate(50 22)">
        <circle r="6" fill="#1f140d" />
        <circle r="5.4" fill="url(#sunBeam)" />
        <circle r="5.4" fill="none" stroke="#1c0e06" strokeWidth="0.4" />
        {/* Stained glass panels — 5 colored wedges in clockwise order. This is the color-sequence solution. */}
        {[
          { color: '#dc2626', start: -90 },  // top = red
          { color: '#fbbf24', start: -18 },  // upper-right = yellow
          { color: '#3b82f6', start: 54 },   // lower-right = blue
          { color: '#10b981', start: 126 },  // lower-left = green
          { color: '#a855f7', start: 198 },  // upper-left = purple
        ].map(({ color, start }, i) => {
          const a1 = (start * Math.PI) / 180
          const a2 = ((start + 72) * Math.PI) / 180
          const r = 5
          const x1 = r * Math.cos(a1)
          const y1 = r * Math.sin(a1)
          const x2 = r * Math.cos(a2)
          const y2 = r * Math.sin(a2)
          return (
            <path
              key={i}
              d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
              fill={color}
              opacity="0.85"
              stroke="#1c0e06"
              strokeWidth="0.25"
            />
          )
        })}
        {/* leading rings */}
        <circle r="5" fill="none" stroke="#1c0e06" strokeWidth="0.3" />
        <circle r="2.5" fill="none" stroke="#1c0e06" strokeWidth="0.3" />
        <circle r="0.8" fill="#1c0e06" />
        {/* sill */}
        <rect x="-6.5" y="6" width="13" height="1" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.2" />
      </g>

      {/* Sun beam coming from window */}
      <path
        d="M 50 28 L 30 56 L 70 56 Z"
        fill="url(#sunBeam)"
        opacity="0.4"
      />

      {/* LEFT: stacked old suitcases + boxes */}
      <g>
        <rect x="2" y="32" width="14" height="6" fill="#5a3520" stroke="#2a1709" strokeWidth="0.3" rx="0.3" />
        <rect x="2" y="34" width="14" height="0.6" fill="#fbbf24" opacity="0.5" />
        <rect x="3.5" y="35" width="11" height="1.4" fill="#3f2415" />
        <circle cx="9" cy="32" r="0.6" fill="#94a3b8" />
        <rect x="4" y="26" width="10" height="6" fill="#7c4d2f" stroke="#2a1709" strokeWidth="0.3" rx="0.3" />
        <rect x="4" y="28" width="10" height="0.5" fill="#fbbf24" opacity="0.4" />
        <circle cx="9" cy="26" r="0.5" fill="#94a3b8" />
        <rect x="6" y="22" width="6" height="4" fill="#92592f" stroke="#2a1709" strokeWidth="0.3" />
      </g>

      {/* RIGHT: writing desk with photo + pocket watch + lamp */}
      <g>
        {/* desk */}
        <rect x="76" y="34" width="22" height="2" fill="#7c4d2f" stroke="#2a1709" strokeWidth="0.3" />
        <rect x="77" y="36" width="3" height="6" fill="#5a3520" />
        <rect x="94" y="36" width="3" height="6" fill="#5a3520" />
        <rect x="78" y="36" width="18" height="3" fill="#7c4d2f" stroke="#2a1709" strokeWidth="0.2" />
        {/* drawer pull */}
        <rect x="86" y="37.2" width="2" height="0.6" rx="0.2" fill="#d4b88a" />
        {/* desk lamp */}
        <line x1="80" y1="34" x2="80" y2="28" stroke="#475569" strokeWidth="0.4" />
        <path d="M 78 28 L 82 28 L 80.5 25 L 79.5 25 Z" fill="#475569" stroke="#1f2937" strokeWidth="0.3" />
        <circle cx="80" cy="27.5" r="0.6" fill="#fde68a" opacity="0.9" />
        {/* SMALL real photo on the desk — the one with the ROSE inscription.
            Visually identical to a decoy at this zoom: the inscription is
            illegible from outside the modal. Player must click and read. */}
        <rect x="85.2" y="31.5" width="3.4" height="2.6" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.25" />
        <rect x="85.5" y="31.7" width="2.8" height="1.8" fill="#1e293b" />
        <circle cx="86.9" cy="32.3" r="0.3" fill="#cbd5e1" />
        <rect x="86.6" y="32.6" width="0.6" height="0.7" fill="#475569" />
        {/* tiny illegible inscription strip */}
        <rect x="85.2" y="33.5" width="3.4" height="0.4" fill="#3f2415" />
        <line x1="85.5" y1="33.7" x2="88.3" y2="33.7" stroke="#fde68a" strokeWidth="0.12" opacity="0.6" />
        {/* pocket watch (memory clue) */}
        <circle cx="92" cy="32.2" r="1.4" fill="#f1f5f9" stroke="#854d0e" strokeWidth="0.4" />
        <circle cx="92" cy="32.2" r="1.2" fill="#fef3c7" />
        <circle cx="92" cy="32.2" r="0.1" fill="#1f2937" />
        <line x1="92" y1="32.2" x2="92" y2="31.4" stroke="#1f2937" strokeWidth="0.15" />
        <line x1="92" y1="32.2" x2="92.6" y2="32.6" stroke="#1f2937" strokeWidth="0.15" />
        {/* watch chain */}
        <path d="M 92 30.8 Q 92.3 30.2, 93 30" stroke="#854d0e" strokeWidth="0.2" fill="none" />
        {/* a couple of books on desk */}
        <rect x="93" y="31" width="3.5" height="2.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="93" y="31.6" width="3.5" height="0.3" fill="#fbbf24" />
      </g>

      {/* CENTER: the trunk (chest) with 3 locks */}
      <g>
        {/* shadow */}
        <ellipse cx="50" cy="52" rx="18" ry="1.2" fill="#000" opacity="0.55" />
        {/* trunk body */}
        <rect x="32" y="40" width="36" height="12" rx="0.5" fill="url(#trunkWood)" stroke="#2a1709" strokeWidth="0.4" />
        {/* curved lid */}
        <path
          d="M 32 40 Q 50 32, 68 40 L 68 41 Q 50 33, 32 41 Z"
          fill="#a16e3e"
          stroke="#2a1709"
          strokeWidth="0.4"
        />
        {/* hinges / iron straps */}
        <rect x="34" y="33" width="1.4" height="19" fill="#3f3f46" stroke="#1f2937" strokeWidth="0.2" />
        <rect x="48.5" y="33" width="1.4" height="19" fill="#3f3f46" stroke="#1f2937" strokeWidth="0.2" />
        <rect x="63" y="33" width="1.4" height="19" fill="#3f3f46" stroke="#1f2937" strokeWidth="0.2" />
        {/* horizontal trim */}
        <rect x="32" y="45" width="36" height="0.8" fill="#3f2415" />
        {/* studs */}
        {[36, 40, 44, 56, 60].map((x) => (
          <circle key={x} cx={x} cy="46.5" r="0.3" fill="#3f3f46" stroke="#1f2937" strokeWidth="0.1" />
        ))}

        {/* 3 PADLOCKS — each visually distinct */}
        {/* Padlock 1: Letters (red, with "A B C") */}
        <g>
          <rect
            x="37"
            y="42.5"
            width="6"
            height="6.5"
            rx="0.8"
            fill={lockLetters ? '#16a34a' : '#dc2626'}
            stroke="#1c0e06"
            strokeWidth="0.3"
          />
          <path
            d="M 38 42.5 L 38 41 Q 38 39.5, 40 39.5 Q 42 39.5, 42 41 L 42 42.5"
            stroke={lockLetters ? '#16a34a' : '#9a1c1c'}
            strokeWidth="0.7"
            fill="none"
          />
          {lockLetters ? (
            <text x="40" y="46.8" textAnchor="middle" fontSize="2.4" fontWeight="bold" fill="#f1f5f9" fontFamily="serif">✓</text>
          ) : (
            <>
              <text x="40" y="47" textAnchor="middle" fontSize="1.6" fontWeight="bold" fill="#fef3c7" fontFamily="serif">ABC</text>
            </>
          )}
        </g>
        {/* Padlock 2: Colors (blue, with circles) */}
        <g>
          <rect
            x="47"
            y="42.5"
            width="6"
            height="6.5"
            rx="0.8"
            fill={lockColors ? '#16a34a' : '#2563eb'}
            stroke="#1c0e06"
            strokeWidth="0.3"
          />
          <path
            d="M 48 42.5 L 48 41 Q 48 39.5, 50 39.5 Q 52 39.5, 52 41 L 52 42.5"
            stroke={lockColors ? '#16a34a' : '#1e3a8a'}
            strokeWidth="0.7"
            fill="none"
          />
          {lockColors ? (
            <text x="50" y="46.8" textAnchor="middle" fontSize="2.4" fontWeight="bold" fill="#f1f5f9" fontFamily="serif">✓</text>
          ) : (
            <g>
              <circle cx="48.7" cy="46" r="0.6" fill="#dc2626" />
              <circle cx="50.1" cy="46" r="0.6" fill="#fbbf24" />
              <circle cx="51.5" cy="46" r="0.6" fill="#10b981" />
              <circle cx="48.7" cy="47.3" r="0.6" fill="#a855f7" />
              <circle cx="50.1" cy="47.3" r="0.6" fill="#3b82f6" />
            </g>
          )}
        </g>
        {/* Padlock 3: Numbers (gold, with digits) */}
        <g>
          <rect
            x="57"
            y="42.5"
            width="6"
            height="6.5"
            rx="0.8"
            fill={lockNumbers ? '#16a34a' : '#ca8a04'}
            stroke="#1c0e06"
            strokeWidth="0.3"
          />
          <path
            d="M 58 42.5 L 58 41 Q 58 39.5, 60 39.5 Q 62 39.5, 62 41 L 62 42.5"
            stroke={lockNumbers ? '#16a34a' : '#854d0e'}
            strokeWidth="0.7"
            fill="none"
          />
          {lockNumbers ? (
            <text x="60" y="46.8" textAnchor="middle" fontSize="2.4" fontWeight="bold" fill="#f1f5f9" fontFamily="serif">✓</text>
          ) : (
            <text x="60" y="47.2" textAnchor="middle" fontSize="1.8" fontWeight="bold" fill="#1c0e06" fontFamily="monospace">123</text>
          )}
        </g>

        {/* When all 3 unlocked, lid is slightly open showing golden light */}
        {allOpen && (
          <g>
            <path
              d="M 32 40 Q 50 28, 68 40 L 68 39 Q 50 30, 32 39 Z"
              fill="#3f2415"
            />
            <rect x="33" y="38.5" width="34" height="1.6" fill="#fbbf24" opacity="0.9" />
            <rect x="35" y="38.8" width="30" height="0.5" fill="#fef3c7" />
          </g>
        )}
      </g>

      {/* Dust motes floating in the sunbeam */}
      {[28, 45, 60, 75].map((x, i) => (
        <circle key={i} cx={x} cy={20 + (i % 2) * 10} r="0.15" fill="#fef3c7" opacity="0.4" />
      ))}

      {/* corner vignette */}
      <rect x="0" y="0" width="100" height="56" fill="url(#atticVignette)" />

      {/* Wall-mounted landscape painting (DECOY frame #1) — upper-right */}
      <g>
        <rect x="89" y="14" width="8" height="6" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.3" />
        <rect x="89.5" y="14.5" width="7" height="5" fill="#1e3a8a" />
        {/* landscape mountains */}
        <path d="M 89.5 19 L 91 16.5 L 92 17 L 93 16 L 94.5 17.5 L 96.5 16 L 96.5 19.5 L 89.5 19.5 Z" fill="#475569" />
        {/* sun */}
        <circle cx="95.5" cy="15.5" r="0.4" fill="#fde68a" opacity="0.9" />
      </g>

      {/* Family portrait (DECOY frame #2) — leaning against the suitcase stack */}
      <g>
        <rect x="16" y="22" width="5" height="6" fill="#3f2415" stroke="#1c0e06" strokeWidth="0.3" transform="rotate(-6 18.5 25)" />
        <rect x="16.5" y="22.5" width="4" height="5" fill="#475569" transform="rotate(-6 18.5 25)" />
        {/* silhouette of person */}
        <circle cx="18" cy="24" r="0.7" fill="#cbd5e1" transform="rotate(-6 18.5 25)" />
        <path d="M 17 25 L 17 27 L 19.4 27 L 19.4 25 Z" fill="#92592f" transform="rotate(-6 18.5 25)" />
      </g>
    </svg>
  )
}
