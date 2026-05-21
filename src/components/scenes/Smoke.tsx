import { motion } from 'framer-motion'

interface Props {
  cx: number
  cy: number
  scale?: number
}

/**
 * Wisps of smoke drifting upward — used after a fire is extinguished.
 * Five offset circles fade up + slightly sideways at staggered intervals.
 */
export function Smoke({ cx, cy, scale = 1 }: Props) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const offsetX = (i - 2) * 0.6 * scale
        const baseR = (1 + (i % 2)) * scale
        const delay = i * 0.7
        return (
          <motion.circle
            key={i}
            cx={cx + offsetX}
            cy={cy}
            r={baseR}
            fill="#94a3b8"
            initial={{ opacity: 0, cy }}
            animate={{
              cy: [cy, cy - 8 * scale, cy - 14 * scale],
              cx: [cx + offsetX, cx + offsetX + 1.2, cx + offsetX - 0.8],
              opacity: [0, 0.32, 0],
              r: [baseR, baseR * 1.6, baseR * 2.2],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeOut',
              delay,
            }}
          />
        )
      })}
    </g>
  )
}
