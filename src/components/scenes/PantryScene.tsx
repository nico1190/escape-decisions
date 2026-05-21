import type { PlayerState } from '@/types/game'

interface Props {
  state: PlayerState
}

/**
 * Wall safe — mounted on the back wall above the shelving. Combination dial
 * in the center. When the safe_open flag is true the door swings ajar and
 * we see the empty interior; otherwise it's a closed steel box.
 */
function WallSafe({ open }: { open: boolean }) {
  return (
    <g transform="translate(82 1.5)">
      {/* mount shadow */}
      <rect x="-0.5" y="-0.5" width="11" height="7" fill="#000" opacity="0.5" />
      {/* steel body */}
      <rect x="0" y="0" width="10" height="6" rx="0.4" fill="#475569" stroke="#1f2937" strokeWidth="0.3" />
      {/* highlight strip */}
      <rect x="0.3" y="0.3" width="9.4" height="0.6" fill="#94a3b8" opacity="0.55" />
      {/* hinges (left side when closed) */}
      <rect x="0.3" y="0.8" width="0.5" height="0.7" fill="#1f2937" />
      <rect x="0.3" y="4.5" width="0.5" height="0.7" fill="#1f2937" />

      {open ? (
        <g>
          {/* door swung open to the left (rotated) */}
          <path
            d="M 0.6 0.2 L -2.2 0.4 L -2.2 5.6 L 0.6 5.8 Z"
            fill="#334155"
            stroke="#1f2937"
            strokeWidth="0.3"
          />
          <circle cx="-1" cy="3" r="0.7" fill="#1f2937" />
          {/* dark cavity */}
          <rect x="1.1" y="0.6" width="8.5" height="4.8" rx="0.3" fill="#0a0a0a" />
          {/* shine */}
          <line x1="1.5" y1="0.8" x2="9.4" y2="0.8" stroke="#fbbf24" strokeWidth="0.12" opacity="0.7" />
        </g>
      ) : (
        <g>
          {/* door */}
          <rect x="0.8" y="0.5" width="8.8" height="5" rx="0.3" fill="#64748b" stroke="#1f2937" strokeWidth="0.2" />
          {/* central combination dial */}
          <circle cx="5" cy="3" r="1.6" fill="#0a0a0a" stroke="#1f2937" strokeWidth="0.2" />
          <circle cx="5" cy="3" r="1.2" fill="#1e293b" stroke="#475569" strokeWidth="0.15" />
          {/* dial pointer */}
          <line x1="5" y1="3" x2="5" y2="1.7" stroke="#fbbf24" strokeWidth="0.18" strokeLinecap="round" />
          {/* dial markings */}
          {Array.from({ length: 8 }).map((_, i) => {
            const ang = (i * 45 * Math.PI) / 180
            const x1 = 5 + 1.35 * Math.cos(ang)
            const y1 = 3 + 1.35 * Math.sin(ang)
            const x2 = 5 + 1.55 * Math.cos(ang)
            const y2 = 3 + 1.55 * Math.sin(ang)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="0.1" />
          })}
          {/* handle */}
          <rect x="7.5" y="2.6" width="1.4" height="0.8" rx="0.2" fill="#334155" stroke="#1f2937" strokeWidth="0.15" />
        </g>
      )}
    </g>
  )
}

/**
 * Locked metal drawer with a 3-dial combination lock. Sits on the floor
 * between the door and the shelves. Visual changes once the drawer_open
 * flag is set (lid pops open, empty).
 */
function LockedDrawer({ open }: { open: boolean }) {
  return (
    <g>
      {/* shadow */}
      <ellipse cx="32" cy="55.5" rx="7.5" ry="0.6" fill="#000" opacity="0.6" />
      {/* body */}
      <rect x="25" y="46" width="14" height="9.5" rx="0.6" fill="#475569" stroke="#1f2937" strokeWidth="0.4" />
      {/* metallic highlight */}
      <rect x="25.4" y="46.4" width="13.2" height="0.9" fill="#94a3b8" opacity="0.7" />
      {/* hinges (top edge) */}
      <rect x="27" y="45.6" width="2" height="0.6" fill="#1f2937" />
      <rect x="35" y="45.6" width="2" height="0.6" fill="#1f2937" />

      {/* lid — slightly ajar when open */}
      {open ? (
        <g>
          <path
            d="M 25 46 L 25 43 L 39 41.5 L 39 46 Z"
            fill="#334155"
            stroke="#1f2937"
            strokeWidth="0.3"
          />
          {/* dark interior visible through opening */}
          <rect x="25.6" y="46" width="12.8" height="1.4" fill="#0a0a0a" />
          {/* shine indicating it just opened */}
          <line x1="26" y1="42.5" x2="38" y2="41.5" stroke="#fbbf24" strokeWidth="0.2" opacity="0.7" />
        </g>
      ) : (
        <g>
          {/* closed lid line */}
          <line x1="25" y1="48.5" x2="39" y2="48.5" stroke="#1f2937" strokeWidth="0.4" />
          {/* combination lock — 3 dials */}
          <g>
            <rect x="27.5" y="50" width="9" height="3.2" rx="0.4" fill="#1f2937" stroke="#0f172a" strokeWidth="0.2" />
            {/* dial windows */}
            {[28.5, 31.3, 34.1].map((x, i) => (
              <g key={x}>
                <rect x={x} y="50.4" width="2.2" height="2.4" rx="0.2" fill="#0a0a0a" />
                <text
                  x={x + 1.1}
                  y="52.3"
                  textAnchor="middle"
                  fontSize="1.7"
                  fontWeight="bold"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {['?', '?', '?'][i]}
                </text>
              </g>
            ))}
          </g>
          {/* handle */}
          <rect x="30" y="46.6" width="4" height="0.7" rx="0.3" fill="#1f2937" />
        </g>
      )}
    </g>
  )
}

/**
 * Pantry — cluttered storage room. The 3 useful items (A extinguisher, K
 * extinguisher, keys) are small and tucked among many decorative siblings
 * so the player must actually search instead of clicking the only thing on
 * a shelf. Items live on DIFFERENT shelves to spread the search across the
 * vertical space.
 *
 * Layout (viewBox 100×56):
 *  - Wall y=0–38, floor y=38–56
 *  - Door (back to kitchen): LEFT, x=4–18, y=8–38
 *  - Shelving unit: x=22–94, y=10–37, with 4 shelves
 *  - Floor zone: brooms, mop, bucket, paint cans
 */
export function PantryScene({ state }: Props) {
  const hasA = state.inventory.some((e) => e.itemId === 'extinguisher_a')
  const drawerOpen = state.flags.drawer_open === true
  const safeOpen = state.flags.safe_open === true

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Despensa"
    >
      <defs>
        <linearGradient id="pantryWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0b1220" />
        </linearGradient>
        <linearGradient id="pantryFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1f2b" />
          <stop offset="100%" stopColor="#0a0c14" />
        </linearGradient>
        <linearGradient id="shelfWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c4d2f" />
          <stop offset="100%" stopColor="#3f2415" />
        </linearGradient>
        <linearGradient id="pantryDoor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a37" />
          <stop offset="100%" stopColor="#4a2d1a" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="0.5" cy="0" r="0.65">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="shelfShadow" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="redSmall" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="yellowSmall" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="100" height="38" fill="url(#pantryWall)" />
      <rect x="0" y="38" width="100" height="18" fill="url(#pantryFloor)" />
      <rect x="0" y="37.6" width="100" height="0.8" fill="#0a0a0a" opacity="0.6" />
      <rect x="0" y="0" width="100" height="56" fill="url(#lampGlow)" />

      {/* Vignette — corners darker to encourage scanning */}
      <rect x="0" y="0" width="100" height="56" fill="url(#shelfShadow)" />

      {/* Ceiling lamp */}
      <g>
        <line x1="55" y1="0" x2="55" y2="3" stroke="#1e293b" strokeWidth="0.3" />
        <path d="M 51 3 L 59 3 L 57 6 L 53 6 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="0.3" />
        <circle cx="55" cy="5.5" r="1.2" fill="#fde68a" opacity="0.9" />
      </g>

      {/* ─── LEFT: Door back to kitchen ─── */}
      <g>
        <rect x="4" y="8" width="14" height="30" fill="#1c0e06" rx="0.5" />
        <rect x="5" y="9" width="12" height="28" fill="url(#pantryDoor)" stroke="#2a1709" strokeWidth="0.3" rx="0.3" />
        <rect x="6.2" y="10.5" width="9.6" height="10.5" fill="#5a3520" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="6.2" y="22.5" width="9.6" height="13" fill="#5a3520" stroke="#2a1709" strokeWidth="0.2" />
        <circle cx="15.5" cy="23" r="0.7" fill="#d4b88a" />
        <rect x="4" y="5" width="14" height="2.2" rx="0.3" fill="#334155" />
        <text x="11" y="6.7" textAnchor="middle" fontSize="1.6" fontWeight="bold" fill="#f1f5f9" fontFamily="monospace">
          ← COCINA
        </text>
      </g>

      {/* ─── RIGHT: Shelving unit with 4 shelves ─── */}
      <g>
        {/* outer frame */}
        <rect x="22" y="9" width="72" height="29" fill="none" stroke="#2a1709" strokeWidth="0.5" />
        <rect x="22.4" y="9.4" width="71.2" height="28.2" fill="#0f172a" opacity="0.55" />
        {/* vertical separators (3 columns) */}
        <line x1="46" y1="9" x2="46" y2="37.6" stroke="#2a1709" strokeWidth="0.3" opacity="0.7" />
        <line x1="70" y1="9" x2="70" y2="37.6" stroke="#2a1709" strokeWidth="0.3" opacity="0.7" />
        {/* shelf planks — 3 internal */}
        {[16, 23, 30].map((y) => (
          <g key={y}>
            <rect x="22" y={y} width="72" height="0.9" fill="url(#shelfWood)" />
            <rect x="22" y={y + 0.9} width="72" height="0.4" fill="#0a0a0a" opacity="0.5" />
          </g>
        ))}

        {/* ─────── TOP SHELF (y=9–16): jars, cans, ── KEYS hidden top-right corner ── */}
        {/* row of small jars */}
        {[26, 29, 32, 35, 38, 41].map((x, i) => (
          <g key={x}>
            <rect
              x={x}
              y={11.5 + (i % 2) * 0.6}
              width="2"
              height={3.5 - (i % 3) * 0.2}
              fill={i % 2 ? '#7c2d12' : '#3f2a1c'}
              stroke="#2a1709"
              strokeWidth="0.15"
            />
            <rect x={x + 0.2} y={11 + (i % 2) * 0.6} width="1.6" height="0.5" fill="#1e293b" />
          </g>
        ))}
        {/* center column: a few boxes */}
        <rect x="49" y="11" width="3" height="4.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="53" y="12" width="3.5" height="3.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="57.5" y="11.5" width="2.5" height="4" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="61" y="13" width="3" height="2.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        {/* right column: more jars + KEYS subtle */}
        <rect x="73" y="12" width="2" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="76" y="11" width="2.4" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="79.5" y="12" width="2" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="82" y="13" width="2.2" height="2.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />

        {/* Where the keys used to hang — now just an empty hook + jar.
            The keys have been moved into the wall safe (puzzle 2). */}
        <circle cx="89" cy="11.5" r="0.18" fill="#94a3b8" />
        <rect x="87" y="12" width="1.6" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />

        {/* ─────── 2nd SHELF (y=16–23): tools + paint cans ── EXTINGUISHER K hidden among ── */}
        {/* left column: rolled rope, small box */}
        <circle cx="26" cy="20.5" r="1.6" fill="none" stroke="#8a5a37" strokeWidth="0.5" />
        <circle cx="26" cy="20.5" r="0.9" fill="none" stroke="#8a5a37" strokeWidth="0.5" />
        <rect x="30" y="19" width="3" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="34" y="17.5" width="3.2" height="5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="38" y="18.5" width="2.8" height="4" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="41.5" y="19" width="2.5" height="3.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />

        {/* center column: paint cans */}
        <g>
          {/* paint can 1 */}
          <ellipse cx="51" cy="18.5" rx="1.6" ry="0.4" fill="#475569" />
          <rect x="49.4" y="18.5" width="3.2" height="4" fill="#94a3b8" stroke="#475569" strokeWidth="0.2" />
          <ellipse cx="51" cy="22.5" rx="1.6" ry="0.4" fill="#475569" />
          <rect x="49.7" y="19.5" width="2.6" height="0.6" fill="#dc2626" />
          {/* paint can 2 */}
          <ellipse cx="55" cy="18.7" rx="1.4" ry="0.35" fill="#475569" />
          <rect x="53.6" y="18.7" width="2.8" height="3.7" fill="#cbd5e1" stroke="#475569" strokeWidth="0.2" />
          <ellipse cx="55" cy="22.4" rx="1.4" ry="0.35" fill="#475569" />
          <rect x="53.8" y="19.6" width="2.4" height="0.5" fill="#1e3a8a" />
          {/* small bottle */}
          <rect x="58.5" y="19" width="1.4" height="3.5" fill="#16a34a" opacity="0.7" stroke="#15803d" strokeWidth="0.15" />
          <rect x="58.7" y="18.4" width="1" height="0.6" fill="#1f2937" />
          {/* spray bottle */}
          <rect x="61" y="18.5" width="1.6" height="4" rx="0.3" fill="#1e293b" stroke="#0f172a" strokeWidth="0.15" />
          <rect x="61.2" y="17.8" width="1.2" height="0.7" fill="#475569" />
          <rect x="62.6" y="18.2" width="0.4" height="0.7" fill="#475569" />
          {/* a couple of boxes */}
          <rect x="64" y="19" width="3" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
          <rect x="67.5" y="18.5" width="2" height="4" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        </g>

        {/* right column: more cluttered boxes — K is NOT here anymore, it lives in the locked drawer */}
        <rect x="71" y="19" width="2.5" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="74.5" y="18" width="2.5" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="77.5" y="19" width="2.8" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="80.8" y="18" width="2.6" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="83.8" y="19" width="3" height="3.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="87.5" y="18" width="3.5" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />

        {/* ─────── 3rd SHELF (y=23–30): tools + EXTINGUISHER A on left, hidden among red boxes ── */}
        {/* left column: a few red-ish things to camouflage A */}
        <rect x="24" y="25" width="2.5" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        {!hasA && (
          <g>
            {/* small extinguisher A — same size as K but red */}
            <rect x="28" y="24.5" width="3" height="5" rx="0.4" fill="url(#redSmall)" stroke="#7f1d1d" strokeWidth="0.2" />
            <rect x="28.4" y="25" width="0.5" height="4" rx="0.2" fill="#ffffff" opacity="0.25" />
            <rect x="28.8" y="23.8" width="1.4" height="0.8" rx="0.15" fill="#1f2937" />
            <rect x="29.2" y="23.4" width="0.6" height="0.5" fill="#1f2937" />
            <path d="M 30 24.2 Q 31 24.8, 30.8 25.6" stroke="#1f2937" strokeWidth="0.25" fill="none" />
            <rect x="28.4" y="26.5" width="2.2" height="1.4" fill="#fef3c7" stroke="#7f1d1d" strokeWidth="0.1" />
            <text x="29.5" y="27.7" textAnchor="middle" fontSize="1.2" fontWeight="800" fill="#dc2626" fontFamily="monospace">
              A
            </text>
          </g>
        )}
        <rect x="32" y="25.5" width="2.4" height="4" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="35" y="24.5" width="2.8" height="5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="38.5" y="26" width="3" height="3.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="42" y="25" width="3" height="4.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />

        {/* center column: tools — hammer, wrench, screwdriver */}
        <g>
          {/* hammer */}
          <rect x="48" y="25" width="0.6" height="4" fill="#3f2a1c" />
          <rect x="46.8" y="24" width="3" height="1.5" fill="#475569" stroke="#1f2937" strokeWidth="0.15" />
          {/* wrench */}
          <rect x="52" y="24" width="0.5" height="5.4" fill="#94a3b8" />
          <circle cx="52.25" cy="29.5" r="0.8" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
          <path d="M 51.4 23.7 L 53 23.7 L 53 24.5 L 51.4 24.5 Z" fill="#94a3b8" />
          {/* screwdriver */}
          <rect x="55" y="24.5" width="0.4" height="4" fill="#94a3b8" />
          <rect x="54.6" y="28" width="1.2" height="1.5" rx="0.2" fill="#dc2626" />
          {/* box */}
          <rect x="57" y="25" width="3" height="4.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
          <rect x="60.5" y="26" width="2.5" height="3.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
          <rect x="63.5" y="25.5" width="2.2" height="4" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
          <rect x="66" y="26" width="3" height="3.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        </g>

        {/* right column: cans + boxes */}
        <rect x="72" y="25" width="2.8" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <ellipse cx="77" cy="25" rx="1.4" ry="0.35" fill="#475569" />
        <rect x="75.6" y="25" width="2.8" height="3.7" fill="#94a3b8" stroke="#475569" strokeWidth="0.2" />
        <ellipse cx="77" cy="28.7" rx="1.4" ry="0.35" fill="#475569" />
        <rect x="80" y="25" width="3" height="4.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="84" y="26" width="3.2" height="3.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.15" />
        <rect x="88" y="25" width="3.5" height="4.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.15" />

        {/* ─────── BOTTOM SHELF (y=30–37): heavier stuff — bags, boxes */}
        {/* sacks */}
        <ellipse cx="26" cy="33" rx="2.4" ry="3" fill="#7c4d2f" stroke="#3f2415" strokeWidth="0.2" />
        <path d="M 25 30.5 Q 26 29.8, 27 30.5" stroke="#3f2415" strokeWidth="0.3" fill="none" />
        <ellipse cx="32" cy="33.5" rx="2.2" ry="2.5" fill="#7c4d2f" stroke="#3f2415" strokeWidth="0.2" />
        <path d="M 31 31.3 Q 32 30.7, 33 31.3" stroke="#3f2415" strokeWidth="0.3" fill="none" />
        {/* boxes */}
        <rect x="37" y="31" width="4" height="6" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="37.6" y="31.6" width="2.8" height="0.4" fill="#1f2937" opacity="0.6" />
        <rect x="42" y="32.5" width="3.5" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="47" y="31" width="4.5" height="6" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="52.5" y="32" width="3.5" height="5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="57" y="31.5" width="5" height="5.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="63" y="32.5" width="3.5" height="4.5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="68" y="31" width="4" height="6" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="73" y="32" width="3" height="5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="77" y="31.5" width="4" height="5.5" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="82" y="32" width="3.5" height="5" fill="#7c2d12" stroke="#2a1709" strokeWidth="0.2" />
        <rect x="86.5" y="31" width="4.5" height="6" fill="#3f2a1c" stroke="#2a1709" strokeWidth="0.2" />
      </g>

      {/* Wall safe (the keys live inside, behind a 4-digit code) */}
      <WallSafe open={safeOpen} />

      {/* Locked drawer on the floor (the K extinguisher lives inside) */}
      <LockedDrawer open={drawerOpen} />

      {/* ─── FOREGROUND: floor clutter ─── */}
      {/* broom leaning against shelf */}
      <g>
        <line x1="20" y1="42" x2="24" y2="55" stroke="#7c4d2f" strokeWidth="0.6" />
        <path d="M 23 54 L 25 56 L 22 56 L 21 55 Z" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.2" />
      </g>
      {/* mop */}
      <g>
        <line x1="93" y1="40" x2="96" y2="55" stroke="#475569" strokeWidth="0.6" />
        <ellipse cx="96" cy="55" rx="2.5" ry="0.8" fill="#94a3b8" />
        <path d="M 94 54 Q 96 53, 98 54" stroke="#cbd5e1" strokeWidth="0.4" fill="none" />
      </g>
      {/* bucket on floor */}
      <g>
        <ellipse cx="62" cy="51" rx="3" ry="0.6" fill="#0a0a0a" opacity="0.6" />
        <path d="M 59 51 L 59.5 47 L 64.5 47 L 65 51 Z" fill="#475569" stroke="#1f2937" strokeWidth="0.3" />
        <ellipse cx="62" cy="47" rx="2.5" ry="0.5" fill="#1e293b" />
        <path d="M 59.5 47 Q 62 45.5, 64.5 47" stroke="#94a3b8" strokeWidth="0.3" fill="none" />
      </g>
      {/* stack of newspapers */}
      <g>
        <rect x="42" y="48" width="8" height="1" fill="#cbd5e1" opacity="0.7" stroke="#475569" strokeWidth="0.15" />
        <rect x="41.5" y="49" width="9" height="1" fill="#cbd5e1" opacity="0.7" stroke="#475569" strokeWidth="0.15" />
        <rect x="42.5" y="50" width="7.5" height="1" fill="#cbd5e1" opacity="0.7" stroke="#475569" strokeWidth="0.15" />
      </g>
      {/* cardboard box on floor */}
      <rect x="30" y="48" width="5" height="5" fill="#7c4d2f" stroke="#3f2415" strokeWidth="0.3" />
      <line x1="32.5" y1="48" x2="32.5" y2="53" stroke="#3f2415" strokeWidth="0.3" />
      <path d="M 30 48 L 32.5 47 L 35 48" stroke="#3f2415" strokeWidth="0.3" fill="none" />
      {/* dust */}
      <circle cx="50" cy="54" r="0.15" fill="#475569" opacity="0.4" />
      <circle cx="70" cy="53" r="0.2" fill="#475569" opacity="0.4" />
      <circle cx="80" cy="54.5" r="0.15" fill="#475569" opacity="0.3" />
    </svg>
  )
}
