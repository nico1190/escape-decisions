import { motion } from 'framer-motion'
import type { PlayerState } from '@/types/game'
import { Flame, FlameDefs } from './Flame'
import { Smoke } from './Smoke'

interface Props {
  state: PlayerState
}

/**
 * Kitchen scene — drawn at proper proportions, not ad-hoc.
 *
 * Reference grid (viewBox 100×56):
 *  - Wall: y=0–38, floor: y=38–56
 *  - Counter line: y=33 (slab y=31–33, front face y=33–38)
 *  - Two full-height doors flank the stove (left = SALIDA, right = DESPENSA)
 *  - Window centered above the stove
 *  - Upper cabinet between exit door and window
 *
 * Hotspot coords in level data must match (SVG y → CSS y%: y × 100/56).
 */
export function KitchenScene({ state }: Props) {
  const fireOn = !state.flags.fireOut
  const fireOut = !!state.flags.fireOut

  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Cocina"
    >
      <FlameDefs />
      <defs>
        <linearGradient id="kitchenWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fireOn ? '#3b1b0e' : '#1f2937'} />
          <stop offset="100%" stopColor={fireOn ? '#23120a' : '#111827'} />
        </linearGradient>
        <linearGradient id="kitchenFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f2a1c" />
          <stop offset="100%" stopColor="#1f140d" />
        </linearGradient>
        <linearGradient id="counterSlab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="counterFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <linearGradient id="cabinet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a37" />
          <stop offset="100%" stopColor="#5a3520" />
        </linearGradient>
        <linearGradient id="door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c4d2f" />
          <stop offset="100%" stopColor="#3f2415" />
        </linearGradient>
        <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0c1230" />
        </linearGradient>
        <radialGradient id="ambient" cx="0.5" cy="0.55" r="0.7">
          <stop
            offset="0%"
            stopColor={fireOn ? '#fb923c' : '#94a3b8'}
            stopOpacity={fireOn ? 0.35 : 0.06}
          />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall + floor */}
      <rect x="0" y="0" width="100" height="38" fill="url(#kitchenWall)" />
      <rect x="0" y="38" width="100" height="18" fill="url(#kitchenFloor)" />
      {/* Floor perspective tile lines */}
      {[15, 35, 55, 75].map((x) => (
        <line key={x} x1={x} y1="38" x2={x - 5} y2="56" stroke="#000" strokeOpacity="0.3" strokeWidth="0.3" />
      ))}
      {/* Skirting board */}
      <rect x="0" y="37.6" width="100" height="0.8" fill="#0a0a0a" opacity="0.6" />

      {/* Ambient warm glow */}
      <motion.rect
        x="0"
        y="0"
        width="100"
        height="56"
        fill="url(#ambient)"
        animate={fireOn ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.35 }}
        transition={fireOn ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }}
      />

      {/* ─── LEFT: Exit door (SALIDA) ─── */}
      <g>
        {/* frame */}
        <rect x="11" y="6" width="16" height="32" fill="#1c0e06" rx="0.6" />
        {/* door panel */}
        <rect x="12.2" y="7.2" width="13.6" height="29.6" fill="url(#door)" stroke="#2a1709" strokeWidth="0.3" rx="0.4" />
        {/* upper panel inset */}
        <rect x="13.4" y="9" width="11.2" height="11" fill="#5a3520" stroke="#2a1709" strokeWidth="0.2" />
        {/* lower panel inset */}
        <rect x="13.4" y="21" width="11.2" height="14" fill="#5a3520" stroke="#2a1709" strokeWidth="0.2" />
        {/* doorknob */}
        <circle cx="24" cy="22" r="0.7" fill="#fbbf24" />
        {/* threshold */}
        <rect x="11" y="37.4" width="16" height="1" fill="#0a0a0a" opacity="0.7" />
        {/* SALIDA sign above door */}
        <g>
          <rect
            x="13"
            y="3.5"
            width="12"
            height="2.4"
            rx="0.4"
            fill={fireOut ? '#16a34a' : '#475569'}
          />
          <text
            x="19"
            y="5.3"
            textAnchor="middle"
            fontSize="1.8"
            fontWeight="bold"
            fill="#f1f5f9"
            fontFamily="monospace"
          >
            SALIDA
          </text>
          {/* sign glow when active */}
          {fireOut && (
            <motion.rect
              x="13"
              y="3.5"
              width="12"
              height="2.4"
              rx="0.4"
              fill="#16a34a"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
        </g>
      </g>

      {/* ─── CENTER: Window above stove ─── */}
      <g>
        <rect x="40" y="3" width="20" height="14" fill="url(#window)" stroke="#0f172a" strokeWidth="0.5" rx="0.3" />
        {/* mullions */}
        <line x1="50" y1="3" x2="50" y2="17" stroke="#0f172a" strokeWidth="0.4" />
        <line x1="40" y1="10" x2="60" y2="10" stroke="#0f172a" strokeWidth="0.4" />
        {/* moon */}
        <circle cx="55" cy="7" r="1.8" fill="#fef3c7" opacity="0.85" />
        <circle cx="55.6" cy="6.5" r="1.3" fill="#fbbf24" opacity="0.3" />
        {/* sill */}
        <rect x="39" y="17" width="22" height="1" fill="#3f2415" />
        {/* stars */}
        <circle cx="44" cy="6" r="0.2" fill="#f1f5f9" opacity="0.9" />
        <circle cx="47" cy="8" r="0.15" fill="#f1f5f9" opacity="0.7" />
        <circle cx="42" cy="11" r="0.15" fill="#f1f5f9" opacity="0.6" />
        <circle cx="58" cy="12" r="0.2" fill="#f1f5f9" opacity="0.9" />
      </g>

      {/* ─── UPPER CABINET (left of window, hotspot zone) ─── */}
      <g>
        <rect x="4" y="11" width="14" height="18" fill="url(#cabinet)" stroke="#2a1709" strokeWidth="0.3" rx="0.3" />
        {/* door split */}
        <line x1="11" y1="11" x2="11" y2="29" stroke="#2a1709" strokeWidth="0.4" />
        {/* handles */}
        <rect x="9.5" y="19" width="0.7" height="2.5" rx="0.3" fill="#d4b88a" />
        <rect x="11.8" y="19" width="0.7" height="2.5" rx="0.3" fill="#d4b88a" />
        {/* shadow under */}
        <rect x="4" y="29" width="14" height="0.6" fill="#0a0a0a" opacity="0.5" />
      </g>

      {/* ─── COUNTER (full width, behind stove) ─── */}
      <rect x="0" y="31" width="100" height="2" fill="url(#counterSlab)" />
      <rect x="0" y="33" width="100" height="5" fill="url(#counterFront)" />
      {/* counter front panel lines */}
      <line x1="30" y1="33" x2="30" y2="38" stroke="#0a0a0a" strokeOpacity="0.5" strokeWidth="0.3" />
      <line x1="70" y1="33" x2="70" y2="38" stroke="#0a0a0a" strokeOpacity="0.5" strokeWidth="0.3" />

      {/* ─── CENTER: STOVE (sits on the counter) ─── */}
      <g>
        {/* Oven body (under counter) */}
        <rect x="42" y="33" width="18" height="5" fill="#1f2937" stroke="#0f172a" strokeWidth="0.4" />
        {/* Oven door */}
        <rect x="43.5" y="33.7" width="15" height="3.6" fill="#0a0a0a" stroke="#334155" strokeWidth="0.3" rx="0.2" />
        {/* Oven window glow */}
        <rect
          x="44"
          y="34"
          width="14"
          height="2.8"
          fill="#fbbf24"
          opacity={fireOn ? 0.55 : 0.12}
        />
        {/* Oven door handle */}
        <rect x="44" y="37" width="14" height="0.4" fill="#94a3b8" />

        {/* Stovetop (sits on the counter slab, slightly wider than oven) */}
        <rect x="41" y="29" width="20" height="2.2" fill="#1f2937" stroke="#0f172a" strokeWidth="0.3" rx="0.3" />
        {/* Burners */}
        <circle cx="45" cy="30.1" r="0.9" fill="#0a0a0a" stroke="#334155" strokeWidth="0.1" />
        <circle cx="51" cy="30.1" r="1.1" fill="#0a0a0a" stroke="#334155" strokeWidth="0.1" />
        <circle cx="57" cy="30.1" r="0.9" fill="#0a0a0a" stroke="#334155" strokeWidth="0.1" />

        {/* Pan on center burner */}
        <g>
          {/* handle */}
          <rect x="56.5" y="28.4" width="6" height="0.8" rx="0.4" fill="#1e293b" />
          <rect x="61.5" y="27.8" width="1" height="2" rx="0.3" fill="#475569" />
          {/* pan body */}
          <ellipse cx="51" cy="28.8" rx="5" ry="1.2" fill="#0f172a" />
          <ellipse cx="51" cy="28.5" rx="4.6" ry="0.9" fill="#1e293b" />
          {/* oil */}
          <ellipse
            cx="51"
            cy="28.4"
            rx="4"
            ry="0.55"
            fill={fireOn ? '#facc15' : '#3f2a14'}
            opacity={fireOn ? 0.9 : 0.5}
          />
        </g>

        {/* Flames on the pan */}
        {fireOn && (
          <>
            <Flame cx={51} cy={27.6} scale={1.1} />
            <Flame cx={48.5} cy={28} scale={0.8} />
            <Flame cx={53.5} cy={28} scale={0.85} />
          </>
        )}

        {/* Smoke after extinguish */}
        {fireOut && <Smoke cx={51} cy={27.5} scale={0.9} />}

        {/* Knobs on oven front (below counter slab, but visible — typical stove design) */}
        <circle cx="44" cy="31.8" r="0.4" fill="#94a3b8" />
        <circle cx="47" cy="31.8" r="0.4" fill="#94a3b8" />
        <circle cx="55" cy="31.8" r="0.4" fill="#94a3b8" />
        <circle cx="58" cy="31.8" r="0.4" fill="#94a3b8" />
      </g>

      {/* ─── RIGHT: Pantry door (DESPENSA) ─── */}
      <g>
        {/* frame */}
        <rect x="73" y="6" width="16" height="32" fill="#1c0e06" rx="0.6" />
        {/* door panel */}
        <rect x="74.2" y="7.2" width="13.6" height="29.6" fill="url(#door)" stroke="#2a1709" strokeWidth="0.3" rx="0.4" />
        {/* horizontal louvered slats — pantry door style */}
        {[10, 14, 18, 22, 26, 30].map((y) => (
          <line
            key={y}
            x1="75.4"
            y1={y}
            x2="86.6"
            y2={y}
            stroke="#2a1709"
            strokeWidth="0.3"
            opacity="0.7"
          />
        ))}
        {/* doorknob */}
        <circle cx="86" cy="22" r="0.7" fill="#d4b88a" />
        {/* threshold */}
        <rect x="73" y="37.4" width="16" height="1" fill="#0a0a0a" opacity="0.7" />
        {/* DESPENSA label */}
        <rect x="74" y="3.5" width="14" height="2.4" rx="0.4" fill="#334155" />
        <text x="81" y="5.3" textAnchor="middle" fontSize="1.8" fontWeight="bold" fill="#f1f5f9" fontFamily="monospace">
          DESPENSA
        </text>
      </g>

      {/* Small wall clock high on the wall, between window and pantry door.
          Hands set to 10:24 — that's the code for the wall safe. */}
      <g transform="translate(66 12)">
        <circle r="3.6" fill="#1f2937" />
        <circle r="3.3" fill="#f1f5f9" stroke="#1f2937" strokeWidth="0.25" />
        {[12, 3, 6, 9].map((h) => {
          const ang = ((h * 30 - 90) * Math.PI) / 180
          const x = 2.7 * Math.cos(ang)
          const y = 2.7 * Math.sin(ang) + 0.3
          return (
            <text
              key={h}
              x={x}
              y={y}
              fontSize="0.9"
              fontWeight="bold"
              textAnchor="middle"
              fill="#1f2937"
              fontFamily="serif"
            >
              {h}
            </text>
          )
        })}
        {[1, 2, 4, 5, 7, 8, 10, 11].map((h) => {
          const ang = ((h * 30 - 90) * Math.PI) / 180
          const x1 = 2.8 * Math.cos(ang)
          const y1 = 2.8 * Math.sin(ang)
          const x2 = 3.1 * Math.cos(ang)
          const y2 = 3.1 * Math.sin(ang)
          return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth="0.18" />
        })}
        {/* hour hand → 10 */}
        <line x1="0" y1="0" x2={-1.28} y2={-1.16} stroke="#1f2937" strokeWidth="0.32" strokeLinecap="round" />
        {/* minute hand → 24min */}
        <line x1="0" y1="0" x2={1.38} y2={1.9} stroke="#1f2937" strokeWidth="0.22" strokeLinecap="round" />
        <circle r="0.22" fill="#dc2626" />
      </g>

      {/* Sticky note on the wall — looks like scribble from afar.
          A hotspot lets the player "leer la nota" to actually read it. */}
      <g>
        <rect x="32" y="20" width="4.5" height="3.6" fill="#fde047" stroke="#a16207" strokeWidth="0.12" transform="rotate(-4 34.25 21.8)" />
        <rect x="33" y="19.6" width="2" height="0.4" fill="#cbd5e1" opacity="0.7" transform="rotate(-4 34 19.8)" />
        {/* illegible scribble lines */}
        <line x1="33" y1="21.4" x2="35.5" y2="21.4" stroke="#7c2d12" strokeWidth="0.25" />
        <line x1="33" y1="22" x2="35.2" y2="22" stroke="#7c2d12" strokeWidth="0.25" />
        <line x1="33" y1="22.6" x2="35.8" y2="22.6" stroke="#7c2d12" strokeWidth="0.25" />
      </g>

      {/* Hanging utensils on wall (between exit door and cabinet) */}
      <g opacity="0.8">
        <line x1="30" y1="9" x2="38" y2="9" stroke="#475569" strokeWidth="0.3" />
        {/* spatula */}
        <line x1="32" y1="9" x2="32" y2="14" stroke="#94a3b8" strokeWidth="0.3" />
        <rect x="31.3" y="14" width="1.4" height="2.5" fill="#cbd5e1" rx="0.3" />
        {/* ladle */}
        <line x1="35" y1="9" x2="35" y2="13" stroke="#94a3b8" strokeWidth="0.3" />
        <circle cx="35" cy="14.5" r="1.2" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
      </g>

      {/* Outlet on wall, far right */}
      <rect x="64" y="22" width="2.4" height="1.6" fill="#1f2937" stroke="#0f172a" strokeWidth="0.2" rx="0.2" />
      <circle cx="65.2" cy="22.8" r="0.18" fill="#fbbf24" opacity="0.7" />
    </svg>
  )
}
