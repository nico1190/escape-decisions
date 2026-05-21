import { motion } from 'framer-motion'

interface Props {
  /** Center x in viewBox units (0–100). */
  cx: number
  /** Base y (bottom of the flame) in viewBox units. */
  cy: number
  /** Overall scale of the flame. */
  scale?: number
}

/**
 * Animated flame: 3 layered tear-drop paths (outer warm orange, middle yellow,
 * inner white) each with a slightly different flicker phase. A pair of embers
 * float upward and fade. Pure SVG + framer-motion, no images.
 */
export function Flame({ cx, cy, scale = 1 }: Props) {
  const w = 6 * scale
  const h = 9 * scale

  return (
    <g style={{ transform: `translate(${cx - w / 2}px, ${cy - h}px)` }}>
      {/* Glow */}
      <motion.circle
        cx={w / 2}
        cy={h * 0.65}
        r={w * 1.2}
        fill="url(#flameGlow)"
        opacity={0.45}
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${w / 2}px ${h * 0.65}px` }}
      />

      {/* Outer flame */}
      <motion.path
        d={teardrop(w, h)}
        fill="url(#flameOuter)"
        animate={{ scaleX: [1, 1.06, 0.96, 1], scaleY: [1, 0.96, 1.06, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${w / 2}px ${h}px` }}
      />

      {/* Middle flame */}
      <motion.path
        d={teardrop(w * 0.7, h * 0.78)}
        fill="url(#flameMid)"
        style={{
          transformOrigin: `${w / 2}px ${h}px`,
          transform: `translate(${(w * 0.3) / 2}px, ${h * 0.22}px)`,
        }}
        animate={{ scaleX: [1, 0.93, 1.05, 1], scaleY: [1, 1.04, 0.94, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      />

      {/* Inner core */}
      <motion.path
        d={teardrop(w * 0.4, h * 0.55)}
        fill="url(#flameCore)"
        style={{
          transformOrigin: `${w / 2}px ${h}px`,
          transform: `translate(${(w * 0.6) / 2}px, ${h * 0.45}px)`,
        }}
        animate={{ opacity: [0.85, 1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Embers */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={w / 2 + (i - 1) * w * 0.25}
          cy={-h * 0.1}
          r={0.4 * scale}
          fill="#fbbf24"
          animate={{
            cy: [-h * 0.1, -h * 0.8 - i * 2, -h * 1.4 - i * 2],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.8 + i * 0.3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </g>
  )
}

/**
 * Teardrop path: pointy at top, rounded at bottom — classic flame silhouette.
 * Origin (0,0) at top-left, flame fills width w and height h, bottom-centered.
 */
function teardrop(w: number, h: number): string {
  const cx = w / 2
  return `M ${cx} 0
          C ${cx + w * 0.45} ${h * 0.35}, ${w} ${h * 0.55}, ${w} ${h * 0.78}
          C ${w} ${h * 0.95}, ${cx + w * 0.3} ${h}, ${cx} ${h}
          C ${cx - w * 0.3} ${h}, 0 ${h * 0.95}, 0 ${h * 0.78}
          C 0 ${h * 0.55}, ${cx - w * 0.45} ${h * 0.35}, ${cx} 0 Z`
}

/**
 * Gradients referenced by Flame — emit once at the scene root so multiple
 * flames share a single <defs>.
 */
export function FlameDefs() {
  return (
    <defs>
      <radialGradient id="flameGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#ea580c" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="flameOuter" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#f97316" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="flameMid" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5" />
        <stop offset="60%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="flameCore" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
    </defs>
  )
}
